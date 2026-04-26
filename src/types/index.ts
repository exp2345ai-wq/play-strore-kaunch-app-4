/**
 * ShopX Elite Pro Max — global type definitions.
 *
 * This file contains all shared TypeScript interfaces and types
 * used across the application. Keeping them centralized makes
 * refactors painless and discovery trivial.
 */

export type ID = string;

export interface Money {
  amount: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Dimensions2D {
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export type CategorySlug =
  | 'fashion'
  | 'electronics'
  | 'home-living'
  | 'beauty'
  | 'sports'
  | 'books'
  | 'toys'
  | 'grocery'
  | 'jewelry'
  | 'automotive'
  | 'pet-care'
  | 'stationery';

export interface Category {
  id: ID;
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  iconColor: string;
  gradient: [string, string];
  productCount: number;
  trending: boolean;
  bannerImage: string;
  thumbnail: string;
  subcategories: Subcategory[];
  popularBrands: string[];
  averagePrice: Money;
  totalReviews: number;
}

export interface Subcategory {
  id: ID;
  name: string;
  slug: string;
  productCount: number;
  thumbnail: string;
}

export interface Brand {
  id: ID;
  name: string;
  slug: string;
  description: string;
  logo: string;
  rating: number;
  productCount: number;
  founded: number;
  origin: string;
  premium: boolean;
}

export interface Variant {
  id: ID;
  type: 'size' | 'color' | 'storage' | 'material' | 'flavor';
  label: string;
  value: string;
  hex?: string;
  inStock: boolean;
  priceModifier: number;
  thumbnail?: string;
}

export interface Specification {
  key: string;
  value: string;
  group: 'general' | 'dimensions' | 'connectivity' | 'performance' | 'misc';
}

export interface Product {
  id: ID;
  sku: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  brand: string;
  brandId: ID;
  categoryId: ID;
  subcategoryId: ID;
  price: Money;
  originalPrice: Money;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  variants: Variant[];
  specs: Specification[];
  highlights: string[];
  tags: string[];
  inStock: boolean;
  stockCount: number;
  trending: boolean;
  bestseller: boolean;
  featured: boolean;
  newArrival: boolean;
  freeShipping: boolean;
  returnable: boolean;
  warrantyMonths: number;
  deliveryEta: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: ID;
  productId: ID;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  unhelpful: number;
  verifiedPurchase: boolean;
  images: string[];
  createdAt: string;
  reply?: {
    author: string;
    content: string;
    createdAt: string;
  };
}

// ---------------------------------------------------------------------------
// Banners / Marketing
// ---------------------------------------------------------------------------

export interface Banner {
  id: ID;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  gradient: [string, string];
  targetCategoryId?: ID;
  targetProductId?: ID;
  expiresAt: string;
}

// ---------------------------------------------------------------------------
// Cart / Wishlist / Checkout
// ---------------------------------------------------------------------------

export interface CartItem {
  id: ID;
  productId: ID;
  variantIds: ID[];
  quantity: number;
  unitPrice: Money;
  addedAt: string;
}

export interface WishlistEntry {
  id: ID;
  productId: ID;
  addedAt: string;
  notes?: string;
}

export interface SavedForLaterEntry {
  id: ID;
  productId: ID;
  variantIds: ID[];
  savedAt: string;
}

export interface Address {
  id: ID;
  fullName: string;
  phone: string;
  pincode: string;
  flat: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export type PaymentMethodType =
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet'
  | 'cod'
  | 'emi'
  | 'gift-card';

export interface PaymentMethod {
  id: ID;
  type: PaymentMethodType;
  label: string;
  description: string;
  iconColor: string;
  emoji: string;
  enabled: boolean;
  cashback?: string;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export interface OrderItem {
  productId: ID;
  productTitle: string;
  productThumbnail: string;
  brand: string;
  variantSummary: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  completed: boolean;
}

export interface Order {
  id: ID;
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: Money;
  shippingFee: Money;
  taxes: Money;
  discount: Money;
  total: Money;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethodId: ID;
  paymentLabel: string;
  trackingId?: string;
  trackingUrl?: string;
  estimatedDelivery: string;
  timeline: OrderTimelineEntry[];
  invoiceUrl?: string;
  rated: boolean;
}

// ---------------------------------------------------------------------------
// User / Profile / Settings
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: ID;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  totalOrders: number;
  totalSpent: Money;
  rewardPoints: number;
  bio?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

export type ColorMode = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'cyan' | 'magenta' | 'lime' | 'amber' | 'rose';

export interface AppSettings {
  colorMode: ColorMode;
  accentColor: AccentColor;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  emailMarketing: boolean;
  pushDeals: boolean;
  pushOrderUpdates: boolean;
  language: 'en' | 'hi' | 'es' | 'fr';
  currency: Money['currency'];
  reduceMotion: boolean;
  highContrast: boolean;
  preferredFont: 'system' | 'rounded' | 'mono';
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchSuggestion {
  id: ID;
  text: string;
  type: 'recent' | 'popular' | 'autocomplete' | 'category' | 'brand';
  count?: number;
}

export interface SearchFilter {
  priceMin: number;
  priceMax: number;
  brands: ID[];
  ratings: number[];
  categories: ID[];
  inStockOnly: boolean;
  freeShippingOnly: boolean;
  sortBy:
    | 'relevance'
    | 'price-asc'
    | 'price-desc'
    | 'rating'
    | 'newest'
    | 'trending';
}

// ---------------------------------------------------------------------------
// AI Assistant
// ---------------------------------------------------------------------------

export interface AIChatMessage {
  id: ID;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  reactions?: ('like' | 'dislike' | 'love')[];
  attachments?: { kind: 'product' | 'order' | 'image'; refId: ID }[];
}

export interface AIQuickAction {
  id: ID;
  label: string;
  emoji: string;
  prompt: string;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export type NotificationKind =
  | 'order'
  | 'deal'
  | 'price-drop'
  | 'restock'
  | 'system'
  | 'review-reply';

export interface AppNotification {
  id: ID;
  kind: NotificationKind;
  title: string;
  body: string;
  emoji: string;
  read: boolean;
  createdAt: string;
  payload?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export type RootTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  CartTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  CategoryProducts: { categoryId: ID };
  ProductDetail: { productId: ID };
  VariantSelection: { productId: ID };
  CartReview: undefined;
};

export type SearchStackParamList = {
  SearchMain: undefined;
  SearchResults: { query: string };
  SearchSuggestionResults: { suggestionId: ID; query: string };
  SearchFilter: { query: string };
  SearchProductDetail: { productId: ID };
};

export type CartStackParamList = {
  CartMain: undefined;
  CartItemEdit: { itemId: ID };
  AddressSelection: undefined;
  AddAddressForm: { addressId?: ID };
  PaymentMethod: { addressId: ID };
};

export type OrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetail: { orderId: ID };
  OrderTracking: { orderId: ID };
  Reorder: { orderId: ID };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  AddressList: undefined;
  AddressDetail: { addressId: ID };
  EditProfile: undefined;
};
