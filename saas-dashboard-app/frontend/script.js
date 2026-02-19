// ============= CONFIG & CONSTANTS =============

const API_BASE = 'http://localhost:5000/api';
const POLL_INTERVAL = 5000; // 5 seconds

let token = null;
let currentUser = null;
let dashboardData = null;
let pollInterval = null;
let socket = null;

// ============= AUTHENTICATION =============

function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('dashboardContainer').style.display = 'none';
}

function hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('dashboardContainer').style.display = 'flex';
}

function setupAuthTabs() {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-content').forEach(c => c.classList.remove('active'));

            // Add active to clicked tab
            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            document.getElementById(tabName + 'Form').classList.add('active');
        });
    });
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Login failed');
            return;
        }

        token = data.token;
        currentUser = data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(currentUser));

        hideAuthModal();
        setupDashboard();
        connectSocket();
        startPolling();
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Make sure backend is running on http://localhost:5000');
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Registration failed');
            return;
        }

        token = data.token;
        currentUser = data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(currentUser));

        hideAuthModal();
        setupDashboard();
        connectSocket();
        startPolling();
    } catch (error) {
        console.error('Register error:', error);
        alert('Registration failed. Make sure backend is running on http://localhost:5000');
    }
}

function handleLogout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (pollInterval) clearInterval(pollInterval);
    if (socket) socket.disconnect();

    showAuthModal();
}

function setupAuthButtons() {
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('registerBtn').addEventListener('click', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// ============= DASHBOARD SETUP =============

function setupDashboard() {
    const userName = currentUser?.name || 'User';
    document.getElementById('userName').textContent = userName;
    document.getElementById('userAvatar').src = currentUser?.avatar || 'https://i.pravatar.cc/150?img=5';
    document.getElementById('welcomeName').textContent = userName.split(' ')[0];

    updateWelcomeMessage();
}

function updateWelcomeMessage() {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
    if (hour >= 18) greeting = 'Good evening';
    document.getElementById('welcomeTime').textContent = `${greeting}! Here's your dashboard overview.`;
}

// ============= SOCKET.IO SETUP =============

function connectSocket() {
    socket = io('http://localhost:5000', {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
        forceNew: true
    });

    socket.on('connect', () => {
        console.log('✅ Socket connected');
        updateConnectionStatus(true);
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        updateConnectionStatus(false);
    });

    socket.on('user-count', (count) => {
        document.getElementById('userOnline').textContent = `${count} user${count !== 1 ? 's' : ''} online`;
    });

    socket.on('talk-added', (talk) => {
        console.log('📢 New talk:', talk);
        fetchDashboard(); // Refresh dashboard
    });

    socket.on('meeting-added', (meeting) => {
        console.log('📅 New meeting:', meeting);
        fetchDashboard();
    });

    socket.on('shoutout-added', (shoutout) => {
        console.log('⚡ New shoutout:', shoutout);
        fetchDashboard();
    });
}

function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connectionStatus');
    if (connected) {
        statusEl.classList.remove('offline');
        statusEl.textContent = '●';
    } else {
        statusEl.classList.add('offline');
        statusEl.textContent = '●';
    }
}

// ============= DATA FETCHING =============

async function fetchDashboard() {
    if (!token) {
        console.warn('⚠️ No token available');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.warn('🔐 Token expired or invalid');
                handleLogout();
                return;
            }
            if (response.status === 500) {
                throw new Error('Server error - check backend');
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.stats) {
            throw new Error('Invalid response format');
        }

        dashboardData = data;
        updateDashboard();
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
        console.log('✅ Dashboard updated at', new Date().toLocaleTimeString());
    } catch (error) {
        console.error('❌ Fetch dashboard error:', error.message);
    }
}

// ============= DASHBOARD UPDATE =============

function updateDashboard() {
    if (!dashboardData) return;

    const { stats, teamDistribution, upcomingTalks, meetings, shoutouts } = dashboardData;

    // Update stats
    document.getElementById('statTeams').textContent = stats.teams;
    document.getElementById('statUsers').textContent = stats.users;
    document.getElementById('statTalks').textContent = stats.talks;
    document.getElementById('statMeetings').textContent = stats.meetings;

    // Update chart
    updateTeamChart(teamDistribution);

    // Update activity lists
    updateTalksList(upcomingTalks);
    updateMeetingsList(meetings);
    updateShoutoutsList(shoutouts);
}

