import { api } from "./api.js";

const state = {
  user: null,
  currentPage: "loading",
  projects: [],
  tasks: [],
  stats: null,
};

const appEl = document.getElementById("app");

async function init() {
  try {
    const user = await api.auth.me();
    state.user = user;
    navigateTo("dashboard");
  } catch (err) {
    navigateTo("login");
  }
}

export function navigateTo(page) {
  state.currentPage = page;
  render();
}

function render() {
  appEl.innerHTML = "";
  
  if (state.currentPage === "loading") {
    appEl.innerHTML = `<div class="flex items-center justify-center h-screen"><p class="text-gray-500 animate-pulse">Loading...</p></div>`;
    return;
  }

  if (state.currentPage === "login") {
    renderLogin();
    return;
  }

  if (state.currentPage === "signup") {
    renderSignup();
    return;
  }

  if (state.user) {
    renderMainLayout();
  } else {
    navigateTo("login");
  }
}

function renderLogin() {
  appEl.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Team Task Manager</h2>
        <form id="login-form" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">Sign In</button>
        </form>
        <p class="mt-6 text-center text-gray-600">
          Don't have an account? <a href="#" onclick="event.preventDefault(); window.navigateTo('signup')" class="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  `;

  document.getElementById("login-form").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await api.auth.login(data);
      state.user = res.user;
      navigateTo("dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed: " + err.message);
    }
  };
}

function renderSignup() {
  appEl.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h2>
        <form id="signup-form" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" required class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select name="role" class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">Sign Up</button>
        </form>
        <p class="mt-6 text-center text-gray-600">
          Already have an account? <a href="#" onclick="event.preventDefault(); window.navigateTo('login')" class="text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  `;

  document.getElementById("signup-form").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await api.auth.register(data);
      state.user = res.user;
      navigateTo("dashboard");
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed: " + err.message);
    }
  };
}

async function renderMainLayout() {
  appEl.innerHTML = `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div class="p-6">
          <h1 class="text-xl font-bold text-gray-800">Task Manager</h1>
        </div>
        <nav class="flex-1 px-4 space-y-1">
          <a href="#" class="nav-item active" data-page="dashboard">
            <span class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition">Dashboard</span>
          </a>
          <a href="#" class="nav-item" data-page="projects">
            <span class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition">Projects</span>
          </a>
          <a href="#" class="nav-item" data-page="tasks">
            <span class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition">My Tasks</span>
          </a>
        </nav>
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              ${state.user.name.charAt(0)}
            </div>
            <div class="flex-1 overflow-hidden">
              <p class="text-sm font-semibold truncate text-gray-900">${state.user.name}</p>
              <p class="text-xs text-gray-500 capitalize">${state.user.role}</p>
            </div>
          </div>
          <button id="logout-btn" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">Log Out</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-8" id="main-content">
        <div class="flex items-center justify-center h-full">
           <p class="text-gray-400 animate-pulse">Loading content...</p>
        </div>
      </main>
    </div>
  `;

  document.getElementById("logout-btn").onclick = async () => {
    await api.auth.logout();
    state.user = null;
    navigateTo("login");
  };

  // Content Loader
  if (state.currentPage === "dashboard") {
    await renderDashboard();
  } else if (state.currentPage === "projects") {
    await renderProjects();
  } else if (state.currentPage === "tasks") {
    await renderTasks();
  }
}

async function renderDashboard() {
  const container = document.getElementById("main-content");
  state.stats = await api.tasks.getStats();
  
  container.innerHTML = `
    <div class="max-w-6xl mx-auto">
      <header class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p class="text-gray-500">Welcome back, ${state.user.name}</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        ${renderStatCard("Total Tasks", state.stats.total, "bg-blue-50 text-blue-600")}
        ${renderStatCard("Completed", state.stats.completed, "bg-green-50 text-green-600")}
        ${renderStatCard("Pending", state.stats.pending, "bg-yellow-50 text-yellow-600")}
        ${renderStatCard("Overdue", state.stats.overdue, "bg-red-50 text-red-600")}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="font-bold text-gray-900 mb-4">Recent Tasks</h3>
          <div id="recent-tasks-list">Loading...</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-4">
            ${state.user.role === "admin" ? `
              <button onclick="window.navigateTo('projects')" class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Create Project</button>
              <button onclick="window.navigateTo('tasks')" class="w-full bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Add Member</button>
            ` : `
               <p class="text-sm text-gray-500">You are logged in as a member. You can view and update your assigned tasks.</p>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  // Fetch and show actual recent tasks
  const tasks = await api.tasks.getAll();
  const list = document.getElementById("recent-tasks-list");
  if (tasks.length === 0) {
    list.innerHTML = `<p class="text-gray-400 text-center py-8">No tasks found.</p>`;
  } else {
    list.innerHTML = tasks.slice(0, 5).map(task => `
      <div class="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
        <div>
          <p class="font-medium text-gray-800">${task.title}</p>
          <p class="text-xs text-gray-500">${task.project?.name || "No Project"}</p>
        </div>
        <div class="flex items-center space-x-4">
           <span class="px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}">${task.status}</span>
           <p class="text-xs ${isOverdue(task.dueDate, task.status) ? "text-red-500 font-bold" : "text-gray-400"}">
            ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
           </p>
        </div>
      </div>
    `).join("");
  }
}

