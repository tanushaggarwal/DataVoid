// Account detection utilities
class AccountPatterns {
  static getLoginPatterns() {
    return [
      '/login', '/signin', '/sign-in', '/auth', '/authenticate',
      '/account/login', '/user/login', '/member/login',
      '/dashboard/login', '/admin/login', '/portal/login'
    ];
  }
  
  static getSignupPatterns() {
    return [
      '/register', '/signup', '/sign-up', '/join', '/create-account',
      '/account/create', '/user/register', '/member/join',
      '/onboarding', '/getting-started'
    ];
  }
  
  static getEmailPatterns() {
    return [
      'welcome', 'verify your email', 'confirm your account',
      'account created', 'registration successful', 'activate your account',
      'complete your registration', 'verify your identity'
    ];
  }
  
  static isLikelyAccountSite(domain) {
    const genericDomains = [
      'google.com', 'facebook.com', 'twitter.com', 'linkedin.com',
      'github.com', 'stackoverflow.com', 'reddit.com', 'youtube.com'
    ];
    
    const excludePatterns = [
      'cdn', 'api', 'static', 'assets', 'img', 'js', 'css'
    ];
    
    return !genericDomains.includes(domain) && 
           !excludePatterns.some(pattern => domain.includes(pattern));
  }
}

class AccountAnalyzer {
  constructor() {
    this.patterns = AccountPatterns;
  }

  analyzeHistoryItem(item) {
    const url = item.url.toLowerCase();
    const domain = new URL(item.url).hostname;
    const pathname = new URL(item.url).pathname.toLowerCase();
    
    const analysis = {
      domain,
      url: item.url,
      title: item.title,
      lastVisit: item.lastVisitTime,
      visitCount: item.visitCount,
      type: 'unknown',
      confidence: 0,
      isOld: false,
      daysSinceLastVisit: 0
    };

    // Calculate days since last visit
    analysis.daysSinceLastVisit = Math.floor((Date.now() - item.lastVisitTime) / (1000 * 60 * 60 * 24));
    analysis.isOld = analysis.daysSinceLastVisit > 90;

    // Check for login patterns
    if (this.patterns.getLoginPatterns().some(pattern => pathname.includes(pattern))) {
      analysis.type = 'login';
      analysis.confidence = 0.8;
    }
    
    // Check for signup patterns
    if (this.patterns.getSignupPatterns().some(pattern => pathname.includes(pattern))) {
      analysis.type = 'signup';
      analysis.confidence = 0.9;
    }

    // Check title for account-related keywords
    const title = item.title.toLowerCase();
    if (this.patterns.getEmailPatterns().some(pattern => title.includes(pattern))) {
      analysis.type = 'account_creation';
      analysis.confidence = Math.max(analysis.confidence, 0.7);
    }

    // Boost confidence for sites with multiple visits
    if (item.visitCount > 5) {
      analysis.confidence += 0.1;
    }

    return analysis;
  }

  categorizeAccounts(accounts) {
    const categories = {
      active: [],
      inactive: [],
      suspicious: [],
      old: []
    };

    accounts.forEach(account => {
      if (account.daysSinceLastVisit < 30) {
        categories.active.push(account);
      } else if (account.daysSinceLastVisit < 90) {
        categories.inactive.push(account);
      } else if (account.daysSinceLastVisit < 365) {
        categories.suspicious.push(account);
      } else {
        categories.old.push(account);
      }
    });

    return categories;
  }

  generateInsights(accounts) {
    const insights = [];
    const totalAccounts = accounts.length;
    const oldAccounts = accounts.filter(a => a.isOld).length;
    const highConfidence = accounts.filter(a => a.confidence > 0.7).length;

    if (oldAccounts > 0) {
      insights.push({
        type: 'warning',
        message: `Found ${oldAccounts} accounts that haven't been visited in over 90 days`,
        action: 'Consider deleting these old accounts'
      });
    }

    if (highConfidence < totalAccounts * 0.5) {
      insights.push({
        type: 'info',
        message: 'Some detected accounts have low confidence scores',
        action: 'Review the results carefully before taking action'
      });
    }

    if (totalAccounts > 50) {
      insights.push({
        type: 'success',
        message: `Found ${totalAccounts} potential accounts across the web`,
        action: 'You have a significant digital footprint to manage'
      });
    }

    return insights;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AccountPatterns, AccountAnalyzer };
}
