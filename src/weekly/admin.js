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
console.error('Error adding week:', error);

  }

}

async function handleUpdateWeek(id, fields) {

  try {

    const response = await fetch('./api/index.php', {

      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        id,
        ...fields
      })

    });

    const result = await response.json();

    if (result.success === true) {

      weeks = weeks.map((week) => {

        if (week.id == id) {

          return {
            id,
            ...fields
          };

        }

        return week;

      });

      renderTable();

      weekForm.reset();

      const submitButton = document.getElementById('add-week');

      submitButton.textContent = 'Add Week';

      delete submitButton.dataset.editId;

    }

  } catch (error) {

    console.error('Error updating week:', error);

  }

}

async function handleTableClick(event) {

  const id = event.target.dataset.id;

  if (event.target.classList.contains('delete-btn')) {

    try {

      const response = await fetch(`./api/index.php?id=${id}`, {

        method: 'DELETE'

      });

      const result = await response.json();

      if (result.success === true) {

        weeks = weeks.filter((week) => week.id != id);

        renderTable();

      }

    } catch (error) {

      console.error('Error deleting week:', error);

    }

  }

  if (event.target.classList.contains('edit-btn')) {

    const week = weeks.find((w) => w.id == id);

    if (!week) return;

    document.getElementById('week-title').value = week.title;

    document.getElementById('week-start-date').value = week.start_date;

    document.getElementById('week-description').value = week.description;

    document.getElementById('week-links').value =
      week.links.join('\n');

    const submitButton = document.getElementById('add-week');

    submitButton.textContent = 'Update Week';

    submitButton.dataset.editId = week.id;

  }

}

async function loadAndInitialize() {

  try {

    const response = await fetch('./api/index.php');

    const result = await response.json();

    weeks = result.data || [];

    renderTable();

    weekForm.addEventListener('submit', handleAddWeek);

    weeksTableBody.addEventListener('click', handleTableClick);

  } catch (error) {

    console.error('Error loading weeks:', error);

  }

}

// --- Initial Page Load ---
loadAndInitialize();
