// @ts-nocheck
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PromptBar from "../components/ui/PromptBar";
import PillNav from "../components/ui/PillNav";
import { Globe as Globe02Icon, Paperclip as Attachment01Icon, FileText as File02Icon } from 'lucide-react';

export default function Home() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (text: string, options: any) => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, user_id: "anonymous" })
      });
      const data = await res.json();
      if (data.verification_id) {
        router.push(`/verify/${data.verification_id}`);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-white/30 font-sans overflow-x-hidden relative flex flex-col items-center">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#0044ff] opacity-40 blur-[140px] mix-blend-screen" />
        <div className="absolute top-[10%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-[#38bdf8] opacity-20 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-30%] left-[20%] w-[100vw] h-[60vw] rounded-full bg-[#0f172a] opacity-90 blur-[100px]" />
        
        {/* Grain / Noise Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-60 pointer-events-none" />
      </div>

      {/* --- NAVBAR --- */}
      <PillNav
        logo={
          <div className="w-full h-full bg-white flex items-center justify-center rounded-full">
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
        }
        logoAlt="ProofChain"
        items={[
          { label: 'How it Works', href: '#how-it-works' },
          { label: 'Platform', href: '#features' },
          { label: 'Use Cases', href: '#use-cases' }
        ]}
        baseColor="#ffffff"
        pillColor="transparent"
        hoveredPillTextColor="#000000"
        pillTextColor="#ffffff"
      />
      
      {/* --- HERO SECTION --- */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-48 pb-32 flex flex-col items-center justify-center text-center min-h-[90vh]">
        <h1 
          className="text-[4rem] md:text-[5.5rem] lg:text-[7.5rem] leading-[1.05] tracking-tight mb-8 drop-shadow-2xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
        >
          <span className="italic font-light pr-3 text-white">Intelligent</span> 
          <span className="font-normal text-white/90">fact-checking</span>
        </h1>
        
        <p 
          className="text-[16px] md:text-[18px] text-white/70 max-w-2xl mx-auto mb-14 tracking-wide font-light leading-relaxed"
          style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
        >
          Agentic AI that handles the entire evidence journey: from claim decomposition and real-time web retrieval, to contradiction detection and sourcing.
        </p>
        
        <div className="w-full max-w-2xl mx-auto relative group mt-8 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-shadow rounded-2xl">
          <PromptBar
            placeholder="Paste a claim or statement to verify..."
            models={[
              { key: 'strict', name: 'Strict Fact-Check', tag: 'High Precision' },
              { key: 'exploratory', name: 'Exploratory', tag: 'Broad Web' }
            ]}
            efforts={['Fast', 'Standard', 'Deep Dive', 'Forensic']}
            defaultEffort="Standard"
            sources={[
              { key: 'files', name: 'Upload Documents', description: 'PDFs, Word docs', icon: Attachment01Icon, attach: true },
              { key: 'web', name: 'Live Web Search', description: 'DuckDuckGo indexing', icon: Globe02Icon },
              { key: 'docs', name: 'Paste Article', description: 'Raw text dump', icon: File02Icon }
            ]}
            commands={[
              { key: 'verify', name: '/verify', description: 'Run standard verification pipeline' }
            ]}
            busy={loading}
            onSend={handleVerify}
            onEffortChange={undefined}
            onStop={undefined}
            onAttach={undefined}
            onDictate={undefined}
            background="#ffffff"
            color="#000000"
            menuBackground="#ffffff"
            sparkColor="#38bdf8"
            sparkBoost={2}
            width={700}
            radius={24}
            maxRows={8}
          />
        </div>
      </section>

      {/* --- LOGO CLOUD --- */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-32 border-b border-white/10">
        <p className="text-center text-xs font-bold tracking-widest text-white/30 uppercase mb-8">Trusted by investigative teams at</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
          <span className="text-xl font-bold font-serif italic">The Daily Standard</span>
          <span className="text-xl font-bold tracking-tighter">FINANCE<span className="font-light">WIRE</span></span>
          <span className="text-xl font-black tracking-widest">POLITEX</span>
          <span className="text-xl font-bold font-mono">OpenAudit</span>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="relative z-10 w-full max-w-5xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-normal mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>How ProofChain <i className="font-light">thinks</i></h2>
          <p className="text-white/50 max-w-2xl mx-auto">Unlike generic chatbots, ProofChain is an agentic pipeline built specifically for rigorous epistemological validation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent hidden md:block -translate-y-1/2" />
          
          <div className="relative bg-[#020617]/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center">
            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold font-serif">1</div>
            <h3 className="text-xl font-bold mb-3">Decomposition</h3>
            <p className="text-white/50 text-sm leading-relaxed">Breaks down complex paragraphs into testable atomic claims, isolating specific quantities, dates, and subjects.</p>
          </div>
          
          <div className="relative bg-[#020617]/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center">
            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold font-serif">2</div>
            <h3 className="text-xl font-bold mb-3">Targeted Retrieval</h3>
            <p className="text-white/50 text-sm leading-relaxed">Generates highly-specific search engine queries to retrieve live, trusted evidence from authoritative sources across the web.</p>
          </div>

          <div className="relative bg-[#020617]/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center">
            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold font-serif">3</div>
            <h3 className="text-xl font-bold mb-3">Graph Evaluation</h3>
            <p className="text-white/50 text-sm leading-relaxed">Constructs a fully traceable React Flow graph, mapping contradictions and confirming valid evidence mathematically.</p>
          </div>
        </div>
      </section>

      {/* --- PLATFORM FEATURES (BENTO) --- */}
      <section id="features" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 md:row-span-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-white/20 transition-colors">
            <div>
              <div className="inline-flex px-3 py-1 bg-[#E56B6F]/20 text-[#E56B6F] rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#E56B6F]/30">Alert System</div>
              <h3 className="text-3xl font-normal mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}><i>Contradiction</i> Radar</h3>
              <p className="text-white/60 leading-relaxed text-lg max-w-md">The system actively monitors for conflicting sources. If Source A supports a claim but Source B contradicts it, the radar flags the discrepancy immediately in the UI.</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[2rem] p-10 group hover:border-white/20 transition-colors">
            <div className="inline-flex px-3 py-1 bg-[#38bdf8]/20 text-[#38bdf8] rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#38bdf8]/30">Live Data</div>
            <h3 className="text-2xl font-normal mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>Web Intelligence</h3>
            <p className="text-white/60 leading-relaxed">No hallucinated facts. Every single verification is backed by real-time DuckDuckGo search queries and parsed HTML body extraction.</p>
          </div>

          <div className="md:col-span-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[2rem] p-10 group hover:border-white/20 transition-colors">
            <div className="inline-flex px-3 py-1 bg-[#2DBE86]/20 text-[#2DBE86] rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#2DBE86]/30">Transparency</div>
            <h3 className="text-2xl font-normal mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>Evidence Graphs</h3>
            <p className="text-white/60 leading-relaxed">Exportable JSON reports and interactive node-based graphs to trace exactly which sentence came from which URL.</p>
          </div>
        </div>
      </section>

      {/* --- USE CASES --- */}
      <section id="use-cases" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 border-t border-white/10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-normal mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>Built for <i className="font-light text-white/70">critical</i> truth-seeking.</h2>
          <p className="text-white/50 max-w-xl text-lg">ProofChain isn't a chatbot. It is a deterministic fact-checking pipeline designed for professionals whose reputations rely on absolute accuracy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Use Case 1 */}
          <div className="group relative p-10 rounded-[2rem] border border-white/10 bg-[#020617]/40 backdrop-blur-md overflow-hidden hover:bg-white/[0.03] transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-accent/20 transition-colors pointer-events-none" />
            <svg className="w-8 h-8 text-white/40 mb-6 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="M9 18l3-3-3-3"/></svg>
            <h3 className="text-2xl font-normal mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>Journalism & Media</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Instantly verify political statements, check quotes against live news archives, and identify hallucinations in generated copy before hitting publish.
            </p>
          </div>

          {/* Use Case 2 */}
          <div className="group relative p-10 rounded-[2rem] border border-white/10 bg-[#020617]/40 backdrop-blur-md overflow-hidden hover:bg-white/[0.03] transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-support/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-support/20 transition-colors pointer-events-none" />
            <svg className="w-8 h-8 text-white/40 mb-6 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <h3 className="text-2xl font-normal mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>Legal & Compliance</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Audit corporate ESG claims, cross-reference SEC filings, and automatically trace regulatory contradictions hidden deep within multi-page documents.
            </p>
          </div>

          {/* Use Case 3 */}
          <div className="group relative p-10 rounded-[2rem] border border-white/10 bg-[#020617]/40 backdrop-blur-md overflow-hidden hover:bg-white/[0.03] transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#38bdf8]/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-[#38bdf8]/20 transition-colors pointer-events-none" />
            <svg className="w-8 h-8 text-white/40 mb-6 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <h3 className="text-2xl font-normal mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>Academic Research</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Evaluate citations at scale. Decompose complex research papers into verifiable atomic facts and generate evidence trees mapped against live journals.
            </p>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 py-32 text-center">
        <h2 className="text-[3rem] md:text-[5rem] leading-[1.1] tracking-tight mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
          Ready to find the <i className="font-light">truth?</i>
        </h2>
        <p className="text-white/50 text-lg mb-12">Stop guessing. Start proving. Run your first claim now.</p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-white/90 transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          Start Verifying — It's Free
        </button>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 w-full pt-32 pb-16 px-6 flex flex-col items-center overflow-hidden">
        
        {/* Massive Background Text Watermark */}
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 text-[15vw] font-black text-white/[0.03] pointer-events-none select-none tracking-tighter w-full text-center whitespace-nowrap">
          ProofChain
        </div>

        <div className="w-full max-w-7xl bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-10 md:p-14 relative z-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* Logo & Socials (Spans 4 cols) */}
            <div className="md:col-span-12 lg:col-span-5 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-full" />
                </div>
                <span className="font-bold tracking-tight text-2xl text-white">ProofChain</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
                The central hub for investigators to discover, verify, and showcase truthful findings from complex claims. No hallucinations, just facts.
              </p>
              <div className="flex gap-4 items-center">
                <a href="#" className="text-white/40 hover:text-white transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
                <a href="#" className="text-white/40 hover:text-white transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg></a>
                <a href="#" className="text-white/40 hover:text-white transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>
                <a href="#" className="text-white/40 hover:text-white transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
              </div>
            </div>

            {/* Contact Us */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col">
              <h4 className="font-semibold text-white mb-6">Contact Us</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-white/90 mb-1 font-medium text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    Email
                  </div>
                  <a href="mailto:info@proofchain.ai" className="text-white/50 text-sm hover:text-white transition-colors pl-6 block">info@proofchain.ai</a>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-white/90 mb-1 font-medium text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Phone
                  </div>
                  <a href="tel:+18005550199" className="text-white/50 text-sm hover:text-white transition-colors pl-6 block">+1 (800) 555-0199</a>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="md:col-span-4 lg:col-span-2 flex flex-col">
              <h4 className="font-semibold text-white mb-6">Resources</h4>
              <ul className="space-y-4 text-white/50 text-sm">
                <li><a href="/learning-resources" className="hover:text-white transition-colors">Learning Resources</a></li>
                <li><a href="/how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/our-team" className="hover:text-white transition-colors">Our Team</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* For Organizations */}
            <div className="md:col-span-4 lg:col-span-2 flex flex-col">
              <h4 className="font-semibold text-white mb-6">For Organizations</h4>
              <ul className="space-y-4 text-white/50 text-sm">
                <li><a href="/api-access" className="hover:text-white transition-colors">API Access</a></li>
                <li><a href="/integration-guides" className="hover:text-white transition-colors">Integration Guides</a></li>
                <li><a href="/enterprise-support" className="hover:text-white transition-colors">Enterprise Support</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Divider & Legal */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-white/40 text-[13px] gap-6">
            <p>© 2026 ProofChain. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Cancellations & Refunds</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
