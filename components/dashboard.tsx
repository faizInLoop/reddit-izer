"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity as ActivityIcon, BarChart3, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, Download, FileJson2, FileSpreadsheet, GitFork, Lightbulb, Menu, MessageCircle, MessageSquare, Printer, Search, Sparkles, ThumbsUp, TrendingUp, Users, X } from "lucide-react";
import { CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { redditDataProvider } from "@/lib/mock-provider";
import type { Activity, RedditAnalysis } from "@/lib/types";
import { useTheme } from "./theme-provider";
import ThemeToggle from "./theme-toggle";

const DARK_COLORS = ["#a855f7", "#06b6d4", "#10b981", "#ec4899", "#8b5cf6", "#3b82f6", "#f59e0b", "#6366f1"];
const LIGHT_COLORS = ["#9333ea", "#0284c7", "#059669", "#db2777", "#7c3aed", "#2563eb", "#d97706", "#4f46e5"];
const iconFor = { trending: TrendingUp, clock: Clock3, messages: MessageCircle, sparkles: Sparkles };
const fmt = new Intl.NumberFormat("en-US");

function shortDate(value: string) { return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function saveBlob(content: string, name: string, type: string) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); }
function csvEscape(value: string | number) { const str = String(value); return `"${str.replaceAll('"', '""')}"`; }

