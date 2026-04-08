import { useEffect, useState } from "react";
import Dashboard        from "./pages/Dashboard";
import AddSubscription  from "./pages/AddSubscription";
import SubscriptionList from "./pages/SubscriptionList";
import Login            from "./pages/Login";
import Signup           from "./pages/Signup";
import { getUser, clearAuth } from "./utils/auth";

/* ─── CSS ─────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#f8f9fc;--surface:#ffffff;--surface2:#f1f3f8;
  --border:#e4e7f0;--border2:#cdd2e8;
  --text:#0f1523;--text2:#4b5675;--text3:#9aa3bf;
  --accent:#6c63ff;--accent2:#4f46e5;
  --accent-bg:#eeecff;--accent-bd:#c4c0ff;
  --green:#059669;--green-bg:#d1fae5;--green-bd:#6ee7b7;
  --red:#dc2626;--red-bg:#fee2e2;--red-bd:#fca5a5;
  --amber:#d97706;--amber-bg:#fef3c7;--amber-bd:#fcd34d;
  --shadow:0 1px 4px rgba(15,21,35,0.06),0 1px 2px rgba(15,21,35,0.04);
  --shadow-md:0 4px 16px rgba(15,21,35,0.09),0 2px 6px rgba(15,21,35,0.05);
}
[data-theme=dark]{
  --bg:#0c0e17;--surface:#12151f;--surface2:#181c29;
  --border:#1f2438;--border2:#2a3050;
  --text:#e8eaf6;--text2:#8b92b8;--text3:#4a5070;
  --accent:#7c75ff;--accent2:#6c63ff;
  --accent-bg:#1a1840;--accent-bd:#3730a3;
  --green:#34d399;--green-bg:#064e3b;--green-bd:#065f46;
  --red:#f87171;--red-bg:#450a0a;--red-bd:#7f1d1d;
  --amber:#fbbf24;--amber-bg:#451a03;--amber-bd:#78350f;
  --shadow:0 1px 4px rgba(0,0,0,0.4);
  --shadow-md:0 4px 16px rgba(0,0,0,0.5);
}

html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:'Inter',-apple-system,sans-serif;min-height:100vh;overflow-x:hidden;transition:background .2s,color .2s}

::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:99px}

/* Shell */
.shell{display:grid;grid-template-columns:220px 1fr;min-height:100vh}

