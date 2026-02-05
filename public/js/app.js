// API Base URL
const API_BASE = '/api';

// State
let bugs = [];
let projects = [];
let tags = [];
let currentFilter = { project: null, tag: null, search: '', dateFrom: null, dateTo: null };
let bulkMode = false;
let selectedIssues = new Set();

// API Functions
async function fetchBugs(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (currentFilter.search) queryParams.set('search', currentFilter.search);
  if (currentFilter.project) queryParams.set('project', currentFilter.project);
  if (currentFilter.tag) queryParams.set('tags', currentFilter.tag);
  if (currentFilter.dateFrom) queryParams.set('dateFrom', currentFilter.dateFrom);
  if (currentFilter.dateTo) queryParams.set('dateTo', currentFilter.dateTo);
  
  const sort = document.getElementById('sortSelect')?.value || 'newest';
  queryParams.set('sort', sort);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.set(key, value);
  });

  const response = await fetch(`${API_BASE}/bugs?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch bugs');
  const data = await response.json();
  return data.bugs;
}

async function fetchProjects() {
  const response = await fetch(`${API_BASE}/bugs/meta/projects`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
}

async function fetchTags() {
  const response = await fetch(`${API_BASE}/bugs/meta/tags`);
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
}

async function fetchBug(id) {
  const response = await fetch(`${API_BASE}/bugs/${id}`);
  if (!response.ok) throw new Error('Failed to fetch bug');
  return response.json();
}

async function createBug(bugData) {
  const response = await fetch(`${API_BASE}/bugs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bugData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create bug');
  }
  return response.json();
}

async function updateBug(id, bugData) {
  const response = await fetch(`${API_BASE}/bugs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bugData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update bug');
  }
  return response.json();
}

async function deleteBug(id) {
  const response = await fetch(`${API_BASE}/bugs/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete bug');
  return response.json();
}

async function bulkDeleteBugs(ids) {
  const response = await fetch(`${API_BASE}/bugs/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
  if (!response.ok) throw new Error('Failed to bulk delete bugs');
  return response.json();
}

async function exportBugs() {
  const response = await fetch(`${API_BASE}/bugs/export/all`);
  if (!response.ok) throw new Error('Failed to export bugs');
  return response.json();
}

async function importBugs(bugsData) {
  const response = await fetch(`${API_BASE}/bugs/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bugs: bugsData })
  });
  if (!response.ok) throw new Error('Failed to import bugs');
  return response.json();
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadData();
    setupEventListeners();
  } catch (error) {
    console.error('Initialization error:', error);
    showError('Failed to load application. Please refresh the page.');
  }
});

async function loadData() {
  try {
    bugs = await fetchBugs();
    projects = await fetchProjects();
    tags = await fetchTags();
    renderFilters();
    renderIssues();
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}

function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentFilter.search = e.target.value;
        applyFilters();
      }, 300); // Debounce search
    });
  }
}

// Filter functions
function renderFilters() {
  const projectCounts = {};
  bugs.forEach(bug => {
    if (bug.project) {
      projectCounts[bug.project] = (projectCounts[bug.project] || 0) + 1;
    }
  });

  const projectFiltersEl = document.getElementById('projectFilters');
  if (projectFiltersEl) {
    projectFiltersEl.innerHTML = `
      <button class="filter-btn ${!currentFilter.project ? 'active' : ''}" onclick="filterByProject(null)">
        <span>📁</span> All Projects <span class="filter-count">${bugs.length}</span>
      </button>
      ${projects.map(p => `
        <button class="filter-btn ${currentFilter.project === p ? 'active' : ''}" onclick="filterByProject('${escapeHtml(p)}')">
          <span>📂</span> ${escapeHtml(p)} <span class="filter-count">${projectCounts[p] || 0}</span>
        </button>
      `).join('')}
    `;
  }

  const tagFiltersEl = document.getElementById('tagFilters');
  if (tagFiltersEl) {
    tagFiltersEl.innerHTML = tags.map(t => `
      <span class="tag ${currentFilter.tag === t ? 'active' : ''}" onclick="filterByTag('${escapeHtml(t)}')">${escapeHtml(t)}</span>
    `).join('');
  }
}

