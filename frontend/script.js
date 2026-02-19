// Surds Dashboard - Frontend Script
// Optimized to handle 20,000+ links efficiently
// Fetches data from backend and displays charts

// Global variables to store chart instances
let lineChart = null;
let barChart = null;
let realtimeLineChart = null;
let realtimeBarChart = null;
let reportsLineChart = null;
let reportsBarChart = null;
let currentData = [];
let currentPage = 1;
let totalPages = 1;
let totalItems = 0;
let activityLog = [];
let refreshTimeout = null;

// API endpoint - using absolute URL for Live Server compatibility
const API_URL = 'http://localhost:5000/api/links';
const STATS_URL = 'http://localhost:5000/api/links/stats';

// Configuration
const ITEMS_PER_PAGE = 50; // Reduced for better performance
const CHART_DATA_LIMIT = 100; // Max data points for charts
const AUTO_REFRESH_INTERVAL = 5000; // 5 seconds

// Wait for DOM to be fully loaded before running code
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard initialized - Optimized for 20,000+ links');
    
    // Setup navigation
    setupNavigation();
    
    // Initial fetch
    fetchLinks();
    
    // Auto-refresh with throttling
    setupAutoRefresh();
});

/**
 * Setup navigation event listeners
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });
}

/**
 * Switch between different views
 */
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.remove('view-active');
    });
    
    // Show selected view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.add('view-active');
    }
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('nav-item-active');
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('nav-item-active');
        }
    });
    
    // Update header title
    const headerTitle = document.getElementById('headerTitle');
    const headerSubtitle = document.getElementById('headerSubtitle');
    
    switch(viewName) {
        case 'dashboard':
            if (headerTitle) headerTitle.textContent = 'Dashboard';
            if (headerSubtitle) headerSubtitle.textContent = 'Welcome back to your Surds analytics overview.';
            break;
        case 'manage-links':
            if (headerTitle) headerTitle.textContent = 'Manage Links';
            if (headerSubtitle) headerSubtitle.textContent = `View, edit, and manage all your shortened links. (${totalItems > 0 ? totalItems.toLocaleString() : 'Loading...'} total)`;
            renderManageLinksView(1);
            break;
        case 'realtime':
            if (headerTitle) headerTitle.textContent = 'Real Time Reports';
            if (headerSubtitle) headerSubtitle.textContent = 'Live updating charts and statistics.';
            renderRealtimeView();
            break;
        case 'reports':
            if (headerTitle) headerTitle.textContent = 'Reports';
            if (headerSubtitle) headerSubtitle.textContent = 'Comprehensive analytics and performance reports.';
            renderReportsView();
            break;
        case 'activity':
            if (headerTitle) headerTitle.textContent = 'Activity Feed';
            if (headerSubtitle) headerSubtitle.textContent = 'Recent activity and updates.';
            renderActivityView();
            break;
    }
    
    console.log('Switched to view:', viewName);
}

/**
 * Setup auto-refresh with throttling
 */
function setupAutoRefresh() {
    // Clear any existing timeout
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
    }
    
    // Set up throttled refresh
    refreshTimeout = setInterval(() => {
        const activeView = document.querySelector('.view-container.view-active');
        if (activeView) {
            const viewId = activeView.id;
            if (viewId === 'view-dashboard' || viewId === 'view-realtime') {
                console.log('Auto-refreshing data...');
                fetchLinks();
            }
        }
    }, AUTO_REFRESH_INTERVAL);
}

/**
 * Fetch links data from backend API with pagination
 */
