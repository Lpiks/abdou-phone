import { IOrder, IProduct, OrderStatus, DeliveryType } from '@/types';
import { INITIAL_PHONE_PRODUCTS } from '@/data/mock-products';
import { INITIAL_MOCK_ORDERS } from '@/data/mock-orders';
import { connectDB } from './db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Category, { ICategoryItem } from '@/models/Category';
import { broadcastNewOrder } from './order-events';
import {
  ORDER_STATUS_DETAILS,
  ISafeTrackingItem,
  ISafeTrackingOrder,
} from '@/data/order-status';

export { ORDER_STATUS_DETAILS };
export type { ISafeTrackingItem, ISafeTrackingOrder };

// -------------------------------------------------------------
// High-Speed In-Memory RAM Cache (Sub-10ms response)
// -------------------------------------------------------------
interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

const productsRamCache = new Map<string, CacheEntry<IProduct[]>>();
let categoriesRamCache: CacheEntry<ICategoryItem[]> | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60s auto-refresh, invalidated on write

export function invalidateCatalogCache() {
  productsRamCache.clear();
  categoriesRamCache = null;
}

export const DEFAULT_CATEGORIES: ICategoryItem[] = [
  { id: 'chargeurs', name: 'Chargeurs GaN', arabicName: 'شواحن GaN السريعة', description: '20W à 65W Ultra-rapide', icon: 'Zap', order: 1 },
  { id: 'cables', name: 'Câbles 100W', arabicName: 'كوابل مدرعة 100 واط', description: '100W PD & Nylon Tressé', icon: 'Cpu', order: 2 },
  { id: 'coques', name: 'Coques & MagSafe', arabicName: 'أغلفة MagSafe المقاومة', description: 'Grade Militaire Antichoc', icon: 'Smartphone', order: 3 },
  { id: 'protection', name: 'Verres 9H & Privacy', arabicName: 'زجاج حماية 9H وخصوصية', description: 'Anti-espion & Saphir', icon: 'ShieldCheck', order: 4 },
  { id: 'powerbanks', name: 'Batteries Externes', arabicName: 'بنوك طاقة متنقلة', description: '10K & 20K mAh Turbo', icon: 'BatteryCharging', order: 5 },
  { id: 'audio', name: 'Audio & Écouteurs', arabicName: 'سماعات وصوتيات احترافية', description: 'ANC Réduction de Bruit', icon: 'Headphones', order: 6 },
  { id: 'supports', name: 'Supports & Docks', arabicName: 'حوامل الهواتف للسيارة والمكتب', description: 'Magnétique Voiture & Bureau', icon: 'Boxes', order: 7 },
];

// Global in-memory fallback stores
declare global {
  // eslint-disable-next-line no-var
  var memoryOrders: IOrder[] | undefined;
  // eslint-disable-next-line no-var
  var memoryProducts: IProduct[] | undefined;
  // eslint-disable-next-line no-var
  var memoryCategories: ICategoryItem[] | undefined;
}

let inMemoryOrders: IOrder[] =
  (typeof globalThis !== 'undefined' && (globalThis as any).memoryOrders) || [...INITIAL_MOCK_ORDERS];
let inMemoryProducts: IProduct[] =
  (typeof globalThis !== 'undefined' && (globalThis as any).memoryProducts) || [...INITIAL_PHONE_PRODUCTS];
let inMemoryCategories: ICategoryItem[] =
  (typeof globalThis !== 'undefined' && (globalThis as any).memoryCategories) || [...DEFAULT_CATEGORIES];

if (typeof globalThis !== 'undefined') {
  if (!(globalThis as any).memoryOrders) (globalThis as any).memoryOrders = inMemoryOrders;
  if (!(globalThis as any).memoryProducts) (globalThis as any).memoryProducts = inMemoryProducts;
  if (!(globalThis as any).memoryCategories) (globalThis as any).memoryCategories = inMemoryCategories;
}

