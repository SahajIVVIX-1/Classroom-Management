let students = [];
let assignments = [];
let announcements = [];
let finaldata;
document.addEventListener("DOMContentLoaded", function () {
  const postAnnouncementBtn = document.getElementById("post-announcement-btn");
  const announcementInput = document.getElementById("announcement-input");
  const announcementDeadline = document.getElementById("announcement-deadline");
  const announcementDisplay = document.getElementById("announcement-display");

  const addStudentBtn = document.querySelector(
    ".add-btn[onclick='openStudentForm()']"
  );
  const studentForm = document.getElementById("studentForm");
  const studentNameInput = document.getElementById("student-name");
  const studentClassInput = document.getElementById("student-class");

  const assignmentForm = document.getElementById("assignmentForm");
  const addAssignmentBtn = document.querySelector(
    ".add-btn[onclick='openAssignmentForm()']"
  );

  // Announcements
  postAnnouncementBtn.addEventListener("click", async function () {
    const announcementText = announcementInput.value.trim();
    const deadlineDate = announcementDeadline.value;

    if (announcementText === "" || !deadlineDate) {
      alert("Please provide both an announcement text and a deadline date.");
      return;
    }

    const response = await (
      await fetch("http://localhost:8000/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: deadlineDate,
          announce: announcementText,
          class_id: finaldata._id,
        }),
      })
    ).json();

    // Format the date to DD/MM/YYYY format
    const deadlineFormatted = new Date(deadlineDate).toLocaleDateString();

    // Create the announcement card
    const announcementCard = document.createElement("div");
    announcementCard.className = "announcement-card";
    announcementCard.innerHTML = `
            <div class="announcement-text-container">
                <p class="announcement-text">${announcementText}</p>
                <p class="announcement-deadline">Deadline: ${deadlineFormatted}</p>
            </div>
            <button class="delete-announcement-btn">
                <img src="https://img.icons8.com/ios-glyphs/30/000000/trash.png" alt="Delete">
            </button>
        `;

    // Add delete functionality
    announcementCard
      .querySelector(".delete-announcement-btn")
      .addEventListener("click", function () {
        announcementCard.remove();
        updateAnnouncementCount(); // Update count
      });

    // Add the announcement card to the display
    announcementDisplay.appendChild(announcementCard);

    // Update the announcement count
    updateAnnouncementCount();

    // Clear input fields
    announcementInput.value = "";
    announcementDeadline.value = "";
  });

  function updateAnnouncementCount() {
    const announcementCount =
      announcementDisplay.querySelectorAll(".announcement-card").length;
    document.getElementById("announcement-count").textContent =
      announcementCount;
  }

  // Students
  addStudentBtn.addEventListener("click", function () {
    studentForm.style.display = "block";
  });

  document
    .querySelector("#studentForm button[onclick='addStudent()']")
    .addEventListener("click", function () {
      const studentName = studentNameInput.value.trim();
      const studentClass = studentClassInput.value.trim();

      if (studentName && studentClass) {
        const student = { name: studentName, class: studentClass };

        // Add student to array and display the new student card
        students.push(student);
        appendStudentCard(student);
        updateStudentProfileCount();
        closeStudentForm();
      }
    });

  function appendStudentCard(student) {
    const studentsSection = document.getElementById("students-section");
    const noStudentsText = document.getElementById("no-students");
    noStudentsText.style.display = "none";

    const studentCard = document.createElement("div");
    studentCard.classList.add("student-card");
    studentCard.innerHTML = `
            <h3>${student.name}</h3>
            <p>Class: ${student.class}</p>
        `;

    studentsSection.appendChild(studentCard);
  }

  function updateStudentProfileCount() {
    document.getElementById("student-profile-count").textContent =
      students.length;
  }

  function closeStudentForm() {
    studentForm.style.display = "none";
    studentNameInput.value = "";
    studentClassInput.value = "";
  }

  // Assignments
  addAssignmentBtn.addEventListener("click", function () {
    assignmentForm.style.display = "block";
  });

  document
    .querySelector("#assignmentForm button[onclick='addAssignment()']")
    .addEventListener("click", function () {
      const assignmentName = document
        .getElementById("assignment-name")
        .value.trim();
      const dueDate = document.getElementById("due-date").value;
      const assignmentFile =
        document.getElementById("assignment-file").files[0];

      if (assignmentName && dueDate && assignmentFile) {
        const assignment = {
          name: assignmentName,
          dueDate: dueDate,
          fileURL: URL.createObjectURL(assignmentFile),
        };

        assignments.push(assignment);
        appendAssignmentCard(assignment);
        closeAssignmentForm();
      }
    });

  function appendAssignmentCard(assignment) {
    const assignmentsSection = document.getElementById("assignments-section");

    const assignmentCard = document.createElement("div");
    assignmentCard.classList.add("assignment-card");
    assignmentCard.innerHTML = `
            <h3>${assignment.name}</h3>
            <p>Due Date: ${new Date(
              assignment.dueDate
            ).toLocaleDateString()}</p>
        `;

    assignmentCard.onclick = function () {
      window.open(assignment.fileURL, "_blank");
    };

    assignmentsSection.appendChild(assignmentCard);
  }

  function closeAssignmentForm() {
    assignmentForm.style.display = "none";
    document.getElementById("assignment-name").value = "";
    document.getElementById("due-date").value = "";
    document.getElementById("assignment-file").value = "";
  }

  // Restrict past dates for the due date picker
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("due-date").setAttribute("min", today);
  document.getElementById("announcement-deadline").setAttribute("min", today);
});

