// ==================== TIME OFF PAGE FUNCTIONALITY ====================

let timeoffFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    loadTimeOffRequests('all');
});

function loadTimeOffRequests(filter) {
    timeoffFilter = filter;
    const requestsList = document.getElementById('requests-list');
    requestsList.innerHTML = '';

    let requests = appData.getTimeOffRequests();

    if (filter !== 'all') {
        requests = requests.filter(r => r.status.toLowerCase() === filter);
    }

    requests.forEach((request, index) => {
        const requestEl = document.createElement('div');
        requestEl.className = `request-card ${request.status.toLowerCase()}`;
        requestEl.style.opacity = '0';
        requestEl.style.transform = 'translateY(10px)';
        
        requestEl.innerHTML = `
            <div class="request-top">
                <div class="request-type">${request.type}</div>
                <span class="request-badge ${request.status.toLowerCase()}">${request.status}</span>
            </div>
            <div class="request-dates">📅 ${formatDate(request.from)} – ${formatDate(request.to)}</div>
            <div class="request-actions">
                <button class="view" onclick="viewTimeoffRequest(${request.id})">View</button>
                <button class="edit" onclick="editTimeoffRequest(${request.id})">Edit</button>
                <button class="delete" onclick="deleteTimeoffRequest(${request.id})">Delete</button>
            </div>
        `;
        
        requestsList.appendChild(requestEl);

        setTimeout(() => {
            requestEl.style.transition = 'all 0.3s ease';
            requestEl.style.opacity = '1';
            requestEl.style.transform = 'translateY(0)';
        }, index * 100);
    });

    if (requests.length === 0) {
        requestsList.innerHTML = '<p class="no-requests">No requests found</p>';
    }
}

function filterTimeOff(evt, type) {
    const buttons = document.querySelectorAll('.filter-buttons .filter-pill');
    buttons.forEach(btn => btn.classList.remove('active'));
    evt.currentTarget.classList.add('active');
    loadTimeOffRequests(type);
}

function requestTimeOff() {
    const modal = document.getElementById('timeoffModal');
    if (modal) {
        modal.classList.add('show');
        const form = document.getElementById('timeoffForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            showNotification('✅ Time off request submitted!');
            modal.classList.remove('show');
            form.reset();
            loadTimeOffRequests(timeoffFilter);
        };
    }
}

function closeTimeoffModal() {
    const modal = document.getElementById('timeoffModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function viewTimeoffRequest(id) {
    alert(`📋 Viewing time off request ${id}...`);
}

function editTimeoffRequest(id) {
    alert(`✏️ Editing time off request ${id}...`);
}

function deleteTimeoffRequest(id) {
    if (confirm('Are you sure you want to delete this request?')) {
        showNotification('✅ Request deleted!');
        loadTimeOffRequests(timeoffFilter);
    }
}


