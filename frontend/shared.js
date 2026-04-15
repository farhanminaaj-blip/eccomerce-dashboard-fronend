// ==================== SHARED FUNCTIONS FOR ALL PAGES ====================

// Configurable API base for frontend deployment (local fallback).
const API_BASE_URL = window.API_BASE_URL || (window.location.hostname.includes('localhost') ? 'http://localhost:5000' : 'https://eccomerce-dashboard-backend-1.onrender.com');
const API_AUTH_URL = `${API_BASE_URL}/api/auth`;
const API_FROM_URL = `${API_BASE_URL}/api/from`;

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Close All Modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// Settings Functions
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

// User Functions
function openSupport() {
    alert('📞 Support Team\n\nEmail: support@lumen.com\nPhone: +1-800-LUMEN-1\nChat: Available 24/7');
}

function openUserMenu() {
    alert('👤 User Profile\n\nName: Amina Akktar\nEmail: aminaakktar2003@gmail.com\nRole: Design Manager\nJoined: January 2024');
}

// Notifications
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

// Toast Notifications
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
        font-size: 14px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Set Active Navigation Item
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
}

// Initialize Event Listeners for all pages
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Page loaded successfully!');
    
    // Set active navigation item
    setActiveNav();
    
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

    // Animate elements on load
    animateElements();

    // Load saved preferences
    loadPreferences();
});

// Animate elements
function animateElements() {
    const elements = document.querySelectorAll('.card, .plan-card, .team-member, .document-item, .project-card');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Load preferences
function loadPreferences() {
    const preferences = localStorage.getItem('dashboardPreferences');
    if (preferences) {
        const data = JSON.parse(preferences);
        console.log('✅ Loaded preferences:', data);
        return data;
    }
    return null;
}

// Save preferences
function savePreferences() {
    const preferences = {
        theme: 'light',
        lastVisited: new Date(),
        autoRefresh: true,
        notifications: true
    };
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
}

// Utility function to format dates
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Data Storage (Local)
const appData = {
    projects: [
        { id: 1, name: 'Monday.com Redesign', status: 'In Progress', progress: 65, priority: 'High', team: 8 },
        { id: 2, name: 'Design System', status: 'In Progress', progress: 45, priority: 'High', team: 5 },
        { id: 3, name: 'Mobile App', status: 'Active', progress: 30, priority: 'Medium', team: 6 },
        { id: 4, name: 'API Development', status: 'Active', progress: 50, priority: 'High', team: 4 }
    ],

    events: [
        { id: 1, name: 'Team Meeting', date: '2025-01-20', time: '10:00', type: 'Meeting' },
        { id: 2, name: 'Project Review', date: '2025-01-22', time: '14:00', type: 'Meeting' },
        { id: 3, name: 'Design Deadline', date: '2025-01-25', time: '17:00', type: 'Deadline' }
    ],

    timeOffRequests: [
        { id: 1, type: 'Casual Leave', from: '2025-02-10', to: '2025-02-12', status: 'Pending' },
        { id: 2, type: 'Annual Leave', from: '2025-03-01', to: '2025-03-05', status: 'Approved' },
        { id: 3, type: 'Sick Leave', from: '2025-01-18', to: '2025-01-18', status: 'Approved' }
    ],

    teamMembers: [
        { id: 1, name: 'Laura Rodriguez', email: 'laura@lumen.com', role: 'Design Lead', department: 'Design', status: 'Active' },
        { id: 2, name: 'Arthur Garcia', email: 'arthur@lumen.com', role: 'Developer', department: 'Development', status: 'Active' },
        { id: 3, name: 'Sarah Johnson', email: 'sarah@lumen.com', role: 'PM', department: 'Management', status: 'Active' },
        { id: 4, name: 'Mike Smith', email: 'mike@lumen.com', role: 'Designer', department: 'Design', status: 'On Leave' },
        { id: 5, name: 'Emma Davis', email: 'emma@lumen.com', role: 'Developer', department: 'Development', status: 'Active' }
    ],

    documents: [
        { id: 1, name: 'Project Proposal.pdf', type: 'pdf', category: 'Proposals', size: '2.4 MB', shared: true, date: '2025-01-15' },
        { id: 2, name: 'Design System.figma', type: 'word', category: 'Designs', size: '15 MB', shared: true, date: '2025-01-14' },
        { id: 3, name: 'Annual Report 2024.docx', type: 'word', category: 'Reports', size: '3.2 MB', shared: false, date: '2025-01-10' },
        { id: 4, name: 'Meeting Notes.xlsx', type: 'sheets', category: 'Reports', size: '1.1 MB', shared: true, date: '2025-01-18' }
    ],

    integrations: {
        connected: [
            { id: 1, name: 'Google Meet', icon: '🎥', status: 'Connected', description: 'Video conferencing and collaboration' },
            { id: 2, name: 'Slack', icon: '💬', status: 'Connected', description: 'Team messaging and communication' },
            { id: 3, name: 'GitHub', icon: '🐙', status: 'Connected', description: 'Code repository and version control' }
        ],
        available: [
            { id: 4, name: 'Zoom', icon: '🎥', status: 'Available', description: 'Online meeting and webinar platform' },
            { id: 5, name: 'Microsoft Teams', icon: '👥', status: 'Available', description: 'Enterprise collaboration tool' },
            { id: 6, name: 'Trello', icon: '📋', status: 'Available', description: 'Project management and task tracking' },
            { id: 7, name: 'Asana', icon: '✅', status: 'Available', description: 'Work management platform' },
            { id: 8, name: 'Jira', icon: '🛠️', status: 'Available', description: 'Issue tracking and agile management' }
        ]
    },

    billing: [
        { id: 1, invoice: 'INV-2025-001', date: '2025-01-01', amount: 99, status: 'Paid' },
        { id: 2, invoice: 'INV-2024-012', date: '2024-12-01', amount: 99, status: 'Paid' },
        { id: 3, invoice: 'INV-2024-011', date: '2024-11-01', amount: 99, status: 'Paid' }
    ],

    getProjects() {
        return this.projects;
    },

    getEvents() {
        return this.events;
    },

    getTimeOffRequests() {
        return this.timeOffRequests;
    },

    getTeamMembers() {
        return this.teamMembers;
    },

    addTeamMember(newMember) {
        const member = {
            id: Math.max(...this.teamMembers.map(m => m.id || 0)) + 1,
            name: newMember.name,
            email: newMember.email,
            role: newMember.position || 'Team Member',
            position: newMember.position,
            phone_number: newMember.phone_number,
            password: newMember.password,
            department: 'General',
            status: 'Active'
        };
        this.teamMembers.push(member);
        localStorage.setItem('teamMembers', JSON.stringify(this.teamMembers));
        return member;
    },

    getDocuments() {
        return this.documents;
    },

    getIntegrations() {
        return this.integrations;
    },

    getBillingHistory() {
        return this.billing;
    }
};

console.log('📊 App data initialized:', appData);

// Add animations CSS if not already added
if (!document.querySelector('style[data-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animations', 'true');
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

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .btn-primary {
            padding: 10px 20px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            background-color: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .btn-secondary {
            padding: 10px 20px;
            background-color: #f0f2f5;
            color: #333;
            border: 1px solid #e0e4e8;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            background-color: #e0e4e8;
        }
    `;
    document.head.appendChild(style);
}
