import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreSettings {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  rcNumber?: string;
  nifNumber?: string;
  nisNumber?: string;
  anpdpRef?: string;
  ecomLicense?: string;
  updatedAt?: string | Date;
}

export interface ISettingDocument extends Omit<IStoreSettings, '_id'>, Document {}

const SettingSchema = new Schema<ISettingDocument>(
  {
    storeName: { type: String, default: 'Abdou Phone Algérie', trim: true },
    phone: { type: String, default: '0669 01 48 90', trim: true },
    email: { type: String, default: 'contact@abdouphone.dz', trim: true },
    address: { type: String, default: '14 Rue Didouche Mourad, Alger Centre, Algérie', trim: true },
    rcNumber: { type: String, default: '16/00-9876543B26', trim: true },
    nifNumber: { type: String, default: '002616098765432', trim: true },
    nisNumber: { type: String, default: '0026160100489', trim: true },
    anpdpRef: { type: String, default: 'ANPDP-DEC-2026-0842', trim: true },
    ecomLicense: { type: String, default: 'ECOM-DZ-2026-00418', trim: true },
  },
  { timestamps: true }
);

const getSettingModel = (): Model<ISettingDocument> => {
  if (typeof window !== 'undefined') return {} as Model<ISettingDocument>;
  try {
    if (mongoose && typeof mongoose.model === 'function') {
      const models = mongoose.models || {};
      if (models.Setting) return models.Setting as Model<ISettingDocument>;
      return mongoose.model<ISettingDocument>('Setting', SettingSchema);
    }
  } catch (err) {
    console.warn('[Model Setting Init Warning]:', err);
  }
  return {} as Model<ISettingDocument>;
};

const Setting: Model<ISettingDocument> = getSettingModel();
export default Setting;
