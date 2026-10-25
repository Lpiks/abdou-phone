export type Language = 'fr' | 'ar' | 'en';

export interface Translations {
  // Navigation & Brand
  navHome: string;
  navCatalog: string;
  navChargers: string;
  navCases: string;
  navPowerbanks: string;
  navTrackOrder: string;
  navSearch: string;
  navCart: string;

  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroCtaCatalog: string;
  heroCtaTrack: string;
  statWilayas: string;
  statWarranty: string;
  statCod: string;
  statFast: string;

  // Categories
  categoriesTitle: string;
  categoriesSubtitle: string;
  catAll: string;
  catChargers: string;
  catCables: string;
  catCases: string;
  catProtection: string;
  catPowerbanks: string;
  catAudio: string;
  catMounts: string;

  // Product Card & Details
  inStock: string;
  expressOrder: string;
  addToCart: string;
  addedToCart: string;
  viewDetails: string;
  priceDzd: string;
  selectModel: string;
  quantity: string;
  specsTitle: string;
  brand: string;
  warrantyBadge: string;
  featuresTitle: string;

  // Cart & Checkout
  cartTitle: string;
  cartEmpty: string;
  subtotal: string;
  deliveryFee: string;
  totalCod: string;
  checkoutBtn: string;
  checkoutTitle: string;
  checkoutSubtitle: string;
  customerInfo: string;
  fullName: string;
  phone: string;
  secondaryPhone: string;
  wilaya: string;
  commune: string;
  address: string;
  notes: string;
  homeDelivery: string;
  stopDesk: string;
  confirmOrderBtn: string;
  codNotice: string;

  // Tracking
  trackingTitle: string;
  trackingSubtitle: string;
  trackingInputPlaceholder: string;
  trackingSearchBtn: string;
  stepPending: string;
  stepConfirmed: string;
  stepPreparing: string;
  stepShipped: string;
  stepDelivered: string;

  // Footer & Legal
  footerDesc: string;
  footerRights: string;
  footerPrivacy: string;
  footerTerms: string;
  footerLegalNotice: string;
  guaranteeWilayas: string;
  guaranteeCod: string;
  guaranteeWarranty: string;
  guaranteeSupport: string;

  // Admin Navigation
  adminNavDashboard: string;
  adminNavOrders: string;
  adminNavProducts: string;
  adminNavStocks: string;
  adminNavStats: string;
  adminNavPromos: string;
  adminNavRecovery: string;
  adminNavLogs: string;
  adminNavSettings: string;
  adminNavViewStore: string;
  adminNavLogout: string;
  adminNavRole: string;

  // Admin Dashboard
  adminDashTitle: string;
  adminDashSubtitle: string;
  adminDashTotalOrders: string;
  adminDashPendingCall: string;
  adminDashRevenue: string;
  adminDashActiveProducts: string;
  adminDashRecentOrders: string;
  adminDashQuickActions: string;
  adminDashViewAllOrders: string;

  // Admin Orders
  adminOrdersTitle: string;
  adminOrdersSubtitle: string;
  adminOrdersSearch: string;
  adminOrdersStatusFilter: string;
  adminOrdersAllStatuses: string;
  adminOrdersStatusPending: string;
  adminOrdersStatusConfirmed: string;
  adminOrdersStatusPreparing: string;
  adminOrdersStatusShipped: string;
  adminOrdersStatusDelivered: string;
  adminOrdersStatusCancelled: string;
  adminOrdersStatusReturned: string;
  adminOrdersCustomer: string;
  adminOrdersWilaya: string;
  adminOrdersTotal: string;
  adminOrdersDate: string;
  adminOrdersStatus: string;
  adminOrdersActions: string;
  adminOrdersExport: string;
  adminOrdersModalTitle: string;
  adminOrdersModalClose: string;
  adminOrdersChangeStatus: string;

  // Admin Stocks
  adminStocksTitle: string;
  adminStocksSubtitle: string;
  adminStocksSearch: string;
  adminStocksCriticalCount: string;
  adminStocksTotalUnits: string;
  adminStocksProduct: string;
  adminStocksCategory: string;
  adminStocksVariant: string;
  adminStocksUnits: string;
  adminStocksAction: string;
  adminStocksSave: string;

  // Admin Stats
  adminStatsTitle: string;
  adminStatsSubtitle: string;
  adminStatsToday: string;
  adminStats7Days: string;
  adminStats30Days: string;
  adminStatsAllTime: string;
  adminStatsTotalSales: string;
  adminStatsAvgOrder: string;
  adminStatsTopWilayas: string;
  adminStatsTopProducts: string;
  adminStatsDeliveryTypeSplit: string;

  // Admin Promos
  adminPromosTitle: string;
  adminPromosSubtitle: string;
  adminPromosNewBtn: string;
  adminPromosCode: string;
  adminPromosDiscount: string;
  adminPromosMinCart: string;
  adminPromosExpiry: string;
  adminPromosUsage: string;
  adminPromosStatus: string;
  adminPromosCreateModal: string;
  adminPromosSave: string;
  adminPromosCancel: string;

  // Admin Recovery
  adminRecoveryTitle: string;
  adminRecoverySubtitle: string;
  adminRecoveryCallNow: string;
  adminRecoverySmsScript: string;
  adminRecoveryMarkConfirmed: string;
  adminRecoveryPendingBadge: string;

