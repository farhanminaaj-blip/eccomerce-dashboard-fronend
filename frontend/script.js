// ==================== GLOBAL STATE ====================
const dashboardState = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDate: new Date().getDate(),
    timeOffUsed: 5,
    totalDays: 20,
    notifications: 3
};

// ==================== AUTH CHECK ====================
function requireLogin() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('🚨 No login token found; redirecting to login.');
        window.location.href = 'login.html';
        return false;
    }
    console.log('✅ Logged in with token', token.slice(0, 20) + '...');
    return true;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    if (!requireLogin()) return;
    console.log('🚀 Dashboard initialized successfully!');
    
    // Initialize components
    generateCalendar();
    initializeEventListeners();
    updateTimeOffProgress(dashboardState.timeOffUsed, dashboardState.totalDays);
    updateStatusTracker();
    loadDashboardPreferences();
    
    // Animations
    animateCards();
    
    // Set up auto-refresh
    setUpAutoRefresh();
});

// ==================== CALENDAR FUNCTIONALITY ====================
function generateCalendar() {
    const today = new Date();
    const year = dashboardState.currentYear;
    const month = dashboardState.currentMonth;
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Update month display
    const monthElement = document.getElementById('current-month');
    if (monthElement) {
        monthElement.textContent = `${monthNames[month]} ${year}`;
    }

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarDates = document.getElementById('calendar-dates');
    calendarDates.innerHTML = '';

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const btn = document.createElement('button');
        btn.className = 'date-btn other-month';
        btn.textContent = daysInPrevMonth - i;
        btn.disabled = true;
        calendarDates.appendChild(btn);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const btn = document.createElement('button');
        btn.className = 'date-btn';
        btn.textContent = day;

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            btn.classList.add('today');
        }

        btn.addEventListener('click', () => selectDate(btn, day));
        calendarDates.appendChild(btn);
    }

    // Next month days
    const totalCells = calendarDates.children.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const btn = document.createElement('button');
        btn.className = 'date-btn other-month';
        btn.textContent = day;
        btn.disabled = true;
        calendarDates.appendChild(btn);
    }
}

function selectDate(btn, day) {
    const allDates = document.querySelectorAll('.date-btn');
    allDates.forEach(date => {
        if (!date.classList.contains('today')) {
            date.classList.remove('selected');
        }
    });

    if (!btn.classList.contains('today')) {
        btn.classList.add('selected');
    }
    
    dashboardState.selectedDate = day;
    console.log(`📅 Selected date: ${day}`);
}

// ==================== CALENDAR NAVIGATION ====================
function handleNavigation(direction) {
    if (direction === 'next') {
        dashboardState.currentMonth++;
        if (dashboardState.currentMonth > 11) {
            dashboardState.currentMonth = 0;
            dashboardState.currentYear++;
        }
    } else {
        dashboardState.currentMonth--;
        if (dashboardState.currentMonth < 0) {
            dashboardState.currentMonth = 11;
            dashboardState.currentYear--;
        }
    }

    generateCalendar();
}

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    // Calendar navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const direction = btn.textContent.includes('▶') ? 'next' : 'prev';
            handleNavigation(direction);
        });
    });

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterScheduleItems(btn.textContent.toLowerCase());
        });
    });

    // Sidebar navigation
     const navItems = document.querySelectorAll('.nav-item');
     navItems.forEach(item=>{
        item.addEventListener('click',(e)=>{
            //let it navigate
            // the active class will be shared.js on page loaded
        });
     });  


    // Search functionality
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 0) {
                console.log(`🔍 Searching for: ${searchTerm}`);
            }
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const searchBar = document.querySelector('.search-bar');
            if (searchBar) searchBar.focus();
        }
    });
}

// ==================== MODAL FUNCTIONS ====================
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function saveSettings() {
    const checkboxes = document.querySelectorAll('.settings-form input[type="checkbox"]');
    const settings = {};
    checkboxes.forEach((cb, index) => {
        settings[`setting${index}`] = cb.checked;
    });
    
    localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    showNotification('✅ Settings saved successfully!');
    closeSettings();
}

function openSupport() {
    alert('📞 Support Team\n\nEmail: support@lumen.com\nPhone: +1-800-LUMEN-1\nChat: Available 24/7');
}

function openUserMenu() {
    alert('👤 User Profile\n\nName: Amine Akita\nEmail: aminaakktar2003@gmail.com\nRole: Design Manager\nJoined: January 2024');
}

