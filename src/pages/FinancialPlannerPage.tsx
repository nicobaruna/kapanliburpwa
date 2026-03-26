import { useState } from 'react';
import {
  analyzeFinancial,
  buildSimulation,
  type FinancialInput,
  type FinancialAnalysisResult,
  type LeaveType,
  type UserGoal,
} from '../services/FinancialAnalysisService';

const C = {
  red: '#C8102E',
  white: '#FFFFFF',
  bg: '#F7F3EF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#6B7280',
  green: '#27AE60',
  greenLight: '#D5F5E3',
  orange: '#E67E22',
  orangeLight: '#FEF3E2',
  redLight: '#FDECEA',
  yellow: '#D97706',
  yellowLight: '#FFFBEB',
  border: '#E8E0D8',
  inputBg: '#F9F7F5',
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
};

const STATUS_CONFIG = {
  aman: { color: C.green, bg: C.greenLight, label: 'Aman' },
  perlu_pertimbangan: { color: C.yellow, bg: C.yellowLight, label: 'Perlu Pertimbangan' },
  berat: { color: C.red, bg: C.redLight, label: 'Berat' },
};

const GOAL_OPTIONS: { value: UserGoal; label: string; desc: string }[] = [
  { value: 'hemat', label: 'Hemat', desc: 'Prioritas menabung' },
  { value: 'balance', label: 'Balance', desc: 'Seimbang' },
  { value: 'healing', label: 'Healing', desc: 'Butuh refreshing' },
  { value: 'luxury', label: 'Luxury', desc: 'No limit' },
];

function formatRupiah(value: number): string {
  return 'Rp ' + value.toLocaleString('id-ID');
}

const cardStyle = {
  backgroundColor: C.card,
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
};

const inputStyle = {
  flex: 1,
  fontSize: 15,
  fontWeight: 600 as const,
  color: C.text,
  border: 'none',
  background: 'transparent',
  outline: 'none',
  width: '100%',
};

const inputWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: C.inputBg,
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  padding: '0 12px',
  height: 46,
};

