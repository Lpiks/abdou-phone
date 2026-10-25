import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminUserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'superadmin' | 'manager';
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, default: 'Abdou Phone Admin' },
    role: { type: String, enum: ['superadmin', 'manager'], default: 'superadmin' },
  },
  { timestamps: true }
);

const getAdminUserModel = (): Model<IAdminUserDocument> => {
  if (typeof window !== 'undefined') {
    return {} as Model<IAdminUserDocument>;
  }
  try {
    if (mongoose && typeof mongoose.model === 'function') {
      const models = mongoose.models || {};
      if (models.AdminUser) {
        return models.AdminUser as Model<IAdminUserDocument>;
      }
      return mongoose.model<IAdminUserDocument>('AdminUser', AdminUserSchema);
    }
  } catch (err) {
    console.warn('[Model AdminUser Init Warning]:', err);
  }
  return {} as Model<IAdminUserDocument>;
};

const AdminUser: Model<IAdminUserDocument> = getAdminUserModel();

export default AdminUser;
