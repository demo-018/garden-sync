import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { getOrdersForDelivery, demoOrders, Order } from "@/data/demoData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Truck, MapPin, Phone } from "lucide-react";

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<Order[]>(getOrdersForDelivery());
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateOrderStatus = (orderId: string, newStatus: 'delivered' | 'cancelled') => {
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
        <h1 className="text-3xl font-bold text-foreground">Delivery Orders</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck className="h-5 w-5" />
          <span>{orders.length} orders to deliver</span>
        </div>
      </div>

      {/* Orders for Delivery */}
      <Card>
        <CardHeader>
          <CardTitle>Orders Ready for Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders ready for delivery
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
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
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.customerPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                        <span className="text-sm">{order.customerAddress}</span>
                      </div>
                    </TableCell>
                    <TableCell>₹{order.totalAmount}</TableCell>
                    <TableCell>{order.deliveryDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/deliveryorder/${order.id}`)}
                          variant="outline"
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="bg-success text-success-foreground hover:bg-success/90"
                        >
                          Mark Delivered
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        >
                          Cancel
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

// Individual Delivery Order Details Component
export function DeliveryOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const order = demoOrders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Order not found</h2>
        <Button onClick={() => navigate('/deliveryorders')} className="mt-4">
          Back to Delivery Orders
        </Button>
      </div>
    );
  }

  const markOrderDelivered = () => {
    toast({
      title: "Order Delivered",
      description: `Order ${orderId} marked as delivered`,
    });
    navigate('/deliveryorders');
    // TODO: API call to update order status
    // await updateOrderStatusAPI(orderId, 'delivered');
  };

  const cancelOrder = () => {
    toast({
      title: "Order Cancelled",
      description: `Order ${orderId} has been cancelled`,
    });
    navigate('/deliveryorders');
    // TODO: API call to cancel order
    // await updateOrderStatusAPI(orderId, 'cancelled');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/deliveryorders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Delivery Orders
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Delivery Order {orderId}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.vegetableName}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>₹{item.quantity * item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Customer Contact
              </h4>
              <p className="text-muted-foreground">{order.customerName}</p>
              <p className="text-muted-foreground">{order.customerPhone}</p>
            </div>
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery Address
              </h4>
              <p className="text-muted-foreground">{order.customerAddress}</p>
            </div>
            <div>
              <h4 className="font-medium">Delivery Date</h4>
              <p className="text-muted-foreground">{order.deliveryDate}</p>
            </div>
            <div>
              <h4 className="font-medium">Total Amount</h4>
              <p className="text-lg font-bold text-primary">₹{order.totalAmount}</p>
            </div>
            <div>
              <h4 className="font-medium">Order Status</h4>
              <StatusBadge status={order.status} />
            </div>
            
            <div className="pt-4 space-y-2">
              <Button 
                className="w-full bg-success text-success-foreground hover:bg-success/90"
                onClick={markOrderDelivered}
              >
                Mark as Delivered
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={cancelOrder}
              >
                Cancel Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}