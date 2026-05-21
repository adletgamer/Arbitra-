import React, { useState, useEffect } from 'react';
import { 
  Shield, Rocket, Users, Lock, Unlock, Cpu, CheckCircle2, AlertTriangle, 
  RefreshCw, LogOut, Check, Send, Coins, FileText, Code, 
  ExternalLink, Play
} from 'lucide-react';
import { UserRole } from '../types';
import type { StartupProject, UserSession } from '../types';

interface DashboardProps {
  session: UserSession;
  startups: StartupProject[];
  onChangeRole: (role: UserRole, activeStartupId?: string) => void;
  onUpdateStartup: (updated: StartupProject) => void;
  onResetDb: () => void;
  onLogout: () => void;
}

export default function Dashboard({
  session,
  startups,
  onChangeRole,
  onUpdateStartup,
  onResetDb,
  onLogout
}: DashboardProps) {
  const [logoError, setLogoError] = useState(false);

  // Demo walkthrough guide step: 1 | 2 | 3 | 4
  const [demoStep, setDemoStep] = useState<number>(1);
  
  // Dashboard active project (for Admin/Mentor views to inspect/edit)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('wayki');

  // Interactive Form States
  const [newProgramName, setNewProgramName] = useState('');
  const [newProgramEscrow, setNewProgramEscrow] = useState('10000');
  
  const [evidenceLink, setEvidenceLink] = useState('');
  const [evidenceType, setEvidenceType] = useState<'commit' | 'figma' | 'report'>('commit');
  
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  // Success message states
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Close notifications after timeout
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  // Find active startup and project
  const activeStartup = startups.find(s => s.id === (session.activeStartupId || selectedProjectId)) || startups[0];
  const activeMilestone = activeStartup.milestones.find(m => m.id === activeStartup.activeMilestoneId) || activeStartup.milestones[activeStartup.milestones.length - 1];

  // Quick switch function
  const handleQuickSwitch = (role: UserRole, startupId?: string) => {
    onChangeRole(role, startupId);
    if (startupId) {
      setSelectedProjectId(startupId);
    }
    setActionSuccess(`Rol cambiado a ${role === UserRole.ADMIN ? 'Administrador' : role === UserRole.MENTOR ? 'Mentor' : 'Startup (' + startupId + ')'}`);
  };

  // Reset database state
  const handleResetDemo = () => {
    onResetDb();
    setDemoStep(1);
    setSelectedProjectId('wayki');
    setActionSuccess('Base de datos restablecida al estado inicial.');
  };

  // Toggle Pause Guardian
  const handleTogglePause = (projectId: string) => {
    const project = startups.find(p => p.id === projectId);
    if (!project) return;

    const updated = {
      ...project,
      isPaused: !project.isPaused
    };
    onUpdateStartup(updated);
    setActionSuccess(`Pause Guardian: ${updated.isPaused ? 'CONTRATOS PAUSADOS' : 'CONTRATOS ACTIVOS'} para ${project.name}`);
  };

  // Submit Evidence (Startup Founder)
  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceLink || activeStartup.isPaused) return;

    setIsSubmittingEvidence(true);
    
    // Simulate transaction commit + AI audit execution (1.5 seconds)
    setTimeout(() => {
      // Find the current milestone and update it
      const updatedMilestones = activeStartup.milestones.map(m => {
        if (m.id === activeStartup.activeMilestoneId) {
          return {
            ...m,
            status: 'ai_review' as const,
            evidenceLink: evidenceLink,
            evidenceType: evidenceType,
            auditReport: {
              commitsVerified: evidenceType === 'commit' ? 18 : 0,
              totalCommits: evidenceType === 'commit' ? 20 : 0,
              testCoverage: evidenceType === 'commit' ? 92 : 80,
              figmaTokens: evidenceType === 'figma' ? true : false,
              score: evidenceType === 'commit' ? 0.92 : 0.85,
              verdict: 'pending' as const,
              notes: 'Evidencia técnica cargada. La auditoría automatizada de la IA generó un score aprobable. Esperando firma de validación del mentor.'
            }
          };
        }
        return m;
      });

      const updated = {
        ...activeStartup,
        milestones: updatedMilestones
      };

      onUpdateStartup(updated);
      setIsSubmittingEvidence(false);
      setEvidenceLink('');
      setActionSuccess('Evidencia cargada con éxito. Agente de IA ejecutó auditoría instantánea (Score: 0.92).');
      setDemoStep(3); // Advance demo helper to Mentor step
    }, 1500);
  };

  // Withdraw Escrow (Startup Founder)
  const handleWithdrawEscrow = () => {
    if (activeMilestone.status !== 'paid_out' || activeStartup.isPaused) return;

    setIsWithdrawing(true);
    
    setTimeout(() => {
      // Release current milestone funds dynamically
      const txHash = '0x' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...' + Math.random().toString(16).substring(2, 6).toUpperCase();
      
      const updatedMilestones = activeStartup.milestones.map(m => {
        if (m.id === activeStartup.activeMilestoneId) {
          return {
            ...m,
            txHash: txHash
          };
        }
        return m;
      });

      // Release capital, lock next milestone if exists
      const nextMilestoneId = activeStartup.activeMilestoneId + 1;
      const hasNext = activeStartup.milestones.some(m => m.id === nextMilestoneId);

      const updated = {
        ...activeStartup,
        escrowReleased: activeStartup.escrowReleased + activeMilestone.amount,
        activeMilestoneId: hasNext ? nextMilestoneId : activeStartup.activeMilestoneId,
        milestones: updatedMilestones
      };

      onUpdateStartup(updated);
      setIsWithdrawing(false);
      setActionSuccess(`Fondos transferidos con éxito. L2 Tx Hash: ${txHash}`);
      setDemoStep(1); // Circle back demo helper to beginning
    }, 1500);
  };

  // Mentor Review Action
  const handleMentorReview = (projectId: string, verdict: 'approved' | 'rejected' | 'escalated') => {
    const project = startups.find(p => p.id === projectId);
    if (!project || project.isPaused) return;

    setIsActionLoading(verdict);

    setTimeout(() => {
      const updatedMilestones = project.milestones.map(m => {
        if (m.id === project.activeMilestoneId) {
          return {
            ...m,
            status: verdict === 'approved' ? ('paid_out' as const) : verdict === 'rejected' ? ('funded' as const) : ('ai_review' as const),
            auditReport: {
              ...m.auditReport,
              verdict: verdict === 'approved' ? ('approved' as const) : verdict === 'rejected' ? ('rejected' as const) : ('pending' as const),
              notes: verdict === 'approved' 
                ? 'Validación exitosa del mentor académico. Firma multisig registrada y fondos liberados en el Smart Contract.'
                : verdict === 'rejected'
                ? 'El mentor solicitó cambios en la entrega. Estado devuelto a Funded.'
                : 'ENTREGA ESCALADA A COMITÉ DE ARBITRAJE. Alerta crítica detectada.'
            }
          };
        }
        return m;
      });

      const updated = {
        ...project,
        milestones: updatedMilestones
      };

      onUpdateStartup(updated);
      setIsActionLoading(null);
      
      if (verdict === 'approved') {
        setActionSuccess(`Milestone de ${project.name} APROBADO. Fondos liberados.`);
        setDemoStep(4); // Advance demo helper to Withdraw step
      } else if (verdict === 'rejected') {
        setActionSuccess(`Cambios solicitados para ${project.name}.`);
      } else {
        setActionSuccess(`Caso escalado a Comité de Arbitraje.`);
      }
    }, 1500);
  };

  // Admin Create Program
  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgramName || !newProgramEscrow) return;

    const escrow = parseFloat(newProgramEscrow);
    const newId = newProgramName.toLowerCase().replace(/\s+/g, '-');

    const newProject: StartupProject = {
      id: newId,
      name: newProgramName,
      category: 'StartUPC Program',
      description: 'Nuevo proyecto registrado en el programa de incubación de StartUPC con custodia on-chain.',
      escrowTotal: escrow,
      escrowReleased: 0,
      activeMilestoneId: 1,
      walletConnected: true,
      walletAddress: '0x' + Math.random().toString(16).substring(2, 6).toUpperCase() + '...' + Math.random().toString(16).substring(2, 6).toUpperCase(),
      githubRepo: `https://github.com/startupc/${newId}`,
      isPaused: false,
      milestones: [
        {
          id: 1,
          title: '#1 — Arquitectura & Setup',
          amount: escrow / 2,
          status: 'funded',
          deadline: '2026-08-30',
          auditReport: {
            commitsVerified: 0,
            totalCommits: 0,
            testCoverage: 0,
            figmaTokens: false,
            score: 0,
            verdict: 'pending',
            notes: 'Hito creado y financiado.'
          }
        },
        {
          id: 2,
          title: '#2 — Entregable Core',
          amount: escrow / 2,
          status: 'funded',
          deadline: '2026-11-15',
          auditReport: {
            commitsVerified: 0,
            totalCommits: 0,
            testCoverage: 0,
            figmaTokens: false,
            score: 0,
            verdict: 'pending',
            notes: 'Fondo bloqueado en escrow.'
          }
        }
      ]
    };

    onUpdateStartup(newProject);
    setNewProgramName('');
    setActionSuccess(`Programa '${newProgramName}' creado con ${escrow} ARB en escrow.`);
  };

  return (
    <div className="dashboard-layout" style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', paddingBottom: '80px' }}>
      
      {/* ========== HORIZONTAL MOCK CONTROLLER / FLOATING WIDGET ========== */}
      <div className="demo-controller-floating" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(18, 24, 38, 0.90)',
        borderBottom: '1px solid var(--accent-cyan)',
        backdropFilter: 'blur(12px)',
        padding: '12px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'inline-flex', background: 'var(--accent-cyan-dim)', padding: '6px', borderRadius: '4px', border: '1px solid var(--accent-cyan)' }}>
            <Play size={16} className="text-cyan animate-pulse" />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '1px', fontFamily: 'var(--font-display)' }}>
              ARBITRA DEMO WIDGET
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              1-Click Impersonation para Walkthrough de 5 mins
            </div>
          </div>
        </div>

        {/* Demo walkthrough steps */}
        <div className="demo-steps-indicator" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { step: 1, label: 'Paso 1: Admin Locks', role: UserRole.ADMIN, desc: 'Revisa riesgo de SABIO-IA o crea un programa' },
            { step: 2, label: 'Paso 2: Startup Commits', role: UserRole.STARTUP, desc: 'Carga código de Wayki y gatilla IA' },
            { step: 3, label: 'Paso 3: Mentor Audits', role: UserRole.MENTOR, desc: 'Valida reportes y firma multisig' },
            { step: 4, label: 'Paso 4: Startup Withdraws', role: UserRole.STARTUP, desc: 'Wayki retira ARB y genera hash L2' }
          ].map((s) => {
            const isCurrent = demoStep === s.step;
            return (
              <button 
                key={s.step}
                onClick={() => {
                  setDemoStep(s.step);
                  handleQuickSwitch(s.role, s.step === 2 || s.step === 4 ? 'wayki' : undefined);
                }}
                title={s.desc}
                style={{
                  background: isCurrent ? 'var(--accent-cyan-dim)' : 'var(--bg-base)',
                  border: isCurrent ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  color: isCurrent ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ 
                  width: '14px', 
                  height: '14px', 
                  borderRadius: '50%', 
                  background: isCurrent ? 'var(--accent-cyan)' : 'var(--border-medium)',
                  color: 'var(--bg-base)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 800
                }}>{s.step}</span>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Quick Switched Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 700 }}>VER COMO:</span>
          
          <button 
            onClick={() => handleQuickSwitch(UserRole.ADMIN)} 
            className={`btn ${session.role === UserRole.ADMIN ? 'btn--primary' : 'btn--secondary'}`}
            style={{ padding: '4px 10px', fontSize: 'var(--text-xs)', minHeight: 'auto' }}
          >
            <Shield size={12} style={{ marginRight: '4px' }} />
            Admin
          </button>

          <button 
            onClick={() => handleQuickSwitch(UserRole.STARTUP, 'wayki')} 
            className={`btn ${session.role === UserRole.STARTUP ? 'btn--primary' : 'btn--secondary'}`}
            style={{ padding: '4px 10px', fontSize: 'var(--text-xs)', minHeight: 'auto' }}
          >
            <Rocket size={12} style={{ marginRight: '4px' }} />
            Startup
          </button>

          <button 
            onClick={() => handleQuickSwitch(UserRole.MENTOR)} 
            className={`btn ${session.role === UserRole.MENTOR ? 'btn--primary' : 'btn--secondary'}`}
            style={{ padding: '4px 10px', fontSize: 'var(--text-xs)', minHeight: 'auto' }}
          >
            <Users size={12} style={{ marginRight: '4px' }} />
            Mentor
          </button>

          <button 
            onClick={handleResetDemo}
            className="btn btn--secondary" 
            title="Resetear Demo a Estado Inicial"
            style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', minHeight: 'auto', border: '1px solid rgba(255, 107, 107, 0.4)' }}
          >
            <RefreshCw size={12} color="var(--state-error)" />
          </button>
        </div>
      </div>

      {/* ========== ACTION TOAST / NOTIFICATION ========== */}
      {actionSuccess && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: 'var(--bg-surface-alt)',
          borderLeft: '4px solid var(--accent-cyan)',
          padding: '16px var(--space-lg)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'reveal 0.3s ease-out'
        }}>
          <CheckCircle2 size={20} className="text-cyan" />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>{actionSuccess}</span>
        </div>
      )}

      {/* ========== SUB-HEADER / GLOBAL CONTEXT STATS ========== */}
      <div style={{ background: 'var(--bg-base-alt)', borderBottom: '1px solid var(--border-subtle)', padding: '24px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!logoError ? (
              <img 
                src="/arbitra_logo.png" 
                alt="Arbitra Logo" 
                style={{ height: '40px', width: 'auto', display: 'block' }} 
                onError={() => setLogoError(true)} 
              />
            ) : (
              <span className="navbar__logo-fallback-icon" style={{ fontSize: 'var(--text-2xl)', marginRight: '6px' }}>⚖</span>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="section__label-dot" style={{ background: activeStartup.isPaused ? 'var(--state-error)' : 'var(--state-success)' }}></span>
                <span className="font-mono text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>UPC Incubator System V2.6</span>
              </div>
              <h1 className="font-display" style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: '4px 0 0 0' }}>
                Arbitra Web3 Dashboard
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#121826', border: '1px solid var(--border-subtle)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>WALLET CONECTADA</div>
              <div className="mono text-cyan" style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                {session.walletAddress || '0xNoWallet...0000'}
              </div>
            </div>
            
            <button onClick={onLogout} className="btn btn--secondary" style={{ gap: '8px', padding: '8px 16px' }}>
              Salir
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 'var(--space-xl)' }}>
        
        {/* ======================================================== */}
        {/* ================ VIEW 1: INCUBATOR ADMIN ================ */}
        {/* ======================================================== */}
        {session.role === UserRole.ADMIN && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* Top Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-md)' }}>
              
              <div className="card" style={{ background: '#121826', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Escrow Total Locked</span>
                <h2 className="font-mono text-cyan" style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginTop: '4px' }}>
                  {startups.reduce((acc, curr) => acc + curr.escrowTotal, 0).toLocaleString()} ARB
                </h2>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Custodiado en Smart Contracts
                </div>
              </div>

              <div className="card" style={{ background: '#121826', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Total Released (Paid out)</span>
                <h2 className="font-mono text-success" style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginTop: '4px' }}>
                  {startups.reduce((acc, curr) => acc + curr.escrowReleased, 0).toLocaleString()} ARB
                </h2>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Liberado bajo auditoría técnica
                </div>
              </div>

              <div className="card" style={{ background: '#121826', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Active Startups</span>
                <h2 className="font-mono text-violet" style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginTop: '4px' }}>
                  {startups.length} Proyectos
                </h2>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Cohorte UPC 2026-I
                </div>
              </div>
            </div>

            {/* Main Content Area: Projects list & Risk auditing */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--space-xl)' }}>
              
              {/* Projects Table & Pause Guardian */}
              <div className="card" style={{ background: '#121826', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                      Control de Proyectos en Incubación
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      Supervisa fondos custodiados y bloquea ejecuciones de emergencia vía Pause Guardian.
                    </p>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                        <th style={{ padding: '12px 8px' }}>STARTUP</th>
                        <th style={{ padding: '12px 8px' }}>CATEGORÍA</th>
                        <th style={{ padding: '12px 8px' }}>FONDOS (ARB)</th>
                        <th style={{ padding: '12px 8px' }}>HITOS ACTIVOS</th>
                        <th style={{ padding: '12px 8px' }}>ACCIONES (PAUSE GUARDIAN)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {startups.map((p) => {
                        const activeM = p.milestones.find(m => m.id === p.activeMilestoneId) || p.milestones[0];
                        return (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--text-sm)' }}>
                            <td style={{ padding: '16px 8px', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</td>
                            <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{p.category}</td>
                            <td style={{ padding: '16px 8px' }}>
                              <span className="font-mono text-cyan" style={{ fontWeight: 600 }}>
                                {p.escrowReleased}/{p.escrowTotal}
                              </span>
                            </td>
                            <td style={{ padding: '16px 8px' }}>
                              <span className={`badge ${
                                activeM.status === 'paid_out' ? 'badge--success' : activeM.status === 'ai_review' ? 'badge--warning' : 'badge--violet'
                              }`}>
                                {activeM.status}
                              </span>
                            </td>
                            <td style={{ padding: '16px 8px' }}>
                              <button 
                                onClick={() => handleTogglePause(p.id)}
                                className={`btn ${p.isPaused ? 'btn--primary' : 'btn--secondary'}`}
                                style={{ 
                                  padding: '4px 10px', 
                                  fontSize: 'var(--text-xs)', 
                                  minHeight: 'auto',
                                  borderColor: p.isPaused ? 'var(--state-error)' : 'var(--border-medium)',
                                  background: p.isPaused ? 'var(--state-error-dim)' : 'transparent',
                                  color: p.isPaused ? 'var(--state-error)' : 'var(--text-secondary)'
                                }}
                              >
                                <AlertTriangle size={12} style={{ marginRight: '4px' }} />
                                {p.isPaused ? 'Despausar' : 'Pausar'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risk Audit Panels & Create Program Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                
                {/* Risk Alert Box */}
                <div className="card" style={{ 
                  background: '#121826', 
                  border: '1px solid rgba(255, 107, 107, 0.25)', 
                  padding: '24px', 
                  borderRadius: 'var(--radius-lg)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--state-error)', marginBottom: '12px' }}>
                    <AlertTriangle size={20} />
                    <h3 className="font-display" style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>
                      Alertas Críticas de Riesgo (IA)
                    </h3>
                  </div>
                  
                  {/* Real Risk case: SABIO-IA */}
                  {startups.find(p => p.id === 'sabioia')?.milestones[0].status === 'ai_review' ? (
                    <div style={{ background: 'rgba(255, 107, 107, 0.08)', border: '1px solid var(--state-error)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--text-primary)' }}>SABIO-IA Tributario</span>
                        <span className="mono text-error" style={{ fontSize: '10px' }}>Score: 0.35</span>
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        Alerta crítica de la IA: Se detectó alta similitud de código (34%) con plantillas públicas de repositorios públicos en el Hito #1.
                      </p>
                      
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button 
                          onClick={() => handleTogglePause('sabioia')}
                          className="btn btn--secondary"
                          style={{ padding: '4px 8px', fontSize: '10px', minHeight: 'auto', color: 'var(--state-error)', borderColor: 'rgba(255, 107, 107, 0.4)' }}
                        >
                          Congelar Escrow (Pause)
                        </button>
                        <button 
                          onClick={() => handleQuickSwitch(UserRole.MENTOR)}
                          className="btn btn--secondary"
                          style={{ padding: '4px 8px', fontSize: '10px', minHeight: 'auto' }}
                        >
                          Ir a Inbox de Mentor
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', textAlign: 'center', padding: '16px' }}>
                      ✓ Todos los agentes de IA reportan scores dentro de los umbrales institucionales. No hay alertas críticas.
                    </div>
                  )}
                </div>

                {/* Create Program Form */}
                <div className="card" style={{ background: '#121826', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                  <h3 className="font-display" style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                    Registrar Nuevo Programa de Custodia
                  </h3>

                  <form onSubmit={handleCreateProgram} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Nombre del Proyecto</label>
                      <input 
                        type="text" 
                        placeholder="ej. SABIO-IA Tributario"
                        value={newProgramName}
                        onChange={(e) => setNewProgramName(e.target.value)}
                        required
                        style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: 'var(--text-sm)' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Monto Escrow Bloqueado (ARB)</label>
                      <input 
                        type="number" 
                        placeholder="10000"
                        value={newProgramEscrow}
                        onChange={(e) => setNewProgramEscrow(e.target.value)}
                        required
                        style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: 'var(--text-sm)' }}
                      />
                    </div>

                    <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: 'var(--text-xs)' }}>
                      Crear Smart Contract & Depositar
                      <Coins size={14} style={{ marginLeft: '6px' }} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ================ VIEW 2: STARTUP COCKPIT ================ */}
        {/* ========================================================= */}
        {session.role === UserRole.STARTUP && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* Startup Header Selection bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#121826', padding: '16px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>EMPRENDIMIENTO ACTIVO</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                  <h2 className="font-display text-cyan" style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0 }}>
                    {activeStartup.name}
                  </h2>
                  <span className="badge badge--violet">{activeStartup.category}</span>
                </div>
              </div>

              {/* Startup details */}
              <div style={{ display: 'flex', gap: '30px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>LOCKED IN ESCROW</div>
                  <div className="mono text-cyan" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{activeStartup.escrowTotal.toLocaleString()} ARB</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>RELEASED</div>
                  <div className="mono text-success" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{activeStartup.escrowReleased.toLocaleString()} ARB</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>STATUS DE CONTRATO</div>
                  <span className={`badge ${activeStartup.isPaused ? 'badge--error' : 'badge--success'}`} style={{ marginTop: '4px' }}>
                    {activeStartup.isPaused ? 'Pause Guardian Activo' : 'Operativo'}
                  </span>
                </div>
              </div>
            </div>

            {/* If Pause Guardian is active, render huge top notification and block buttons */}
            {activeStartup.isPaused && (
              <div style={{
                background: 'rgba(255, 107, 107, 0.1)',
                border: '1px solid var(--state-error)',
                padding: '16px var(--space-xl)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--state-error)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <AlertTriangle size={32} />
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: 'var(--text-sm)' }}>CONTRATO BLOQUEADO POR PAUSE GUARDIAN</h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    El administrador del programa UPC ha pausado temporalmente este fideicomiso. Todas las operaciones de carga y retiros han sido inhabilitadas temporalmente por auditoría.
                  </p>
                </div>
              </div>
            )}

            {/* Main Interactive Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--space-xl)' }}>
              
              {/* Milestone checklist & interactive submissions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                
                {/* Timeline display */}
                <div className="card" style={{ background: '#121826', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                  <h3 className="font-display" style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
                    Cronograma & Estado de Hitos
                  </h3>

                  <div className="milestone-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {activeStartup.milestones.map((m) => {
                      const isActive = m.id === activeStartup.activeMilestoneId;
                      return (
                        <div 
                          key={m.id} 
                          style={{ 
                            background: 'var(--bg-base)', 
                            border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)', 
                            borderRadius: 'var(--radius-md)', 
                            padding: '16px',
                            opacity: m.status === 'paid_out' ? 0.7 : 1,
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{m.title}</h4>
                              <span className={`badge ${
                                m.status === 'paid_out' ? 'badge--success' : m.status === 'ai_review' ? 'badge--warning' : 'badge--violet'
                              }`}>
                                {m.status}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                              <span>Deadline: <strong className="mono">{m.deadline}</strong></span>
                              <span>•</span>
                              <span>Fondo: <strong className="text-cyan mono">{m.amount.toLocaleString()} ARB</strong></span>
                            </div>
                            {m.txHash && (
                              <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                                <span className="text-success font-mono">Arbitrum Tx Hash:</span>
                                <a href="#" onClick={(e) => e.preventDefault()} className="mono text-cyan" style={{ textDecoration: 'underline' }}>
                                  {m.txHash} <ExternalLink size={8} style={{ display: 'inline' }} />
                                </a>
                              </div>
                            )}
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            {m.status === 'paid_out' && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--state-success)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                                <Check size={14} /> Pagado
                              </div>
                            )}
                            {m.status === 'ai_review' && (
                              <div className="mono text-warning" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                                AI Audit Score: {m.auditReport.score * 100}%
                              </div>
                            )}
                            {m.status === 'funded' && isActive && (
                              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-violet)', fontWeight: 600 }}>
                                Esperando Entrega
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Evidence Form */}
                <div className="card" style={{ background: '#121826', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                  <h3 className="font-display" style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '6px' }}>
                    Entregar Hito Activo para Auditoría IA
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                    Carga el repositorio de GitHub con los commits o el archivo de Figma para gatillar la auditoría automatizada en tiempo real.
                  </p>

                  <form onSubmit={handleSubmitEvidence} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Tipo de Evidencia</label>
                        <select 
                          value={evidenceType}
                          onChange={(e) => setEvidenceType(e.target.value as any)}
                          disabled={activeMilestone.status !== 'funded' || activeStartup.isPaused}
                          style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                        >
                          <option value="commit">Commits de Código (GitHub)</option>
                          <option value="figma">Tokens de Diseño (Figma)</option>
                          <option value="report">Reporte Técnico (PDF / Drive)</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>URL de la Evidencia</label>
                        <input 
                          type="url" 
                          placeholder={evidenceType === 'commit' ? 'https://github.com/startupc/tu-repo/commit/xxx' : 'https://figma.com/file/xxx'}
                          value={evidenceLink}
                          onChange={(e) => setEvidenceLink(e.target.value)}
                          required
                          disabled={activeMilestone.status !== 'funded' || activeStartup.isPaused}
                          style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn--primary animate-glow"
                      disabled={activeMilestone.status !== 'funded' || isSubmittingEvidence || activeStartup.isPaused}
                      style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    >
                      <Send size={14} style={{ marginRight: '6px' }} />
                      {isSubmittingEvidence ? 'Ejecutando Agente de IA...' : activeMilestone.status === 'funded' ? 'Gatillar Auditoría de IA & Enviar' : 'Entrega ya enviada'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Transparent AI Auditor Dashboard & Escrow Release */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                
                {/* AI Score Report card */}
                <div className="card" style={{ background: '#121826', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(124, 92, 255, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>
                    <Cpu size={20} />
                    <h3 className="font-display" style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>
                      Reporte Transparente del Auditor IA
                    </h3>
                  </div>

                  {activeMilestone.status === 'funded' ? (
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', textAlign: 'center', padding: '30px 0' }}>
                      <Code size={36} className="text-tertiary" style={{ margin: '0 auto 10px auto', display: 'block' }} />
                      No hay evidencias cargadas para este hito. Envía una entrega a la izquierda para ejecutar el agente de IA.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-base)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>AI General Score</span>
                        <div className="mono" style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: activeMilestone.auditReport.score >= 0.8 ? 'var(--state-success)' : 'var(--state-warning)' }}>
                          {Math.round(activeMilestone.auditReport.score * 100)}%
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xs)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Commits de GitHub Verificados:</span>
                          <span className="mono font-bold">{activeMilestone.auditReport.commitsVerified} / {activeMilestone.auditReport.totalCommits}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Test Coverage Auditado:</span>
                          <span className="mono font-bold text-cyan">{activeMilestone.auditReport.testCoverage}%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Figma Design Tokens Check:</span>
                          <span className={`mono font-bold ${activeMilestone.auditReport.figmaTokens ? 'text-success' : 'text-tertiary'}`}>
                            {activeMilestone.auditReport.figmaTokens ? 'Aprobado' : 'No Detectado'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Decisión Preliminar IA:</span>
                          <span className={`badge ${
                            activeMilestone.auditReport.score >= 0.75 ? 'badge--success' : 'badge--warning'
                          }`}>
                            {activeMilestone.auditReport.score >= 0.75 ? 'Aprobado (Soft)' : 'Requiere firma manual'}
                          </span>
                        </div>
                      </div>

                      <div style={{ background: 'var(--bg-base)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', borderLeft: '3px solid var(--accent-violet)' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Notas de IA:</div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          {activeMilestone.auditReport.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ESCROW RELEASE ACTION BUTTON */}
                <div className="card animate-glow" style={{ 
                  background: '#121826', 
                  padding: '24px', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid rgba(47, 230, 255, 0.25)', 
                  textAlign: 'center' 
                }}>
                  <div style={{ color: 'var(--accent-cyan)', marginBottom: '10px' }}>
                    <Lock size={32} style={{ margin: '0 auto' }} />
                  </div>
                  <h3 className="font-display" style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: '6px' }}>
                    Retirar Fondos de Smart Contract
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                    Una vez aprobado el hito por el mentor académico, los fondos se desbloquean on-chain y pueden ser transferidos con gas cubierto por StartUPC.
                  </p>

                  <button 
                    onClick={handleWithdrawEscrow}
                    disabled={activeMilestone.status !== 'paid_out' || activeMilestone.txHash !== undefined || isWithdrawing || activeStartup.isPaused}
                    className="btn btn--primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                  >
                    <Unlock size={14} style={{ marginRight: '6px' }} />
                    {isWithdrawing ? 'Procesando en Arbitrum...' : activeMilestone.txHash ? 'Fondos ya retirados' : activeMilestone.status === 'paid_out' ? 'Retirar Escrow a Wallet' : 'Esperando aprobación'}
                  </button>

                  {activeMilestone.txHash && (
                    <div style={{ marginTop: '12px', padding: '10px', background: 'var(--state-success-dim)', border: '1px solid var(--state-success)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
                      <div className="text-success" style={{ fontWeight: 700 }}>✓ TRANSFERENCIA EXITOSA</div>
                      <div className="mono" style={{ fontSize: '10px', color: 'var(--text-primary)', marginTop: '2px' }}>
                        Hash: {activeMilestone.txHash}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ================ VIEW 3: TECHNICAL EXPERT ================ */}
        {/* ======================================================== */}
        {session.role === UserRole.MENTOR && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* Top overview layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-xl)' }}>
              
              {/* Inbox list */}
              <div className="card" style={{ background: '#121826', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                <h3 className="font-display" style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                  Bandeja de Auditorías Pendientes
                </h3>

                <div className="inbox-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {startups.map((p) => {
                    const activeM = p.milestones.find(m => m.id === p.activeMilestoneId) || p.milestones[0];
                    const isSelected = selectedProjectId === p.id;
                    const hasPending = activeM.status === 'ai_review';

                    return (
                      <div 
                        key={p.id}
                        onClick={() => setSelectedProjectId(p.id)}
                        style={{
                          background: isSelected ? 'var(--bg-surface-alt)' : 'var(--bg-base)',
                          border: isSelected ? '1px solid var(--accent-cyan)' : hasPending ? '1px solid rgba(124, 92, 255, 0.2)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{p.name}</span>
                            {p.isPaused && <span className="badge badge--error" style={{ fontSize: '8px', padding: '2px 4px' }}>PAUSED</span>}
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{p.category}</span>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span className={`badge ${hasPending ? 'badge--warning' : 'badge--success'}`} style={{ fontSize: '10px' }}>
                            {activeM.status}
                          </span>
                          {hasPending && (
                            <div className="mono text-cyan" style={{ fontSize: '10px', marginTop: '2px' }}>
                              Score: {Math.round(activeM.auditReport.score * 100)}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detail view of active project */}
              <div className="card" style={{ background: '#121826', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>DETALLE DEL ENTREGABLE</span>
                    <h2 className="font-display text-cyan" style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0 }}>
                      {activeStartup.name} — {activeMilestone.title}
                    </h2>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>MONTO DEL ESCROW</div>
                    <span className="font-mono text-cyan" style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                      {activeMilestone.amount.toLocaleString()} ARB
                    </span>
                  </div>
                </div>

                {/* Evidence Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'var(--bg-base)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 700, fontSize: 'var(--text-xs)', marginBottom: '10px' }}>
                      <FileText size={14} color="var(--accent-cyan)" />
                      Evidencia Presentada
                    </div>

                    {activeMilestone.evidenceLink ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xs)' }}>
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Tipo de Evidencia: </span>
                          <strong className="text-cyan font-mono">{activeMilestone.evidenceType || 'commit'}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>URL del Entregable: </span>
                          <a href="#" onClick={(e) => e.preventDefault()} className="mono text-violet text-truncate" style={{ display: 'block', textDecoration: 'underline', marginTop: '2px' }}>
                            {activeMilestone.evidenceLink}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', textAlign: 'center', padding: '12px' }}>
                        No hay evidencias cargadas para este hito.
                      </div>
                    )}
                  </div>

                  {/* AI Score panel */}
                  <div style={{ background: 'var(--bg-base)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124, 92, 255, 0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-violet)', fontWeight: 700, fontSize: 'var(--text-xs)', marginBottom: '10px' }}>
                      <Cpu size={14} />
                      Reporte del Agente de IA
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: 'var(--text-xs)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>AI General Score:</span>
                        <strong className="mono" style={{ color: activeMilestone.auditReport.score >= 0.75 ? 'var(--state-success)' : 'var(--state-warning)' }}>
                          {Math.round(activeMilestone.auditReport.score * 100)}%
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Commits Verificados:</span>
                        <span className="mono">{activeMilestone.auditReport.commitsVerified}/{activeMilestone.auditReport.totalCommits}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Test Coverage:</span>
                        <span className="mono text-cyan">{activeMilestone.auditReport.testCoverage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Verdict detail notes */}
                {activeMilestone.auditReport.notes && (
                  <div style={{ background: 'var(--bg-surface-alt)', padding: '16px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-violet)', marginBottom: '24px' }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      Explicación y Veredicto Técnico IA:
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {activeMilestone.auditReport.notes}
                    </p>
                  </div>
                )}

                {/* Mentor Actions Panel */}
                <div style={{ 
                  background: 'var(--bg-base)', 
                  padding: '20px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Acciones de Aprobación Multisig
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      onClick={() => handleMentorReview(activeStartup.id, 'approved')}
                      disabled={activeMilestone.status !== 'ai_review' || isActionLoading !== null || activeStartup.isPaused}
                      className="btn btn--primary"
                      style={{ justifyContent: 'center', background: 'var(--state-success)', border: '1px solid var(--state-success)', color: 'var(--bg-base)', fontWeight: 800, padding: '12px' }}
                    >
                      {isActionLoading === 'approved' ? 'Firmando Multisig...' : 'Aprobar & Liberar Fondos'}
                    </button>

                    <button
                      onClick={() => handleMentorReview(activeStartup.id, 'rejected')}
                      disabled={activeMilestone.status !== 'ai_review' || isActionLoading !== null || activeStartup.isPaused}
                      className="btn btn--secondary"
                      style={{ justifyContent: 'center', padding: '12px' }}
                    >
                      {isActionLoading === 'rejected' ? 'Gatillando rechazo...' : 'Rechazar & Pedir Cambios'}
                    </button>
                  </div>

                  {/* Special Audit Escalation Button (visible especially for SABIO-IA critical warning cases) */}
                  {activeStartup.id === 'sabioia' && activeMilestone.status === 'ai_review' && (
                    <button
                      onClick={() => handleMentorReview(activeStartup.id, 'escalated')}
                      disabled={activeMilestone.status !== 'ai_review' || isActionLoading !== null || activeStartup.isPaused}
                      className="btn btn--secondary"
                      style={{ 
                        justifyContent: 'center', 
                        padding: '10px',
                        background: 'var(--state-error-dim)',
                        color: 'var(--state-error)',
                        borderColor: 'rgba(255, 107, 107, 0.4)'
                      }}
                    >
                      ⚠️ Escalar a Comité de Arbitraje por Riesgo de Plagio
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