  // Admin Logs
  adminLogsTitle: string;
  adminLogsSubtitle: string;
  adminLogsLawNotice: string;
  adminLogsExport: string;
  adminLogsTimestamp: string;
  adminLogsAdmin: string;
  adminLogsAction: string;
  adminLogsTarget: string;
  adminLogsDetails: string;
  adminLogsIp: string;

  // Admin Settings
  adminSettingsTitle: string;
  adminSettingsSubtitle: string;
  adminSettingsLegalTab: string;
  adminSettingsDeliveryTab: string;
  adminSettingsSaveBtn: string;
  adminSettingsRc: string;
  adminSettingsNif: string;
  adminSettingsNis: string;
  adminSettingsAnpdp: string;
  adminSettingsEcom: string;
  adminSettingsSavedNotice: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  fr: {
    navHome: 'Accueil',
    navCatalog: 'Boutique',
    navChargers: 'Chargeurs GaN',
    navCases: 'Coques & Protection',
    navPowerbanks: 'Powerbanks',
    navTrackOrder: 'Suivre mon colis',
    navSearch: 'Rechercher',
    navCart: 'Panier',

    heroBadge: 'Hardware & Accessoires Smartphone • Algérie',
    heroTitle1: 'La Puissance & La Protection',
    heroTitleHighlight: 'Sans Compromis.',
    heroSubtitle: 'Chargeurs GaN certifiés, câbles tressés 100W, coques MagSafe et verres trempés 9H. Testés rigoureusement et livrés dans les 58 wilayas d’Algérie avec paiement en espèces.',
    heroCtaCatalog: 'Explorer tout le catalogue',
    heroCtaTrack: 'Suivre mon colis (58 Wilayas)',
    statWilayas: 'Wilayas desservies',
    statWarranty: 'Garantie échange 6 mois',
    statCod: 'Paiement à la livraison',
    statFast: 'Expédition directe',

    categoriesTitle: 'Rayons & Accessoires',
    categoriesSubtitle: 'Explorez par catégorie d’équipement',
    catAll: 'Tous les produits',
    catChargers: 'Chargeurs GaN',
    catCables: 'Câbles 100W',
    catCases: 'Coques & MagSafe',
    catProtection: 'Verres 9H & Privacy',
    catPowerbanks: 'Batteries Externes',
    catAudio: 'Audio & Écouteurs',
    catMounts: 'Supports & Docks',

    inStock: 'En Stock',
    expressOrder: 'Commande Express',
    addToCart: 'Ajouter au Panier',
    addedToCart: 'Ajouté au Panier',
    viewDetails: 'Détails',
    priceDzd: 'DZD',
    selectModel: 'Modèle de téléphone / Version :',
    quantity: 'Quantité :',
    specsTitle: 'Spécifications Techniques',
    brand: 'Marque',
    warrantyBadge: 'Garantie Échange 6 Mois',
    featuresTitle: 'Points Forts du Produit',

    cartTitle: 'Mon Panier',
    cartEmpty: 'Votre panier est actuellement vide',
    subtotal: 'Sous-total articles :',
    deliveryFee: 'Frais de livraison :',
    totalCod: 'Total à payer à la livraison :',
    checkoutBtn: 'Commander maintenant (Cash on Delivery)',
    checkoutTitle: 'Finalisation de votre commande',
    checkoutSubtitle: 'Paiement en espèces à la livraison dans les 58 Wilayas d’Algérie.',
    customerInfo: 'Informations du Destinataire',
    fullName: 'Nom & Prénom',
    phone: 'Numéro de Téléphone',
    secondaryPhone: 'Téléphone Secondaire (Optionnel)',
    wilaya: 'Wilaya de Livraison',
    commune: 'Commune / Ville',
    address: 'Adresse exacte ou point de repère',
    notes: 'Remarques de livraison (Optionnel)',
    homeDelivery: 'À Domicile',
    stopDesk: 'Point Relais (Stop Desk)',
    confirmOrderBtn: 'Confirmer ma Commande (Paiement Cash)',
    codNotice: 'Paiement sécurisé en espèces à la livraison. Vous vérifiez vos accessoires avant de payer le livreur.',

    trackingTitle: 'Suivre l’acheminement de mon colis',
    trackingSubtitle: 'Saisissez votre référence de commande (ex: ABD-2026-4021) ou votre numéro de téléphone.',
    trackingInputPlaceholder: 'Ex: ABD-2026-1024 ou 0550123456',
    trackingSearchBtn: 'Rechercher',
    stepPending: 'En attente',
    stepConfirmed: 'Confirmée',
    stepPreparing: 'Préparation',
    stepShipped: 'Expédiée',
    stepDelivered: 'Livrée',

    footerDesc: 'Abdou Phone est le spécialiste indépendant des accessoires smartphone haute performance en Algérie. Chargeurs GaN, câbles blindés, coques antichoc et protections certifiées.',
    footerRights: 'Abdou Phone. Tous droits réservés.',
    footerPrivacy: 'Protection des Données (Loi 18-07)',
    footerTerms: 'Conditions de Vente & COD',
    footerLegalNotice: 'Mentions Légales',
    guaranteeWilayas: 'Livraison 58 Wilayas',
    guaranteeCod: 'Paiement à la Livraison',
    guaranteeWarranty: 'Garantie Échange 6 Mois',
    guaranteeSupport: 'Support Client Direct 7j/7',

    // Admin Navigation
    adminNavDashboard: 'Tableau de bord',
    adminNavOrders: 'Commandes (58 Wilayas)',
    adminNavProducts: 'Catalogue Produits',
    adminNavStocks: 'Gestion des Stocks',
    adminNavStats: 'Statistiques & Ventes',
    adminNavPromos: 'Codes Promotionnels',
    adminNavRecovery: 'Relance & Confirmation',
    adminNavLogs: 'Journaux d’Audit (Loi 18-07)',
    adminNavSettings: 'Paramètres & Légalité',
    adminNavViewStore: 'Voir la Boutique',
    adminNavLogout: 'Déconnexion',
    adminNavRole: 'Super Administrateur',

    // Admin Dashboard
    adminDashTitle: 'Tableau de Bord',
    adminDashSubtitle: 'Vue d’ensemble des opérations commerciales et des livraisons en Algérie.',
    adminDashTotalOrders: 'Total Commandes',
    adminDashPendingCall: 'À Confirmer (Appels)',
    adminDashRevenue: 'Chiffre d’Affaires Total',
    adminDashActiveProducts: 'Produits au Catalogue',
    adminDashRecentOrders: 'Dernières Commandes Enregistrées',
    adminDashQuickActions: 'Actions Rapides',
    adminDashViewAllOrders: 'Gérer toutes les commandes',

    // Admin Orders
    adminOrdersTitle: 'Gestion des Commandes',
    adminOrdersSubtitle: 'Suivi et expédition des colis à travers les 58 wilayas.',
    adminOrdersSearch: 'Rechercher par référence, nom client ou numéro de téléphone...',
    adminOrdersStatusFilter: 'Filtrer par statut :',
    adminOrdersAllStatuses: 'Tous les statuts',
    adminOrdersStatusPending: 'En attente d’appel',
    adminOrdersStatusConfirmed: 'Confirmée par téléphone',
    adminOrdersStatusPreparing: 'En préparation',
    adminOrdersStatusShipped: 'Expédiée',
    adminOrdersStatusDelivered: 'Livrée & Encaissée',
    adminOrdersStatusCancelled: 'Annulée',
    adminOrdersStatusReturned: 'Colis Retourné',
    adminOrdersCustomer: 'Client & Destinataire',
    adminOrdersWilaya: 'Wilaya & Type',
    adminOrdersTotal: 'Total (DZD)',
    adminOrdersDate: 'Date & Heure',
    adminOrdersStatus: 'Statut du Colis',
    adminOrdersActions: 'Actions',
    adminOrdersExport: 'Exporter CSV',
    adminOrdersModalTitle: 'Fiche Détaillée de Commande',
    adminOrdersModalClose: 'Fermer',
    adminOrdersChangeStatus: 'Changer le statut :',

    // Admin Stocks
    adminStocksTitle: 'Gestion des Stocks & Variantes',
    adminStocksSubtitle: 'Suivi des unités disponibles, alertes de réapprovisionnement et ajustement rapide.',
    adminStocksSearch: 'Filtrer par titre, référence SKU ou marque...',
    adminStocksCriticalCount: 'Articles en stock critique (< 10 unités)',
    adminStocksTotalUnits: 'Unités totales en stock',
    adminStocksProduct: 'Produit / Accessoire',
    adminStocksCategory: 'Rayon',
    adminStocksVariant: 'Compatibilité & Couleur',
    adminStocksUnits: 'Stock Actuel',
    adminStocksAction: 'Ajuster',
    adminStocksSave: 'Enregistrer',

    // Admin Stats
    adminStatsTitle: 'Analyses & Statistiques Commerciales',
    adminStatsSubtitle: 'Indicateurs de performance des ventes et répartition territoriale en Algérie.',
    adminStatsToday: 'Aujourd’hui',
    adminStats7Days: '7 derniers jours',
    adminStats30Days: '30 derniers jours',
    adminStatsAllTime: 'Tout l’historique',
    adminStatsTotalSales: 'Volume de Ventes Réalisé',
    adminStatsAvgOrder: 'Panier Moyen Client',
    adminStatsTopWilayas: 'Top Wilayas Commanditaires',
    adminStatsTopProducts: 'Accessoires les Plus Vendus',
    adminStatsDeliveryTypeSplit: 'Répartition Domicile vs Stop Desk',

    // Admin Promos
    adminPromosTitle: 'Codes Promotionnels & Réductions',
    adminPromosSubtitle: 'Générez des coupons pour vos campagnes marketing et influenceurs.',
    adminPromosNewBtn: 'Créer un Nouveau Code',
    adminPromosCode: 'Code Promo',
    adminPromosDiscount: 'Remise',
    adminPromosMinCart: 'Panier Minimum',
    adminPromosExpiry: 'Date d’Expiration',
    adminPromosUsage: 'Utilisations',
    adminPromosStatus: 'Statut',
    adminPromosCreateModal: 'Nouveau Code Promotionnel',
    adminPromosSave: 'Créer le coupon',
    adminPromosCancel: 'Annuler',

    // Admin Recovery
    adminRecoveryTitle: 'Centre de Confirmation & Relance',
    adminRecoverySubtitle: 'Contactez les clients ayant validé une commande en attente d’appel.',
    adminRecoveryCallNow: 'Appeler le Client',
    adminRecoverySmsScript: 'Copier SMS de Confirmation',
    adminRecoveryMarkConfirmed: 'Marquer Confirmée',
    adminRecoveryPendingBadge: 'Commandes nécessitant confirmation',

    // Admin Logs
    adminLogsTitle: 'Registre d’Audit & Conformité Légale',
    adminLogsSubtitle: 'Historique immuable des actions administrateur conformément à la Loi 18-07 (ANPDP) et la Loi 18-05 (E-commerce).',
    adminLogsLawNotice: 'Ce registre consigne de manière infalsifiable chaque accès et modification administrative avec masquage de l’adresse IP.',
    adminLogsExport: 'Exporter le Registre Légal (CSV)',
    adminLogsTimestamp: 'Horodatage',
    adminLogsAdmin: 'Administrateur',
    adminLogsAction: 'Type d’Action',
    adminLogsTarget: 'Entité Ciblée',
    adminLogsDetails: 'Détails de l’Opération',
    adminLogsIp: 'Adresse IP (Anonymisée)',

    // Admin Settings
    adminSettingsTitle: 'Paramètres du Magasin & Registres Légaux',
    adminSettingsSubtitle: 'Identifiants légaux algériens et barèmes de livraison des 58 wilayas.',
    adminSettingsLegalTab: 'Identifiants Légaux (ANPDP / CNRC)',
    adminSettingsDeliveryTab: 'Tarifs de Livraison 58 Wilayas',
    adminSettingsSaveBtn: 'Sauvegarder les Paramètres',
    adminSettingsRc: 'Numéro Registre de Commerce (RC)',
    adminSettingsNif: 'Numéro d’Identification Fiscale (NIF)',
    adminSettingsNis: 'Numéro d’Identification Statistique (NIS)',
    adminSettingsAnpdp: 'N° Enregistrement ANPDP (Loi 18-07)',
    adminSettingsEcom: 'Agrément Commerce Électronique (Loi 18-05)',
    adminSettingsSavedNotice: 'Paramètres mis à jour avec succès.',
  },

