let users = JSON.parse(localStorage.getItem("users")) || [];
let current = JSON.parse(localStorage.getItem("current")) || null;

/* REGISTER */
function register() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let pass = document.getElementById("pass").value;

  let role = email.includes("hr") ? "hr" : "user";

  users.push({ name, email, pass, role });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Registered!");
  location.href = "index.html";
}

/* LOGIN */
function login() {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("pass").value;

  let user = users.find(u => u.email === email && u.pass === pass);

  if (!user) {
    alert("Wrong login");
    return;
  }

  current = user;
  localStorage.setItem("current", JSON.stringify(user));

  location.href = "dashboard.html";
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("current");
  location.href = "index.html";
}

/* PROTECT PAGE */
function protect(role) {
  if (!current) {
    location.href = "index.html";
  }

  if (role && current.role !== role) {
    alert("Access denied");
    location.href = "dashboard.html";
  }
}