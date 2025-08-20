import { Badge } from "./badge";
import { OrderStatus } from "@/data/demoData";

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 'secondary';
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'packed':
        return 'default';
      case 'assigned':
        return 'default';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 'bg-info text-info-foreground';
      case 'accepted':
        return 'bg-primary text-primary-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'packed':
        return 'bg-warning text-warning-foreground';
      case 'assigned':
        return 'bg-warning text-warning-foreground';
      case 'delivered':
        return 'bg-success text-success-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}