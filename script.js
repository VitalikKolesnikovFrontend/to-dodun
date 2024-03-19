const headerInput = document.querySelector("#headerInput");
const headerButton = document.querySelector("#headerButton");
const taskList = document.querySelector("#taskList");
const allCheckbox = document.querySelector("#allCheckbox");
const delCompleted = document.querySelector("#delCompleted");
const allChecked = document.querySelector("#all");
const activeChecked = document.querySelector("#active");
const completedChecked = document.querySelector("#completed");
const filters = document.querySelector(".filters");
const paginationBox = document.querySelector(".pagination");

let tasks = [];
let currentPage = 1;
const perPage = 5;
let filteredTask = 'all';
let pagButtons  = "";


const addTask = (event) => {
  event.preventDefault();
  const taskText = headerInput.value.trim();

  const newTask = {
    text: taskText,
    id: Date.now(),
    done: false,
  };


if (taskText === '') {
  alert('the field must not be empty!');
  return;
}
if (/["№;%:?*]/.test(taskText)) {
  alert('task cannot contain special characters "№;%:?*');
  return;
}

  tasks.push(newTask);

  renderPagination(tasks);
  renderTask(tasks);
  

  headerInput.value = "";
  headerInput.focus();
}
const saveChanges = (event) => {
  const taskId = Number(event.target.parentNode.id);
  const taskUpdate = tasks.find((elem) => elem.id == taskId);
  taskUpdate.text = event.target.value.trim();
  if (taskUpdate.text === '') {
    alert('the field must not be empty!');
    return;
  }
  renderTask(tasks);
};



const handleInputBlur = (event) => {
  const target = event.target;
  if (target.tagName === "INPUT" && target.classList.contains("newInput")) {
    saveChanges(event);
  }
};

const handleInputKeypress = (event) => {
  if (event.key === "Enter") {
    saveChanges(event);
  }
  if (event.key === "Escape") {
    renderTask(tasks);
  }
}



const allTasksDone = () => {
  tasks.forEach((task) => {
    task.done = !task.done;
  })
  renderTask(tasks);
  renderPagination(tasks);
};

const deleteChecked = () => {
  tasks = tasks.filter(task => !task.done);
  allCheckbox.checked = false;
  renderTask(tasks);
  console.log(tasks);
  console.log("12313123");
  renderPagination(tasks);
}

const changeTask = (event) => {
  if (event.target.dataset.action === "delete") {
    const parenNode = event.target.closest(".list-item");
    const id = Number(parenNode.id);
    tasks = tasks.filter((task) => task.id !== id);
    renderPagination(tasks);
    renderTask(tasks);
    
   
  }
  if (event.target.dataset.action === "done") {
    const id = Number(event.target.parentNode.id);  
    const task = tasks.find((i) => i.id === id);
    task.done = !task.done;
    
    renderTask(tasks);
  }
  if (event.target.dataset.action === "edit" && event.detail === 2) {
    event.target.hidden = "true";
    event.target.nextElementSibling.hidden = "";
    event.target.nextElementSibling.focus();
    
  }
  
};

const renderTask = (filteredTasks) => {
  const totalPages = Math.ceil(filteredTasks.length / perPage);
  if (totalPages < currentPage) {
    currentPage = currentPage - 1
 } 
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  const currentTasks = filteredTasks.slice(startIndex, endIndex);  
  let tasksList = "";
  currentTasks.forEach((task) => {
    tasksList += `
    <li id="${task.id}"class="list-item">
      <input id="doneInput" data-action="done" class="checkboxTask" type = "checkbox"${task.done ? "checked" : ""}>
      <span id="${task.id}" class="task"  data-action="edit">${task.text}</span>
      <input class="newInput" value="${task.text}" hidden>
      <button id="deleteTask" data-action="delete" class="buttonTask">X</button>
    </li>
    `;
  });
   taskList.innerHTML = tasksList;
   renderTaskCountAll(tasks);
   renderTaskCountActive(tasks);
   renderTaskCountCompleted(tasks);
};

const filter = () => {
  if (filteredTask === 'active') {
    return tasks.filter((task) => !task.done);
  } else if (filteredTask === 'completed') {
    return tasks.filter((task) => task.done);
  } else {
    return tasks;
  }
}

const renderPagination = (actualTasks) => {
  const totalPages = Math.ceil(actualTasks.length / perPage);
 
  pagButtons = "";
  paginationBox.innerHTML = pagButtons;
  for(let i = 1; i <= totalPages; i++) {
    pagButtons += `<button class="${i === currentPage ? 'active' : 'pag-button'}" data-page ="${i}">${i}</button>`
    paginationBox.innerHTML = pagButtons;
    // currentPage = totalPages;
  }
  
 
  if (totalPages < currentPage) {
     currentPage = currentPage - 1
     renderPagination(actualTasks);
  } 
  console.log(totalPages, currentPage);
}


const handlePagClick = (event) => {
  if (event.target.tagName === 'BUTTON') {
    currentPage = parseInt(event.target.dataset.page);
    let childArr = paginationBox.childNodes;
    childArr.forEach((task) => {
      task.className = 'pag-button';
      event.target.className = 'active';
    });
    renderTask(tasks);
  }
}

const handleFilterClick = (event) => {
  
  filteredTask = event.target.id;
  let childArr = filters.childNodes;
  childArr.forEach((task) => {
    task.className = 'button-filter';
    event.target.className = 'button-filter-active'
  })
  const filteredTasks = filter();
  renderTask(filteredTasks);
  renderPagination(filteredTasks);
}


const keyUp = (event) => {
  if (event.keycode === 13) {
    addTask();
  }
};

const renderTaskCountAll = (tasks) => {
  allChecked.innerHTML = `All(${tasks.length})`
}
const renderTaskCountActive = (tasks) => {
  let activeArr = tasks.filter((item) => item.done === false)
  activeChecked.innerHTML = `Active(${activeArr.length})`
}
const renderTaskCountCompleted = (tasks) => {
  let activeArr = tasks.filter((item) => item.done === true)
  completedChecked.innerHTML = `Completed(${activeArr.length})`
}



headerButton.addEventListener('click', addTask);
headerInput.addEventListener('keypress', keyUp);
taskList.addEventListener('click', changeTask);
taskList.addEventListener('blur', handleInputBlur, true);
taskList.addEventListener('keydown', handleInputKeypress);
allCheckbox.addEventListener('click', allTasksDone);
delCompleted.addEventListener('click', deleteChecked);
filters.addEventListener('click', handleFilterClick);
paginationBox.addEventListener('click', handlePagClick);

