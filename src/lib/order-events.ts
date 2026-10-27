import { EventEmitter } from 'events';
import { IOrder } from '@/types';

declare global {
  // eslint-disable-next-line no-var
  var orderEmitter: EventEmitter | undefined;
}

const emitter: EventEmitter = (typeof globalThis !== 'undefined' && (globalThis as any).orderEmitter) || new EventEmitter();
emitter.setMaxListeners(100);

if (typeof globalThis !== 'undefined') {
  (globalThis as any).orderEmitter = emitter;
}

export function broadcastNewOrder(order: IOrder) {
  try {
    emitter.emit('new_order', order);
  } catch (err) {
    console.warn('[OrderEvents] Broadcast error:', err);
  }
}

export function subscribeToOrders(listener: (order: IOrder) => void) {
  emitter.on('new_order', listener);
  return () => {
    emitter.off('new_order', listener);
  };
}
