import "./style.css";
import { fetchData } from "./fetch.js";

async function renderUsername() {
  console.log("Haetaan käyttäjän tiedot");
  const url = "http://localhost:3000/api/auth/me";
  let token = localStorage.getItem("token");
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer: " + token,
    },
  };
  fetchData(url, options).then((data) => {
    console.log(data);
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
      const info = data.user.username;
      const info2 = data.user.email;
      const info3 = data.user.user_level;
      infoDialog(info, info2, info3);
      // reset form fields after successful submission;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function infoDialog(info, info2, info3) {
  // Get the dialog and dialog text elements
  const dialog = document.getElementById("information");
  const dialogText = document.getElementById("userinfo");

  // Clear previous content
  dialogText.innerHTML = "";

  // Create three paragraph elements
  const information = document.createElement("h4");
  const username = document.createElement("p");
  const email = document.createElement("p");
  const user_level = document.createElement("p");

  // Set text content for each paragraph
  information.textContent = "User information: ";
  username.textContent = "Username: " + info;
  email.textContent = "Email: " + info2;
  user_level.textContent = "User level: " + info3;

  // Append paragraphs to dialog text
  dialogText.appendChild(information);
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
  window.location.replace("index.html");
}

// Call renderUI function when the page loads or component renders
renderUsername();
// tämä toimi ennen autentikaatiota, nyt tarvitsee tokenin, siistitään pian!
// sivuille on nyt myös lisätty navigaatio html sivuun, sekä siihen sopiva CSS koodi, hae siis uusi HTML ja UUSI CSS ennen kun aloitat
