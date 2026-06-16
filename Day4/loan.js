// DOM Elements
const loanForm = document.getElementById('loanForm');
const applicantType = document.getElementById('applicantType');
const marksGroup = document.getElementById('marksGroup');
const incomeGroup = document.getElementById('incomeGroup');
const recordsBody = document.getElementById('recordsBody');
const noRecords = document.getElementById('noRecords');

// Store all applications
let applications = [];

// Show/hide conditional fields based on applicant type
applicantType.addEventListener('change', function () {
    // Hide both first
    marksGroup.classList.remove('active');
    incomeGroup.classList.remove('active');

    // Clear values when switching
    document.getElementById('marks').value = '';
    document.getElementById('income').value = '';

    if (this.value === 'Student') {
        marksGroup.classList.add('active');
    } else if (this.value === 'Employee') {
        incomeGroup.classList.add('active');
    }
});

// Handle form submission
loanForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const type = applicantType.value;
    const loanAmount = document.getElementById('loanAmount').value;

    // Validation
    if (!name || !type || !loanAmount) {
        alert('Please fill in all required fields.');
        return;
    }

    let marks = '-';
    let income = '-';
    let status = '';

    // Loan approval logic
    if (type === 'Student') {
        const studentMarks = parseFloat(document.getElementById('marks').value);
        if (isNaN(studentMarks) || studentMarks < 0 || studentMarks > 100) {
            alert('Please enter valid marks (0-100).');
            return;
        }
        marks = studentMarks;
        status = studentMarks >= 80 ? 'Approved' : 'Rejected';
    } else if (type === 'Employee') {
        const employeeIncome = parseFloat(document.getElementById('income').value);
        if (isNaN(employeeIncome) || employeeIncome < 0) {
            alert('Please enter a valid income.');
            return;
        }
        income = employeeIncome;
        status = employeeIncome >= 50000 ? 'Approved' : 'Rejected';
    }

    // Create application object
    const application = {
        name: name,
        type: type,
        marks: marks,
        income: income,
        loanAmount: parseFloat(loanAmount),
        status: status
    };

    // Add to array
    applications.push(application);

    // Update the table
    renderTable();

    // Reset form
    loanForm.reset();
    marksGroup.classList.remove('active');
    incomeGroup.classList.remove('active');
});

// Render the table with all applications
function renderTable() {
    recordsBody.innerHTML = '';
    noRecords.style.display = applications.length === 0 ? 'block' : 'none';

    applications.forEach(function (app, index) {
        const row = document.createElement('tr');

        const statusClass = app.status === 'Approved' ? 'status-approved' : 'status-rejected';

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${app.name}</td>
            <td>${app.type}</td>
            <td>${app.marks}</td>
            <td>${app.income !== '-' ? '₹' + app.income.toLocaleString() : '-'}</td>
            <td>₹${app.loanAmount.toLocaleString()}</td>
            <td><span class="${statusClass}">${app.status}</span></td>
        `;

        recordsBody.appendChild(row);
    });
}
