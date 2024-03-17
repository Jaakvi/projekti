import "./style.css";
import { fetchData } from "./fetch.js";

document.addEventListener("DOMContentLoaded", function () {
  // Luo uusi img-elementti
  const kuva = document.createElement("img");

  // Aseta kuvan lähde (URL)
  kuva.src = "./taustakuva6.jpg";

  // Lisää kuva ennen h3-elementtiä
  const otsikko = document.querySelector("h3");
  otsikko.parentNode.insertBefore(kuva, otsikko);

  // JavaScript code
  document.getElementById("loginButton").addEventListener("click", function () {
    document.getElementById("loginDialog").showModal();
  });

  const loginUser = document.querySelector(".loginuser");

  loginUser.addEventListener("click", async (evt) => {
    evt.preventDefault();
    console.log("Nyt logataan sisään");

    // # Login
    // POST http://localhost:3000/api/auth/login
    // content-type: application/json

    // {
    //   "username": "user",
    //   "password": "secret"
    //  }

    const url = "hyte-servu.northeurope.cloudapp.azure.com/api/auth/login";

    const form = document.querySelector(".login_form");

    const body = {
      username: form.querySelector("input[name=username]").value,
      password: form.querySelector("input[name=password]").value,
    };

    const options = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    };

    fetchData(url, options).then((data) => {
      // käsitellään fetchData funktiosta tullut JSON
      console.log(data);
      console.log(data.token);
      localStorage.setItem("token", data.token);
      // kannattaa fetch.js palauttaa BE puolen validointi virheen joka käsitellään
      if (data.token === undefined) {
        alert("Unauth user: Käyttäjänimi tai salasana ei oikein");
      } else {
        alert("Kirjautuminen onnistui.");
        window.location.href = "home.html";
      }
      logResponse(
        "loginResponse",
        `localStorage set with token value: ${data.token}`
      );
    });
  });
  // Add event listener for the new input field to close the dialog
  document
    .getElementById("closeDialogButton")
    .addEventListener("click", function () {
      document.getElementById("loginDialog").close();
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Get the login dialog and register dialog
  const loginDialog = document.getElementById("loginDialog");
  const registerDialog = document.getElementById("register_dialog");
  // Get the switch button and add event listener
  const switchToRegisterButton = document.getElementById("switchToRegister");
  switchToRegisterButton.addEventListener("click", function () {
    // Close the login dialog
    loginDialog.close();
    // Show the register dialog
    registerDialog.showModal();
  });

  const createUser = document.querySelector(".createuser");

  
  createUser.addEventListener("click", async (evt) => {
    evt.preventDefault();
    console.log("Nyt luodaan käyttäjä");
    const url = "hyte-servu.northeurope.cloudapp.azure.com/api/users";

    // # Create user
    // POST http://127.0.0.1:3000/api/users
    // content-type: application/json

    const form = document.querySelector(".create_user_form");

    if (!form.checkValidity()) {
      // If the form is not valid, show the validation messages
      form.reportValidity();
      return; // Exit function if form is not valid
    }

    const username = form.querySelector("input[name=username]").value;

    const body = {
      username: username,
      password: form.querySelector("input[name=password]").value,
      email: form.querySelector("input[name=email]").value,
    };

    const options = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    };

    fetchData(url, options).then((data) => {
      // käsitellään fetchData funktiosta tullut JSON
      console.log(data);
      alert("Rekistöröinti onnistui")
    });
    registerDialog.close();
    // Open the login dialog
    loginDialog.showModal();
  });
  document
    .getElementById("closeRegisterButton")
    .addEventListener("click", function () {
      document.getElementById("register_dialog").close();
      document.getElementById("loginDialog").showModal()
    });
});
