"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Activity, ArrowRight, BarChart3, ChevronRight, Command, GitFork, MessageCircle, Search, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

const samples = ["u/quietlycurious", "u/pixelandpine", "u/slowbuild"];

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  function go(event?: FormEvent) {
    event?.preventDefault();
    const clean = username.trim().replace(/^u\//i, "").replace(/^@/, "");
    if (!/^[A-Za-z0-9_-]{3,20}$/.test(clean)) { setError("Enter a Reddit username between 3 and 20 characters."); return; }
    router.push(`/u/${encodeURIComponent(clean)}`);
  }

  return <main className="landing">
    <nav className="landing-nav"><a className="brand" href="/"><span className="brand-mark"><Activity size={18}/></span><span>reddit<span className="brand-purple">-izer</span></span></a><div className="nav-right"><span className="demo-chip"><span className="pulse-dot"/> SYNTHETIC DATA</span><ThemeToggle/><a className="nav-link" href="#features">Explore features <ChevronRight size={14}/></a></div></nav>
    <section className="hero-wrap">
      <div className="hero-glow"/>
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={13}/> A clearer view of account activity</div>
        <h1>Make sense of<br/>the <span>conversations.</span></h1>
        <p className="hero-description">A thoughtful look at Reddit activity, community participation, and the threads that connect it all.</p>
        <form className="search-card" onSubmit={go}>
          <div className="search-icon"><Search size={19}/></div><input aria-label="Reddit username" placeholder="Enter a Reddit username" value={username} onChange={e => {setUsername(e.target.value); setError("");}} />
          <button className="primary-button" type="submit">Analyze account <ArrowRight size={16}/></button>
        </form>
        {error && <p className="form-error">{error}</p>}
        <div className="sample-row"><span>TRY A DEMO</span>{samples.map(sample => <button key={sample} onClick={() => {setUsername(sample.replace("u/", "")); router.push(`/u/${sample.replace("u/", "")}`);}}>{sample}</button>)}</div>
        <div className="prototype-note"><ShieldCheck size={15}/><span>This prototype uses synthetic data only. No Reddit accounts are accessed.</span></div>
      </div>
      <div className="hero-visual" aria-label="Preview of account analytics dashboard">
        <div className="preview-window"><div className="preview-top"><div className="window-controls"><i/><i/><i/></div><span>ACCOUNT OVERVIEW</span><span className="mini-live">DEMO</span></div>
          <div className="preview-profile"><div className="avatar-orb">q</div><div><strong>u/quietlycurious</strong><span>Member since April 2019</span></div><span className="synthetic-pill">SYNTHETIC</span></div>
          <div className="preview-stats"><div><span>POSTS</span><b>24</b><small>in sample</small></div><div><span>COMMENTS</span><b>86</b><small>in sample</small></div><div><span>COMMUNITIES</span><b>08</b><small>explored</small></div></div>
          <div className="preview-chart-head"><span>Activity over time</span><span>Last 12 weeks <ChevronRight size={11}/></span></div>
          <div className="preview-chart"><div className="chart-grid"><i/><i/><i/><i/></div><svg viewBox="0 0 440 114" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9883ff" stopOpacity=".28"/><stop offset="1" stopColor="#9883ff" stopOpacity="0"/></linearGradient></defs><path d="M0,86 C30,78 38,59 62,64 S96,96 121,70 S155,48 179,61 S219,46 239,55 S269,24 295,36 S325,74 348,44 S381,50 402,20 S427,31 440,9 V114 H0Z" fill="url(#fill)"/><path d="M0,86 C30,78 38,59 62,64 S96,96 121,70 S155,48 179,61 S219,46 239,55 S269,24 295,36 S325,74 348,44 S381,50 402,20 S427,31 440,9" fill="none" stroke="#a594ff" strokeWidth="2.5"/></svg></div>
          <div className="preview-bottom"><div><span className="legend-purple"/> Posts <b>24</b></div><div><span className="legend-blue"/> Comments <b>86</b></div><div className="preview-growth"><Zap size={12}/> steady activity</div></div>
        </div>
        <div className="float-card"><div className="float-icon"><MessageCircle size={16}/></div><div><strong>Conversations, connected</strong><span>Follow reply threads at a glance</span></div><GitFork size={17} className="float-fork"/></div>
      </div>
    </section>
    <section id="features" className="feature-section"><div className="section-heading"><span className="eyebrow">BUILT FOR CONTEXT</span><h2>More than a list of posts.</h2><p>See the shape of an account’s activity, from community habits to the details inside a conversation.</p></div>
      <div className="feature-grid"><article className="feature-card"><div className="feature-icon purple-icon"><BarChart3 size={19}/></div><h3>Activity at a glance</h3><p>Track posting patterns, participation, and engagement across an account’s activity.</p><span className="feature-index">01</span></article><article className="feature-card"><div className="feature-icon blue-icon"><Users size={19}/></div><h3>Community context</h3><p>Understand where conversations happen and how participation is distributed.</p><span className="feature-index">02</span></article><article className="feature-card"><div className="feature-icon teal-icon"><GitFork size={19}/></div><h3>Threads that connect</h3><p>Explore nested discussions with an interactive, readable conversation view.</p><span className="feature-index">03</span></article></div>
    </section>
    <footer className="landing-footer"><a className="brand" href="/"><span className="brand-mark"><Activity size={16}/></span><span>reddit<span className="brand-purple">-izer</span></span></a><span>Independent portfolio prototype · Synthetic demonstration data</span><span className="footer-copy">© 2026 Reddit-izer</span></footer>
  </main>;
}
