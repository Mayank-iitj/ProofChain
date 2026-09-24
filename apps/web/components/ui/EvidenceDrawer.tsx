import { X, Search, AlertCircle, ShieldAlert } from "lucide-react";

export function EvidenceDrawer({ claimDetail, onClose }: { claimDetail: any, onClose: () => void }) {
  if (!claimDetail) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-[450px] glass border-l border-border shadow-2xl flex flex-col z-50 transition-all transform duration-300 translate-x-0">
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-transparent to-white/5">
        <h3 className="font-bold text-lg tracking-tight">Evidence Inspector</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-5 h-5 text-muted hover:text-white" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 space-y-8 no-scrollbar">
        <div className="glass-card rounded-xl p-5 border-t-2 border-t-accent">
          <h4 className="text-[10px] uppercase text-muted font-bold tracking-widest mb-2">Selected Atomic Claim</h4>
          <p className="text-sm text-text leading-relaxed font-medium mb-4">{claimDetail.claim.text}</p>
          
          <div className="bg-black/30 rounded-lg p-3">
            <h5 className="flex items-center gap-2 text-[10px] uppercase text-accent font-bold tracking-widest mb-2">
              <Search className="w-3 h-3" />
              AI Search Strategy
            </h5>
            <ul className="space-y-1.5">
              {claimDetail.claim.search_queries?.map((q: string, i: number) => (
                <li key={i} className="text-xs text-muted font-mono flex items-start gap-2">
                  <span className="text-accent/50 opacity-50">&gt;</span> {q}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {claimDetail.evidence.some((e: any) => e.relation === 'CONTRADICTS') && claimDetail.evidence.some((e: any) => e.relation === 'SUPPORTS') && (
           <div className="bg-contradiction/10 border border-contradiction/30 rounded-xl p-5 shadow-[0_0_20px_rgba(248,113,113,0.15)]">
             <h4 className="flex items-center gap-2 text-xs uppercase text-contradiction font-bold tracking-widest mb-2">
               <ShieldAlert className="w-4 h-4" />
               Contradiction Radar
             </h4>
             <p className="text-sm text-text/80 leading-relaxed">
               Multiple sources have been retrieved that explicitly disagree with each other regarding this claim. Compare the rationales below.
             </p>
           </div>
        )}

        {claimDetail.evidence.map((ev: any, idx: number) => (
          <div key={ev.id || idx} className="glass-card rounded-xl overflow-hidden hover:border-accent/50 transition-colors">
            <div className="bg-white/5 px-5 py-3 border-b border-white/5 flex justify-between items-center">
              <span className={`text-xs font-bold tracking-wider ${ev.relation === 'SUPPORTS' ? 'text-support' : ev.relation === 'CONTRADICTS' ? 'text-contradiction' : 'text-partial'}`}>
                {ev.relation}
              </span>
              <span className="text-xs text-muted font-mono bg-black/40 px-2 py-1 rounded-md">
                {(ev.confidence * 100).toFixed(0)}% CONF
              </span>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h5 className="text-[10px] uppercase text-muted tracking-widest mb-2">Source Passage</h5>
                <p className="text-sm font-serif italic border-l-2 border-accent pl-4 py-1 text-muted">
                  "{ev.passage}"
                </p>
              </div>
              <div>
                <h5 className="text-[10px] uppercase text-muted tracking-widest mb-2">Rationale</h5>
                <p className="text-sm text-text/90 leading-relaxed">{ev.rationale}</p>
              </div>
              
              {ev.unsupported_aspects?.length > 0 && (
                <div className="bg-partial/10 border border-partial/30 rounded-lg p-3">
                  <h5 className="flex items-center gap-1.5 text-[10px] uppercase text-partial font-bold tracking-widest mb-1.5">
                    <AlertCircle className="w-3 h-3" />
                    Evidence Gap Detector
                  </h5>
                  <p className="text-xs text-text/80">
                    This source does not support the following aspects of the claim: <span className="font-mono text-partial/90">{ev.unsupported_aspects.join(', ')}</span>
                  </p>
                </div>
              )}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-medium text-text max-w-[200px] truncate">{ev.source.title}</h5>
                  <p className="text-[10px] text-muted truncate max-w-[200px]">{ev.source.canonical_url}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-accent">Q: {(ev.source.quality_score * 100).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {claimDetail.evidence.length === 0 && (
          <div className="text-sm text-muted italic text-center p-8 glass-card rounded-xl">
            No specific evidence passages retrieved for this atomic claim.
          </div>
        )}
      </div>
    </div>
  );
}
