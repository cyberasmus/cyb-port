// =====================
// Academic Planner
// =====================

// Load saved tasks from browser
var tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
var currentFilter = "all";

// Get page elements
var taskInput = document.getElementById("taskInput");
var prioritySelect = document.getElementById("prioritySelect");
var dueDateInput = document.getElementById("dueDateInput");
var addBtn = document.getElementById("addTaskBtn");
var taskList = document.getElementById("taskList");
var filterBtns = document.querySelectorAll(".filter-btn");

// Nav highlighting
var currentPage = window.location.pathname.split("/").pop();
var navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach(function(link) {
  if (link.getAttribute("href") === currentPage) {
    link.style.color = "#C9972B";
    link.style.fontWeight = "700";
    link.style.borderBottom = "2px solid #C9972B";
    link.style.paddingBottom = "4px";
  }
});

//Nav Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
});

// Add task button click
if (addBtn) {
  addBtn.addEventListener("click", function() {
    addTask();
  });
}

// Add task on Enter key
if (taskInput) {
  taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      addTask();
    }
  });
}

// Filter buttons
if (filterBtns) {
  filterBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      filterBtns.forEach(function(b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
}

// Add task function
function addTask() {
  var text = taskInput.value;

  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  var task = {
    id: Date.now(),
    text: text,
    priority: prioritySelect.value,
    dueDate: dueDateInput.value,
    completed: false
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  dueDateInput.value = "";

  renderTasks();
}

// Display tasks function
function renderTasks() {
  if (!taskList) return;

  var filtered = tasks;

  if (currentFilter === "pending") {
    filtered = tasks.filter(function(t) { return !t.completed; });
  }
  if (currentFilter === "completed") {
    filtered = tasks.filter(function(t) { return t.completed; });
  }
  if (currentFilter === "high") {
    filtered = tasks.filter(function(t) { return t.priority === "high"; });
  }

  taskList.innerHTML = "";

  if (filtered.length === 0) {
    taskList.innerHTML = "<p style='color:#718096; text-align:center; padding:2rem;'>No tasks here!</p>";
    updateStats();
    return;
  }

  filtered.forEach(function(task) {
    var item = document.createElement("div");
    item.className = "task-item priority-" + task.priority;
    if (task.completed) {
      item.className += " completed";
    }

    item.innerHTML =
      '<input type="checkbox" class="task-checkbox"' +
        (task.completed ? " checked" : "") + "/>" +
      '<div class="task-content">' +
        '<div class="task-text">' + task.text + "</div>" +
        '<div class="task-meta">' +
          (task.dueDate ? "Due: " + task.dueDate : "") +
        "</div>" +
      "</div>" +
      '<button class="task-delete">✕</button>';

    // Complete task
    item.querySelector(".task-checkbox").addEventListener("change", function() {
      task.completed = !task.completed;
      tasks = tasks.map(function(t) {
        return t.id === task.id ? task : t;
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    // Delete task
    item.querySelector(".task-delete").addEventListener("click", function() {
      tasks = tasks.filter(function(t) {
        return t.id !== task.id;
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    taskList.appendChild(item);
  });

  updateStats();
}

// Update task stats
function updateStats() {
  var statTotal = document.getElementById("statTotal");
  var statDone = document.getElementById("statDone");
  var statPending = document.getElementById("statPending");

  if (statTotal) statTotal.textContent = tasks.length;
  if (statDone) statDone.textContent = tasks.filter(function(t) { return t.completed; }).length;
  if (statPending) statPending.textContent = tasks.filter(function(t) { return !t.completed; }).length;
}

// Load tasks on page start
renderTasks();
// =====================
// Contact Form Validation
// =====================

var contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // Get values
    var name    = document.getElementById("name").value.trim();
    var email   = document.getElementById("email").value.trim();
    var phone   = document.getElementById("phone").value.trim();
    var message = document.getElementById("message").value.trim();

    // Clear previous errors
    document.getElementById("nameError").classList.remove("visible");
    document.getElementById("emailError").classList.remove("visible");
    document.getElementById("phoneError").classList.remove("visible");
    document.getElementById("messageError").classList.remove("visible");

    document.getElementById("name").classList.remove("error");
    document.getElementById("email").classList.remove("error");
    document.getElementById("phone").classList.remove("error");
    document.getElementById("message").classList.remove("error");

    var valid = true;

    // Check name
    if (name === "") {
      document.getElementById("nameError").textContent = "Please enter your name.";
      document.getElementById("nameError").classList.add("visible");
      document.getElementById("name").classList.add("error");
      valid = false;
    }

    // Check email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      document.getElementById("emailError").textContent = "Please enter your email.";
      document.getElementById("emailError").classList.add("visible");
      document.getElementById("email").classList.add("error");
      valid = false;
    } else if (!emailRegex.test(email)) {
      document.getElementById("emailError").textContent = "Please enter a valid email.";
      document.getElementById("emailError").classList.add("visible");
      document.getElementById("email").classList.add("error");
      valid = false;
    }

    // Check phone - digits only
    var phoneRegex = /^\d+$/;
    if (phone === "") {
      document.getElementById("phoneError").textContent = "Please enter your phone number.";
      document.getElementById("phoneError").classList.add("visible");
      document.getElementById("phone").classList.add("error");
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      document.getElementById("phoneError").textContent = "Phone number must contain digits only.";
      document.getElementById("phoneError").classList.add("visible");
      document.getElementById("phone").classList.add("error");
      valid = false;
    }

    // Check message
    if (message === "") {
      document.getElementById("messageError").textContent = "Please enter a message.";
      document.getElementById("messageError").classList.add("visible");
      document.getElementById("message").classList.add("error");
      valid = false;
    }

    // If all valid
    if (valid) {
      document.getElementById("formSuccess").classList.add("visible");
      contactForm.reset();
      setTimeout(function() {
        document.getElementById("formSuccess").classList.remove("visible");
      }, 5000);
    }
  });
}