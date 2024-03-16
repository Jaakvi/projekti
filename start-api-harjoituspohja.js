import "./style.css";
import { fetchData } from "./fetch.js";

async function getUserID() {
  const url = "http://localhost:3000/api/auth/me";
  const token = localStorage.getItem("token");

  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to fetch user data. Status: " + response.status);
    }

    const data = await response.json();
    if (!data.user || !data.user.user_id) {
      throw new Error("Invalid response format. User ID not found.");
    }

    return data.user.user_id;
  } catch (error) {
    console.error("Error fetching user ID:", error.message);
    return null; // Return null if an error occurs
  }
}

/*const bt1 = document.querySelector(".get_entry");
bt1.addEventListener("click", async (event) => {
  event.preventDefault();

  console.log("klikki toimii");

  const url = "http://localhost:3000/api/entries"; // Using the retrieved user ID

  let tokeni = localStorage.getItem("token");

  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer: " + tokeni,
    },
  };

  console.log(options);

  fetchData(url, options)
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}); */

/*const allButton = document.querySelector(".get_users");
allButton.addEventListener("click", getUsers);

async function getUsers() {
  console.log("Haetaan kaikki käyttäjät");

  const url = "http://localhost:3000/api/users";
  let tokeni = localStorage.getItem("token");

  const options = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: "Bearer: " + tokeni,
    },
  };
  fetchData(url, options).then((data) => {
    // käsitellään fetchData funktiosta tullut JSON
    console.log(data);
    // document.getElementById("name").innerHTML = data.user.username;
  });
} */
const allButton = document.querySelector(".get_users");
allButton.addEventListener("click", getEntries);

async function getEntries() {
  console.log("Haetaan kaikki entriet");

  const url = "http://localhost:3000/api/entries";
  let tokeni = localStorage.getItem("token");

  const options = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: "Bearer: " + tokeni,
    },
  };
  fetchData(url, options).then((data) => {
    // käsitellään fetchData funktiosta tullut JSON
    console.log(data);
    createTable(data);
    // document.getElementById("name").innerHTML = data.user.username;
  });
}

function createTable(data) {
  const tbody = document.querySelector(".tbody");
  tbody.innerHTML = "";

  data.forEach((rivi) => {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerText = formatDate(rivi.entry_date);
    tr.appendChild(td1);

    const td2 = document.createElement("td");
    td2.innerText = rivi.mood;
    tr.appendChild(td2);

    const td3 = document.createElement("td");
    td3.innerText = rivi.sleep_hours + " h";
    tr.appendChild(td3);

    const td4 = document.createElement("td");

    const noteButton = document.createElement("button");
    noteButton.className = "check";
    noteButton.innerText = "Notes";

    noteButton.addEventListener("click", function () {
      const notes = rivi.notes;
      openDialog(notes);
    });

    td4.appendChild(noteButton);
    tr.appendChild(td4);

    const td5 = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "del";
    deleteButton.dataset.id = rivi.entry_id;
    deleteButton.textContent = "Delete";
    td5.appendChild(deleteButton);
    deleteButton.addEventListener("click", deleteUser);

    const td6 = document.createElement("td");
    td6.innerText = rivi.entry_id;

    tr.appendChild(td5);
    tr.appendChild(td6);

    tbody.appendChild(tr);
  });
}

// funktio aika EU formattiin (dd.mm.yyyy)
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function openDialog(notes) {
  const dialog = document.getElementById("notesDialog");
  const header = document.getElementById("header");
  const dialogText = document.getElementById("dialogText");
  header.innerHTML = "";

  const notesHeader = document.createElement("h4");
  notesHeader.textContent = "Notes: ";
  dialogText.innerText = notes;

  header.appendChild(notesHeader);
  dialog.showModal();
}

// Sulje dialogi
document.getElementById("closeNotes").addEventListener("click", function () {
  document.getElementById("notesDialog").close();
});

function getUser(evt) {
  console.log("klikkasit info nappulaa");
  const id = evt.target.attributes["data-id"].value;
  console.log(id);
}

