import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

export function ClaimCard({ claimDetail, onClick }: { claimDetail: any, onClick: () => void }) {
  const claim = claimDetail.claim;
  const evidence = claimDetail.evidence;
  
  const hasSupport = evidence.some((e: any) => e.relation === 'SUPPORTS');
  const hasContradiction = evidence.some((e: any) => e.relation === 'CONTRADICTS');
  const hasPartial = evidence.some((e: any) => e.relation === 'PARTIALLY_SUPPORTS');

  return (
    <div 
      onClick={onClick}
      className="glass-card rounded-xl p-5 cursor-pointer hover:border-accent/80 hover:shadow-[0_0_15px_rgba(129,140,248,0.2)] transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] uppercase tracking-wider text-muted font-mono bg-white/5 px-2 py-1 rounded">
          {claim.id.split('-')[0]}
        </span>
        {hasSupport && !hasContradiction ? (
          <CheckCircle className="text-support w-5 h-5 drop-shadow-[0_0_5px_rgba(45,190,134,0.5)]" />
        ) : hasContradiction && !hasSupport ? (
          <XCircle className="text-contradiction w-5 h-5 drop-shadow-[0_0_5px_rgba(229,107,111,0.5)]" />
        ) : hasPartial && !hasContradiction ? (
          <AlertTriangle className="text-partial w-5 h-5 drop-shadow-[0_0_5px_rgba(232,169,74,0.5)]" />
        ) : hasContradiction && hasSupport ? (
          <div className="flex items-center gap-1">
            <CheckCircle className="text-support w-4 h-4 opacity-70" />
            <XCircle className="text-contradiction w-5 h-5 drop-shadow-[0_0_5px_rgba(229,107,111,0.8)]" />
          </div>
        ) : (
          <HelpCircle className="text-unknown w-5 h-5 opacity-50" />
        )}
      </div>
      
      <p className="text-sm font-medium leading-relaxed text-text/90 group-hover:text-white transition-colors">
        {claim.text}
      </p>

      {hasContradiction && hasSupport && (
        <div className="mt-4 bg-contradiction/10 border border-contradiction/30 rounded-lg p-2 flex items-start gap-2">
          <AlertTriangle className="text-contradiction w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-contradiction uppercase tracking-wider block mb-0.5">Contradiction Radar</span>
            <span className="text-xs text-text/80">Sources explicitly disagree on this claim.</span>
          </div>
        </div>
      )}
      
      <div className="mt-5 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-wider text-muted">
        <span className="flex items-center gap-2">
          Coverage: 
          <span className="font-mono text-accent">{(claimDetail.coverage_score * 100).toFixed(0)}%</span>
        </span>
        <span className="bg-black/30 px-2 py-1 rounded">{evidence.length} sources</span>
      </div>
    </div>
  );
}
