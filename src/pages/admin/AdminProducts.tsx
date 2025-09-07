import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload,
  X,
  ImageIcon 
} from "lucide-react";
import { demoProducts, Product } from "@/data/demoData";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { ref, onValue, set, update as fbUpdate, remove } from "firebase/database";

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  type FormState = {
    title: string;
    description: string;
    category: string;
    gender: 'Men' | 'Women' | undefined;
    sizes: string[];
    colors: string[];
    stockQuantity: string; // empty string when not set
    basePrice: string;     // empty string when not set
    salePrice: string;     // empty string when not set
    discount: string;      // computed, shown disabled
    onSale: boolean;
    images: string[];
    featured: boolean;
    status: Product['status'];
  };

  const [productForm, setProductForm] = useState<FormState>({
    title: "",
    description: "",
    category: "",
    gender: undefined as 'Men' | 'Women' | undefined,
    sizes: [] as string[],
    colors: [] as string[],
    stockQuantity: "",
    basePrice: "",
    salePrice: "",
    discount: "",
    onSale: false,
    images: [] as string[],
    featured: false,
    status: "active" as Product['status']
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = ["Dresses", "Blazers", "Outerwear", "Accessories", "Shoes", "Bags"];
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = ["Black", "White", "Navy", "Grey", "Brown", "Beige", "Red", "Blue"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProduct = async () => {
    const basePriceNum = Number(productForm.basePrice || 0);
    const stockQtyNum = Number(productForm.stockQuantity || 0);
    const salePriceNum = Number(productForm.salePrice || 0);
    const normalizedSalePrice = productForm.onSale ? salePriceNum : 0;
    const computedDiscount = productForm.onSale && basePriceNum > 0 && normalizedSalePrice > 0
      ? Math.max(0, Math.min(100, Math.round((1 - (normalizedSalePrice / basePriceNum)) * 100)))
      : 0;
    const newProduct: Product = {
      id: `${Date.now()}`,
      title: productForm.title,
      description: productForm.description,
      category: productForm.category,
      sizes: productForm.sizes,
      colors: productForm.colors,
      stockQuantity: stockQtyNum,
      basePrice: basePriceNum,
      salePrice: normalizedSalePrice,
      discount: computedDiscount,
      images: productForm.images.length > 0 ? productForm.images : ["/placeholder.svg"],
      featured: productForm.featured,
      status: productForm.status,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    try {
      await set(ref(db, `admin/products/${newProduct.id}`), newProduct);
      setProducts([...products, newProduct]);
      toast({
        title: "Product Created",
        description: "New product has been successfully created.",
      });
    } catch (e) {
      // ignore for demo, optionally show error
    }

    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      category: product.category,
      gender: (product as any).gender,
      sizes: product.sizes || [],
      colors: product.colors || [],
      stockQuantity: product.stockQuantity ? String(product.stockQuantity) : "",
      basePrice: product.basePrice ? String(product.basePrice) : "",
      salePrice: product.salePrice ? String(product.salePrice) : "",
      discount: product.discount ? String(product.discount) : "",
      onSale: !!(product.salePrice && product.salePrice > 0),
      images: product.images || [],
      featured: product.featured,
      status: product.status
    });
    setIsCreateDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    const basePriceNum = Number(productForm.basePrice || 0);
    const stockQtyNum = Number(productForm.stockQuantity || 0);
    const salePriceNum = Number(productForm.salePrice || 0);
    const normalizedSalePrice = productForm.onSale ? salePriceNum : 0;
    const computedDiscount = productForm.onSale && basePriceNum > 0 && normalizedSalePrice > 0
      ? Math.max(0, Math.min(100, Math.round((1 - (normalizedSalePrice / basePriceNum)) * 100)))
      : 0;

    const updatedProducts = products.map(p => 
      p.id === editingProduct.id 
        ? { 
            ...p,
            title: productForm.title,
            description: productForm.description,
            category: productForm.category,
            sizes: productForm.sizes,
            colors: productForm.colors,
            stockQuantity: stockQtyNum,
            basePrice: basePriceNum,
            salePrice: normalizedSalePrice,
            discount: computedDiscount,
            images: productForm.images,
            featured: productForm.featured,
            status: productForm.status,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : p
    );

    const updated = updatedProducts.find(p => p.id === editingProduct.id)!;
    try {
      await fbUpdate(ref(db, `admin/products/${editingProduct.id}`), updated);
      setProducts(updatedProducts);
      toast({
        title: "Product Updated",
        description: "Product has been successfully updated.",
      });
    } catch (e) {
      // ignore for demo
    }

    setEditingProduct(null);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await remove(ref(db, `admin/products/${productId}`));
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted.",
      });
    } catch (e) {
      // ignore for demo
    }
  };

  const resetForm = () => {
    setProductForm({
      title: "",
      description: "",
      category: "",
      gender: undefined,
      sizes: [],
      colors: [],
      stockQuantity: "",
      basePrice: "",
      salePrice: "",
      discount: "",
      onSale: false,
      images: [],
      featured: false,
      status: "active"
    });
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event?: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event?.target?.files;
      if (!files || files.length === 0) return;
      const dataUrls = await Promise.all(Array.from(files).map(readFileAsDataUrl));
      setProductForm(prev => ({
        ...prev,
        images: [...(prev.images || []), ...dataUrls]
      }));
      toast({
        title: "Image Added",
        description: `${files.length} image(s) added to this product.`,
      });
    } catch (e: any) {
      toast({
        title: "Image Read Failed",
        description: e?.message || "Unable to read image(s)",
        variant: "destructive",
      });
    }
  };

  const removeImage = (index: number) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index)
    });
  };

  const toggleSize = (size: string) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.includes(size)
        ? productForm.sizes.filter(s => s !== size)
        : [...productForm.sizes, size]
    });
  };

  const toggleColor = (color: string) => {
    setProductForm({
      ...productForm,
      colors: productForm.colors.includes(color)
        ? productForm.colors.filter(c => c !== color)
        : [...productForm.colors, color]
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Load products from Realtime Database on mount and subscribe to changes
  useEffect(() => {
    const productsRef = ref(db, 'admin/products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const loaded: Product[] = Object.values(val);
        setProducts(loaded);
      }
    }, {
      onlyOnce: false
    });
    return () => unsubscribe();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-luxury" onClick={() => {
                resetForm();
                setEditingProduct(null);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Create New Product"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Product Title</Label>
                    <Input
                      id="title"
                      value={productForm.title}
                      onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                      placeholder="Enter product title"
                      className="input-luxury"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={productForm.category} 
                      onValueChange={(value) => setProductForm({...productForm, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {productForm.category === 'Dresses' && (
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={productForm.gender}
                        onValueChange={(value: 'Men' | 'Women') => setProductForm({...productForm, gender: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Women">Women</SelectItem>
                          <SelectItem value="Men">Men</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="basePrice">Base Price (₹)</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        value={productForm.basePrice}
                        onChange={(e) => setProductForm({...productForm, basePrice: e.target.value})}
                        className="input-luxury"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stockQuantity">Stock Quantity</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        value={productForm.stockQuantity}
                        onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
                        className="input-luxury"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="salePrice">Sale Price (₹)</Label>
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={productForm.onSale}
                            onChange={(e) => setProductForm({ ...productForm, onSale: e.target.checked, salePrice: e.target.checked ? productForm.salePrice : "" })}
                          />
                          <span>On Sale</span>
                        </label>
                      </div>
                      <Input
                        id="salePrice"
                        type="number"
                        disabled={!productForm.onSale}
                        value={productForm.salePrice}
                        onChange={(e) => setProductForm({...productForm, salePrice: e.target.value})}
                        className="input-luxury"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        disabled
                        value={(() => {
                          const bp = Number(productForm.basePrice || 0);
                          const sp = Number(productForm.onSale ? productForm.salePrice || 0 : 0);
                          if (!productForm.onSale || bp <= 0 || sp <= 0) return "";
                          return Math.max(0, Math.min(100, Math.round((1 - (sp / bp)) * 100)));
                        })()}
                        className="input-luxury"
                      />
                    </div>
                  </div>
                </div>

                {/* Variants and Images */}
                <div className="space-y-4">
                  <div>
                    <Label>Available Sizes</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableSizes.map(size => (
                        <Button
                          key={size}
                          type="button"
                          variant={productForm.sizes.includes(size) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Available Colors</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableColors.map(color => (
                        <Button
                          key={color}
                          type="button"
                          variant={productForm.colors.includes(color) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleColor(color)}
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Product Images</Label>
                    <div className="space-y-3 mt-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Images
                      </Button>
                      
                      {productForm.images && productForm.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {productForm.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                <img src={image} alt={`preview-${index}`} className="w-full h-full object-cover" />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={productForm.status} 
                        onValueChange={(value: Product['status']) => setProductForm({...productForm, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="btn-luxury"
                  onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="card-luxury">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input-luxury"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="card-luxury">
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.title}</p>
                          <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">₹{product.basePrice.toLocaleString()}</p>
                        {product.salePrice && product.salePrice > 0 && (
                          <p className="text-sm text-green-600">Sale: ₹{product.salePrice.toLocaleString()}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={product.stockQuantity > 10 ? "text-green-600" : product.stockQuantity > 0 ? "text-yellow-600" : "text-red-600"}>
                        {product.stockQuantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;