function deleteUser(evt) {
  console.log("klikkasit delete nappulaa", evt);
  const id = evt.target.attributes["data-id"].value;

  const id2 = evt.target.parentElement.nextElementSibling.textContent;

  const url = "http://localhost:3000/api/entries/" + id;
  let tokeni = localStorage.getItem("token");

  const options = {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: "Bearer: " + tokeni,
    },
  };

  const answer = confirm("Oletko varma, että haluat poistaa entryn: " + id);
  if (answer) {
    fetchData(url, options).then((data) => {
      // käsitellään fetchData funktiosta tullut JSON
      console.log(data);
      getEntries();
    });
  }
}

const createDiary = document.querySelector(".creatediary");

createDiary.addEventListener("click", async (evt) => {
  evt.preventDefault();
  console.log("Nyt luodaan Diary entry");

  // # Create user
  // POST http://127.0.0.1:3000/api/users
  // content-type: application/json

  const form = document.querySelector(".addform");
  const entryDate = form.querySelector("input[name=entry_date]").value;
  const mood = form.querySelector("select[name=mood]").value;
  const weight = form.querySelector("input[name=weight]").value;
  const sleepHours = form.querySelector("input[name=sleep_hours]").value;
  const notes = form.querySelector("textarea[name=notes]").value;
  const userId = await getUserID();
  console.log(userId);

  const clearform = document.querySelector(".clearform");

  clearform.addEventListener("click", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    const clearButton = getElementById("clearbutton");

    // Clear the formatted information
    clearButton.textContent = "";
  });

  const url = "http://127.0.0.1:3000/api/entries";
  let tokeni = localStorage.getItem("token");

  const body = {
    user_id: userId,
    entry_date: entryDate,
    mood: mood,
    weight: weight,
    sleep_hours: sleepHours,
    notes: notes,
  };

  console.log(body);

  const options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: "Bearer: " + tokeni,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body), // body data type must match "Content-Type" header
  };

  fetchData(url, options)
    .then((data) => {
      console.log(data);
      // reset form fields after successful submission
      getEntries();
      form.reset();
      alert("Tallennus onnistui!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Täytä kaikki kentät!")
    });
});

async function showUserName() {
  console.log("Täällä ollaan!");
  const url = "http://localhost:3000/api/auth/me";
  let tokeni = localStorage.getItem("token");

  const options = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: "Bearer: " + tokeni,
    },
  };
  fetchData(url, options).then((data) => {
    // käsitellään fetchData funktiosta tullut JSON
    document.getElementById("name").innerHTML = data.user.username;
  });
}

document.querySelector(".user_info").addEventListener("click", getUserInfo);

async function getUserInfo() {
  const url = "http://localhost:3000/api/auth/me";
  const token = localStorage.getItem("token");

  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  fetchData(url, options)
    .then((data) => {
      console.log(data);
      const info = formatDate(data.user.created_at);
      const info1 = data.user.username;
      const info2 = data.user.email;
      const info3 = data.user.user_level;
      infoDialog(info, info1, info2, info3);
      // reset form fields after successful submission;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function infoDialog(info, info1, info2, info3) {
  // Get the dialog and dialog text elements
  const dialog = document.getElementById("information");
  const dialogText = document.getElementById("userinfo");

  // Clear previous content
  dialogText.innerHTML = "";

  // Create three paragraph elements
  const information = document.createElement("h4");
  const created = document.createElement("p");
  const username = document.createElement("p");
  const email = document.createElement("p");
  const user_level = document.createElement("p");

  // Set text content for each paragraph
  information.textContent = "User information: ";
  created.textContent = "User created: " + info;
  username.textContent = "Username: " + info1;
  email.textContent = "Email: " + info2;
  user_level.textContent = "User level: " + info3;

  // Append paragraphs to dialog text
  dialogText.appendChild(information);
  dialogText.appendChild(created);
  dialogText.appendChild(username);
  dialogText.appendChild(email);
  dialogText.appendChild(user_level);

  // Show the dialog
  dialog.showModal();
}

document.getElementById("closeInfo").addEventListener("click", function () {
  document.getElementById("information").close();
});

document.querySelector(".logout").addEventListener("click", logOut);

function logOut(evt) {
  evt.preventDefault();
  localStorage.removeItem("token");
  console.log("logginout");
  window.location.href = "index.html";
}

showUserName();
