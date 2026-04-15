// ==================== DOCUMENTS PAGE FUNCTIONALITY ====================

let currentDocFilter = 'all';

// compute and display stats in the cards
function updateDocStats(docs) {
    const total = docs.length;
    let sizeBytes = 0;
    docs.forEach(doc => {
        const parts = (doc.size || '').split(' ');
        const v = parseFloat(parts[0]) || 0;
        const unit = (parts[1] || '').toLowerCase();
        if (unit.includes('gb')) sizeBytes += v * 1024 * 1024 * 1024;
        else if (unit.includes('mb')) sizeBytes += v * 1024 * 1024;
        else if (unit.includes('kb')) sizeBytes += v * 1024;
        else sizeBytes += v;
    });
    let displaySize = '0 B';
    if (sizeBytes > 1024 * 1024 * 1024) displaySize = (sizeBytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    else if (sizeBytes > 1024 * 1024) displaySize = (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB';
    else if (sizeBytes > 1024) displaySize = (sizeBytes / 1024).toFixed(1) + ' KB';
    else displaySize = sizeBytes + ' B';
    const sharedCount = docs.filter(d => d.shared).length;

    const totalEl = document.querySelector('.stats-card.total-docs .card-number');
    const sizeEl = document.querySelector('.stats-card.total-size .card-number');
    const sharedEl = document.querySelector('.stats-card.shared-with .card-number');
    if (totalEl) totalEl.textContent = total;
    if (sizeEl) sizeEl.textContent = displaySize;
    if (sharedEl) sharedEl.textContent = sharedCount;
}

document.addEventListener('DOMContentLoaded', () => {
    loadDocuments('all');
});

function loadDocuments(filter = 'all') {
    const docsGrid = document.getElementById('documents-grid');
    docsGrid.innerHTML = '';

    // always update stats based on full set (not filtered)
    const allDocs = appData.getDocuments();
    updateDocStats(allDocs);

    let documents = allDocs;
    if (filter !== 'all') {
        documents = documents.filter(doc => doc.type === filter);
    }

    documents.forEach((doc, index) => {
        const docCard = document.createElement('div');
        docCard.className = 'document-card';
        docCard.style.opacity = '0';
        docCard.style.transform = 'translateY(20px)';

        const icon = doc.type === 'pdf' ? '📄' : doc.type === 'word' ? '📝' : doc.type === 'sheets' ? '📊' : '🖼️';
        const date = new Date(doc.date).toLocaleDateString();

        docCard.innerHTML = `
            <div class="doc-header">
                <span class="doc-icon">${icon}</span>
                <div class="doc-name">
                    <h4>${doc.name}</h4>
                    <p>${doc.type.toUpperCase()}</p>
                </div>
            </div>
            <div class="doc-info">
                <p><strong>Size:</strong> ${doc.size}</p>
                <p><strong>Modified:</strong> ${date}</p>
                <p class="shared-status">${doc.shared ? '👥 Shared with 3 people' : '🔒 Private'}</p>
            </div>
            <div class="doc-actions">
                <button class="doc-btn" onclick="openDocument('${doc.name}')">📂 Open</button>
                <button class="doc-btn" onclick="shareDocument('${doc.name}')">🔗 Share</button>
                <button class="doc-btn delete-btn" onclick="deleteDocument(${doc.id})">🗑️ Delete</button>
            </div>
        `;

        docsGrid.appendChild(docCard);

        setTimeout(() => {
            docCard.style.transition = 'all 0.5s ease';
            docCard.style.opacity = '1';
            docCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function filterDocuments(evt, type) {
    currentDocFilter = type;
    
    // Update filter pills
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.classList.remove('active');
    });
    evt.currentTarget.classList.add('active');

    loadDocuments(type);
    showNotification(`Showing ${type === 'all' ? 'all' : type} documents`);
}

function uploadDocument() {
    const modal = document.getElementById('docModal');
    if (modal) {
        modal.classList.add('show');
        const form = document.getElementById('docForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            showNotification('✅ Document uploaded successfully!');
            modal.classList.remove('show');
            form.reset();
            loadDocuments(currentDocFilter);
        };
    }
}

function closeDocModal() {
    const modal = document.getElementById('docModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function openDocument(name) {
    showNotification(`📂 Opening ${name}...`);
}

function shareDocument(name) {
    alert(`🔗 Sharing dialog for: ${name}\n\nYou can enter email addresses to share this document.`);
}

function deleteDocument(id) {
    if (confirm('Are you sure you want to delete this document?')) {
        showNotification('✅ Document deleted');
        loadDocuments(currentDocFilter);
    }
}

// Add CSS for documents page
const style = document.createElement('style');
style.textContent = `
    .documents-container {
        animation: fadeIn 0.3s ease;
        margin-bottom: 24px;
    }

    /* stats cards reuse global styles, but tweak padding/radius for docs page */
    .documents-container .stats-card { border-radius:14px; padding:20px; }
    .documents-container .stats-card .card-icon { font-size:20px; }
    .documents-container .stats-card .card-number { font-size:30px; }

    /* filter pills */
    .documents-filter {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin: 24px 0;
    }
    .filter-pill {
        padding: 6px 14px;
        border-radius: 999px;
        border: 1px solid var(--border-color);
        background: var(--bg-white);
        font-size: 13px;
        cursor: pointer;
        transition: var(--transition);
    }
    .filter-pill.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    .filter-pill:hover {
        background: #f0f2f5;
    }

    /* document cards */
    .documents-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 24px;
    }
    .document-card {
        background: var(--bg-white);
        border: 1px solid var(--border-color);
        border-radius: 14px;
        padding: 20px;
        box-shadow: var(--shadow-sm);
        transition: var(--transition);
    }
    .document-card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md);
    }
    .doc-header {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 12px;
    }
    .doc-icon {
        font-size: 24px;
        min-width: 32px;
    }
    .doc-name h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: var(--text-dark);
        word-break: break-word;
    }
    .doc-name p {
        margin: 0;
        font-size: 13px;
        color: var(--text-muted);
        font-weight: 500;
        text-transform: uppercase;
    }
    .doc-info {
        font-size: 13px;
        color: var(--text-muted);
        margin-bottom: 12px;
    }
    .doc-info p { margin: 0 0 6px 0; }
    .shared-status { font-weight:600; color: var(--success); }

    .doc-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }
    .doc-btn {
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 13px;
        border: 1px solid var(--border-color);
        background: var(--bg-white);
        cursor: pointer;
        transition: var(--transition);
    }
    .doc-btn:hover { background: #f0f2f5; }
    .doc-btn.delete-btn {
        background: var(--danger);
        color: white;
        border-color: var(--danger);
    }
    .doc-btn.delete-btn:hover { background: #d32f2f; }

    @media (max-width: 768px) {
        .documents-grid { grid-template-columns: 1fr; }
    }
`;
document.head.appendChild(style);
