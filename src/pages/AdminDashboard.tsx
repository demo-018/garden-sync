import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { 
  demoOrders, 
  demoUsers, 
  Order, 
  User, 
  OrderStatus,
  UserRole 
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

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [users, setUsers] = useState<User[]>(demoUsers);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
    // TODO: API call to update order status
    // await updateOrderStatusAPI(orderId, newStatus);
  };

  const promoteUser = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, role: newRole }
        : user
    ));
    toast({
      title: "User Promoted",
      description: `User promoted to ${newRole}`,
    });
    // TODO: API call to update user role
    // await updateUserRoleAPI(userId, newRole);
  };

  const placedOrders = orders.filter(order => order.status === 'placed');
  const totalOrders = orders.length;
  const totalUsers = users.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{placedOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>{order.deliveryDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/order/${order.id}`)}
                      >
                        View Details
                      </Button>
                      {order.status === 'placed' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            className="bg-success text-success-foreground hover:bg-success/90"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateOrderStatus(order.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.role === 'customer' ? (
                      <Select onValueChange={(value) => promoteUser(user.id, value as UserRole)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Promote to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="packaging">Packaging Employee</SelectItem>
                          <SelectItem value="delivery">Delivery Employee</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : user.role !== 'admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => promoteUser(user.id, 'customer')}
                      >
                        Demote to Customer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}