import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ClientData } from "@/types/bankSetup";

interface PortfolioUploadTabProps {
  clientData: ClientData;
  setClientData: React.Dispatch<React.SetStateAction<ClientData>>;
}

const PortfolioUploadTab = ({ clientData, setClientData }: PortfolioUploadTabProps) => {
  const handleFileUpload = (field: 'financialStatements' | 'climateReports') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setClientData(prev => ({ ...prev, [field]: file }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Portfolio Information</CardTitle>
        <CardDescription>
          Input client details and upload relevant documents for risk assessment
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
              <Badge variant="secondary">{clientData.financialStatements.name}</Badge>
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
              <Badge variant="secondary">{clientData.climateReports.name}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioUploadTab;