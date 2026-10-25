import { OrderStatus, DeliveryType } from '@/types';

export interface ISafeTrackingItem {
  productId?: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  selectedCompatibility: string;
  selectedColor: string;
}

export interface ISafeTrackingOrder {
  orderNumber: string;
  status: OrderStatus;
  statusLabel: string;
  statusDescription: string;
  statusStep: number; // 1 to 5 for UI timeline
  createdAt: string | Date;
  updatedAt?: string | Date;
  deliveryType: DeliveryType;
  wilayaName: string;
  commune: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  trackingNumber?: string;
  items: ISafeTrackingItem[];
  customerSummary: {
    fullName: string;
    phoneMasked: string;
  };
}

export const ORDER_STATUS_DETAILS: Record<
  OrderStatus,
  { label: string; description: string; step: number }
> = {
  en_attente: {
    label: 'En attente de confirmation',
    description:
      'Votre commande a bien été reçue. Notre équipe vous contactera sous peu par téléphone pour confirmer votre commande.',
    step: 1,
  },
  confirme: {
    label: 'Confirmée par téléphone',
    description:
      'Votre commande a été confirmée avec succès. Elle est transmise à notre atelier pour préparation et test des accessoires.',
    step: 2,
  },
  en_preparation: {
    label: 'En cours de préparation',
    description:
      'Vos accessoires sont soigneusement emballés dans un conditionnement antichoc sécurisé.',
    step: 3,
  },
  expedie: {
    label: 'Expédiée',
    description:
      'Votre colis a été remis au service de livraison express. La livraison est en cours d\'acheminement vers votre wilaya.',
    step: 4,
  },
  livre: {
    label: 'Livrée & Encaissée',
    description:
      'Votre colis a été remis à destination et le règlement en espèces a été effectué à la livraison. Merci pour votre confiance !',
    step: 5,
  },
  annule: {
    label: 'Commande Annulée',
    description:
      'Cette commande a été annulée suite à votre demande ou lors de l\'appel de confirmation.',
    step: 0,
  },
  retourne: {
    label: 'Colis Retourné',
    description:
      'Le colis n\'a pas pu être remis au destinataire et a été retourné au stock.',
    step: 0,
  },
};
