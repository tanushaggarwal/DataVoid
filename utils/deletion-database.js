// Account deletion database with direct links and difficulty ratings
class DeletionDatabase {
  constructor() {
    this.database = {
      // Social Media
      'facebook.com': {
        url: 'https://www.facebook.com/help/delete_account',
        difficulty: 'hard',
        time: '30 days',
        notes: 'Account is deactivated for 30 days before permanent deletion'
      },
      'twitter.com': {
        url: 'https://help.twitter.com/en/managing-your-account/how-to-deactivate-twitter-account',
        difficulty: 'medium',
        time: '30 days',
        notes: 'Account deactivated for 30 days before deletion'
      },
      'instagram.com': {
        url: 'https://help.instagram.com/370452623149242',
        difficulty: 'medium',
        time: '30 days',
        notes: 'Account deactivated for 30 days before deletion'
      },
      'linkedin.com': {
        url: 'https://www.linkedin.com/help/linkedin/answer/a1339363',
        difficulty: 'medium',
        time: 'Immediate',
        notes: 'Account can be deleted immediately'
      },
      'reddit.com': {
        url: 'https://www.reddit.com/prefs/delete',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Account deletion is straightforward'
      },
      'pinterest.com': {
        url: 'https://help.pinterest.com/en/article/close-account',
        difficulty: 'easy',
        time: '14 days',
        notes: 'Account deactivated for 14 days'
      },
      'tumblr.com': {
        url: 'https://www.tumblr.com/settings/account',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Delete from account settings'
      },
      'snapchat.com': {
        url: 'https://support.snapchat.com/a/delete-my-account',
        difficulty: 'medium',
        time: '30 days',
        notes: 'Account deactivated for 30 days'
      },
      'tiktok.com': {
        url: 'https://www.tiktok.com/setting/privacy/account',
        difficulty: 'medium',
        time: '30 days',
        notes: 'Account deactivated for 30 days'
      },
      
      // Email Services
      'gmail.com': {
        url: 'https://myaccount.google.com/deleteaccount',
        difficulty: 'hard',
        time: 'Varies',
        notes: 'Requires Google account deletion - affects all Google services'
      },
      'outlook.com': {
        url: 'https://account.microsoft.com/account',
        difficulty: 'medium',
        time: '60 days',
        notes: 'Account closed for 60 days before deletion'
      },
      'yahoo.com': {
        url: 'https://login.yahoo.com/account/challenge/delete-account',
        difficulty: 'medium',
        time: '90 days',
        notes: 'Account closed for 90 days before deletion'
      },
      'protonmail.com': {
        url: 'https://proton.me/support/delete-account',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Delete from account settings'
      },
      
      // Shopping
      'amazon.com': {
        url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=GLSBYB9VYQME8X8W',
        difficulty: 'hard',
        time: 'Varies',
        notes: 'Contact customer service to close account'
      },
      'ebay.com': {
        url: 'https://www.ebay.com/help/account/account-closing-request?id=4201',
        difficulty: 'medium',
        time: '30 days',
        notes: 'Account closed for 30 days before deletion'
      },
      'etsy.com': {
        url: 'https://help.etsy.com/hc/en-us/articles/115014667628',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Delete from account settings'
      },
      'shopify.com': {
        url: 'https://help.shopify.com/en/manual/your-account/account-settings',
        difficulty: 'medium',
        time: 'Varies',
        notes: 'Close store from admin panel'
      },
      
      // Cloud Storage
      'dropbox.com': {
        url: 'https://www.dropbox.com/account/delete',
        difficulty: 'easy',
        time: '30 days',
        notes: 'Account deleted after 30 days'
      },
      'onedrive.com': {
        url: 'https://account.microsoft.com/services',
        difficulty: 'medium',
        time: '60 days',
        notes: 'Part of Microsoft account deletion'
      },
      'icloud.com': {
        url: 'https://support.apple.com/en-us/HT208850',
        difficulty: 'hard',
        time: 'Varies',
        notes: 'Requires Apple ID deletion'
      },
      'google.com': {
        url: 'https://myaccount.google.com/deleteaccount',
        difficulty: 'hard',
        time: 'Varies',
        notes: 'Deletes entire Google account'
      },
      
      // Streaming
      'netflix.com': {
        url: 'https://help.netflix.com/en/node/407',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Cancel subscription and delete account'
      },
      'spotify.com': {
        url: 'https://support.spotify.com/us/article/close-account/',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Delete from account settings'
      },
      'youtube.com': {
        url: 'https://support.google.com/youtube/answer/55759',
        difficulty: 'hard',
        time: 'Varies',
        notes: 'Part of Google account deletion'
      },
      'twitch.tv': {
        url: 'https://help.twitch.tv/s/article/closing-twitch-account',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Delete from account settings'
      },
      
      // Productivity
      'slack.com': {
        url: 'https://slack.com/help/articles/212185767-Delete-your-Slack-workspace',
        difficulty: 'medium',
        time: 'Varies',
        notes: 'Workspace deletion process'
      },
      'trello.com': {
        url: 'https://help.trello.com/article/717-deleting-your-trello-account',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Delete from account settings'
      },
      'asana.com': {
        url: 'https://asana.com/guide/help/accounts/deactivate',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Deactivate from account settings'
      },
      'notion.so': {
        url: 'https://www.notion.so/help/delete-your-account',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Delete from account settings'
      },
      
      // Development
      'github.com': {
        url: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/deleting-your-github-account',
        difficulty: 'medium',
        time: '90 days',
        notes: 'Account deleted after 90 days'
      },
      'stackoverflow.com': {
        url: 'https://stackoverflow.com/help/deleting-account',
        difficulty: 'hard',
        time: 'Varies',
        notes: 'Contact support to delete account'
      },
      'gitlab.com': {
        url: 'https://docs.gitlab.com/ee/user/profile/account/delete_account.html',
        difficulty: 'easy',
        time: '7 days',
        notes: 'Account deleted after 7 days'
      },
      
      // Finance
      'paypal.com': {
        url: 'https://www.paypal.com/us/smarthelp/article/how-do-i-close-my-paypal-account-faq690',
        difficulty: 'hard',
        time: 'Varies',
        notes: 'Contact customer service'
      },
      'venmo.com': {
        url: 'https://help.venmo.com/hc/en-us/articles/360048154573',
        difficulty: 'medium',
        time: 'Varies',
        notes: 'Close from account settings'
      },
      
      // Dating
      'tinder.com': {
        url: 'https://www.help.tinder.com/hc/en-us/articles/360034939132',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Delete from app settings'
      },
      'bumble.com': {
        url: 'https://bumble.com/en-us/help/account-settings',
        difficulty: 'easy',
        time: 'Immediate',
        notes: 'Delete from app settings'
      },
      
      // Food Delivery
      'uber.com': {
        url: 'https://help.uber.com/riders/article/how-do-i-delete-my-uber-account?nodeId=4e0c8b0a-2e5c-4b5a-8f3d-1e2f3a4b5c6d',
        difficulty: 'medium',
        time: '30 days',
        notes: 'Account deleted after 30 days'
      },
      'doordash.com': {
        url: 'https://help.doordash.com/consumers/s/article/How-do-I-delete-my-DoorDash-account',
        difficulty: 'medium',
        time: 'Varies',
        notes: 'Contact support to delete'
      },
      'grubhub.com': {
        url: 'https://support.grubhub.com/hc/en-us/articles/360050715073',
        difficulty: 'medium',
        time: 'Varies',
        notes: 'Contact support to delete'
      }
    };
  }

