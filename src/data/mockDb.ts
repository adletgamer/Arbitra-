import type { StartupProject } from '../types';

export const initialStartups: StartupProject[] = [
  {
    id: 'wayki',
    name: 'Wayki',
    category: 'Fintech / Social Wallet',
    description: 'Billetera social que habilita microfinanzas colaborativas y remesas rápidas en comunidades rurales.',
    escrowTotal: 25000,
    escrowReleased: 17500,
    activeMilestoneId: 3,
    walletConnected: true,
    walletAddress: '0x3A1b...F4e2',
    githubRepo: 'https://github.com/startupc/wayki-core',
    figmaUrl: 'https://figma.com/file/wayki-mvp',
    isPaused: false,
    milestones: [
      {
        id: 1,
        title: '#1 — Arquitectura & Smart Contracts',
        amount: 10000,
        status: 'paid_out',
        deadline: '2026-03-10',
        txHash: '0x4f8a...c321',
        evidenceLink: 'https://github.com/startupc/wayki-core/commit/c8f2a1',
        evidenceType: 'commit',
        auditReport: {
          commitsVerified: 15,
          totalCommits: 15,
          testCoverage: 95,
          figmaTokens: true,
          score: 0.98,
          verdict: 'approved',
          notes: 'Arquitectura validada. Los smart contracts compilan con cobertura óptima.'
        }
      },
      {
        id: 2,
        title: '#2 — Integración de Front-End',
        amount: 7500,
        status: 'paid_out',
        deadline: '2026-04-20',
        txHash: '0xd4e5...f4a5',
        evidenceLink: 'https://github.com/startupc/wayki-core/commit/a7b8c9',
        evidenceType: 'commit',
        auditReport: {
          commitsVerified: 18,
          totalCommits: 20,
          testCoverage: 88,
          figmaTokens: true,
          score: 0.89,
          verdict: 'approved',
          notes: 'Conexión a Web3 funcional. Reportes parciales aprobados.'
        }
      },
      {
        id: 3,
        title: '#3 — Prototipo Funcional en Comunidad',
        amount: 7500,
        status: 'ai_review',
        deadline: '2026-05-25',
        evidenceLink: 'https://github.com/startupc/wayki-core/commit/df9a2c',
        evidenceType: 'commit',
        auditReport: {
          commitsVerified: 14,
          totalCommits: 20,
          testCoverage: 38,
          figmaTokens: false,
          score: 0.42,
          verdict: 'pending',
          notes: 'Validación parcial automatizada. La cobertura de tests es baja (38%). Falta firma del mentor.'
        }
      }
    ]
  },
  {
    id: 'modopro',
    name: 'Modo Pro',
    category: 'Edtech / Talento',
    description: 'Plataforma para conectar estudiantes técnicos con proyectos reales corporativos mediante emparejamiento inteligente.',
    escrowTotal: 16000,
    escrowReleased: 8000,
    activeMilestoneId: 2,
    walletConnected: true,
    walletAddress: '0x7e5c...89d1',
    githubRepo: 'https://github.com/startupc/modopro-app',
    figmaUrl: 'https://figma.com/file/modopro-design',
    isPaused: false,
    milestones: [
      {
        id: 1,
        title: '#1 — Backend API & Match Engine',
        amount: 8000,
        status: 'paid_out',
        deadline: '2026-04-05',
        txHash: '0xf1a2...b1c2',
        evidenceLink: 'https://github.com/startupc/modopro-app/commit/b3c4d5',
        evidenceType: 'commit',
        auditReport: {
          commitsVerified: 22,
          totalCommits: 22,
          testCoverage: 91,
          figmaTokens: false,
          score: 0.93,
          verdict: 'approved',
          notes: 'Motor de emparejamiento implementado y validado.'
        }
      },
      {
        id: 2,
        title: '#2 — Portal del Estudiante & Feedback Loop',
        amount: 8000,
        status: 'ai_review',
        deadline: '2026-06-01',
        evidenceLink: 'https://github.com/startupc/modopro-app/commit/ff3d2a',
        evidenceType: 'commit',
        auditReport: {
          commitsVerified: 19,
          totalCommits: 20,
          testCoverage: 82,
          figmaTokens: true,
          score: 0.84,
          verdict: 'pending',
          notes: 'Evidencia técnica cargada. El score de la IA es favorable (82%). Esperando revisión multisig de firmas.'
        }
      }
    ]
  },
  {
    id: 'sabioia',
    name: 'SABIO-IA Tributario',
    category: 'Fintech / Legaltech',
    description: 'Asistente tributario con inteligencia artificial que automatiza declaraciones fiscales para pequeños contribuyentes.',
    escrowTotal: 30000,
    escrowReleased: 0,
    activeMilestoneId: 1,
    walletConnected: true,
    walletAddress: '0x9d9a...2b3c',
    githubRepo: 'https://github.com/startupc/sabio-tributario',
    figmaUrl: 'https://figma.com/file/sabio-ia',
    isPaused: false,
    milestones: [
      {
        id: 1,
        title: '#1 — MVP de Clasificación Fiscal',
        amount: 15000,
        status: 'ai_review',
        deadline: '2026-05-30',
        evidenceLink: 'https://github.com/startupc/sabio-tributario/commit/a1b2c3',
        evidenceType: 'commit',
        auditReport: {
          commitsVerified: 10,
          totalCommits: 25,
          testCoverage: 32,
          figmaTokens: false,
          score: 0.35,
          verdict: 'pending',
          notes: 'Alerta crítica de la IA: Se detectó alta similitud de código (34%) con plantillas públicas de repositorios públicos.'
        }
      },
      {
        id: 2,
        title: '#2 — Automatización de Formularios Sunat',
        amount: 15000,
        status: 'funded',
        deadline: '2026-07-15',
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
  },
  {
    id: 'nootas',
    name: 'Nootas',
    category: 'Edtech / Social',
    description: 'Red social para compartir apuntes y resúmenes validados entre alumnos de diferentes campus de la UPC.',
    escrowTotal: 10000,
    escrowReleased: 5000,
    activeMilestoneId: 2,
    walletConnected: true,
    walletAddress: '0x5c4a...7e2d',
    githubRepo: 'https://github.com/startupc/nootas-web',
    isPaused: false,
    milestones: [
      {
        id: 1,
        title: '#1 — Plataforma Web de Intercambio',
        amount: 5000,
        status: 'paid_out',
        deadline: '2026-04-12',
        txHash: '0x8b9c...d4e5',
        evidenceLink: 'https://github.com/startupc/nootas-web/commit/e3f4a5',
        evidenceType: 'commit',
        auditReport: {
          commitsVerified: 16,
          totalCommits: 16,
          testCoverage: 76,
          figmaTokens: false,
          score: 0.79,
          verdict: 'approved',
          notes: 'MVP desplegado y testeado en el campus Monterrico.'
        }
      },
      {
        id: 2,
        title: '#2 — Motor de Recompensas & Gamificación',
        amount: 5000,
        status: 'funded',
        deadline: '2026-06-30',
        auditReport: {
          commitsVerified: 0,
          totalCommits: 0,
          testCoverage: 0,
          figmaTokens: false,
          score: 0.0,
          verdict: 'pending',
          notes: 'Escrow bloqueado en Smart Contract.'
        }
      }
    ]
  }
];

const LOCAL_STORAGE_KEY = 'arbitra_startups_db';

export function getStoredStartups(): StartupProject[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialStartups));
    return initialStartups;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return initialStartups;
  }
}

export function saveStoredStartups(startups: StartupProject[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(startups));
}

export function resetStoredStartups(): StartupProject[] {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialStartups));
  return initialStartups;
}
