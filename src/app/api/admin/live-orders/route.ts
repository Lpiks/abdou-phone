import { NextRequest } from 'next/server';
import { subscribeToOrders } from '@/lib/order-events';
import { verifyToken } from '@/lib/auth';
import { IOrder } from '@/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('abdou_admin_token')?.value;
  if (!token && process.env.NODE_ENV === 'production') {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Initial connection greeting
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: 'connected', time: Date.now() })}\n\n`)
      );

      // Subscribe to instant order broadcaster
      const unsubscribe = subscribeToOrders((newOrder: IOrder) => {
        try {
          const payload = JSON.stringify(newOrder);
          controller.enqueue(encoder.encode(`event: new_order\ndata: ${payload}\n\n`));
        } catch (err) {
          console.warn('[SSE] Enqueue error:', err);
        }
      });

      // Keepalive heartbeat every 20 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(pingInterval);
        }
      }, 20000);

      req.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        unsubscribe();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
