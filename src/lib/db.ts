import { Product, Category, Collection, Order, Coupon, HomepageCMS, CustomerUser, ProductReview } from '@/types';
import { seedProducts, initialCategories, initialCollections, initialCMS } from './seed-data';

// In-memory persistent data store for server side & client fallback
class DataStore {
  private products: Product[] = [...seedProducts];
  private categories: Category[] = [...initialCategories];
  private collections: Collection[] = [...initialCollections];
  private cms: HomepageCMS = { ...initialCMS };
  private orders: Order[] = [
    {
      id: 'ord-1001',
      orderNumber: 'ACE-884910',
      createdAt: '2026-03-18T14:30:00.000Z',
      items: [
        {
          productId: 'prod-1',
          productName: 'Ribbed Contour Crop Top',
          colorName: 'Black',
          size: 'M',
          quantity: 1,
          price: 1299,
          image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
        },
        {
          productId: 'prod-13',
          productName: 'High-Waist Wide Leg Trousers',
          colorName: 'Beige',
          size: 'S',
          quantity: 1,
          price: 2499,
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop',
        },
      ],
      subtotal: 3798,
      discount: 300,
      shipping: 0,
      total: 3498,
      paymentMethod: 'esewa',
      paymentStatus: 'paid',
      orderStatus: 'Processing',
      customerName: 'Aayusha Karki',
      customerEmail: 'aayusha.k@example.com',
      customerMobile: '+977 9841234567',
      shippingAddress: {
        fullName: 'Aayusha Karki',
        mobile: '9841234567',
        email: 'aayusha.k@example.com',
        province: 'Bagmati Province',
        district: 'Kathmandu',
        city: 'Kathmandu',
        streetAddress: 'Baneshwor Height, Ward 10',
        landmark: 'Near Standard Chartered Bank',
      },
      estimatedDelivery: '2026-03-22',
      trackingNumber: 'ACE-TRK-9921',
    },
  ];
  private coupons: Coupon[] = [
    {
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 1500,
      maxDiscount: 500,
      expiryDate: '2026-12-31',
      active: true,
    },
    {
      code: 'ACE500',
      discountType: 'fixed',
      discountValue: 500,
      minOrderValue: 3000,
      expiryDate: '2026-12-31',
      active: true,
    },
  ];
  private newsletterSubscribers: string[] = ['vip@acegarment.com'];
  private users: CustomerUser[] = [
    {
      id: 'usr-admin-1',
      name: 'Admin Manager',
      email: 'admin@acegarment.com',
      mobile: '+977 9800000000',
      role: 'ADMIN',
      registrationDate: '2026-01-01',
    },
    {
      id: 'usr-cust-1',
      name: 'Aayusha Karki',
      email: 'aayusha.k@example.com',
      mobile: '+977 9841234567',
      role: 'CUSTOMER',
      registrationDate: '2026-02-15',
    },
  ];

