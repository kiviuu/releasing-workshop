const form = document.getElementById("todo-form");
const titleInput = document.getElementById("todo-title");
const priorityInput = document.getElementById("todo-priority");
const list = document.getElementById("todo-list");

const priorityLabels = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

async function loadTodos() {
  const res = await fetch(`${API_URL}/todos`);

  if (!res.ok) {
    throw new Error("Could not load tasks");
  }

  const todos = await res.json();

  list.innerHTML = "";

  for (const todo of todos) {
    const li = document.createElement("li");
    li.classList.add(`priority-${todo.priority}`);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.setAttribute(
      "aria-label",
      `Mark ${todo.title} as done`
    );
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const span = document.createElement("span");
    span.classList.add("todo-title");
    span.textContent = todo.title;

    if (todo.done) {
      span.classList.add("done");
    }

    const priority = document.createElement("span");
    priority.classList.add(
      "priority-label",
      `priority-label-${todo.priority}`
    );
    priority.textContent = priorityLabels[todo.priority] ?? "Medium";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, span, priority, deleteBtn);
    list.append(li);
  }
}

async function addTodo(title, priority) {
  const res = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      priority
    }),
  });

  if (!res.ok) {
    throw new Error("Could not create task");
  }

  await loadTodos();
}

async function toggleTodo(id) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "PATCH"
  });

  if (!res.ok) {
    throw new Error("Could not update task");
  }

  await loadTodos();
}

async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Could not delete task");
  }

  await loadTodos();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();

  if (!title) {
    return;
  }

  try {
    await addTodo(title, priorityInput.value);

    titleInput.value = "";
    priorityInput.value = "medium";
    titleInput.focus();

  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
  }
});

loadTodos().catch((error) => {
  console.error(error);
  list.textContent = "Could not load tasks. Please refresh the page.";
});