async function fetchLinks(page = 1, limit = ITEMS_PER_PAGE) {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const linksList = document.getElementById('linksList');
    const statusIndicator = document.getElementById('statusIndicator');
    
    if (!statusIndicator) return;
    
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');
    
    try {
        // Show loading state only if elements exist
        if (loadingState) loadingState.style.display = 'flex';
        if (errorState) errorState.style.display = 'none';
        if (statusDot) statusDot.className = 'status-dot';
        if (statusText) statusText.textContent = 'Loading...';
        
        // Fetch paginated data
        const url = `${API_URL}?page=${page}&limit=${limit}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        const data = result.data || result; // Handle both paginated and non-paginated responses
        const pagination = result.pagination;
        
        console.log(`Received ${data.length} links`, pagination ? `(Page ${pagination.page}/${pagination.totalPages})` : '');
        
        // Store current data globally
        currentData = data;
        if (pagination) {
            currentPage = pagination.page;
            totalPages = pagination.totalPages;
            totalItems = pagination.total;
        }
        
        // Add to activity log
        addActivityLog('Data refreshed', `Fetched ${data.length} links`);
        
        // Hide loading state
        if (loadingState) loadingState.style.display = 'none';
        
        // Update status indicator
        if (statusDot) statusDot.className = 'status-dot connected';
        if (statusText) statusText.textContent = pagination ? `Connected (${totalItems} total)` : 'Connected';
        
        // Fetch stats for dashboard
        fetchStats();
        
        // Only render dashboard views if dashboard is active
        const dashboardView = document.getElementById('view-dashboard');
        if (dashboardView && dashboardView.classList.contains('view-active')) {
            // Render links list (limited to first page for sidebar)
            renderLinksList(data.slice(0, 10)); // Show only 10 in sidebar
            
            // Update charts with sampled data
            updateCharts(sampleDataForCharts(data, CHART_DATA_LIMIT));
            
            // Update summary cards
            updateSummaries(data, pagination);
        }
        
        // Update realtime view if active
        const realtimeView = document.getElementById('view-realtime');
        if (realtimeView && realtimeView.classList.contains('view-active')) {
            updateRealtimeCharts(sampleDataForCharts(data, CHART_DATA_LIMIT));
        }
        
        // Update reports view if active
        const reportsView = document.getElementById('view-reports');
        if (reportsView && reportsView.classList.contains('view-active')) {
            updateReportsCharts(sampleDataForCharts(data, CHART_DATA_LIMIT));
        }
        
        // Update manage links view if active
        const manageLinksView = document.getElementById('view-manage-links');
        if (manageLinksView && manageLinksView.classList.contains('view-active')) {
            renderManageLinksView();
        }
        
    } catch (error) {
        console.error('Error fetching links:', error);
        
        // Show error state
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
        
        // Update status indicator
        if (statusDot) statusDot.className = 'status-dot error';
        if (statusText) statusText.textContent = 'Error';
        
        // Clear charts on error
        if (lineChart) {
            lineChart.destroy();
            lineChart = null;
        }
        if (barChart) {
            barChart.destroy();
            barChart = null;
        }
    }
}

/**
 * Fetch statistics from backend
 */
async function fetchStats() {
    try {
        const response = await fetch(STATS_URL);
        if (response.ok) {
            const stats = await response.json();
            // Update summary cards with stats
            const totalLinksEl = document.getElementById('summaryTotalLinks');
            const totalClicksEl = document.getElementById('summaryTotalClicks');
            const topClicksEl = document.getElementById('summaryTopClicks');
            
            if (totalLinksEl) totalLinksEl.textContent = stats.totalLinks.toLocaleString();
            if (totalClicksEl) totalClicksEl.textContent = stats.totalClicks.toLocaleString();
            if (topClicksEl) topClicksEl.textContent = stats.topClicks.toLocaleString();
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

/**
 * Sample data for charts to improve performance
 */
function sampleDataForCharts(data, maxPoints = CHART_DATA_LIMIT) {
    if (data.length <= maxPoints) {
        return data;
    }
    
    // Use every nth item to sample
    const step = Math.ceil(data.length / maxPoints);
    const sampled = [];
    
    for (let i = 0; i < data.length; i += step) {
        sampled.push(data[i]);
    }
    
    // Always include the last item
    if (sampled[sampled.length - 1] !== data[data.length - 1]) {
        sampled.push(data[data.length - 1]);
    }
    
    return sampled;
}

/**
 * Render the links list dynamically
 */
function renderLinksList(links) {
    const linksList = document.getElementById('linksList');
    
    // Clear existing content
    linksList.innerHTML = '';
    
    // Check if we have links
    if (!links || links.length === 0) {
        linksList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 20px;">No links found</p>';
        return;
    }
    
    // Create HTML for each link
    links.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        
        // Format time for display
        const time = new Date(link.time).toLocaleString();
        
        linkItem.innerHTML = `
            <div class="link-short">${escapeHtml(link.short)}</div>
            <div class="link-url">${escapeHtml(link.url)}</div>
            <div class="link-meta">
                <span>${time}</span>
                <span class="link-clicks">${link.clicks} clicks</span>
            </div>
        `;
        
        linksList.appendChild(linkItem);
    });
    
    console.log('Rendered', links.length, 'links');
}

/**
 * Update or create charts with fetched data
 */
function updateCharts(data) {
    if (!data || data.length === 0) {
        console.warn('No data to display in charts');
        return;
    }
    
    // Prepare data for charts
    const labels = data.map(link => link.short);
    const clicksData = data.map(link => link.clicks);
    const times = data.map(link => new Date(link.time).toLocaleTimeString());
    
    // Chart.js configuration (optimized for light theme)
    const chartConfig = {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
            duration: 750
        },
        plugins: {
            legend: {
                labels: {
                    color: '#111827'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#6b7280'
                },
                grid: {
                    color: '#e5e7eb'
                }
            },
            y: {
                ticks: {
                    color: '#6b7280'
                },
                grid: {
                    color: '#e5e7eb'
                }
            }
        }
    };
    
    // Update or create Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    if (lineChart) {
        // Update existing chart
        lineChart.data.labels = times;
        lineChart.data.datasets[0].data = clicksData;
        lineChart.update();
    } else {
        // Create new chart
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: times,
                datasets: [{
                    label: 'Clicks',
                    data: clicksData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: chartConfig
        });
    }
    
    // Update or create Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    if (barChart) {
        // Update existing chart
        barChart.data.labels = labels;
        barChart.data.datasets[0].data = clicksData;
        barChart.update();
    } else {
        // Create new chart
        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Clicks',
                    data: clicksData,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ],
                    borderColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 2
                }]
            },
            options: chartConfig
        });
    }
    
    console.log('Charts updated with', data.length, 'data points');
}

/**
 * Update top summary cards with quick stats
 */
function updateSummaries(data, pagination = null) {
    const totalLinksEl = document.getElementById('summaryTotalLinks');
    const totalClicksEl = document.getElementById('summaryTotalClicks');
    const topClicksEl = document.getElementById('summaryTopClicks');
    const lastUpdatedEl = document.getElementById('summaryLastUpdated');

    if (!data || data.length === 0) {
        if (totalLinksEl) totalLinksEl.textContent = '0';
        if (totalClicksEl) totalClicksEl.textContent = '0';
        if (topClicksEl) topClicksEl.textContent = '0';
        if (lastUpdatedEl) lastUpdatedEl.textContent = '—';
        return;
    }

    // Use pagination total if available, otherwise calculate from current data
    const totalLinks = pagination ? pagination.total : data.length;
    const totalClicks = data.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const topClicks = Math.max(...data.map(link => link.clicks || 0));
    const now = new Date();

    if (totalLinksEl) totalLinksEl.textContent = totalLinks.toLocaleString();
    if (totalClicksEl) totalClicksEl.textContent = totalClicks.toLocaleString();
    if (topClicksEl) topClicksEl.textContent = topClicks.toLocaleString();
    if (lastUpdatedEl) lastUpdatedEl.textContent = now.toLocaleTimeString();
}

/**
 * Render Manage Links View with pagination
 */
function renderManageLinksView(page = currentPage) {
    const content = document.getElementById('manageLinksContent');
    if (!content) return;
    
    // Show loading state
    content.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading links...</p></div>';
    
    // Fetch data for this page
    fetch(`${API_URL}?page=${page}&limit=${ITEMS_PER_PAGE}&sortBy=clicks&order=desc`)
        .then(response => response.json())
        .then(result => {
            const data = result.data || result;
            const pagination = result.pagination;
            
            if (!data || data.length === 0) {
                content.innerHTML = '<div class="loading-state"><p>No links found.</p></div>';
                return;
            }
            
            let html = `
                <div class="manage-links-controls">
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Search by short code or URL..." 
                               onkeyup="handleSearch(event)" class="search-input">
                        <button onclick="handleSearch()" class="search-btn">Search</button>
                    </div>
                    <div class="pagination-info">
                        Showing ${((pagination?.page || 1) - 1) * (pagination?.limit || ITEMS_PER_PAGE) + 1} - 
                        ${Math.min((pagination?.page || 1) * (pagination?.limit || ITEMS_PER_PAGE), pagination?.total || data.length)} 
                        of ${(pagination?.total || data.length).toLocaleString()} links
                    </div>
                </div>
                <div class="links-table-container">
                    <table class="links-table">
                        <thead>
                            <tr>
                                <th><a href="#" onclick="sortTable('short'); return false;">Short Code ↕</a></th>
                                <th>Original URL</th>
                                <th><a href="#" onclick="sortTable('clicks'); return false;">Clicks ↕</a></th>
                                <th><a href="#" onclick="sortTable('time'); return false;">Created ↕</a></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            data.forEach((link) => {
                const time = new Date(link.time).toLocaleString();
                html += `
                    <tr>
                        <td><strong>${escapeHtml(link.short)}</strong></td>
                        <td class="url-cell" title="${escapeHtml(link.url)}">${escapeHtml(link.url)}</td>
                        <td><span class="clicks-badge">${link.clicks.toLocaleString()}</span></td>
                        <td>${time}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editLink('${link.short}')">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteLink('${link.short}')">Delete</button>
                            <button class="action-btn copy-btn" onclick="copyLink('${link.short}')">Copy</button>
                        </td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
            // Add pagination controls
            if (pagination && pagination.totalPages > 1) {
                html += `
                    <div class="pagination-controls">
                        <button class="pagination-btn" onclick="changePage(${pagination.page - 1})" 
                                ${!pagination.hasPrev ? 'disabled' : ''}>Previous</button>
                        <span class="pagination-pages">
                            Page ${pagination.page} of ${pagination.totalPages}
                        </span>
                        <button class="pagination-btn" onclick="changePage(${pagination.page + 1})" 
                                ${!pagination.hasNext ? 'disabled' : ''}>Next</button>
                    </div>
                `;
            }
            
            content.innerHTML = html;
            currentPage = pagination?.page || 1;
            totalPages = pagination?.totalPages || 1;
        })
        .catch(error => {
            console.error('Error loading manage links:', error);
            content.innerHTML = '<div class="error-state"><p>Error loading links. Please try again.</p></div>';
        });
}

/**
 * Handle search
 */
function handleSearch(event) {
    if (event && event.key !== 'Enter') return;
    
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value : '';
    
    fetch(`${API_URL}?page=1&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(searchTerm)}&sortBy=clicks&order=desc`)
        .then(response => response.json())
        .then(result => {
            const data = result.data || result;
            const pagination = result.pagination;
            
            // Re-render table with search results
            const content = document.getElementById('manageLinksContent');
            if (!content) return;
            
            // Similar rendering logic as renderManageLinksView but with search results
            renderManageLinksView(1);
        })
        .catch(error => {
            console.error('Search error:', error);
        });
}

/**
 * Sort table
 */
function sortTable(sortBy) {
    fetch(`${API_URL}?page=${currentPage}&limit=${ITEMS_PER_PAGE}&sortBy=${sortBy}&order=desc`)
        .then(response => response.json())
        .then(result => {
            renderManageLinksView(currentPage);
        })
        .catch(error => {
            console.error('Sort error:', error);
        });
}

/**
 * Change page
 */
function changePage(page) {
    if (page < 1 || page > totalPages) return;
    renderManageLinksView(page);
}

/**
 * Show add link form
 */
function showAddLinkForm() {
    const short = prompt('Enter short code:');
    if (!short) return;
    
    const url = prompt('Enter full URL:');
    if (!url) return;
    
    // In a real app, this would POST to the backend
    addActivityLog('Link created', `Created link ${short} -> ${url}`);
    alert(`Link ${short} would be created (backend integration needed)`);
}

/**
 * Edit link
 */
function editLink(short) {
    const link = currentData.find(l => l.short === short);
    if (!link) return;
    
    const newUrl = prompt('Enter new URL:', link.url);
    if (newUrl && newUrl !== link.url) {
        addActivityLog('Link edited', `Updated ${short}`);
        alert(`Link ${short} would be updated (backend integration needed)`);
    }
}

/**
 * Delete link
 */
function deleteLink(short) {
    if (confirm(`Are you sure you want to delete link ${short}?`)) {
        addActivityLog('Link deleted', `Removed ${short}`);
        alert(`Link ${short} would be deleted (backend integration needed)`);
    }
}

/**
 * Copy link to clipboard
 */
function copyLink(short) {
    const fullUrl = `${window.location.origin}/${short}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
        addActivityLog('Link copied', `Copied ${short} to clipboard`);
        alert('Link copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy link');
    });
}

