// Demo data for frontend-only admin panel
export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  gender?: 'Men' | 'Women';
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  basePrice: number;
  salePrice?: number;
  discount?: number;
  images: string[];
  featured: boolean;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  topProducts: {
    id: string;
    title: string;
    sales: number;
    revenue: number;
  }[];
  salesData: {
    month: string;
    revenue: number;
    orders: number;
  }[];
}

// Demo Products Data
export const demoProducts: Product[] = [
  {
    id: "1",
    title: "Silk Evening Dress",
    description: "Luxurious silk evening dress with elegant draping and premium finish. Perfect for special occasions.",
    category: "Dresses",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy"],
    stockQuantity: 24,
    basePrice: 45000,
    salePrice: 36000,
    discount: 20,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    featured: true,
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  },
  {
    id: "2",
    title: "Cashmere Blazer",
    description: "Premium cashmere blazer with tailored fit and luxury details. Timeless elegance for any occasion.",
    category: "Blazers",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Camel", "Navy"],
    stockQuantity: 18,
    basePrice: 85000,
    images: ["/placeholder.svg", "/placeholder.svg"],
    featured: true,
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18"
  },
  {
    id: "3",
    title: "Leather Handbag",
    description: "Handcrafted leather handbag with gold hardware and premium Italian leather construction.",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Cognac"],
    stockQuantity: 31,
    basePrice: 35000,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    featured: true,
    status: "active",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-15"
  },
  {
    id: "4",
    title: "Wool Coat",
    description: "Double-breasted wool coat with timeless design and superior craftsmanship.",
    category: "Outerwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Camel"],
    stockQuantity: 15,
    basePrice: 95000,
    salePrice: 76000,
    discount: 20,
    images: ["/placeholder.svg", "/placeholder.svg"],
    featured: false,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-12"
  },
  {
    id: "5",
    title: "Designer Sunglasses",
    description: "Premium designer sunglasses with polarized lenses and titanium frame.",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Black", "Tortoise", "Gold"],
    stockQuantity: 42,
    basePrice: 25000,
    images: ["/placeholder.svg"],
    featured: false,
    status: "draft",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20"
  }
];

// Demo Orders Data
export const demoOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@email.com",
    items: [
      {
        productId: "1",
        productTitle: "Silk Evening Dress",
        quantity: 1,
        price: 36000,
        size: "M",
        color: "Black"
      }
    ],
    total: 36000,
    status: "delivered",
    orderDate: "2024-01-18",
    shippingAddress: "123 MG Road, Bangalore, Karnataka, 560001",
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-002",
    customerName: "Rahul Gupta",
    customerEmail: "rahul.gupta@email.com",
    items: [
      {
        productId: "2",
        productTitle: "Cashmere Blazer",
        quantity: 1,
        price: 85000,
        size: "L",
        color: "Navy"
      },
      {
        productId: "3",
        productTitle: "Leather Handbag",
        quantity: 1,
        price: 35000,
        size: "One Size",
        color: "Brown"
      }
    ],
    total: 120000,
    status: "shipped",
    orderDate: "2024-01-19",
    shippingAddress: "456 Connaught Place, New Delhi, Delhi, 110001",
    paymentMethod: "UPI"
  },
  {
    id: "ORD-003",
    customerName: "Anjali Patel",
    customerEmail: "anjali.patel@email.com",
    items: [
      {
        productId: "4",
        productTitle: "Wool Coat",
        quantity: 1,
        price: 76000,
        size: "S",
        color: "Camel"
      }
    ],
    total: 76000,
    status: "processing",
    orderDate: "2024-01-20",
    shippingAddress: "789 Carter Road, Mumbai, Maharashtra, 400050",
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-004",
    customerName: "Vikram Singh",
    customerEmail: "vikram.singh@email.com",
    items: [
      {
        productId: "1",
        productTitle: "Silk Evening Dress",
        quantity: 2,
        price: 36000,
        size: "L",
        color: "Navy"
      }
    ],
    total: 72000,
    status: "pending",
    orderDate: "2024-01-21",
    shippingAddress: "321 Park Street, Kolkata, West Bengal, 700016",
    paymentMethod: "Net Banking"
  }
];

// Demo Analytics Data
export const demoAnalytics: Analytics = {
  totalRevenue: 1247000,
  totalOrders: 156,
  totalProducts: 48,
  totalCustomers: 892,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  topProducts: [
    { id: "1", title: "Silk Evening Dress", sales: 24, revenue: 864000 },
    { id: "2", title: "Cashmere Blazer", sales: 18, revenue: 1530000 },
    { id: "3", title: "Leather Handbag", sales: 31, revenue: 1085000 },
    { id: "4", title: "Wool Coat", sales: 15, revenue: 1140000 }
  ],
  salesData: [
    { month: "Jan", revenue: 180000, orders: 23 },
    { month: "Feb", revenue: 195000, orders: 28 },
    { month: "Mar", revenue: 210000, orders: 31 },
    { month: "Apr", revenue: 175000, orders: 25 },
    { month: "May", revenue: 240000, orders: 35 },
    { month: "Jun", revenue: 220000, orders: 32 }
  ]
};