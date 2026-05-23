/*
  Requirement: Make the "Manage Weekly Breakdown" page interactive.
*/

// --- Global Data Store ---
let weeks = [];

// --- Element Selections ---
const weekForm = document.getElementById('week-form');

const weeksTableBody = document.getElementById('weeks-tbody');

// --- Functions ---

function createWeekRow(week) {

  const tr = document.createElement('tr');

  const titleTd = document.createElement('td');
  titleTd.textContent = week.title;

  const dateTd = document.createElement('td');
  dateTd.textContent = week.start_date;

  const descriptionTd = document.createElement('td');
  descriptionTd.textContent = week.description;

  const actionsTd = document.createElement('td');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'edit-btn';
  editBtn.dataset.id = week.id;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  deleteBtn.dataset.id = week.id;

  actionsTd.appendChild(editBtn);
  actionsTd.appendChild(deleteBtn);

  tr.appendChild(titleTd);
  tr.appendChild(dateTd);
  tr.appendChild(descriptionTd);
  tr.appendChild(actionsTd);

  return tr;

}

function renderTable() {

  weeksTableBody.innerHTML = '';

  weeks.forEach((week) => {

    const row = createWeekRow(week);

    weeksTableBody.appendChild(row);

  });

}

async function handleAddWeek(event) {

  event.preventDefault();

  const title = document.getElementById('week-title').value;

  const start_date = document.getElementById('week-start-date').value;

  const description = document.getElementById('week-description').value;

  const links = document
    .getElementById('week-links')
    .value
    .split('\n')
    .filter(link => link.trim() !== '');

  const submitButton = document.getElementById('add-week');

  const editId = submitButton.dataset.editId;

  if (editId) {

    await handleUpdateWeek(editId, {
      title,
      start_date,
      description,
      links
    });

    return;

  }

  try {

    const response = await fetch('./api/index.php', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        title,
        start_date,
        description,
        links
      })

    });

    const result = await response.json();

    if (result.success === true) {

      weeks.push({
        id: result.id,
        title,
        start_date,
        description,
        links
      });

      renderTable();

      weekForm.reset();

    }

  } catch (error) {
