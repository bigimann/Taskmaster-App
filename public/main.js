const apiUrl = "http://localhost:5000";

// Register User
document
  .getElementById("register-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        alert("Registration successful");
        window.location.href = "login.html";
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Login User
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token); // Store token
      window.location.href = "tasks.html";
    } else {
      alert("Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Load Tasks
async function loadTasks() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${apiUrl}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Display Tasks
function displayTasks(tasks) {
  const container = document.getElementById("tasks-container");
  container.innerHTML = "";
  tasks.forEach((task) => {
    const taskElem = document.createElement("div");
    taskElem.textContent = `${task.title} - ${task.priority}`;
    container.appendChild(taskElem);
  });
}

// Add New Task
document.getElementById("task-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const deadline = document.getElementById("deadline").value;
  const priority = document.getElementById("priority").value;

  try {
    await fetch(`${apiUrl}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, deadline, priority }),
    });
    loadTasks(); // Refresh task list
  } catch (error) {
    console.error("Error:", error);
  }
});

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Load tasks on tasks.html page load
if (window.location.pathname === "/tasks.html") {
  loadTasks();
}

// Filter Tasks by Priority and Due Date
async function applyFilters() {
  const priority = document.getElementById("filter-priority").value;
  const dueDate = document.getElementById("filter-due-date").value;
  const token = localStorage.getItem("token");

  const query = new URLSearchParams();
  if (priority) query.append("priority", priority);
  if (dueDate) query.append("dueDate", dueDate);

  try {
    const response = await fetch(`${apiUrl}/tasks/filter?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Search Tasks by Title or Description
async function searchTasks() {
  const term = document.getElementById("search-term").value;
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${apiUrl}/tasks/search?term=${term}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error("Error:", error);
  }
}
