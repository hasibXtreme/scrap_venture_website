import { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/marketplaceData.js';

const MarketplaceContext = createContext(null);

export function MarketplaceProvider({ children }) {
  // Shopping Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_cart');
      return saved ? JSON.parse(saved) : [
        { product: PRODUCTS[0], quantity: 1 },
        { product: PRODUCTS[4], quantity: 2 },
      ];
    } catch {
      return [{ product: PRODUCTS[0], quantity: 1 }];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-3', 'prod-5'];
    } catch {
      return ['prod-1', 'prod-3'];
    }
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(10000);
  const [sortBy, setSortBy] = useState('featured');
  const [badgeFilter, setBadgeFilter] = useState('all');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sv_cart', JSON.stringify(cart));
    } catch (e) { console.error(e); }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sv_wishlist', JSON.stringify(wishlist));
    } catch (e) { console.error(e); }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('sv_orders', JSON.stringify(orders));
    } catch (e) { console.error(e); }
  }, [orders]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x "${product.name}" to cart`, 'cart');
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to your Wishlist', 'wishlist');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // Cart totals calculation
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = cartSubtotal > 2000 || cartSubtotal === 0 ? 0 : 80;
  const cartTotal = cartSubtotal + deliveryFee;

  // Checkout & Order Placement
  const placeOrder = (orderData) => {
    const orderId = `SV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartTotal,
      customer: orderData,
      status: 'Order Placed',
      estimatedDelivery: '2 - 4 Business Days',
      statusHistory: [
        { label: 'Order Placed', timestamp: 'Just now', completed: true },
        { label: 'Processing', timestamp: 'Pending', completed: false },
        { label: 'Shipped', timestamp: 'Pending', completed: false },
        { label: 'Out for Delivery', timestamp: 'Pending', completed: false },
        { label: 'Delivered', timestamp: 'Pending', completed: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    showToast(`Order #${orderId} confirmed successfully!`, 'success');
  };

  // Filter products
  const filteredProducts = PRODUCTS.filter((p) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.shortDesc.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchCat = p.categoryName.toLowerCase().includes(q);
      const matchMat = p.materials.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat && !matchMat) return false;
    }

    // Category
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    // Price
    if (p.price > priceRange) {
      return false;
    }

    // Badge
    if (badgeFilter !== 'all') {
      const hasBadge = p.badges.some((b) => b.toLowerCase().includes(badgeFilter.toLowerCase()));
      if (!hasBadge) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return b.id.localeCompare(a.id);
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // featured default
  });

  return (
    <MarketplaceContext.Provider
      value={{
        products: filteredProducts,
        allProducts: PRODUCTS,
        cart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isWishlisted,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        badgeFilter,
        setBadgeFilter,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeOrder,
        setActiveOrder,
        orders,
        placeOrder,
        toast,
        showToast,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return ctx;
}

