let tasks = {};

let createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  let taskLi = $("<li>").addClass("list-group-item");
  let taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  let taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

let loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

let saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".list-group").on("click", "p", function() {
    let text = $(this).text().trim();
    let textInput = $("<textarea>").addClass("form-control").val(text);
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
});

$(".list-group").on("blur", "textarea", function() {
    // get the textarea's current value/text.
    let text = $(this).val().trim();
    // get the parent uls id attribute.
    let status = $(this).closest(".list-group").attr("id").replace("list-", "");
    // get the task's position in the list of other li elements.
    let index = $(this).closest(".list-group-item").index();

    tasks[status][index].text = text;
    saveTasks();

    // recreate the element
    let taskP = $("<p>").addClass("m-1").text(text);
    $(this).replaceWith(taskP);
});

// due date was clicked
$(".list-group").on("click", "span", function() {
    let date = $(this).text().trim();
    let dateInput = $("<input>").attr("type", "text").addClass("form-control").val(date);
    // swamp out elements
    $(this).replaceWith(dateInput);

    // automatically focus on new element
    dateInput.trigger("focus");
});

$(".list-group").on("blur", "input[type='text']", function() {
    let date = $(this).val().trim();
    let status = $(this).closest(".list-group").attr("id").replace("list-", "");
    let index = $(this).closest(".list-group-item").index();

    tasks[status][index].date = date;
    saveTasks();

    let taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(date);
    $(this).replaceWith(taskSpan);
});


// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  let taskText = $("#modalTaskDescription").val();
  let taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (let key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


