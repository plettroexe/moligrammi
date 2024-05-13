const home = document.getElementById("home");
const modal = new bootstrap.Modal("#Modal", {});
const buttModal = document.getElementById("buttonModal");

buttModal.onclick = async () => {

    modal.show();

}



const templateCard = `
<div class="col-md-4 mt-3">
<div class="card">
    <img src="data:image/jpeg;base64,{src}" class="card-img-top" alt="...">
    <div class="card">
                            <div class="card-body">
                                <p class="card-like">Like 0</p>
                                <p class="card-comments">Commenti 0</p>
                            </div>
                        </div>
</div>
</div>
`;

function renderPost() {



}

renderPost();
//FUNZIONE PER VISUALIZZARE LE INFO DI UN PROFILO SCELTO ( ANCHE IL PROPRIO), PRENDE IN INGRESSO L'ID DEL PROFILO.
const getProfileDetails = (idprofilo) => {
  return new Promise((resolve, reject) => {
    fetch("/profileby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idProfilo: idprofilo }),
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


const getFollowers  = (nomeUtente) => {
  return new Promise((resolve, reject) => {
    fetch("/getFollowers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome: nomeUtente }),
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


//Cancella segui 
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

//Aggiorna i follower ogni volta che l'azione deleteSegui avviene
const updateFollowers  = (id) => {
  return new Promise((resolve, reject) => {
    fetch("/updateFollowers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
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
