import React from 'react';
import { AlertTriangle } from 'lucide-react';

const FinancialDisclaimer = ({ compact = false }) => {
  return (
    <div className={`rounded-xl border border-amber-200 bg-amber-50/80 p-4 backdrop-blur-sm ${compact ? 'text-xs' : 'text-sm'} text-amber-900`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold mb-1 text-amber-950">Financial Disclaimer</h4>
          <p className="text-amber-800/90 leading-relaxed">
            Jawad Naseeb provides educational and informational content only. Nothing on this website should be considered financial, investment, trading or legal advice. Cryptocurrency and financial markets involve risk. Users should conduct their own research and consult a qualified professional before making financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialDisclaimer;
