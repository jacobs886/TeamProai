import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch payments data
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["/api/payments"],
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: (paymentData: any) => apiRequest("POST", "/api/payments", paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      toast({
        title: "Payment Request Created",
        description: "Payment request has been successfully created.",
      });
      setShowPaymentForm(false);
    },
  });

  const filteredPayments = payments.filter((payment: any) => {
    const matchesSearch = payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.playerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePayment = (paymentData: any) => {
    createPaymentMutation.mutate(paymentData);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "overdue": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalStats = {
    totalRevenue: payments.filter((p: any) => p.status === "paid").reduce((sum: number, p: any) => sum + p.amount, 0),
    pendingAmount: payments.filter((p: any) => p.status === "pending").reduce((sum: number, p: any) => sum + p.amount, 0),
    overdueAmount: payments.filter((p: any) => p.status === "overdue").reduce((sum: number, p: any) => sum + p.amount, 0),
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <AiPromptHeader />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600">Track fees, registrations, and fundraising</p>
          </div>
          <Button onClick={() => setShowPaymentForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Payment Request
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalStats.totalRevenue)}</p>
                  <p className="text-xs text-gray-600">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalStats.pendingAmount)}</p>
                  <p className="text-xs text-gray-600">Pending Payments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalStats.overdueAmount)}</p>
                  <p className="text-xs text-gray-600">Overdue Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
                <p className="text-gray-600 mb-4">Create your first payment request to get started.</p>
                <Button onClick={() => setShowPaymentForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment: any) => (
              <Card key={payment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{payment.description}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{payment.playerName || "Team Payment"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold">{formatCurrency(payment.amount)}</div>
                        <Badge className={getStatusColor(payment.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(payment.status)}
                            <span>{payment.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  {payment.notes && (
                    <p className="mt-3 text-gray-600 text-sm">{payment.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Payment Form Modal */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent aria-describedby="payment-form-description">
          <DialogHeader>
            <DialogTitle>Create Payment Request</DialogTitle>
            <div id="payment-form-description" className="text-sm text-gray-600">
              Create a new payment request for team fees, equipment, or other expenses.
            </div>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const paymentData = {
                description: formData.get("description"),
                amount: parseFloat(formData.get("amount") as string),
                dueDate: formData.get("dueDate"),
                type: formData.get("type"),
                notes: formData.get("notes"),
              };
              handleCreatePayment(paymentData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input name="description" placeholder="e.g., Registration Fee, Uniform Cost" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input name="amount" type="number" step="0.01" min="0" required />
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input name="dueDate" type="date" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Type</label>
              <select name="type" className="w-full p-2 border rounded-md" required>
                <option value="">Select Type</option>
                <option value="registration">Registration Fee</option>
                <option value="uniform">Uniform/Equipment</option>
                <option value="tournament">Tournament Fee</option>
                <option value="fundraising">Fundraising</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                name="notes"
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Additional payment details..."
              />
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowPaymentForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Payment</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}