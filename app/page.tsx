"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Activity, ArrowRight, BarChart3, ChevronRight, Flame, GitFork, MessageCircle, Search, ShieldCheck, Sparkles, Terminal, Users, Zap } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

const samples = ["u/quietlycurious", "u/pixelandpine", "u/slowbuild"];

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function go(event?: FormEvent) {
    event?.preventDefault();
    const clean = username.trim().replace(/^u\//i, "").replace(/^@/, "");
    if (!/^[A-Za-z0-9_-]{3,20}$/.test(clean)) {
      setError("Enter a valid Reddit handle (3-20 chars)");
      return;
    }
    router.push(`/u/${encodeURIComponent(clean)}`);
  }

  return (
    <main className="landing">
      <nav className="landing-nav">
        <a className="brand" href="/">
          <span className="brand-mark"><Activity size={20}/></span>
          <span>reddit<span className="brand-purple">.izer</span></span>
        </a>
        <div className="nav-right">
          <span className="demo-chip"><span className="pulse-dot"/> SYNTHETIC MODE</span>
          <ThemeToggle/>
          <a className="nav-link" href="#features" style={{fontWeight: 600, display: "flex", alignItems: "center", gap: 4}}>
            Features <ChevronRight size={14}/>
          </a>
        </div>
      </nav>

      <section className="hero-wrap">
        <div className="hero-copy">
          <div className="cyber-pill mb-4" style={{display: "inline-flex", marginBottom: 16}}>
            <Sparkles size={13}/> NEXT-GEN REDDIT INTELLIGENCE
          </div>
          <h1>
            Deconstruct Any <br />
            <span className="neon-gradient-text">Reddit Footprint.</span>
          </h1>
          <p className="hero-description">
            Deep-dive into activity trends, sentiment networks, and hidden conversational dynamics with raw precision.
          </p>

          <form className="search-card" onSubmit={go}>
            <div className="search-icon"><Search size={20}/></div>
            <input
              aria-label="Reddit username"
              placeholder="Enter handle (e.g. u/spez or quietlycurious)"
              value={username}
              onChange={e => {setUsername(e.target.value); setError("");}}
            />
            <button className="primary-button" type="submit" style={{boxShadow: "0 0 20px rgba(168,85,247,0.6), 0 0 40px rgba(168,85,247,0.3)"}}>
              EXECUTE <ArrowRight size={16}/>
            </button>
          </form>

          {error && <p className="form-error">{error}</p>}

          <div className="sample-row">
            <span>QUICK TARGETS</span>
            {samples.map(sample => (
              <button
                key={sample}
                onClick={() => {
                  setUsername(sample.replace("u/", ""));
                  router.push(`/u/${sample.replace("u/", "")}`);
                }}
              >
                {sample}
              </button>
            ))}
          </div>

          <div className="prototype-note">
            <ShieldCheck size={16} style={{color: "var(--accent-green)"}}/>
            <span>Synthetic intelligence mode. Zero API scraping. 100% simulated data engine.</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Preview of account analytics dashboard">
          <div className="preview-window">
            <div className="preview-top">
              <div className="window-controls"><i/><i/><i/></div>
              <span>TARGET_ANALYSIS // u/quietlycurious</span>
              <span className="mini-live">LIVE MOCK</span>
            </div>

            <div className="preview-profile">
              <div className="avatar-orb">Q</div>
              <div>
                <strong>u/quietlycurious</strong>
                <span>Active 62 Days · Verified Node</span>
              </div>
              <span className="synthetic-pill">SYNTHETIC</span>
            </div>

            <div className="preview-stats">
              <div>
                <span>POSTS</span>
                <b>24</b>
                <small>Records parsed</small>
              </div>
              <div>
                <span>COMMENTS</span>
                <b>86</b>
                <small>Threads joined</small>
              </div>
              <div>
                <span>COMMUNITIES</span>
                <b>08</b>
                <small>Subreddits mapped</small>
              </div>
            </div>

            <div className="preview-chart-head">
              <span>Velocity vector</span>
              <span>10-Week Window</span>
            </div>

            <div className="preview-chart">
              <div className="chart-grid"><i/><i/><i/><i/></div>
              <svg viewBox="0 0 440 114" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--accent-purple)" stopOpacity=".4"/>
                    <stop offset="1" stopColor="var(--accent-purple)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,86 C30,78 38,59 62,64 S96,96 121,70 S155,48 179,61 S219,46 239,55 S269,24 295,36 S325,74 348,44 S381,50 402,20 S427,31 440,9 V114 H0Z" fill="url(#fill)"/>
                <path d="M0,86 C30,78 38,59 62,64 S96,96 121,70 S155,48 179,61 S219,46 239,55 S269,24 295,36 S325,74 348,44 S381,50 402,20 S427,31 440,9" fill="none" stroke="var(--accent-purple)" strokeWidth="3"/>
              </svg>
            </div>

            <div className="preview-bottom">
              <div><span className="legend-purple"/> Posts <b>24</b></div>
              <div><span className="legend-blue"/> Comments <b>86</b></div>
              <div className="preview-growth"><Zap size={14}/> High engagement</div>
            </div>
          </div>

          <div className="float-card">
            <div className="float-icon"><Flame size={18}/></div>
            <div>
              <strong>Thread Deep-Dive</strong>
              <span>Interactive conversation trees</span>
            </div>
            <GitFork size={18} className="float-fork"/>
          </div>
        </div>
      </section>

      <section id="features" className="feature-section">
        <div className="section-heading">
          <div className="cyber-pill" style={{margin: "0 auto 12px"}}>SYSTEM CAPABILITIES</div>
          <h2>Built for absolute visual dominance.</h2>
          <p>Instantly transform raw Reddit data points into high-density actionable visual intelligence.</p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon purple-icon"><BarChart3 size={22}/></div>
            <h3>Timeline Telemetry</h3>
            <p>Track post spikes, engagement decay, and activity patterns over custom time windows.</p>
            <span className="feature-index">01</span>
          </article>

          <article className="feature-card">
            <div className="feature-icon blue-icon"><Users size={22}/></div>
            <h3>Community Mapping</h3>
            <p>Visualize distribution across subreddits and isolate core interest hubs instantly.</p>
            <span className="feature-index">02</span>
          </article>

          <article className="feature-card">
            <div className="feature-icon teal-icon"><GitFork size={22}/></div>
            <h3>Thread Topology</h3>
            <p>Unravel complex nested conversation trees into clean, expandable UI branches.</p>
            <span className="feature-index">03</span>
          </article>
        </div>
      </section>

      <footer className="landing-footer">
        <a className="brand" href="/">
          <span className="brand-mark"><Activity size={18}/></span>
          <span>reddit<span className="brand-purple">.izer</span></span>
        </a>
        <span>Synthetic Intelligence Prototype · Built for Speed & Precision</span>
        <span>© 2026 REDDIT-IZER</span>
      </footer>
    </main>
  );
}
