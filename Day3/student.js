let students = [];

function addStudent() {
    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let course = document.getElementById("course").value;

    if (name === "" || age === "" || course === "") {
        alert("Please fill all fields");
        return;
    }

    let student = {
        name: name,
        age: age,
        course: course
    };

    students.push(student);

    displayStudents();

    // Clear input fields
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("course").value = "";
}

function displayStudents() {
    let studentList = document.getElementById("studentList");

    studentList.innerHTML = "";

    students.forEach((student, index) => {
        studentList.innerHTML += `
            <div class="student-card">
                <p><strong>Name :</strong> ${student.name}</p>
                <p><strong>Age :</strong> ${student.age}</p>
                <p><strong>Course :</strong> ${student.course}</p>

                <button class="edit-btn" onclick="editStudent(${index})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteStudent(${index})">
                    Delete
                </button>
            </div>
        `;
    });
}

function editStudent(index) {
    let newName = prompt("Enter new name:", students[index].name);
    let newAge = prompt("Enter new age:", students[index].age);
    let newCourse = prompt("Enter new course:", students[index].course);

    if (newName && newAge && newCourse) {
        students[index].name = newName;
        students[index].age = newAge;
        students[index].course = newCourse;

        displayStudents();
    }
}

function deleteStudent(index) {
    students.splice(index, 1);
    displayStudents();
}