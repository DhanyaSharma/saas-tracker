import { useEffect, useState } from "react";
import API from "../services/api";

const PALETTE = ["#6c63ff","#059669","#dc2626","#d97706","#7c3aed","#0891b2","#db2777","#0d9488"];

function ini(name = "") { return name.slice(0, 2).toUpperCase(); }
function pColor(str, all) { const i = all.indexOf(str); return PALETTE[i >= 0 ? i % PALETTE.length : 0]; }

export default function SubscriptionList({ refreshKey }) {
  const [subs, setSubs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchSubs = async () => {
    setLoading(true);
    try { const r = await API.get("/all"); setSubs(r.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteSub = async (id) => {
    setDeleting(id);
    try { await API.delete(`/${id}`); setSubs(p => p.filter(s => s._id !== id)); }
    catch (err) { console.error(err); }
    finally { setDeleting(null); }
  };

  useEffect(() => { fetchSubs(); }, [refreshKey]);

  const allCats = [...new Set(subs.map(s => s.category).filter(Boolean))];
  const total   = subs.reduce((a, s) => a + (s.billingCycle === "yearly" ? s.cost / 12 : Number(s.cost)), 0);
  const autoCount = subs.filter(s => s.autoRenew).length;

  if (loading) return (
    <div style={s.center}><span style={s.spinner}/><span style={s.dim}>Loading…</span></div>
  );

  if (subs.length === 0) return (
    <div style={s.empty}>
      <div style={{ fontSize: 36, opacity: .35 }}>📭</div>
      <div style={s.et}>No subscriptions yet</div>
      <div style={s.eh}>Add your first subscription using the form above</div>
    </div>
  );

  return (
    <div style={s.root}>

      {/* Strip */}
      <div style={s.strip}>
        {[
          { label: "Services", val: subs.length, color: "var(--text)" },
          { label: "Monthly", val: `₹${total.toFixed(0)}`, color: "var(--accent)" },
          { label: "Categories", val: allCats.length, color: "var(--green)" },
          { label: "Auto-Renew", val: autoCount, color: "var(--amber)" },
        ].map((c, i, arr) => (
          <>
            <div key={c.label} style={s.sc}>
              <span style={s.sl}>{c.label}</span>
              <span style={{ ...s.sv, color: c.color }}>{c.val}</span>
            </div>
            {i < arr.length - 1 && <div style={s.sep}/>}
          </>
        ))}
      </div>

      {/* List */}
      <div style={s.list}>
        {subs.map(sub => {
          const color  = pColor(sub.category, allCats);
          const isDel  = deleting === sub._id;
          const isYear = sub.billingCycle === "yearly";
          return (
            <div key={sub._id} style={{ ...s.row, opacity: isDel ? 0.4 : 1 }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ ...s.avatar, background: color + "18", border: `1.5px solid ${color}35`, color }}>
                {ini(sub.name)}
              </div>

              <div style={s.info}>
                <div style={s.name}>
                  {sub.name}
                  {sub.autoRenew && <span style={s.autoTag}>↻ Auto</span>}
                </div>
                <div style={s.meta}>
                  {sub.category && <span style={{ ...s.chip, color, background: color + "12", border: `1px solid ${color}28` }}>{sub.category}</span>}
                  {sub.renewalDate && <span style={s.date}>Renews {new Date(sub.renewalDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                </div>
              </div>

              <div style={s.right}>
                <div style={s.cc}>
                  <span style={s.cost}>₹{sub.cost}</span>
                  <span style={{ ...s.cycle, ...(isYear ? s.cycleY : s.cycleM) }}>{sub.billingCycle}</span>
                </div>
                <button onClick={() => deleteSub(sub._id)} disabled={isDel} style={s.del} title="Delete">
                  {isDel ? "…" : "✕"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  root:   { display: "flex", flexDirection: "column", gap: 14 },
  center: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "32px 0" },
  spinner:{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--border)", borderTop: "2px solid var(--accent)", display: "inline-block", animation: "spin .7s linear infinite" },
  dim:    { fontSize: 13, color: "var(--text3)" },

  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "48px 0", textAlign: "center" },
  et:    { fontSize: 14, fontWeight: 600, color: "var(--text2)" },
  eh:    { fontSize: 12, color: "var(--text3)" },

  strip: { display: "flex", alignItems: "center", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" },
  sc:    { flex: 1, padding: "12px 18px", display: "flex", flexDirection: "column", gap: 3 },
  sep:   { width: 1, height: 36, background: "var(--border)", flexShrink: 0 },
  sl:    { fontSize: 10, fontWeight: 600, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--text3)" },
  sv:    { fontSize: 20, fontWeight: 700, letterSpacing: "-.5px" },

  list:   { display: "flex", flexDirection: "column" },
  row:    { display: "flex", alignItems: "center", gap: 13, padding: "11px 8px", borderRadius: 9, borderBottom: "1px solid var(--border)", transition: "background .1s", cursor: "default" },
  avatar: { width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", fontSize: 11.5, fontWeight: 700, flexShrink: 0, letterSpacing: ".05em" },
  info:   { flex: 1, minWidth: 0 },
  name:   { fontSize: 13.5, fontWeight: 600, color: "var(--text)", marginBottom: 4, display: "flex", alignItems: "center", gap: 7 },

  autoTag: { fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "var(--amber-bg)", color: "var(--amber)", border: "1px solid var(--amber-bd)" },

  meta: { display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" },
  chip: { fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 99 },
  date: { fontSize: 11.5, color: "var(--text3)" },

  right:  { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  cc:     { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
  cost:   { fontSize: 14.5, fontWeight: 700, color: "var(--text)" },
  cycle:  { fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99 },
  cycleM: { background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green-bd)" },
  cycleY: { background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-bd)" },

  del: { width: 30, height: 30, borderRadius: 7, background: "var(--red-bg)", border: "1px solid var(--red-bd)", color: "var(--red)", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 },
};