function filterByProject(project) {
  currentFilter.project = project;
  applyFilters();
}

function filterByTag(tag) {
  currentFilter.tag = currentFilter.tag === tag ? null : tag;
  applyFilters();
}

async function applyFilters() {
  try {
    currentFilter.dateFrom = document.getElementById('dateFrom')?.value || null;
    currentFilter.dateTo = document.getElementById('dateTo')?.value || null;
    
    bugs = await fetchBugs();
    renderFilters();
    renderIssues();
    updateActiveFilters();
  } catch (error) {
    console.error('Error applying filters:', error);
    showError('Failed to filter bugs');
  }
}

function updateActiveFilters() {
  const container = document.getElementById('activeFiltersContainer');
  const clearBtn = document.getElementById('clearFiltersBtn');
  const hasFilters = currentFilter.project || currentFilter.tag || currentFilter.search || currentFilter.dateFrom || currentFilter.dateTo;
  
  if (container) container.style.display = hasFilters ? 'flex' : 'none';
  if (clearBtn) clearBtn.style.display = hasFilters ? 'inline-flex' : 'none';
  
  if (!container) return;
  
  let html = '';
  if (currentFilter.project) html += `<span class="active-filter-tag">Project: ${escapeHtml(currentFilter.project)} <span class="remove" onclick="clearFilter('project')">×</span></span>`;
  if (currentFilter.tag) html += `<span class="active-filter-tag">Tag: ${escapeHtml(currentFilter.tag)} <span class="remove" onclick="clearFilter('tag')">×</span></span>`;
  if (currentFilter.search) html += `<span class="active-filter-tag">Search: ${escapeHtml(currentFilter.search)} <span class="remove" onclick="clearFilter('search')">×</span></span>`;
  if (currentFilter.dateFrom) html += `<span class="active-filter-tag">From: ${currentFilter.dateFrom} <span class="remove" onclick="clearFilter('dateFrom')">×</span></span>`;
  if (currentFilter.dateTo) html += `<span class="active-filter-tag">To: ${currentFilter.dateTo} <span class="remove" onclick="clearFilter('dateTo')">×</span></span>`;
  container.innerHTML = html;
}

async function clearFilter(filterType) {
  currentFilter[filterType] = null;
  if (filterType === 'search') document.getElementById('searchInput').value = '';
  if (filterType === 'dateFrom') document.getElementById('dateFrom').value = '';
  if (filterType === 'dateTo') document.getElementById('dateTo').value = '';
  await applyFilters();
}

async function clearAllFilters() {
  currentFilter = { project: null, tag: null, search: '', dateFrom: null, dateTo: null };
  document.getElementById('searchInput').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  await applyFilters();
}