function updateTeamChart(data) {
    const ctx = document.getElementById('teamChart');
    if (!ctx) {
        console.error('Chart canvas not found');
        return;
    }

    // Validate data
    if (!data || !data.labels || !data.data || !data.colors) {
        console.error('Invalid chart data:', data);
        return;
    }

    try {
        // Destroy existing chart if it exists
        if (window.teamChartInstance) {
            window.teamChartInstance.destroy();
        }

        const chartCanvas = ctx.getContext('2d');
        window.teamChartInstance = new Chart(chartCanvas, {
            type: 'doughnut',
            data: {
                labels: data.labels || [],
                datasets: [{
                    data: data.data || [],
                    backgroundColor: data.colors || ['#6c63ff', '#ff6b6b', '#ffd93d', '#6bcf7f', '#ff9ff3'],
                    borderColor: '#1c1f26',
                    borderWidth: 3,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e6edf3',
                            font: { size: 12, weight: '600' },
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
        console.log('✅ Chart rendered successfully');
    } catch (error) {
        console.error('Chart rendering error:', error);
    }
}

function updateTalksList(talks) {
    const list = document.getElementById('talksList');
    if (!talks || talks.length === 0) {
        list.innerHTML = '<div class="activity-item"><p class="activity-title">No upcoming talks</p></div>';
        return;
    }

    list.innerHTML = talks.map(talk => `
        <div class="activity-item">
            <div class="activity-title">💬 ${talk.title}</div>
            <div class="activity-meta">
                <span>By ${talk.speaker}</span>
                <span>${formatDate(talk.date)}</span>
            </div>
        </div>
    `).join('');
}

function updateMeetingsList(meetings) {
    const list = document.getElementById('meetingsList');
    if (!meetings || meetings.length === 0) {
        list.innerHTML = '<div class="activity-item"><p class="activity-title">No upcoming meetings</p></div>';
        return;
    }

    list.innerHTML = meetings.map(meeting => `
        <div class="activity-item">
            <div class="activity-title">📅 ${meeting.title}</div>
            <div class="activity-meta">
                <span>${meeting.time}</span>
                <span>${meeting.duration}m</span>
                <span>${meeting.attendees} attendees</span>
            </div>
        </div>
    `).join('');
}

function updateShoutoutsList(shoutouts) {
    const list = document.getElementById('shoutoutsList');
    if (!shoutouts || shoutouts.length === 0) {
        list.innerHTML = '<div class="activity-item"><p class="activity-title">No shoutouts yet</p></div>';
        return;
    }

    list.innerHTML = shoutouts.map(shoutout => `
        <div class="activity-item">
            <div class="activity-emoji">${shoutout.emoji}</div>
            <div class="activity-message">${shoutout.message}</div>
            <div class="activity-author">— ${shoutout.author}</div>
        </div>
    `).join('');
}

// ============= POLLING =============

function startPolling() {
    fetchDashboard(); // Initial fetch

    pollInterval = setInterval(fetchDashboard, POLL_INTERVAL);
    console.log(`📊 Polling started (every ${POLL_INTERVAL / 1000}s)`);
}

// ============= UTILITY FUNCTIONS =============

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function checkAuth() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
        token = storedToken;
        currentUser = JSON.parse(storedUser);
        hideAuthModal();
        setupDashboard();
        connectSocket();
        startPolling();
    } else {
        showAuthModal();
    }
}

// ============= INITIALIZATION =============

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard initializing...');

    setupAuthTabs();
    setupAuthButtons();
    checkAuth();

    // Sidebar navigation active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    console.log('✨ Dashboard ready!');
});

// ============= EXTERNAL API EXAMPLE (POKEMON) =============

let pokemonIndex = 0;

async function fetchPokemonData() {
    try {
        pokemonIndex = (pokemonIndex % 150) + 1;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`);
        const data = await response.json();

        console.log(`🎮 Fetched Pokemon: ${data.name}`);

        // You could display this data in a card or update a stat with it
        // Example: Show Pokemon name and stat in a special card
    } catch (error) {
        console.error('Pokemon fetch error:', error);
    }
}

// Poll external API every 10 seconds (optional feature)
// setInterval(fetchPokemonData, 10000);

// ============= ERROR HANDLING =============

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
