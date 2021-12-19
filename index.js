// This is front end javascript

window.onload = () => {
  var total_student_array = loadTotalStudent();
  var search_student_array = [];
  var queue_student_array = loadQueueStudent();

  var total_student_list = document.querySelector(".total-student-list");
  var search_result_list = document.querySelector(".search-result-list");
  var queue_student_list = document.querySelector(".queue-student-list");
  var missing_students_list = document.querySelector(".missing-students-list");
  

  var total_student_input = document.querySelector(".total-student-input");
  var search_student_input = document.querySelector(".search-student-input");

  var total_add_button = document.querySelector(".total-add-button");
  var queue_add_button = document.querySelector(".queue-add-button");

  var search_term = "";

  init_setup();

  total_student_input.onkeyup = (e) => {
    let break_condition = e.key == "," || e.key == "Enter";
    if (break_condition) {
      addStudentToTotalList();
    }
  };

  total_add_button.onclick = () => {
    addStudentToTotalList();
  };

  queue_add_button.onclick = () => {
    addStudentToQueueList();
  };

  function addStudentToTotalList() {
    let student_name = total_student_input.value.split(",")[0];
    if (student_name.trim() == "") {
      return;
    }

    if (total_student_array.includes(student_name.toLowerCase())) {
      total_student_input.value = "";
      return;
    }

    insertItemToHtmlList(total_student_list, student_name);

    updateTotalState(student_name);
    total_student_input.value = "";
    loadDeleteEvent();
  }

  function loadTotalStudent() {
    return JSON.parse(localStorage.getItem("total_student")) || [];
  }

  function loadQueueStudent() {
    return JSON.parse(localStorage.getItem("queue_student")) || [];
  }

  function updateTotalState(name = "") {
    if (name != "") {
      total_student_array.push(name);
    }
    localStorage.setItem("total_student", JSON.stringify(total_student_array));
  }

  function updateQueueState(name = "") {
    if (name != "") {
      queue_student_array.push(name);
    }
    localStorage.setItem("queue_student", JSON.stringify(queue_student_array));
  }

  function init_setup() {
    total_student_array.forEach((student_name) => {
      insertItemToHtmlList(total_student_list, student_name);
    });

    queue_student_array.forEach((student_name) => {
      insertItemToHtmlList(queue_student_list, student_name);
    });
  }

  function insertItemToHtmlList(list_node, list_text) {
    let student_node = document.createElement("li");
    let student_name_text_node = document.createTextNode(list_text);

    student_node.appendChild(student_name_text_node);
    list_node.appendChild(student_node);
  }

  // Delete Item From List

  loadDeleteEvent();

  function loadDeleteEvent() {
    document.querySelectorAll(".total-student-list li").forEach((el) => {
      el.onclick = (e) => {
        let theElement = e.srcElement;
        let student_name = theElement.innerText;

        let student_index = total_student_array.indexOf(student_name);

        if (student_index > -1) {
          total_student_array.splice(student_index, 1);
          updateTotalState();
        }

        total_student_list.removeChild(e.srcElement);
      };
    });

    document.querySelectorAll(".queue-student-list li").forEach((el) => {
      el.onclick = (e) => {
        let theElement = e.srcElement;
        let student_name = theElement.innerText;

        let student_index = queue_student_array.indexOf(student_name);

        if (student_index > -1) {
          queue_student_array.splice(student_index, 1);
          updateQueueState();
        }

        queue_student_list.removeChild(e.srcElement);
      };
    });
  }

  // Searching Student
  search_student_input.onkeyup = (e) => {
    search_term = search_student_input.value;

    let break_condition = e.key == "," || e.key == "Enter";
    if (break_condition) {
      addStudentToQueueList();
    }

    search_student_array = [];
    if (search_term.trim() == "") {
      updateSearchList();
      return;
    }
    total_student_array.forEach((student) => {
      if (student.toLowerCase().includes(search_term.toLowerCase())) {
        if (!search_student_array.includes(student)) {
          if (search_student_array.length < 1) {
            search_student_array.push(student);
          }
        }
      }
    });
    updateSearchList();
  };

  function updateSearchList() {
    search_result_list.innerHTML = "";
    search_student_array.forEach((student) => {
      insertItemToHtmlList(search_result_list, student);
    });
  }

  function addStudentToQueueList() {
    let student_name = search_student_array[0];
    if (queue_student_array.includes(student_name) || student_name === undefined) {
      total_student_input.value = "";
      search_student_input.value = "";
      return;
    }

    insertItemToHtmlList(queue_student_list, student_name);

    updateQueueState(student_name);
    search_student_input.value = "";
    search_student_array = [];
    loadDeleteEvent()
  }

  document.querySelector(".find-missing-student-button").onclick = () => {
    findMissing();
  };

  function findMissing() {
    total_students = total_student_array.length;
    let req_body = {
      total: total_students,
      total_student_list: total_student_array,
      queue_student_list: queue_student_array,
    };

    document.querySelector(".progress").style.display = "block"

    fetch("https://missing-student-finder.herokuapp.com/api", {
      method: "POST",
      body: JSON.stringify(req_body),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((res) => res.json())
      .then((data) => {
        document.querySelector(".total-students-count").innerHTML =
          data.total_count;
        document.querySelector(".missing-students-count").innerHTML =
          data.missing_count;
        // document.querySelector(".missing-students-list").innerHTML =
        //   data.missing_student_list;
        addStudentToMissingList(data.missing_student_list);
        document.querySelector(".progress").style.display = "none"
      });
  }

  function addStudentToMissingList(missig_studets) {
    missing_students_list.innerHTML = ""
    missig_studets.forEach((student_name) => {
      insertItemToHtmlList(missing_students_list, student_name)
    })
  }

};
