import { Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BankSetupHeaderProps {
  onExportDocumentation: () => void;
  onSaveSetup: () => void;
}

const BankSetupHeader = ({ onExportDocumentation, onSaveSetup }: BankSetupHeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Initial Bank Setup</h1>
              <p className="text-sm text-slate-600">Configure portfolio, risk parameters, and materiality assessment</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onExportDocumentation} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Documentation
            </Button>
            <Button onClick={onSaveSetup}>
              Save Setup
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BankSetupHeader;