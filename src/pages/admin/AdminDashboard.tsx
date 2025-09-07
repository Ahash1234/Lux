import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  ArrowUpRight
} from "lucide-react";
import { demoAnalytics, demoOrders } from "@/data/demoData";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: `₹${(demoAnalytics.totalRevenue / 1000).toFixed(0)}K`,
      change: `+${demoAnalytics.revenueGrowth}%`,
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Total Orders",
      value: demoAnalytics.totalOrders.toString(),
      change: `+${demoAnalytics.ordersGrowth}%`,
      trend: "up",
      icon: ShoppingCart
    },
    {
      title: "Products",
      value: demoAnalytics.totalProducts.toString(),
      change: "+12 this month",
      trend: "up",
      icon: Package
    },
    {
      title: "Customers",
      value: demoAnalytics.totalCustomers.toString(),
      change: "+48 this month",
      trend: "up",
      icon: Users
    }
  ];

  const recentOrders = demoOrders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-luxury">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                    )}
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="card-luxury">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">₹{order.total.toLocaleString()}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="card-luxury">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoAnalytics.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.title}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">₹{(product.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <Package className="h-8 w-8 text-luxury-gold mb-2" />
                <h3 className="font-medium text-foreground">Add Product</h3>
                <p className="text-sm text-muted-foreground">Create a new product listing</p>
              </div>
              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <ShoppingCart className="h-8 w-8 text-luxury-gold mb-2" />
                <h3 className="font-medium text-foreground">View Orders</h3>
                <p className="text-sm text-muted-foreground">Manage customer orders</p>
              </div>
              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <Users className="h-8 w-8 text-luxury-gold mb-2" />
                <h3 className="font-medium text-foreground">Customer Analytics</h3>
                <p className="text-sm text-muted-foreground">View customer insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;