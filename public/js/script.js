// Filter Tasks by Priority and Due Date
async function applyFilters() {
  const priority = document.getElementById("filter-priority").value;
  const dueDate = document.getElementById("filter-due-date").value;
  const token = localStorage.getItem("token");

  const query = new URLSearchParams();
  if (priority) query.append("priority", priority);
  if (dueDate) query.append("dueDate", dueDate);

  try {
    const response = await fetch(
      `https://taskmaster-seven.fly.dev/tasks/filter?${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const tasks = await response.json();
    displayTasksSearch(tasks);
  } catch (error) {
    console.error("Error:", error);
  }
}
