import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, DollarSign, Link as LinkIcon, Settings, Shield, Zap } from "lucide-react";

interface FormConfig {
  payment?: {
    enabled: boolean;
    amount: number;
    currency: string;
    description: string;
    type?: string;
    recurring?: boolean;
    interval?: string;
  };
}

interface PaymentIntegrationProps {
  form: FormConfig;
  setForm: (form: FormConfig | ((prev: FormConfig) => FormConfig)) => void;
}

export default function PaymentIntegration({ form, setForm }: PaymentIntegrationProps) {
  const updatePayment = (updates: any) => {
    setForm(prev => ({
      ...prev,
      payment: { ...prev.payment, ...updates }
    }));
  };

  const currencies = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
  ];

  const paymentTypes = [
    { value: "one-time", label: "One-time Payment", description: "Single payment required" },
    { value: "subscription", label: "Subscription", description: "Recurring payments" },
    { value: "donation", label: "Donation", description: "Optional amount" },
    { value: "deposit", label: "Deposit", description: "Partial payment upfront" },
  ];

  return (
    <div className="space-y-6">
      {/* Payment Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Payment Processing</Label>
              <p className="text-sm text-gray-500">Collect payments with this form</p>
            </div>
            <Switch
              checked={form.payment?.enabled || false}
              onCheckedChange={(enabled) => updatePayment({ enabled })}
            />
          </div>
        </CardContent>
      </Card>

      {form.payment?.enabled && (
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Setup</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="links">Payment Links</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {/* Payment Type */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        form.payment?.type === type.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => updatePayment({ type: type.value })}
                    >
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amount and Currency */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={form.payment?.amount || ""}
                        onChange={(e) => updatePayment({ amount: parseFloat(e.target.value) })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select
                      value={form.payment?.currency || "USD"}
                      onValueChange={(currency) => updatePayment({ currency })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Payment Description</Label>
                  <Input
                    id="description"
                    value={form.payment?.description || ""}
                    onChange={(e) => updatePayment({ description: e.target.value })}
                    placeholder="Team registration fee"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Subscription Settings */}
            {form.payment?.type === "subscription" && (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Billing Interval</Label>
                    <Select
                      value={form.payment?.interval || "monthly"}
                      onValueChange={(interval) => updatePayment({ interval })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {/* Stripe Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Stripe Integration</span>
                  <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Stripe provides secure payment processing with industry-leading security standards.
                    Your API keys are safely stored and never exposed to users.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Test Mode</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch defaultChecked />
                      <span className="text-sm text-gray-600">Use test payments</span>
                    </div>
                  </div>
                  <div>
                    <Label>Save Cards</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch />
                      <span className="text-sm text-gray-600">Allow customers to save payment methods</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Accepted Payment Methods</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Visa", "Mastercard", "American Express", "Discover", "Apple Pay", "Google Pay"].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <input type="checkbox" id={method} defaultChecked />
                        <Label htmlFor={method} className="text-sm">{method}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webhooks */}
            <Card>
              <CardHeader>
                <CardTitle>Webhooks & Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://yoursite.com/webhook"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Receive real-time payment notifications
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Email Notifications</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="paymentSuccess" defaultChecked />
                      <Label htmlFor="paymentSuccess" className="text-sm">Payment successful</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="paymentFailed" defaultChecked />
                      <Label htmlFor="paymentFailed" className="text-sm">Payment failed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="refundProcessed" />
                      <Label htmlFor="refundProcessed" className="text-sm">Refund processed</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            {/* Payment Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LinkIcon className="h-5 w-5" />
                  <span>Payment Links</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <LinkIcon className="h-4 w-4" />
                  <AlertDescription>
                    Generate shareable payment links for easy distribution via email, text, or social media.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label>Link Name</Label>
                    <Input placeholder="Team Registration Payment" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiration Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Usage Limit</Label>
                      <Input type="number" placeholder="Unlimited" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Label>Allow custom amounts</Label>
                  </div>

                  <Button className="w-full">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Generate Payment Link
                  </Button>
                </div>

                {/* Generated Links */}
                <div className="space-y-2">
                  <Label>Generated Links</Label>
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Team Registration</div>
                        <div className="text-xs text-gray-500 font-mono">
                          https://pay.teampro.ai/link/abc123
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Copy</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Codes */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-gray-500 text-sm">QR Code</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Generate QR codes for in-person payments
                  </p>
                  <Button variant="outline">Generate QR Code</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}