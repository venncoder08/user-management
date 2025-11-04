let users = [
    { firstname: "John", lastname: "Doe", email: "john.doe@example.com" },
    { firstname: "Jane", lastname: "Smith", email: "john.smith@example.com" },
    { firstname: "Alice", lastname: "Johnson", email: "alice.johnson@example.com" }
];

let editIndex = null;

const tbody = document.getElementById("user-table-body");
const userForm = document.getElementById("user-form");
const registerBtn = document.getElementById("register-btn");
const updateBtn = document.getElementById("update-btn");
const firstInput = document.getElementById("firstname");
const lastInput = document.getElementById("lastname");
const emailInput = document.getElementById("email");

function renderUsers() {
    tbody.innerHTML = users.map((u, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${u.firstname} ${u.lastname}</td>
        <td>${u.email}</td>
        <td>
          <button class="btn btn-primary btn-sm edit-btn" data-index="${i}">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn" data-index="${i}">Delete</button>
        </td>
      </tr>
    `).join("");
}

function getFormData() {
    const firstname = firstInput.value.trim();
    const lastname = lastInput.value.trim();
    const email = emailInput.value.trim();
    if (!firstname || !lastname || !email) {
        alert("Phải điền đầy đủ thông tin!");
        return null;
    }
    return { firstname, lastname, email };
}

function handleRegister(e) {
    e.preventDefault();
    if (editIndex !== null) {
        alert("Đang chỉnh sửa. Hãy bấm Update hoặc Cancel.");
        return;
    }
    const data = getFormData();
    if (!data) return;
    const isDuplicate = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (isDuplicate) {
        alert("Email đã tồn tại!");
        return;
    }
    users.push(data);
    renderUsers();
    userForm.reset();
}

function startEdit(index) {
    const u = users[index];
    firstInput.value = u.firstname;
    lastInput.value = u.lastname;
    emailInput.value = u.email;
    editIndex = index;
    registerBtn.disabled = true;
    updateBtn.disabled = false;
}

function handleUpdate(e) {
    e.preventDefault();
    if (editIndex === null) {
        alert("Không có mục nào đang được chỉnh sửa.");
        return;
    }
    const data = getFormData();
    if (!data) return;
    const isDuplicate = users.some((u, i) =>
        i !== editIndex && u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (isDuplicate) {
        alert("Email đã tồn tại ở người dùng khác!");
        return;
    }
    users[editIndex] = { ...users[editIndex], ...data };
    renderUsers();
    editIndex = null;
    userForm.reset();
    registerBtn.disabled = false;
    updateBtn.disabled = true;
}

function handleDelete(index) {
    const ok = confirm("Bạn có chắc muốn xóa người dùng này không?");
    if (!ok) return;
    users.splice(index, 1);
    renderUsers();
    if (editIndex === index) {
        editIndex = null;
        userForm.reset();
        registerBtn.disabled = false;
        updateBtn.disabled = true;
    }
}

tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const index = Number(btn.getAttribute("data-index"));
    if (btn.classList.contains("edit-btn")) startEdit(index);
    if (btn.classList.contains("delete-btn")) handleDelete(index);
});

registerBtn.addEventListener("click", handleRegister);
updateBtn.addEventListener("click", handleUpdate);

renderUsers();
updateBtn.disabled = true;
