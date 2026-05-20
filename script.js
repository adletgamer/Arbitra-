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
