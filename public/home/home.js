
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

//FUNZIONE PER VISUALIZZARE I POST NELLA HOME PAGE 
const getAllPost = () => {
  return new Promise((resolve, reject) => {
    fetch("/homepage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
//CREA POST
const creaPost  = (postData) => {
  return new Promise((resolve, reject) => {
    fetch("/creaPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
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
//cambia creaPostButton con il tuo const
creaPostButton.onclick = () => {////creaPostButton è solo un'esempio
    const postData = {
        username: "",
        tag: "",
        posizione:"",
        descrizione: "",
        immagine: "",
        dataora: "",
        idProfilo: ""
    }
    creaPost(postData)
    .then((response) => {
        console.log("successo", response);
        
    })
    .catch((error) => {
        console.log("errore",error);
    })
}





//FUNZIONE PER VISUALIZZARE I POST DI UN PROFILO A SCELTA ( ANCHE IL PROPRIO), PRENDE IN INGRESSO L'ID DEL PROFILO. 
const getPostBy = (NomeProfilo) => {
  return new Promise((resolve, reject) => {
    fetch("/postby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idProfilo: NomeProfilo }),
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


//Prendi i follower
const getSeguiti  = (idprofilo) => {
  return new Promise((resolve, reject) => {
    fetch("/getSeguiti", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idProfilo: idprofilo }),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json.seguiti);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


//Buttone Follow
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

//insertLikeCommentoButton cambia con il tuo buttone const
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



