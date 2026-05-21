import { useState } from 'react';
import { Shield, Rocket, Users, Lock, Cpu, CheckCircle, ChevronDown, HelpCircle } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: 'home' | 'auth' | 'dashboard') => void;
  isConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
}

export default function Home({ onNavigate, isConnected, walletAddress: _walletAddress, onConnectWallet }: HomeProps) {
  // Tabs State
  const [activeTab, setActiveTab] = useState<'admin' | 'startup' | 'mentor'>('admin');

  // Timeline Simulator State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<'initial' | 'connecting' | 'success'>('initial');
  const [simProgress, setSimProgress] = useState('50%');

  // FAQ State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Connect Wallet Simulation in Landing
  const [isConnecting, setIsConnecting] = useState(false);

  const triggerConnect = () => {
    if (isConnected) {
      onNavigate('dashboard');
      return;
    }
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      onConnectWallet();
      onNavigate('dashboard');
    }, 1500);
  };

  // Milestone transition simulation
  const handleSimulate = () => {
    if (simStep === 'success') {
      // Revert simulation
      setIsSimulating(true);
      setTimeout(() => {
        setSimStep('initial');
        setSimProgress('50%');
        setIsSimulating(false);
      }, 1000);
      return;
    }

    setIsSimulating(true);
    setSimStep('connecting');
    // Simulate rollup soft finality (1.5 seconds)
    setTimeout(() => {
      setSimStep('success');
      setSimProgress('100%');
      setIsSimulating(false);
    }, 1500);
  };

  const faqData = [
    {
      question: "¿Qué es Arbitra y cómo asegura los fondos de incubación?",
      answer: "Arbitra custodia los fondos asignados a startups en Smart Contracts autoejecutables en Arbitrum (L2). El capital se bloquea al inicio de la cohorte y se libera de forma programática únicamente cuando se cumplen hitos técnicos verificados on-chain."
    },
    {
      question: "¿Cómo funciona la validación por IA en tiempo real?",
      answer: "Nuestros agentes de IA auditan repositorios de GitHub (commits verificados, cobertura de código) y diseños en Figma (tokens de diseño). Generan un Score de Cumplimiento transparente que elimina valoraciones subjetivas."
    },
    {
      question: "¿Qué es Arbitrum L2 y por qué es ideal para StartUPC?",
      answer: "Arbitrum es una Layer 2 de Ethereum que ofrece 'Soft Finality' (verificación en milisegundos) y costos de gas hasta 100 veces menores. Esto permite auditorías inmutables y micropagos eficientes sin fricciones financieras."
    },
    {
      question: "¿Cuál es el rol del mentor técnico en la liberación multisig?",
      answer: "Los mentores actúan como auditores humanos finales. La IA automatiza el 90% del trabajo pesado; si un hito es complejo o de alto riesgo, se escala para que el mentor valide los entregables y firme la liberación multisig con un solo clic."
    }
  ];

  return (
    <div className="landing-layout">
      {/* ========== NAVBAR ========== */}
      <nav className="navbar scrolled">
        <div className="container navbar__container">
          <div className="navbar__logo" style={{ cursor: 'pointer' }} onClick={() => onNavigate('home')}>
            <img src="/arbitra_logo.png" alt="Arbitra Logo" className="navbar__logo-img" style={{ height: '32px', width: 'auto', marginRight: '10px' }} onError={(e) => {
              // Fallback to high-end SVG logo if image doesn't load
              (e.target as HTMLElement).style.display = 'none';
            }} />
            <span className="navbar__logo-fallback-icon">⚖</span>
            <span className="font-display" style={{ fontWeight: 800 }}>Arbitra</span>
          </div>

          <div className="navbar__links">
            <a href="#bento" className="navbar__link">Bento Grid</a>
            <a href="#milestones" className="navbar__link">Motor de Hitos</a>
            <a href="#roles" className="navbar__link">Perfiles</a>
            <a href="#faq" className="navbar__link">FAQ</a>
            {isConnected ? (
              <button onClick={() => onNavigate('dashboard')} className="btn btn--secondary" style={{ padding: '8px 16px' }}>
                Ir al Dashboard
              </button>
            ) : (
              <button onClick={triggerConnect} className="btn btn--secondary" disabled={isConnecting} style={{ padding: '8px 16px' }}>
                {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <header className="hero" id="hero">
        <div className="bg-grid"></div>
        <div className="bg-gradient-orb"></div>

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="section__label reveal visible" style={{ display: 'inline-flex', margin: '0 auto var(--space-md) auto' }}>
            <span className="section__label-dot"></span>
            Arbitra & StartUPC MVP
          </span>
          <h1 className="hero__title reveal visible" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1', marginBottom: 'var(--space-md)' }}>
            Capital <span className="hero__title-highlight">programable</span> para<br />
            incubadoras universitarias
          </h1>
          <p className="hero__subtitle reveal visible" style={{ maxWidth: '700px', margin: '0 auto var(--space-xl) auto', fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
            Fondos custodiados en Smart Contracts autoejecutables en Arbitrum. Liberación condicionada a validación de IA y evidencia auditable.
          </p>

          <div className="hero__actions reveal visible" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
            <button className="btn btn--primary" onClick={triggerConnect} disabled={isConnecting}>
              <span className="btn__icon">⚡</span>
              {isConnecting ? 'Ejecutando firma...' : 'Conectar Wallet Institucional'}
            </button>
            <button className="btn btn--secondary" onClick={() => onNavigate('auth')}>
              Registrar Startup
            </button>
          </div>
        </div>
      </header>

      {/* ========== BENTO GRID (PROBLEMA VS SOLUCION) ========== */}
      <section className="section bento-section" id="bento" style={{ background: 'var(--bg-base-alt)' }}>
        <div className="container">
          <div className="reveal visible" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span className="section__label" style={{ display: 'inline-flex', margin: '0 auto var(--space-sm) auto' }}>
              <span className="section__label-dot"></span>
              Estructura B2B
            </span>
            <h2 className="section__title">Problema vs. Solución de Arbitra</h2>
            <p className="section__subtitle" style={{ margin: '0 auto' }}>
              Por qué las incubadoras líderes están migrando de procesos manuales a capital programable.
            </p>
          </div>

          <div className="bento-grid">
            {/* Bento Card 1: Bureaucracy */}
            <div className="bento-card">
              <div className="bento-card__badge badge--error">Problema</div>
              <h3 className="bento-card__title">Burocracia Manual</h3>
              <p className="bento-card__desc">
                Fondos paralizados en firmas manuales, contratos en papel y desembolsos basados en valoraciones subjetivas.
              </p>
              <div className="bento-card__metric text-error">45+ Días de Retraso</div>
            </div>

            {/* Bento Card 2: Smart Escrow */}
            <div className="bento-card" style={{ border: '1px solid rgba(47, 230, 255, 0.25)' }}>
              <div className="bento-card__badge badge--cyan">Solución</div>
              <h3 className="bento-card__title">Escrow Inteligente L2</h3>
              <p className="bento-card__desc">
                Escrow autoejecutable en Arbitrum. Desembolsos inmediatos y automáticos contra validación de hitos técnicos.
              </p>
              <div className="bento-card__metric text-cyan">Liquidación Inmediata</div>
            </div>

            {/* Bento Card 3: Late Audits */}
            <div className="bento-card">
              <div className="bento-card__badge badge--error">Problema</div>
              <h3 className="bento-card__title">Auditorías Tardías</h3>
              <p className="bento-card__desc">
                Revisiones trimestrales tardías, sin auditoría de código en tiempo real y expuestas a sesgos.
              </p>
              <div className="bento-card__metric text-error">Opacidad Operativa</div>
            </div>

            {/* Bento Card 4: AI Auditing */}
            <div className="bento-card" style={{ border: '1px solid rgba(124, 92, 255, 0.25)' }}>
              <div className="bento-card__badge badge--violet">Solución</div>
              <h3 className="bento-card__title">Agentes de IA On-Chain</h3>
              <p className="bento-card__desc">
                Agentes de IA auditan repositorios en tiempo real, respaldados por aprobación multisig multifirma.
              </p>
              <div className="bento-card__metric text-violet">Auditoría 24/7</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MILESTONE ENGINE (LINEAR SIMULATOR) ========== */}
      <section className="section milestones" id="milestones">
        <div className="container">
          <div className="reveal visible" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span className="section__label" style={{ display: 'inline-flex', margin: '0 auto var(--space-sm) auto' }}>
              <span className="section__label-dot"></span>
              Motor de Hitos
            </span>
            <h2 className="section__title">Smart Milestone Contract Preview</h2>
            <p className="section__subtitle" style={{ margin: '0 auto' }}>
              Visualiza el ciclo de vida de tu capital: del depósito on-chain a la liquidación auditada.
            </p>
          </div>

          {/* Timeline Wrapper */}
          <div className="reveal visible" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div className="milestone-timeline">
              <div className="milestone-timeline__line">
                <div 
                  className="milestone-timeline__progress milestone-timeline__progress--gradient" 
                  style={{ width: simProgress, transition: 'width 1s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
                ></div>
              </div>

              {/* Step 1: Funded */}
              <div className="milestone-step milestone-step--complete">
                <div className="milestone-step__node">
                  <Lock size={18} color="var(--accent-cyan)" />
                </div>
                <span className="milestone-step__label">Funded</span>
                <span className="milestone-step__data mono">10,000 ARB</span>
              </div>

              {/* Step 2: AI Review */}
              <div className={`milestone-step ${simStep === 'success' ? 'milestone-step--complete' : 'milestone-step--active'}`}>
                <div className="milestone-step__node" id="step-aireview-node">
                  {simStep === 'success' ? (
                    <CheckCircle size={18} color="var(--accent-cyan)" />
                  ) : (
                    <Cpu size={18} color="var(--accent-violet)" />
                  )}
                </div>
                <span className="milestone-step__label">AI Review</span>
                <span className="milestone-step__data mono">
                  {simStep === 'success' ? 'Score: 0.94' : 'Score: 0.42'}
                </span>
              </div>

              {/* Step 3: Paid Out */}
              <div className={`milestone-step ${simStep === 'success' ? 'milestone-step--complete' : 'milestone-step--pending'}`}>
                <div className="milestone-step__node" id="step-paidout-node">
                  {simStep === 'success' ? (
                    <CheckCircle size={18} color="var(--accent-cyan)" />
                  ) : (
                    <CheckCircle size={18} color="var(--text-tertiary)" />
                  )}
                </div>
                <span className="milestone-step__label">Paid Out</span>
                <span className="milestone-step__data mono text-truncate" style={{ maxWidth: '90px' }}>
                  {simStep === 'success' ? 'Tx: 0x8a9b' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="milestone-detail reveal visible" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            {/* Card 1 */}
            <div className={`card milestone-detail-card ${isSimulating ? 'skeleton-active' : ''}`} style={{ background: '#121826' }}>
              <div className="milestone-detail-card__title" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-md)', fontWeight: 700 }}>
                <span style={{ color: 'var(--accent-cyan)', marginRight: '6px' }}>◆</span> Detalle del Hito Activo
              </div>
              <div className="milestone-detail-card__row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="milestone-detail-card__key" style={{ color: 'var(--text-tertiary)' }}>Startup</span>
                <span className="milestone-detail-card__val" style={{ color: 'var(--text-secondary)' }}>Wayki</span>
              </div>
              <div className="milestone-detail-card__row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="milestone-detail-card__key" style={{ color: 'var(--text-tertiary)' }}>Hito</span>
                <span className="milestone-detail-card__val" style={{ color: 'var(--text-secondary)' }}>
                  {simStep === 'success' ? '#3 — Completado (Liberado)' : '#3 — Prototipo Funcional'}
                </span>
              </div>
              <div className="milestone-detail-card__row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="milestone-detail-card__key" style={{ color: 'var(--text-tertiary)' }}>Monto Escrow</span>
                <span className="milestone-detail-card__val text-cyan mono">7,500 ARB</span>
              </div>
              <div className="milestone-detail-card__row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span className="milestone-detail-card__key" style={{ color: 'var(--text-tertiary)' }}>Estado</span>
                <span className={`badge ${simStep === 'success' ? 'badge--success' : 'badge--violet'}`}>
                  {simStep === 'success' ? 'paid_out' : 'ai_review'}
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className={`card milestone-detail-card ${isSimulating ? 'skeleton-active' : ''}`} style={{ background: '#121826' }}>
              <div className="milestone-detail-card__title" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-md)', fontWeight: 700 }}>
                <span style={{ color: 'var(--accent-violet)', marginRight: '6px' }}>◆</span> Validación IA — Resultado Parcial
              </div>
              <div className="milestone-detail-card__row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="milestone-detail-card__key" style={{ color: 'var(--text-tertiary)' }}>Score General</span>
                <span className={`milestone-detail-card__val mono ${simStep === 'success' ? 'text-success' : 'text-warning'}`}>
                  {simStep === 'success' ? '0.94 / 1.00' : '0.42 / 1.00'}
                </span>
              </div>
              <div className="milestone-detail-card__row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="milestone-detail-card__key" style={{ color: 'var(--text-tertiary)' }}>Commits</span>
                <span className="milestone-detail-card__val mono" style={{ color: 'var(--text-secondary)' }}>
                  {simStep === 'success' ? '20 / 20' : '14 / 20'}
                </span>
              </div>
              <div className="milestone-detail-card__row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="milestone-detail-card__key" style={{ color: 'var(--text-tertiary)' }}>Firma Mentor</span>
                <span className={`badge ${simStep === 'success' ? 'badge--success' : 'badge--warning'}`}>
                  {simStep === 'success' ? 'Aprobado' : 'Pendiente'}
                </span>
              </div>
              <div className="milestone-detail-card__row" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span className="milestone-detail-card__key" style={{ color: 'var(--text-tertiary)' }}>Veredicto IA</span>
                <span className={`badge ${simStep === 'success' ? 'badge--success' : 'badge--error'}`}>
                  {simStep === 'success' ? 'Validación Exitosa' : 'Requiere revisión'}
                </span>
              </div>
            </div>
          </div>

          {/* Simulator CTA */}
          <div className="reveal visible" style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
            <button 
              className="btn btn--primary" 
              onClick={handleSimulate} 
              disabled={isSimulating}
              style={{ margin: '0 auto', gap: '8px' }}
            >
              <span className="btn__icon">⚡</span>
              {isSimulating ? (
                'Confirmando en Arbitrum...'
              ) : simStep === 'success' ? (
                'Restablecer Demo de Hito'
              ) : (
                'Simular Transición de Hito (Arbitrum L2)'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ========== ROLES & PERFILES TABS SECTION ========== */}
      <section className="section roles-section" id="roles" style={{ background: 'var(--bg-base-alt)' }}>
        <div className="container">
          <div className="reveal visible" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <span className="section__label" style={{ display: 'inline-flex', margin: '0 auto var(--space-sm) auto' }}>
              <span className="section__label-dot"></span>
              Perfiles de Acceso
            </span>
            <h2 className="section__title">Tres roles. Una sola fuente de verdad.</h2>
            <p className="section__subtitle" style={{ margin: '0 auto' }}>
              Optimización de flujos de trabajo B2B según tu nivel de acceso institucional.
            </p>
          </div>

          {/* Tabs buttons */}
          <div className="tabs-header reveal visible">
            <button 
              className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} 
              onClick={() => setActiveTab('admin')}
            >
              <Shield size={16} />
              Administrador
            </button>
            <button 
              className={`tab-btn ${activeTab === 'startup' ? 'active' : ''}`} 
              onClick={() => setActiveTab('startup')}
            >
              <Rocket size={16} />
              Startup
            </button>
            <button 
              className={`tab-btn ${activeTab === 'mentor' ? 'active' : ''}`} 
              onClick={() => setActiveTab('mentor')}
            >
              <Users size={16} />
              Mentor / Auditor
            </button>
          </div>

          {/* Tabs Content */}
          <div className="tabs-content-container reveal visible">
            {activeTab === 'admin' && (
              <div className="tab-content active">
                <div className="role-card">
                  <div className="role-card__left">
                    <h3 className="role-card__title">Gestión de Fondos & Cumplimiento</h3>
                    <ul className="role-bullets">
                      <li>
                        <span className="bullet-icon">⚖️</span>
                        <div>
                          <strong className="text-cyan">Capital Programable:</strong> Creación de grants y custodia on-chain mediante reglas autoejecutables.
                        </div>
                      </li>
                      <li>
                        <span className="bullet-icon">📊</span>
                        <div>
                          <strong className="text-cyan">Monitoreo Técnico:</strong> Scoring automatizado de riesgo de IA en tiempo real por cada cohorte.
                        </div>
                      </li>
                      <li>
                        <span className="bullet-icon">🔐</span>
                        <div>
                          <strong className="text-cyan">Gobernanza Multisig:</strong> Control total y liberación de capital mediante firmas conjuntas.
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="role-card__right">
                    <div className="role-preview">
                      <div className="preview-badge text-cyan font-mono">Admin View</div>
                      <div className="preview-screen">
                        <div className="preview-line"><span>Programas:</span> <span className="mono text-success">3 Activos</span></div>
                        <div className="preview-line"><span>ARB Bloqueados:</span> <span className="mono text-cyan">150,000 ARB</span></div>
                        <div className="preview-line"><span>Ratio Aprobación:</span> <span className="mono text-violet">4.2 horas</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'startup' && (
              <div className="tab-content active">
                <div className="role-card">
                  <div className="role-card__left">
                    <h3 className="role-card__title">Desarrollo Eficiente & Transparencia</h3>
                    <ul className="role-bullets">
                      <li>
                        <span className="bullet-icon">🚀</span>
                        <div>
                          <strong className="text-violet">Carga de Evidencias:</strong> Vinculación directa de entregables vía GitHub, Figma o Drive.
                        </div>
                      </li>
                      <li>
                        <span className="bullet-icon">⏱️</span>
                        <div>
                          <strong className="text-violet">Soft Finality L2:</strong> Verificación técnica instantánea sobre la red Arbitrum.
                        </div>
                      </li>
                      <li>
                        <span className="bullet-icon">💸</span>
                        <div>
                          <strong className="text-violet">Liquidación Directa:</strong> Retiro inmediato de fondos tras cumplir las reglas del Smart Contract.
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="role-card__right">
                    <div className="role-preview">
                      <div className="preview-badge text-violet font-mono">Startup View</div>
                      <div className="preview-screen">
                        <div className="preview-line"><span>Wayki:</span> <span className="mono text-success">Hito 3</span></div>
                        <div className="preview-line"><span>Fondo Escrow:</span> <span className="mono text-cyan">7,500 ARB</span></div>
                        <div className="preview-line"><span>Validación:</span> <span className="mono text-warning">ai_review</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mentor' && (
              <div className="tab-content active">
                <div className="role-card">
                  <div className="role-card__left">
                    <h3 className="role-card__title">Auditoría Guiada & Mentoría Directa</h3>
                    <ul className="role-bullets">
                      <li>
                        <span className="bullet-icon">🔍</span>
                        <div>
                          <strong className="text-success">Auditoría con IA:</strong> Evaluación de código con reportes de riesgo generados automáticamente.
                        </div>
                      </li>
                      <li>
                        <span className="bullet-icon">✍️</span>
                        <div>
                          <strong className="text-success">Firmas Multisig:</strong> Autorización fácil de hitos con transacciones en un solo clic.
                        </div>
                      </li>
                      <li>
                        <span className="bullet-icon">📈</span>
                        <div>
                          <strong className="text-success">Métricas de Tracción:</strong> Acceso transparente y sin fricciones al progreso real de tus startups.
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="role-card__right">
                    <div className="role-preview">
                      <div className="preview-badge text-success font-mono">Mentor View</div>
                      <div className="preview-screen">
                        <div className="preview-line"><span>GitHub commits:</span> <span className="mono text-success">20 / 20</span></div>
                        <div className="preview-line"><span>Test Coverage:</span> <span className="mono text-cyan">94%</span></div>
                        <div className="preview-line"><span>Auditorías:</span> <span className="mono text-violet">4 Pendientes</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== FAQ ACCORDION SECTION ========== */}
      <section className="section faq-section" id="faq">
        <div className="container">
          <div className="reveal visible" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span className="section__label" style={{ display: 'inline-flex', margin: '0 auto var(--space-sm) auto' }}>
              <span className="section__label-dot"></span>
              Preguntas Frecuentes
            </span>
            <h2 className="section__title">Resolvemos tus dudas institucionales</h2>
            <p className="section__subtitle" style={{ margin: '0 auto' }}>
              Transparencia técnica y operativa para incubadoras académicas y startups.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqData.map((item, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div 
                  key={index}
                  className="card"
                  style={{ 
                    background: '#121826', 
                    border: isOpen ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '20px',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <HelpCircle size={18} color={isOpen ? 'var(--accent-cyan)' : 'var(--text-tertiary)'} />
                      {item.question}
                    </span>
                    <ChevronDown 
                      size={18} 
                      style={{ 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.2s ease',
                        color: isOpen ? 'var(--accent-cyan)' : 'var(--text-tertiary)'
                      }} 
                    />
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? '200px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <p style={{ 
                      padding: '0 20px 20px 48px', 
                      color: 'var(--text-secondary)', 
                      fontSize: 'var(--text-sm)',
                      lineHeight: '1.6' 
                    }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer" id="footer" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-base-alt)' }}>
        <div className="container">
          <div className="footer__grid">
            <div>
              <div className="navbar__logo" style={{ marginBottom: 'var(--space-md)' }}>
                <span className="navbar__logo-fallback-icon" style={{ marginRight: '6px' }}>⚖</span>
                <span className="font-display" style={{ fontWeight: 800 }}>Arbitra</span>
              </div>
              <p className="footer__brand-desc" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', maxWidth: '280px' }}>
                Capital programable para incubadoras universitarias. Transparencia, auditoría y evidencia verificable.
              </p>
            </div>

            <div>
              <h4 className="footer__col-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)', fontSize: 'var(--text-sm)' }}>Gobernanza</h4>
              <ul className="footer__links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><a href="#" className="footer__link" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Propuestas Activas</a></li>
                <li><a href="#" className="footer__link" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Historial de Votaciones</a></li>
                <li><a href="#" className="footer__link" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Políticas de Multisig</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer__col-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)', fontSize: 'var(--text-sm)' }}>Desarrolladores</h4>
              <ul className="footer__links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><a href="#" className="footer__link" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Vite + React + TS SDK</a></li>
                <li><a href="#" className="footer__link" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Arbitrum L2 Contracts</a></li>
                <li><a href="#" className="footer__link" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>AI Auditor API</a></li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            © 2026 Arbitra Co. Desarrollado en colaboración con StartUPC. Licencia MIT.
          </div>
        </div>
      </footer>
    </div>
  );
}
