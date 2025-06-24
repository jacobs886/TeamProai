import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  Receipt,
  ShoppingCart,
  Brain,
  Zap,
  Shield,
  Wallet
} from "lucide-react";

interface PaymentCenterProps {
  childId: string;
  aiInsights: any;
}

export default function PaymentCenter({ childId, aiInsights }: PaymentCenterProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { toast } = useToast();

  // Mock payment data
  const paymentHistory = [
    {
      id: "pay_001",
      description: "Monthly Team Fee - July 2024",
      amount: 45.00,
      dueDate: "2024-07-01",
      paidDate: "2024-06-28",
      status: "paid",
      method: "Credit Card (*4567)",
      receipt: "R-2024-07-001",
      category: "team_fee",
      recurringId: "rec_monthly_001"
    },
    {
      id: "pay_002",
      description: "Tournament Registration Fee",
      amount: 125.00,
      dueDate: "2024-07-15",
      paidDate: "2024-07-10",
      status: "paid",
      method: "PayPal",
      receipt: "R-2024-07-002",
      category: "tournament",
      recurringId: null
    },
    {
      id: "pay_003",
      description: "Equipment Package - Summer Uniform",
      amount: 89.99,
      dueDate: "2024-07-20",
      paidDate: null,
      status: "pending",
      method: null,
      receipt: null,
      category: "equipment",
      recurringId: null
    },
    {
      id: "pay_004",
      description: "Monthly Team Fee - August 2024",
      amount: 45.00,
      dueDate: "2024-08-01",
      paidDate: null,
      status: "upcoming",
      method: "Auto-pay (Credit Card)",
      receipt: null,
      category: "team_fee",
      recurringId: "rec_monthly_001"
    }
  ];

  // Mock balance and summary data
  const paymentSummary = {
    currentBalance: 134.99,
    totalPaid: 295.00,
    upcomingPayments: 45.00,
    nextPaymentDate: "2024-08-01",
    autoPayEnabled: true,
    preferredMethod: "Credit Card (*4567)"
  };

  // Mock equipment store items
  const storeItems = [
    {
      id: "item_001",
      name: "Team Practice Jersey",
      description: "Official team practice jersey with player name",
      price: 29.99,
      category: "uniform",
      inStock: true,
      image: "/api/placeholder/150/150",
      personalizedOptions: ["Player Name", "Number"],
      aiRecommended: true
    },
    {
      id: "item_002",
      name: "Team Water Bottle",
      description: "Insulated water bottle with team logo",
      price: 15.99,
      category: "accessories",
      inStock: true,
      image: "/api/placeholder/150/150",
      personalizedOptions: [],
      aiRecommended: false
    },
    {
      id: "item_003",
      name: "Shin Guards - Youth Small",
      description: "Lightweight protective shin guards",
      price: 24.99,
      category: "protective",
      inStock: false,
      image: "/api/placeholder/150/150",
      personalizedOptions: [],
      aiRecommended: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "overdue": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "upcoming": return <Calendar className="h-4 w-4 text-blue-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "team_fee": return "bg-blue-100 text-blue-800";
      case "tournament": return "bg-purple-100 text-purple-800";
      case "equipment": return "bg-orange-100 text-orange-800";
      case "fundraising": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPayments = paymentHistory.filter(payment => {
    if (filterStatus === "all") return true;
    return payment.status === filterStatus;
  });

  const handlePayNow = (paymentId: string) => {
    toast({
      title: "Payment Processing",
      description: "Redirecting to secure payment portal...",
    });
  };

  const handleSetupAutoPay = () => {
    toast({
      title: "Auto-Pay Setup",
      description: "Auto-pay has been configured for monthly payments.",
    });
  };

  const handleDownloadReceipt = (receiptId: string) => {
    toast({
      title: "Receipt Downloaded",
      description: "Payment receipt has been downloaded to your device.",
    });
  };

  const handleAddToCart = (itemId: string) => {
    toast({
      title: "Added to Cart",
      description: "Item has been added to your shopping cart.",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Payment Intelligence */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Payment Intelligence</span>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
              PREMIUM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Fraud Protection:</strong> AI monitors transactions for suspicious activity and alerts
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart Recommendations:</strong> AI suggests equipment based on your child's needs and size
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Payment Reminders:</strong> Never miss a due date with intelligent notification scheduling
              </AlertDescription>
            </Alert>
            
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                <strong>Budget Insights:</strong> Track spending patterns and get cost-saving recommendations
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${paymentSummary.currentBalance}</p>
                <p className="text-xs text-gray-600">Current Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${paymentSummary.totalPaid}</p>
                <p className="text-xs text-gray-600">Total Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${paymentSummary.upcomingPayments}</p>
                <p className="text-xs text-gray-600">Next Payment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-lg font-bold text-gray-900">
                  {paymentSummary.autoPayEnabled ? "Enabled" : "Disabled"}
                </p>
                <p className="text-xs text-gray-600">Auto-Pay Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Payments */}
      {paymentHistory.filter(p => p.status === "pending" || p.status === "overdue").length > 0 && (
        <Card className="border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Outstanding Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentHistory.filter(p => p.status === "pending" || p.status === "overdue").map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-red-900">{payment.description}</p>
                    <p className="text-sm text-red-700">
                      Due: {new Date(payment.dueDate).toLocaleDateString()} • ${payment.amount}
                    </p>
                  </div>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handlePayNow(payment.id)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment History</CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="upcoming">Upcoming</option>
              </select>
              {!paymentSummary.autoPayEnabled && (
                <Button variant="outline" size="sm" onClick={handleSetupAutoPay}>
                  <Zap className="h-4 w-4 mr-2" />
                  Setup Auto-Pay
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(payment.status)}
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                      {payment.paidDate && (
                        <span>Paid: {new Date(payment.paidDate).toLocaleDateString()}</span>
                      )}
                      {payment.method && (
                        <span>Method: {payment.method}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-lg font-bold">${payment.amount}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                      <Badge className={getCategoryColor(payment.category)} variant="outline">
                        {payment.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {payment.status === "pending" && (
                      <Button size="sm" onClick={() => handlePayNow(payment.id)}>
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pay
                      </Button>
                    )}
                    
                    {payment.receipt && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReceipt(payment.receipt)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Store */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Team Store</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {storeItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    {item.aiRecommended && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Pick
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">${item.price}</span>
                    <Badge variant={item.inStock ? "default" : "secondary"}>
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  
                  {item.personalizedOptions.length > 0 && (
                    <div className="text-xs text-blue-600">
                      Personalization: {item.personalizedOptions.join(", ")}
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    disabled={!item.inStock}
                    onClick={() => handleAddToCart(item.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent className="max-w-2xl" aria-describedby="payment-details-description">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span>Payment Details</span>
              </DialogTitle>
              <div id="payment-details-description" className="sr-only">
                View detailed payment information including amount, due date, and payment history.
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="text-sm space-y-1">
                    <div>Description: {selectedPayment.description}</div>
                    <div>Amount: ${selectedPayment.amount}</div>
                    <div>Due Date: {new Date(selectedPayment.dueDate).toLocaleDateString()}</div>
                    {selectedPayment.paidDate && (
                      <div>Paid Date: {new Date(selectedPayment.paidDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status & Method</h4>
                  <div className="text-sm space-y-2">
                    <Badge className={getStatusColor(selectedPayment.status)}>
                      {selectedPayment.status}
                    </Badge>
                    {selectedPayment.method && (
                      <div>Payment Method: {selectedPayment.method}</div>
                    )}
                    {selectedPayment.receipt && (
                      <div>Receipt: {selectedPayment.receipt}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                {selectedPayment.receipt && (
                  <Button variant="outline" className="flex-1" onClick={() => handleDownloadReceipt(selectedPayment.receipt)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                )}
                {selectedPayment.status === "pending" && (
                  <Button className="flex-1" onClick={() => handlePayNow(selectedPayment.id)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}