  // Products
  getProducts(): Product[] {
    return this.products;
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug || p.id === slug);
  }

  getProductsByCategory(categorySlug: string): Product[] {
    if (categorySlug === 'new-arrivals') {
      return this.products.filter((p) => p.isNewArrival || p.collections?.includes('new-arrivals'));
    }
    if (categorySlug === 'sale') {
      return this.products.filter((p) => p.isSale || p.salePrice !== undefined);
    }
    if (categorySlug === 'trending') {
      return this.products.filter((p) => p.isTrending);
    }
    if (categorySlug === 'best-sellers') {
      return this.products.filter((p) => p.isBestSeller);
    }
    return this.products.filter((p) => p.category.toLowerCase() === categorySlug.toLowerCase());
  }

  saveProduct(product: Product): Product {
    const existingIndex = this.products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = product;
    } else {
      this.products.unshift(product);
    }
    return product;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLen;
  }

  updateInventory(productId: string, size: string, newStock: number): boolean {
    const prod = this.products.find((p) => p.id === productId);
    if (!prod) return false;
    const targetSize = prod.sizes.find((s) => s.size === size);
    if (targetSize) {
      targetSize.stock = newStock;
      return true;
    }
    return false;
  }

  addReview(productId: string, review: ProductReview): boolean {
    const prod = this.products.find((p) => p.id === productId);
    if (!prod) return false;
    if (!prod.reviews) prod.reviews = [];
    prod.reviews.unshift(review);
    prod.reviewCount = prod.reviews.length;
    const totalRating = prod.reviews.reduce((acc, r) => acc + r.rating, 0);
    prod.rating = Number((totalRating / prod.reviewCount).toFixed(1));
    return true;
  }

  // Categories & Collections
  getCategories(): Category[] {
    return this.categories;
  }

  updateCategory(id: string, updatedFields: Partial<Category>): Category | undefined {
    const cat = this.categories.find((c) => c.id === id || c.slug === id);
    if (cat) {
      if (updatedFields.name) cat.name = updatedFields.name;
      if (updatedFields.description) cat.description = updatedFields.description;
      if (updatedFields.image) cat.image = updatedFields.image;
      if (updatedFields.subcategories) cat.subcategories = updatedFields.subcategories;
    }
    return cat;
  }

  updateProductPhoto(productId: string, newPhotoUrl: string): boolean {
    const prod = this.products.find((p) => p.id === productId);
    if (!prod) return false;
    if (prod.colors.length === 0) {
      prod.colors = [{ name: 'Default', code: '#111111', images: [newPhotoUrl, newPhotoUrl] }];
    } else {
      prod.colors[0].images = [newPhotoUrl, newPhotoUrl];
    }
    return true;
  }

  getCollections(): Collection[] {
    return this.collections;
  }

  // CMS
  getCMS(): HomepageCMS {
    return this.cms;
  }

  updateCMS(newCms: Partial<HomepageCMS>): HomepageCMS {
    this.cms = { ...this.cms, ...newCms };
    return this.cms;
  }

  // Orders
  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(order: Order): Order {
    this.orders.unshift(order);
    return order;
  }

  updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | undefined {
    const ord = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (ord) {
      ord.orderStatus = status;
      if (status === 'Delivered') {
        ord.paymentStatus = 'paid';
      }
    }
    return ord;
  }

  // Coupons
  getCoupons(): Coupon[] {
    return this.coupons;
  }

  validateCoupon(code: string, subtotal: number): { valid: boolean; discountAmount: number; message: string } {
    const coupon = this.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (!coupon) {
      return { valid: false, discountAmount: 0, message: 'Invalid or expired coupon code.' };
    }
    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum order value of NPR ${coupon.minOrderValue.toLocaleString()} required for this coupon.`,
      };
    }
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }
    return {
      valid: true,
      discountAmount: Math.round(discount),
      message: `Coupon applied successfully! Saved NPR ${Math.round(discount).toLocaleString()}`,
    };
  }

  addCoupon(coupon: Coupon): Coupon {
    this.coupons.push(coupon);
    return coupon;
  }

  // Newsletter
  addNewsletterSubscriber(email: string): { success: boolean; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    if (this.newsletterSubscribers.includes(cleanEmail)) {
      return { success: true, message: 'You are already subscribed to the ACE Club!' };
    }
    this.newsletterSubscribers.push(cleanEmail);
    return { success: true, message: 'Welcome to the ACE Club! Check your inbox for exclusive updates.' };
  }

  getNewsletterSubscribers(): string[] {
    return this.newsletterSubscribers;
  }

  // Users
  getUsers(): CustomerUser[] {
    return this.users;
  }
}

// Global Singleton to ensure state persistence across requests in memory
const globalStore = (globalThis as any).__aceDataStore || new DataStore();
if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).__aceDataStore = globalStore;
}

export const db = globalStore as DataStore;
