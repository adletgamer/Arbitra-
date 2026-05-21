/* ============================================
   ARBITRA — Interactivity & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initCountUp();
  initProgressBars();
  initTimelineProgress();
  initWalletModal();
  initHashCopy();
  initAdminButtons();
  initMilestoneSimulator();
});

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ============================================
   ANIMATED NUMBER COUNTER
   ============================================ */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-count').replace(/,/g, ''));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0');
          const duration = 1800;
          const startTime = performance.now();

          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            el.textContent = prefix + formatNumber(current, decimals) + suffix;

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = prefix + formatNumber(target, decimals) + suffix;
            }
          }

          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

function formatNumber(num, decimals = 0) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ============================================
   PROGRESS BAR ANIMATION
   ============================================ */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress__fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = width;
          }, 300);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

/* ============================================
   MILESTONE TIMELINE PROGRESS
   ============================================ */
function initTimelineProgress() {
  const progress = document.querySelector('.milestone-timeline__progress');
  if (!progress) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = progress.getAttribute('data-width');
          setTimeout(() => {
            progress.style.width = width;
          }, 500);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  progress.style.width = '0%';
  observer.observe(progress.parentElement);
}

/* ============================================
   WALLET CONNECTION MODAL — FULL FLOW
   ============================================ */
function initWalletModal() {
  // DOM references
  const modalOverlay = document.getElementById('wallet-modal');
  const modalClose = document.getElementById('modal-close');
  const walletList = document.getElementById('wallet-list');
  const modalConnecting = document.getElementById('modal-connecting');
  const modalSuccess = document.getElementById('modal-success');
  const modalNetwork = document.getElementById('modal-network');
  const modalDisclaimer = document.getElementById('modal-disclaimer');
  const connectingWalletName = document.getElementById('connecting-wallet-name');

  // Trigger buttons — both hero CTA and navbar button open the modal
  const btnHero = document.getElementById('btn-connect-wallet');
  const btnNav = document.getElementById('nav-connect-btn');

  // Navbar profile elements
  const navProfile = document.getElementById('nav-profile');

  // Track connection state
  let isConnected = false;

  // --- Open Modal ---
  function openModal() {
    if (isConnected) return; // Already connected, do nothing
    resetModalState();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --- Close Modal ---
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- Reset Modal to Initial State ---
  function resetModalState() {
    walletList.classList.remove('hidden');
    modalConnecting.classList.remove('active');
    modalSuccess.classList.remove('active');
    modalNetwork.classList.remove('hidden');
    modalDisclaimer.classList.remove('hidden');
  }

  // --- Transition to Connected State ---
  function setConnectedState() {
    isConnected = true;

    // Transform navbar: hide CTA, show profile
    btnNav.classList.add('hidden');
    navProfile.classList.remove('hidden');

    // Transform hero button
    btnHero.innerHTML = `
      <span class="btn__icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      Wallet Conectada
    `;
    btnHero.style.opacity = '0.8';
    btnHero.style.pointerEvents = 'none';
  }

  // --- Handle Wallet Selection ---
  function handleWalletClick(e) {
    const option = e.target.closest('.wallet-option');
    if (!option) return;

    const walletName = option.getAttribute('data-wallet');

    // Step 1: Show connecting state
    walletList.classList.add('hidden');
    modalNetwork.classList.add('hidden');
    modalDisclaimer.classList.add('hidden');
    modalConnecting.classList.add('active');
    connectingWalletName.textContent = `Conectando con ${walletName}...`;

    // Step 2: After 1.5s → show success
    setTimeout(() => {
      modalConnecting.classList.remove('active');
      modalSuccess.classList.add('active');

      // Step 3: After 0.8s → close modal & update UI
      setTimeout(() => {
        closeModal();
        setConnectedState();
      }, 800);
    }, 1500);
  }

  // --- Event Listeners ---
  if (btnHero) btnHero.addEventListener('click', openModal);
  if (btnNav) btnNav.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  // Close on overlay click (but not modal body)
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Wallet option clicks
  if (walletList) {
    walletList.addEventListener('click', handleWalletClick);
  }
}

/* ============================================
   HASH COPY TO CLIPBOARD
   ============================================ */
function initHashCopy() {
  const hashes = document.querySelectorAll('.tx-hash');

  hashes.forEach((hash) => {
    hash.addEventListener('click', () => {
      const fullHash = hash.getAttribute('data-full-hash') || hash.textContent.trim();
      navigator.clipboard.writeText(fullHash).then(() => {
        const linkEl = hash.querySelector('.tx-hash__link');
        if (linkEl) {
          linkEl.textContent = '✓';
          setTimeout(() => {
            linkEl.textContent = '↗';
          }, 1200);
        }
      });
    });
  });
}

/* ============================================
   ADMIN DASHBOARD BUTTONS
   ============================================ */
function initAdminButtons() {
  // Approve Payment simulation
  const btnApproveMango = document.getElementById('btn-approve-mango');
  if (btnApproveMango) {
    btnApproveMango.addEventListener('click', () => {
      const original = btnApproveMango.innerHTML;
      btnApproveMango.innerHTML = 'Firmando...';
      btnApproveMango.style.pointerEvents = 'none';

      setTimeout(() => {
        btnApproveMango.innerHTML = '✓ Firma 1/3 Enviada';
        btnApproveMango.classList.remove('btn--table-primary');
        btnApproveMango.classList.add('btn--table-warning');

        setTimeout(() => {
          btnApproveMango.innerHTML = '✓ Aprobado — Tx Enviada';
          btnApproveMango.classList.remove('btn--table-warning');
          btnApproveMango.style.background = 'var(--state-success-dim)';
          btnApproveMango.style.color = 'var(--state-success)';
          btnApproveMango.style.borderColor = 'rgba(57, 217, 138, 0.15)';
        }, 1200);
      }, 1500);
    });
  }

  // Mandatory Review simulation
  const btnReviewUrban = document.getElementById('btn-review-urban');
  if (btnReviewUrban) {
    btnReviewUrban.addEventListener('click', () => {
      btnReviewUrban.innerHTML = 'Revisión iniciada...';
      btnReviewUrban.style.pointerEvents = 'none';

      setTimeout(() => {
        btnReviewUrban.innerHTML = '◉ En revisión por comité';
        btnReviewUrban.style.background = 'var(--accent-violet-dim)';
        btnReviewUrban.style.color = 'var(--accent-violet)';
        btnReviewUrban.style.borderColor = 'rgba(124, 92, 255, 0.15)';
      }, 1000);
    });
  }

  // Create New Grant button
  const btnNewGrant = document.getElementById('btn-new-grant');
  if (btnNewGrant) {
    btnNewGrant.addEventListener('click', () => {
      const original = btnNewGrant.innerHTML;
      btnNewGrant.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Grant creado exitosamente
      `;
      btnNewGrant.style.borderColor = 'rgba(57, 217, 138, 0.3)';
      btnNewGrant.style.color = 'var(--state-success)';

      setTimeout(() => {
        btnNewGrant.innerHTML = original;
        btnNewGrant.style.borderColor = '';
        btnNewGrant.style.color = '';
      }, 2500);
    });
  }
}

/* ============================================
   L2 MILESTONE TRANSITION SIMULATOR
   ============================================ */
function initMilestoneSimulator() {
  const btnSimulate = document.getElementById('btn-simulate-milestone');
  if (!btnSimulate) return;

  const card1 = document.getElementById('milestone-card-1');
  const card2 = document.getElementById('milestone-card-2');

  // Text fields to update
  const mc1HitoVal = document.getElementById('mc1-hito-val');
  const mc1StatusBadge = document.getElementById('mc1-status-badge');
  const mc2ScoreVal = document.getElementById('mc2-score-val');
  const mc2CommitsVal = document.getElementById('mc2-commits-val');
  const mc2CoverageVal = document.getElementById('mc2-coverage-val');
  const mc2MentorBadge = document.getElementById('mc2-mentor-badge');
  const mc2VerdictBadge = document.getElementById('mc2-verdict-badge');

  // Timeline node elements to animate
  const steps = document.querySelectorAll('.milestone-step');
  const timelineProgress = document.querySelector('.milestone-timeline__progress');

  let transitionCompleted = false;

  btnSimulate.addEventListener('click', () => {
    if (transitionCompleted) {
      // Revert simulation to default
      revertSimulation();
      return;
    }

    // 1. Show connecting on button
    btnSimulate.innerHTML = `
      <span class="btn__icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin" style="display: inline-block;">
          <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="6.34" y1="17.66" x2="8.46" y2="15.54"/><line x1="15.54" y1="8.46" x2="17.66" y2="6.34"/>
        </svg>
      </span>
      Confirmando en Arbitrum L2...
    `;
    btnSimulate.style.pointerEvents = 'none';

    // 2. Add skeleton-active state to detail cards
    if (card1) card1.classList.add('skeleton-active');
    if (card2) card2.classList.add('skeleton-active');

    // 3. Simulate L2 Soft Finality (1.5 seconds)
    setTimeout(() => {
      // 4. Update timeline visuals
      // Step 3 (AI Review) becomes complete
      if (steps[2]) {
        steps[2].classList.remove('milestone-step--active');
        steps[2].classList.add('milestone-step--complete');
        // Update SVG inside Node to checkmark
        const stepNode3 = steps[2].querySelector('.milestone-step__node');
        if (stepNode3) {
          stepNode3.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          `;
        }
      }

      // Step 4 (Human Review) becomes active
      if (steps[3]) {
        steps[3].classList.remove('milestone-step--pending');
        steps[3].classList.add('milestone-step--active');
        const stepNode4 = steps[3].querySelector('.milestone-step__node');
        if (stepNode4) {
          stepNode4.style.borderColor = 'var(--accent-violet)';
          stepNode4.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          `;
        }
      }

      // Advance timeline progress line to 78% (next milestone node)
      if (timelineProgress) {
        timelineProgress.style.width = '78%';
      }

      // 5. Update data fields to new verified state
      if (mc1HitoVal) mc1HitoVal.textContent = '#3 — Completado (En Comité)';
      if (mc1StatusBadge) {
        mc1StatusBadge.textContent = 'human_review';
        mc1StatusBadge.className = 'badge badge--violet';
      }

      if (mc2ScoreVal) {
        mc2ScoreVal.textContent = '0.94 / 1.00';
        mc2ScoreVal.className = 'milestone-detail-card__val text-success mono';
      }
      if (mc2CommitsVal) mc2CommitsVal.textContent = '20 / 20';
      if (mc2CoverageVal) mc2CoverageVal.textContent = '94%';
      if (mc2MentorBadge) {
        mc2MentorBadge.textContent = 'Aprobado';
        mc2MentorBadge.className = 'badge badge--success';
      }
      if (mc2VerdictBadge) {
        mc2VerdictBadge.textContent = 'Validación Exitosa';
        mc2VerdictBadge.className = 'badge badge--success';
      }

      // 6. Reveal updated card content (remove skeleton-active)
      if (card1) card1.classList.remove('skeleton-active');
      if (card2) card2.classList.remove('skeleton-active');

      // 7. Update button success state
      btnSimulate.style.pointerEvents = 'auto';
      btnSimulate.innerHTML = `
        <span class="btn__icon">✓</span>
        Transición Exitosa (Restablecer Demo)
      `;
      btnSimulate.style.borderColor = 'rgba(57, 217, 138, 0.3)';
      btnSimulate.style.color = 'var(--state-success)';
      transitionCompleted = true;

    }, 1500);
  });

  function revertSimulation() {
    // Show connecting on button
    btnSimulate.innerHTML = 'Restableciendo...';
    btnSimulate.style.pointerEvents = 'none';

    if (card1) card1.classList.add('skeleton-active');
    if (card2) card2.classList.add('skeleton-active');

    setTimeout(() => {
      // Revert nodes
      if (steps[2]) {
        steps[2].classList.add('milestone-step--active');
        steps[2].classList.remove('milestone-step--complete');
        const stepNode3 = steps[2].querySelector('.milestone-step__node');
        if (stepNode3) {
          stepNode3.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          `;
        }
      }

      if (steps[3]) {
        steps[3].classList.add('milestone-step--pending');
        steps[3].classList.remove('milestone-step--active');
        const stepNode4 = steps[3].querySelector('.milestone-step__node');
        if (stepNode4) {
          stepNode4.style.borderColor = 'var(--text-tertiary)';
          stepNode4.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          `;
        }
      }

      if (timelineProgress) {
        timelineProgress.style.width = '58%';
      }

      // Revert texts
      if (mc1HitoVal) mc1HitoVal.textContent = '#3 — Prototipo Funcional';
      if (mc1StatusBadge) {
        mc1StatusBadge.textContent = 'ai_review';
        mc1StatusBadge.className = 'badge badge--violet';
      }

      if (mc2ScoreVal) {
        mc2ScoreVal.textContent = '0.42 / 1.00';
        mc2ScoreVal.className = 'milestone-detail-card__val text-warning mono';
      }
      if (mc2CommitsVal) mc2CommitsVal.textContent = '14 / 20';
      if (mc2CoverageVal) mc2CoverageVal.textContent = '38%';
      if (mc2MentorBadge) {
        mc2MentorBadge.textContent = 'Pendiente';
        mc2MentorBadge.className = 'badge badge--warning';
      }
      if (mc2VerdictBadge) {
        mc2VerdictBadge.textContent = 'Requiere revisión';
        mc2VerdictBadge.className = 'badge badge--error';
      }

      if (card1) card1.classList.remove('skeleton-active');
      if (card2) card2.classList.remove('skeleton-active');

      btnSimulate.style.pointerEvents = 'auto';
      btnSimulate.innerHTML = `
        <span class="btn__icon">⚡</span>
        Simular Transición de Hito (Arbitrum L2)
      `;
      btnSimulate.style.borderColor = '';
      btnSimulate.style.color = '';
      transitionCompleted = false;
    }, 1000);
  }
}

/* ============================================
   INJECTED GLOBAL STYLES
   ============================================ */
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);
