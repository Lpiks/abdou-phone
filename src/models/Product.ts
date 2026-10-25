import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct, IProductVariant } from '@/types';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const VariantSchema = new Schema<IProductVariant>(
  {
    compatibility: { type: String, required: true },
    color: { type: String, required: true },
    colorHex: { type: String, default: '#111111' },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String },
    image: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['chargeurs', 'cables', 'coques', 'protection', 'audio', 'supports', 'powerbanks'],
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    images: [{ type: String, required: true }],
    brand: { type: String, required: true, trim: true, default: 'Abdou Phone' },
    wattage: { type: String, trim: true },
    connector: { type: String, trim: true },
    warranty: { type: String, trim: true, default: 'Garantie 6 Mois Échange Express' },
    features: [{ type: String, trim: true }],
    badges: [{ type: String, trim: true }],
    variants: [VariantSchema],
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

const getProductModel = (): Model<IProductDocument> => {
  if (typeof window !== 'undefined') {
    return {} as Model<IProductDocument>;
  }
  try {
    if (mongoose && typeof mongoose.model === 'function') {
      const models = mongoose.models || {};
      if (models.Product) {
        return models.Product as Model<IProductDocument>;
      }
      return mongoose.model<IProductDocument>('Product', ProductSchema);
    }
  } catch (err) {
    console.warn('[Model Product Init Warning]:', err);
  }
  return {} as Model<IProductDocument>;
};

const Product: Model<IProductDocument> = getProductModel();

export default Product;
