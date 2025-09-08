class TodoApp {
  constructor() {
    this.todoList = document.getElementById("todoList");
    this.todoInput = document.getElementById("todoInput");
    this.addButton = document.getElementById("addButton");
    this.todos = this.loadTodos();
    this.todoIdCounter = 6;

    this.init();
  }

  init() {
    this.addButton.addEventListener("click", () => this.addTodo());
    this.todoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTodo();
      }
    });

    this.todoInput.addEventListener("input", () => {
      this.addButton.disabled = this.todoInput.value.trim().length === 0;
    });

    document.addEventListener("keydown", (e) => this.handleGlobalKeydown(e));

    this.renderExistingTodos();
    this.addButton.disabled = true;
  }

  renderExistingTodos() {
    const existingItems = this.todoList.querySelectorAll(".todo-item");
    existingItems.forEach((item, index) => {
      this.addTodoEventListeners(item, index);
    });
  }

  addTodoEventListeners(todoItem, index) {
    const emoji = todoItem.querySelector(".emoji");

    emoji.addEventListener("click", () => {
      this.toggleTodo(todoItem, index);
    });

    emoji.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggleTodo(todoItem, index);
      }
    });

    todoItem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggleTodo(todoItem, index);
      }
    });
  }

  addTodo() {
    const text = this.todoInput.value.trim();
    if (!text) return;

    const todoItem = this.createTodoElement(text, false);
    this.todoList.appendChild(todoItem);

    this.todos.push({ text, completed: false });
    this.saveTodos();

    this.todoInput.value = "";
    this.addButton.disabled = true;

    this.announceToScreenReader(`Added task: ${text}`);

    setTimeout(() => {
      todoItem.classList.remove("new");
    }, 300);
  }

  createTodoElement(text, completed) {
    const todoItem = document.createElement("li");
    todoItem.className = `todo-item new ${completed ? "completed" : ""}`;
    todoItem.setAttribute("role", "listitem");
    todoItem.setAttribute("tabindex", "0");

    const todoId = `todo-${this.todoIdCounter}`;
    const statusId = `${todoId}-status`;
    todoItem.setAttribute("aria-describedby", statusId);

    todoItem.innerHTML = `
            <span class="todo-text">${this.escapeHtml(text)}</span>
            <button class="emoji ${completed ? "happy" : "sad"}" 
                    aria-label="${
                      completed ? "Mark as incomplete" : "Mark as complete"
                    }" 
                    data-status="${completed ? "completed" : "incomplete"}">
                ${completed ? "😊" : "😕"}
            </button>
            <span id="${statusId}" class="visually-hidden">${
      completed ? "Completed" : "Incomplete"
    } task</span>
        `;

    const index = Array.from(this.todoList.children).length;
    this.addTodoEventListeners(todoItem, index);
    this.todoIdCounter++;

    return todoItem;
  }

  toggleTodo(todoItem, index) {
    const isCompleted = todoItem.classList.contains("completed");
    const emoji = todoItem.querySelector(".emoji");
    const statusSpan = todoItem.querySelector(".visually-hidden");
    const todoText = todoItem.querySelector(".todo-text").textContent;

    if (isCompleted) {
      todoItem.classList.remove("completed");
      emoji.textContent = "😕";
      emoji.className = "emoji sad";
      emoji.setAttribute("aria-label", "Mark as complete");
      emoji.setAttribute("data-status", "incomplete");
      statusSpan.textContent = "Incomplete task";
      this.announceToScreenReader(`Marked "${todoText}" as incomplete`);
    } else {
      todoItem.classList.add("completed");
      emoji.textContent = "😊";
      emoji.className = "emoji happy";
      emoji.setAttribute("aria-label", "Mark as incomplete");
      emoji.setAttribute("data-status", "completed");
      statusSpan.textContent = "Completed task";
      this.announceToScreenReader(`Marked "${todoText}" as complete`);
    }

    if (this.todos[index]) {
      this.todos[index].completed = !isCompleted;
      this.saveTodos();
    }

    emoji.style.transform = "scale(1.2)";
    setTimeout(() => {
      emoji.style.transform = "";
    }, 200);
  }

  announceToScreenReader(message) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "visually-hidden";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  handleGlobalKeydown(e) {
    const focusedElement = document.activeElement;

    if (!focusedElement.classList.contains("todo-item")) {
      return;
    }

    const todoItems = Array.from(this.todoList.querySelectorAll(".todo-item"));
    const currentIndex = todoItems.indexOf(focusedElement);

    if (currentIndex === -1) return;

    let nextIndex;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        nextIndex = currentIndex < todoItems.length - 1 ? currentIndex + 1 : 0;
        todoItems[nextIndex].focus();
        break;

      case "ArrowUp":
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : todoItems.length - 1;
        todoItems[nextIndex].focus();
        break;

      case "Home":
        e.preventDefault();
        todoItems[0]?.focus();
        break;

      case "End":
        e.preventDefault();
        todoItems[todoItems.length - 1]?.focus();
        break;
    }
  }

  loadTodos() {
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Failed to load todos from localStorage:", error);
      return [];
    }
  }

  saveTodos() {
    try {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    } catch (error) {
      console.warn("Failed to save todos to localStorage:", error);
    }
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TodoApp();
});