function toggleNotifications() {
    const modal = document.getElementById('notificationsModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeNotifications() {
    const modal = document.getElementById('notificationsModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function createNewRequest() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.classList.add('show');
        const form = modal.querySelector('.create-form');
        if (form) {
            form.addEventListener('submit', handleCreateRequest);
        }
    }
}

function closeCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function handleCreateRequest(e) {
    e.preventDefault();
    
    const request = {
        title: e.target.elements[0].value,
        description: e.target.elements[1].value,
        project: e.target.elements[2].value,
        priority: e.target.elements[3].value,
        createdAt: new Date()
    };
    
    console.log('📋 New request created:', request);
    showNotification('✅ Request created successfully!');
    closeCreateModal();
    e.target.reset();
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// ==================== MEETING FUNCTIONS ====================
function joinMeeting(platform) {
    const urls = {
        google: 'https://meet.google.com',
        zoom: 'https://zoom.us'
    };
    
    alert(`🎥 Joining ${platform.toUpperCase()} meeting...\n\nIn a real app, this would open: ${urls[platform]}`);
    console.log(`📞 Joining ${platform} meeting...`);
}
        btn.textContent = day;
        btn.disabled = true;
        calendarDates.appendChild(btn);
    


function selectDate(btn, day) {
    // Remove previous selection
    const allDates = document.querySelectorAll('.date-btn');
    allDates.forEach(date => {
        if (!date.classList.contains('today')) {
            date.classList.remove('selected');
        }
    });

    // Add selection to clicked date
    if (!btn.classList.contains('today')) {
        btn.classList.add('selected');
    }
}

// ==================== NAVIGATION ====================
function handleNavigation(direction) {
    const monthElement = document.getElementById('current-month');
    const [monthName, year] = monthElement.textContent.split(' ');

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let currentMonth = monthNames.indexOf(monthName);
    let currentYear = parseInt(year);

    if (direction === 'next') {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    } else {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
    }

    monthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    generateCalendarForMonth(currentMonth, currentYear);
}

function generateCalendarForMonth(month, year) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarDates = document.getElementById('calendar-dates');
    calendarDates.innerHTML = '';

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const btn = document.createElement('button');
        btn.className = 'date-btn other-month';
        btn.textContent = daysInPrevMonth - i;
        btn.disabled = true;
        calendarDates.appendChild(btn);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const btn = document.createElement('button');
        btn.className = 'date-btn';
        btn.textContent = day;

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            btn.classList.add('today');
        }

        btn.addEventListener('click', () => selectDate(btn, day));
        calendarDates.appendChild(btn);
    }

    // Next month days
    const totalCells = calendarDates.children.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const btn = document.createElement('button');
        btn.className = 'date-btn other-month';
        btn.textContent = day;
        btn.disabled = true;
        calendarDates.appendChild(btn);
    }
}

// ==================== FILTER FUNCTIONALITY ====================
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Here you can add logic to filter schedule items
            const filterType = btn.textContent.toLowerCase();
            filterScheduleItems(filterType);
        });
    });
}

function filterScheduleItems(type) {
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach(item => {
        // Example filtering logic
        item.style.display = 'block';
    });
}

// ==================== SIDEBAR NAVIGATION ====================
function initializeSidebarNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// ==================== TIME OFF FUNCTIONALITY ====================
function updateTimeOffProgress(usedDays = 0, totalDays = 20) {
    const percentage = (usedDays / totalDays) * 100;
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = `${Math.round(percentage)}% is your time off used`;
    }
}

// ==================== STATUS TRACKER ====================
function updateStatusTracker() {
    const statuses = ['Available', 'In Meeting', 'Busy', 'Away'];
    const statusBadges = document.querySelectorAll('.status-badge');
    
    if (statusBadges.length > 0) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        statusBadges.forEach(badge => {
            badge.textContent = randomStatus;
        });
    }
}

// ==================== SIDEBAR TOGGLE ====================
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// ==================== FILTER SCHEDULE ====================
function filterScheduleItems(type) {
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach(item => {
        item.style.display = 'block';
    });
    console.log(`🔎 Filtering schedule by: ${type}`);
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ==================== ANIMATION FUNCTIONS ====================
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ==================== LOCAL STORAGE ====================
function saveDashboardPreferences() {
    const preferences = {
        theme: 'light',
        lastVisited: new Date(),
        autoRefresh: true,
        notifications: true
    };
    
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
}

function loadDashboardPreferences() {
    const preferences = localStorage.getItem('dashboardPreferences');
    if (preferences) {
        const data = JSON.parse(preferences);
        console.log('✅ Loaded preferences:', data);
        return data;
    }
    return null;
}

// ==================== AUTO REFRESH ====================
function setUpAutoRefresh() {
    setInterval(() => {
        generateCalendar();
        updateTimeOffProgress(dashboardState.timeOffUsed, dashboardState.totalDays);
        updateStatusTracker();
    }, 5 * 60 * 1000); // Every 5 minutes
}

// ==================== PERFORMANCE MONITORING ====================
function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page Load Time: ${pageLoadTime}ms`);
    }
}

window.addEventListener('load', logPerformanceMetrics);

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (event) => {
    console.error('❌ Error:', event.error);
});

// ==================== ADD ANIMATIONS TO CSS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4caf50, #45a049);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }
`;
document.head.appendChild(style);

// ==================== DATA MANAGEMENT ====================
const dashboardData = {
    projects: [
        { id: 1, name: 'Monday.com Redesign', status: 'In Progress', progress: 0 },
        { id: 2, name: 'Design System Delivery', status: 'Upcoming', progress: 0 }
    ],
    
    meetings: [
        { id: 1, title: 'Meeting with James Browns', time: '8:30 - 3:45 am', date: '5/7/22', platform: 'google' },
        { id: 2, title: 'Meeting with Laura Perez', time: '8:30 - 3:45 am', date: '5/7/22', platform: 'zoom' },
        { id: 3, title: 'Meeting with Artha Perez', time: '10:30 - 11:45 am', date: '5/7/22', platform: 'zoom' }
    ],

    getProjects() {
        return this.projects;
    },

    getMeetings() {
        return this.meetings;
    }
};

console.log('📊 Dashboard initialized with full functionality!');
console.log('📊 Dashboard Data:', dashboardData);
