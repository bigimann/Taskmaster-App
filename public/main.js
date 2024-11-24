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
  // closeModal("display-tasks-modal");
}

//Display task search
function displayTasksSearch(tasks) {
  const searchContainer = document.getElementById("search-container");
  searchContainer.innerHTML = ""; // Clear the container before rendering

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
    searchContainer.appendChild(taskElem);
  });
}

//delete task
async function deleteTask(taskId) {
  const token = localStorage.getItem("token");

  // Prompt user for confirmation
  const userConfirmed = confirm(
    "Are you sure you want to delete this task? This action cannot be undone."
  );
  if (!userConfirmed) {
    return; // Exit function if user cancels
  }

  try {
    const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Task deleted successfully.");
      loadTasks(); // Reload tasks after successful deletion
    } else {
      alert("Failed to delete task. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while deleting the task.");
  }
}

//update task
// Show update modal and populate with existing task details
async function updateTask(taskId) {
  const token = localStorage.getItem("token");

  try {
    // Fetch existing task details
    const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const task = await response.json();

    // Populate the form with current task details
    document.getElementById("update-task-id").value = taskId;
    document.getElementById("update-title").value = task.title || "";
    document.getElementById("update-description").value =
      task.description || "";
    document.getElementById("update-deadline").value = task.deadline || "";
    document.getElementById("update-priority").value = task.priority || "";

    // Show the modal
    document.getElementById("update-task-modal").style.display = "block";
  } catch (error) {
    console.error("Error fetching task details:", error);
    alert("Failed to fetch task details. Please try again.");
  }
}

// Handle update form submission
document
  .getElementById("update-task-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Collect updated values
    const taskId = document.getElementById("update-task-id").value;
    const updatedTitle = document.getElementById("update-title").value.trim();
    const updatedDescription = document
      .getElementById("update-description")
      .value.trim();
    const updatedDeadline = document
      .getElementById("update-deadline")
      .value.trim();
    const updatedPriority = document
      .getElementById("update-priority")
      .value.trim();

    // Create an update object with only the fields the user filled out
    const updateData = {};
    if (updatedTitle) updateData.title = updatedTitle;
    if (updatedDescription) updateData.description = updatedDescription;
    if (updatedDeadline) updateData.deadline = updatedDeadline;
    if (updatedPriority) updateData.priority = updatedPriority;

    // Check if at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      alert("No fields to update. Please fill out at least one field.");
      return;
    }

    try {
      // Send update request to server
      const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert("Task updated successfully.");
        closeModal("update-task-modal"); // Close the modal
        loadTasks(); // Reload tasks
      } else {
        alert("Failed to update task. Please try again.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("An error occurred. Please try again.");
    }
  });

// Add New Task
document.getElementById("task-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const deadline = document.getElementById("deadline").value;
  const priority = document.getElementById("priority").value;

  try {
    const response = await fetch(`${apiUrl}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, deadline, priority }),
    });

    if (response.ok) {
      // Reset the form fields
      document.getElementById("task-form").reset();

      closeModal("add-task-modal"); // Close modal after submission
      alert(`Task added successfully`);
      loadTasks(); // Refresh task list
    } else {
      alert("Failed to add task. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
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
    displayTasksSearch(tasks);
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
    displayTasksSearch(tasks);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Load tasks on tasks.html page load
if (window.location.pathname === "/tasks.html") {
  loadTasks();
}
