// Background script for Custom Bangs extension

let bangsCache = {};

// Initialize extension on install
browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // First install - populate with default bangs
    const bangsObject = {};
    DEFAULT_BANGS.forEach(bang => {
      bangsObject[bang.trigger.toLowerCase()] = bang;
    });
    await browser.storage.local.set({ bangs: bangsObject });
    bangsCache = bangsObject;
    console.log('Custom Bangs: Initialized with default bangs');
  } else {
    // Load existing bangs
    await loadBangs();
  }
});

// Load bangs from storage into cache
async function loadBangs() {
  const result = await browser.storage.local.get('bangs');
  bangsCache = result.bangs || {};
  console.log('Custom Bangs: Loaded', Object.keys(bangsCache).length, 'bangs');
}

// Listen for storage changes to update cache
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.bangs) {
    bangsCache = changes.bangs.newValue || {};
    console.log('Custom Bangs: Cache updated');
  }
});

// Initialize on startup
loadBangs();

// Extract bang and search terms from query
function parseBangQuery(query) {
  const trimmed = query.trim();
  
  // Check if query starts with !
  if (!trimmed.startsWith('!')) {
    return null;
  }
  
  // Extract bang trigger (everything between ! and first space)
  const spaceIndex = trimmed.indexOf(' ');
  
  if (spaceIndex === -1) {
    // Just a bang with no search terms (e.g., "!g")
    return {
      trigger: trimmed.substring(1).toLowerCase(),
      searchTerms: ''
    };
  }
  
  const trigger = trimmed.substring(1, spaceIndex).toLowerCase();
  const searchTerms = trimmed.substring(spaceIndex + 1).trim();
  
  return {
    trigger: trigger,
    searchTerms: searchTerms
  };
}

// Build redirect URL from bang and search terms
function buildRedirectUrl(bang, searchTerms) {
  // URL encode the search terms
  const encodedTerms = encodeURIComponent(searchTerms);
  // Replace placeholder with encoded search terms
  return bang.url.replace('{{{s}}}', encodedTerms);
}

// Listen to web requests and intercept bang queries
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    
    // Check if this is a search query
    // Most browsers use the search parameter 'q' in their search engine URLs
    let query = null;
    
    // Try different search parameter names
    const searchParams = ['q', 'search', 'query', 's'];
    for (const param of searchParams) {
      if (url.searchParams.has(param)) {
        query = url.searchParams.get(param);
        break;
      }
    }
    
    // Also check if URL path might contain the search (for some search engines)
    if (!query && url.pathname.includes('/search/')) {
      const pathParts = url.pathname.split('/');
      const searchIndex = pathParts.indexOf('search');
      if (searchIndex !== -1 && pathParts[searchIndex + 1]) {
        query = decodeURIComponent(pathParts[searchIndex + 1]);
      }
    }
    
    if (!query) {
      return; // Not a search query
    }
    
    // Parse the query for bang
    const parsed = parseBangQuery(query);
    
    if (!parsed) {
      return; // Not a bang query
    }
    
    // Look up bang in cache
    const bang = bangsCache[parsed.trigger];
    
    if (!bang) {
      return; // Bang not found
    }
    
    // Build redirect URL
    const redirectUrl = buildRedirectUrl(bang, parsed.searchTerms);
    
    console.log(`Custom Bangs: Redirecting !${parsed.trigger} "${parsed.searchTerms}" to ${redirectUrl}`);
    
    // Redirect to the bang URL
    return { redirectUrl: redirectUrl };
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame"]
  },
  ["blocking"]
);

// Handle toolbar button click - open options page
browser.browserAction.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});

// Create context menus
browser.contextMenus.create({
  id: "add-quick-bang",
  title: "Add Quick Bang",
  contexts: ["browser_action"]
});

browser.contextMenus.create({
  id: "view-domain-bangs",
  title: "View Bangs for This Domain",
  contexts: ["browser_action"]
});

browser.contextMenus.create({
  id: "delete-domain-bangs",
  title: "Delete Bangs for This Domain",
  contexts: ["browser_action"]
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  const currentDomain = tab ? new URL(tab.url).hostname : null;
  
  if (info.menuItemId === "add-quick-bang") {
    // Open options page with add mode
    const optionsUrl = browser.runtime.getURL("options/options.html") + "?action=add";
    browser.tabs.create({ url: optionsUrl });
  } else if (info.menuItemId === "view-domain-bangs" && currentDomain) {
    // Open options page filtered by domain
    const optionsUrl = browser.runtime.getURL("options/options.html") + "?domain=" + encodeURIComponent(currentDomain);
    browser.tabs.create({ url: optionsUrl });
  } else if (info.menuItemId === "delete-domain-bangs" && currentDomain) {
    // Delete all bangs for this domain
    await deleteDomainBangs(currentDomain);
  }
});

// Delete all bangs associated with a domain
async function deleteDomainBangs(domain) {
  const bangsList = Object.values(bangsCache);
  const domainBangs = bangsList.filter(bang => {
    try {
      const url = bang.url.replace('{{{s}}}', '');
      const bangDomain = new URL(url).hostname;
      return bangDomain === domain;
    } catch {
      return false;
    }
  });
  
  if (domainBangs.length === 0) {
    return;
  }
  
  // Remove domain bangs
  domainBangs.forEach(bang => {
    delete bangsCache[bang.trigger];
  });
  
  await browser.storage.local.set({ bangs: bangsCache });
  console.log(`Custom Bangs: Deleted ${domainBangs.length} bangs for domain ${domain}`);
}

// Get number of bangs for a domain
function getDomainBangCount(domain) {
  if (!domain) return 0;
  
  const bangsList = Object.values(bangsCache);
  return bangsList.filter(bang => {
    try {
      const url = bang.url.replace('{{{s}}}', '');
      const bangDomain = new URL(url).hostname;
      return bangDomain === domain;
    } catch {
      return false;
    }
  }).length;
}

// Update badge for current tab
async function updateBadge(tabId, url) {
  try {
    const domain = new URL(url).hostname;
    const count = getDomainBangCount(domain);
    
    if (count > 0) {
      await browser.browserAction.setBadgeText({
        text: count.toString(),
        tabId: tabId
      });
      await browser.browserAction.setBadgeBackgroundColor({
        color: "#667eea",
        tabId: tabId
      });
    } else {
      await browser.browserAction.setBadgeText({
        text: "",
        tabId: tabId
      });
    }
  } catch (e) {
    // Ignore errors for invalid URLs
  }
}

// Listen for tab updates to update badge
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateBadge(tabId, tab.url);
  }
});

// Listen for tab activation to update badge
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (tab.url) {
    updateBadge(activeInfo.tabId, tab.url);
  }
});

// Update badges for all tabs when bangs change
browser.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === 'local' && changes.bangs) {
    bangsCache = changes.bangs.newValue || {};
    console.log('Custom Bangs: Cache updated');
    
    // Update all tab badges
    const tabs = await browser.tabs.query({});
    tabs.forEach(tab => {
      if (tab.url) {
        updateBadge(tab.id, tab.url);
      }
    });
  }
});
