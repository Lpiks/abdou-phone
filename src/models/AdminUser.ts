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

const AdminUser: Model<IAdminUserDocument> =
  mongoose.models.AdminUser || mongoose.model<IAdminUserDocument>('AdminUser', AdminUserSchema);

export default AdminUser;
