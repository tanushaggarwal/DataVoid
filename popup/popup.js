// DataVoid Popup - Production Ready
class DataVoidPopup {
  constructor() {
    this.scanBtn = document.getElementById('scanBtn');
    this.loading = document.getElementById('loading');
    this.results = document.getElementById('results');
    this.stats = document.getElementById('stats');
    this.accountList = document.getElementById('accountList');
    this.bulkActions = document.getElementById('bulkActions');
    
    this.allAccounts = [];
    this.filteredAccounts = [];
    this.selectedAccounts = new Set();
    this.currentFilter = 'all';
    this.currentTagFilter = 'all';
    this.currentCategoryFilter = 'all';
    this.currentSort = 'date-desc';
    this.searchQuery = '';
    this.deletionDB = null;
    this.categorizer = null;
    this.accountTags = new Map(); // domain -> tag (keep/delete/review)
    this.deletedAccounts = new Set(); // domain -> deleted status
    
    this.init();
  }
  
  async init() {
    try {
      // Load deletion database
      await this.loadDeletionDatabase();
      
      // Load categorizer
      await this.loadCategorizer();
      
      // Load saved tags
      await this.loadAccountTags();
      
      // Load deleted accounts
      await this.loadDeletedAccounts();
      
      // Setup event listeners
    this.scanBtn.addEventListener('click', () => this.startScan());
    this.setupQuickActions();
      this.setupKeyboardShortcuts();
      
      // Load previous results
      await this.loadPreviousResults();
    } catch (error) {
      this.handleError('Failed to initialize extension', error);
    }
  }
  
  async loadDeletionDatabase() {
    try {
      // DeletionDatabase should be loaded via script tag in popup.html
      if (typeof DeletionDatabase !== 'undefined') {
        this.deletionDB = new DeletionDatabase();
      } else {
        // Fallback if database class not available
        this.deletionDB = {
          getDeletionInfo: (domain) => ({
            url: `https://www.google.com/search?q=how+to+delete+account+${domain}+GDPR`,
            difficulty: 'unknown',
            time: 'Unknown',
            notes: 'No direct link available. Search for deletion instructions.'
          }),
          getDifficultyColor: () => '#95a5a6',
          getDifficultyIcon: () => '❓'
        };
      }
    } catch (error) {
      // Fallback on error
      this.deletionDB = {
        getDeletionInfo: (domain) => ({
          url: `https://www.google.com/search?q=how+to+delete+account+${domain}+GDPR`,
          difficulty: 'unknown',
          time: 'Unknown',
          notes: 'No direct link available.'
        }),
        getDifficultyColor: () => '#95a5a6',
        getDifficultyIcon: () => '❓'
      };
    }
  }
  
  async loadCategorizer() {
    try {
      if (typeof AccountCategorizer !== 'undefined') {
        this.categorizer = new AccountCategorizer();
      } else {
        this.categorizer = null;
      }
    } catch (error) {
      this.categorizer = null;
    }
  }
  
  async loadAccountTags() {
    try {
      const data = await chrome.storage.local.get(['accountTags']);
      if (data.accountTags) {
        this.accountTags = new Map(Object.entries(data.accountTags));
      }
    } catch (error) {
      // Continue without tags if loading fails
    }
  }
  
  async loadDeletedAccounts() {
    try {
      const data = await chrome.storage.local.get(['deletedAccounts']);
      if (data.deletedAccounts && Array.isArray(data.deletedAccounts)) {
        this.deletedAccounts = new Set(data.deletedAccounts);
      }
    } catch (error) {
      // Continue without deleted accounts if loading fails
    }
  }
  
  async saveDeletedAccounts() {
    try {
      const deletedArray = Array.from(this.deletedAccounts);
      await chrome.storage.local.set({ deletedAccounts: deletedArray });
    } catch (error) {
      // Silently fail
    }
  }
  