// Function to fetch class details and update global arrays
async function showClassDetails(className) {
  try {
    const response = await fetch("http://localhost:8000/" + className);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("🚀 ~ showClassDetails ~ className:", data);

    // Update global arrays
    finaldata = data[0];
    students = data[0].students || [];
    assignments = data[0].assignments || [];
    announcements = data[0].notifications || [];

    // Optionally render the students and assignments after fetching
    renderAllStudents();
    renderAllAssignments();
    renderAllAnnouncements();
  } catch (error) {
    console.error("Error fetching class details:", error);
  }
}

function renderAllStudents() {
  const studentsSection = document.getElementById("students-section");
  studentsSection.innerHTML = "";
  students.forEach(appendStudentCard);
  updateStudentProfileCount();
}

function renderAllAssignments() {
  const assignmentsSection = document.getElementById("assignments-section");
  assignmentsSection.innerHTML = "";
  assignments.forEach(appendAssignmentCard);
}

function appendStudentCard(student) {
  const studentsSection = document.getElementById("students-section");

  const studentCard = document.createElement("div");
  studentCard.classList.add("student-card");
  studentCard.innerHTML = `
          <h3>${student.name}</h3>
          <p>Class: ${finaldata.name}</p>
      `;

  studentsSection.appendChild(studentCard);
}

// Function to append an assignment card
function appendAssignmentCard(assignment) {
  const assignmentsSection = document.getElementById("assignments-section");

  const assignmentCard = document.createElement("div");
  assignmentCard.classList.add("assignment-card");
  assignmentCard.innerHTML = `
      <h3>${assignment.assingmentName}</h3>
      <p>Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}</p>
  `;

  assignmentCard.onclick = function () {
    window.open(assignment.fileURL, "_blank");
  };

  assignmentsSection.appendChild(assignmentCard);
}

function updateStudentProfileCount() {
  document.getElementById("student-profile-count").textContent =
    students.length;
}

function appendAnnouncementCard(announcement) {
  const announcementDisplay = document.getElementById("announcement-display");

  const announcementCard = document.createElement("div");
  announcementCard.className = "announcement-card";
  announcementCard.innerHTML = `
      <div class="announcement-text-container">
          <p class="announcement-text">${announcement.announce}</p>
          <p class="announcement-deadline">Deadline: ${new Date(
            announcement.date
          ).toLocaleDateString()}</p>
      </div>
      <button class="delete-announcement-btn">
          <img src="https://img.icons8.com/ios-glyphs/30/000000/trash.png" alt="Delete">
      </button>
  `;

  // Add delete functionality
  announcementCard
    .querySelector(".delete-announcement-btn")
    .addEventListener("click", function () {
      // Remove the card and delete from the global array
      announcementCard.remove();
      announcements = announcements.filter((a) => a !== announcement);
      renderAllAnnouncements(); // Update the display
    });

  // Add the announcement card to the display
  announcementDisplay.appendChild(announcementCard);
}

// Function to render all announcements
function renderAllAnnouncements() {
  const announcementDisplay = document.getElementById("announcement-display");
  announcementDisplay.innerHTML = ""; // Clear existing announcements

  announcements.forEach(appendAnnouncementCard); // Render all announcements

  // Update announcement count
  updateAnnouncementCount();
}

// Function to update the announcement count
function updateAnnouncementCount() {
  const announcementCount = announcements.length;
  document.getElementById("announcement-count").textContent = announcementCount;
}

async function addAssignment() {
  const assignmentName = document
    .getElementById("assignment-name")
    .value.trim();
  const dueDate = document.getElementById("due-date").value;
  const assignmentFile = document.getElementById("assignment-file").files[0];

  if (assignmentName && dueDate && assignmentFile) {
    const assignment = {
      assingmentName: assignmentName,
      dueDate: dueDate,
      subname: "maths",
      class_id: finaldata._id,
    };

    assignments.push(assignment);
    try {
      const response = await (
        await fetch("http://localhost:8000/assignment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set the content type
          },
          body: JSON.stringify(assignment),
        })
      ).json();
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      console.log("🚀 ~ addAssignment ~ response:", response);
      appendAssignmentCard(assignment);
      closeAssignmentForm();
    } catch (error) {
      console.log("~ error:", error);
    }
  }
}

function closeAssignmentForm() {
  assignmentForm.style.display = "none";
  document.getElementById("assignment-name").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("assignment-file").value = "";
}
