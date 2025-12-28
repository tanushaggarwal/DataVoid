// Options page JavaScript
class DataVoidOptions {
  constructor() {
    this.defaultSettings = {
      scanDepth: '90',
      autoScan: false,
      notifications: true,
      dataRetention: '30',
      excludeDomains: '',
      templates: []
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.bindEvents();
    this.loadTemplates();
  }

  bindEvents() {
    document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
    document.getElementById('resetSettings').addEventListener('click', () => this.resetSettings());
    document.getElementById('addTemplate').addEventListener('click', () => this.addTemplate());
    document.getElementById('importTemplates').addEventListener('click', () => this.importTemplates());
    document.getElementById('exportData').addEventListener('click', () => this.exportData());
    document.getElementById('clearData').addEventListener('click', () => this.clearData());
  }

  async loadSettings() {
    const settings = await chrome.storage.sync.get(this.defaultSettings);
    
    document.getElementById('scanDepth').value = settings.scanDepth;
    document.getElementById('autoScan').checked = settings.autoScan;
    document.getElementById('notifications').checked = settings.notifications;
    document.getElementById('dataRetention').value = settings.dataRetention;
    document.getElementById('excludeDomains').value = settings.excludeDomains;
  }

  async saveSettings() {
    const settings = {
      scanDepth: document.getElementById('scanDepth').value,
      autoScan: document.getElementById('autoScan').checked,
      notifications: document.getElementById('notifications').checked,
      dataRetention: document.getElementById('dataRetention').value,
      excludeDomains: document.getElementById('excludeDomains').value
    };

    await chrome.storage.sync.set(settings);
    this.showMessage('Settings saved successfully!', 'success');
  }

  async resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      await chrome.storage.sync.clear();
      await this.loadSettings();
      this.showMessage('Settings reset to defaults!', 'success');
    }
  }

  async loadTemplates() {
    const { templates = [] } = await chrome.storage.local.get(['templates']);
    const templatesList = document.getElementById('templatesList');
    
    templatesList.innerHTML = '';
    
    if (templates.length === 0) {
      templatesList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No templates yet. Add your first template to get started!</p>';
      return;
    }

    templates.forEach((template, index) => {
      const templateItem = document.createElement('div');
      templateItem.className = 'template-item';
      templateItem.innerHTML = `
        <h4>${template.name}</h4>
        <p>${template.description}</p>
        <div class="template-actions">
          <button class="btn btn-secondary" onclick="options.editTemplate(${index})">Edit</button>
          <button class="btn btn-danger" onclick="options.deleteTemplate(${index})">Delete</button>
        </div>
      `;
      templatesList.appendChild(templateItem);
    });
  }

  addTemplate() {
    const name = prompt('Template name:');
    if (!name) return;
    
    const description = prompt('Template description:');
    if (!description) return;
    
    const content = prompt('Template content (GDPR deletion request):');
    if (!content) return;

    this.saveTemplate({ name, description, content });
  }

  async saveTemplate(template) {
    const { templates = [] } = await chrome.storage.local.get(['templates']);
    templates.push(template);
    await chrome.storage.local.set({ templates });
    this.loadTemplates();
    this.showMessage('Template added successfully!', 'success');
  }

  editTemplate(index) {
    const { templates = [] } = await chrome.storage.local.get(['templates']);
    const template = templates[index];
    
    const newName = prompt('Template name:', template.name);
    if (!newName) return;
    
    const newDescription = prompt('Template description:', template.description);
    if (!newDescription) return;
    
    const newContent = prompt('Template content:', template.content);
    if (!newContent) return;

    templates[index] = { name: newName, description: newDescription, content: newContent };
    chrome.storage.local.set({ templates });
    this.loadTemplates();
    this.showMessage('Template updated successfully!', 'success');
  }

  async deleteTemplate(index) {
    if (confirm('Are you sure you want to delete this template?')) {
      const { templates = [] } = await chrome.storage.local.get(['templates']);
      templates.splice(index, 1);
      await chrome.storage.local.set({ templates });
      this.loadTemplates();
      this.showMessage('Template deleted successfully!', 'success');
    }
  }

  importTemplates() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const templates = JSON.parse(e.target.result);
            chrome.storage.local.set({ templates });
            this.loadTemplates();
            this.showMessage('Templates imported successfully!', 'success');
          } catch (error) {
            this.showMessage('Error importing templates: Invalid JSON file', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  async exportData() {
    const data = await chrome.storage.local.get();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
      a.download = `datavoid-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showMessage('Data exported successfully!', 'success');
  }

  async clearData() {
      if (confirm('Are you sure you want to clear all DataVoid data? This cannot be undone.')) {
      await chrome.storage.local.clear();
      this.loadTemplates();
      this.showMessage('All data cleared successfully!', 'success');
    }
  }

  showMessage(message, type) {
    const messageClass = type === 'success' ? 'success-message' : 'error-message';
    const existingMessage = document.querySelector(`.${messageClass}`);
    
    if (existingMessage) {
      existingMessage.remove();
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = messageClass;
    messageEl.textContent = message;
    messageEl.style.display = 'block';
    
    document.querySelector('.container').insertBefore(messageEl, document.querySelector('.main'));
    
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 3000);
  }
}

// Initialize options page
const options = new DataVoidOptions();
