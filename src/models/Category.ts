import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategoryItem {
  id: string;
  name: string;
  arabicName?: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface ICategoryDocument extends Omit<ICategoryItem, 'id'>, Document {
  id: string;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    id: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    arabicName: { type: String, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true, default: 'Package' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const getCategoryModel = (): Model<ICategoryDocument> => {
  if (typeof window !== 'undefined') return {} as Model<ICategoryDocument>;
  try {
    if (mongoose && typeof mongoose.model === 'function') {
      const models = mongoose.models || {};
      if (models.Category) return models.Category as Model<ICategoryDocument>;
      return mongoose.model<ICategoryDocument>('Category', CategorySchema);
    }
  } catch (err) {
    console.warn('[Model Category Init Warning]:', err);
  }
  return {} as Model<ICategoryDocument>;
};

const Category: Model<ICategoryDocument> = getCategoryModel();
export default Category;
