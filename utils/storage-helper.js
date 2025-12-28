// Storage helper utilities for Chrome extension
class StorageHelper {
  constructor() {
    this.syncKeys = [
      'scanDepth', 'autoScan', 'notifications', 
      'dataRetention', 'excludeDomains'
    ];
    this.localKeys = [
      'lastScan', 'scanResults', 'templates', 'userPreferences'
    ];
  }

  // Sync storage (limited to 100KB, synced across devices)
  async setSyncData(data) {
    try {
      await chrome.storage.sync.set(data);
      return true;
    } catch (error) {
      console.error('Failed to save sync data:', error);
      return false;
    }
  }

  async getSyncData(keys = null) {
    try {
      const data = await chrome.storage.sync.get(keys || this.syncKeys);
      return data;
    } catch (error) {
      console.error('Failed to get sync data:', error);
      return {};
    }
  }

  // Local storage (unlimited, device-specific)
  async setLocalData(data) {
    try {
      await chrome.storage.local.set(data);
      return true;
    } catch (error) {
      console.error('Failed to save local data:', error);
      return false;
    }
  }

  async getLocalData(keys = null) {
    try {
      const data = await chrome.storage.local.get(keys || this.localKeys);
      return data;
    } catch (error) {
      console.error('Failed to get local data:', error);
      return {};
    }
  }

  // Clear all data
  async clearAllData() {
    try {
      await Promise.all([
        chrome.storage.sync.clear(),
        chrome.storage.local.clear()
      ]);
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }

  // Save scan results with metadata
  async saveScanResults(results) {
    const scanData = {
      results,
      timestamp: Date.now(),
      version: '1.0.0'
    };

    return await this.setLocalData({
      lastScan: Date.now(),
      scanResults: scanData
    });
  }

  // Get scan results with age check
  async getScanResults(maxAgeHours = 24) {
    const data = await this.getLocalData(['lastScan', 'scanResults']);
    
    if (!data.lastScan || !data.scanResults) {
      return null;
    }

    const ageHours = (Date.now() - data.lastScan) / (1000 * 60 * 60);
    
    if (ageHours > maxAgeHours) {
      return null; // Results too old
    }

    return data.scanResults;
  }

  // Manage templates
  async saveTemplate(template) {
    const data = await this.getLocalData(['templates']);
    const templates = data.templates || [];
    
    template.id = Date.now(); // Simple ID generation
    templates.push(template);
    
    return await this.setLocalData({ templates });
  }

  async getTemplates() {
    const data = await this.getLocalData(['templates']);
    return data.templates || [];
  }

  async deleteTemplate(templateId) {
    const data = await this.getLocalData(['templates']);
    const templates = (data.templates || []).filter(t => t.id !== templateId);
    
    return await this.setLocalData({ templates });
  }

  // Export/Import functionality
  async exportData() {
    const syncData = await this.getSyncData();
    const localData = await this.getLocalData();
    
    return {
      sync: syncData,
      local: localData,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async importData(data) {
    try {
      if (data.sync) {
        await this.setSyncData(data.sync);
      }
      
      if (data.local) {
        await this.setLocalData(data.local);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Storage quota management
  async getStorageInfo() {
    try {
      const syncQuota = await chrome.storage.sync.getBytesInUse();
      const localQuota = await chrome.storage.local.getBytesInUse();
      
      return {
        sync: {
          used: syncQuota,
          limit: 102400, // 100KB limit for sync
          percentage: (syncQuota / 102400) * 100
        },
        local: {
          used: localQuota,
          limit: 5242880, // 5MB limit for local
          percentage: (localQuota / 5242880) * 100
        }
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return null;
    }
  }

  // Cleanup old data
  async cleanupOldData(retentionDays = 30) {
    const data = await this.getLocalData();
    const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    
    // Remove old scan results
    if (data.lastScan && data.lastScan < cutoffTime) {
      await this.setLocalData({
        lastScan: null,
        scanResults: null
      });
    }
    
    return true;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageHelper;
}
