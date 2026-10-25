import { IOrder, IProduct, OrderStatus, DeliveryType } from '@/types';
import { INITIAL_PHONE_PRODUCTS } from '@/data/mock-products';
import { INITIAL_MOCK_ORDERS } from '@/data/mock-orders';
import { connectDB } from './db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import {
  ORDER_STATUS_DETAILS,
  ISafeTrackingItem,
  ISafeTrackingOrder,
} from '@/data/order-status';

export { ORDER_STATUS_DETAILS };
export type { ISafeTrackingItem, ISafeTrackingOrder };

// Global in-memory fallback stores
declare global {
  // eslint-disable-next-line no-var
  var memoryOrders: IOrder[] | undefined;
  // eslint-disable-next-line no-var
  var memoryProducts: IProduct[] | undefined;
}

let inMemoryOrders: IOrder[] = global.memoryOrders || [...INITIAL_MOCK_ORDERS];
let inMemoryProducts: IProduct[] = global.memoryProducts || [...INITIAL_PHONE_PRODUCTS];

if (!global.memoryOrders) global.memoryOrders = inMemoryOrders;
if (!global.memoryProducts) global.memoryProducts = inMemoryProducts;

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
    try {
      const newDoc = await Order.create({
        ...orderData,
        orderNumber,
        status: 'en_attente',
      });
      return JSON.parse(JSON.stringify(newDoc));
    } catch (err) {
      console.warn('[Store] Mongo create failed, using memory store:', err);
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
    inMemoryOrders[idx].status = status;
    if (adminNotes !== undefined) inMemoryOrders[idx].adminNotes = adminNotes;
    inMemoryOrders[idx].updatedAt = new Date().toISOString();
    return inMemoryOrders[idx];
  }
  return null;
}

export async function listAllProducts(category?: string): Promise<IProduct[]> {
  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const filter: Record<string, unknown> = { isActive: true };
      if (category && category !== 'all') filter.category = category;
      const docs = await Product.find(filter).sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) return JSON.parse(JSON.stringify(docs));
    } catch (err) {
      console.warn('[Store] Mongo list products failed:', err);
    }
  }

  let list = inMemoryProducts.filter((p) => p.isActive);
  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }
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
