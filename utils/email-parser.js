// Email parsing utilities for account detection
class EmailParser {
  constructor() {
    this.welcomePatterns = [
      /welcome to (.+)/i,
      /thanks for joining (.+)/i,
      /your account has been created/i,
      /account activation/i,
      /verify your email/i,
      /confirm your registration/i
    ];
    
    this.servicePatterns = [
      /welcome to (\w+)/i,
      /thanks for signing up for (\w+)/i,
      /your (\w+) account/i,
      /activate your (\w+) account/i
    ];
  }

  parseEmailSubject(subject) {
    const result = {
      service: null,
      type: 'unknown',
      confidence: 0
    };

    // Check for welcome/activation emails
    for (const pattern of this.welcomePatterns) {
      if (pattern.test(subject)) {
        result.type = 'welcome';
        result.confidence = 0.8;
        break;
      }
    }

    // Extract service name
    for (const pattern of this.servicePatterns) {
      const match = subject.match(pattern);
      if (match) {
        result.service = match[1];
        result.confidence = Math.max(result.confidence, 0.7);
        break;
      }
    }

    return result;
  }

  parseEmailBody(body) {
    const result = {
      service: null,
      type: 'unknown',
      confidence: 0,
      links: []
    };

    // Extract service name from body
    const serviceMatch = body.match(/welcome to ([^<>\n]+)/i);
    if (serviceMatch) {
      result.service = serviceMatch[1].trim();
      result.confidence = 0.6;
    }

    // Look for account-related links
    const linkRegex = /https?:\/\/[^\s<>"]+/g;
    const links = body.match(linkRegex) || [];
    
    result.links = links.filter(link => {
      return link.includes('verify') || 
             link.includes('activate') || 
             link.includes('confirm') ||
             link.includes('account');
    });

    return result;
  }

  extractDomainFromEmail(email) {
    if (!email || !email.includes('@')) return null;
    
    const domain = email.split('@')[1];
    return domain.toLowerCase();
  }

  isAccountEmail(subject, body) {
    const accountKeywords = [
      'welcome', 'verify', 'activate', 'confirm', 'registration',
      'account created', 'sign up', 'join', 'new account'
    ];

    const text = (subject + ' ' + body).toLowerCase();
    return accountKeywords.some(keyword => text.includes(keyword));
  }
}

class EmailAnalyzer {
  constructor() {
    this.parser = new EmailParser();
  }

  analyzeEmails(emails) {
    const results = {
      accountEmails: [],
      services: new Set(),
      domains: new Set(),
      insights: []
    };

    emails.forEach(email => {
      if (this.parser.isAccountEmail(email.subject, email.body)) {
        const parsed = {
          ...email,
          parsed: this.parser.parseEmailSubject(email.subject)
        };
        
        results.accountEmails.push(parsed);
        
        if (parsed.parsed.service) {
          results.services.add(parsed.parsed.service);
        }
        
        const domain = this.parser.extractDomainFromEmail(email.from);
        if (domain) {
          results.domains.add(domain);
        }
      }
    });

    // Generate insights
    results.insights = this.generateEmailInsights(results);

    return results;
  }

  generateEmailInsights(results) {
    const insights = [];
    const accountCount = results.accountEmails.length;
    const serviceCount = results.services.size;

    if (accountCount > 0) {
      insights.push({
        type: 'info',
        message: `Found ${accountCount} account-related emails`,
        action: 'These emails indicate services you may have accounts with'
      });
    }

    if (serviceCount > 10) {
      insights.push({
        type: 'warning',
        message: `You have accounts with ${serviceCount} different services`,
        action: 'Consider reviewing which accounts you still need'
      });
    }

    return insights;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EmailParser, EmailAnalyzer };
}
