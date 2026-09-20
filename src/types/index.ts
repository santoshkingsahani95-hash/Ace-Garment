export interface ColorOption {
  name: string;
  code: string; // hex string e.g. #000000
  images: string[];
}

export interface SizeVariant {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  stock: number;
  sku?: string;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  colorCode: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  stock: number;
  sku: string;
  price?: number;
  salePrice?: number;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
  userImage?: string;
  images?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  details?: string[];
  fabricCare?: string;
  category: 'tops' | 'dresses' | 'bottoms' | 'sets' | string;
  subcategory?: string;
  collections?: string[]; // e.g. ['new-arrivals', 'best-sellers', 'trending', 'sale', 'everyday-essentials', 'party-edits']
  price: number; // in NPR
  salePrice?: number; // in NPR
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  colors: ColorOption[];
  sizes: SizeVariant[];
  variants?: ProductVariant[];
  sku: string;
  createdAt: string;
  reviews?: ProductReview[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  subcategories: string[];
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  image: string;
  colorName: string;
  colorCode: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  price: number; // current price (salePrice if available)
  originalPrice: number;
  quantity: number;
  sku: string;
}

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  category: string;
  colors: string[];
}

export interface Address {
  fullName: string;
  mobile: string;
  email: string;
  province: string;
  district: string;
  city: string;
  streetAddress: string;
  landmark?: string;
  isDefault?: boolean;
}

export type PaymentMethod = 'cod' | 'esewa' | 'khalti' | 'fonepay' | 'card';

export interface OrderItem {
  productId: string;
  productName: string;
  colorName: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'Order Placed' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  shippingAddress: Address;
  estimatedDelivery: string;
  trackingNumber?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  active: boolean;
}

export interface HomepageCMS {
  announcementBar: {
    enabled: boolean;
    text: string;
  };
  hero: {
    heading: string;
    subtitle: string;
    buttonText: string;
    buttonUrl: string;
    secondaryButtonText: string;
    secondaryButtonUrl: string;
    desktopImage: string;
    mobileImage: string;
  };
  editorialBanner: {
    heading: string;
    subtitle: string;
    buttonText: string;
    buttonUrl: string;
    image: string;
  };
  instagramImages: {
    id: string;
    imageUrl: string;
    postUrl: string;
  }[];
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MANAGER';
  registrationDate: string;
  isBlocked?: boolean;
}
