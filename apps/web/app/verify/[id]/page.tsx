// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import LatticeLoader from "../../../components/ui/LatticeLoader";
import { ClaimCard } from "../../../components/ui/ClaimCard";
import { EvidenceDrawer } from "../../../components/ui/EvidenceDrawer";

export default function VerifyPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/verifications/${id}/report`);
        const json = await res.json();
        
        if (json.status === "completed") {
          setData(json);
          setLoading(false);
        } else {
          setTimeout(fetchReport, 2000);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchReport();
  }, [id]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="z-10 flex flex-col items-center justify-center">
          <LatticeLoader
            status="working"
            label="Analyzing"
            pattern="orbit"
            grid={4}
            shape="round"
            color="#818CF8"
            doneColor="#22c55e"
            errorColor="#ef4444"
            cellSize={8}
            gap={4}
            fontSize={18}
            step={80}
            idleOpacity={0.15}
            glow={true}
            glowColor="#818CF8"
            showTimer={true}
            style={{ marginBottom: '2rem' }}
          />
          
          <div className="text-white/40 text-sm mt-8 animate-pulse tracking-widest uppercase">
            Constructing Evidence Graph...
          </div>
        </div>
      </div>
    );
  }

  const initialNodes = data.graph.nodes.map((n: any, i: number) => {
    if (n.id === 'root') {
      let hasSupport = false;
      let hasContradiction = false;
      data.claims.forEach((cd: any) => {
        cd.evidence.forEach((e: any) => {
          if (e.relation === 'SUPPORTS' || e.relation === 'PARTIALLY_SUPPORTS') hasSupport = true;
          if (e.relation === 'CONTRADICTS') hasContradiction = true;
        });
      });
      
      let verdict = "UNVERIFIED";
      let vColor = "#9AA5B1"; 
      if (hasSupport && hasContradiction) { verdict = "DISPUTED"; vColor = "#E8A94A"; }
      else if (hasContradiction) { verdict = "FALSE"; vColor = "#E56B6F"; }
      else if (hasSupport) { verdict = "TRUE"; vColor = "#2DBE86"; }

      return {
        id: n.id,
        data: { 
          label: (
            <div className="flex flex-col items-center text-center">
              <span style={{ color: vColor }} className="text-[10px] font-bold uppercase tracking-widest mb-1.5">
                FINAL VERDICT: {verdict}
              </span>
              <span className="text-sm font-medium text-white">{n.label}</span>
              <span className="text-[8px] text-muted mt-2 opacity-70">BASED ON {data.claims.reduce((acc: number, c: any) => acc + c.evidence.length, 0)} RETRIEVED SOURCES</span>
            </div>
          ) 
        },
        position: { x: 300, y: 10 },
        style: {
          background: 'rgba(9, 9, 11, 0.9)',
          border: `2px solid ${vColor}`,
          boxShadow: `0 0 30px ${vColor}30`,
          borderRadius: '12px',
          width: 320,
          padding: '16px 12px'
        }
      };
    }

    return {
      id: n.id,
      data: { label: n.label },
      position: { x: i % 2 === 0 ? 100 : 500, y: i * 120 },
      style: {
        background: n.type === 'claim' ? '#171C22' : n.type === 'evidence' ? '#26303A' : '#11151A',
        color: '#F3F5F7',
        border: n.type === 'evidence' ? '1px solid #6D7CFF' : '1px solid #26303A',
        borderRadius: '8px',
        padding: '12px',
        width: 280,
        fontSize: 12
      }
    };
  });

  const initialEdges = data.graph.edges.map((e: any, i: number) => {
    let stroke = '#9AA5B1'; 
    if (e.type.includes('SUPPORTS')) stroke = '#2DBE86';
    if (e.type.includes('CONTRADICTS')) stroke = '#E56B6F';
    if (e.type.includes('PARTIAL')) stroke = '#E8A94A';
    
    return {
      id: `e${i}`,
      source: e.source,
      target: e.target,
      label: e.type.replace('_BY', ''),
      style: { stroke, strokeWidth: 2 },
      labelStyle: { fill: stroke, fontSize: 10, fontWeight: 700 },
      labelBgStyle: { fill: '#11151A' },
      animated: e.type.includes('DERIVED_FROM')
    };
  });

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden relative">
      <header className="border-b border-border h-16 flex items-center px-6 justify-between bg-surface z-10">
        <div className="flex items-center gap-6">
          <a href="/" className="font-bold tracking-tight text-xl text-white hover:text-accent transition-colors">
            PROOFCHAIN
          </a>
          <a href="/" className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Verify New Claim
          </a>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm flex items-center gap-2 border border-border px-3 py-1.5 rounded-full bg-surface-2">
            <span className="text-muted">Evidence Coverage</span>
            <span className="font-mono font-bold text-accent">{(data.coverage_score * 100).toFixed(0)}%</span>
          </div>
          <button 
            onClick={() => {
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `proofchain-report-${id}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="text-sm flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-lg hover:bg-accent/20 transition-colors border border-accent/20 hover:border-accent/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export JSON
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 min-w-[350px] max-w-[450px] border-r border-border bg-bg overflow-y-auto p-6 space-y-4">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Atomic Claims</h2>
          <div className="space-y-4">
            {data.claims.map((cd: any) => (
              <ClaimCard 
                key={cd.claim.id} 
                claimDetail={cd} 
                onClick={() => setSelectedClaim(cd)} 
              />
            ))}
          </div>
        </div>
        
        <div className="flex-1 bg-surface-2 relative">
          <ReactFlow nodes={initialNodes} edges={initialEdges} fitView attributionPosition="bottom-left">
            <Background color="#26303A" gap={20} size={1} />
            <Controls className="bg-surface border-border fill-text" />
          </ReactFlow>
        </div>
      </div>

      <EvidenceDrawer 
        claimDetail={selectedClaim} 
        onClose={() => setSelectedClaim(null)} 
      />
    </div>
  );
}