/* Sidebar */
.sidebar{position:sticky;top:0;height:100vh;overflow-y:auto;background:var(--surface);border-right:1px solid var(--border);padding:18px 10px;display:flex;flex-direction:column;gap:2px;box-shadow:var(--shadow);animation:sideIn .4s cubic-bezier(.16,1,.3,1) both;transition:background .2s,border-color .2s}
.logo{display:flex;align-items:center;gap:9px;padding:6px 10px;margin-bottom:20px}
.logo-mark{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:grid;place-items:center;flex-shrink:0;box-shadow:0 2px 10px rgba(108,99,255,.35)}
.logo-name{font-size:16px;font-weight:700;color:var(--text);letter-spacing:-.3px}
.nav-label{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);padding:12px 10px 4px}
.nav-item{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;font-size:13px;font-weight:500;color:var(--text2);cursor:pointer;transition:all .13s;border:1px solid transparent;user-select:none}
.nav-item:hover{color:var(--text);background:var(--surface2)}
.nav-item.active{color:var(--accent);background:var(--accent-bg);border-color:var(--accent-bd);font-weight:600}
.nav-pip{width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.4;flex-shrink:0;transition:opacity .13s}
.nav-item.active .nav-pip{opacity:1}
.sb-footer{margin-top:auto;padding:14px 10px 0;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:10px}
.user-card{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:9px;background:var(--surface2);border:1px solid var(--border)}
.user-avi{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:grid;place-items:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
.user-info{flex:1;min-width:0}
.user-name{font-size:12px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.user-email{font-size:10px;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.logout-btn{font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;border:1px solid var(--border2);background:transparent;color:var(--text3);cursor:pointer;transition:all .13s;white-space:nowrap}
.logout-btn:hover{background:var(--red-bg);color:var(--red);border-color:var(--red-bd)}
.theme-toggle{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:500;color:var(--text2);cursor:pointer;border:1px solid var(--border);background:var(--surface2);user-select:none;transition:all .13s}
.theme-toggle:hover{border-color:var(--border2);color:var(--text)}
.track{width:32px;height:18px;border-radius:99px;background:var(--border2);position:relative;transition:background .2s;flex-shrink:0}
.track.on{background:var(--accent)}
.thumb{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.track.on .thumb{transform:translateX(14px)}
.live-row{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--text3)}
.live-dot{width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0;animation:beat 2.4s ease infinite}
.sb-ver{font-size:10px;color:var(--text3);padding-left:14px}

/* Topbar */
.right-col{display:flex;flex-direction:column;min-width:0;animation:bodyIn .4s cubic-bezier(.16,1,.3,1) .06s both}
.topbar{position:sticky;top:0;z-index:20;height:58px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;background:var(--surface);border-bottom:1px solid var(--border);box-shadow:var(--shadow);transition:background .2s,border-color .2s}
.tb-left{display:flex;align-items:center;gap:8px}
.tb-eyebrow{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text3)}
.tb-sep{color:var(--border2);font-size:16px}
.tb-title{font-size:15px;font-weight:600;color:var(--text);letter-spacing:-.2px}
.tb-right{display:flex;align-items:center;gap:10px}
.status-pill{font-size:11px;font-weight:600;padding:3px 10px;border-radius:99px;background:var(--green-bg);color:var(--green);border:1px solid var(--green-bd)}
.avi{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:grid;place-items:center;font-size:11px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(108,99,255,.3)}

/* Main */
.main{padding:24px 28px;display:flex;flex-direction:column;gap:18px;background:var(--bg);transition:background .2s}

/* Section card */
.scard{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:var(--shadow);transition:background .2s,border-color .2s,box-shadow .2s}
.scard:hover{box-shadow:var(--shadow-md);border-color:var(--border2)}
.scard-head{display:flex;align-items:center;justify-content:space-between;padding:13px 20px;border-bottom:1px solid var(--border);background:var(--surface2);transition:background .2s}
.scard-hl{display:flex;align-items:center;gap:11px}
.scard-ico{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;flex-shrink:0}
.ico-violet{background:var(--accent-bg);border:1px solid var(--accent-bd)}
.ico-green{background:var(--green-bg);border:1px solid var(--green-bd)}
.ico-red{background:var(--red-bg);border:1px solid var(--red-bd)}
.scard-name{font-size:13px;font-weight:600;color:var(--text)}
.scard-desc{font-size:11px;color:var(--text3);margin-top:1px}
.scard-tag{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:3px 9px;border-radius:99px;border:1px solid var(--border2);color:var(--text3);background:var(--surface)}
.scard-body{padding:20px}

/* Divider */
.divider{display:flex;align-items:center;gap:12px}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
.div-label{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);white-space:nowrap}

/* Global child overrides */
input,select,textarea{background:var(--surface)!important;border:1px solid var(--border)!important;color:var(--text)!important;font-family:'Inter',sans-serif!important;font-size:13.5px!important;padding:9px 12px!important;border-radius:8px!important;outline:none!important;transition:border-color .15s,box-shadow .15s,background .2s!important;width:100%}
input:focus,select:focus,textarea:focus{border-color:var(--accent)!important;box-shadow:0 0 0 3px var(--accent-bg)!important}
input::placeholder{color:var(--text3)!important}
select option{background:var(--surface);color:var(--text)}
label{font-size:11px!important;font-weight:600!important;letter-spacing:.06em!important;text-transform:uppercase!important;color:var(--text3)!important;display:block!important;margin-bottom:5px!important;font-family:'Inter',sans-serif!important}
button{font-family:'Inter',sans-serif!important;font-size:13px!important;font-weight:600!important;padding:9px 18px!important;border-radius:8px!important;border:none!important;cursor:pointer!important;transition:all .14s!important}
button[type=submit]{background:var(--accent)!important;color:#fff!important;box-shadow:0 2px 8px rgba(108,99,255,.25)!important}
button[type=submit]:hover{background:var(--accent2)!important;transform:translateY(-1px)!important;box-shadow:0 6px 16px rgba(108,99,255,.3)!important}
button:not([type=submit]){background:var(--surface2)!important;color:var(--text2)!important;border:1px solid var(--border)!important}
button:not([type=submit]):hover{background:var(--border)!important;color:var(--text)!important}
h1,h2,h3,h4,h5{font-family:'Inter',sans-serif!important;color:var(--text)!important;font-weight:700!important}
p{color:var(--text2);font-size:13.5px;line-height:1.6}
table{width:100%;border-collapse:collapse}
thead th{text-align:left;padding:9px 13px;font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);background:var(--surface2)}
tbody tr{border-bottom:1px solid var(--border);transition:background .1s}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:var(--surface2)}
tbody td{padding:11px 13px;font-size:13.5px;color:var(--text2)}
tbody td:first-child{color:var(--text);font-weight:600}
form{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:end}
form>*:last-child{grid-column:1/-1;display:flex;justify-content:flex-end;gap:8px}
canvas{border-radius:8px}

@keyframes sideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes bodyIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes beat{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.6);opacity:.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}

