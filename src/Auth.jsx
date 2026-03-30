import { useState } from "react";
import { supabase } from "./supabase";
import Dashboard from "./Dashboard";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { alert(error.message); setLoading(false); return; }
    if (data?.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
      });
    }
    alert("Signup successful! You can now log in.");
    setMode("login");
    setLoading(false);
  };

  const login = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); setLoading(false); }
    else { setUser(data.user); setLoading(false); }
  };

  const handleSubmit = () => mode === "login" ? login() : signUp();

  if (user) return <Dashboard />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          background: #0a0c0a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .auth-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 20%, #1a2e1a44 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 80%, #1c1a0e33 0%, transparent 60%);
          pointer-events: none;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 180px;
          pointer-events: none;
        }

        .auth-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          background: linear-gradient(145deg, #141a14 0%, #0f120f 100%);
          border: 1px solid #2a3a2a;
          border-radius: 20px;
          padding: 40px 32px;
          box-shadow: 0 32px 80px #00000088, 0 0 0 1px #ffffff08 inset;
          z-index: 1;
          animation: card-in 0.4s ease;
        }

        @keyframes card-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #c9a84c18;
          border: 1px solid #c9a84c44;
          border-radius: 999px;
          padding: 4px 14px;
          margin-bottom: 14px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c9a84c;
          font-weight: 500;
        }

        .auth-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #f0ece0;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .auth-sub {
          margin-top: 6px;
          font-size: 13px;
          color: #5a6a52;
          font-weight: 300;
          letter-spacing: 0.04em;
        }

        .gold-line {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          margin: 14px auto 0;
          border-radius: 999px;
        }

        /* Tab switcher */
        .tab-row {
          display: flex;
          background: #0d120d;
          border: 1px solid #2a3a2a;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 28px;
          gap: 4px;
        }

        .tab-btn {
          flex: 1;
          padding: 9px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          border: none;
          border-radius: 7px;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.2s;
          background: transparent;
          color: #4a5e42;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #1e2e1e, #181e18);
          color: #a8d4a8;
          border: 1px solid #3a5a3a;
          box-shadow: 0 2px 8px #00000044;
        }

        /* Form fields */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .field-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          opacity: 0.4;
          pointer-events: none;
        }

        .auth-input {
          width: 100%;
          background: #0d120d;
          border: 1px solid #2a3a2a;
          border-radius: 10px;
          padding: 12px 16px 12px 40px;
          font-size: 14px;
          color: #e8e4d8;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .auth-input::placeholder { color: #3a4a38; }

        .auth-input:focus {
          border-color: #c9a84c66;
          box-shadow: 0 0 0 3px #c9a84c11;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #c9a84c, #a8862e);
          border: none;
          border-radius: 10px;
          padding: 13px;
          font-size: 14px;
          font-weight: 600;
          color: #0a0c0a;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: opacity 0.15s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover { opacity: 0.9; }
        .submit-btn:active { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #0a0c0a44;
          border-top-color: #0a0c0a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer toggle */
        .auth-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: #4a5e42;
        }

        .toggle-link {
          color: #c9a84c;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          margin-left: 4px;
          transition: opacity 0.15s;
        }

        .toggle-link:hover { opacity: 0.8; }
      `}</style>

      <div className="auth-root">
        <div className="noise-overlay" />

        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-badge">⛳ Golf Dashboard</div>
            <h1 className="auth-title">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="auth-sub">
              {mode === "login" ? "Sign in to your account" : "Join and start tracking scores"}
            </p>
            <div className="gold-line" />
          </div>

          {/* Tab Switcher */}
          <div className="tab-row">
            <button
              className={`tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`tab-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Fields */}
          <div className="field-group">
            <div className="field-wrap">
              <span className="field-icon">✉</span>
              <input
                className="auth-input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field-wrap">
              <span className="field-icon">🔒</span>
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>

          {/* Submit */}
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><div className="spinner" /> Processing...</>
              : mode === "login" ? "Sign In →" : "Create Account →"
            }
          </button>

          {/* Footer */}
          <p className="auth-footer">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <span className="toggle-link" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Sign up" : "Log in"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}