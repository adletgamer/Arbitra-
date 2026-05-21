import { useState } from 'react';
import { ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { UserRole } from '../types';
import type { StartupProject } from '../types';

interface AuthProps {
  onNavigate: (view: 'home' | 'auth' | 'dashboard') => void;
  onOnboardingComplete: (newStartup: StartupProject) => void;
  onConnectWallet: (address: string) => void;
}

export default function Auth({ onNavigate, onOnboardingComplete, onConnectWallet }: AuthProps) {
  const [logoError, setLogoError] = useState(false);

  // Screen Mode: 'login' | 'signup' | 'onboarding'
  const [mode, setMode] = useState<'login' | 'signup' | 'onboarding'>('login');

  // Login Form State
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STARTUP);

  // Onboarding Wizard Step: 1, 2, 3
  const [step, setStep] = useState(1);

  // Onboarding Form States
  const [startupName, setStartupName] = useState('');
  const [category, setCategory] = useState('Fintech / Web3');
  const [description, setDescription] = useState('');
  const [github, setGithub] = useState('');
  const [figma, setFigma] = useState('');
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate simple login based on role selected
    if (role === UserRole.STARTUP) {
      onConnectWallet('0x3A1b...F4e2'); // Connects default startup address
      onNavigate('dashboard');
    } else if (role === UserRole.ADMIN) {
      onConnectWallet('0xAdmin...8888');
      onNavigate('dashboard');
    } else {
      onConnectWallet('0xMentor...9999');
      onNavigate('dashboard');
    }
  };

  // Simulate wallet connection in onboarding step 3
  const handleConnectWalletSim = () => {
    setIsWalletConnecting(true);
    setTimeout(() => {
      setIsWalletConnecting(false);
      setWalletConnected(true);
      const generatedAddress = '0x' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...' + Math.random().toString(16).substring(2, 6).toUpperCase();
      setWalletAddress(generatedAddress);
      onConnectWallet(generatedAddress);
    }, 1500);
  };

  // Finalize onboarding
  const handleFinalize = () => {
    if (!startupName || !description) return;

    // Create a new startup record dynamically
    const newStartup: StartupProject = {
      id: startupName.toLowerCase().replace(/\s+/g, '-'),
      name: startupName,
      category,
      description,
      escrowTotal: 10000, // Default locked
      escrowReleased: 0,
      activeMilestoneId: 1,
      walletConnected: true,
      walletAddress: walletAddress || '0xNewStartup...3214',
      githubRepo: github || 'https://github.com/startupc/new-startup',
      figmaUrl: figma || 'https://figma.com/file/new-startup',
      isPaused: false,
      milestones: [
        {
          id: 1,
          title: '#1 — Prototipo Inicial & Frontend',
          amount: 5000,
          status: 'ai_review',
          deadline: '2026-06-30',
          evidenceLink: github ? `${github}/commit/init` : 'https://github.com/startupc/new-startup/commit/init',
          evidenceType: 'commit',
          auditReport: {
            commitsVerified: 5,
            totalCommits: 5,
            testCoverage: 60,
            figmaTokens: false,
            score: 0.65,
            verdict: 'pending',
            notes: 'Hito inicial enviado. La IA está auditando los primeros commits de la startup.'
          }
        },
        {
          id: 2,
          title: '#2 — Integración de Smart Contracts L2',
          amount: 5000,
          status: 'funded',
          deadline: '2026-08-15',
          auditReport: {
            commitsVerified: 0,
            totalCommits: 0,
            testCoverage: 0,
            figmaTokens: false,
            score: 0.0,
            verdict: 'pending',
            notes: 'Hito financiado y bloqueado en escrow.'
          }
        }
      ]
    };

    onOnboardingComplete(newStartup);
  };

  return (
    <div className="auth-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      <div className="bg-grid" style={{ opacity: 0.05 }}></div>
      <div className="bg-gradient-orb" style={{ opacity: 0.1, width: '400px', height: '400px', top: '10%' }}></div>

      <div className="container" style={{ maxWidth: '500px', width: '100%', padding: 'var(--space-md)', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div className="navbar__logo" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '10px', fontSize: 'var(--text-2xl)' }}>
            {!logoError ? (
              <img 
                src="/arbitra_logo.png" 
                alt="Arbitra Logo" 
                style={{ height: '36px', width: 'auto', marginRight: '8px', display: 'block' }} 
                onError={() => setLogoError(true)} 
              />
            ) : (
              <span className="navbar__logo-fallback-icon" style={{ marginRight: '6px' }}>⚖</span>
            )}
            <span className="font-display" style={{ fontWeight: 800 }}>Arbitra</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Infraestructura de Escrow Autoejecutable para StartUPC
          </p>
        </div>

        {/* ========== LOGIN SCREEN ========== */}
        {mode === 'login' && (
          <div className="card" style={{ background: '#121826', padding: 'var(--space-xl)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
            <h2 className="font-display" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-md)', textAlign: 'center' }}>
              Ingresar al Portal
            </h2>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Tu Email Corporativo</label>
                <input 
                  type="email" 
                  placeholder="ejemplo@upc.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Selecciona tu Perfil</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  style={{
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none'
                  }}
                >
                  <option value={UserRole.STARTUP}>Startup Beneficiaria</option>
                  <option value={UserRole.ADMIN}>Administrador StartUPC</option>
                  <option value={UserRole.MENTOR}>Mentor / Evaluador Académico</option>
                </select>
              </div>

              <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                Acceder
                <ArrowRight size={16} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '15px' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>¿Eres una nueva Startup? </span>
              <button 
                onClick={() => setMode('onboarding')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}
              >
                Crear Cuenta & Onboarding
              </button>
            </div>
          </div>
        )}

        {/* ========== ONBOARDING WIZARD SCREEN ========== */}
        {mode === 'onboarding' && (
          <div className="card" style={{ background: '#121826', padding: 'var(--space-xl)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
            
            {/* Step Indicators */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xl)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: 'var(--border-subtle)', zIndex: 1 }}>
                <div style={{ height: '100%', background: 'var(--accent-cyan)', width: `${((step - 1) / 2) * 100}%`, transition: 'width 0.3s ease' }}></div>
              </div>

              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: s <= step ? 'var(--accent-cyan-dim)' : 'var(--bg-base)', 
                    border: s <= step ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    color: s <= step ? 'var(--accent-cyan)' : 'var(--text-tertiary)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 'var(--text-xs)',
                    zIndex: 2 
                  }}
                >
                  {s < step ? <CheckCircle size={16} /> : s}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 className="font-display" style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  1. Perfil del Proyecto (StartUPC)
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Ingresa los detalles principales de tu startup para registrar el programa de financiamiento.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Nombre de la Startup</label>
                  <input 
                    type="text" 
                    placeholder="ej. Wayki"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-md)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Categoría StartUPC</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-md)', outline: 'none' }}
                  >
                    <option value="Fintech / Web3">Fintech / Web3</option>
                    <option value="Edtech / Educación">Edtech / Educación</option>
                    <option value="SaaS / B2B">SaaS / B2B</option>
                    <option value="Healthtech">Healthtech</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Descripción Corta (Max 2 líneas)</label>
                  <textarea 
                    placeholder="ej. Billetera social para microfinanzas colaborativas y remesas rápidas on-chain."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    maxLength={150}
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-md)', outline: 'none', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button onClick={() => setMode('login')} className="btn btn--secondary" style={{ padding: '8px 16px' }}>
                    Atrás
                  </button>
                  <button 
                    onClick={() => { if (startupName && description) setStep(2); }} 
                    className="btn btn--primary"
                    disabled={!startupName || !description}
                    style={{ padding: '8px 16px' }}
                  >
                    Siguiente
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 className="font-display" style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  2. Integraciones Técnicas
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Vincula tus canales de desarrollo. Nuestro auditor de IA evaluará commits y tokens de diseño.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Repositorio GitHub (Opcional)</label>
                  <input 
                    type="url" 
                    placeholder="https://github.com/startupc/tu-repo"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-md)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Archivo Figma (Opcional)</label>
                  <input 
                    type="url" 
                    placeholder="https://figma.com/file/tu-diseno"
                    value={figma}
                    onChange={(e) => setFigma(e.target.value)}
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '10px', borderRadius: 'var(--radius-md)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button onClick={() => setStep(1)} className="btn btn--secondary" style={{ padding: '8px 16px' }}>
                    Atrás
                  </button>
                  <button 
                    onClick={() => setStep(3)} 
                    className="btn btn--primary"
                    style={{ padding: '8px 16px' }}
                  >
                    Siguiente
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 className="font-display" style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  3. Configuración de Wallet
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Conecta tu wallet corporativa de Arbitrum. En esta dirección recibirás las liberaciones de escrow.
                </p>

                <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  {walletConnected ? (
                    <div style={{ textAlign: 'center' }}>
                      <CheckCircle size={32} color="var(--state-success)" style={{ marginBottom: '6px' }} />
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>Wallet Vinculada</div>
                      <div className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-cyan)', marginTop: '4px' }}>{walletAddress}</div>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn--secondary animate-glow"
                      onClick={handleConnectWalletSim}
                      disabled={isWalletConnecting}
                      style={{ padding: '10px 20px', gap: '8px' }}
                    >
                      <Lock size={16} />
                      {isWalletConnecting ? 'Firmando en MetaMask...' : 'Conectar MetaMask / Rabby'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button onClick={() => setStep(2)} className="btn btn--secondary" style={{ padding: '8px 16px' }} disabled={isWalletConnecting}>
                    Atrás
                  </button>
                  <button 
                    onClick={handleFinalize} 
                    className="btn btn--primary"
                    disabled={!walletConnected || isWalletConnecting}
                    style={{ padding: '8px 16px' }}
                  >
                    Finalizar
                    <CheckCircle size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
