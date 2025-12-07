// Options page functionality

let bangs = {};
let editingTrigger = null;
let allBangsArray = [];

// DOM elements
const searchInput = document.getElementById('searchInput');
const addBangBtn = document.getElementById('addBangBtn');
const importBtn = document.getElementById('importBtn');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');
const bangFormContainer = document.getElementById('bangFormContainer');
const bangForm = document.getElementById('bangForm');
const formTitle = document.getElementById('formTitle');
const cancelBtn = document.getElementById('cancelBtn');
const triggerInput = document.getElementById('triggerInput');
const urlInput = document.getElementById('urlInput');
const descriptionInput = document.getElementById('descriptionInput');
const bangsTableBody = document.getElementById('bangsTableBody');
const emptyState = document.getElementById('emptyState');
const bangsTable = document.getElementById('bangsTable');
const importFileInput = document.getElementById('importFileInput');

// Load bangs from storage
async function loadBangs() {
  const result = await browser.storage.local.get('bangs');
  bangs = result.bangs || {};
  allBangsArray = Object.values(bangs).sort((a, b) => 
    a.trigger.localeCompare(b.trigger)
  );
  renderBangs(allBangsArray);
}

// Render bangs table
function renderBangs(bangsToRender) {
  bangsTableBody.innerHTML = '';
  
  if (bangsToRender.length === 0) {
    bangsTable.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  
  bangsTable.style.display = 'table';
  emptyState.style.display = 'none';
  
  bangsToRender.forEach(bang => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="trigger">!${bang.trigger}</td>
      <td>${bang.description}</td>
      <td class="url" title="${bang.url}">${bang.url}</td>
      <td class="actions">
        <button class="btn btn-small btn-edit" data-trigger="${bang.trigger}">Edit</button>
        <button class="btn btn-small btn-delete" data-trigger="${bang.trigger}">Delete</button>
      </td>
    `;
    bangsTableBody.appendChild(row);
  });
  
  // Add event listeners to edit and delete buttons
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const trigger = e.target.dataset.trigger;
      editBang(trigger);
    });
  });
  
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const trigger = e.target.dataset.trigger;
      deleteBang(trigger);
    });
  });
}

// Search/filter bangs
function filterBangs(searchTerm) {
  const filtered = allBangsArray.filter(bang => {
    const term = searchTerm.toLowerCase();
    return bang.trigger.toLowerCase().includes(term) ||
           bang.description.toLowerCase().includes(term) ||
           bang.url.toLowerCase().includes(term);
  });
  renderBangs(filtered);
}

// Show add bang form
function showAddForm() {
  formTitle.textContent = 'Add New Bang';
  triggerInput.value = '';
  urlInput.value = '';
  descriptionInput.value = '';
  triggerInput.disabled = false;
  editingTrigger = null;
  bangFormContainer.style.display = 'block';
  triggerInput.focus();
}

// Show edit bang form
function editBang(trigger) {
  const bang = bangs[trigger];
  if (!bang) return;
  
  formTitle.textContent = 'Edit Bang';
  triggerInput.value = bang.trigger;
  urlInput.value = bang.url;
  descriptionInput.value = bang.description;
  triggerInput.disabled = true; // Don't allow changing trigger when editing
  editingTrigger = trigger;
  bangFormContainer.style.display = 'block';
  urlInput.focus();
}

// Hide form
function hideForm() {
  bangFormContainer.style.display = 'none';
  editingTrigger = null;
}

// Save bang
async function saveBang(trigger, url, description) {
  // Validate inputs
  if (!trigger || !url || !description) {
    alert('All fields are required!');
    return;
  }
  
  // Validate URL contains placeholder
  if (!url.includes('{{{s}}}')) {
    const addPlaceholder = confirm('URL template does not contain {{{s}}} placeholder. Add it at the end?');
    if (addPlaceholder) {
      url += '{{{s}}}';
    } else {
      return;
    }
  }
  
  // Validate URL format
  try {
    const testUrl = url.replace('{{{s}}}', 'test');
    new URL(testUrl);
  } catch (e) {
    alert('Invalid URL format!');
    return;
  }
  
  const triggerLower = trigger.toLowerCase();
  
  // Check if trigger already exists (when adding new)
  if (!editingTrigger && bangs[triggerLower]) {
    const overwrite = confirm(`Bang "!${triggerLower}" already exists. Overwrite?`);
    if (!overwrite) return;
  }
  
  // If editing and trigger changed, delete old one
  if (editingTrigger && editingTrigger !== triggerLower) {
    delete bangs[editingTrigger];
  }
  
  // Save bang
  bangs[triggerLower] = {
    trigger: triggerLower,
    url: url,
    description: description
  };
  
  await browser.storage.local.set({ bangs: bangs });
  await loadBangs();
  hideForm();
}

// Delete bang
async function deleteBang(trigger) {
  const confirmed = confirm(`Delete bang "!${trigger}"?`);
  if (!confirmed) return;
  
  delete bangs[trigger];
  await browser.storage.local.set({ bangs: bangs });
  await loadBangs();
}

// Export bangs to JSON
function exportBangs() {
  const dataStr = JSON.stringify(allBangsArray, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'custom-bangs.json';
  link.click();
  
  URL.revokeObjectURL(url);
}

// Import bangs from JSON
function importBangs() {
  importFileInput.click();
}

// Handle import file selection
importFileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const text = await file.text();
    const importedBangs = JSON.parse(text);
    
    if (!Array.isArray(importedBangs)) {
      alert('Invalid file format! Expected an array of bangs.');
      return;
    }
    
    // Validate each bang
    for (const bang of importedBangs) {
      if (!bang.trigger || !bang.url || !bang.description) {
        alert('Invalid bang format in file!');
        return;
      }
    }
    
    const merge = confirm(`Import ${importedBangs.length} bangs? This will merge with existing bangs (duplicates will be overwritten).`);
    if (!merge) return;
    
    // Import bangs
    importedBangs.forEach(bang => {
      bangs[bang.trigger.toLowerCase()] = {
        trigger: bang.trigger.toLowerCase(),
        url: bang.url,
        description: bang.description
      };
    });
    
    await browser.storage.local.set({ bangs: bangs });
    await loadBangs();
    alert('Bangs imported successfully!');
  } catch (error) {
    alert('Error importing file: ' + error.message);
  }
  
  // Reset file input
  importFileInput.value = '';
});

// Reset to default bangs
async function resetToDefaults() {
  const confirmed = confirm('Reset all bangs to defaults? This will delete all custom bangs!');
  if (!confirmed) return;
  
  // Load default bangs (we need to fetch from background)
  // For now, we'll redirect to a fresh install state
  await browser.storage.local.clear();
  
  // Trigger a reload which will cause background.js to reinitialize
  alert('Bangs reset to defaults! Please reload the page.');
  location.reload();
}

// Event listeners
searchInput.addEventListener('input', (e) => {
  filterBangs(e.target.value);
});

addBangBtn.addEventListener('click', showAddForm);
cancelBtn.addEventListener('click', hideForm);
importBtn.addEventListener('click', importBangs);
exportBtn.addEventListener('click', exportBangs);
resetBtn.addEventListener('click', resetToDefaults);

bangForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const trigger = triggerInput.value.trim().replace('!', '');
  const url = urlInput.value.trim();
  const description = descriptionInput.value.trim();
  saveBang(trigger, url, description);
});

// Handle URL parameters
function handleUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for action parameter
  const action = urlParams.get('action');
  if (action === 'add') {
    showAddForm();
  }
  
  // Check for domain parameter
  const domain = urlParams.get('domain');
  if (domain) {
    searchInput.value = domain;
    filterBangs(domain);
  }
}

// Initialize
loadBangs();
handleUrlParameters();
