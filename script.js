const studentForm = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");

const studentCourse = document.getElementById("studentCourse");

const studentMarks = document.getElementById("studentMarks");

const studentTableBody = document.getElementById("studentTableBody");

const searchInput = document.getElementById("searchInput");

const courseFilter = document.getElementById("courseFilter");

const sortMarks = document.getElementById("sortMarks");
const cancelEdit = document.getElementById("cancelEdit");

const students = JSON.parse(localStorage.getItem("students")) || [];
let editingStudent = null;
const totalStudents = document.getElementById("totalStudents");
const averageMarks = document.getElementById("averageMarks");

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = studentName.value.trim();
  const course = studentCourse.value;
  const marks = Number(studentMarks.value);

  if (name === "") {
    alert("Please enter a student name.");
    return;
  }

  if (course === "") {
    alert("Please select a course.");
    return;
  }

  if (studentMarks.value === "" || marks < 0 || marks > 100) {
    alert("Please enter marks between 0 and 100.");
    return;
  }

  if (editingStudent !== null) {
    editingStudent.name = name;
    editingStudent.course = course;
    editingStudent.marks = marks;
    editingStudent = null;
  } else {
    const student = {
      name: name,
      course: course,
      marks: marks,
    };

    students.push(student);
  }

  localStorage.setItem("students", JSON.stringify(students));

  studentForm.reset();
  studentForm.querySelector('button[type="submit"]').textContent =
    "Add Student";
  cancelEdit.hidden = true;

  renderStudents();
});

function renderStudents() {
  studentTableBody.innerHTML = "";

  totalStudents.textContent = students.length;

  const totalMarks = students.reduce(function (sum, student) {
    return sum + student.marks;
  }, 0);

  const average =
    students.length > 0 ? (totalMarks / students.length).toFixed(2) : 0;

  averageMarks.textContent = average;

  const searchText = searchInput.value.toLowerCase();

  const selectedCourse = courseFilter.value;
  const sortOrder = sortMarks.value;

  const filteredStudents = students.filter(function (student) {
    const matchesName = student.name.toLowerCase().includes(searchText);
    const matchesCourse =
      selectedCourse === "" || student.course === selectedCourse;

    return matchesName && matchesCourse;
  });
  if (sortOrder === "highToLow") {
    filteredStudents.sort(function (a, b) {
      return b.marks - a.marks;
    });
  } else if (sortOrder === "lowToHigh") {
    filteredStudents.sort(function (a, b) {
      return a.marks - b.marks;
    });
  }
  filteredStudents.forEach(function (student) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = student.name;

    const courseCell = document.createElement("td");
    courseCell.textContent = student.course;

    const marksCell = document.createElement("td");
    marksCell.textContent = student.marks;

    const resultCell = document.createElement("td");
    resultCell.textContent = student.marks >= 40 ? "Pass" : "Fail";

    const actionsCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function () {
      editingStudent = student;

      studentName.value = student.name;
      studentCourse.value = student.course;
      studentMarks.value = student.marks;

      studentForm.querySelector('button[type="submit"]').textContent =
        "Update Student";
      cancelEdit.hidden = false;
    });

    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      students.splice(students.indexOf(student), 1);
      localStorage.setItem("students", JSON.stringify(students));
      renderStudents();
    });

    actionsCell.appendChild(deleteButton);
    row.append(nameCell, courseCell, marksCell, resultCell, actionsCell);
    studentTableBody.appendChild(row);
  });
}

searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);
sortMarks.addEventListener("change", renderStudents);
renderStudents();

cancelEdit.addEventListener("click", function () {
  editingStudent = null;
  studentForm.reset();

  studentForm.querySelector('button[type="submit"]').textContent =
    "Add Student";
  cancelEdit.hidden = true;
});
