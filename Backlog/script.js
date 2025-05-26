const backlogData = {
  "To Do": [],
  "In Progress": [],
  "Code Review": [],
  "Done": []
};
const priorityClass = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low"
};
let editTaskIndex = null, editTaskStatus = null;
let currentView = "card";

function renderBoard() {
  document.getElementById("board").style.display = currentView === "card" ? "grid" : "none";
  document.getElementById("tableView").style.display = currentView === "table" ? "block" : "none";
  if (currentView === "table") return renderTable();

  const board = document.getElementById("board");
  board.innerHTML = "";
  Object.entries(backlogData).forEach(([status, tasks]) => {
    const column = document.createElement("div");
    column.className = "column";
    column.innerHTML = `<h2>${status}</h2>`;
    tasks.forEach((task, i) => {
      const div = document.createElement("div");
      div.className = "task";
      div.innerHTML = `
        <h3>${task.title}</h3>
        <span class="badge">${task.type}</span>
        <span class="badge ${priorityClass[task.priority]}">${task.priority}</span>
      `;
      const statusSelect = document.createElement("select");
      ["To Do", "In Progress", "Code Review", "Done"].forEach(opt => {
        const option = new Option(opt, opt, false, opt === status);
        statusSelect.appendChild(option);
      });
      statusSelect.onchange = () => {
        const newStatus = statusSelect.value;
        const movedTask = backlogData[status].splice(i, 1)[0];
        backlogData[newStatus].push(movedTask);
        renderBoard();
      };
      div.appendChild(statusSelect);
      const del = document.createElement("button");
      del.textContent = "🗑️";
      del.onclick = () => { backlogData[status].splice(i, 1); renderBoard(); };
      div.appendChild(del);
      const edit = document.createElement("button");
      edit.textContent = "✏️";
      edit.onclick = () => openModal(task, i, status);
      div.appendChild(edit);
      column.appendChild(div);
    });
    board.appendChild(column);
  });
}

function renderTable() {
  const table = document.getElementById("tableBody");
  table.innerHTML = "";
  Object.entries(backlogData).forEach(([status, tasks]) => {
    tasks.forEach((task, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${task.title}</td><td>${task.type}</td><td>${task.priority}</td>`;
      const statusCell = document.createElement("td");
      const statusSelect = document.createElement("select");
      ["To Do", "In Progress", "Code Review", "Done"].forEach(opt => {
        const option = new Option(opt, opt, false, opt === status);
        statusSelect.appendChild(option);
      });
      statusSelect.onchange = () => {
        const movedTask = backlogData[status].splice(i, 1)[0];
        backlogData[statusSelect.value].push(movedTask);
        renderBoard();
      };
      statusCell.appendChild(statusSelect);
      const actions = document.createElement("td");
      actions.innerHTML = `
        <button onclick="openModal(backlogData['${status}'][${i}], ${i}, '${status}')">✏️</button>
        <button onclick="backlogData['${status}'].splice(${i}, 1); renderBoard()">🗑️</button>
      `;
      row.appendChild(statusCell);
      row.appendChild(actions);
      table.appendChild(row);
    });
  });
}

function openModal(task = null, index = null, status = null) {
  document.getElementById("taskModal").style.display = "flex";
  if (task) {
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskType").value = task.type;
    document.getElementById("taskPriority").value = task.priority;
    document.getElementById("taskStatus").value = status;
    editTaskIndex = index;
    editTaskStatus = status;
  } else {
    document.querySelectorAll("#taskModal input, #taskModal select").forEach(el => el.value = "");
    editTaskIndex = null;
  }
}

function closeModal() {
  document.getElementById("taskModal").style.display = "none";
}

function saveTask() {
  const task = {
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("taskType").value,
    priority: document.getElementById("taskPriority").value,
  };
  const status = document.getElementById("taskStatus").value;
  if (editTaskIndex !== null) {
    backlogData[editTaskStatus].splice(editTaskIndex, 1);
  }
  backlogData[status].push(task);
  closeModal();
  renderBoard();
}

function toggleView(view = null) {
  currentView = view || (currentView === "card" ? "table" : "card");
  renderBoard();
}

// Dummy data
backlogData["To Do"].push({ title: "Build login page", type: "Feature", priority: "High" });
backlogData["In Progress"].push({ title: "Fix bug email", type: "Bug", priority: "Medium" });
backlogData["Code Review"].push({ title: "Optimize DB query", type: "TechDebt", priority: "Low" });
backlogData["Done"].push({ title: "Add dark mode", type: "Feature", priority: "High" });

renderBoard();