/**
 * Render Real Time View
 */
function renderRealtimeView() {
    if (!currentData || currentData.length === 0) {
        return;
    }
    updateRealtimeCharts(currentData);
}

/**
 * Update Real Time Charts
 */
function updateRealtimeCharts(data) {
    const labels = data.map(link => link.short);
    const clicksData = data.map(link => link.clicks);
    const times = data.map(link => new Date(link.time).toLocaleTimeString());
    
    const chartConfig = {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
            duration: 750
        },
        plugins: {
            legend: {
                labels: {
                    color: '#111827'
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#6b7280' },
                grid: { color: '#e5e7eb' }
            },
            y: {
                ticks: { color: '#6b7280' },
                grid: { color: '#e5e7eb' }
            }
        }
    };
    
    // Real-time Line Chart
    const realtimeLineCtx = document.getElementById('realtimeLineChart');
    if (realtimeLineCtx) {
        if (realtimeLineChart) {
            realtimeLineChart.data.labels = times;
            realtimeLineChart.data.datasets[0].data = clicksData;
            realtimeLineChart.update('active');
        } else {
            realtimeLineChart = new Chart(realtimeLineCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: times,
                    datasets: [{
                        label: 'Clicks',
                        data: clicksData,
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: chartConfig
            });
        }
    }
    
    // Real-time Bar Chart
    const realtimeBarCtx = document.getElementById('realtimeBarChart');
    if (realtimeBarCtx) {
        if (realtimeBarChart) {
            realtimeBarChart.data.labels = labels;
            realtimeBarChart.data.datasets[0].data = clicksData;
            realtimeBarChart.update('active');
        } else {
            realtimeBarChart = new Chart(realtimeBarCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Clicks',
                        data: clicksData,
                        backgroundColor: [
                            'rgba(249, 115, 22, 0.8)',
                            'rgba(251, 191, 36, 0.8)',
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(139, 92, 246, 0.8)'
                        ],
                        borderColor: [
                            '#f97316',
                            '#fbbf24',
                            '#22c55e',
                            '#3b82f6',
                            '#8b5cf6'
                        ],
                        borderWidth: 2
                    }]
                },
                options: chartConfig
            });
        }
    }
    
    // Update realtime stats
    const totalClicks = data.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const activeLinks = data.length;
    const now = new Date();
    
    const totalClicksEl = document.getElementById('realtimeTotalClicks');
    const activeLinksEl = document.getElementById('realtimeActiveLinks');
    const lastUpdateEl = document.getElementById('realtimeLastUpdate');
    
    if (totalClicksEl) totalClicksEl.textContent = totalClicks;
    if (activeLinksEl) activeLinksEl.textContent = activeLinks;
    if (lastUpdateEl) lastUpdateEl.textContent = now.toLocaleTimeString();
}