  ar: {
    navHome: 'الرئيسية',
    navCatalog: 'المتجر',
    navChargers: 'شواحن GaN',
    navCases: 'الأغطية والحماية',
    navPowerbanks: 'بطاريات محمولة',
    navTrackOrder: 'تتبع طلبيتي',
    navSearch: 'بحث',
    navCart: 'السلة',

    heroBadge: 'ملحقات وعتاد الهواتف الذكية • الجزائر',
    heroTitle1: 'القوة والحماية الفائقة',
    heroTitleHighlight: 'بدون أي تنازلات.',
    heroSubtitle: 'شواحن GaN معتمدة، كابلات مدرعة 100 واط، أغطية MagSafe وزجاج مقسى 9H. مجربة بدقة وتوصيل مضمون نحو 58 ولاية مع الدفع نقدًا عند الاستلام.',
    heroCtaCatalog: 'تصفح كامل المنتجات',
    heroCtaTrack: 'تتبع شحنتي (58 ولاية)',
    statWilayas: 'ولاية مغطاة',
    statWarranty: 'ضمان استبدال 6 أشهر',
    statCod: 'الدفع عند الاستلام',
    statFast: 'شحن مباشر ومضمون',

    categoriesTitle: 'أقسام الملحقات',
    categoriesSubtitle: 'تصفح حسب فئة العتاد',
    catAll: 'كل المنتجات',
    catChargers: 'شواحن GaN سريعة',
    catCables: 'كابلات مدرعة 100W',
    catCases: 'أغطية و MagSafe',
    catProtection: 'زجاج 9H والخصوصية',
    catPowerbanks: 'بطاريات شحن خارجية',
    catAudio: 'سماعات وصوتيات',
    catMounts: 'حوامل الهواتف للسيارة',

    inStock: 'متوفر في المخزون',
    expressOrder: 'طلب سريع ومباشر',
    addToCart: 'أضف إلى السلة',
    addedToCart: 'تمت الإضافة للسلة',
    viewDetails: 'التفاصيل',
    priceDzd: 'د.ج',
    selectModel: 'اختر موديل الهاتف / الإصدار :',
    quantity: 'الكمية :',
    specsTitle: 'المواصفات التقنية',
    brand: 'العلامة التجارية',
    warrantyBadge: 'ضمان استبدال 6 أشهر',
    featuresTitle: 'أبرز مميزات المنتج',

    cartTitle: 'سلة المشتريات',
    cartEmpty: 'سلة المشتريات فارغة حاليًا',
    subtotal: 'مجموع المنتجات :',
    deliveryFee: 'تكلفة التوصيل :',
    totalCod: 'المجموع الكلي للدفع عند الاستلام :',
    checkoutBtn: 'إتمام الطلب الآن (الدفع عند الاستلام)',
    checkoutTitle: 'تأكيد وإتمام الطلبية',
    checkoutSubtitle: 'الدفع نقدًا عند الاستلام في كافة ولايات الجزائر (58 ولاية).',
    customerInfo: 'معلومات المستلم والعنوان',
    fullName: 'الاسم واللقب',
    phone: 'رقم الهاتف الرئيسي',
    secondaryPhone: 'رقم هاتف إضافي (اختياري)',
    wilaya: 'ولاية التوصيل',
    commune: 'البلدية / المدينة',
    address: 'العنوان بالتفصيل أو نقطة دالة',
    notes: 'ملاحظات خاصة بالتوصيل (اختياري)',
    homeDelivery: 'توصيل إلى باب المنزل',
    stopDesk: 'استلام من مكتب التوصيل (Stop Desk)',
    confirmOrderBtn: 'تأكيد طلبيتي (الدفع نقدًا عند الاستلام)',
    codNotice: 'دفع آمن نقدًا عند الاستلام. تقوم بمعاينة وتفقد ملحقاتك قبل دفع المبلغ للموزع.',

    trackingTitle: 'تتبع مسار شحنتك لحظة بلحظة',
    trackingSubtitle: 'أدخل رقم الطلبية (مثال: ABD-2026-4021) أو رقم هاتفك المسجل.',
    trackingInputPlaceholder: 'مثال: ABD-2026-1024 أو 0550123456',
    trackingSearchBtn: 'تتبع الآن',
    stepPending: 'قيد الانتظار',
    stepConfirmed: 'مؤكدة هاتفيًا',
    stepPreparing: 'قيد التجهيز',
    stepShipped: 'تم الشحن',
    stepDelivered: 'تمت وتسلّمت',

    footerDesc: 'عبدو فون هو المتجر المتخصص في عتاد وملحقات الهواتف الذكية عالية الجودة في الجزائر. شواحن سريعة، كابلات مدرعة، وحماية متكاملة.',
    footerRights: 'عبدو فون. جميع الحقوق محفوظة.',
    footerPrivacy: 'حماية المعطيات الشخصية (القانون 18-07)',
    footerTerms: 'شروط البيع والتوصيل',
    footerLegalNotice: 'الإشعار القانوني',
    guaranteeWilayas: 'توصيل 58 ولاية',
    guaranteeCod: 'الدفع عند الاستلام',
    guaranteeWarranty: 'ضمان استبدال 6 أشهر',
    guaranteeSupport: 'خدمة زبائن مباشرة 7/7',

    // Admin Navigation
    adminNavDashboard: 'لوحة التحكم',
    adminNavOrders: 'الطلبيات (58 ولاية)',
    adminNavProducts: 'دليل المنتجات',
    adminNavStocks: 'إدارة المخزون',
    adminNavStats: 'الإحصائيات والمبيعات',
    adminNavPromos: 'كوبونات التخفيض',
    adminNavRecovery: 'تأكيد واسترجاع الطلبيات',
    adminNavLogs: 'سجلات المراقبة (قانون 18-07)',
    adminNavSettings: 'الإعدادات والبيانات القانونية',
    adminNavViewStore: 'معاينة المتجر',
    adminNavLogout: 'تسجيل الخروج',
    adminNavRole: 'المدير العام',

    // Admin Dashboard
    adminDashTitle: 'لوحة التحكم والإدارة',
    adminDashSubtitle: 'نظرة عامة على العمليات التجارية وحركة الشحن في الـ 58 ولاية.',
    adminDashTotalOrders: 'إجمالي الطلبيات',
    adminDashPendingCall: 'في انتظار الاتصال الهاتفي',
    adminDashRevenue: 'إجمالي المداخيل المحققة',
    adminDashActiveProducts: 'المنتجات المعروضة',
    adminDashRecentOrders: 'أحدث الطلبيات المسجلة',
    adminDashQuickActions: 'إجراءات سريعة',
    adminDashViewAllOrders: 'إدارة جميع الطلبيات',

    // Admin Orders
    adminOrdersTitle: 'إدارة طلبيات الزبائن',
    adminOrdersSubtitle: 'متابعة وتحديث حالات الشحن والتوصيل عبر كافة الولايات الجزائرية.',
    adminOrdersSearch: 'ابحث برقم الطلبية، اسم الزبون أو رقم الهاتف...',
    adminOrdersStatusFilter: 'تصفية حسب الحالة :',
    adminOrdersAllStatuses: 'كل الحالات',
    adminOrdersStatusPending: 'في انتظار الاتصال',
    adminOrdersStatusConfirmed: 'مؤكدة هاتفيًا',
    adminOrdersStatusPreparing: 'قيد التجهيز والتغليف',
    adminOrdersStatusShipped: 'تم الشحن مع الناقل',
    adminOrdersStatusDelivered: 'تم التسليم وقبض المبلغ',
    adminOrdersStatusCancelled: 'ملغاة',
    adminOrdersStatusReturned: 'طرد مرتجع',
    adminOrdersCustomer: 'الزبون والمستلم',
    adminOrdersWilaya: 'الولاية ونوع التوصيل',
    adminOrdersTotal: 'المجموع (د.ج)',
    adminOrdersDate: 'التاريخ والتوقيت',
    adminOrdersStatus: 'حالة الطرد',
    adminOrdersActions: 'إجراءات',
    adminOrdersExport: 'تصدير كملف CSV',
    adminOrdersModalTitle: 'تفاصيل الطلبية الكاملة',
    adminOrdersModalClose: 'إغلاق',
    adminOrdersChangeStatus: 'تغيير حالة الطلبية :',

    // Admin Stocks
    adminStocksTitle: 'إدارة المخزون والخيارات',
    adminStocksSubtitle: 'مراقبة كميات القطع المتبقية وتنبيهات النقص وإعادة التزويد الفوري.',
    adminStocksSearch: 'ابحث باسم المنتج، كود SKU أو العلامة...',
    adminStocksCriticalCount: 'منتجات في مستوى حرج (< 10 قطع)',
    adminStocksTotalUnits: 'إجمالي القطع في المخزن',
    adminStocksProduct: 'المنتج / الملحق',
    adminStocksCategory: 'القسم',
    adminStocksVariant: 'التوافق واللون',
    adminStocksUnits: 'المخزون الحالي',
    adminStocksAction: 'تعديل',
    adminStocksSave: 'حفظ',

    // Admin Stats
    adminStatsTitle: 'الإحصائيات وتحليلات المبيعات',
    adminStatsSubtitle: 'مؤشرات الأداء المالي والتوزيع الجغرافي للمبيعات في الجزائر.',
    adminStatsToday: 'اليوم',
    adminStats7Days: 'آخر 7 أيام',
    adminStats30Days: 'آخر 30 يومًا',
    adminStatsAllTime: 'كامل السجل',
    adminStatsTotalSales: 'إجمالي المبيعات المكتملة',
    adminStatsAvgOrder: 'متوسط قيمة الطلبية',
    adminStatsTopWilayas: 'الولايات الأكثر طلبًا',
    adminStatsTopProducts: 'الملحقات الأكثر مبيعًا',
    adminStatsDeliveryTypeSplit: 'نسبة التوصيل للمنزل مقابل المكتب',

    // Admin Promos
    adminPromosTitle: 'أكواد وقسائم الخصم',
    adminPromosSubtitle: 'إنشاء وإدارة كوبونات التخفيض للحملات الإعلانية وصناع المحتوى.',
    adminPromosNewBtn: 'إنشاء كود خصم جديد',
    adminPromosCode: 'رمز الكوبون',
    adminPromosDiscount: 'قيمة الخصم',
    adminPromosMinCart: 'الحد الأدنى للطلب',
    adminPromosExpiry: 'تاريخ الانتهاء',
    adminPromosUsage: 'مرات الاستخدام',
    adminPromosStatus: 'الحالة',
    adminPromosCreateModal: 'إضافة كود خصم جديد',
    adminPromosSave: 'تفعيل الكوبون',
    adminPromosCancel: 'إلغاء',

    // Admin Recovery
    adminRecoveryTitle: 'مركز التأكيد الهاتفي والاسترجاع',
    adminRecoverySubtitle: 'الاتصال بالزبائن الجدد لتأكيد طلبياتهم قبل تجهيز الطرود.',
    adminRecoveryCallNow: 'اتصال هاتفي مباشر',
    adminRecoverySmsScript: 'نسخ نص رسالة التأكيد SMS',
    adminRecoveryMarkConfirmed: 'تأكيد الطلبية مباشرة',
    adminRecoveryPendingBadge: 'طلبيات تنتظر الاتصال لتأكيدها',

    // Admin Logs
    adminLogsTitle: 'سجل المراقبة والامتثال القانوني',
    adminLogsSubtitle: 'سجل إداري غير قابل للتعديل طبقًا لأحكام القانون 18-07 (حماية المعطيات) والقانون 18-05 (التجارة الإلكترونية).',
    adminLogsLawNotice: 'يقوم هذا السجل بتدوين كل عملية وصول وتعديل على بيانات الزبائن مع إخفاء وتشفير عنوان الـ IP لحماية الخصوصية.',
    adminLogsExport: 'تصدير السجل القانوني (CSV)',
    adminLogsTimestamp: 'التوقيت والتاريخ',
    adminLogsAdmin: 'المسؤول القائم بالعملية',
    adminLogsAction: 'نوع العملية',
    adminLogsTarget: 'العنصر المستهدف',
    adminLogsDetails: 'تفاصيل العملية الإدارية',
    adminLogsIp: 'عنوان IP (مموه ومحمي)',

    // Admin Settings
    adminSettingsTitle: 'إعدادات المتجر والمعلومات القانونية',
    adminSettingsSubtitle: 'الأرقام الجبائية والتجارية الرسمية وجدول أسعار التوصيل لـ 58 ولاية.',
    adminSettingsLegalTab: 'البيانات التجارية والقانونية (السجل / الضرائب)',
    adminSettingsDeliveryTab: 'تعريفات الشحن للـ 58 ولاية',
    adminSettingsSaveBtn: 'حفظ الإعدادات',
    adminSettingsRc: 'رقم السجل التجاري (RC)',
    adminSettingsNif: 'رقم التعريف الجبائي (NIF)',
    adminSettingsNis: 'رقم التعريف الإحصائي (NIS)',
    adminSettingsAnpdp: 'رقم التصريح لدى السلطة الوطنية لحماية المعطيات (ANPDP)',
    adminSettingsEcom: 'رقم اعتماد التجارة الإلكترونية (قانون 18-05)',
    adminSettingsSavedNotice: 'تم حفظ وتحديث الإعدادات بنجاح.',
  },