export default function Dashboard({ username }: { username: string }) {
  const [data, setData] = useState<RedditAnalysis | null>(null);
  const [loadedUsername, setLoadedUsername] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [subreddit, setSubreddit] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const COLORS = theme === "light" ? LIGHT_COLORS : DARK_COLORS;
  const router = useRouter();

  useEffect(() => {
    let active = true;
    setData(null);
    setLoadedUsername("");
    setError("");
    redditDataProvider.getAnalysis(username).then(result => {
      if (active) { setData(result); setLoadedUsername(username); }
    }).catch(() => {
      if (active) setError("We couldn’t prepare this demo profile. Please try again.");
    });
    return () => { active = false; };
  }, [username]);

  const postCount = data?.activities.filter(a => a.type === "post").length ?? 0;
  const commentCount = data?.activities.filter(a => a.type === "comment").length ?? 0;
  const communityCounts = useMemo(() => {
    const m = new Map<string, { total: number; score: number; posts: number }>();
    data?.activities.forEach(a => {
      const x = m.get(a.subreddit) ?? { total: 0, score: 0, posts: 0 };
      x.total++; x.score += a.score; if (a.type === "post") x.posts++;
      m.set(a.subreddit, x);
    });
    return [...m.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.total - a.total);
  }, [data]);

  const topicCounts = useMemo(() => {
    const m = new Map<string, number>();
    data?.activities.forEach(a => m.set(a.topic, (m.get(a.topic) ?? 0) + 1));
    return [...m.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [data]);

  const timeline = useMemo(() => {
    if (!data) return [];
    return Array.from({ length: 10 }, (_, n) => {
      const start = new Date("2026-11-07T12:00:00Z");
      start.setUTCDate(start.getUTCDate() - (9 - n) * 7);
      const end = new Date(start); end.setUTCDate(end.getUTCDate() + 7);
      const week = data.activities.filter(a => { const d = new Date(a.createdAt); return d >= start && d < end; });
      return {
        week: start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
        Posts: week.filter(a => a.type === "post").length,
        Comments: week.filter(a => a.type === "comment").length
      };
    });
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.activities.filter(a => (type === "all" || a.type === type) && (subreddit === "all" || a.subreddit === subreddit) && (!query || `${a.id} ${a.title} ${a.body} ${a.subreddit} ${a.topic}`.toLowerCase().includes(query.toLowerCase()))).sort((a, b) => sort === "score" ? b.score - a.score : sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt));
  }, [data, type, subreddit, query, sort]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const shown = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [query, type, subreddit, sort]);

  function exportJSON() { if (!data) return; const includedConversations = data.conversations.filter(c => filtered.some(a => a.conversationId === c.id)).map(c => ({ ...c, replies: c.replies.filter(reply => filtered.some(a => a.id === reply.id)) })); const { activities: _allActivities, conversations: _allConversations, ...profileAnalysis } = data; saveBlob(JSON.stringify({ dataSource: "Synthetic demonstration data", disclaimer: "Not live Reddit data. No Reddit account was accessed.", exportedAt: new Date().toISOString(), filters: { search: query, activityType: type, subreddit, sort }, ...profileAnalysis, activities: filtered, conversations: includedConversations }, null, 2), `reddit-izer-${username}-analysis.json`, "application/json"); }
  function exportCSV() { if (!data) return; const headers = ["dataSource", "isSynthetic", "id", "type", "subreddit", "title", "body", "createdAt", "score", "comments", "topic", "conversationId", "parentId"]; const rows = filtered.map(a => ["Synthetic demonstration data", "true", a.id, a.type, a.subreddit, a.title, a.body, a.createdAt, a.score, a.comments, a.topic, a.conversationId, a.parentId ?? ""].map(csvEscape).join(",")); saveBlob([headers.join(","), ...rows].join("\r\n"), `reddit-izer-${username}-activity.csv`, "text/csv;charset=utf-8"); }
  function cite(id: string) { setType("all"); setSubreddit("all"); setQuery(id); document.getElementById("activity")?.scrollIntoView({ behavior: "smooth" }); }

  const nav = [{ id: "overview", label: "Overview", icon: BarChart3 }, { id: "communities", label: "Communities", icon: Users }, { id: "activity", label: "Explorer", icon: ActivityIcon }, { id: "conversations", label: "Threads", icon: GitFork }, { id: "insights", label: "Insights", icon: Lightbulb }];

  if ((!data || loadedUsername !== username) && !error) return <main className="dashboard"><div className="loading-state"><div className="loading-inner"><span className="spinner"/><span>Synchronizing synthetic nodes...</span></div></div></main>;
  if (error) return <main className="dashboard"><div className="loading-state"><div className="loading-inner">{error}<button className="export-button" onClick={() => location.reload()}>Try again</button></div></div></main>;
  if (!data) return null;

  return (
    <main className="dashboard">
      <div className="dash-layout">
        <aside className="sidebar">
          <a className="brand side-brand" href="/">
            <span className="brand-mark"><ActivityIcon size={20}/></span>
            <span>reddit<span className="brand-purple">.izer</span></span>
          </a>
          <div className="workspace-label">ACCOUNT INTELLIGENCE</div>
          {nav.map(({ id, label, icon: Icon }, i) => (
            <a key={id} className={`side-link ${i === 0 ? "active" : ""}`} href={`#${id}`}>
              <Icon size={18}/>{label}
            </a>
          ))}
          <div className="sidebar-bottom">
            <div className="privacy-card">
              <div className="privacy-card-head"><span className="pulse-dot"/> SYNTHETIC MODE</div>
              <p>Simulated environment. No real Reddit data is accessed.</p>
            </div>
            <div className="side-user">
              <div className="side-avatar">{username.charAt(0).toUpperCase()}</div>
              <div>
                <strong>u/{username}</strong>
                <span>Node Active</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="dash-main">
          <header className="topbar">
            <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={18}/></button>
            <div className="breadcrumb">Targets <ChevronRight size={14}/> <b>u/{username}</b></div>
            <div className="top-actions">
              <span className="demo-label">● DEMO DATA</span>
              <ThemeToggle/>
              <button className="export-button" onClick={() => window.print()}><Printer size={16}/><span>Print</span></button>
              <button className="export-button" onClick={exportJSON}><Download size={16}/><span>Export</span></button>
            </div>
          </header>

          <div className="dash-content">
            <div className="notice-strip"><Sparkles size={16}/> Synthetic generation mode active. Data is simulated for demonstration.</div>

            <section id="overview" className="section-block section-anchor">
              <div className="profile-heading">
                <div className="profile-title-row">
                  <div className="profile-avatar">{username.charAt(0).toUpperCase()}</div>
                  <div>
                    <h1>u/{username}<span className="synthetic-pill">SYNTHETIC</span></h1>
                    <p>{data.profile.description}</p>
                    <div className="account-age">Member since {new Date(data.profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}</div>
                  </div>
                </div>
                <button className="export-button" onClick={() => router.push("/")}><Search size={16}/> New Target</button>
              </div>

              <div className="metrics-grid">
                <Metric icon={<MessageSquare size={18}/>} label="Total Posts" value={postCount} foot="Synthetic sample count"/>
                <Metric icon={<MessageCircle size={18}/>} label="Total Comments" value={commentCount} foot="Thread depth participation"/>
                <Metric icon={<Users size={18}/>} label="Communities" value={communityCounts.length} foot="Subreddits analyzed"/>
                <Metric icon={<ThumbsUp size={18}/>} label="Engagement" value={data.activities.reduce((sum, a) => sum + a.score, 0)} foot="Simulated impact score"/>
              </div>

              <div className="chart-grid-two">
                <div className="panel">
                  <div className="panel-title"><strong>Activity timeline</strong><span><CalendarDays size={14}/> Weekly vector</span></div>
                  <div className="legend-row"><span><i className="legend-dot" style={{background: COLORS[0]}}/> Posts</span><span><i className="legend-dot" style={{background: COLORS[1]}}/> Comments</span></div>
                  <div className="chart-area">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="week" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false}/>
                        <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false}/>
                        <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}/>
                        <Line type="monotone" dataKey="Posts" stroke={COLORS[0]} strokeWidth={3} dot={false} activeDot={{ r: 6 }}/>
                        <Line type="monotone" dataKey="Comments" stroke={COLORS[1]} strokeWidth={3} dot={false} activeDot={{ r: 6 }}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-title"><strong>Activity distribution</strong><span>Record density</span></div>
                  <div className="chart-area">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{name:"Posts", value:postCount},{name:"Comments",value:commentCount}]} dataKey="value" innerRadius={60} outerRadius={85} paddingAngle={8} stroke="none">
                          {[COLORS[0],COLORS[1]].map((c,i)=><Cell key={i} fill={c}/>)}
                        </Pie>
                        <Tooltip contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"12px"}}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            <section id="communities" className="section-block section-anchor">
              <div className="section-title"><h2>Community Intelligence</h2><span>Distribution Analysis</span></div>
              <div className="panel">
                <div className="community-layout">
                  <div>
                    <div className="panel-title"><strong>Active Subreddits</strong><span>Volume & Score</span></div>
                    {communityCounts.slice(0,6).map((c,i)=>(
                      <div className="community-row" key={c.name}>
                        <div>
                          <div className="community-name">r/{c.name}</div>
                          <div className="community-meta">{c.posts} posts · {Math.round(c.score/c.total)} avg score</div>
                        </div>
                        <div className="community-track">
                          <div className="community-fill" style={{width:`${Math.max(9,c.total/communityCounts[0].total*100)}%`}}/>
                        </div>
                        <div className="community-count">{c.total}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="panel-title"><strong>Topic Vectors</strong><span>Activity Clusters</span></div>
                    <div className="topics-list">
                      {topicCounts.slice(0,8).map((t,i)=>(
                        <div className="topic-card" key={t.name}>
                          <span>{t.name}</span><b>{t.count}</b>
                          <div className="topic-track"><i style={{width:`${Math.max(10,t.count/topicCounts[0].count*100)}%`,background:COLORS[i%COLORS.length]}}/></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="activity" className="section-block section-anchor">
              <div className="section-title"><h2>Activity Explorer</h2><span>{filtered.length} Indexed Logs</span></div>
              <div className="panel">
                <div className="activity-toolbar">
                  <label className="table-search">
                    <Search size={16}/>
                    <input aria-label="Search activities" value={query} placeholder="Filter logs..." onChange={e=>setQuery(e.target.value)}/>
                  </label>
                  <select className="filter-select" value={type} onChange={e=>setType(e.target.value)}>
                    <option value="all">All Event Types</option>
                    <option value="post">Posts Only</option>
                    <option value="comment">Comments Only</option>
                  </select>
                  <select className="filter-select" value={subreddit} onChange={e=>setSubreddit(e.target.value)}>
                    <option value="all">All Subreddits</option>
                    {communityCounts.map(c=><option key={c.name} value={c.name}>r/{c.name}</option>)}
                  </select>
                  <select className="filter-select" value={sort} onChange={e=>setSort(e.target.value)}>
                    <option value="newest">Recent First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="score">Highest Score</option>
                  </select>
                </div>

                {shown.length ? (
                  <>
                    <div style={{overflowX:"auto"}}>
                      <table className="activity-table">
                        <thead>
                          <tr><th>TYPE</th><th>CONTENT NODE</th><th>SUBREDDIT</th><th>DATE</th><th>SCORE</th><th>REPLIES</th></tr>
                        </thead>
                        <tbody>
                          {shown.map(a=>(
                            <tr key={a.id}>
                              <td><span className={`type-pill ${a.type}`}>{a.type === "post" ? "Post" : a.parentId ? "Reply" : "Comment"}</span></td>
                              <td><div className="activity-title"><b>{a.title}</b><span>{a.body}</span></div></td>
                              <td className="subreddit-label">r/{a.subreddit}</td>
                              <td>{shortDate(a.createdAt)}</td>
                              <td>↑ {a.score}</td>
                              <td>{a.comments}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="table-footer">
                      <span>Showing {Math.min(filtered.length,(page-1)*pageSize+1)}–{Math.min(filtered.length,page*pageSize)} of {filtered.length} nodes</span>
                      <div className="pagination">
                        <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft size={14}/></button>
                        <span style={{padding:"6px 10px", fontWeight:600}}>{page} / {totalPages}</span>
                        <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}><ChevronRight size={14}/></button>
                      </div>
                    </div>
                  </>
                ) : <div className="empty-state">No telemetry data matches your query filters.</div>}
              </div>
            </section>

            <section id="conversations" className="section-block section-anchor">
              <div className="section-title"><h2>Thread Topology</h2><span>Nested Trees</span></div>
              <div className="conversation-grid">
                {data.conversations.slice(0,6).map(conversation=>{
                  const replies=conversation.replies;
                  const isCollapsed=collapsed.includes(conversation.id);
                  const depth=Math.max(0,...replies.map(r=>r.parentId?1:0));
                  return (
                    <article className="conversation-card" key={conversation.id}>
                      <div className="conversation-root">
                        <div className="thread-meta">
                          <span className="thread-root-tag">ROOT</span>
                          <span>r/{conversation.post.subreddit}</span><span>·</span><span>{shortDate(conversation.post.createdAt)}</span>
                        </div>
                        <strong>{conversation.post.title}</strong>
                        <p>{conversation.post.body}</p>
                        <div className="thread-actions">
                          <span><ThumbsUp size={12}/>{conversation.post.score}</span>
                          <span><MessageCircle size={12}/>{replies.length} replies</span>
                          <span><GitFork size={12}/>Depth {depth+1}</span>
                        </div>
                      </div>
                      {!isCollapsed && (
                        <div className="thread-list">
                          {replies.map(reply=>(
                            <div className={`thread-node ${reply.parentId!==conversation.id?"nested":""}`} key={reply.id}>
                              <div className="thread-author">{reply.parentId===conversation.id?"u/node_alpha":"u/node_beta"} <i>· {shortDate(reply.createdAt)}</i></div>
                              <div className="thread-body">{reply.body}</div>
                              <div className="thread-node-bottom"><span>↑ {reply.score}</span></div>
                            </div>
                          ))}
                        </div>
                      )}
                      <button className="thread-collapse" onClick={()=>setCollapsed(prev=>isCollapsed?prev.filter(id=>id!==conversation.id):[...prev,conversation.id])}>
                        {isCollapsed?"Expand":"Collapse"} {replies.length} Nodes
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            <section id="insights" className="section-block section-anchor">
              <div className="section-title"><h2>Automated Synthetics</h2><span>Inferred Intelligence</span></div>
              <div className="insight-grid">
                {data.insights.map(insight=>{
                  const Icon=iconFor[insight.icon];
                  return (
                    <article className="insight-card" key={insight.title}>
                      <div className="insight-head">
                        <div className="insight-icon"><Icon size={18}/></div>
                        <h3>{insight.title}</h3>
                      </div>
                      <p>{insight.description}</p>
                      <div className="evidence">
                        <span className="evidence-label">NODES</span>
                        {insight.evidence.map(id=><button key={id} onClick={()=>cite(id)}>{id}</button>)}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function Metric({icon,label,value,foot}:{icon:React.ReactNode;label:string;value:number;foot:string}){
  return (
    <div className="metric-card">
      <div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div>
      <div className="metric-value">{fmt.format(value)}</div>
      <div className="metric-foot">{foot}</div>
    </div>
  )
}
