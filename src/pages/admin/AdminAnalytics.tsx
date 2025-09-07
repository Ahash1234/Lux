import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download
} from "lucide-react";
import { demoAnalytics, demoProducts, demoOrders } from "@/data/demoData";
import { Button } from "@/components/ui/button";

const AdminAnalytics = () => {
  const analytics = demoAnalytics;
  
  // Calculate additional metrics
  const averageOrderValue = analytics.totalRevenue / analytics.totalOrders;
  const conversionRate = (analytics.totalOrders / analytics.totalCustomers) * 100;
  
  // Top performing categories
  const categoryStats = demoProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = { products: 0, revenue: 0 };
    }
    acc[product.category].products += 1;
    acc[product.category].revenue += product.basePrice * (product.stockQuantity - 10); // Simulated sales
    return acc;
  }, {} as Record<string, { products: number; revenue: number }>);

  const topCategories = Object.entries(categoryStats)
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  // Recent activity simulation
  const recentActivity = [
    { action: "New order placed", details: "₹45,000 from Priya Sharma", time: "2 minutes ago" },
    { action: "Product updated", details: "Silk Evening Dress - Stock updated", time: "15 minutes ago" },
    { action: "Order shipped", details: "ORD-002 shipped to Delhi", time: "1 hour ago" },
    { action: "New customer", details: "Vikram Singh registered", time: "2 hours ago" },
    { action: "Payment received", details: "₹76,000 for ORD-003", time: "3 hours ago" }
  ];

  const monthlyStats = [
    { month: "December", revenue: 1247000, orders: 156, growth: 12.5 },
    { month: "November", revenue: 1108000, orders: 142, growth: 8.3 },
    { month: "October", revenue: 1024000, orders: 131, growth: 15.2 },
    { month: "September", revenue: 889000, orders: 118, growth: 6.7 }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Business insights and performance metrics</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-luxury">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{(analytics.totalRevenue / 1000).toFixed(0)}K</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{analytics.revenueGrowth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.totalOrders}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{analytics.ordersGrowth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Order Value
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{averageOrderValue.toFixed(0)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{conversionRate.toFixed(1)}%</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart Placeholder */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Revenue chart would display here</p>
                  <p className="text-sm text-muted-foreground">Showing last 6 months performance</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-lg font-semibold text-foreground">₹247K</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Month</p>
                  <p className="text-lg font-semibold text-foreground">₹219K</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Growth</p>
                  <p className="text-lg font-semibold text-green-600">+12.8%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.title}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">₹{(product.revenue / 1000).toFixed(0)}K</p>
                      <Badge variant="secondary" className="text-xs">
                        {((product.revenue / analytics.totalRevenue) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Performance */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{category.category}</p>
                      <p className="text-sm text-muted-foreground">{category.products} products</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">₹{(category.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Performance */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyStats.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">{month.month}</p>
                      <p className="text-sm text-muted-foreground">{month.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">₹{(month.revenue / 1000).toFixed(0)}K</p>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{month.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-2 h-2 bg-luxury-gold rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold">94%</div>
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold">2.3</div>
                <p className="text-sm text-muted-foreground">Avg Items per Order</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold">18%</div>
                <p className="text-sm text-muted-foreground">Return Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;