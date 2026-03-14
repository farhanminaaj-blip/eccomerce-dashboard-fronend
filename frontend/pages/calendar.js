// ==================== CALENDAR PAGE FUNCTIONALITY ====================

let calendarMonth = new Date().getMonth();
let calendarYear = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
    generateCalendarPage();
    loadEvents();
});

function generateCalendarPage() {
    const today = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('calendar-month').textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

    const calendarDates = document.getElementById('calendar-dates');
    calendarDates.innerHTML = '';

    // Previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        const btn = document.createElement('button');
        btn.className = 'date-btn other-month';
        btn.textContent = daysInPrevMonth - i;
        btn.disabled = true;
        calendarDates.appendChild(btn);
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
        const btn = document.createElement('button');
        btn.className = 'date-btn';
        btn.textContent = day;

        if (day === today.getDate() && calendarMonth === today.getMonth() && calendarYear === today.getFullYear()) {
            btn.classList.add('today');
        }

        btn.addEventListener('click', () => selectDatePage(btn, day));
        calendarDates.appendChild(btn);
    }

    // Next month
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

function selectDatePage(btn, day) {
    const allDates = document.querySelectorAll('.date-btn');
    allDates.forEach(date => {
        if (!date.classList.contains('today')) {
            date.classList.remove('selected');
        }
    });

    if (!btn.classList.contains('today')) {
        btn.classList.add('selected');
    }
}

function prevMonth() {
    calendarMonth--;
    if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
    }
    generateCalendarPage();
}

function nextMonth() {
    calendarMonth++;
    if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
    }
    generateCalendarPage();
}

function loadEvents() {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';

    const events = appData.getEvents();
    events.forEach((event, index) => {
        const eventEl = document.createElement('div');
        eventEl.className = 'event-item';
        eventEl.style.opacity = '0';
        eventEl.style.transform = 'translateY(10px)';
        
        eventEl.innerHTML = `
            <div class="event-icon">${event.type === 'Meeting' ? '📞' : '⏰'}</div>
            <div class="event-content">
                <h4>${event.name}</h4>
                <p>${formatDate(event.date)} at ${event.time}</p>
            </div>
            <button class="event-action" onclick="editEvent(${event.id})">Edit</button>
        `;
        
        eventsList.appendChild(eventEl);

        setTimeout(() => {
            eventEl.style.transition = 'all 0.3s ease';
            eventEl.style.opacity = '1';
            eventEl.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function addNewEvent() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.add('show');
        const form = document.getElementById('eventForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            showNotification('✅ Event added successfully!');
            modal.classList.remove('show');
            form.reset();
            loadEvents();
        };
    }
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function editEvent(id) {
    alert(`✏️ Editing event ${id}...`);
}

// Add CSS for calendar page
const style = document.createElement('style');
style.textContent = `
    .calendar-section {
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 30px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .calendar-grid {
        margin-bottom: 20px;
    }

    .weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
        margin-bottom: 10px;
        text-align: center;
    }

    .weekdays span {
        font-weight: 600;
        color: #999;
        font-size: 12px;
        padding: 8px 0;
    }

    .dates {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
    }

    .date-btn {
        padding: 12px;
        border: 1px solid #e0e4e8;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
    }

    .date-btn:hover:not(:disabled) {
        border-color: #4caf50;
        background-color: #f0f2f5;
    }

    .date-btn.today {
        background-color: #4caf50;
        color: white;
        border-color: #4caf50;
        font-weight: 600;
    }

    .date-btn.selected {
        background-color: #e8f5e9;
        border-color: #4caf50;
    }

    .date-btn.other-month {
        color: #ccc;
    }

    .date-btn:disabled {
        cursor: not-allowed;
    }

    .events-section {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .events-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .event-item {
        padding: 15px;
        background-color: #f5f7fa;
        border-left: 4px solid #4caf50;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.3s ease;
    }

    .event-item:hover {
        background-color: #e8f5e9;
    }

    .event-icon {
        font-size: 20px;
    }

    .event-content {
        flex: 1;
    }

    .event-content h4 {
        margin: 0;
        color: #333;
        font-size: 14px;
    }

    .event-content p {
        margin: 4px 0 0 0;
        color: #999;
        font-size: 12px;
    }

    .event-action {
        padding: 6px 12px;
        background-color: white;
        border: 1px solid #e0e4e8;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    .event-action:hover {
        background-color: #f0f2f5;
    }
`;
document.head.appendChild(style);
