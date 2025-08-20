// Demo data for the vegetable delivery admin system
// TODO: Replace with actual API calls

export type OrderStatus = 'placed' | 'accepted' | 'rejected' | 'packed' | 'assigned' | 'delivered' | 'cancelled';
export type UserRole = 'customer' | 'admin' | 'packaging' | 'delivery' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  vegetableId: string;
  vegetableName: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
  assignedPackagingEmployee?: string;
  assignedDeliveryEmployee?: string;
}

export interface Vegetable {
  id: string;
  name: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  currentSellingPrice: number;
  buyPrice?: number;
  isBought: boolean;
  buyDate?: string;
  requiredQuantity?: number;
}

// Demo Users
export const demoUsers: User[] = [
  { id: '1', name: 'John Customer', email: 'john@example.com', phone: '+1234567890', role: 'customer', createdAt: '2024-01-15' },
  { id: '2', name: 'Admin User', email: 'admin@vegdelivery.com', phone: '+1234567891', role: 'admin', createdAt: '2024-01-10' },
  { id: '3', name: 'Pack Employee 1', email: 'pack1@vegdelivery.com', phone: '+1234567892', role: 'packaging', createdAt: '2024-01-12' },
  { id: '4', name: 'Delivery Guy 1', email: 'delivery1@vegdelivery.com', phone: '+1234567893', role: 'delivery', createdAt: '2024-01-13' },
  { id: '5', name: 'Manager User', email: 'manager@vegdelivery.com', phone: '+1234567894', role: 'manager', createdAt: '2024-01-08' },
  { id: '6', name: 'Jane Customer', email: 'jane@example.com', phone: '+1234567895', role: 'customer', createdAt: '2024-01-20' },
  { id: '7', name: 'Pack Employee 2', email: 'pack2@vegdelivery.com', phone: '+1234567896', role: 'packaging', createdAt: '2024-01-18' },
];

// Demo Orders
export const demoOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: '1',
    customerName: 'John Customer',
    customerPhone: '+1234567890',
    customerAddress: '123 Main St, City',
    items: [
      { id: 'item-1', vegetableId: 'veg-1', vegetableName: 'Tomatoes', quantity: 2, price: 50, unit: 'kg' },
      { id: 'item-2', vegetableId: 'veg-2', vegetableName: 'Onions', quantity: 1, price: 30, unit: 'kg' },
    ],
    totalAmount: 130,
    status: 'placed',
    deliveryDate: '2024-08-21',
    createdAt: '2024-08-20T10:00:00Z',
    updatedAt: '2024-08-20T10:00:00Z',
  },
  {
    id: 'ORD-002',
    customerId: '6',
    customerName: 'Jane Customer',
    customerPhone: '+1234567895',
    customerAddress: '456 Oak Ave, City',
    items: [
      { id: 'item-3', vegetableId: 'veg-3', vegetableName: 'Carrots', quantity: 1.5, price: 40, unit: 'kg' },
      { id: 'item-4', vegetableId: 'veg-4', vegetableName: 'Potatoes', quantity: 3, price: 90, unit: 'kg' },
    ],
    totalAmount: 190,
    status: 'accepted',
    deliveryDate: '2024-08-21',
    createdAt: '2024-08-20T11:00:00Z',
    updatedAt: '2024-08-20T11:30:00Z',
    assignedPackagingEmployee: '3',
  },
  {
    id: 'ORD-003',
    customerId: '1',
    customerName: 'John Customer',
    customerPhone: '+1234567890',
    customerAddress: '123 Main St, City',
    items: [
      { id: 'item-5', vegetableId: 'veg-5', vegetableName: 'Spinach', quantity: 0.5, price: 25, unit: 'kg' },
    ],
    totalAmount: 25,
    status: 'packed',
    deliveryDate: '2024-08-21',
    createdAt: '2024-08-20T09:00:00Z',
    updatedAt: '2024-08-20T14:00:00Z',
    assignedPackagingEmployee: '3',
    assignedDeliveryEmployee: '4',
  },
];

// Demo Vegetables
export const demoVegetables: Vegetable[] = [
  { 
    id: 'veg-1', 
    name: 'Tomatoes', 
    unit: 'kg', 
    minPrice: 40, 
    maxPrice: 60, 
    currentSellingPrice: 50, 
    buyPrice: 35, 
    isBought: true, 
    buyDate: '2024-08-20',
    requiredQuantity: 25
  },
  { 
    id: 'veg-2', 
    name: 'Onions', 
    unit: 'kg', 
    minPrice: 25, 
    maxPrice: 35, 
    currentSellingPrice: 30, 
    buyPrice: 22, 
    isBought: true, 
    buyDate: '2024-08-20',
    requiredQuantity: 15
  },
  { 
    id: 'veg-3', 
    name: 'Carrots', 
    unit: 'kg', 
    minPrice: 35, 
    maxPrice: 45, 
    currentSellingPrice: 40, 
    isBought: false,
    requiredQuantity: 20
  },
  { 
    id: 'veg-4', 
    name: 'Potatoes', 
    unit: 'kg', 
    minPrice: 25, 
    maxPrice: 35, 
    currentSellingPrice: 30, 
    buyPrice: 20, 
    isBought: true, 
    buyDate: '2024-08-20',
    requiredQuantity: 40
  },
  { 
    id: 'veg-5', 
    name: 'Spinach', 
    unit: 'kg', 
    minPrice: 40, 
    maxPrice: 60, 
    currentSellingPrice: 50, 
    isBought: false,
    requiredQuantity: 10
  },
];

// Helper functions
export const getOrdersByStatus = (status: OrderStatus) => 
  demoOrders.filter(order => order.status === status);

export const getOrdersForPackaging = () => 
  demoOrders.filter(order => order.status === 'accepted');

export const getOrdersForDelivery = () => 
  demoOrders.filter(order => order.status === 'packed');

export const getUsersByRole = (role: UserRole) => 
  demoUsers.filter(user => user.role === role);

export const calculateVegetableRequirements = (deliveryDate: string) => {
  const ordersForDate = demoOrders.filter(order => 
    order.deliveryDate === deliveryDate && 
    ['accepted', 'packed', 'assigned'].includes(order.status)
  );
  
  const requirements: Record<string, number> = {};
  
  ordersForDate.forEach(order => {
    order.items.forEach(item => {
      requirements[item.vegetableId] = (requirements[item.vegetableId] || 0) + item.quantity;
    });
  });
  
  return requirements;
};