import { useState } from "react";
import API from "../services/api";

const CATEGORIES = ["Entertainment","Education","Productivity","Health","Finance","Developer Tools","Other"];

export default function AddSubscription({ onAdded }) {
  const [form, setForm] = useState({
    name: "", cost: "", billingCycle: "monthly",
    category: "", startDate: "", renewalDate: "", autoRenew: false,
  });
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const reset = () => setForm({ name: "", cost: "", billingCycle: "monthly", category: "", startDate: "", renewalDate: "", autoRenew: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus(null);
    try {
      await API.post("/add", form);
      setStatus("success");
      reset();
      if (onAdded) onAdded();
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally { setLoading(false); }
  };

  return (
    <div style={s.root}>
      {status && (
        <div style={{ ...s.toast, ...(status === "success" ? s.ok : s.bad) }}>
          {status === "success" ? "✓ Subscription added!" : "✕ Something went wrong. Try again."}
        </div>
      )}

      <form onSubmit={handleSubmit} style={s.grid}>

        <div style={s.field}>
          <label style={s.lbl}>Service Name</label>
          <input name="name" value={form.name} placeholder="e.g. Netflix, Notion…" onChange={handleChange} required style={s.inp}/>
        </div>

        <div style={s.field}>
          <label style={s.lbl}>Cost (₹)</label>
          <div style={{ position: "relative" }}>
            <span style={s.pfx}>₹</span>
            <input name="cost" type="number" value={form.cost} placeholder="0.00" onChange={handleChange} required style={{ ...s.inp, paddingLeft: 26 }}/>
          </div>
        </div>

        <div style={s.field}>
          <label style={s.lbl}>Billing Cycle</label>
          <div style={{ position: "relative" }}>
            <select name="billingCycle" value={form.billingCycle} onChange={handleChange} style={s.inp}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <span style={s.arr}>▾</span>
          </div>
        </div>

        <div style={s.field}>
          <label style={s.lbl}>Category</label>
          <div style={{ position: "relative" }}>
            <select name="category" value={form.category} onChange={handleChange} style={s.inp}>
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span style={s.arr}>▾</span>
          </div>
        </div>

        <div style={s.field}>
          <label style={s.lbl}>Start Date</label>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required style={s.inp}/>
        </div>

        <div style={s.field}>
          <label style={s.lbl}>Renewal Date</label>
          <input name="renewalDate" type="date" value={form.renewalDate} onChange={handleChange} required style={s.inp}/>
        </div>

        {/* Auto-renew toggle — full width */}
        <div style={s.autoRow}>
          <div style={s.autoLeft}>
            <div style={s.autoTitle}>Auto-Renewal</div>
            <div style={s.autoDesc}>
              Mark this subscription as auto-renewing. You'll be reminded before each renewal date.
            </div>
          </div>
          <div
            style={{ ...s.toggle, background: form.autoRenew ? "var(--accent)" : "var(--border2)" }}
            onClick={() => setForm({ ...form, autoRenew: !form.autoRenew })}
          >
            <div style={{ ...s.toggleThumb, transform: form.autoRenew ? "translateX(18px)" : "translateX(0)" }}/>
          </div>
        </div>

        <div style={s.footer}>
          <button type="button" onClick={reset} style={s.resetBtn}>Reset</button>
          <button type="submit" disabled={loading} style={{ ...s.subBtn, opacity: loading ? 0.7 : 1 }}>
            {loading
              ? <span style={s.loadRow}><span style={s.spin}/> Adding…</span>
              : <span style={s.subRow}>+ Add Subscription</span>
            }
          </button>
        </div>

      </form>
    </div>
  );
}

const s = {
  root:  { display: "flex", flexDirection: "column", gap: 14 },
  toast: { display: "flex", alignItems: "center", gap: 9, padding: "10px 14px", borderRadius: 9, fontSize: 13, fontWeight: 500, animation: "fadeIn .2s ease" },
  ok:    { background: "var(--green-bg)", color: "var(--green)", border: "1px solid var(--green-bd)" },
  bad:   { background: "var(--red-bg)",   color: "var(--red)",   border: "1px solid var(--red-bd)"   },

  grid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "end" },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  lbl:   { fontSize: "11px", fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--text3)" },
  inp:   { background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "'Inter',sans-serif", fontSize: 13.5, padding: "9px 12px", borderRadius: 8, outline: "none", width: "100%", appearance: "none", WebkitAppearance: "none" },
  pfx:   { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--text3)", pointerEvents: "none" },
  arr:   { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--text3)", pointerEvents: "none" },

  // Auto-renew
  autoRow:   { gridColumn: "1/-1", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "14px 16px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10 },
  autoLeft:  { flex: 1 },
  autoTitle: { fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 3 },
  autoDesc:  { fontSize: 11.5, color: "var(--text3)", lineHeight: 1.5 },
  toggle:    { width: 42, height: 24, borderRadius: 99, position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0 },
  toggleThumb: { position: "absolute", top: 3, left: 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "transform .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" },

  footer:   { gridColumn: "1/-1", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 9, paddingTop: 4 },
  resetBtn: { background: "var(--surface2)", color: "var(--text2)", border: "1px solid var(--border)", fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 8, cursor: "pointer" },
  subBtn:   { background: "var(--accent)", color: "#fff", border: "none", fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, padding: "9px 20px", borderRadius: 8, cursor: "pointer", boxShadow: "0 2px 8px rgba(108,99,255,.25)" },
  subRow:   { display: "flex", alignItems: "center", gap: 7 },
  loadRow:  { display: "flex", alignItems: "center", gap: 8 },
  spin:     { width: 13, height: 13, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" },
};