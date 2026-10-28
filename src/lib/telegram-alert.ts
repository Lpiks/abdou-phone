import { IOrder } from '@/types';

/**
 * Sends a real instant push notification to Abdou's smartphone via Telegram Bot.
 * Free, ultra-reliable, rings with sound & vibration in his pocket.
 */
export async function sendTelegramOrderAlert(order: IOrder): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId || token === 'your_bot_token') {
    return false;
  }

  try {
    const itemsText = order.items
      .map(
        (it) => `• ${it.title} (${it.selectedCompatibility} - ${it.selectedColor}) x${it.quantity}`
      )
      .join('\n');

    const message = [
      `🔔 *NOUVELLE COMMANDE ABDOU PHONE !*`,
      ``,
      `📋 *Réf :* \`${order.orderNumber}\``,
      `👤 *Client :* ${order.customer.fullName}`,
      `📞 *Tél :* \`${order.customer.phone}\`${order.customer.secondaryPhone ? ` / \`${order.customer.secondaryPhone}\`` : ''}`,
      `📍 *Wilaya :* ${order.customer.wilayaName} (${order.customer.commune})`,
      `🚚 *Mode :* ${order.deliveryType === 'bureau' ? 'Stop Desk' : 'Livraison Domicile'}`,
      `🏠 *Adresse :* ${order.customer.address}`,
      order.customer.notes ? `📝 *Note :* _${order.customer.notes}_` : '',
      ``,
      `📦 *Articles :*`,
      itemsText,
      ``,
      `💰 *Total à encaisser :* *${order.totalAmount.toLocaleString('fr-DZ')} DZD*`,
    ]
      .filter(Boolean)
      .join('\n');

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    return res.ok;
  } catch (err) {
    console.warn('[Telegram Alert Warning]', err);
    return false;
  }
}
