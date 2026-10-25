import mongoose, { Schema, Document, Model } from 'mongoose';
import { IOrder, IOrderItem } from '@/types';

export interface IOrderDocument extends Omit<IOrder, '_id'>, Document {}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedCompatibility: { type: String, required: true },
    selectedColor: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true, index: true },
      secondaryPhone: { type: String, trim: true },
      wilayaId: { type: Number, required: true },
      wilayaName: { type: String, required: true },
      commune: { type: String, required: true },
      address: { type: String, required: true },
      notes: { type: String },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryType: { type: String, enum: ['domicile', 'bureau'], default: 'domicile' },
    deliveryFee: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['en_attente', 'confirme', 'en_preparation', 'expedie', 'livre', 'annule', 'retourne'],
      default: 'en_attente',
      index: true,
    },
    trackingNumber: { type: String },
    adminNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

const getOrderModel = (): Model<IOrderDocument> => {
  if (typeof window !== 'undefined') {
    return {} as Model<IOrderDocument>;
  }
  try {
    if (mongoose && typeof mongoose.model === 'function') {
      const models = mongoose.models || {};
      if (models.Order) {
        return models.Order as Model<IOrderDocument>;
      }
      return mongoose.model<IOrderDocument>('Order', OrderSchema);
    }
  } catch (err) {
    console.warn('[Model Order Init Warning]:', err);
  }
  return {} as Model<IOrderDocument>;
};

const Order: Model<IOrderDocument> = getOrderModel();

export default Order;
