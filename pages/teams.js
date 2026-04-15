// ==================== TEAMS PAGE FUNCTIONALITY ====================

document.addEventListener('DOMContentLoaded', () => {
    loadTeamMembers();
    // Setup form submission AFTER scripts load
    setTimeout(() => {
        setupMemberForm();
    }, 100);
});

async function loadTeamMembers() {
    const teamGrid = document.getElementById('team-members');
    teamGrid.innerHTML = '<p style="text-align: center; padding: 20px;">Loading team members...</p>';

    try {
        console.log("📡 Fetching team members from MongoDB (users collection)...");
        
        const API_URL = window.location.hostname === 'localhost' 
            ? 'http://localhost:5000' 
            : 'https://eccomerce-dashboard-backend.onrender.com';
        
        // Fetch from MongoDB users collection via public API
        const res = await fetch(`${API_URL}/api/from/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!res.ok) {
            console.warn(`⚠️ Could not fetch from API (status: ${res.status})`);
            const members = appData.getTeamMembers();
            updateOverviewStats(members);
            loadTeamMembersFromArray(members, teamGrid);
            return;
        }
        
        const responseData = await res.json();
        console.log("✅ Team members fetched:", responseData);
        
        let members = responseData.users || [];
        
        // Fallback to local appData if no members in database
        if (members.length === 0) {
            console.log("⚠️ No members in MongoDB, using local data");
            members = appData.getTeamMembers();
        }
        
        // update stats cards
        updateOverviewStats(members);
        
        teamGrid.innerHTML = '';
        
        members.forEach((member, index) => {
            const memberCard = document.createElement('div');
            memberCard.className = 'team-member-card';
            memberCard.style.opacity = '0';
            memberCard.style.transform = 'translateY(20px)';
            
// keep status color only for legacy ; badges handle coloring
        const role = member.position || member.role || 'Team Member';
        const dept = member.department || member.email || 'N/A';
            const name = member.username || member.name || 'Unknown';
            
            memberCard.innerHTML = `
                <div class="member-avatar">👤</div>
                <div class="member-info">
                    <h4>${name}</h4>
                    <p class="member-role">${role}</p>
                    <p class="member-dept">${dept}</p>
                </div>
                <div class="member-status">
                    <span class="status-badge ${(member.status||'active').toLowerCase().replace(' ', '-')}">${member.status || 'Active'}</span>
                </div>
                <div class="member-actions">
                    <button class="btn-outline" onclick="viewMember(${member._id || member.id || index})">View</button>
                    <button class="btn-primary" onclick="messageMember('${name}')">Message</button>
                </div>
            `;
            
            teamGrid.appendChild(memberCard);

            setTimeout(() => {
                memberCard.style.transition = 'all 0.5s ease';
                memberCard.style.opacity = '1';
                memberCard.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
    } catch (error) {
        console.error("❌ Error loading team members:", error);
        teamGrid.innerHTML = `<p style="text-align: center; color: red; padding: 20px;">Error loading team members: ${error.message}</p>`;
        
        // Fallback: show local data
        setTimeout(() => {
            const members = appData.getTeamMembers();
            loadTeamMembersFromArray(members, teamGrid);
        }, 2000);
    }
}

function loadTeamMembersFromArray(members, teamGrid) {
    teamGrid.innerHTML = '';
    updateOverviewStats(members);
    
    members.forEach((member, index) => {
        const memberCard = document.createElement('div');
        memberCard.className = 'team-member-card';
        memberCard.style.opacity = '0';
        memberCard.style.transform = 'translateY(20px)';
        
        const role = member.role || member.position || 'Team Member';
        const dept = member.department || member.email || 'N/A';
        const name = member.username || member.name || 'Unknown';
        
        memberCard.innerHTML = `
            <div class="member-avatar">👤</div>
            <div class="member-info">
                <h4>${name}</h4>
                <p class="member-role">${role}</p>
                <p class="member-dept">${dept}</p>
            </div>
            <div class="member-status">
                <span class="status-badge ${(member.status||'active').toLowerCase().replace(' ', '-')}">${member.status || 'Active'}</span>
            </div>
            <div class="member-actions">
                <button class="btn-outline" onclick="viewMember(${member.id || index})">View</button>
                <button class="btn-primary" onclick="messageMember('${name}')">Message</button>
            </div>
        `;
        
        teamGrid.appendChild(memberCard);

        setTimeout(() => {
            memberCard.style.transition = 'all 0.5s ease';
            memberCard.style.opacity = '1';
            memberCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function setupMemberForm() {
    console.log("📋 Setting up member form...");
    const form = document.getElementById('memberForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("📤 Form submitted! Calling sendData()...");
            await sendData();
        });
        console.log("✅ Form event listener attached");
    } else {
        console.error("❌ memberForm element not found!");
    }
    
    // Expose to window for testing
    window.sendDataManually = sendData;
    window.loadTeamMembersManually = loadTeamMembers;
}

async function sendData(){
    const name = document.getElementById("username").value.trim();
    const position = document.getElementById("position").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone_number = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log('📝 Form Values:', {name, position, email, phone_number, password});

    // Validation
    if (!name || !position || !email || !phone_number || !password) {
        alert("❌ All fields are required!");
        console.error("❌ Validation failed");
        return;
    }

    if (email.length < 5 || !email.includes("@")) {
        alert("❌ Please enter a valid email!");
        return;
    }

    if (phone_number.length < 10) {
        alert("❌ Phone number must be at least 10 digits!");
        return;
    }

    try{
        // 1. Show loading notification
        showNotification("⏳ Saving to database...");
        
        // 2. Send to MongoDB via register endpoint (saves to User model)
        console.log("2️⃣ Sending to server: http://localhost:5000/api/auth/register");
        
        const requestBody = {
            username: name,
            name: name,
            position: position,
            email: email,
            phone_number: phone_number,
            password: password
        };
        
        console.log("📤 Request body:", JSON.stringify(requestBody));
        
        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log("3️⃣ Response received");
        console.log("📊 Response status:", res.status);
        console.log("📊 Response statusText:", res.statusText);
        
        // Read response as text first
        const responseText = await res.text();
        console.log("📥 Raw response text:", responseText.substring(0, 200));
        
        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(responseText);
            console.log("✅ Parsed JSON response:", data);
        } catch (parseError) {
            console.error("❌ Failed to parse response as JSON");
            console.error("Parse error:", parseError.message);
            throw new Error(`Server returned invalid JSON. Status: ${res.status}`);
        }
        
        // Check if response is OK
        if (!res.ok) {
            console.error("❌ Server returned error status:", res.status);
            throw new Error(data.message || `Server error: ${res.status}`);
        }
        
        // 4. Success - update UI
        console.log("4️⃣ Success! Updating UI...");
        showNotification("✅ Team member added successfully!");
        
        // Also add to local appData
        appData.addTeamMember({name, position, email, phone_number, password});
        
        // Reset form
        document.getElementById("memberForm").reset();
        
        // Close modal
        document.getElementById("memberModal").style.display = "none";
        
        // Reload cards from MongoDB
        await loadTeamMembers();
        
        console.log("✅ All done!");
        
    } catch (err){
        console.error("❌ REQUEST FAILED!");
        console.error("Error:", err);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        
        showNotification("❌ Error: " + err.message);
    }
}

function addTeamMember() {
    const modal = document.getElementById('memberModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

// helper to populate overview cards
function updateOverviewStats(members) {
    const total = members.length;
    const active = members.filter(m => (m.status||'').toLowerCase() === 'active').length;
    const onLeave = members.filter(m => (m.status||'').toLowerCase() === 'on leave').length;
    const offline = members.filter(m => (m.status||'').toLowerCase() === 'offline').length;

    document.querySelector('.stats-card.total-members .card-number').textContent = total;
    document.querySelector('.stats-card.active-today .card-number').textContent = active;
    document.querySelector('.stats-card.on-leave .card-number').textContent = onLeave;
    document.querySelector('.stats-card.offline .card-number').textContent = offline;
}

function closeMemberModal() {
    const modal = document.getElementById('memberModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

function viewMember(id) {
    alert(`👤 Viewing team member ${id}...`);
}

function messageMember(name) {
    alert(`💬 Opening chat with ${name}...`);
}

// Add CSS for teams page
const style = document.createElement('style');
style.textContent = `
    .teams-container {
        animation: fadeIn 0.3s ease;
    }

    /* overview statistics use global stats-grid/card styles */
    .teams-container .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
    }
    /* override card colours by status class if needed */
    .teams-container .stats-card .card-icon { font-size: 24px; }
    .teams-container .stats-card.total-members .card-icon { color: var(--primary-color); }
    .teams-container .stats-card.active-today .card-icon { color: var(--success); }
    .teams-container .stats-card.on-leave .card-icon { color: #ff9800; }
    .teams-container .stats-card.offline .card-icon { color: var(--text-muted); }
    .teams-container .stats-card .card-number { font-size:32px; }

    /* legacy selectors removed */

    .team-members-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 24px;
    }

    .team-member-card {
        background: var(--bg-white);
        border-radius: 16px;
        padding: 20px;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-sm);
        transition: var(--transition);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .team-member-card:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-5px);
    }

    .member-avatar {
        width: 60px;
        height: 60px;
        background: var(--bg-light);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        margin: 0 auto;
        box-shadow: var(--shadow-sm);
    }

    .member-info {
        margin-bottom: 0;
    }

    .member-info h4 {
        margin: 0;
        color: var(--text-dark);
        font-size: 16px;
        font-weight: 700;
    }

    .member-role {
        margin: 0;
        color: var(--text-muted);
        font-size: 14px;
    }

    .member-dept {
        margin: 0;
        color: var(--text-muted);
        font-size: 13px;
    }

    .member-status {
        margin: 0 auto;
    }

    .status-badge {
        display: inline-block;
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 8px;
        font-weight: 600;
        text-transform: uppercase;
    }
    .status-badge.active { background: var(--success); color: white; }
    .status-badge.on-leave { background: #ff9800; color: white; }
    .status-badge.offline { background: #ccc; color: #666; }

    .member-actions {
        display: flex;
        gap: 12px;
    }

    .btn-outline {
        flex: 1;
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 13px;
        border: 1px solid var(--border-color);
        background: white;
        cursor: pointer;
        transition: var(--transition);
    }
    .btn-outline:hover {
        background: #f0f2f5;
    }

    .btn-primary {
        flex: 1;
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 13px;
        border: none;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        transition: var(--transition);
    }
    .btn-primary:hover {
        background: var(--primary-dark);
    }

    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .team-members-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);
