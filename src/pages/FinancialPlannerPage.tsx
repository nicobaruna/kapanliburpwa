import { useState } from 'react';
import { analyzeFinancial, buildSimulation } from '../services/FinancialAnalysisService';
import type { FinancialInput, FinancialAnalysisResult, LeaveType, UserGoal } from '../services/FinancialAnalysisService';

const STATUS_CONFIG = {
  aman: { color: '#065F46', bg: '#D1FAE5', label: '✅ Aman' },
  perlu_pertimbangan: { color: '#92400E', bg: '#FEF3C7', label: '⚠️ Perlu Pertimbangan' },
  berat: { color: '#991B1B', bg: '#FEE2E2', label: '🔴 Berat' },
};

const GOALS: { value: UserGoal; label: string; emoji: string }[] = [
  { value: 'hemat', label: 'Hemat', emoji: '💰' },
  { value: 'balance', label: 'Seimbang', emoji: '⚖️' },
  { value: 'healing', label: 'Healing', emoji: '🌿' },
  { value: 'luxury', label: 'Luxury', emoji: '✨' },
];

function formatRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function parseRp(s: string): number {
  return parseInt(s.replace(/\D/g, '') || '0', 10);
}

export default function FinancialPlannerPage() {
  const [input, setInput] = useState<FinancialInput>({
    monthly_salary: 0,
    leave_days_taken: 0,
    leave_type: 'paid',
    trip_days: 3,
    total_trip_cost: 0,
    user_goal: 'balance',
  });

  const [salaryStr, setSalaryStr] = useState('');
  const [costStr, setCostStr] = useState('');
  const [result, setResult] = useState<FinancialAnalysisResult | null>(null);

  function handleAnalyze() {
    const finalInput = {
      ...input,
      monthly_salary: parseRp(salaryStr),
      total_trip_cost: parseRp(costStr),
    };
    if (finalInput.monthly_salary === 0 || finalInput.total_trip_cost === 0) return;
    setResult(analyzeFinancial(finalInput));
    setTimeout(() => window.scrollTo({ top: 999999, behavior: 'smooth' }), 100);
  }

  function handleReset() {
    setResult(null);
    setSalaryStr('');
    setCostStr('');
    setInput({ monthly_salary: 0, leave_days_taken: 0, leave_type: 'paid', trip_days: 3, total_trip_cost: 0, user_goal: 'balance' });
  }

  function formatInput(val: string): string {
    const num = val.replace(/\D/g, '');
    if (!num) return '';
    return parseInt(num, 10).toLocaleString('id-ID');
  }

  const sim = result ? buildSimulation({ ...input, monthly_salary: parseRp(salaryStr), total_trip_cost: parseRp(costStr) }) : null;

  return (
    <div className="page">
      <div style={{ background: 'var(--red)', padding: '16px 16px 20px', paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>💰 Perencana Finansial</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>Analisa biaya liburanmu</p>
      </div>

      <div style={{ padding: '16px' }}>
        <div className="card" style={{ margin: 0, marginBottom: 12 }}>
          <div className="form-group">
            <label className="form-label">Gaji Bulanan (Rp)</label>
            <input
              className="form-input"
              type="text"
              inputMode="numeric"
              placeholder="5.000.000"
              value={salaryStr}
              onChange={e => setSalaryStr(formatInput(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jenis Cuti</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {([['paid', '✅ Dibayar'], ['unpaid', '❌ Tidak Dibayar']] as [LeaveType, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setInput(p => ({ ...p, leave_type: val }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 10, border: `2px solid ${input.leave_type === val ? 'var(--red)' : 'var(--border)'}`,
                    background: input.leave_type === val ? 'var(--red-light)' : '#fff',
                    color: input.leave_type === val ? 'var(--red)' : 'var(--text)',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}
                >{label}</button>
              ))}
            </div>
          </div>

          {input.leave_type === 'unpaid' && (
            <div className="form-group">
              <label className="form-label">Hari Cuti Diambil</label>
              <input
                className="form-input"
                type="number"
                min={0}
                max={30}
                value={input.leave_days_taken || ''}
                onChange={e => setInput(p => ({ ...p, leave_days_taken: parseInt(e.target.value) || 0 }))}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Durasi Perjalanan (hari)</label>
            <input
              className="form-input"
              type="number"
              min={1}
              max={30}
              value={input.trip_days || ''}
              onChange={e => setInput(p => ({ ...p, trip_days: parseInt(e.target.value) || 1 }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Biaya Perjalanan (Rp)</label>
            <input
              className="form-input"
              type="text"
              inputMode="numeric"
              placeholder="3.000.000"
              value={costStr}
              onChange={e => setCostStr(formatInput(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tujuan Finansialmu</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {GOALS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setInput(p => ({ ...p, user_goal: g.value }))}
                  style={{
                    padding: '10px', borderRadius: 10,
                    border: `2px solid ${input.user_goal === g.value ? 'var(--red)' : 'var(--border)'}`,
                    background: input.user_goal === g.value ? 'var(--red-light)' : '#fff',
                    color: input.user_goal === g.value ? 'var(--red)' : 'var(--text)',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  {g.emoji} {g.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary btn-full"
            onClick={handleAnalyze}
            disabled={!salaryStr || !costStr}
            style={{ opacity: salaryStr && costStr ? 1 : 0.5 }}
          >
            Analisa Sekarang →
          </button>
        </div>

        {result && sim && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Status */}
            <div style={{
              background: STATUS_CONFIG[result.status].bg,
              borderRadius: 16,
              padding: 20,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 20, fontWeight: 900, color: STATUS_CONFIG[result.status].color, marginBottom: 8 }}>
                {STATUS_CONFIG[result.status].label}
              </p>
              <p style={{ fontSize: 14, color: STATUS_CONFIG[result.status].color, lineHeight: 1.6 }}>
                {result.insight.summary}
              </p>
            </div>

            {/* Simulation Numbers */}
            <div className="card" style={{ margin: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>📊 Ringkasan Simulasi</p>
              {[
                { label: 'Gaji Bulanan', value: formatRp(sim.monthly_salary) },
                { label: 'Gaji Per Hari', value: formatRp(sim.daily_salary) },
                { label: 'Kehilangan Gaji', value: formatRp(sim.salary_loss) },
                { label: 'Biaya Perjalanan', value: formatRp(sim.total_trip_cost) },
                { label: 'Total Dampak', value: formatRp(sim.total_financial_impact), bold: true },
                { label: '% dari Gaji', value: `${sim.cost_vs_salary_percentage}%`, bold: true },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-sub)' }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: row.bold ? 800 : 600, color: row.bold ? 'var(--red)' : 'var(--text)' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="card" style={{ margin: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>💡 Rekomendasi</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                {result.recommendation.decision}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6 }}>
                {result.recommendation.advice}
              </p>
            </div>

            {/* Optimization */}
            <div className="card" style={{ margin: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>🔧 Tips Optimasi</p>
              {result.optimization.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>•</span>
                  <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6 }}>{tip}</p>
                </div>
              ))}
            </div>

            <button className="btn btn-secondary btn-full" onClick={handleReset}>
              Hitung Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
