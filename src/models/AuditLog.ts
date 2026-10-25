import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLogDocument extends Document {
  action: string;
  adminEmail: string;
  targetType: 'order' | 'product' | 'auth' | 'settings' | 'export' | 'promo';
  targetId?: string;
  details: string;
  ipMasked: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    action: { type: String, required: true, index: true },
    adminEmail: { type: String, required: true, index: true },
    targetType: {
      type: String,
      required: true,
      enum: ['order', 'product', 'auth', 'settings', 'export', 'promo'],
      index: true,
    },
    targetId: { type: String },
    details: { type: String, required: true },
    ipMasked: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const AuditLog: Model<IAuditLogDocument> =
  mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);

export default AuditLog;
