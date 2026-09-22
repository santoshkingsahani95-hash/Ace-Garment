import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, WishlistItem, CustomerUser } from '@/types';

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, colorName: string, size: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Mini Cart Drawer
  isMiniCartOpen: boolean;
  openMiniCart: () => void;
  closeMiniCart: () => void;
  toggleMiniCart: () => void;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick Add Modal
  quickAddProduct: Product | null;
  openQuickAdd: (product: Product) => void;
  closeQuickAdd: () => void;

  // Size Guide Modal
  sizeGuideCategory: string | null;
  openSizeGuide: (category?: string) => void;
  closeSizeGuide: () => void;

  // Search Overlay
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  // Customer Auth
  user: CustomerUser | null;
  setUser: (user: CustomerUser | null) => void;
  switchRole: (role: 'ADMIN' | 'CUSTOMER') => void;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart State
      cart: [],
      addToCart: (product, colorName, size, quantity = 1) => {
        const totalProductStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);
        const sizeObj = product.sizes.find((s) => s.size === size);
        const maxStock = sizeObj ? sizeObj.stock : (totalProductStock > 0 ? totalProductStock : 50);
        if (maxStock <= 0) {
          if (typeof window !== 'undefined') {
            alert(`Sorry! ${product.name} is currently OUT OF STOCK.`);
          }
          return;
        }

        const color = product.colors.find((c) => c.name === colorName) || product.colors[0];
        const selectedImage = color?.images[0] || product.colors[0]?.images[0] || '';
        const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
        const itemId = `${product.id}-${colorName}-${size}`;

        set((state) => {
          const existingIndex = state.cart.findIndex((item) => item.id === itemId);
          if (existingIndex > -1) {
            const updated = [...state.cart];
            const currentQty = updated[existingIndex].quantity;
            const newQty = Math.min(currentQty + quantity, maxStock);
            if (newQty === currentQty && currentQty >= maxStock && typeof window !== 'undefined') {
              alert(`Cannot add more! Maximum available stock (${maxStock} units) already in your bag.`);
            }
            updated[existingIndex].quantity = newQty;
            updated[existingIndex].maxStock = maxStock;
            return { cart: updated, isMiniCartOpen: true };
          }

          const initialQty = Math.min(quantity, maxStock);
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            image: selectedImage,
            colorName: colorName,
            colorCode: color?.code || '#111111',
            size: size,
            price: price,
            originalPrice: product.price,
            quantity: initialQty,
            sku: product.sku,
            maxStock: maxStock,
          };

          return { cart: [newItem, ...state.cart], isMiniCartOpen: true };
        });
      },

      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id === cartItemId) {
              const limit = item.maxStock !== undefined ? item.maxStock : 999;
              if (quantity > limit && typeof window !== 'undefined') {
                alert(`Only ${limit} units available in stock for ${item.productName} (${item.size}).`);
              }
              const finalQty = Math.min(quantity, limit);
              return { ...item, quantity: finalQty };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getCartItemCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Mini Cart Drawer State
      isMiniCartOpen: false,
      openMiniCart: () => set({ isMiniCartOpen: true }),
      closeMiniCart: () => set({ isMiniCartOpen: false }),
      toggleMiniCart: () => set((state) => ({ isMiniCartOpen: !state.isMiniCartOpen })),

      // Wishlist State
      wishlist: [
        {
          productId: 'prod-7',
          slug: 'satin-cowl-neck-mini-dress',
          name: 'Aria Satin Cowl Mini Dress',
          image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
          price: 3499,
          salePrice: 2899,
          category: 'dresses',
          colors: ['#111111', '#9E2A2B', '#1B4D3E'],
        },
      ],
      toggleWishlist: (product) => {
        set((state) => {
          const exists = state.wishlist.some((item) => item.productId === product.id);
          if (exists) {
            return {
              wishlist: state.wishlist.filter((item) => item.productId !== product.id),
            };
          }
          const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
          const newItem: WishlistItem = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.colors[0]?.images[0] || '',
            price: product.price,
            salePrice: product.salePrice,
            category: product.category,
            colors: product.colors.map((c) => c.code),
          };
          return { wishlist: [newItem, ...state.wishlist] };
        });
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.productId === productId);
      },

      // Quick Add Modal State
      quickAddProduct: null,
      openQuickAdd: (product) => set({ quickAddProduct: product }),
      closeQuickAdd: () => set({ quickAddProduct: null }),

      // Size Guide Modal State
      sizeGuideCategory: null,
      openSizeGuide: (category = 'tops') => set({ sizeGuideCategory: category }),
      closeSizeGuide: () => set({ sizeGuideCategory: null }),

      // Search Overlay State
      isSearchOpen: false,
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      // User Auth
      user: {
        id: 'usr-cust-1',
        name: 'Aayusha Karki',
        email: 'aayusha.k@example.com',
        mobile: '+977 9841234567',
        role: 'CUSTOMER',
        registrationDate: '2026-02-15',
      },
      setUser: (user) => set({ user }),
      switchRole: (role) =>
        set((state) => {
          if (!state.user) {
            return {
              user: {
                id: role === 'ADMIN' ? 'usr-admin-1' : 'usr-cust-1',
                name: role === 'ADMIN' ? 'Admin Manager' : 'Aayusha Karki',
                email: role === 'ADMIN' ? 'admin@daisyhub.com' : 'aayusha.k@example.com',
                mobile: '+977 9841234567',
                role,
                registrationDate: '2026-02-15',
              },
            };
          }
          return { user: { ...state.user, role } };
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'ace-garment-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
      }),
    }
  )
);
