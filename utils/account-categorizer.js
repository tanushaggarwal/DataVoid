// Account categorization utilities
class AccountCategorizer {
  constructor() {
    this.categories = {
      social: {
        name: 'Social Media',
        icon: '👥',
        domains: [
          'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com',
          'reddit.com', 'pinterest.com', 'tumblr.com', 'snapchat.com',
          'tiktok.com', 'discord.com', 'telegram.org', 'whatsapp.com'
        ],
        patterns: ['social', 'connect', 'share', 'follow', 'friend']
      },
      shopping: {
        name: 'Shopping',
        icon: '🛒',
        domains: [
          'amazon.com', 'ebay.com', 'etsy.com', 'shopify.com',
          'walmart.com', 'target.com', 'bestbuy.com', 'aliexpress.com',
          'wish.com', 'zappos.com', 'overstock.com'
        ],
        patterns: ['shop', 'store', 'cart', 'buy', 'purchase', 'checkout']
      },
      finance: {
        name: 'Finance',
        icon: '💰',
        domains: [
          'paypal.com', 'venmo.com', 'chase.com', 'bankofamerica.com',
          'wellsfargo.com', 'citi.com', 'capitalone.com', 'mint.com',
          'creditkarma.com', 'robinhood.com', 'coinbase.com'
        ],
        patterns: ['bank', 'pay', 'money', 'finance', 'credit', 'debit', 'accounting']
      },
      email: {
        name: 'Email',
        icon: '📧',
        domains: [
          'gmail.com', 'outlook.com', 'yahoo.com', 'protonmail.com',
          'icloud.com', 'mail.com', 'aol.com', 'zoho.com'
        ],
        patterns: ['mail', 'email', 'inbox', 'message']
      },
      work: {
        name: 'Work',
        icon: '💼',
        domains: [
          'slack.com', 'microsoft.com', 'google.com', 'zoom.us',
          'teams.microsoft.com', 'asana.com', 'trello.com', 'notion.so',
          'jira.com', 'confluence.com', 'github.com'
        ],
        patterns: ['work', 'office', 'business', 'corporate', 'enterprise']
      },
      education: {
        name: 'Education',
        icon: '🎓',
        domains: [
          'canvas.net', 'blackboard.com', 'moodle.org', 'coursera.org',
          'edx.org', 'udemy.com', 'khanacademy.org', 'duolingo.com'
        ],
        patterns: ['edu', 'school', 'university', 'college', 'course', 'learn', 'student']
      },
      entertainment: {
        name: 'Entertainment',
        icon: '🎬',
        domains: [
          'netflix.com', 'spotify.com', 'youtube.com', 'twitch.tv',
          'hulu.com', 'disney.com', 'hbo.com', 'paramount.com'
        ],
        patterns: ['watch', 'stream', 'video', 'music', 'movie', 'tv', 'show']
      },
      cloud: {
        name: 'Cloud Storage',
        icon: '☁️',
        domains: [
          'dropbox.com', 'onedrive.com', 'icloud.com', 'google.com',
          'box.com', 'mega.nz', 'pcloud.com', 'sync.com'
        ],
        patterns: ['cloud', 'storage', 'drive', 'backup', 'sync']
      },
      dating: {
        name: 'Dating',
        icon: '💕',
        domains: [
          'tinder.com', 'bumble.com', 'okcupid.com', 'match.com',
          'hinge.com', 'coffeeandbagels.com', 'plentyoffish.com'
        ],
        patterns: ['dating', 'match', 'date', 'romance']
      },
      food: {
        name: 'Food & Delivery',
        icon: '🍔',
        domains: [
          'uber.com', 'doordash.com', 'grubhub.com', 'postmates.com',
          'ubereats.com', 'seamless.com', 'opentable.com'
        ],
        patterns: ['food', 'restaurant', 'delivery', 'order', 'eat', 'dining']
      },
      travel: {
        name: 'Travel',
        icon: '✈️',
        domains: [
          'booking.com', 'expedia.com', 'airbnb.com', 'kayak.com',
          'priceline.com', 'hotels.com', 'tripadvisor.com'
        ],
        patterns: ['travel', 'hotel', 'flight', 'trip', 'vacation', 'booking']
      },
      health: {
        name: 'Health & Fitness',
        icon: '🏃',
        domains: [
          'myfitnesspal.com', 'strava.com', 'fitbit.com', 'garmin.com',
          'peloton.com', 'nike.com', 'adidas.com'
        ],
        patterns: ['fitness', 'health', 'workout', 'exercise', 'gym', 'run']
      },
      news: {
        name: 'News & Media',
        icon: '📰',
        domains: [
          'nytimes.com', 'washingtonpost.com', 'bbc.com', 'cnn.com',
          'theguardian.com', 'reuters.com', 'bloomberg.com'
        ],
        patterns: ['news', 'media', 'article', 'press', 'journal']
      },
      other: {
        name: 'Other',
        icon: '🌐',
        domains: [],
        patterns: []
      }
    };
  }

  categorizeAccount(domain, url = '', title = '') {
    const lowerDomain = domain.toLowerCase();
    const lowerUrl = url.toLowerCase();
    const lowerTitle = title.toLowerCase();
    const combined = `${lowerDomain} ${lowerUrl} ${lowerTitle}`;

    // Check exact domain matches first
    for (const [categoryKey, category] of Object.entries(this.categories)) {
      if (categoryKey === 'other') continue;
      
      if (category.domains.some(catDomain => lowerDomain.includes(catDomain))) {
        return {
          key: categoryKey,
          name: category.name,
          icon: category.icon
        };
      }
    }

    // Check pattern matches
    for (const [categoryKey, category] of Object.entries(this.categories)) {
      if (categoryKey === 'other') continue;
      
      if (category.patterns.some(pattern => combined.includes(pattern))) {
        return {
          key: categoryKey,
          name: category.name,
          icon: category.icon
        };
      }
    }

    // Special cases
    if (lowerDomain.includes('admission') || lowerDomain.includes('edu') || lowerDomain.includes('university')) {
      return {
        key: 'education',
        name: 'Education',
        icon: '🎓'
      };
    }

    if (lowerDomain.includes('bank') || lowerDomain.includes('financial') || lowerDomain.includes('credit')) {
      return {
        key: 'finance',
        name: 'Finance',
        icon: '💰'
      };
    }

    // Default to other
    return {
      key: 'other',
      name: 'Other',
      icon: '🌐'
    };
  }

  getAllCategories() {
    return Object.entries(this.categories).map(([key, category]) => ({
      key,
      name: category.name,
      icon: category.icon
    }));
  }

  getCategoryIcon(categoryKey) {
    return this.categories[categoryKey]?.icon || '🌐';
  }

  getCategoryName(categoryKey) {
    return this.categories[categoryKey]?.name || 'Other';
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccountCategorizer;
}

// Make available globally for popup.html script tag
if (typeof window !== 'undefined') {
  window.AccountCategorizer = AccountCategorizer;
}

