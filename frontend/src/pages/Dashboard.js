import { useEffect, useState } from "react";
import API from "../services/api";
import CategoryChart, { CHART_COLORS } from "../components/CategoryChart";

export default function Dashboard({ refreshKey }) {
  const [total, setTotal]       = useState(0);
  const [upcoming, setUpcoming] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading]   = useState(true);

  useEffect(() => { fetchData(); }, [refreshKey]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [t, u, c] = await Promise.all([
        API.get("/total"), API.get("/upcoming"), API.get("/category-breakdown"),
      ]);
      setTotal(t.data.monthlyCost);
      setUpcoming(u.data);
      setCategory(c.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const catCount  = Object.keys(category).length;
  const topCat    = catCount > 0 ? Object.entries(category).sort((a,b) => b[1]-a[1])[0][0] : "—";

  if (loading) return (
    <div style={s.center}><span style={s.spinner}/><span style={s.dim}>Loading analytics…</span></div>
  );

  return (
    <div style={s.root}>

      {/* Stats */}
      <div style={s.stats}>
        {[
          { label: "Monthly Spend", val: `₹${total}`, hint: "normalized to 30 days", color: "var(--accent)" },
          { label: "Renewals Soon", val: upcoming.length, hint: "within next 3 days", color: upcoming.length > 0 ? "var(--red)" : "var(--text3)" },
          { label: "Categories",    val: catCount, hint: `top: ${topCat}`, color: "var(--green)" },
        ].map((st, i) => (
          <div key={i} style={s.stat}>
            <span style={s.statLabel}>{st.label}</span>
            <span style={{ ...s.statVal, color: st.color }}>{st.val}</span>
            <span style={s.statHint}>{st.hint}</span>
          </div>
        ))}
      </div>

      {/* Panels */}
      <div style={s.grid}>

        {/* Renewals */}
        <div style={s.panel}>
          <div style={s.ph}>
            <span style={s.pt}>Upcoming Renewals</span>
            {upcoming.length > 0 && <span style={s.badge}>{upcoming.length} due soon</span>}
          </div>
          <div style={s.pb}>
            {upcoming.length === 0
              ? <div style={s.empty}><span style={{ fontSize: 22, opacity: .4 }}>✓</span><span style={s.emptyTxt}>All clear — no renewals in 3 days</span></div>
              : upcoming.map((sub) => {
                  const days = Math.ceil((new Date(sub.renewalDate) - new Date()) / 86400000);
                  return (
                    <div key={sub._id} style={s.rrow}>
                      <div style={s.rl}>
                        <div style={s.rdot}/>
                        <div>
                          <div style={s.rname}>{sub.name}</div>
                          <div style={s.rdate}>{new Date(sub.renewalDate).toDateString()}</div>
                        </div>
                      </div>
                      <div style={s.rr}>
                        <span style={s.dchip}>{days <= 0 ? "today" : `${days}d`}</span>
                        <span style={s.rcost}>₹{sub.cost}</span>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>

        {/* Chart */}
        <div style={s.panel}>
          <div style={s.ph}>
            <span style={s.pt}>Category Breakdown</span>
            <span style={s.psub}>{catCount} categories</span>
          </div>
          <div style={{ ...s.pb, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {catCount === 0
              ? <div style={s.empty}><span style={{ fontSize: 22, opacity: .4 }}>📊</span><span style={s.emptyTxt}>Add subscriptions to see breakdown</span></div>
              : <>
                  <CategoryChart data={category}/>
                  <div style={s.legend}>
                    {Object.entries(category).map(([name, val], i) => (
                      <div key={name} style={s.li}>
                        <span style={{ ...s.ldot, background: CHART_COLORS[i % CHART_COLORS.length] }}/>
                        <span style={s.lname}>{name}</span>
                        <span style={s.lval}>₹{val}</span>
                      </div>
                    ))}
                  </div>
                </>
            }
          </div>
        </div>

      </div>
    </div>
  );
}

const s = {
  root:    { display: "flex", flexDirection: "column", gap: 16 },
  center:  { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "32px 0" },
  spinner: { width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--border)", borderTop: "2px solid var(--accent)", display: "inline-block", animation: "spin .7s linear infinite" },
  dim:     { fontSize: 13, color: "var(--text3)" },

  stats:     { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  stat:      { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 3 },
  statLabel: { fontSize: 10, fontWeight: 600, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--text3)" },
  statVal:   { fontSize: 30, fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.1 },
  statHint:  { fontSize: 11, color: "var(--text3)", marginTop: 1 },

  grid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  panel: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" },
  ph:    { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 15px", borderBottom: "1px solid var(--border)", background: "var(--surface)" },
  pt:    { fontSize: 12.5, fontWeight: 600, color: "var(--text)" },
  psub:  { fontSize: 11, color: "var(--text3)" },
  badge: { fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red-bd)" },
  pb:    { padding: "14px 15px" },

  empty:    { display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "24px 0" },
  emptyTxt: { fontSize: 12, color: "var(--text3)" },

  rrow:  { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" },
  rl:    { display: "flex", alignItems: "center", gap: 9 },
  rdot:  { width: 6, height: 6, borderRadius: "50%", background: "var(--red)", flexShrink: 0 },
  rname: { fontSize: 13, fontWeight: 600, color: "var(--text)" },
  rdate: { fontSize: 11, color: "var(--text3)", marginTop: 1 },
  rr:    { display: "flex", alignItems: "center", gap: 8 },
  dchip: { fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red-bd)" },
  rcost: { fontSize: 13, fontWeight: 600, color: "var(--text2)" },

  legend: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 14px", width: "100%" },
  li:     { display: "flex", alignItems: "center", gap: 7 },
  ldot:   { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  lname:  { fontSize: 11, color: "var(--text2)", flex: 1 },
  lval:   { fontSize: 11, fontWeight: 600, color: "var(--text)" },
};