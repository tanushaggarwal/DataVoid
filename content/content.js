// Content script for page interaction
class PrivacyBlitzContent {
  constructor() {
    this.init();
  }

  init() {
    this.detectAccountPages();
    this.addAccountIndicators();
  }

  detectAccountPages() {
    const url = window.location.href.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    
    // Check if current page is a login/signup page
    const loginPatterns = [
      '/login', '/signin', '/sign-in', '/auth', '/authenticate',
      '/account/login', '/user/login', '/member/login'
    ];
    
    const signupPatterns = [
      '/register', '/signup', '/sign-up', '/join', '/create-account',
      '/account/create', '/user/register', '/member/join'
    ];

    const isLoginPage = loginPatterns.some(pattern => pathname.includes(pattern));
    const isSignupPage = signupPatterns.some(pattern => pathname.includes(pattern));

    if (isLoginPage || isSignupPage) {
      this.notifyBackground({
        type: 'accountPageDetected',
        domain: window.location.hostname,
        pageType: isLoginPage ? 'login' : 'signup',
        url: window.location.href,
        title: document.title
      });
    }
  }

  addAccountIndicators() {
    // Add visual indicators for account-related elements
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input[type="email"], input[type="password"], input[name*="email"], input[name*="password"]');
      
      if (inputs.length >= 2) {
        // This looks like a login/signup form
        this.addPrivacyBlitzIndicator(form);
      }
    });
  }

  addPrivacyBlitzIndicator(element) {
    const indicator = document.createElement('div');
    indicator.className = 'privacyblitz-indicator';
    indicator.innerHTML = '⚡ PrivacyBlitz detected account page';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(102, 126, 234, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 10000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    indicator.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        action: 'openPopup'
      });
    });

    indicator.addEventListener('mouseenter', () => {
      indicator.style.background = 'rgba(118, 75, 162, 0.9)';
      indicator.style.transform = 'scale(1.05)';
    });

    indicator.addEventListener('mouseleave', () => {
      indicator.style.background = 'rgba(102, 126, 234, 0.9)';
      indicator.style.transform = 'scale(1)';
    });

    document.body.appendChild(indicator);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateX(100px)';
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
          }
        }, 300);
      }
    }, 5000);
  }

  notifyBackground(data) {
    chrome.runtime.sendMessage({
      action: 'pageDetected',
      data: data
    });
  }
}

// Initialize content script
new PrivacyBlitzContent();
