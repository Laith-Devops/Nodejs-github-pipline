// load users on page load
window.onload = loadUsers;

async function saveUser() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  if (!name || !email) {
    alert('Please fill in both fields');
    return;
  }

  await fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });

  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  loadUsers();
}

async function loadUsers() {
  const res = await fetch('/users');
  const users = await res.json();
  const list = document.getElementById('users');
  list.innerHTML = '';
  users.forEach(user => {
    list.innerHTML += `
      <li>
        <span>${user.name} — ${user.email}</span>
        <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
      </li>
    `;
  });
}

async function deleteUser(id) {
  await fetch(`/users/${id}`, { method: 'DELETE' });
  loadUsers();
}