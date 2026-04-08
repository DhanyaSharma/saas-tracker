import { useState } from "react";
import axios from "axios";
import { saveAuth } from "../utils/auth";

export default function Login({ onAuth, goToSignup, dark, setDark }) {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const base = process.env.REACT_APP_AUTH_URL || "http://localhost:5000/api/auth";
      const res  = await axios.post(`${base}/login`, form);
      saveAuth(res.data.token, res.data.user);
      onAuth(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      {/* Theme toggle top-right */}
      <div style={s.themeBtn} onClick={() => setDark(!dark)} title="Toggle theme">
        {dark ? "☀️" : "🌙"}
      </div>

      <div style={s.card}>
        <div style={s.logoRow}>
          <div style={s.mark}>
            <svg viewBox="0 0 16 16" fill="none" width="18" height="18">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity=".6"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".6"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".3"/>
            </svg>
          </div>
          <span style={s.logoName}>SubTrack</span>
        </div>

        <h2 style={s.title}>Welcome back</h2>
        <p style={s.sub}>Sign in to manage your subscriptions</p>

        {error && <div style={s.err}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.lbl}>Email</label>
            <input name="email" type="email" value={form.email} placeholder="you@example.com" onChange={handleChange} required style={s.input}/>
          </div>
          <div style={s.field}>
            <label style={s.lbl}>Password</label>
            <input name="password" type="password" value={form.password} placeholder="••••••••" onChange={handleChange} required style={s.input}/>
          </div>
          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <p style={s.switch}>
          No account?{" "}
          <span style={s.link} onClick={goToSignup}>Create one free</span>
        </p>
      </div>
    </div>
  );
}

const s = {
  page:     { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 20, position: "relative" },
  themeBtn: { position: "absolute", top: 20, right: 20, fontSize: 20, cursor: "pointer", padding: 6, borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)" },
  card:     { width: "100%", maxWidth: 420, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: "40px 36px", boxShadow: "var(--shadow-md)" },
  logoRow:  { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 },
  mark:     { width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "0 2px 10px rgba(108,99,255,.35)" },
  logoName: { fontSize: 19, fontWeight: 700, color: "var(--text)", letterSpacing: "-.3px" },
  title:    { fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-.5px", marginBottom: 6 },
  sub:      { fontSize: 14, color: "var(--text3)", marginBottom: 28 },
  err:      { background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red-bd)", borderRadius: 9, padding: "10px 14px", fontSize: 13, marginBottom: 16, animation: "fadeIn .2s ease" },
  form:     { display: "flex", flexDirection: "column", gap: 16 },
  field:    { display: "flex", flexDirection: "column", gap: 6 },
  lbl:      { fontSize: 11, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--text3)" },
  input:    { background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "'Inter',sans-serif", fontSize: 14, padding: "11px 14px", borderRadius: 9, outline: "none", width: "100%", transition: "border-color .15s,box-shadow .15s" },
  btn:      { background: "var(--accent)", color: "#fff", fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer", width: "100%", boxShadow: "0 2px 10px rgba(108,99,255,.3)", marginTop: 4, transition: "all .14s" },
  switch:   { textAlign: "center", fontSize: 13, color: "var(--text3)", marginTop: 24 },
  link:     { color: "var(--accent)", fontWeight: 600, cursor: "pointer" },
};