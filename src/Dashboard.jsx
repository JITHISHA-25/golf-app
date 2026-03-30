import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { generateDraw } from "./draw";

export default function Dashboard() {
  const [score, setScore] = useState("");
  const [scores, setScores] = useState([]);
  const [drawNumbers, setDrawNumbers] = useState([]);
  const [animating, setAnimating] = useState(false);

  const fetchScores = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });
    if (error) alert(error.message);
    else setScores(data);
  };

  const addScore = async () => {
    // ✅ FIX 2: Validate empty input
    if (score === "" || score === null) return;
    const numScore = Number(score);
    if (isNaN(numScore)) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error: insertError } = await supabase
      .from("scores")
      .insert({ user_id: userData.user.id, score: numScore });
    if (insertError) { alert(insertError.message); return; }

    // ✅ FIX 3: Guard against null data after re-fetch
    const { data, error: fetchError } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (fetchError || !data) { fetchScores(); return; }

    if (data.length > 5) {
      const extra = data.slice(5);
      for (let item of extra) {
        await supabase.from("scores").delete().eq("id", item.id).eq("user_id", userData.user.id);
      }
    }
    setScore("");
    fetchScores();
  };

  const runDraw = () => {
    setAnimating(true);
    setTimeout(() => {
      const userScores = scores.map((s) => s.score);
      const numbers = generateDraw(userScores);
      setDrawNumbers(numbers);
      setAnimating(false);
    }, 900);
  };

  const calculateMatches = () => {
    if (!drawNumbers.length) return 0;
    const uniqueScores = [...new Set(scores.map((s) => s.score))];
    return uniqueScores.filter((num) => drawNumbers.includes(num)).length;
  };

  const matchCount = calculateMatches();

  useEffect(() => { fetchScores(); }, []);

  const resultConfig = drawNumbers.length > 0 ? (
    matchCount >= 5 ? { label: "Jackpot Winner", emoji: "🏆", color: "#c9a84c", glow: "0 0 32px #c9a84c66" } :
    matchCount === 4 ? { label: "4 Matches", emoji: "🔥", color: "#f97316", glow: "0 0 32px #f9731666" } :
    matchCount === 3 ? { label: "3 Matches", emoji: "✨", color: "#38bdf8", glow: "0 0 32px #38bdf866" } :
    matchCount === 2 ? { label: "2 Matches", emoji: "🎯", color: "#a78bfa", glow: "0 0 32px #a78bfa66" } :
    matchCount === 1 ? { label: "1 Match", emoji: "🌿", color: "#6ee7b7", glow: "0 0 32px #6ee7b733" } :
    { label: "No Win", emoji: "⛳", color: "#6b7280", glow: "none" }
  ) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .golf-root { min-height: 100vh; background: #0a0c0a; display: flex; align-items: center; justify-content: center; padding: 24px 16px; font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden; }
        .golf-root::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 20% 20%, #1a2e1a44 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 80%, #1c1a0e33 0%, transparent 60%); pointer-events: none; }
        .noise-overlay { position: absolute; inset: 0; opacity: 0.035; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size: 180px; pointer-events: none; }
        .card { position: relative; width: 100%; max-width: 440px; background: linear-gradient(145deg, #141a14 0%, #0f120f 100%); border: 1px solid #2a3a2a; border-radius: 20px; padding: 36px 32px; box-shadow: 0 32px 80px #00000088, 0 0 0 1px #ffffff08 inset; z-index: 1; }
        .header { text-align: center; margin-bottom: 32px; position: relative; }
        .header-badge { display: inline-flex; align-items: center; gap: 6px; background: #c9a84c18; border: 1px solid #c9a84c44; border-radius: 999px; padding: 4px 14px; margin-bottom: 14px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #c9a84c; font-weight: 500; }
        .header h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #f0ece0; letter-spacing: -0.01em; line-height: 1.2; }
        .header-sub { margin-top: 6px; font-size: 13px; color: #5a6a52; font-weight: 300; letter-spacing: 0.04em; }
        .gold-line { width: 40px; height: 2px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin: 14px auto 0; border-radius: 999px; }
        .section-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #4a5e42; font-weight: 500; margin-bottom: 10px; }
        .input-row { display: flex; gap: 10px; margin-bottom: 28px; }
        .score-input { flex: 1; background: #0d120d; border: 1px solid #2a3a2a; border-radius: 10px; padding: 11px 16px; font-size: 15px; color: #e8e4d8; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s; -moz-appearance: textfield; }
        .score-input::-webkit-inner-spin-button, .score-input::-webkit-outer-spin-button { -webkit-appearance: none; }
        .score-input::placeholder { color: #3a4a38; }
        .score-input:focus { border-color: #c9a84c66; box-shadow: 0 0 0 3px #c9a84c11; }
        .add-btn { background: linear-gradient(135deg, #c9a84c, #a8862e); border: none; border-radius: 10px; padding: 11px 20px; font-size: 13px; font-weight: 600; color: #0a0c0a; cursor: pointer; font-family: 'DM Sans', sans-serif; letter-spacing: 0.04em; transition: opacity 0.15s, transform 0.1s; white-space: nowrap; }
        .add-btn:hover { opacity: 0.9; }
        .add-btn:active { transform: scale(0.97); }
        .scores-section { margin-bottom: 28px; }
        .score-pills { display: flex; gap: 8px; flex-wrap: wrap; min-height: 36px; }
        .score-pill { background: #141c14; border: 1px solid #2a3a2a; border-radius: 8px; padding: 6px 14px; font-size: 14px; font-weight: 500; color: #c8d4c0; letter-spacing: 0.02em; animation: pill-in 0.25s ease; }
        @keyframes pill-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        .score-empty { font-size: 12px; color: #2e3e2e; font-style: italic; padding: 6px 0; }
        .divider { height: 1px; background: linear-gradient(90deg, transparent, #2a3a2a, transparent); margin: 4px 0 28px; }
        .draw-btn { width: 100%; background: #0f1a0f; border: 1px solid #3a5a3a; border-radius: 12px; padding: 14px; font-size: 14px; font-weight: 600; color: #7ab87a; cursor: pointer; font-family: 'DM Sans', sans-serif; letter-spacing: 0.06em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background 0.2s, border-color 0.2s, box-shadow 0.2s; position: relative; overflow: hidden; }
        .draw-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #3a5a3a22, transparent); opacity: 0; transition: opacity 0.2s; }
        .draw-btn:hover { background: #141e14; border-color: #4a7a4a; box-shadow: 0 0 20px #2a5a2a33; }
        .draw-btn:hover::before { opacity: 1; }
        .draw-btn:active { transform: scale(0.99); }
        .draw-icon { width: 20px; height: 20px; border: 2px solid #4a7a4a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; }
        .spinning { animation: spin 0.9s linear; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .draw-section { margin-top: 24px; animation: fade-up 0.4s ease; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .draw-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
        .draw-pill { background: linear-gradient(135deg, #1e2a1e, #161e16); border: 1px solid #3a5a3a; border-radius: 8px; padding: 8px 16px; font-size: 15px; font-weight: 600; color: #a8d4a8; font-family: 'Playfair Display', serif; letter-spacing: 0.04em; animation: pill-in 0.3s ease both; }
        .draw-pill:nth-child(1) { animation-delay: 0.05s; }
        .draw-pill:nth-child(2) { animation-delay: 0.12s; }
        .draw-pill:nth-child(3) { animation-delay: 0.19s; }
        .draw-pill:nth-child(4) { animation-delay: 0.26s; }
        .draw-pill:nth-child(5) { animation-delay: 0.33s; }
        .result-banner { margin-top: 20px; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; border: 1px solid; animation: fade-up 0.4s ease 0.3s both; }
        .result-emoji { font-size: 24px; line-height: 1; }
        .result-text { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; }
        .result-sub { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; opacity: 0.6; font-weight: 400; font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="golf-root">
        <div className="noise-overlay" />
        <div className="card">
          <div className="header">
            <div className="header-badge">⛳ Live Draw</div>
            <h1>Golf Dashboard</h1>
            <p className="header-sub">Track your scores · Run the draw</p>
            <div className="gold-line" />
          </div>

          <p className="section-label">Add Score</p>
          <div className="input-row">
            <input
              type="number"
              placeholder="Enter your score"
              className="score-input"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addScore()}
            />
            <button className="add-btn" onClick={addScore}>+ Add</button>
          </div>

          <div className="scores-section">
            <p className="section-label">Your Scores (max 5)</p>
            <div className="score-pills">
              {scores.length === 0
                ? <span className="score-empty">No scores yet</span>
                : scores.map((s) => (
                    <div key={s.id} className="score-pill">{s.score}</div>
                  ))
              }
            </div>
          </div>

          <div className="divider" />

          <button className="draw-btn" onClick={runDraw}>
            <span className={`draw-icon ${animating ? "spinning" : ""}`}>🎯</span>
            Run the Draw
          </button>

          {drawNumbers.length > 0 && !animating && (
            <div className="draw-section">
              <p className="section-label">Draw Numbers</p>
              <div className="draw-pills">
                {drawNumbers.map((num, i) => (
                  <div key={i} className="draw-pill">{num}</div>
                ))}
              </div>
            </div>
          )}

          {drawNumbers.length > 0 && !animating && resultConfig && (
            <div
              className="result-banner"
              style={{
                background: `${resultConfig.color}0d`,
                borderColor: `${resultConfig.color}33`,
                boxShadow: resultConfig.glow,
              }}
            >
              <span className="result-emoji">{resultConfig.emoji}</span>
              <div>
                <div className="result-text" style={{ color: resultConfig.color }}>
                  {resultConfig.label}
                </div>
                <div className="result-sub" style={{ color: resultConfig.color }}>
                  {matchCount} match{matchCount !== 1 ? "es" : ""} found
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}