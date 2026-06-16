let employees = JSON.parse(localStorage.getItem("employees")) || [];
let editId = null;
let deleteId = null;
let sortField = null;
let sortDir = "asc";

function saveToStorage() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

function showToast(message, type) {
    let container = document.getElementById("toastContainer");
    let toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

function updateStats() {
    document.getElementById("totalCount").textContent = employees.length;

    if (employees.length > 0) {
        let total = employees.reduce((sum, e) => sum + Number(e.salary), 0);
        let avg = Math.round(total / employees.length);
        document.getElementById("avgSalary").textContent = "₹" + avg.toLocaleString();
    } else {
        document.getElementById("avgSalary").textContent = "₹0";
    }

    let depts = new Set(employees.map((e) => e.department));
    document.getElementById("deptCount").textContent = depts.size;
}

function validateForm() {
    let valid = true;
    let name = document.getElementById("empName").value.trim();
    let age = document.getElementById("empAge").value.trim();
    let dept = document.getElementById("empDepartment").value;
    let salary = document.getElementById("empSalary").value.trim();

    document.getElementById("nameError").textContent = "";
    document.getElementById("ageError").textContent = "";
    document.getElementById("deptError").textContent = "";
    document.getElementById("salaryError").textContent = "";

    if (!name) {
        document.getElementById("nameError").textContent = "Name is required";
        valid = false;
    } else if (name.length < 2) {
        document.getElementById("nameError").textContent = "Min 2 characters";
        valid = false;
    }

    if (!age) {
        document.getElementById("ageError").textContent = "Age is required";
        valid = false;
    } else if (age < 18 || age > 65) {
        document.getElementById("ageError").textContent = "Age must be 18-65";
        valid = false;
    }

    if (!dept) {
        document.getElementById("deptError").textContent = "Select a department";
        valid = false;
    }

    if (!salary) {
        document.getElementById("salaryError").textContent = "Salary is required";
        valid = false;
    } else if (salary < 1000) {
        document.getElementById("salaryError").textContent = "Min salary is ₹1000";
        valid = false;
    }

    return valid;
}

function clearForm() {
    document.getElementById("empName").value = "";
    document.getElementById("empAge").value = "";
    document.getElementById("empDepartment").value = "";
    document.getElementById("empSalary").value = "";
    document.getElementById("nameError").textContent = "";
    document.getElementById("ageError").textContent = "";
    document.getElementById("deptError").textContent = "";
    document.getElementById("salaryError").textContent = "";
}

function addEmployee() {
    if (!validateForm()) return;

    let name = document.getElementById("empName").value.trim();
    let age = document.getElementById("empAge").value.trim();
    let department = document.getElementById("empDepartment").value;
    let salary = document.getElementById("empSalary").value.trim();

    if (editId !== null) {
        let index = employees.findIndex((e) => e.id === editId);
        if (index !== -1) {
            employees[index].name = name;
            employees[index].age = age;
            employees[index].department = department;
            employees[index].salary = salary;
        }
        editId = null;
        document.querySelector(".form-section button").textContent = "Add Employee";
        showToast("Employee updated successfully", "success");
    } else {
        let newId = employees.length > 0 ? employees[employees.length - 1].id + 1 : 1;
        employees.push({
            id: newId,
            name: name,
            age: age,
            department: department,
            salary: salary,
        });
        showToast("Employee added successfully", "success");
    }

    saveToStorage();
    renderTable(employees);
    updateStats();
    clearForm();
}

function editEmployee(id) {
    let emp = employees.find((e) => e.id === id);
    if (!emp) return;

    document.getElementById("empName").value = emp.name;
    document.getElementById("empAge").value = emp.age;
    document.getElementById("empDepartment").value = emp.department;
    document.getElementById("empSalary").value = emp.salary;

    editId = id;
    document.querySelector(".form-section button").textContent = "Update Employee";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteEmployee(id) {
    deleteId = id;
    let emp = employees.find((e) => e.id === id);
    document.getElementById("modalText").textContent =
        'Are you sure you want to delete "' + emp.name + '"?';
    document.getElementById("deleteModal").classList.add("active");
}

function closeModal() {
    deleteId = null;
    document.getElementById("deleteModal").classList.remove("active");
}

function confirmDelete() {
    if (deleteId === null) return;
    employees = employees.filter((e) => e.id !== deleteId);
    saveToStorage();
    renderTable(employees);
    updateStats();
    closeModal();
    showToast("Employee deleted", "error");
}

function searchEmployee() {
    let query = document.getElementById("search").value.toLowerCase();
    let filtered = employees.filter((emp) => {
        return (
            emp.name.toLowerCase().includes(query) ||
            emp.department.toLowerCase().includes(query) ||
            String(emp.id).includes(query) ||
            String(emp.age).includes(query)
        );
    });
    renderTable(filtered);
}

function sortTable(field) {
    if (sortField === field) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
    } else {
        sortField = field;
        sortDir = "asc";
    }

    employees.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (field === "id" || field === "age" || field === "salary") {
            valA = Number(valA);
            valB = Number(valB);
        } else {
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
        }

        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

    document.querySelectorAll(".sort-icon").forEach((el) => (el.textContent = ""));
    let arrow = sortDir === "asc" ? "▲" : "▼";
    document.getElementById("sort-" + field).textContent = arrow;

    saveToStorage();
    renderTable(employees);
}

function exportCSV() {
    if (employees.length === 0) {
        showToast("No data to export", "info");
        return;
    }

    let headers = ["ID", "Name", "Age", "Department", "Salary"];
    let rows = employees.map((e) => [e.id, e.name, e.age, e.department, e.salary]);
    let csv = headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully", "success");
}

function renderTable(data) {
    let tbody = document.getElementById("employeeTable");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">📋</div><p>No employees found</p></div></td></tr>';
        return;
    }

    data.forEach((emp) => {
        let row = document.createElement("tr");
        let deptClass = "dept-" + emp.department;
        row.innerHTML =
            "<td>" + emp.id + "</td>" +
            "<td>" + emp.name + "</td>" +
            "<td>" + emp.age + "</td>" +
            '<td><span class="dept-badge ' + deptClass + '">' + emp.department + "</span></td>" +
            "<td>₹" + Number(emp.salary).toLocaleString() + "</td>" +
            "<td>" +
            '<button class="action-btn edit-btn" onclick="editEmployee(' + emp.id + ')">Edit</button>' +
            '<button class="action-btn delete-btn" onclick="deleteEmployee(' + emp.id + ')">Delete</button>' +
            "</td>";
        tbody.appendChild(row);
    });
}

renderTable(employees);
updateStats();
