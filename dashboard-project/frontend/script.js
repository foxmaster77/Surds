// =====================
// Global Variables
// =====================

let token = null;
let currentUser = null;
let allLinks = [];
let lineChart = null;
let barChart = null;
let teamChart = null;
const API_URL = 'http://localhost:5000/api';

// =====================
// DOM Elements
// =====================

const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const linksContainer = document.getElementById('linksContainer');
const addLinkBtn = document.getElementById('addLinkBtn');
const addLinkModal = document.getElementById('addLinkModal');
const addLinkForm = document.getElementById('addLinkForm');
const closeModalBtn = document.querySelector('.close');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.querySelector('.search-input');
const tabBtns = document.querySelectorAll('.tab-btn');
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const userEmail = document.getElementById('userEmail');
const sidebarUserEmail = document.getElementById('sidebarUserEmail');
const userFirstName = document.getElementById('userFirstName');

// =====================
// Authentication
// =====================

// Tab switching
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    
    tabBtns.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(`${tabName}Form`).classList.add('active');
  });
});

// Register
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputs = registerForm.querySelectorAll('input');
  const email = inputs[0].value;
  const password = inputs[1].value;
  const confirmPassword = inputs[2].value;
  const errorEl = document.getElementById('registerError');

  if (password !== confirmPassword) {
    errorEl.textContent = 'Passwords do not match';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.message || 'Registration failed';
      return;
    }

    token = data.token;
    currentUser = data.user;
    localStorage.setItem('token', token);
    showDashboard();
  } catch (error) {
    errorEl.textContent = 'Error: ' + error.message;
  }
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputs = loginForm.querySelectorAll('input');
  const email = inputs[0].value;
  const password = inputs[1].value;
  const errorEl = document.getElementById('loginError');

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.message || 'Login failed';
      return;
    }

    token = data.token;
    currentUser = data.user;
    localStorage.setItem('token', token);
    showDashboard();
  } catch (error) {
    errorEl.textContent = 'Error: ' + error.message;
  }
});

// =====================
// Dashboard Functions
// =====================

function showDashboard() {
  loginPage.classList.add('hidden');
  dashboardPage.classList.remove('hidden');
  
  // Extract first name from email
  const firstName = currentUser.email.split('@')[0];
  userFirstName.textContent = firstName;
  sidebarUserEmail.textContent = currentUser.email;
  
  if (userEmail) {
    userEmail.textContent = currentUser.email;
  }
  
  const settingsEmail = document.getElementById('settingsEmail');
  if (settingsEmail) {
    settingsEmail.textContent = currentUser.email;
  }
  
  // Initialize dashboard
  initTeamChart();
  fetchLinks();
}

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('token');
  loginPage.classList.remove('hidden');
  dashboardPage.classList.add('hidden');
  loginForm.reset();
  registerForm.reset();
}

// =====================
// Links Management
// =====================

async function fetchLinks() {
  try {
    const response = await fetch(`${API_URL}/links`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error fetching links');
      return;
    }

    allLinks = data.data;
    displayLinks(allLinks);
    updateCharts();
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayLinks(links) {
  if (links.length === 0) {
    linksContainer.innerHTML = '<p class="loading">No links yet. Create one to get started!</p>';
    return;
  }

  linksContainer.innerHTML = links.map(link => `
    <div class="link-item">
      <div class="link-info">
        <h3>${link.short}</h3>
        <p>${link.url}</p>
        <p style="color: var(--text-secondary); font-size: 0.85em;">${link.time}</p>
      </div>
      <div class="click-badge">${link.clicks} clicks</div>
      <div class="link-actions">
        <button class="btn-delete" onclick="deleteLink('${link._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

addLinkBtn.addEventListener('click', () => {
  addLinkModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  addLinkModal.classList.add('hidden');
});

addLinkModal.addEventListener('click', (e) => {
  if (e.target === addLinkModal) {
    addLinkModal.classList.add('hidden');
  }
});

addLinkForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const shortInput = document.getElementById('shortInput');
  const urlInput = document.getElementById('urlInput');
  const errorEl = document.getElementById('addLinkError');

  try {
    const response = await fetch(`${API_URL}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        short: shortInput.value,
        url: urlInput.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.message || 'Error creating link';
      return;
    }

    addLinkModal.classList.add('hidden');
    addLinkForm.reset();
    fetchLinks();
  } catch (error) {
    errorEl.textContent = 'Error: ' + error.message;
  }
});

async function deleteLink(linkId) {
  if (!confirm('Are you sure you want to delete this link?')) return;

  try {
    const response = await fetch(`${API_URL}/links/${linkId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      alert('Error deleting link');
      return;
    }

    fetchLinks();
  } catch (error) {
    console.error('Error:', error);
    alert('Error deleting link');
  }
}

// =====================
// Search Functionality
// =====================

searchInput.addEventListener('keyup', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = allLinks.filter(link =>
    link.short.toLowerCase().includes(searchTerm) ||
    link.url.toLowerCase().includes(searchTerm)
  );
  displayLinks(filtered);
});

// =====================
// Charts
// =====================

function initTeamChart() {
  const teamCtx = document.getElementById('teamChart');
  if (!teamCtx) return;
  
  if (teamChart) {
    teamChart.destroy();
  }
  
  teamChart = new Chart(teamCtx, {
    type: 'doughnut',
    data: {
      labels: ['Green dove', 'Blue owl', 'Yellow peacock', 'Red eagle'],
      datasets: [{
        data: [10, 20, 7, 8],
        backgroundColor: ['#4caf50', '#2196f3', '#ffc107', '#f44336'],
        borderColor: ['white', 'white', 'white', 'white'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function updateCharts() {
  if (allLinks.length === 0) return;

  const linkNames = allLinks.map(link => link.short);
  const clickNumbers = allLinks.map(link => link.clicks);

  // Line Chart
  const lineCtx = document.getElementById('lineChart');
  if (lineChart) {
    lineChart.destroy();
  }
  lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: linkNames,
      datasets: [{
        label: 'Clicks',
        data: clickNumbers,
        borderColor: '#c9a154',
        backgroundColor: 'rgba(201, 161, 84, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#666666' },
          grid: { color: '#e0e0e0' }
        },
        y: {
          ticks: { color: '#666666' },
          grid: { color: '#e0e0e0' }
        }
      }
    }
  });

  // Bar Chart
  const barCtx = document.getElementById('barChart');
  if (barChart) {
    barChart.destroy();
  }
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: linkNames,
      datasets: [{
        label: 'Clicks',
        data: clickNumbers,
        backgroundColor: '#c9a154'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#666666' },
          grid: { color: '#e0e0e0' }
        },
        y: {
          ticks: { color: '#666666' },
          grid: { color: '#e0e0e0' }
        }
      }
    }
  });
}

// =====================
// Navigation
// =====================

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    const section = item.getAttribute('data-section');
    contentSections.forEach(sec => sec.classList.remove('active'));
    
    // Handle sections with different naming conventions
    let targetId = section + 'Section';
    if (section === 'manage-teams') {
      targetId = 'manage-teamsSection';
    }
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  });
});

// =====================
// Logout
// =====================

logoutBtn.addEventListener('click', logout);

// =====================
// Initialize
// =====================

window.addEventListener('load', () => {
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    token = savedToken;
    // You might want to verify token validity here
    // For now, just redirect to dashboard
    currentUser = { email: 'user@example.com' };
    showDashboard();
  }
});
