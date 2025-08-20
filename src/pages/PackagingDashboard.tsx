import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { getOrdersForPackaging, demoOrders, Order, OrderItem } from "@/data/demoData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package } from "lucide-react";

export default function PackagingDashboard() {
  const [orders, setOrders] = useState<Order[]>(getOrdersForPackaging());
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateOrderStatus = (orderId: string, newStatus: 'packed' | 'cancelled') => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    toast({
      title: "Order Updated",
      description: `Order ${orderId} marked as ${newStatus}`,
    });
    // TODO: API call to update order status
    // await updateOrderStatusAPI(orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Pack Orders</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="h-5 w-5" />
          <span>{orders.length} orders to pack</span>
        </div>
      </div>

      {/* Orders to Pack */}
      <Card>
        <CardHeader>
          <CardTitle>Orders Ready for Packaging</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders ready for packaging
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="text-sm">
                            {item.vegetableName} - {item.quantity} {item.unit}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>₹{order.totalAmount}</TableCell>
                    <TableCell>{order.deliveryDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/packorder/${order.id}`)}
                          variant="outline"
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'packed')}
                          className="bg-success text-success-foreground hover:bg-success/90"
                        >
                          Mark Packed
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        >
                          Cancel Order
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Individual Order Details Component
export function PackOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const order = demoOrders.find(o => o.id === orderId);
  interface OrderItemWithAvailability extends OrderItem {
    available: boolean;
  }
  
  const [orderItems, setOrderItems] = useState<OrderItemWithAvailability[]>(
    order?.items.map(item => ({ ...item, available: true })) || []
  );

  if (!order) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Order not found</h2>
        <Button onClick={() => navigate('/packorders')} className="mt-4">
          Back to Pack Orders
        </Button>
      </div>
    );
  }

  const removeItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Item removed from order",
    });
    // TODO: API call to remove item
    // await removeOrderItemAPI(orderId, itemId);
  };

  const toggleItemAvailability = (itemId: string) => {
    setOrderItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, available: !item.available }
        : item
    ));
    toast({
      title: "Item Availability Updated",
      description: "Item availability has been updated",
    });
    // TODO: API call to update item availability
    // await updateItemAvailabilityAPI(orderId, itemId, availability);
  };

  const markOrderPacked = () => {
    toast({
      title: "Order Packed",
      description: `Order ${orderId} marked as packed`,
    });
    navigate('/packorders');
    // TODO: API call to update order status
    // await updateOrderStatusAPI(orderId, 'packed');
  };

  const cancelOrder = () => {
    toast({
      title: "Order Cancelled",
      description: `Order ${orderId} has been cancelled`,
    });
    navigate('/packorders');
    // TODO: API call to cancel order
    // await updateOrderStatusAPI(orderId, 'cancelled');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/packorders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pack Orders
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Order {orderId}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.vegetableName}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>₹{item.quantity * item.price}</TableCell>
                    <TableCell>
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleItemAvailability(item.id)}
                        >
                          Mark {item.available ? 'Unavailable' : 'Available'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Name</h4>
              <p className="text-muted-foreground">{order.customerName}</p>
            </div>
            <div>
              <h4 className="font-medium">Phone</h4>
              <p className="text-muted-foreground">{order.customerPhone}</p>
            </div>
            <div>
              <h4 className="font-medium">Address</h4>
              <p className="text-muted-foreground">{order.customerAddress}</p>
            </div>
            <div>
              <h4 className="font-medium">Delivery Date</h4>
              <p className="text-muted-foreground">{order.deliveryDate}</p>
            </div>
            <div>
              <h4 className="font-medium">Total Amount</h4>
              <p className="text-lg font-bold text-primary">
                ₹{orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)}
              </p>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button 
                className="w-full bg-success text-success-foreground hover:bg-success/90"
                onClick={markOrderPacked}
              >
                Mark as Packed
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={cancelOrder}
              >
                Cancel Entire Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}