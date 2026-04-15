// ==================== INTEGRATIONS PAGE FUNCTIONALITY ====================

document.addEventListener('DOMContentLoaded', () => {
    loadIntegrations();
});

function loadIntegrations() {
    const connectedContainer = document.getElementById('connected-integrations');
    const availableContainer = document.getElementById('available-integrations');

    connectedContainer.innerHTML = '';
    availableContainer.innerHTML = '';

    const integrationsData = appData.getIntegrations();
    const connected = integrationsData.connected || [];
    const available = integrationsData.available || [];

    // Load connected integrations
    connected.forEach((integration, index) => {
        const card = createIntegrationCard(integration, true, index);
        connectedContainer.appendChild(card);
    });

    // Load available integrations
    available.forEach((integration, index) => {
        const card = createIntegrationCard(integration, false, index + connected.length);
        availableContainer.appendChild(card);
    });
}

function createIntegrationCard(integration, isConnected, index) {
    const card = document.createElement('div');
    card.className = 'integration-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    const description = integration.description || 'Integration service';

    card.innerHTML = `
        <div class="integration-icon">${integration.icon}</div>
        <h4>${integration.name}</h4>
        <p>${description}</p>
        <div class="integration-footer">
            <span class="status-badge ${isConnected ? 'connected' : 'available'}">
                ${isConnected ? '✓ Connected' : '⊕ Available'}
            </span>
            ${isConnected ? 
                `<button class="integration-btn disconnect" onclick="disconnectIntegration('${integration.name}')">Disconnect</button>` :
                `<button class="integration-btn connect" onclick="connectIntegration('${integration.name}')">Connect</button>`
            }
        </div>
    `;

    setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, index * 100);

    return card;
}

function connectIntegration(name) {
    const modal = document.getElementById('integrationModal');
    if (modal) {
        document.getElementById('integrationName').value = name;
        modal.classList.add('show');
        
        const form = document.getElementById('integrationForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            showNotification(`✅ ${name} connected successfully!`);
            modal.classList.remove('show');
            form.reset();
            loadIntegrations();
        };
    }
}

function disconnectIntegration(name) {
    if (confirm(`Are you sure you want to disconnect ${name}?`)) {
        showNotification(`✅ ${name} disconnected`);
        loadIntegrations();
    }
}

function closeIntegrationModal() {
    const modal = document.getElementById('integrationModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Add CSS for integrations page
const style = document.createElement('style');
style.textContent = `
    .integrations-container {
        animation: fadeIn 0.3s ease;
    }

    .integration-section {
        margin-bottom: 50px;
    }

    .integration-section h2 {
        color: #333;
        margin-bottom: 25px;
        padding-bottom: 10px;
        border-bottom: 2px solid #4caf50;
        display: inline-block;
    }

    .integrations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }

    .integration-card {
        background: white;
        border: 2px solid #f0f2f5;
        border-radius: 12px;
        padding: 25px;
        text-align: center;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .integration-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transform: translateY(-4px);
        border-color: #4caf50;
    }

    .integration-icon {
        font-size: 48px;
        margin-bottom: 15px;
    }

    .integration-card h4 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 16px;
    }

    .integration-card p {
        margin: 0 0 20px 0;
        color: #666;
        font-size: 13px;
        line-height: 1.4;
    }

    .integration-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
    }

    .status-badge.connected {
        background-color: #e8f5e9;
        color: #4caf50;
    }

    .status-badge.available {
        background-color: #f3e5f5;
        color: #9c27b0;
    }

    .integration-btn {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 12px;
        transition: all 0.2s ease;
    }

    .integration-btn.connect {
        background-color: #4caf50;
        color: white;
    }

    .integration-btn.connect:hover {
        background-color: #45a049;
    }

    .integration-btn.disconnect {
        background-color: #f44336;
        color: white;
    }

    .integration-btn.disconnect:hover {
        background-color: #da190b;
    }

    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #999;
    }

    .empty-state p {
        margin: 0;
        font-size: 14px;
    }

    @media (max-width: 768px) {
        .integrations-grid {
            grid-template-columns: 1fr;
        }

        .integration-footer {
            flex-direction: column;
        }

        .integration-btn {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);
