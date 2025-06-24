import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Star,
  Heart,
  Eye,
  CreditCard,
  Truck,
  Shield,
  Users,
  Brain,
  Zap,
  DollarSign
} from "lucide-react";

interface EquipmentStoreProps {
  categories: any[];
  aiInsights: any;
}

export default function EquipmentStore({ categories, aiInsights }: EquipmentStoreProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const { toast } = useToast();

  // Mock store products
  const products = [
    {
      id: "1",
      name: "Wilson Championship Soccer Ball",
      category: "soccer",
      brand: "Wilson",
      price: 29.99,
      originalPrice: 34.99,
      discount: 15,
      rating: 4.8,
      reviews: 156,
      image: "/api/placeholder/300/300",
      inStock: true,
      quantity: 25,
      description: "Official size and weight soccer ball with synthetic leather construction",
      features: ["FIFA approved", "Machine stitched", "Butyl bladder"],
      sizes: ["Size 3", "Size 4", "Size 5"],
      aiRecommended: true,
      teamDiscount: 20,
      bulkPricing: [
        { min: 10, discount: 10 },
        { min: 20, discount: 15 },
        { min: 50, discount: 25 }
      ]
    },
    {
      id: "2",
      name: "Nike Elite Basketball",
      category: "basketball",
      brand: "Nike",
      price: 45.00,
      originalPrice: 50.00,
      discount: 10,
      rating: 4.6,
      reviews: 89,
      image: "/api/placeholder/300/300",
      inStock: true,
      quantity: 15,
      description: "Professional-grade basketball with superior grip and durability",
      features: ["Full-grain leather", "Regulation size", "Deep channel design"],
      sizes: ["Official Size 7"],
      aiRecommended: false,
      teamDiscount: 15,
      bulkPricing: [
        { min: 5, discount: 8 },
        { min: 10, discount: 12 },
        { min: 25, discount: 20 }
      ]
    },
    {
      id: "3",
      name: "Rawlings Baseball Helmet",
      category: "baseball",
      brand: "Rawlings",
      price: 89.99,
      originalPrice: 99.99,
      discount: 10,
      rating: 4.9,
      reviews: 234,
      image: "/api/placeholder/300/300",
      inStock: true,
      quantity: 8,
      description: "NOCSAE certified batting helmet with superior protection",
      features: ["NOCSAE certified", "Moisture-wicking padding", "Adjustable fit"],
      sizes: ["Small", "Medium", "Large", "XL"],
      aiRecommended: true,
      teamDiscount: 25,
      bulkPricing: [
        { min: 6, discount: 15 },
        { min: 12, discount: 20 },
        { min: 24, discount: 30 }
      ]
    },
    {
      id: "4",
      name: "Team Practice Cones Set",
      category: "training",
      brand: "SportsCone",
      price: 24.99,
      originalPrice: 29.99,
      discount: 17,
      rating: 4.4,
      reviews: 67,
      image: "/api/placeholder/300/300",
      inStock: true,
      quantity: 50,
      description: "Set of 20 durable training cones for practice drills",
      features: ["UV resistant", "Stackable design", "Multiple colors"],
      sizes: ["9-inch height"],
      aiRecommended: true,
      teamDiscount: 10,
      bulkPricing: [
        { min: 3, discount: 12 },
        { min: 6, discount: 18 },
        { min: 12, discount: 25 }
      ]
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any, quantity: number = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTeamDiscount = () => {
    const subtotal = getCartTotal();
    const averageDiscount = cart.reduce((total, item) => 
      total + (item.teamDiscount * item.quantity), 0) / cart.reduce((total, item) => total + item.quantity, 0);
    
    return subtotal * (averageDiscount / 100);
  };

  return (
    <div className="space-y-6">
      {/* AI Store Insights */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-green-600" />
            <span>AI Shopping Intelligence</span>
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Smart Recommendations</span>
              </div>
              <p className="text-sm text-green-700">
                Based on your team's needs and usage patterns
              </p>
            </div>
            
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Best Prices</span>
              </div>
              <p className="text-sm text-blue-700">
                Team discounts up to 30% on bulk orders
              </p>
            </div>
            
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Truck className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-900">Fast Delivery</span>
              </div>
              <p className="text-sm text-purple-700">
                Free shipping on orders over $100
              </p>
            </div>
            
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-900">Safety Certified</span>
              </div>
              <p className="text-sm text-orange-700">
                All products meet safety standards
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="soccer">Soccer</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="baseball">Baseball</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCheckout(true)}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cart.length})
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
                
                {product.aiRecommended && (
                  <Badge className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Pick
                  </Badge>
                )}
                
                {product.discount > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                    -{product.discount}%
                  </Badge>
                )}

                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="w-8 h-8 p-0" onClick={() => setSelectedItem(product)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <CardTitle className="text-base">{product.name}</CardTitle>
                <p className="text-sm text-gray-600">{product.brand}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews})</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-green-600">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>

              {/* Team Discount */}
              {product.teamDiscount > 0 && (
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Team Discount:</strong> {product.teamDiscount}% off bulk orders
                  </p>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {product.inStock ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">In Stock ({product.quantity})</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedItem(product)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              <div>
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded border"></div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                  <p className="text-gray-600">{selectedItem.brand}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(selectedItem.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">({selectedItem.reviews} reviews)</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-green-600">${selectedItem.price}</span>
                  {selectedItem.originalPrice > selectedItem.price && (
                    <span className="text-lg text-gray-500 line-through">${selectedItem.originalPrice}</span>
                  )}
                  {selectedItem.discount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      -{selectedItem.discount}% OFF
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-gray-700">{selectedItem.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-1">
                    {selectedItem.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Available Sizes</h4>
                  <div className="flex space-x-2">
                    {selectedItem.sizes.map((size: string, index: number) => (
                      <Badge key={index} variant="outline">{size}</Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Bulk Pricing</h4>
                  <div className="space-y-1 text-sm">
                    {selectedItem.bulkPricing.map((tier: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>{tier.min}+ items:</span>
                        <span className="font-medium text-green-600">{tier.discount}% off</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    className="flex-1"
                    onClick={() => addToCart(selectedItem)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Shopping Cart Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shopping Cart</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded"></div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Team Discount:</span>
                    <span>-${getTeamDiscount().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${(getCartTotal() - getTeamDiscount()).toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}