async function renderProjects() {
  const container = document.getElementById("main-content");
  const projects = await api.projects.getAll();
  
  container.innerHTML = `
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-gray-900">Projects</h2>
        ${state.user.role === 'admin' ? '<button id="open-project-modal" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">+ New Project</button>' : ''}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${projects.map(p => `
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-bold text-gray-900">${p.name}</h3>
              <span class="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">${p.members.length} members</span>
            </div>
            <p class="text-sm text-gray-600 mb-6 line-clamp-2">${p.description || 'No description'}</p>
            <div class="flex items-center justify-between">
               <p class="text-xs text-gray-400">Created ${new Date(p.createdAt).toLocaleDateString()}</p>
               <button class="text-sm text-blue-600 hover:underline">View Details</button>
            </div>
          </div>
        `).join("")}
        ${projects.length === 0 ? '<p class="col-span-full text-center text-gray-400 py-12">No projects found.</p>' : ''}
      </div>
    </div>
  `;

  if (state.user.role === 'admin') {
    document.getElementById("open-project-modal").onclick = () => renderProjectModal();
  }
}

async function renderTasks() {
  const container = document.getElementById("main-content");
  const tasks = await api.tasks.getAll();
  
  container.innerHTML = `
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-gray-900">My Tasks</h2>
        ${state.user.role === 'admin' ? '<button id="open-task-modal" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">+ Create Task</button>' : ''}
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            ${tasks.map(task => `
              <tr>
                <td class="px-6 py-4">
                  <p class="text-sm font-medium text-gray-900">${task.title}</p>
                  <p class="text-xs text-gray-500 truncate max-w-xs">${task.description || ''}</p>
                </td>
                <td class="px-6 py-4 font-medium text-xs text-gray-600">${task.project?.name || "Default"}</td>
                <td class="px-6 py-4">
                   <p class="text-xs ${isOverdue(task.dueDate, task.status) ? "text-red-500 font-bold" : "text-gray-600"}">
                    ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                   </p>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}">
                    ${task.status}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <select onchange="window.updateTaskStatus('${task._id}', this.value)" class="text-xs border border-gray-200 rounded px-2 py-1 outline-none">
                    <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
                    <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>In Progress</option>
                    <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
                  </select>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        ${tasks.length === 0 ? '<p class="text-center text-gray-400 py-12">You have no tasks.</p>' : ''}
      </div>
    </div>
  `;

  if (state.user.role === 'admin') {
     document.getElementById("open-task-modal").onclick = () => renderTaskModal();
  }
}

// Modals
async function renderProjectModal() {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200";
  modal.innerHTML = `
    <div class="bg-white rounded-xl max-w-lg w-full p-8 shadow-2xl">
      <h3 class="text-xl font-bold mb-6">Create New Project</h3>
      <form id="project-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Project Name</label>
          <input type="text" name="name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
        </div>
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" onclick="this.closest('.fixed').remove()" class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Create</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("form").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await api.projects.create(data);
      modal.remove();
      renderProjects();
    } catch (err) {
      alert(err.message);
    }
  };
}

async function renderTaskModal() {
  const [projects, users] = await Promise.all([
    api.projects.getAll(),
    api.auth.getUsers()
  ]);

  if (projects.length === 0) {
    alert("Please create a project first!");
    return;
  }

  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200";
  modal.innerHTML = `
    <div class="bg-white rounded-xl max-w-lg w-full p-8 shadow-2xl">
      <h3 class="text-xl font-bold mb-6">Create New Task</h3>
      <form id="task-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Task Title</label>
          <input type="text" name="title" required placeholder="Enter task title" class="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Project</label>
            <select name="projectId" required class="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
              ${projects.map(p => `<option value="${p._id}">${p.name}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Assign To</label>
            <select name="assignee" class="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
              <option value="">Unassigned</option>
              ${users.map(u => `<option value="${u._id}">${u.name} (${u.role})</option>`).join("")}
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Due Date</label>
          <input type="date" name="dueDate" class="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Description</label>
          <textarea name="description" rows="3" placeholder="Describe the task..." class="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"></textarea>
        </div>
        <div class="flex justify-end space-x-3 pt-6">
          <button type="button" onclick="this.closest('.fixed').remove()" class="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition">Cancel</button>
          <button type="submit" class="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 hover:shadow-lg transition">Create Task</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("form").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await api.tasks.create(data);
      modal.remove();
      renderTasks();
    } catch (err) {
      alert(err.message);
    }
  };
}

// Helpers
function renderStatCard(title, value, colorClass) {
  return `
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">${title}</p>
      <div class="flex items-center justify-between">
        <span class="text-2xl font-bold text-gray-900">${value}</span>
        <div class="w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
        </div>
      </div>
    </div>
  `;
}

function getStatusColor(status) {
  switch (status) {
    case "done": return "bg-green-100 text-green-700";
    case "in-progress": return "bg-blue-100 text-blue-700";
    case "pending": return "bg-yellow-100 text-yellow-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

function isOverdue(dueDate, status) {
  if (status === "done" || !dueDate) return false;
  return new Date(dueDate) < new Date();
}

// Expose globals for onclick handlers
window.navigateTo = navigateTo;
window.updateTaskStatus = async (id, status) => {
  try {
    await api.tasks.updateStatus(id, status);
    renderTasks();
  } catch (err) {
    alert(err.message);
  }
};

// Start
init();