  async saveAccountTags() {
    try {
      const tagsObj = Object.fromEntries(this.accountTags);
      await chrome.storage.local.set({ accountTags: tagsObj });
    } catch (error) {
      // Silently fail - tags are not critical
    }
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Enter to scan
      if (e.key === 'Enter' && e.target === document.body) {
        if (!this.scanBtn.disabled) {
          this.startScan();
        }
      }
      
      // Escape to close popup (if Chrome allows)
      if (e.key === 'Escape') {
        // Chrome doesn't allow closing popup programmatically
      }
      
      // Ctrl/Cmd + F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }
  
  setupFilterTabs() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.applyFilters();
      });
    });
    
    // Setup tag filters
    const tagFilterBtns = document.querySelectorAll('.tag-filter-btn');
    tagFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tagFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTagFilter = btn.dataset.tag || 'all';
        this.applyFilters();
      });
    });
    
    // Setup category filters
    const categoryFilterBtns = document.querySelectorAll('.category-filter-btn');
    categoryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategoryFilter = btn.dataset.category || 'all';
        this.applyFilters();
      });
    });
    
    // Setup sort dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.applyFilters();
      });
    }
  }
  
  async markAsDeleted(domain) {
    if (confirm(`Mark ${domain} as deleted? This will hide it from the main list.`)) {
      this.deletedAccounts.add(domain);
      await this.saveDeletedAccounts();
      
      // Update account in allAccounts
      const account = this.allAccounts.find(acc => acc.domain === domain);
      if (account) {
        account.isDeleted = true;
      }
      
      this.applyFilters();
      this.showSuccess(`${domain} marked as deleted!`);
    }
  }
  
  async unmarkAsDeleted(domain) {
    this.deletedAccounts.delete(domain);
    await this.saveDeletedAccounts();
    
    // Update account in allAccounts
    const account = this.allAccounts.find(acc => acc.domain === domain);
    if (account) {
      account.isDeleted = false;
    }
    
    this.applyFilters();
    this.showSuccess(`${domain} restored!`);
  }
  
  setupBulkActions() {
    const selectAllBtn = document.getElementById('selectAllBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const exportListBtn = document.getElementById('exportListBtn');
    
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => this.selectAll());
    }
    if (bulkDeleteBtn) {
      bulkDeleteBtn.addEventListener('click', () => this.bulkDeleteGuide());
    }
    if (exportListBtn) {
      exportListBtn.addEventListener('click', () => this.exportList());
    }
  }
  
  setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
      
      // Clear search button
      const clearSearch = document.getElementById('clearSearch');
      if (clearSearch) {
        clearSearch.addEventListener('click', () => {
          searchInput.value = '';
          this.searchQuery = '';
          this.applyFilters();
        });
      }
    }
  }
  
  setupQuickActions() {
    const gdprBtn = document.getElementById('gdprTemplateBtn');
    if (gdprBtn) {
      gdprBtn.addEventListener('click', () => this.showGDPRTemplate());
    }
    
    const privacyBtn = document.getElementById('privacyGuideBtn');
    if (privacyBtn) {
      privacyBtn.addEventListener('click', () => this.showPrivacyGuide());
    }
    
    const exportBtn = document.getElementById('dataExportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.showDataExportGuide());
    }
    
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        chrome.runtime.openOptionsPage().catch(err => {
          this.handleError('Failed to open options page', err);
        });
      });
    }
  }
  
  async startScan() {
    this.showLoading();
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'scanAccounts'
      });
      
      if (!response) {
        throw new Error('No response from background script');
      }
      
      if (response.success) {
        this.allAccounts = this.processAccounts(response.data);
        this.filteredAccounts = [...this.allAccounts];
        this.displayResults();
        await this.saveResults(response.data);
        this.showSuccess('Scan completed successfully!');
      } else {
        throw new Error(response.error || 'Scan failed');
      }
    } catch (error) {
      this.handleError('Scan failed. Please check your browser permissions and try again.', error);
    } finally {
      this.hideLoading();
    }
  }
  
  processAccounts(data) {
    try {
    const { history, cookies } = data;
    const allAccounts = new Map();
    
    // Add login sites
      if (history && history.loginSites) {
    history.loginSites.forEach(site => {
          if (site && site.domain) {
      if (!allAccounts.has(site.domain)) {
              const accountCategory = this.categorizer ? 
                this.categorizer.categorizeAccount(site.domain, site.url || '', site.title || '') : 
                { key: 'other', name: 'Other', icon: '🌐' };
              
              allAccounts.set(site.domain, {
                ...site,
                type: 'login',
                lastActivity: new Date(site.lastVisit).toLocaleDateString(),
                daysSince: Math.floor((Date.now() - site.lastVisit) / (1000 * 60 * 60 * 24)),
                ageCategory: this.categorizeAccountAge(site.lastVisit),
                accountCategory: accountCategory,
                hasAuthCookies: false,
                tag: this.accountTags.get(site.domain) || null,
                isDeleted: this.deletedAccounts.has(site.domain)
              });
            }
          }
        });
      }
    
    // Add signup sites
      if (history && history.signupSites) {
    history.signupSites.forEach(site => {
          if (site && site.domain) {
      if (allAccounts.has(site.domain)) {
        allAccounts.get(site.domain).type = 'account';
      } else {
              const accountCategory = this.categorizer ? 
                this.categorizer.categorizeAccount(site.domain, site.url || '', site.title || '') : 
                { key: 'other', name: 'Other', icon: '🌐' };
              
              allAccounts.set(site.domain, {
                ...site,
                type: 'signup',
                lastActivity: new Date(site.lastVisit).toLocaleDateString(),
                daysSince: Math.floor((Date.now() - site.lastVisit) / (1000 * 60 * 60 * 24)),
                ageCategory: this.categorizeAccountAge(site.lastVisit),
                accountCategory: accountCategory,
                hasAuthCookies: false,
                tag: this.accountTags.get(site.domain) || null,
                isDeleted: this.deletedAccounts.has(site.domain)
              });
            }
          }
        });
      }
    
    // Add cookie data
      if (cookies && Array.isArray(cookies)) {
    cookies.forEach(cookie => {
          if (cookie && cookie.domain && allAccounts.has(cookie.domain)) {
            allAccounts.get(cookie.domain).hasAuthCookies = cookie.hasAuthCookies || false;
          }
        });
      }
      
      return Array.from(allAccounts.values()).sort((a, b) => (b.lastVisit || 0) - (a.lastVisit || 0));
    } catch (error) {
      this.handleError('Failed to process accounts', error);
      return [];
    }
  }
  
  categorizeAccountAge(lastVisit) {
    try {
      const daysSince = Math.floor((Date.now() - (lastVisit || Date.now())) / (1000 * 60 * 60 * 24));
      if (daysSince < 30) return 'active';
      if (daysSince < 90) return 'recent';
      return 'old';
    } catch (error) {
      return 'old';
    }
  }
  
  applyFilters() {
    let filtered = [...this.allAccounts];
    
    // Filter out deleted accounts by default (unless viewing deleted)
    if (this.currentFilter !== 'deleted') {
      filtered = filtered.filter(acc => !acc.isDeleted);
    } else {
      filtered = filtered.filter(acc => acc.isDeleted);
    }
    
    // Apply age category filter (active/recent/old)
    if (this.currentFilter !== 'all' && this.currentFilter !== 'deleted') {
      filtered = filtered.filter(acc => acc.ageCategory === this.currentFilter);
    }
    
    // Apply tag filter
    if (this.currentTagFilter !== 'all') {
      filtered = filtered.filter(acc => acc.tag === this.currentTagFilter);
    }
    
    // Apply category filter (social/shopping/etc)
    if (this.currentCategoryFilter !== 'all') {
      filtered = filtered.filter(acc => 
        acc.accountCategory && acc.accountCategory.key === this.currentCategoryFilter
      );
    }
    
    // Apply search filter
    if (this.searchQuery) {
      filtered = filtered.filter(acc => 
        acc.domain.toLowerCase().includes(this.searchQuery) ||
        (acc.title && acc.title.toLowerCase().includes(this.searchQuery)) ||
        (acc.accountCategory && acc.accountCategory.name.toLowerCase().includes(this.searchQuery))
      );
    }
    
    // Apply sorting
    filtered = this.sortAccounts(filtered);
    
    this.filteredAccounts = filtered;
    this.displayResults();
  }
  
  sortAccounts(accounts) {
    const sorted = [...accounts];
    
    switch (this.currentSort) {
      case 'domain-asc':
        return sorted.sort((a, b) => a.domain.localeCompare(b.domain));
      case 'domain-desc':
        return sorted.sort((a, b) => b.domain.localeCompare(a.domain));
      case 'date-asc':
        return sorted.sort((a, b) => (a.lastVisit || 0) - (b.lastVisit || 0));
      case 'date-desc':
        return sorted.sort((a, b) => (b.lastVisit || 0) - (a.lastVisit || 0));
      case 'days-asc':
        return sorted.sort((a, b) => (a.daysSince || 0) - (b.daysSince || 0));
      case 'days-desc':
        return sorted.sort((a, b) => (b.daysSince || 0) - (a.daysSince || 0));
      case 'category-asc':
        return sorted.sort((a, b) => {
          const catA = a.accountCategory?.name || 'Other';
          const catB = b.accountCategory?.name || 'Other';
          return catA.localeCompare(catB);
        });
      default:
        return sorted;
    }
  }
  
  displayResults() {
    try {
    const { history } = this.getStats();
    
    // Display stats
      const loginCountEl = document.getElementById('loginCount');
      const accountCountEl = document.getElementById('accountCount');
      
      if (loginCountEl) {
        loginCountEl.textContent = history.loginSites.length || 0;
      }
      if (accountCountEl) {
        accountCountEl.textContent = this.allAccounts.length || 0;
      }
      
      if (this.stats) {
    this.stats.style.display = 'grid';
      }
    
    // Show bulk actions if we have accounts
      if (this.bulkActions) {
    this.bulkActions.style.display = this.allAccounts.length > 0 ? 'flex' : 'none';
      }
    
    // Display account list
      if (!this.accountList) return;
      
    this.accountList.innerHTML = '';
    
    if (this.filteredAccounts.length === 0) {
        this.showEmptyState();
      return;
    }
    
    this.filteredAccounts.forEach(account => {
        const item = this.createAccountItem(account);
        this.accountList.appendChild(item);
      });
      
      if (this.results) {
        this.results.style.display = 'block';
      }
      
      // Setup event listeners after elements are created
      this.setupFilterTabs();
      this.setupBulkActions();
      this.setupSearch();
    } catch (error) {
      this.handleError('Failed to display results', error);
    }
  }
  
  createAccountItem(account) {
      const item = document.createElement('div');
      const ageCategory = account.ageCategory || 'old';
      const isDeleted = account.isDeleted || false;
      item.className = `result-item account-item ${ageCategory}-account ${isDeleted ? 'deleted-account' : ''}`;
      
      if (isDeleted) {
        item.style.opacity = '0.6';
        item.style.textDecoration = 'line-through';
      }
      
      const isSelected = this.selectedAccounts.has(account.domain);
      const deletionInfo = this.deletionDB ? this.deletionDB.getDeletionInfo(account.domain) : null;
      const tag = account.tag || 'none';
      const accountCategory = account.accountCategory || { key: 'other', name: 'Other', icon: '🌐' };
      
      item.innerHTML = `
        <input type="checkbox" class="account-checkbox" ${isSelected ? 'checked' : ''} 
             data-domain="${this.escapeHtml(account.domain)}" aria-label="Select ${this.escapeHtml(account.domain)}">
        <div class="account-content">
        <div class="domain-row">
          <span class="domain">${isDeleted ? '✓ ' : ''}${this.escapeHtml(account.domain)}</span>
          ${tag !== 'none' ? `<span class="account-tag tag-${tag}" title="Tagged as: ${tag}">${tag}</span>` : ''}
          <span class="account-category" title="${this.escapeHtml(accountCategory.name)}">${accountCategory.icon || '🌐'}</span>
        </div>
          <div class="account-age">
          Last visit: ${account.daysSince || 0} days ago
          ${account.hasAuthCookies ? ' • 🔐 Has auth cookies' : ''}
          ${deletionInfo ? ` • ${this.deletionDB.getDifficultyIcon(deletionInfo.difficulty)} ${deletionInfo.difficulty}` : ''}
        </div>
        ${deletionInfo && deletionInfo.notes ? `<div class="deletion-notes">${this.escapeHtml(deletionInfo.notes)}</div>` : ''}
      </div>
      <div class="account-actions">
        <div class="tag-dropdown">
          <button class="tag-btn" data-domain="${this.escapeHtml(account.domain)}" title="Tag account">
            🏷️
          </button>
          <div class="tag-menu" id="tagMenu-${this.escapeHtml(account.domain)}">
            <button class="tag-option" data-tag="keep" data-domain="${this.escapeHtml(account.domain)}">✓ Keep</button>
            <button class="tag-option" data-tag="delete" data-domain="${this.escapeHtml(account.domain)}">🗑️ Delete</button>
            <button class="tag-option" data-tag="review" data-domain="${this.escapeHtml(account.domain)}">👁️ Review</button>
            <button class="tag-option" data-tag="none" data-domain="${this.escapeHtml(account.domain)}">✗ Remove Tag</button>
          </div>
        </div>
        ${!isDeleted ? `
        <button class="visit-btn" data-domain="${this.escapeHtml(account.domain)}" title="Visit site">
          🌐 Visit
        </button>
        <button class="delete-btn" data-domain="${this.escapeHtml(account.domain)}" title="Open deletion guide for ${this.escapeHtml(account.domain)}">
          🗑️ How to Delete
        </button>
        <button class="mark-deleted-btn" data-domain="${this.escapeHtml(account.domain)}" title="Mark as deleted">
          ✓ Deleted
        </button>
        ` : `
        <button class="undo-deleted-btn" data-domain="${this.escapeHtml(account.domain)}" title="Undo deletion">
          ↶ Undo
        </button>
        `}
        </div>
      `;
      
      // Add event listeners
      const checkbox = item.querySelector('.account-checkbox');
      const tagBtn = item.querySelector('.tag-btn');
      const tagMenu = item.querySelector('.tag-menu');
      const tagOptions = item.querySelectorAll('.tag-option');
      
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          if (e.target.checked) {
            this.selectedAccounts.add(account.domain);
          } else {
            this.selectedAccounts.delete(account.domain);
          }
          this.updateBulkActions();
        });
      }
      
      if (!isDeleted) {
        const visitBtn = item.querySelector('.visit-btn');
        const deleteBtn = item.querySelector('.delete-btn');
        const markDeletedBtn = item.querySelector('.mark-deleted-btn');
        
        if (visitBtn) {
          visitBtn.addEventListener('click', () => this.visitAccount(account.domain));
        }
        if (deleteBtn) {
          deleteBtn.addEventListener('click', () => this.openDeleteGuide(account.domain, deletionInfo));
        }
        if (markDeletedBtn) {
          markDeletedBtn.addEventListener('click', () => this.markAsDeleted(account.domain));
        }
      } else {
        const undoBtn = item.querySelector('.undo-deleted-btn');
        if (undoBtn) {
          undoBtn.addEventListener('click', () => this.unmarkAsDeleted(account.domain));
        }
      }
    
    // Tag dropdown
    if (tagBtn && tagMenu) {
      tagBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other menus
        document.querySelectorAll('.tag-menu').forEach(menu => {
          if (menu !== tagMenu) menu.style.display = 'none';
        });
        tagMenu.style.display = tagMenu.style.display === 'block' ? 'none' : 'block';
      });
    }
    
    if (tagOptions && tagOptions.length > 0) {
      tagOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const tag = option.dataset.tag;
          const domain = option.dataset.domain;
          this.setAccountTag(domain, tag === 'none' ? null : tag);
          if (tagMenu) tagMenu.style.display = 'none';
        });
      });
    }
    
    // Close menu when clicking outside
    if (tagMenu) {
      document.addEventListener('click', () => {
        if (tagMenu) tagMenu.style.display = 'none';
      });
    }
    
    return item;
  }
  
  async setAccountTag(domain, tag) {
    if (tag) {
      this.accountTags.set(domain, tag);
    } else {
      this.accountTags.delete(domain);
    }
    
    // Update account in allAccounts
    const account = this.allAccounts.find(acc => acc.domain === domain);
    if (account) {
      account.tag = tag;
    }
    
    await this.saveAccountTags();
    this.applyFilters();
  }
  
  showEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <div class="empty-state-icon">🔍</div>
      <div class="empty-state-title">No accounts found</div>
      <div class="empty-state-message">
        ${this.searchQuery ? 'Try adjusting your search or filters.' : 'Click "Scan for Old Accounts" to discover accounts in your browser history.'}
      </div>
    `;
    this.accountList.appendChild(emptyState);
  }
  
  visitAccount(domain) {
    try {
    chrome.tabs.create({
      url: `https://${domain}`
      }).catch(err => {
        this.handleError(`Failed to open ${domain}`, err);
      });
    } catch (error) {
      this.handleError('Failed to visit account', error);
    }
  }
  
  openDeleteGuide(domain, deletionInfo) {
    try {
      // Show confirmation dialog explaining what will happen
      const hasDirectLink = deletionInfo && deletionInfo.url && this.deletionDB;
      const message = hasDirectLink
        ? `DataVoid will open the account deletion page for ${domain}.\n\nYou'll need to:\n1. Log into your account\n2. Follow the deletion process\n3. Confirm the deletion\n\nNote: DataVoid cannot delete accounts automatically for security reasons.`
        : `DataVoid will search for deletion instructions for ${domain}.\n\nYou'll need to:\n1. Follow the instructions found\n2. Log into your account\n3. Manually delete the account\n\nNote: DataVoid cannot delete accounts automatically for security reasons.`;
      
      if (confirm(message)) {
        let url;
        
        if (hasDirectLink) {
          url = deletionInfo.url;
        } else {
          url = `https://www.google.com/search?q=how+to+delete+account+${domain}+GDPR`;
        }
        
        chrome.tabs.create({ url }).catch(err => {
          this.handleError('Failed to open deletion guide', err);
        });
      }
    } catch (error) {
      this.handleError('Failed to open delete guide', error);
    }
  }
  
  selectAll() {
    const checkboxes = document.querySelectorAll('.account-checkbox');
    const allSelected = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(checkbox => {
      checkbox.checked = !allSelected;
      const domain = checkbox.dataset.domain;
      if (!allSelected) {
        this.selectedAccounts.add(domain);
      } else {
        this.selectedAccounts.delete(domain);
      }
    });
    
    this.updateBulkActions();
  }
  
  updateBulkActions() {
    const selectAllBtn = document.getElementById('selectAllBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    
    if (selectAllBtn) {
    if (this.selectedAccounts.size > 0) {
      selectAllBtn.textContent = `Deselect All (${this.selectedAccounts.size})`;
      } else {
        selectAllBtn.textContent = 'Select All';
      }
    }
    
    if (bulkDeleteBtn) {
      if (this.selectedAccounts.size > 0) {
      bulkDeleteBtn.textContent = `Bulk Delete (${this.selectedAccounts.size})`;
      bulkDeleteBtn.disabled = false;
    } else {
      bulkDeleteBtn.textContent = 'Bulk Delete';
      bulkDeleteBtn.disabled = true;
      }
    }
  }
  
  bulkDeleteGuide() {
    if (this.selectedAccounts.size === 0) return;
    
    try {
    const domains = Array.from(this.selectedAccounts);
    const searchQuery = domains.map(d => `"${d}"`).join(' OR ');
    
    chrome.tabs.create({
        url: `https://www.google.com/search?q=how+to+delete+account+(${encodeURIComponent(searchQuery)})+GDPR`
      }).catch(err => {
        this.handleError('Failed to open bulk delete guide', err);
    });
    } catch (error) {
      this.handleError('Failed to create bulk delete guide', error);
    }
  }
  
  exportList() {
    try {
    const data = {
      exportDate: new Date().toISOString(),
      totalAccounts: this.allAccounts.length,
        version: '1.0.0',
      accounts: this.allAccounts.map(acc => ({
        domain: acc.domain,
        type: acc.type,
        lastVisit: acc.lastActivity,
        daysSince: acc.daysSince,
        category: acc.category,
        hasAuthCookies: acc.hasAuthCookies,
          tag: acc.tag || null,
        url: acc.url
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `datavoid-accounts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
      this.showSuccess('Account list exported successfully!');
    } catch (error) {
      this.handleError('Failed to export list', error);
    }
  }
  
  getStats() {
    const loginSites = this.allAccounts.filter(acc => acc.type === 'login' || acc.type === 'account');
    const signupSites = this.allAccounts.filter(acc => acc.type === 'signup');
    
    return {
      history: {
        loginSites: loginSites,
        signupSites: signupSites
      }
    };
  }
  
  showLoading() {
    if (this.scanBtn) {
    this.scanBtn.disabled = true;
      this.scanBtn.textContent = '⏳ Scanning...';
    }
    if (this.loading) {
    this.loading.style.display = 'block';
    }
    if (this.results) {
    this.results.style.display = 'none';
    }
    if (this.stats) {
    this.stats.style.display = 'none';
    }
  }
  
  hideLoading() {
    if (this.scanBtn) {
    this.scanBtn.disabled = false;
      this.scanBtn.textContent = '🔍 Scan for Old Accounts';
    }
    if (this.loading) {
    this.loading.style.display = 'none';
    }
  }
  
  async saveResults(data) {
    try {
    await chrome.storage.local.set({
      lastScan: Date.now(),
      scanResults: data
    });
    } catch (error) {
      // Silently fail - not critical
    }
  }
  
  async loadPreviousResults() {
    try {
    const stored = await chrome.storage.local.get(['lastScan', 'scanResults']);
    
    if (stored.lastScan && stored.scanResults) {
      const hoursSince = (Date.now() - stored.lastScan) / (1000 * 60 * 60);
      
      if (hoursSince < 24) {
        this.allAccounts = this.processAccounts(stored.scanResults);
        this.filteredAccounts = [...this.allAccounts];
        this.displayResults();
      }
      }
    } catch (error) {
      // Silently fail - not critical
    }
  }
  
  showError(message, error = null) {
    if (this.accountList) {
      this.accountList.innerHTML = `
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <div class="error-title">Error</div>
          <div class="error-message">${this.escapeHtml(message)}</div>
          ${error ? `<div class="error-details">${this.escapeHtml(error.message)}</div>` : ''}
        </div>
      `;
    }
    if (this.results) {
    this.results.style.display = 'block';
    }
  }
  
  showSuccess(message) {
    // Show temporary success message
    const successEl = document.createElement('div');
    successEl.className = 'success-message';
    successEl.textContent = message;
    successEl.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #27ae60;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      z-index: 10000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(successEl);
    
    setTimeout(() => {
      if (successEl.parentNode) {
        successEl.parentNode.removeChild(successEl);
      }
    }, 3000);
  }
  
  handleError(message, error = null) {
    this.showError(message, error);
    // Log error for debugging (only in development)
    if (error) {
      // Error logging would go here if needed
    }
  }
  
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  showGDPRTemplate() {
    const template = `Subject: GDPR Data Deletion Request

Dear [Company Name] Data Protection Officer,

I am writing to request the deletion of my personal data under Article 17 of the General Data Protection Regulation (GDPR).

Account Information:
- Email: [Your Email]
- Username: [Your Username]
- Account ID: [If known]

I request that you:
1. Delete all personal data associated with my account
2. Confirm deletion in writing within 30 days
3. Provide a list of any data that cannot be deleted and the legal basis for retention

If you need additional verification, please contact me at [Your Email].

Thank you for your prompt attention to this matter.

Best regards,
[Your Name]
[Your Email]
[Date]`;

    this.showModal('GDPR Deletion Request Template', template, 'Copy Template');
  }
  
  showPrivacyGuide() {
    const guide = `🔒 PRIVACY PROTECTION GUIDE

📋 STEP 1: Audit Your Accounts
• Use DataVoid to scan for old accounts
• Review each account and decide if you still need it
• Check what data each service has about you

🗑️ STEP 2: Delete Unnecessary Accounts
• Start with accounts you haven't used in 6+ months
• Use the "Delete" button for each account
• Follow the specific deletion process for each service

📤 STEP 3: Export Important Data
• Before deleting, export any data you want to keep
• Use the "Data Export" feature for each service
• Save important files, photos, or documents

🔐 STEP 4: Secure Remaining Accounts
• Enable 2FA on all remaining accounts
• Use strong, unique passwords
• Review privacy settings regularly

⚡ STEP 5: Regular Maintenance
• Run DataVoid monthly
• Delete new unused accounts promptly
• Keep your digital footprint minimal

💡 TIP: Start with the oldest accounts first - they're usually the safest to delete!`;

    this.showModal('Privacy Protection Guide', guide, 'Got It!');
  }
  
  showDataExportGuide() {
    const guide = `📤 DATA EXPORT GUIDE

🎯 BEFORE DELETING ANY ACCOUNT:

1. 📧 EMAIL ACCOUNTS
   • Export contacts (CSV format)
   • Download important emails
   • Save email signatures and templates

2. 📱 SOCIAL MEDIA
   • Download your photos and videos
   • Export friend lists and connections
   • Save important messages or posts

3. 💼 WORK ACCOUNTS
   • Export project files and documents
   • Save contact information
   • Download any work-related data

4. 🛒 SHOPPING ACCOUNTS
   • Download order history
   • Save receipts and invoices
   • Export wishlists or saved items

5. 📊 CLOUD STORAGE
   • Download all files and folders
   • Export sharing permissions
   • Save any collaborative documents

⚡ QUICK TIPS:
• Most services have a "Download Your Data" option
• Look for "Data Export" or "Account Settings"
• Export in multiple formats (JSON, CSV, PDF)
• Keep exports in a secure location

🚨 REMEMBER: Once deleted, data is usually gone forever!`;

    this.showModal('Data Export Guide', guide, 'Understood!');
  }
  
  showModal(title, content, buttonText) {
    try {
    // Create modal overlay
    const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
      modal.className = 'modal-content';
    modal.style.cssText = `
      background: #2c3e50;
      border-radius: 10px;
      padding: 20px;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      border: 2px solid #34495e;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #3498db; margin-bottom: 15px; text-align: center;">${this.escapeHtml(title)}</h3>
        <div style="color: white; line-height: 1.6; white-space: pre-line; margin-bottom: 20px;">${this.escapeHtml(content)}</div>
      <div style="text-align: center;">
        <button id="copyBtn" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Copy to Clipboard</button>
          <button id="closeBtn" style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">${this.escapeHtml(buttonText)}</button>
      </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add event listeners
      const copyBtn = document.getElementById('copyBtn');
      const closeBtn = document.getElementById('closeBtn');
      
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(content).then(() => {
            this.showSuccess('Copied to clipboard!');
          }).catch(err => {
            this.handleError('Failed to copy to clipboard', err);
      });
    });
      }
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        });
      }
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }
      });
    } catch (error) {
      this.handleError('Failed to show modal', error);
    }
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DataVoidPopup();
  });
} else {
  new DataVoidPopup();
}