// Render issues
function renderIssues() {
  const issuesList = document.getElementById('issuesList');
  const contentTitle = document.getElementById('contentTitle');
  
  if (!issuesList) return;
  
  if (contentTitle) contentTitle.textContent = `All Issues (${bugs.length})`;

  if (bugs.length === 0) {
    issuesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">No issues found</div>
        <p>Try adjusting your filters or add a new issue</p>
      </div>
    `;
    return;
  }

  issuesList.innerHTML = bugs.map(bug => `
    <div class="issue-card ${bug.pinned ? 'pinned' : ''} ${selectedIssues.has(bug._id) ? 'selected' : ''}" 
         onclick="${bulkMode ? '' : `viewIssue('${bug._id}')`}">
      <div class="issue-header">
        ${bulkMode ? `<input type="checkbox" class="issue-checkbox" ${selectedIssues.has(bug._id) ? 'checked' : ''} onclick="toggleIssueSelection('${bug._id}', event)">` : ''}
        <div class="issue-title">${highlightText(escapeHtml(bug.title))}</div>
        <div class="issue-date">${formatDate(bug.createdAt)}</div>
      </div>
      ${bug.error ? `<div class="issue-error">${highlightText(escapeHtml(bug.error))}</div>` : ''}
      <div class="issue-meta">
        ${bug.project ? `<div class="issue-project"><span>📁</span> ${escapeHtml(bug.project)}</div>` : ''}
        <div class="issue-tags">
          ${(bug.tags || []).map(t => `<span class="issue-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function highlightText(text) {
  if (!currentFilter.search || !text) return text;
  const regex = new RegExp(`(${escapeRegex(currentFilter.search)})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// View bug detail
async function viewIssue(id) {
  try {
    const bug = await fetchBug(id);
    
    document.getElementById('detailTitle').textContent = bug.title;
    document.getElementById('detailBody').innerHTML = `
      ${bug.error ? `<div class="detail-section"><div class="detail-label">Error Message</div><div class="detail-error">${escapeHtml(bug.error)}</div></div>` : ''}
      ${bug.solution ? `<div class="detail-section"><div class="detail-label">Solution</div><div class="detail-solution">${parseMarkdown(bug.solution)}</div></div>` : ''}
      ${bug.context ? `<div class="detail-section"><div class="detail-label">Context</div><div class="detail-context">${escapeHtml(bug.context)}</div></div>` : ''}
      <div class="detail-meta">
        <div class="detail-meta-item"><div class="detail-meta-label">Project</div><div class="detail-meta-value">${escapeHtml(bug.project || 'None')}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Tags</div><div class="detail-meta-value">${(bug.tags || []).map(t => escapeHtml(t)).join(', ') || 'None'}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Created</div><div class="detail-meta-value">${formatDate(bug.createdAt)}</div></div>
      </div>
      <div class="detail-actions">
        <button class="btn btn-secondary" onclick="editIssue('${bug._id}')">✏️ Edit</button>
        <button class="btn btn-${bug.pinned ? 'warning' : 'secondary'}" onclick="togglePin('${bug._id}')">${bug.pinned ? '📌 Unpin' : '📌 Pin'}</button>
        <button class="btn btn-danger" onclick="deleteIssue('${bug._id}')">🗑️ Delete</button>
      </div>
    `;
    openModal('detail');
  } catch (error) {
    console.error('Error viewing bug:', error);
    showError('Failed to load bug details');
  }
}

function parseMarkdown(text) {
  if (!text) return '';
  return escapeHtml(text)
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, '<br>');
}

// CRUD operations
function openModal(type) {
  const modal = document.getElementById(type + 'Modal');
  if (modal) modal.classList.add('active');
}

function closeModal(type) {
  const modal = document.getElementById(type + 'Modal');
  if (modal) modal.classList.remove('active');
  
  if (type === 'add') {
    document.getElementById('editId').value = '';
    document.getElementById('issueTitle').value = '';
    document.getElementById('issueError').value = '';
    document.getElementById('issueSolution').value = '';
    document.getElementById('issueProject').value = '';
    document.getElementById('issueTags').value = '';
    document.getElementById('issueContext').value = '';
    document.getElementById('modalTitle').textContent = 'New Issue';
  }
}

async function saveIssue() {
  try {
    const title = document.getElementById('issueTitle').value.trim();
    if (!title) {
      alert('Title is required');
      return;
    }

    const editId = document.getElementById('editId').value;
    const bugData = {
      title,
      error: document.getElementById('issueError').value.trim(),
      solution: document.getElementById('issueSolution').value.trim(),
      project: document.getElementById('issueProject').value.trim(),
      tags: document.getElementById('issueTags').value.split(',').map(t => t.trim()).filter(t => t),
      context: document.getElementById('issueContext').value.trim()
    };

    if (editId) {
      await updateBug(editId, bugData);
    } else {
      await createBug(bugData);
    }

    closeModal('add');
    await loadData();
  } catch (error) {
    console.error('Error saving bug:', error);
    showError('Failed to save bug: ' + error.message);
  }
}

async function editIssue(id) {
  try {
    const bug = await fetchBug(id);
    closeModal('detail');
    
    document.getElementById('editId').value = bug._id;
    document.getElementById('issueTitle').value = bug.title;
    document.getElementById('issueError').value = bug.error || '';
    document.getElementById('issueSolution').value = bug.solution || '';
    document.getElementById('issueProject').value = bug.project || '';
    document.getElementById('issueTags').value = (bug.tags || []).join(', ');
    document.getElementById('issueContext').value = bug.context || '';
    document.getElementById('modalTitle').textContent = 'Edit Issue';
    openModal('add');
  } catch (error) {
    console.error('Error loading bug for edit:', error);
    showError('Failed to load bug for editing');
  }
}

async function deleteIssue(id) {
  if (!confirm('Delete this issue?')) return;
  
  try {
    await deleteBug(id);
    closeModal('detail');
    await loadData();
  } catch (error) {
    console.error('Error deleting bug:', error);
    showError('Failed to delete bug');
  }
}

async function togglePin(id) {
  try {
    const bug = await fetchBug(id);
    await updateBug(id, { ...bug, pinned: !bug.pinned });
    closeModal('detail');
    await loadData();
  } catch (error) {
    console.error('Error toggling pin:', error);
    showError('Failed to toggle pin');
  }
}

// Bulk operations
function toggleBulkMode() {
  bulkMode = !bulkMode;
  selectedIssues.clear();
  const bulkModeBtn = document.getElementById('bulkModeBtn');
  const bulkActions = document.getElementById('bulkActions');
  
  if (bulkModeBtn) bulkModeBtn.textContent = bulkMode ? 'Cancel' : 'Select';
  if (bulkActions) bulkActions.classList.toggle('active', bulkMode);
  
  renderIssues();
}

function cancelBulkMode() {
  bulkMode = false;
  selectedIssues.clear();
  document.getElementById('bulkModeBtn').textContent = 'Select';
  document.getElementById('bulkActions').classList.remove('active');
  renderIssues();
}

function toggleIssueSelection(id, e) {
  e.stopPropagation();
  if (selectedIssues.has(id)) selectedIssues.delete(id);
  else selectedIssues.add(id);
  document.getElementById('selectedCount').textContent = selectedIssues.size;
  renderIssues();
}

async function bulkDelete() {
  if (selectedIssues.size === 0) {
    alert('No issues selected');
    return;
  }
  
  if (!confirm(`Delete ${selectedIssues.size} issues?`)) return;
  
  try {
    await bulkDeleteBugs(Array.from(selectedIssues));
    cancelBulkMode();
    await loadData();
  } catch (error) {
    console.error('Error bulk deleting:', error);
    showError('Failed to delete issues');
  }
}

// Import/Export
async function exportData() {
  try {
    const data = await exportBugs();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bugvault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting:', error);
    showError('Failed to export data');
  }
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const bugsToImport = data.bugs || data;
      
      if (!Array.isArray(bugsToImport)) {
        throw new Error('Invalid format: expected bugs array');
      }
      
      // Remove _id fields (MongoDB will generate new ones)
      const cleanBugs = bugsToImport.map(bug => {
        const { _id, id, ...rest } = bug;
        return rest;
      });
      
      const result = await importBugs(cleanBugs);
      alert(`Imported ${result.imported} issues!`);
      await loadData();
    } catch (err) {
      console.error('Import error:', err);
      showError('Invalid JSON file or import failed');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showError(message) {
  // Simple error display - could be improved with toast/notification
  alert(message);
}
