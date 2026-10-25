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

const getAuditLogModel = (): Model<IAuditLogDocument> => {
  if (typeof window !== 'undefined') {
    return {} as Model<IAuditLogDocument>;
  }
  try {
    if (mongoose && typeof mongoose.model === 'function') {
      const models = mongoose.models || {};
      if (models.AuditLog) {
        return models.AuditLog as Model<IAuditLogDocument>;
      }
      return mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
    }
  } catch (err) {
    console.warn('[Model AuditLog Init Warning]:', err);
  }
  return {} as Model<IAuditLogDocument>;
};

const AuditLog: Model<IAuditLogDocument> = getAuditLogModel();

export default AuditLog;
