// ==================== BILLING PAGE FUNCTIONALITY ====================

let currentPlan = 'Pro';

document.addEventListener('DOMContentLoaded', () => {
    loadBillingPage();
});

function loadBillingPage() {
    loadPlans();
    loadBillingHistory();
    loadPaymentMethod();
}

function loadPlans() {
    const plansContainer = document.getElementById('plans-container');
    plansContainer.innerHTML = '';

    const plans = [
        {
            name: 'Starter',
            price: '$29',
            period: '/month',
            description: 'Perfect for individuals',
            features: ['5 projects', '500MB storage', 'Basic support', '1 user'],
            current: false
        },
        {
            name: 'Pro',
            price: '$99',
            period: '/month',
            description: 'Best for small teams',
            features: ['Unlimited projects', '50GB storage', 'Priority support', '5 users', 'Advanced analytics'],
            current: true
        },
        {
            name: 'Business',
            price: '$299',
            period: '/month',
            description: 'For growing teams',
            features: ['Unlimited everything', '500GB storage', '24/7 support', 'Unlimited users', 'Custom integrations', 'API access'],
            current: false
        }
    ];

    plans.forEach((plan, index) => {
        const planCard = document.createElement('div');
        planCard.className = `plan-card ${plan.current ? 'current-plan' : ''}`;
        planCard.style.opacity = '0';
        planCard.style.transform = 'translateY(20px)';

        let featuresList = plan.features.map(f => `<li>✓ ${f}</li>`).join('');

        planCard.innerHTML = `
            <div class="plan-header">
                <h3>${plan.name}</h3>
                <p class="plan-description">${plan.description}</p>
            </div>
            <div class="plan-pricing">
                <span class="price">${plan.price}</span>
                <span class="period">${plan.period}</span>
            </div>
            <ul class="plan-features">
                ${featuresList}
            </ul>
            <div class="plan-action">
                ${plan.current ? 
                    '<button class="plan-btn current">Current Plan</button>' :
                    `<button class="plan-btn" onclick="upgradePlan('${plan.name}', '${plan.price}')">Upgrade</button>`
                }
            </div>
        `;

        plansContainer.appendChild(planCard);

        setTimeout(() => {
            planCard.style.transition = 'all 0.5s ease';
            planCard.style.opacity = '1';
            planCard.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function loadBillingHistory() {
    const historyContainer = document.getElementById('billing-history');
    historyContainer.innerHTML = '';

    const history = appData.getBillingHistory();

    const tableHtml = `
        <table class="billing-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${history.map(item => `
                    <tr class="billing-row">
                        <td>${new Date(item.date).toLocaleDateString()}</td>
                        <td>Pro Plan - Monthly Invoice ${item.invoice}</td>
                        <td>$${item.amount}</td>
                        <td><span class="status-badge paid">${item.status}</span></td>
                        <td><button class="action-btn" onclick="downloadInvoice('${item.invoice}')">📄 Invoice</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    historyContainer.innerHTML = tableHtml;
}

function loadPaymentMethod() {
    const paymentContainer = document.getElementById('payment-method');
    
    paymentContainer.innerHTML = `
        <div class="payment-card">
            <div class="card-icon">💳</div>
            <div class="card-details">
                <p>Visa ending in <strong>4242</strong></p>
                <p class="card-exp">Expires: 12/26</p>
            </div>
            <button class="edit-payment-btn" onclick="editPaymentMethod()">Edit</button>
        </div>
    `;
}

function upgradePlan(planName, price) {
    const modal = document.getElementById('upgradePlanModal');
    if (modal) {
        document.getElementById('selectedPlan').textContent = `${planName} - ${price}/month`;
        modal.classList.add('show');

        const form = document.getElementById('upgradePlanForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            currentPlan = planName;
            showNotification(`✅ Successfully upgraded to ${planName} plan!`);
            modal.classList.remove('show');
            form.reset();
            loadPlans();
        };
    }
}

function editPaymentMethod() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.add('show');
        const form = document.getElementById('paymentForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            showNotification('✅ Payment method updated!');
            modal.classList.remove('show');
            form.reset();
            loadPaymentMethod();
        };
    }
}

function downloadInvoice(id) {
    showNotification(`📥 Downloading invoice ${id}...`);
}

function closeUpgradePlanModal() {
    const modal = document.getElementById('upgradePlanModal');
    if (modal) modal.classList.remove('show');
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.classList.remove('show');
}

// Add CSS for billing page
const style = document.createElement('style');
style.textContent = `
    .billing-container {
        animation: fadeIn 0.3s ease;
    }

    .billing-section {
        margin-bottom: 50px;
    }

    .billing-section h2 {
        color: #333;
        margin-bottom: 25px;
        font-size: 20px;
    }

    .plans-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
    }

    .plan-card {
        background: white;
        border: 2px solid #e0e4e8;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
        position: relative;
    }

    .plan-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }

    .plan-card.current-plan {
        border-color: #4caf50;
        background: #f9fdf8;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.15);
    }

    .plan-card.current-plan::before {
        content: '✓ Current Plan';
        position: absolute;
        top: -12px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
    }

    .plan-header {
        margin-bottom: 20px;
    }

    .plan-header h3 {
        margin: 0 0 8px 0;
        color: #333;
        font-size: 18px;
    }

    .plan-description {
        margin: 0;
        color: #999;
        font-size: 13px;
    }

    .plan-pricing {
        margin-bottom: 20px;
    }

    .price {
        font-size: 36px;
        font-weight: 700;
        color: #4caf50;
    }

    .period {
        color: #999;
        font-size: 13px;
    }

    .plan-features {
        list-style: none;
        margin: 0 0 20px 0;
        padding: 0;
    }

    .plan-features li {
        padding: 10px 0;
        color: #666;
        font-size: 13px;
        border-bottom: 1px solid #f0f2f5;
    }

    .plan-features li:last-child {
        border-bottom: none;
    }

    .plan-action {
        margin-top: 20px;
    }

    .plan-btn {
        width: 100%;
        padding: 12px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .plan-btn:hover {
        background-color: #45a049;
    }

    .plan-btn.current {
        background-color: #e0e4e8;
        color: #666;
        cursor: default;
    }

    .billing-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .billing-table thead {
        background-color: #f5f7fa;
        border-bottom: 2px solid #e0e4e8;
    }

    .billing-table th {
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: #333;
        font-size: 13px;
    }

    .billing-table td {
        padding: 15px;
        border-bottom: 1px solid #f0f2f5;
        color: #666;
        font-size: 13px;
    }

    .billing-row:hover {
        background-color: #fafbfc;
    }

    .status-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
    }

    .status-badge.paid {
        background-color: #e8f5e9;
        color: #4caf50;
    }

    .action-btn {
        background-color: #f0f2f5;
        border: 1px solid #e0e4e8;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    .action-btn:hover {
        background-color: #4caf50;
        color: white;
        border-color: #4caf50;
    }

    .payment-method {
        background: white;
        border-radius: 8px;
        padding: 25px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .payment-card {
        display: flex;
        align-items: center;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        color: white;
        gap: 20px;
        margin-bottom: 20px;
    }

    .card-icon {
        font-size: 36px;
    }

    .card-details {
        flex: 1;
    }

    .card-details p {
        margin: 5px 0;
        font-size: 14px;
    }

    .card-exp {
        font-size: 12px;
        opacity: 0.8;
    }

    .edit-payment-btn {
        padding: 8px 16px;
        background-color: white;
        color: #667eea;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    .edit-payment-btn:hover {
        background-color: #f0f2f5;
    }

    @media (max-width: 768px) {
        .plans-container {
            grid-template-columns: 1fr;
        }

        .billing-table {
            font-size: 12px;
        }

        .billing-table th,
        .billing-table td {
            padding: 10px;
        }

        .payment-card {
            flex-direction: column;
            text-align: center;
        }
    }
`;
document.head.appendChild(style);
