
const Nome = document.getElementById("Nome");
const pass = document.getElementById("Password");

const SequiButton = document.getElementById("Sequi");

const insertSeguire = (array) => {
  return new Promise((resolve, reject) => {
    fetch("/insertSeguire", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(array),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Cache remota
  SequiButton.onclick = () => {
  let arrayutenze = {
    username: "",
    name: "",
    idProfilo: 1
  };

    insertSeguire(arrayutenze)
    .then((response) => {
      console.log("Response from server:", response);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  window.location.href = "/login/login.html";
};


//DELETE
const deleteSeguiButton = document.getElementById("deleteSegui");

const deleteSegui = (array) => {
  return new Promise((resolve, reject) => {
    fetch("/deleteSegui", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(array),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Cache remota
 deleteSeguiButton.onclick = () => {
  let arrayutenze = {
      nomeUtente: "",
    id: idProfilo
  };

      deleteSegui(arrayutenze)
    .then((response) => {
      console.log("Response from server:", response);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  window.location.href = "/login/login.html";
};


//insertLikeCommento
const insertLikeCommento = (array) => {
  return new Promise((resolve, reject) => {
    fetch("/insertInterazione", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(array),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


   insertLikeCommentoButton.onclick = () => {
  let ARRAY = {
        codice: "",//
        commento: "",//Inserisci commento.value 
        name: "Angelo",
        idPost: 1
  };

        insertLikeCommento(ARRAY)
    .then((response) => {
      console.log("Response from server:", response);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  window.location.href = "/login/login.html";
};

