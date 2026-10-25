export type ProductCategory = 
  | 'chargeurs' 
  | 'cables' 
  | 'coques' 
  | 'protection' 
  | 'audio' 
  | 'supports'
  | 'powerbanks';

export interface IProductVariant {
  compatibility: string; // e.g. "iPhone 16 / 15 Series", "Samsung S24 Ultra", "Universel USB-C"
  color: string;         // e.g. "Noir Titane", "Blanc Pur", "Gris Sidéral"
  colorHex?: string;     // e.g. "#111111", "#F8FAFC"
  stock: number;
  sku?: string;
  image?: string;
}

export interface IProduct {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  category: ProductCategory;
  price: number; // in DZD
  compareAtPrice?: number;
  costPrice?: number;
  images: string[];
  brand: string; // e.g. "Abdou Phone", "Anker", "Baseus", "Apple", "Samsung"
  wattage?: string; // e.g. "65W GaN", "20W PD", "100W"
  connector?: string; // e.g. "Type-C vers Type-C", "MagSafe", "Lightning"
  warranty?: string; // e.g. "Garantie 6 Mois Échange Express"
  features?: string[];
  badges?: string[]; // e.g. "Nouveau", "Best-Seller", "Promo", "GaN Tech"
  variants: IProductVariant[];
  isFeatured?: boolean;
  isActive: boolean;
  tags?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type OrderStatus = 
  | 'en_attente'     // Order registered, waiting for customer phone call
  | 'confirme'       // Confirmed with customer
  | 'en_preparation' // Packaging and testing in shop
  | 'expedie'        // Handed to express courier
  | 'livre'          // Delivered & COD collected in cash
  | 'annule'         // Customer cancelled
  | 'retourne';      // Returned

export type DeliveryType = 'domicile' | 'bureau'; // Home delivery or Stop Desk

export interface IOrderItem {
  productId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  selectedCompatibility: string;
  selectedColor: string;
}

export interface IOrder {
  _id?: string;
  orderNumber: string; // e.g. "ABD-2026-0042"
  customer: {
    fullName: string;
    phone: string;
    secondaryPhone?: string;
    wilayaId: number;
    wilayaName: string;
    commune: string;
    address: string;
    notes?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryType: DeliveryType;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  trackingNumber?: string;
  adminNotes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IWilaya {
  id: number;
  code: string;
  name: string;
  arabicName: string;
  homeDeliveryFee: number;
  deskDeliveryFee: number;
  communes: string[];
}

export interface IPromoCode {
  _id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 10 for 10%) or fixed DZD (e.g. 500)
  minOrderAmount?: number;
  maxUsage?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  createdAt?: string;
}

export interface IStoreSettings {
  storeName: string;
  commercialName: string;
  legalEntity: string;
  rcNumber: string; // Registre de Commerce
  nifNumber: string; // Numéro d'Identification Fiscale
  nisNumber: string; // Numéro d'Identification Statistique
  anpdpRegNumber: string; // Déclaration ANPDP Loi 18-07
  ecomPlatformId: string; // Agrément E-commerce Loi 18-05
  phoneSupport: string;
  emailSupport: string;
  addressShop: string;
  wilayaShop: string;
  defaultHomeFee: number;
  defaultDeskFee: number;
}
