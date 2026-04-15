// ==================== API CONFIGURATION ====================
// Automatically detects environment and returns correct API base URL

const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://eccomerce-dashboard-backend.onrender.com',
    
    // API Endpoints
    endpoints: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        users: '/api/from/users',
        teamMembers: '/api/from',
        admin: '/api/admin'
    },
    
    // Helper method to get full URL
    getUrl(endpoint) {
        return `${this.BASE_URL}${this.endpoints[endpoint] || endpoint}`;
    }
};

// Export for use in other modules
window.API_CONFIG = API_CONFIG;
