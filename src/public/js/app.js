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

// Handle edit button clicks, e is our event object
// this might just change a flag that allows 
async function handleEdit(e) {
  const studentId = e.target.dataset.id;
  console.log('Edit student:', studentId);
}

// Handle delete button clicks, this actually works
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

// // Form submission
// // Modal Population Logic
// function openEditModal(student) {
//   // Basic Info
//   document.getElementById('editStudentId').value = student.id;
//   document.getElementById('editFirstName').value = student.firstName || '';
//   document.getElementById('editLastName').value = student.lastName || '';
//   document.getElementById('editEmail').value = student.email || '';
//   document.getElementById('editPhone').value = student.phone || '';
//   document.getElementById('editSchool').value = student.school || '';
//   document.getElementById('editYear').value = student.year || '10';
//   document.getElementById('editCountry').value = student.country || '';
//   document.getElementById('editSubject').value = student.subject || 'Mathematics';

//   // Schedule
//   const scheduleContainer = document.getElementById('scheduleContainer');
//   scheduleContainer.innerHTML = '';

//   if (student.tutoring_schedule && student.tutoring_schedule.length > 0) {
//     student.tutoring_schedule.forEach((session, index) => {
//       addScheduleInput(session, index);
//     });
//   } else {
//     addScheduleInput('', 0); // Add one empty slot
//   }

//   // Show modal
//   document.getElementById('editModal').style.display = 'block';
// }

// // Helper to add schedule inputs, the scheduler is used
// function addScheduleInput(value = '', index) {
//   const container = document.getElementById('scheduleContainer');
//   const div = document.createElement('div');
//   div.className = 'schedule-input';
//   div.innerHTML = `
//       <input type="text" 
//              class="schedule-input-field" 
//              value="${value}"
//              placeholder="Day and time (e.g. Monday 4-5PM)"
//              data-index="${index}">
//       <button type="button" class="remove-schedule-btn" data-index="${index}">×</button>
//     `;
//   container.appendChild(div);

//   // Add event listener to new remove button
//   div.querySelector('.remove-schedule-btn').addEventListener('click', (e) => {
//     e.target.closest('.schedule-input').remove();
//   });
// }

// // Add new schedule slot
// document.querySelector('.add-schedule-btn').addEventListener('click', () => {
//   const nextIndex = document.querySelectorAll('.schedule-input').length;
//   addScheduleInput('', nextIndex);
// });

// // Close modal handlers
// document.querySelector('.close-modal').addEventListener('click', closeEditModal);
// document.querySelector('.cancel-btn').addEventListener('click', closeEditModal);

// function closeEditModal() {
//   document.getElementById('editModal').style.display = 'none';
// }

// // Form submission
// document.getElementById('editForm').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const studentId = document.getElementById('editStudentId').value;
//   const schedules = Array.from(document.querySelectorAll('.schedule-input-field'))
//     .map(input => input.value)
//     .filter(Boolean);

//   const updatedStudent = {
//     firstName: document.getElementById('editFirstName').value,
//     lastName: document.getElementById('editLastName').value,
//     email: document.getElementById('editEmail').value,
//     phone: document.getElementById('editPhone').value,
//     school: document.getElementById('editSchool').value,
//     year: document.getElementById('editYear').value,
//     country: document.getElementById('editCountry').value,
//     subject: document.getElementById('editSubject').value,
//     tutoring_schedule: schedules
//   };

//   try {
//     const response = await fetch(`/students/${studentId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(updatedStudent)
//     });

//     if (response.ok) {
//       closeEditModal();
//       fetchStudents(); // Refresh the list
//     } else {
//       alert('Failed to update student');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     alert('An error occurred while saving');
//   }
// });