  en: {
    navHome: 'Home',
    navCatalog: 'Store',
    navChargers: 'GaN Chargers',
    navCases: 'Cases & Armor',
    navPowerbanks: 'Powerbanks',
    navTrackOrder: 'Track Parcel',
    navSearch: 'Search',
    navCart: 'Cart',

    heroBadge: 'Hardware & Smartphone Gear • Algeria',
    heroTitle1: 'Ultimate Power & Protection',
    heroTitleHighlight: 'Zero Compromise.',
    heroSubtitle: 'Certified GaN chargers, 100W braided cables, MagSafe cases, and 9H privacy tempered glass. Thoroughly tested and delivered across all 58 wilayas of Algeria with Cash on Delivery.',
    heroCtaCatalog: 'Browse Full Catalog',
    heroCtaTrack: 'Track My Parcel (58 Wilayas)',
    statWilayas: 'Wilayas covered',
    statWarranty: '6-Month replacement warranty',
    statCod: 'Cash on Delivery',
    statFast: 'Direct expedited shipping',

    categoriesTitle: 'Accessory Categories',
    categoriesSubtitle: 'Explore by hardware category',
    catAll: 'All Products',
    catChargers: 'GaN Fast Chargers',
    catCables: '100W Braided Cables',
    catCases: 'Cases & MagSafe',
    catProtection: '9H Glass & Privacy',
    catPowerbanks: 'External Powerbanks',
    catAudio: 'Audio & Earbuds',
    catMounts: 'Car Mounts & Docks',

    inStock: 'In Stock',
    expressOrder: 'Express Order',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart',
    viewDetails: 'Details',
    priceDzd: 'DZD',
    selectModel: 'Select phone model / version:',
    quantity: 'Quantity:',
    specsTitle: 'Technical Specifications',
    brand: 'Brand',
    warrantyBadge: '6-Month Replacement Warranty',
    featuresTitle: 'Key Product Highlights',

    cartTitle: 'Shopping Cart',
    cartEmpty: 'Your shopping cart is currently empty',
    subtotal: 'Items subtotal:',
    deliveryFee: 'Shipping fee:',
    totalCod: 'Total Cash on Delivery:',
    checkoutBtn: 'Checkout Now (Cash on Delivery)',
    checkoutTitle: 'Complete Your Order',
    checkoutSubtitle: 'Cash on delivery across all 58 Wilayas in Algeria.',
    customerInfo: 'Recipient & Delivery Information',
    fullName: 'Full Name',
    phone: 'Primary Phone Number',
    secondaryPhone: 'Secondary Phone (Optional)',
    wilaya: 'Delivery Wilaya',
    commune: 'City / Municipality',
    address: 'Exact address or landmark',
    notes: 'Delivery notes (Optional)',
    homeDelivery: 'Home Delivery',
    stopDesk: 'Relay Office (Stop Desk)',
    confirmOrderBtn: 'Confirm My Order (Cash on Delivery)',
    codNotice: 'Safe payment in cash upon delivery. Inspect your gear before paying the courier.',

    trackingTitle: 'Track Your Parcel in Real Time',
    trackingSubtitle: 'Enter your order reference (e.g. ABD-2026-4021) or registered phone number.',
    trackingInputPlaceholder: 'e.g. ABD-2026-1024 or 0550123456',
    trackingSearchBtn: 'Track Now',
    stepPending: 'Pending',
    stepConfirmed: 'Confirmed',
    stepPreparing: 'Packaging',
    stepShipped: 'Shipped',
    stepDelivered: 'Delivered',

    footerDesc: 'Abdou Phone is the independent specialist in high-performance smartphone hardware & accessories in Algeria. GaN chargers, rugged cables, shockproof cases, and certified screens.',
    footerRights: 'Abdou Phone. All rights reserved.',
    footerPrivacy: 'Data Privacy (Law 18-07)',
    footerTerms: 'Terms of Sale & COD',
    footerLegalNotice: 'Legal Notices',
    guaranteeWilayas: '58 Wilayas Delivery',
    guaranteeCod: 'Cash on Delivery',
    guaranteeWarranty: '6-Month Replacement',
    guaranteeSupport: 'Direct Customer Care 7/7',

    // Admin Navigation
    adminNavDashboard: 'Dashboard',
    adminNavOrders: 'Orders (58 Wilayas)',
    adminNavProducts: 'Product Catalog',
    adminNavStocks: 'Inventory & Stocks',
    adminNavStats: 'Analytics & Sales',
    adminNavPromos: 'Promo Codes',
    adminNavRecovery: 'Confirmation & Recovery',
    adminNavLogs: 'Audit Logs (Law 18-07)',
    adminNavSettings: 'Settings & Legal',
    adminNavViewStore: 'View Storefront',
    adminNavLogout: 'Logout',
    adminNavRole: 'Super Admin',

    // Admin Dashboard
    adminDashTitle: 'Operations Dashboard',
    adminDashSubtitle: 'Overview of e-commerce orders, fulfillment, and revenue across 58 wilayas in Algeria.',
    adminDashTotalOrders: 'Total Orders',
    adminDashPendingCall: 'Awaiting Call Confirmation',
    adminDashRevenue: 'Total Gross Revenue',
    adminDashActiveProducts: 'Live Catalog Items',
    adminDashRecentOrders: 'Recent Customer Orders',
    adminDashQuickActions: 'Quick Actions',
    adminDashViewAllOrders: 'Manage all orders',

    // Admin Orders
    adminOrdersTitle: 'Customer Orders Management',
    adminOrdersSubtitle: 'Fulfill, track, and update shipments across 58 Algerian Wilayas.',
    adminOrdersSearch: 'Search by order number, customer name, or phone...',
    adminOrdersStatusFilter: 'Filter by status:',
    adminOrdersAllStatuses: 'All Statuses',
    adminOrdersStatusPending: 'Awaiting Call',
    adminOrdersStatusConfirmed: 'Confirmed by Call',
    adminOrdersStatusPreparing: 'Packaging & Testing',
    adminOrdersStatusShipped: 'Dispatched to Courier',
    adminOrdersStatusDelivered: 'Delivered & Paid',
    adminOrdersStatusCancelled: 'Cancelled',
    adminOrdersStatusReturned: 'Returned Parcel',
    adminOrdersCustomer: 'Customer / Recipient',
    adminOrdersWilaya: 'Wilaya & Method',
    adminOrdersTotal: 'Total (DZD)',
    adminOrdersDate: 'Date & Time',
    adminOrdersStatus: 'Parcel Status',
    adminOrdersActions: 'Actions',
    adminOrdersExport: 'Export CSV',
    adminOrdersModalTitle: 'Full Order Details',
    adminOrdersModalClose: 'Close',
    adminOrdersChangeStatus: 'Update status:',

    // Admin Stocks
    adminStocksTitle: 'Inventory & Variant Stocks',
    adminStocksSubtitle: 'Monitor units, low-stock thresholds, and quick inventory adjustments.',
    adminStocksSearch: 'Search by title, SKU, or brand...',
    adminStocksCriticalCount: 'Critical Stock Items (< 10 units)',
    adminStocksTotalUnits: 'Total Units in Inventory',
    adminStocksProduct: 'Product / Accessory',
    adminStocksCategory: 'Category',
    adminStocksVariant: 'Compatibility & Color',
    adminStocksUnits: 'Current Stock',
    adminStocksAction: 'Adjust',
    adminStocksSave: 'Save',

    // Admin Stats
    adminStatsTitle: 'Sales Performance & Analytics',
    adminStatsSubtitle: 'Financial metrics and geographic sales breakdown across Algeria.',
    adminStatsToday: 'Today',
    adminStats7Days: 'Last 7 Days',
    adminStats30Days: 'Last 30 Days',
    adminStatsAllTime: 'All Time',
    adminStatsTotalSales: 'Total Fulfilled Sales',
    adminStatsAvgOrder: 'Average Order Value',
    adminStatsTopWilayas: 'Top Wilayas by Volume',
    adminStatsTopProducts: 'Best-Selling Gear',
    adminStatsDeliveryTypeSplit: 'Home Delivery vs Stop Desk',

    // Admin Promos
    adminPromosTitle: 'Promotional & Coupon Codes',
    adminPromosSubtitle: 'Generate discount vouchers for marketing campaigns and influencer partnerships.',
    adminPromosNewBtn: 'Create Promo Code',
    adminPromosCode: 'Coupon Code',
    adminPromosDiscount: 'Discount Value',
    adminPromosMinCart: 'Min Cart Total',
    adminPromosExpiry: 'Expiration Date',
    adminPromosUsage: 'Total Redemptions',
    adminPromosStatus: 'Status',
    adminPromosCreateModal: 'New Discount Coupon',
    adminPromosSave: 'Activate Coupon',
    adminPromosCancel: 'Cancel',

    // Admin Recovery
    adminRecoveryTitle: 'Order Confirmation & Recovery',
    adminRecoverySubtitle: 'Direct phone confirmation center for pending Algerian orders.',
    adminRecoveryCallNow: 'Direct Phone Call',
    adminRecoverySmsScript: 'Copy SMS Script',
    adminRecoveryMarkConfirmed: 'Mark as Confirmed',
    adminRecoveryPendingBadge: 'Orders awaiting verbal confirmation',

    // Admin Logs
    adminLogsTitle: 'Immutable Audit Trail & Compliance',
    adminLogsSubtitle: 'Tamper-proof administrative logs in compliance with Algerian Law 18-07 (ANPDP) & Law 18-05 (E-commerce).',
    adminLogsLawNotice: 'This immutable register logs every administrative action with anonymized client IP addresses.',
    adminLogsExport: 'Export Compliance Log (CSV)',
    adminLogsTimestamp: 'Timestamp',
    adminLogsAdmin: 'Administrator',
    adminLogsAction: 'Action Type',
    adminLogsTarget: 'Target Entity',
    adminLogsDetails: 'Operation Details',
    adminLogsIp: 'Client IP (Masked)',

    // Admin Settings
    adminSettingsTitle: 'Store Configuration & Legal Registries',
    adminSettingsSubtitle: 'Official Algerian legal identifiers (RC, NIF, NIS, ANPDP) and 58 wilayas delivery table.',
    adminSettingsLegalTab: 'Commercial Identifiers (CNRC / ANPDP)',
    adminSettingsDeliveryTab: '58 Wilayas Shipping Rates',
    adminSettingsSaveBtn: 'Save Settings',
    adminSettingsRc: 'Trade Register Number (RC)',
    adminSettingsNif: 'Tax Identification Number (NIF)',
    adminSettingsNis: 'Statistical Identification Number (NIS)',
    adminSettingsAnpdp: 'ANPDP Registration Number (Law 18-07)',
    adminSettingsEcom: 'E-commerce License (Law 18-05)',
    adminSettingsSavedNotice: 'Settings saved and updated successfully.',
  },
};
