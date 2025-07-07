import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Upload, AlertTriangle } from "lucide-react";
import { useBankSetup } from "@/contexts/BankSetupContext";

export const ClientDocumentUpload = () => {
  const { clientData, setClientData, isSetupComplete } = useBankSetup();

  const handleFileUpload = (field: 'financialStatements' | 'climateReports') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setClientData(prev => ({ ...prev, [field]: file }));
  };

  if (!isSetupComplete) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please complete the Bank Setup first to define which ESG risks are material for your institution.
          <br />
          <Button variant="link" className="p-0 h-auto" onClick={() => window.location.href = '/bank-setup'}>
            Go to Bank Setup →
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Client Document Upload
          </CardTitle>
          <CardDescription>
            Upload client documents to analyze against your selected material risks from Bank Setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientData.clientName}
                onChange={(e) => setClientData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Enter client company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="naceCode">NACE Code</Label>
              <Input
                id="naceCode"
                value={clientData.naceCode}
                onChange={(e) => setClientData(prev => ({ ...prev, naceCode: e.target.value }))}
                placeholder="e.g., 64.19 (Other monetary intermediation)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="financialStatements">Financial Statements</Label>
              <Input
                id="financialStatements"
                type="file"
                accept=".pdf,.xlsx,.xls"
                onChange={handleFileUpload('financialStatements')}
              />
              {clientData.financialStatements && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <FileText className="h-3 w-3 mr-1" />
                  {clientData.financialStatements.name}
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="climateReports">Climate Reporting Documents</Label>
              <Input
                id="climateReports"
                type="file"
                accept=".pdf,.xlsx,.xls"
                onChange={handleFileUpload('climateReports')}
              />
              {clientData.climateReports && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <FileText className="h-3 w-3 mr-1" />
                  {clientData.climateReports.name}
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">AI Analysis Ready</h4>
            <p className="text-sm text-blue-700">
              Once you upload client documents, our AI will analyze them against your selected material risks 
              and generate a comprehensive report with specific KPIs for PD adjustment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};