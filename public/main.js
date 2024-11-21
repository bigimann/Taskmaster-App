const apiUrl = "https://fp.fly.dev";

// Show Modal
function showModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

// Close Modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

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

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

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
  container.innerHTML = ""; // Clear the container before rendering

  tasks.forEach((task, index) => {
    const taskElem = document.createElement("div");
    taskElem.className = "task-card";
    taskElem.innerHTML = `
      <h3>${index + 1}. ${task.title}</h3>
      <p>${task.description}</p>
      <p><strong>Deadline:</strong> ${new Date(
        task.deadline
      ).toLocaleDateString()}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
      <button onclick="updateTask('${task._id}')">Update</button>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    `;
    container.appendChild(taskElem);
  });
  closeModal(modalId);
}

//delete task
async function deleteTask(taskId) {
  const token = localStorage.getItem("token");

  try {
    await fetch(`${apiUrl}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    loadTasks(); // Reload tasks after deletion
  } catch (error) {
    console.error("Error:", error);
  }
}

//update task
async function updateTask(taskId) {
  const token = localStorage.getItem("token");
  const updatedTitle = prompt("Enter updated title:");
  const updatedDescription = prompt("Enter updated description:");
  const updatedDeadline = prompt("Enter updated deadline (YYYY-MM-DD):");
  const updatedPriority = prompt("Enter updated priority (low, medium, high):");

  if (!updatedTitle || !updatedDeadline || !updatedPriority) {
    alert("All fields are required!");
    return;
  }

  try {
    await fetch(`${apiUrl}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updatedTitle,
        description: updatedDescription,
        deadline: updatedDeadline,
        priority: updatedPriority,
      }),
    });
    loadTasks(); // Reload tasks after update
  } catch (error) {
    console.error("Error:", error);
  }
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
    closeModal("add-task-modal"); // Close modal after submission
    alert(`Task added succesfully`);
    loadTasks(); // Refresh task list
  } catch (error) {
    console.error("Error:", error);
  }
});

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

// Load tasks on tasks.html page load
if (window.location.pathname === "/tasks.html") {
  loadTasks();
}