  getDeletionInfo(domain) {
    // Try exact match first
    if (this.database[domain]) {
      return this.database[domain];
    }

    // Try without www
    const domainWithoutWww = domain.replace(/^www\./, '');
    if (this.database[domainWithoutWww]) {
      return this.database[domainWithoutWww];
    }

    // Try parent domain
    const parts = domain.split('.');
    if (parts.length > 2) {
      const parentDomain = parts.slice(-2).join('.');
      if (this.database[parentDomain]) {
        return this.database[parentDomain];
      }
    }

    // Return default with search link
    return {
      url: `https://www.google.com/search?q=how+to+delete+account+${domain}+GDPR`,
      difficulty: 'unknown',
      time: 'Unknown',
      notes: 'No direct link available. Search for deletion instructions.'
    };
  }

  getDifficultyColor(difficulty) {
    const colors = {
      'easy': '#27ae60',
      'medium': '#f39c12',
      'hard': '#e74c3c',
      'unknown': '#95a5a6'
    };
    return colors[difficulty] || colors.unknown;
  }

  getDifficultyIcon(difficulty) {
    const icons = {
      'easy': '✅',
      'medium': '⚠️',
      'hard': '❌',
      'unknown': '❓'
    };
    return icons[difficulty] || icons.unknown;
  }

  searchDatabase(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    for (const [domain, info] of Object.entries(this.database)) {
      if (domain.includes(lowerQuery)) {
        results.push({ domain, ...info });
      }
    }
    
    return results;
  }

  getAllDomains() {
    return Object.keys(this.database);
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeletionDatabase;
}

// Make available globally for popup.html script tag
if (typeof window !== 'undefined') {
  window.DeletionDatabase = DeletionDatabase;
}

