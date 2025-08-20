import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  demoVegetables, 
  demoOrders, 
  demoUsers,
  calculateVegetableRequirements,
  Vegetable,
  Order,
  getUsersByRole
} from "@/data/demoData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ShoppingCart, TrendingUp, Users, Calendar } from "lucide-react";

export default function ManagerDashboard() {
  const [vegetables, setVegetables] = useState<Vegetable[]>(demoVegetables);
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const { toast } = useToast();

  const deliveryEmployees = getUsersByRole('delivery');
  const todaysDate = '2024-08-21';
  const requirements = calculateVegetableRequirements(todaysDate);

  const assignOrderToDelivery = (orderId: string, employeeId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, assignedDeliveryEmployee: employeeId, status: 'assigned' as const }
        : order
    ));
    
    const employee = deliveryEmployees.find(emp => emp.id === employeeId);
    toast({
      title: "Order Assigned",
      description: `Order ${orderId} assigned to ${employee?.name}`,
    });
    // TODO: API call to assign order
    // await assignOrderToDeliveryAPI(orderId, employeeId);
  };

  const [priceUpdates, setPriceUpdates] = useState<Record<string, {minPrice: number, maxPrice: number}>>({});

  const updatePriceInput = (vegId: string, field: 'minPrice' | 'maxPrice', value: number) => {
    setPriceUpdates(prev => ({
      ...prev,
      [vegId]: {
        ...prev[vegId],
        [field]: value
      }
    }));
  };

  const updateVegetablePrices = (vegId: string) => {
    const updates = priceUpdates[vegId];
    if (!updates) return;

    setVegetables(prev => prev.map(veg => 
      veg.id === vegId 
        ? { ...veg, minPrice: updates.minPrice || veg.minPrice, maxPrice: updates.maxPrice || veg.maxPrice }
        : veg
    ));
    
    // Clear the updates for this vegetable
    setPriceUpdates(prev => {
      const newUpdates = { ...prev };
      delete newUpdates[vegId];
      return newUpdates;
    });

    toast({
      title: "Prices Updated",
      description: `Min and max prices updated successfully`,
    });
    // TODO: API call to update vegetable price
    // await updateVegetablePriceAPI(vegId, updates);
  };

  const updateVegetablePrice = (vegId: string, field: 'currentSellingPrice', value: number) => {
    setVegetables(prev => prev.map(veg => 
      veg.id === vegId 
        ? { ...veg, [field]: value }
        : veg
    ));
    toast({
      title: "Price Updated",
      description: `Vegetable price updated successfully`,
    });
    // TODO: API call to update vegetable price
    // await updateVegetablePriceAPI(vegId, field, value);
  };

  const updateBuyStatus = (vegId: string, buyPrice: number, isBought: boolean) => {
    setVegetables(prev => prev.map(veg => 
      veg.id === vegId 
        ? { 
            ...veg, 
            buyPrice: isBought ? buyPrice : undefined,
            isBought,
            buyDate: isBought ? todaysDate : undefined 
          }
        : veg
    ));
    toast({
      title: "Buy Status Updated",
      description: `Vegetable ${isBought ? 'marked as bought' : 'marked as not bought'}`,
    });
    // TODO: API call to update buy status
    // await updateVegetableBuyStatusAPI(vegId, buyPrice, isBought);
  };

  const packedOrders = orders.filter(order => order.status === 'packed');
  const totalOrderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalVegRequired = Object.values(requirements).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Today: {todaysDate}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Ready</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{packedOrders.length}</div>
            <p className="text-xs text-muted-foreground">For delivery assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{totalOrderValue}</div>
            <p className="text-xs text-muted-foreground">All orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{deliveryEmployees.length}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vegetables Needed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{totalVegRequired.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">For today's delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Assign Orders to Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          {packedOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No packed orders available for assignment
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>Assign To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>₹{order.totalAmount}</TableCell>
                    <TableCell>{order.customerAddress}</TableCell>
                    <TableCell>
                      <Select onValueChange={(value) => assignOrderToDelivery(order.id, value)}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select delivery person" />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryEmployees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Vegetable Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Vegetable Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vegetable</TableHead>
                <TableHead>Required Quantity</TableHead>
                <TableHead>Buy Status</TableHead>
                <TableHead>Buy Price</TableHead>
                <TableHead>Current Selling Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vegetables.map((vegetable) => {
                const requiredQty = requirements[vegetable.id] || 0;
                return (
                  <TableRow key={vegetable.id}>
                    <TableCell className="font-medium">{vegetable.name}</TableCell>
                    <TableCell>
                      {requiredQty > 0 ? (
                        <span className="font-medium text-warning">{requiredQty} {vegetable.unit}</span>
                      ) : (
                        <span className="text-muted-foreground">Not required</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={vegetable.isBought ? "default" : "secondary"}>
                        {vegetable.isBought ? "Bought" : "Not Bought"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vegetable.isBought ? `₹${vegetable.buyPrice}` : "-"}
                    </TableCell>
                    <TableCell>₹{vegetable.currentSellingPrice}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (vegetable.isBought) {
                            updateBuyStatus(vegetable.id, 0, false);
                          } else {
                            const buyPrice = prompt("Enter buy price:");
                            if (buyPrice) {
                              updateBuyStatus(vegetable.id, parseFloat(buyPrice), true);
                            }
                          }
                        }}
                      >
                        {vegetable.isBought ? "Mark Not Bought" : "Mark Bought"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Price Management */}
      <Card>
        <CardHeader>
          <CardTitle>Vegetable Price Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vegetable</TableHead>
                <TableHead>Min Price</TableHead>
                <TableHead>Max Price</TableHead>
                <TableHead>Current Selling Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vegetables.map((vegetable) => {
                const currentUpdates = priceUpdates[vegetable.id] || { minPrice: vegetable.minPrice, maxPrice: vegetable.maxPrice };
                return (
                  <TableRow key={vegetable.id}>
                    <TableCell className="font-medium">{vegetable.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={currentUpdates.minPrice}
                        onChange={(e) => updatePriceInput(vegetable.id, 'minPrice', parseFloat(e.target.value))}
                        className="w-20"
                        placeholder={vegetable.minPrice.toString()}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={currentUpdates.maxPrice}
                        onChange={(e) => updatePriceInput(vegetable.id, 'maxPrice', parseFloat(e.target.value))}
                        className="w-20"
                        placeholder={vegetable.maxPrice.toString()}
                      />
                    </TableCell>
                    <TableCell>₹{vegetable.currentSellingPrice}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => updateVegetablePrices(vegetable.id)}
                        disabled={!priceUpdates[vegetable.id]}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}