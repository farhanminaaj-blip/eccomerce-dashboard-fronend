// ==================== PROJECTS PAGE FUNCTIONALITY ====================

let filteredProjects = 'all';

document.addEventListener('DOMContentLoaded', () => {
    loadProjects('all');
});

function loadProjects(filter) {
    filteredProjects = filter;
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';

    let projects = appData.getProjects();

    if (filter !== 'all') {
        projects = projects.filter(p => p.status.toLowerCase() === filter || p.priority.toLowerCase() === filter);
    }

    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'translateY(20px)';

        projectCard.innerHTML = `
            <div class="project-header">
                <h3>${project.name}</h3>
                <span class="priority-badge ${project.priority.toLowerCase()}">${project.priority}</span>
            </div>
            <div class="project-status">
                <span class="status-badge">${project.status}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress}%"></div>
            </div>
            <p class="progress-text">${project.progress}% Complete</p>
            <div class="project-meta">
                <span>👥 ${project.team} Team Members</span>
                <span>📅 In Progress</span>
            </div>
            <div class="project-actions">
                <button class="action-btn" onclick="viewProject(${project.id})">View Details</button>
                <button class="action-btn" onclick="editProject(${project.id})">Edit</button>
            </div>
        `;

        projectsGrid.appendChild(projectCard);

        setTimeout(() => {
            projectCard.style.transition = 'all 0.5s ease';
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0)';
        }, index * 100);
    });

    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No projects found</p>';
    }
}

function filterProjects(type) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadProjects(type);
}

function addNewProject() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.add('show');
        const form = document.getElementById('projectForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            showNotification('✅ Project created successfully!');
            modal.classList.remove('show');
            form.reset();
            loadProjects(filteredProjects);
        };
    }
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function viewProject(id) {
    alert(`📁 Viewing project ${id}...`);
}

function editProject(id) {
    alert(`✏️ Editing project ${id}...`);
}

// Add CSS for project cards
const style = document.createElement('style');
style.textContent = `
    .projects-container {
        animation: fadeIn 0.3s ease;
    }

    .filter-section {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        flex-wrap: wrap;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }

    .project-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        border: 1px solid #f0f2f5;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
    }

    .project-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transform: translateY(-4px);
    }

    .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
    }

    .project-header h3 {
        margin: 0;
        color: #333;
        font-size: 16px;
    }

    .priority-badge {
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .priority-badge.high {
        background-color: #ffebee;
        color: #f44336;
    }

    .priority-badge.medium {
        background-color: #fff3e0;
        color: #ff9800;
    }

    .priority-badge.low {
        background-color: #e8f5e9;
        color: #4caf50;
    }

    .project-status {
        margin-bottom: 12px;
    }

    .status-badge {
        display: inline-block;
        padding: 4px 10px;
        background-color: #e3f2fd;
        color: #2196f3;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background-color: #f0f2f5;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4caf50, #45a049);
    }

    .progress-text {
        font-size: 12px;
        color: #999;
        margin: 8px 0;
    }

    .project-meta {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: #666;
        margin: 15px 0;
        padding: 12px 0;
        border-top: 1px solid #f0f2f5;
        border-bottom: 1px solid #f0f2f5;
    }

    .project-actions {
        display: flex;
        gap: 10px;
        margin-top: 12px;
    }

    .action-btn {
        flex: 1;
        padding: 8px 12px;
        background-color: #f0f2f5;
        border: 1px solid #e0e4e8;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    .action-btn:hover {
        background-color: #e0e4e8;
    }

    @media (max-width: 768px) {
        .projects-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);
