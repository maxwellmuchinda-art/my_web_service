// ---------------------------------------------------------------
// API address.
//  - Local: http://localhost:3000/api/lineup
//  - After deployment: replace with your cloud URL, e.g.
//    "https://your-app.example.com/api/lineup"
// ---------------------------------------------------------------
const API_URL = 'http://localhost:3000/api/lineup';

const form = document.getElementById('lineupForm');
const tableBody = document.getElementById('tableBody');
const messageBox = document.getElementById('message');
const formTitle = document.getElementById('formTitle');
const fields = ['festival_name', 'artist_name', 'stage', 'genre', 'performance_date', 'start_time'];

function showMessage(text, isError = false) {
  messageBox.textContent = text;
  messageBox.className = isError ? 'err' : 'ok';
  setTimeout(() => { messageBox.textContent = ''; }, 4000);
}

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// TIME comes back as HH:MM:SS; the time input wants HH:MM
function shortTime(t) {
  return t ? t.slice(0, 5) : '';
}

async function loadRecords() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to load records');
    const records = await res.json();
    renderTable(records);
  } catch (err) {
    showMessage(err.message, true);
  }
}

function renderTable(records) {
  if (records.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8">No records yet.</td></tr>';
    return;
  }
  tableBody.innerHTML = records.map((r) => `
    <tr>
      <td>${r.id}</td>
      <td>${escapeHtml(r.festival_name)}</td>
      <td>${escapeHtml(r.artist_name)}</td>
      <td>${escapeHtml(r.stage)}</td>
      <td>${escapeHtml(r.genre)}</td>
      <td>${escapeHtml(r.performance_date)}</td>
      <td>${escapeHtml(shortTime(r.start_time))}</td>
      <td>
        <button class="edit" onclick="editRecord(${r.id})">Edit</button>
        <button class="delete" onclick="deleteRecord(${r.id})">Delete</button>
      </td>
    </tr>`).join('');
}

function resetForm() {
  form.reset();
  document.getElementById('id').value = '';
  formTitle.textContent = 'Add a performance';
  document.getElementById('saveBtn').textContent = 'Save';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id').value;
  const payload = {};
  fields.forEach((f) => { payload[f] = document.getElementById(f).value; });
  if (payload.start_time && payload.start_time.length === 5) payload.start_time += ':00';

  try {
    const res = await fetch(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    showMessage(id ? 'Record updated' : 'Record created');
    resetForm();
    loadRecords();
  } catch (err) {
    showMessage(err.message, true);
  }
});

async function editRecord(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const r = await res.json();
    if (!res.ok) throw new Error(r.error || 'Could not load record');
    document.getElementById('id').value = r.id;
    fields.forEach((f) => {
      let v = r[f] || '';
      if (f === 'start_time') v = shortTime(v);
      document.getElementById(f).value = v;
    });
    formTitle.textContent = `Edit performance #${r.id}`;
    document.getElementById('saveBtn').textContent = 'Update';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    showMessage(err.message, true);
  }
}

async function deleteRecord(id) {
  if (!confirm(`Delete record #${id}?`)) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Delete failed');
    showMessage('Record deleted');
    loadRecords();
  } catch (err) {
    showMessage(err.message, true);
  }
}

document.getElementById('cancelBtn').addEventListener('click', resetForm);
loadRecords();