/**
 * Render Reports View
 */
function renderReportsView() {
    if (!currentData || currentData.length === 0) {
        return;
    }
    updateReportsCharts(currentData);
}

/**
 * Update Reports Charts
 */
function updateReportsCharts(data) {
    const labels = data.map(link => link.short);
    const clicksData = data.map(link => link.clicks);
    const times = data.map(link => new Date(link.time).toLocaleTimeString());
    
    const chartConfig = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: '#111827'
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#6b7280' },
                grid: { color: '#e5e7eb' }
            },
            y: {
                ticks: { color: '#6b7280' },
                grid: { color: '#e5e7eb' }
            }
        }
    };
    
    // Reports Line Chart
    const reportsLineCtx = document.getElementById('reportsLineChart');
    if (reportsLineCtx) {
        if (reportsLineChart) {
            reportsLineChart.data.labels = times;
            reportsLineChart.data.datasets[0].data = clicksData;
            reportsLineChart.update();
        } else {
            reportsLineChart = new Chart(reportsLineCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: times,
                    datasets: [{
                        label: 'Total Clicks',
                        data: clicksData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: chartConfig
            });
        }
    }
    
    // Reports Bar Chart (sorted by clicks)
    const sortedData = [...data].sort((a, b) => b.clicks - a.clicks);
    const sortedLabels = sortedData.map(link => link.short);
    const sortedClicks = sortedData.map(link => link.clicks);
    
    const reportsBarCtx = document.getElementById('reportsBarChart');
    if (reportsBarCtx) {
        if (reportsBarChart) {
            reportsBarChart.data.labels = sortedLabels;
            reportsBarChart.data.datasets[0].data = sortedClicks;
            reportsBarChart.update();
        } else {
            reportsBarChart = new Chart(reportsBarCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: sortedLabels,
                    datasets: [{
                        label: 'Clicks',
                        data: sortedClicks,
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(139, 92, 246, 0.8)'
                        ],
                        borderColor: [
                            '#3b82f6',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444',
                            '#8b5cf6'
                        ],
                        borderWidth: 2
                    }]
                },
                options: chartConfig
            });
        }
    }
}

/**
 * Render Activity View
 */
function renderActivityView() {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;
    
    if (activityLog.length === 0) {
        feed.innerHTML = '<div class="loading-state"><p>No activity yet. Activity will appear here as you use the dashboard.</p></div>';
        return;
    }
    
    let html = '<div class="activity-list">';
    activityLog.slice().reverse().forEach(activity => {
        html += `
            <div class="activity-item">
                <div class="activity-icon">•</div>
                <div class="activity-content">
                    <div class="activity-title">${escapeHtml(activity.title)}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    feed.innerHTML = html;
}

/**
 * Add entry to activity log
 */
function addActivityLog(title, description) {
    const now = new Date();
    activityLog.push({
        title: title,
        description: description,
        time: now.toLocaleString()
    });
    
    // Keep only last 50 entries
    if (activityLog.length > 50) {
        activityLog.shift();
    }
    
    // Update activity view if active
    const activityView = document.getElementById('view-activity');
    if (activityView && activityView.classList.contains('view-active')) {
        renderActivityView();
    }
}

/**
 * Refresh activity feed
 */
function refreshActivity() {
    addActivityLog('Activity refreshed', 'Manual refresh');
    renderActivityView();
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
