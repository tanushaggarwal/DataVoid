// Background script for account detection
class AccountDetector {
  constructor() {
    this.loginPatterns = [
      '/login', '/signin', '/sign-in', '/auth', '/authenticate',
      '/account/login', '/user/login', '/member/login',
      '/dashboard/login', '/admin/login', '/portal/login',
      '/my-account', '/profile', '/dashboard', '/account'
    ];
    this.signupPatterns = [
      '/register', '/signup', '/sign-up', '/join', '/create-account',
      '/account/create', '/user/register', '/member/join',
      '/onboarding', '/getting-started', '/welcome', '/activate'
    ];
    this.accountKeywords = [
      'login', 'signin', 'register', 'signup', 'account', 'profile',
      'dashboard', 'my-account', 'user', 'member', 'activate'
    ];
  }

  async scanBrowserHistory() {
    const results = {
      loginSites: [],
      signupSites: [],
      suspiciousAccounts: []
    };

    try {
      // Get browser history for last 2 years
      const historyItems = await chrome.history.search({
        text: '',
        maxResults: 10000,
        startTime: Date.now() - (365 * 2 * 24 * 60 * 60 * 1000)
      });

      for (const item of historyItems) {
        try {
          const url = item.url.toLowerCase();
          const domain = new URL(item.url).hostname;
          const title = item.title.toLowerCase();

          // Skip certain domains and patterns
          if (this.shouldSkipDomain(domain, url)) continue;

          // Check for login pages
          if (this.isLoginPage(url, title)) {
            results.loginSites.push({
              domain,
              url: item.url,
              title: item.title,
              lastVisit: item.lastVisitTime,
              visitCount: item.visitCount,
              confidence: this.calculateConfidence(url, title, 'login')
            });
          }

          // Check for signup pages
          if (this.isSignupPage(url, title)) {
            results.signupSites.push({
              domain,
              url: item.url,
              title: item.title,
              lastVisit: item.lastVisitTime,
              visitCount: item.visitCount,
              confidence: this.calculateConfidence(url, title, 'signup')
            });
          }
        } catch (error) {
          // Skip invalid URLs
          continue;
        }
      }

      return results;
    } catch (error) {
      // Error handling - return empty results on failure
      return results;
    }
  }

  async scanStoredPasswords() {
    // Note: Chrome doesn't allow direct password access
    // We'll scan for domains with saved data instead
    const sites = [];
    
    try {
      const cookies = await chrome.cookies.getAll({});
      const uniqueDomains = [...new Set(cookies.map(c => c.domain))];
      
      for (const domain of uniqueDomains) {
        if (domain.startsWith('.')) continue; // Skip generic domains
        
        sites.push({
          domain: domain.replace(/^\./, ''),
          hasAuthCookies: cookies.some(c => 
            c.domain === domain && 
            (c.name.includes('auth') || c.name.includes('session') || c.name.includes('token'))
          )
        });
      }
      
      return sites;
    } catch (error) {
      // Error handling - return empty array on failure
      return [];
    }
  }

  shouldSkipDomain(domain, url) {
    const skipDomains = [
      'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
      'linkedin.com', 'reddit.com', 'stackoverflow.com', 'github.com',
      'amazon.com', 'ebay.com', 'wikipedia.org', 'bing.com', 'duckduckgo.com'
    ];
    
    const skipPatterns = [
      'cdn', 'api', 'static', 'assets', 'img', 'js', 'css', 'fonts',
      'analytics', 'tracking', 'ads', 'advertising', 'pixel'
    ];
    
    // Skip major platforms and utility domains
    if (skipDomains.some(skip => domain.includes(skip))) return true;
    
    // Skip CDN and utility subdomains
    if (skipPatterns.some(pattern => domain.includes(pattern))) return true;
    
    // Skip localhost and IP addresses
    if (domain.includes('localhost') || /^\d+\.\d+\.\d+\.\d+/.test(domain)) return true;
    
    return false;
  }

  isLoginPage(url, title) {
    // Check URL patterns
    const urlMatch = this.loginPatterns.some(pattern => url.includes(pattern));
    
    // Check title patterns
    const titleMatch = this.accountKeywords.some(keyword => 
      title.includes(keyword) && (title.includes('login') || title.includes('sign in'))
    );
    
    return urlMatch || titleMatch;
  }

  isSignupPage(url, title) {
    // Check URL patterns
    const urlMatch = this.signupPatterns.some(pattern => url.includes(pattern));
    
    // Check title patterns
    const titleMatch = this.accountKeywords.some(keyword => 
      title.includes(keyword) && (title.includes('register') || title.includes('sign up') || title.includes('join'))
    );
    
    return urlMatch || titleMatch;
  }

  calculateConfidence(url, title, type) {
    let confidence = 0.5; // Base confidence
    
    // URL pattern confidence
    if (type === 'login') {
      if (url.includes('/login') || url.includes('/signin')) confidence += 0.3;
      if (url.includes('/auth') || url.includes('/authenticate')) confidence += 0.2;
    } else if (type === 'signup') {
      if (url.includes('/register') || url.includes('/signup')) confidence += 0.3;
      if (url.includes('/join') || url.includes('/create-account')) confidence += 0.2;
    }
    
    // Title confidence
    if (title.includes('login') || title.includes('sign in')) confidence += 0.2;
    if (title.includes('register') || title.includes('sign up')) confidence += 0.2;
    if (title.includes('account') || title.includes('profile')) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }
}

// Initialize detector
const detector = new AccountDetector();

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanAccounts') {
    (async () => {
      try {
        const historyResults = await detector.scanBrowserHistory();
        const cookieResults = await detector.scanStoredPasswords();
        
        sendResponse({
          success: true,
          data: {
            history: historyResults,
            cookies: cookieResults
          }
        });
      } catch (error) {
        sendResponse({
          success: false,
          error: error.message || 'Scan failed'
        });
      }
    })();
    return true; // Async response
  }
  
  // Handle other actions
  return false;
});
