"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        try {
          const res = await fetch(`http://localhost:8000/api/v1/user/${user.id}/verifications`);
          if (res.ok) {
            const data = await res.json();
            setHistory(data);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };
    fetchUserAndHistory();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-bg text-text p-8">
      <header className="flex justify-between items-center mb-12 border-b border-border pb-4">
        <Link href="/" className="text-3xl font-bold tracking-tight hover:text-accent transition-colors">PROOFCHAIN</Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">{user?.email}</span>
          <button 
            onClick={handleSignOut}
            className="text-sm border border-border px-4 py-2 rounded bg-surface hover:bg-surface-2 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Your Verification History</h2>
        {loading ? (
          <p className="text-muted">Loading history...</p>
        ) : history.length === 0 ? (
          <div className="text-center py-12 bg-surface border border-border rounded-lg">
            <p className="text-muted mb-4">You haven't run any verifications yet.</p>
            <button 
              onClick={() => router.push("/")}
              className="bg-accent text-white px-6 py-2 rounded hover:bg-accent/90 transition-colors"
            >
              Verify a Claim
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((run) => (
              <Link key={run.verification_id} href={`/verify/${run.verification_id}`}>
                <div className="bg-surface border border-border rounded-lg p-6 hover:border-accent transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">{run.original_claim}</p>
                    <span className="text-xs bg-surface-2 px-2 py-1 rounded text-muted font-mono">{run.status}</span>
                  </div>
                  <div className="text-sm text-muted flex gap-4">
                    <span>Coverage: {(run.coverage_score * 100).toFixed(0)}%</span>
                    <span>Claims: {run.claims.length}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
