import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { demoOrders, Order, OrderItem } from "@/data/demoData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const originalOrder = demoOrders.find(o => o.id === orderId);
  const [order, setOrder] = useState<Order | null>(originalOrder || null);

  if (!order) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Order not found</h2>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Admin Dashboard
        </Button>
      </div>
    );
  }

  const updateOrderField = (field: keyof Order, value: any) => {
    setOrder(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateOrderItem = (itemId: string, field: keyof OrderItem, value: any) => {
    setOrder(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map(item => 
          item.id === itemId ? { ...item, [field]: value } : item
        ),
        totalAmount: prev.items.reduce((sum, item) => {
          const updatedItem = item.id === itemId ? { ...item, [field]: value } : item;
          return sum + (updatedItem.quantity * updatedItem.price);
        }, 0)
      };
    });
  };

  const saveOrder = () => {
    toast({
      title: "Order Updated",
      description: `Order ${orderId} has been updated successfully`,
    });
    // TODO: API call to save order
    // await saveOrderAPI(order);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Order Details - {orderId}</h1>
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
                  <TableHead>Price (₹)</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.vegetableName}
                        onChange={(e) => updateOrderItem(item.id, 'vegetableName', e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateOrderItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order & Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Order & Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={order.customerName}
                onChange={(e) => updateOrderField('customerName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                value={order.customerPhone}
                onChange={(e) => updateOrderField('customerPhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                value={order.customerAddress}
                onChange={(e) => updateOrderField('customerAddress', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={order.deliveryDate}
                onChange={(e) => updateOrderField('deliveryDate', e.target.value)}
              />
            </div>
            <div>
              <Label>Total Amount</Label>
              <p className="text-lg font-bold text-primary">
                ₹{order.totalAmount.toFixed(2)}
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={saveOrder}
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}