function ResultCard({ result, simulation }: {
  result: FinancialAnalysisResult;
  simulation: ReturnType<typeof buildSimulation>;
}) {
  const sc = STATUS_CONFIG[result.status];
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        backgroundColor: sc.bg, borderRadius: 30,
        padding: '10px 16px', marginBottom: 12,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: sc.color }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: sc.color }}>{sc.label}</span>
      </div>

      {/* Sim summary */}
      <div style={cardStyle}>
        {[
          { label: 'Total Dampak Finansial', value: formatRupiah(simulation.total_financial_impact), color: C.red, fw: 800 },
          { label: 'Persentase dari Gaji', value: `${simulation.cost_vs_salary_percentage}%`, color: sc.color, fw: 700 },
          ...(simulation.salary_loss > 0 ? [{ label: 'Kehilangan Gaji (cuti tidak dibayar)', value: formatRupiah(simulation.salary_loss), color: C.text, fw: 700 }] : []),
          { label: 'Biaya Perjalanan', value: formatRupiah(simulation.total_trip_cost), color: C.text, fw: 700 },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '6px 0', borderBottom: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 12, color: C.textSub, flex: 1 }}>{row.label}</span>
            <span style={{ fontSize: 13, color: row.color, fontWeight: row.fw }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div style={{ ...cardStyle, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Insight</div>
        <p style={{ fontSize: 14, color: C.text, lineHeight: 1.5, marginBottom: 4 }}>{result.insight.summary}</p>
        <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.5 }}>{result.insight.key_reason}</p>
      </div>

      {/* Recommendation */}
      <div style={{ ...cardStyle, backgroundColor: `${sc.color}10`, border: `1px solid ${sc.color}30` }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: sc.color, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Rekomendasi</div>
        <p style={{ fontSize: 14, color: C.text, lineHeight: 1.5, marginBottom: 4 }}>{result.recommendation.decision}</p>
        <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.5 }}>{result.recommendation.advice}</p>
      </div>

      {/* Tips */}
      <div style={{ ...cardStyle, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Tips Optimasi</div>
        {result.optimization.map((tip, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: sc.color, marginTop: 7, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{tip}</span>
          </div>
        ))}
      </div>

      {/* Comparison */}
      <div style={{ ...cardStyle, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Perbandingan</div>
        <p style={{ fontSize: 14, color: C.text, lineHeight: 1.5, marginBottom: 4 }}>{result.comparison.salary_vs_cost}</p>
        <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.5 }}>{result.comparison.main_cost_driver}</p>
      </div>

      {/* Share text */}
      <div style={{ ...cardStyle, backgroundColor: C.purpleLight, border: `1px solid ${C.purple}40` }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.purple, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Teks untuk Dibagikan</div>
        <p style={{ fontSize: 15, fontWeight: 700, color: C.purple, fontStyle: 'italic', lineHeight: 1.5 }}>
          "{result.share_text}"
        </p>
      </div>
    </div>
  );
}

export default function FinancialPlannerPage() {
  const [monthlySalary, setMonthlySalary] = useState('');
  const [tripDays, setTripDays] = useState('');
  const [leaveDays, setLeaveDays] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('paid');
  const [tripCost, setTripCost] = useState('');
  const [userGoal, setUserGoal] = useState<UserGoal>('balance');
  const [result, setResult] = useState<FinancialAnalysisResult | null>(null);
  const [simulation, setSimulation] = useState<ReturnType<typeof buildSimulation> | null>(null);

  const handleAnalyze = () => {
    if (!monthlySalary || !tripCost) {
      alert('Isi minimal gaji bulanan dan biaya perjalanan.');
      return;
    }
    const input: FinancialInput = {
      monthly_salary: parseInt(monthlySalary, 10),
      leave_days_taken: parseInt(leaveDays || '0', 10),
      leave_type: leaveType,
      trip_days: parseInt(tripDays || '1', 10),
      total_trip_cost: parseInt(tripCost, 10),
      user_goal: userGoal,
    };
    setSimulation(buildSimulation(input));
    setResult(analyzeFinancial(input));
  };

  const labelStyle = { fontSize: 13, fontWeight: 600 as const, color: C.text, marginBottom: 6, display: 'block' as const };

  return (
    <div className="page" style={{ backgroundColor: C.bg }}>
      {/* Header */}
      <div style={{ backgroundColor: C.red, padding: '16px 20px', boxShadow: '0 2px 8px rgba(200,16,46,0.3)' }}>
        <h1 style={{ color: C.white, fontSize: 20, fontWeight: 800 }}>Perencana Finansial</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
          Hitung dampak finansial liburanmu secara instan
        </p>
      </div>

      <div style={{ padding: 16 }}>
        {/* Salary */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Data Gaji</div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Gaji Bulanan</label>
            <div style={inputWrapperStyle}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.textSub, marginRight: 8 }}>Rp</span>
              <input
                type="number"
                value={monthlySalary}
                onChange={e => setMonthlySalary(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="5000000"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Trip */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Data Perjalanan</div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Lama Perjalanan</label>
            <div style={inputWrapperStyle}>
              <input
                type="number"
                value={tripDays}
                onChange={e => setTripDays(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0"
                style={{ ...inputStyle, flex: 1 }}
              />
              <span style={{ fontSize: 13, color: C.textSub, fontWeight: 600 }}>hari</span>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Total Biaya Perjalanan</label>
            <div style={inputWrapperStyle}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.textSub, marginRight: 8 }}>Rp</span>
              <input
                type="number"
                value={tripCost}
                onChange={e => setTripCost(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="3000000"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Leave */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Data Cuti</div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Jumlah Hari Cuti</label>
            <div style={inputWrapperStyle}>
              <input
                type="number"
                value={leaveDays}
                onChange={e => setLeaveDays(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0"
                style={{ ...inputStyle, flex: 1 }}
              />
              <span style={{ fontSize: 13, color: C.textSub, fontWeight: 600 }}>hari</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Jenis Cuti</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {([{ value: 'paid', label: 'Dibayar' }, { value: 'unpaid', label: 'Tidak Dibayar' }] as const).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setLeaveType(opt.value)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 10,
                    backgroundColor: leaveType === opt.value ? C.red : C.inputBg,
                    border: `1px solid ${leaveType === opt.value ? C.red : C.border}`,
                    color: leaveType === opt.value ? C.white : C.textSub,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tujuan Finansial</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {GOAL_OPTIONS.map(g => (
              <button
                key={g.value}
                onClick={() => setUserGoal(g.value)}
                style={{
                  padding: '12px 14px', borderRadius: 12, textAlign: 'left',
                  backgroundColor: userGoal === g.value ? C.red : C.inputBg,
                  border: `1px solid ${userGoal === g.value ? C.red : C.border}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: userGoal === g.value ? C.white : C.text, marginBottom: 2 }}>
                  {g.label}
                </div>
                <div style={{ fontSize: 11, color: userGoal === g.value ? 'rgba(255,255,255,0.7)' : C.textSub }}>
                  {g.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
            backgroundColor: C.red, color: C.white, fontSize: 16, fontWeight: 800,
            cursor: 'pointer', marginBottom: 12, letterSpacing: 0.3,
            boxShadow: '0 4px 12px rgba(200,16,46,0.3)',
          }}
        >
          Hitung Sekarang
        </button>

        {result && simulation && (
          <ResultCard result={result} simulation={simulation} />
        )}
      </div>
    </div>
  );
}
