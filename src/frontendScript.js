const studentContainer = document.getElementById('student-container');

// Fetch all students
// this gets you an array of our students, I do not have all of the details yet
async function fetchStudents() {
  try {
    const response = await fetch('/tutoring');
    const students = await response.json();
    renderStudents(students);
  } catch (error) {
    console.error('Error fetching students:', error);
  }
}

// Render students to the page
function renderStudents(students) {
  studentContainer.innerHTML = '';

  students.forEach(student => {
    const studentCard = document.createElement('div');
    studentCard.className = 'student-card';
    studentCard.innerHTML = `
        <div class="student-header">
          <div>
            <div class="student-name">${student.name}</div>
            <div class="student-school">${student.school} • Year ${student.year}</div>
          </div>
          <div>${student.email}</div>
        </div>
        
        <div class="info-section">
          <div class="section-title">Syllabus & Schedule</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Syllabus Link</span>
              <a href="${student.syllabus_link}" class="syllabus-link">View ${student.subject} Syllabus</a>
            </div>
            <div class="info-item">
              <span class="info-label">Current Topics</span>
              <div>${student.current_topics}</div>
            </div>
          </div>
          
          <div class="info-item">
            <span class="info-label">Tutoring Schedule</span>
            <div class="tutoring-schedule">
              ${student.tutoring_schedule.map(time =>
      `<div class="schedule-item">${time}</div>`
    ).join('')}
            </div>
          </div>
          
          <div class="info-item">
            <span class="info-label">Other Availability</span>
            <div class="tutoring-schedule">
              ${student.other_availability.map(time =>
      `<div class="schedule-item">${time}</div>`
    ).join('')}
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <div class="section-title">Worksheets</div>
          <div class="worksheets">
            <div class="worksheet-list">
              <div class="info-label">New Worksheets Needed</div>
              ${student.worksheets
        .filter(w => w.type === 'needed')
        .map(w => `<div class="worksheet-item">${w.title}</div>`)
        .join('')}
            </div>
            <div class="worksheet-list">
              <div class="info-label">Completed Worksheets</div>
              ${student.worksheets
        .filter(w => w.type === 'completed')
        .map(w => `<div class="worksheet-item">${w.title} (${w.date})</div>`)
        .join('')}
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <div class="section-title">Assessment History</div>
          <div class="past-scores">
            ${student.test_scores.map(score =>
          `<div class="score-item">${score.test_name}: ${score.score}%</div>`
        ).join('')}
          </div>
        </div>
        
        <button class="edit-btn" data-id="${student.id}">Edit</button>
        <button class="delete-btn" data-id="${student.id}">Delete</button>
      `;
    studentContainer.appendChild(studentCard);
  });

  // Add event listeners to buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', handleEdit);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });
}

// Handle edit button clicks
async function handleEdit(e) {
  const studentId = e.target.dataset.id;
  // Fetch student data and populate edit form
  // You'll need to create an edit modal similar to your add modal
  console.log('Edit student:', studentId);
}

// Handle delete button clicks
async function handleDelete(e) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  const studentId = e.target.dataset.id;
  try {
    const response = await fetch(`/api/students/${studentId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      fetchStudents(); // Refresh the list
    }
  } catch (error) {
    console.error('Error deleting student:', error);
  }
}

// Initialize
fetchStudents();