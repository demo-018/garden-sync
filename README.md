# VegDelivery Admin System

A comprehensive admin system for vegetable delivery startup with role-based dashboards and functionality.

## Features

### Admin Dashboard
- View and manage all orders (accept/reject placed orders)
- User management and role promotion
- Promote customers to packaging or delivery employees
- Overview of total orders and users

### Packaging Employee Dashboard
- View orders ready for packaging (`/packorders`)
- Individual order details with item management (`/packorder/:orderId`)
- Update order status to packed or cancel orders
- Remove specific items from orders

### Delivery Employee Dashboard
- View assigned orders ready for delivery (`/deliveryorders`)
- Individual delivery order details (`/deliveryorder/:orderId`)
- Update order status from packed to delivered or cancelled
- Customer contact and address information

### Manager Dashboard
- Assign packed orders to delivery employees
- View vegetable requirements calculated from today's delivery orders
- Update vegetable buy status and prices
- Manage min/max price ranges for vegetables
- Dashboard with key metrics and statistics

## Current Implementation

The system uses demo data and is ready for API integration. All functionality is implemented with local state management and toast notifications.

## Demo Data Structure

- **Users**: Different roles (admin, customer, packaging, delivery, manager)
- **Orders**: Various statuses (placed, accepted, packed, assigned, delivered, cancelled)
- **Vegetables**: Price management and buy status tracking
- **Order Items**: Vegetable quantities and pricing

## API Integration Setup

All components include TODO comments indicating where API calls should be implemented:

### Required API Endpoints

#### Order Management
```typescript
// Update order status
await updateOrderStatusAPI(orderId: string, newStatus: OrderStatus);

// Assign order to delivery employee
await assignOrderToDeliveryAPI(orderId: string, employeeId: string);

// Remove item from order
await removeOrderItemAPI(orderId: string, itemId: string);
```

#### User Management
```typescript
// Update user role
await updateUserRoleAPI(userId: string, newRole: UserRole);
```

#### Vegetable Management
```typescript
// Update vegetable prices
await updateVegetablePriceAPI(vegId: string, field: string, value: number);

// Update buy status
await updateVegetableBuyStatusAPI(vegId: string, buyPrice: number, isBought: boolean);
```

#### Data Fetching
```typescript
// Get orders by status
await getOrdersByStatusAPI(status: OrderStatus);

// Get users by role
await getUsersByRoleAPI(role: UserRole);

// Get vegetable requirements for date
await getVegetableRequirementsAPI(date: string);

// Get all vegetables
await getVegetablesAPI();
```

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── navigation.tsx      # Main navigation component
│   └── status-badge.tsx    # Order status badge component
├── data/
│   └── demoData.ts        # Demo data and helper functions
├── pages/
│   ├── AdminDashboard.tsx      # Admin functionality
│   ├── PackagingDashboard.tsx  # Packaging employee features
│   ├── DeliveryDashboard.tsx   # Delivery employee features
│   └── ManagerDashboard.tsx    # Manager functionality
└── hooks/                 # Custom hooks
```

## Design System

The application uses a vegetable-themed design system with:
- **Primary**: Fresh green colors (#22c55e HSL equivalent)
- **Success**: Green for positive actions
- **Warning**: Orange/amber for attention items
- **Info**: Blue for informational elements
- **Destructive**: Red for dangerous actions

All colors are defined using HSL values in the design system and are fully responsive.

## Technology Stack

- **React** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** for component library
- **React Router** for navigation
- **Lucide React** for icons

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Next Steps for API Integration

1. Replace demo data imports with API calls
2. Implement error handling and loading states
3. Add authentication and authorization
4. Set up proper state management (Redux/Zustand if needed)
5. Add data validation and form handling
6. Implement real-time updates for order status changes