@media(max-width:860px){
  .shell{grid-template-columns:1fr}
  .sidebar{height:auto;position:static;flex-direction:row;flex-wrap:wrap;padding:10px 12px;gap:4px}
  .logo{margin-bottom:0}
  .nav-label,.sb-footer{display:none}
  .main{padding:16px}
  form{grid-template-columns:1fr}
}
`;

export default function App() {
  const [user, setUser]             = useState(null);
  const [authPage, setAuthPage]     = useState("login");
  const [active, setActive]         = useState("dashboard");
  const [dark, setDark]             = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const onAdded = () => setRefreshKey(k => k + 1);

  // Inject CSS
  useEffect(() => {
    let tag = document.getElementById("st-css");
    if (!tag) { tag = document.createElement("style"); tag.id = "st-css"; document.head.appendChild(tag); }
    tag.textContent = CSS;
  }, []);

  // Dark mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  // Check auth on mount — validate token is still in localStorage
  useEffect(() => {
    const u = getUser();
    const token = localStorage.getItem("st_token");
    if (u && token) setUser(u);
  }, []);

  const go = (id) => {
    setActive(id);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 10);
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setAuthPage("login");
  };

  const ini = (name = "") => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // ── Auth screens ──
  if (!user) {
    return authPage === "login"
      ? <Login  onAuth={setUser} goToSignup={() => setAuthPage("signup")} dark={dark} setDark={setDark} />
      : <Signup onAuth={setUser} goToLogin={() => setAuthPage("login")}   dark={dark} setDark={setDark} />;
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity=".6"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".6"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".3"/>
            </svg>
          </div>
          <span className="logo-name">SubTrack</span>
        </div>

        <div className="user-card">
          <div className="user-avi">{ini(user.name)}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Out</button>
        </div>

        <span className="nav-label">Overview</span>
        <div className={`nav-item ${active === "dashboard" ? "active" : ""}`} onClick={() => go("dashboard")}>
          <span className="nav-pip"/> Dashboard
        </div>

        <span className="nav-label">Manage</span>
        <div className={`nav-item ${active === "add" ? "active" : ""}`} onClick={() => go("add")}>
          <span className="nav-pip"/> Add Subscription
        </div>
        <div className={`nav-item ${active === "list" ? "active" : ""}`} onClick={() => go("list")}>
          <span className="nav-pip"/> All Subscriptions
        </div>

        <span className="nav-label">Insights</span>
        <div className="nav-item" onClick={() => go("dashboard")}><span className="nav-pip"/> Spending Chart</div>
        <div className="nav-item" onClick={() => go("dashboard")}><span className="nav-pip"/> Renewals</div>

        <div className="sb-footer">
          <div className="theme-toggle" onClick={() => setDark(!dark)}>
            <div className={`track ${dark ? "on" : ""}`}><div className="thumb"/></div>
            {dark ? "Dark mode" : "Light mode"}
          </div>
          <div className="live-row"><span className="live-dot"/> All systems operational</div>
          <div className="sb-ver">v1.0.0 · SubTrack</div>
        </div>
      </aside>

      <div className="right-col">
        <header className="topbar">
          <div className="tb-left">
            <span className="tb-eyebrow">SubTrack</span>
            <span className="tb-sep">/</span>
            <span className="tb-title">Subscription Intelligence</span>
          </div>
          <div className="tb-right">
            <span className="status-pill">● Live</span>
            <div className="avi">{ini(user.name)}</div>
          </div>
        </header>

        <main className="main">

          <section id="dashboard" className="scard">
            <div className="scard-head">
              <div className="scard-hl">
                <div className="scard-ico ico-violet">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="7" width="3" height="6" rx="1" fill="var(--accent)"/>
                    <rect x="5.5" y="4" width="3" height="9" rx="1" fill="var(--accent)" opacity=".7"/>
                    <rect x="10" y="1" width="3" height="12" rx="1" fill="var(--accent)" opacity=".4"/>
                  </svg>
                </div>
                <div><div className="scard-name">Dashboard Overview</div><div className="scard-desc">Spending & renewal analytics</div></div>
              </div>
              <span className="scard-tag">Analytics</span>
            </div>
            <div className="scard-body"><Dashboard refreshKey={refreshKey}/></div>
          </section>

          <div className="divider"><span className="div-label">Manage</span></div>

          <section id="add" className="scard">
            <div className="scard-head">
              <div className="scard-hl">
                <div className="scard-ico ico-green">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2v10M2 7h10" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div><div className="scard-name">Add Subscription</div><div className="scard-desc">Track a new service or tool</div></div>
              </div>
              <span className="scard-tag">Create</span>
            </div>
            <div className="scard-body"><AddSubscription onAdded={onAdded}/></div>
          </section>

          <div className="divider"><span className="div-label">Directory</span></div>

          <section id="list" className="scard">
            <div className="scard-head">
              <div className="scard-hl">
                <div className="scard-ico ico-red">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M2 7h10M2 10.5h6" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <div><div className="scard-name">All Subscriptions</div><div className="scard-desc">View, edit & delete active services</div></div>
              </div>
              <span className="scard-tag">Manage</span>
            </div>
            <div className="scard-body"><SubscriptionList refreshKey={refreshKey}/></div>
          </section>

        </main>
      </div>
    </div>
  );
}