/**
 * Generate unique order number: ABD-YYYY-XXXX
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ABD-${year}-${randomPart}`;
}

export async function createOrder(orderData: Omit<IOrder, '_id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<IOrder> {
  const orderNumber = generateOrderNumber();
  const mongooseInstance = await connectDB();

  if (mongooseInstance) {
    // 1. Atomic Concurrency Lock: Check stock and decrement atomically
    const reservedItems: { slug: string; color: string; qty: number }[] = [];

    for (const item of orderData.items) {
      const qty = Math.max(1, item.quantity || 1);
      const color = item.selectedColor || '';

      // Atomic conditional update in MongoDB
      let res = await Product.updateOne(
        {
          slug: item.slug,
          variants: {
            $elemMatch: {
              color,
              stock: { $gte: qty },
            },
          },
        },
        {
          $inc: { 'variants.$.stock': -qty },
        }
      );

      // If exact color match didn't find variant with stock, try first variant with enough stock
      if (res.matchedCount === 0 || res.modifiedCount === 0) {
        res = await Product.updateOne(
          {
            slug: item.slug,
            'variants.stock': { $gte: qty },
          },
          {
            $inc: { 'variants.0.stock': -qty },
          }
        );
      }

      // If still 0, stock is exhausted! Rollback any reserved items and reject gracefully
      if (res.matchedCount === 0 || res.modifiedCount === 0) {
        for (const reserved of reservedItems) {
          await Product.updateOne(
            { slug: reserved.slug, 'variants.color': reserved.color },
            { $inc: { 'variants.$.stock': reserved.qty } }
          );
        }
        throw new Error(
          `Désolé, l'article "${item.title}" (${item.selectedColor || 'Standard'}) vient d'être épuisé par une autre commande instantanée !`
        );
      }

      reservedItems.push({ slug: item.slug, color, qty });
    }

    try {
      const newDoc = await Order.create({
        ...orderData,
        orderNumber,
        status: 'en_attente',
      });
      const parsedOrder: IOrder = JSON.parse(JSON.stringify(newDoc));
      invalidateCatalogCache();
      broadcastNewOrder(parsedOrder);
      return parsedOrder;
    } catch (err) {
      console.warn('[Store] Mongo create failed, using memory store:', err);
    }
  }

  // In-Memory Fallback Check
  for (const item of orderData.items) {
    const qty = Math.max(1, item.quantity || 1);
    const prod = inMemoryProducts.find((p) => p.slug === item.slug);
    if (prod && prod.variants) {
      const v = prod.variants.find((vr) => vr.color === item.selectedColor) || prod.variants[0];
      if (v) {
        if (v.stock < qty) {
          throw new Error(`Désolé, l'article "${item.title}" vient d'être épuisé en stock !`);
        }
        v.stock -= qty;
      }
    }
  }

  const newOrder: IOrder = {
    ...orderData,
    _id: `mem_${Date.now()}`,
    orderNumber,
    status: 'en_attente',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  inMemoryOrders.unshift(newOrder);
  invalidateCatalogCache();
  broadcastNewOrder(newOrder);
  return newOrder;
}

export async function getOrderByNumber(orderNumber: string): Promise<IOrder | null> {
  const cleanNumber = orderNumber.trim().toUpperCase();
  const mongooseInstance = await connectDB();

  if (mongooseInstance) {
    try {
      const doc = await Order.findOne({ orderNumber: cleanNumber }).lean();
      if (doc) return JSON.parse(JSON.stringify(doc));
    } catch (err) {
      console.warn('[Store] Mongo query failed, falling back to memory:', err);
    }
  }

  const found = inMemoryOrders.find((o) => o.orderNumber.toUpperCase() === cleanNumber);
  return found || null;
}

export async function getSafeTrackingOrderByNumberOrPhone(query: string): Promise<ISafeTrackingOrder | null> {
  const q = query.trim().toUpperCase();
  const cleanPhone = query.trim().replace(/\s+/g, '');
  const mongooseInstance = await connectDB();

  let order: IOrder | null = null;

  if (mongooseInstance) {
    try {
      const doc = await Order.findOne({
        $or: [
          { orderNumber: q },
          { 'customer.phone': cleanPhone },
        ],
      })
        .sort({ createdAt: -1 })
        .lean();
      if (doc) order = JSON.parse(JSON.stringify(doc));
    } catch (err) {
      console.warn('[Store] Mongo tracking query failed:', err);
    }
  }

  if (!order) {
    order = inMemoryOrders.find(
      (o) => o.orderNumber.toUpperCase() === q || o.customer.phone.replace(/\s+/g, '') === cleanPhone
    ) || null;
  }

  if (!order) return null;

  const statusConfig = ORDER_STATUS_DETAILS[order.status] || ORDER_STATUS_DETAILS.en_attente;
  const rawPhone = order.customer.phone || '';
  const maskedPhone = rawPhone.length > 4 ? rawPhone.slice(0, 3) + ' ••• •• ' + rawPhone.slice(-2) : rawPhone;

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    statusLabel: statusConfig.label,
    statusDescription: statusConfig.description,
    statusStep: statusConfig.step,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt,
    deliveryType: order.deliveryType,
    wilayaName: order.customer.wilayaName,
    commune: order.customer.commune,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    totalAmount: order.totalAmount,
    trackingNumber: order.trackingNumber,
    items: order.items.map((it) => ({
      productId: it.productId,
      title: it.title,
      slug: it.slug,
      image: it.image,
      price: it.price,
      quantity: it.quantity,
      selectedCompatibility: it.selectedCompatibility,
      selectedColor: it.selectedColor,
    })),
    customerSummary: {
      fullName: order.customer.fullName,
      phoneMasked: maskedPhone,
    },
  };
}

export async function listAllOrders(limit: number = 100): Promise<IOrder[]> {
  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const count = await Order.countDocuments();
      if (count === 0 && INITIAL_MOCK_ORDERS.length > 0) {
        const sanitized = INITIAL_MOCK_ORDERS.map(({ _id, ...rest }) => rest);
        await Order.insertMany(sanitized);
      }
      const docs = await Order.find().sort({ createdAt: -1 }).limit(limit).lean();
      return JSON.parse(JSON.stringify(docs));
    } catch (err) {
      console.warn('[Store] Mongo list orders failed:', err);
    }
  }
  return inMemoryOrders.slice(0, limit);
}

export async function updateOrderStatus(orderNumber: string, status: OrderStatus, adminNotes?: string): Promise<IOrder | null> {
  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      // If order is cancelled or returned, replenish stock if it was not already cancelled/returned
      if (status === 'annule' || status === 'retourne') {
        const existing = await Order.findOne({ orderNumber }).lean();
        if (existing && existing.status !== 'annule' && existing.status !== 'retourne') {
          for (const it of existing.items) {
            const qty = Math.max(1, it.quantity || 1);
            await Product.updateOne(
              { slug: it.slug, 'variants.color': it.selectedColor },
              { $inc: { 'variants.$.stock': qty } }
            );
          }
        }
      }

      const updateData: Record<string, unknown> = { status, updatedAt: new Date() };
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      const updated = await Order.findOneAndUpdate(
        { orderNumber },
        { $set: updateData },
        { new: true }
      ).lean();
      if (updated) return JSON.parse(JSON.stringify(updated));
    } catch (err) {
      console.warn('[Store] Mongo update order status failed:', err);
    }
  }

  const idx = inMemoryOrders.findIndex((o) => o.orderNumber === orderNumber);
  if (idx !== -1) {
    // In-memory stock restoration
    if ((status === 'annule' || status === 'retourne') && inMemoryOrders[idx].status !== 'annule' && inMemoryOrders[idx].status !== 'retourne') {
      for (const it of inMemoryOrders[idx].items) {
        const prod = inMemoryProducts.find((p) => p.slug === it.slug);
        if (prod && prod.variants) {
          const v = prod.variants.find((vr) => vr.color === it.selectedColor) || prod.variants[0];
          if (v) v.stock += Math.max(1, it.quantity || 1);
        }
      }
    }

    inMemoryOrders[idx].status = status;
    if (adminNotes !== undefined) inMemoryOrders[idx].adminNotes = adminNotes;
    inMemoryOrders[idx].updatedAt = new Date().toISOString();
    return inMemoryOrders[idx];
  }
  return null;
}

export async function listAllProducts(category?: string): Promise<IProduct[]> {
  const cacheKey = category && category !== 'all' ? category : 'all';
  const cached = productsRamCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const totalCount = await Product.countDocuments();
      if (totalCount === 0 && INITIAL_PHONE_PRODUCTS.length > 0) {
        const sanitized = INITIAL_PHONE_PRODUCTS.map(({ _id, ...rest }) => rest);
        await Product.insertMany(sanitized);
      }
      const filter: Record<string, unknown> = { isActive: true };
      if (category && category !== 'all') filter.category = category;
      const docs = await Product.find(filter).sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        const cleanList = JSON.parse(JSON.stringify(docs));
        productsRamCache.set(cacheKey, { data: cleanList, cachedAt: Date.now() });
        return cleanList;
      }
    } catch (err) {
      console.warn('[Store] Mongo list products failed:', err);
    }
  }

  let list = inMemoryProducts.filter((p) => p.isActive);
  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }
  productsRamCache.set(cacheKey, { data: list, cachedAt: Date.now() });
  return list;
}

export async function getProductBySlug(slug: string): Promise<IProduct | null> {
  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const doc = await Product.findOne({ slug, isActive: true }).lean();
      if (doc) return JSON.parse(JSON.stringify(doc));
    } catch (err) {
      console.warn('[Store] Mongo getProductBySlug failed:', err);
    }
  }
  return inMemoryProducts.find((p) => p.slug === slug && p.isActive) || null;
}

export async function updateProductVariantStock(slug: string, variantIndex: number, newStock: number): Promise<boolean> {
  invalidateCatalogCache();
  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const prod = await Product.findOne({ slug });
      if (prod && prod.variants && prod.variants[variantIndex]) {
        prod.variants[variantIndex].stock = Math.max(0, newStock);
        await prod.save();
        return true;
      }
    } catch (err) {
      console.warn('[Store] Mongo updateProductVariantStock failed:', err);
    }
  }

  const found = inMemoryProducts.find((p) => p.slug === slug);
  if (found && found.variants && found.variants[variantIndex]) {
    found.variants[variantIndex].stock = Math.max(0, newStock);
    return true;
  }
  return false;
}

export function generateProductSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${base}-${Math.floor(100 + Math.random() * 900)}`;
}

export async function createProduct(productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
  invalidateCatalogCache();
  const slug = productData.slug || generateProductSlug(productData.title);
  const fullProduct: IProduct = {
    ...productData,
    slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const doc = await Product.create(fullProduct);
      return JSON.parse(JSON.stringify(doc));
    } catch (err) {
      console.warn('[Store] Mongo createProduct failed, saving to memory:', err);
    }
  }

  inMemoryProducts.unshift(fullProduct);
  return fullProduct;
}

export async function updateProduct(
  slug: string,
  updates: Partial<Omit<IProduct, '_id' | 'slug' | 'createdAt'>>
): Promise<IProduct | null> {
  invalidateCatalogCache();
  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const updated = await Product.findOneAndUpdate(
        { slug },
        { $set: { ...updates, updatedAt: new Date().toISOString() } },
        { new: true }
      ).lean();
      if (updated) return JSON.parse(JSON.stringify(updated));
    } catch (err) {
      console.warn('[Store] Mongo updateProduct failed:', err);
    }
  }

  const idx = inMemoryProducts.findIndex((p) => p.slug === slug);
  if (idx !== -1) {
    inMemoryProducts[idx] = {
      ...inMemoryProducts[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryProducts[idx];
  }
  return null;
}

export async function deleteProduct(slug: string, hardDelete: boolean = true): Promise<boolean> {
  invalidateCatalogCache();
  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      if (hardDelete) {
        await Product.deleteOne({ slug });
      } else {
        await Product.findOneAndUpdate({ slug }, { $set: { isActive: false, updatedAt: new Date().toISOString() } });
      }
      return true;
    } catch (err) {
      console.warn('[Store] Mongo deleteProduct failed:', err);
    }
  }

  const idx = inMemoryProducts.findIndex((p) => p.slug === slug);
  if (idx !== -1) {
    if (hardDelete) {
      inMemoryProducts.splice(idx, 1);
    } else {
      inMemoryProducts[idx].isActive = false;
    }
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// Category Dynamic Store
// -------------------------------------------------------------
export async function listAllCategories(): Promise<ICategoryItem[]> {
  if (categoriesRamCache && Date.now() - categoriesRamCache.cachedAt < CACHE_TTL_MS) {
    return categoriesRamCache.data;
  }

  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const count = await Category.countDocuments();
      if (count === 0 && DEFAULT_CATEGORIES.length > 0) {
        await Category.insertMany(DEFAULT_CATEGORIES);
      }
      const docs = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
      if (docs && docs.length > 0) {
        const cleanCats = JSON.parse(JSON.stringify(docs));
        categoriesRamCache = { data: cleanCats, cachedAt: Date.now() };
        return cleanCats;
      }
    } catch (err) {
      console.warn('[Store] Mongo list categories failed:', err);
    }
  }

  categoriesRamCache = { data: inMemoryCategories, cachedAt: Date.now() };
  return inMemoryCategories;
}

export async function createCategory(cat: {
  id: string;
  name: string;
  arabicName?: string;
  description?: string;
  icon?: string;
}): Promise<ICategoryItem> {
  categoriesRamCache = null;
  const cleanId = (cat.id || cat.name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newCat: ICategoryItem = {
    id: cleanId,
    name: cat.name.trim(),
    arabicName: cat.arabicName?.trim() || undefined,
    description: cat.description?.trim() || undefined,
    icon: cat.icon?.trim() || 'Package',
    order: Date.now(),
  };

  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const doc = await Category.create(newCat);
      return JSON.parse(JSON.stringify(doc));
    } catch (err) {
      console.warn('[Store] Mongo createCategory failed:', err);
    }
  }

  inMemoryCategories.push(newCat);
  return newCat;
}

export async function updateCategory(
  id: string,
  updates: Partial<ICategoryItem>
): Promise<ICategoryItem | null> {
  categoriesRamCache = null;
  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const updated = await Category.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
      if (updated) return JSON.parse(JSON.stringify(updated));
    } catch (err) {
      console.warn('[Store] Mongo updateCategory failed:', err);
    }
  }

  const idx = inMemoryCategories.findIndex((c) => c.id === id);
  if (idx !== -1) {
    inMemoryCategories[idx] = { ...inMemoryCategories[idx], ...updates };
    return inMemoryCategories[idx];
  }
  return null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  categoriesRamCache = null;
  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      await Category.deleteOne({ id });
      return true;
    } catch (err) {
      console.warn('[Store] Mongo deleteCategory failed:', err);
    }
  }

  const idx = inMemoryCategories.findIndex((c) => c.id === id);
  if (idx !== -1) {
    inMemoryCategories.splice(idx, 1);
    return true;
  }
  return false;
}
