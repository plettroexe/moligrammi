
const home = document.getElementById("home");
const modal = new bootstrap.Modal("#Modal", {});
const buttModal = document.getElementById("buttonModal");
const divLog = document.getElementById("divLog");
const caption = document.getElementById("caption");
const image = document.getElementById("immagini");
let log = sessionStorage.getItem('log');
const posta = document.getElementById("posta");

buttModal.onclick = () => {

    modal.show();

}

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
        console.log("post: ", json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

getAllPost();

const templateCard = `
<div class="col-md-4 mt-3">
<div class="card">
    <img src="data:image/jpeg;base64,{src}" class="card-img-top" alt="...">
    <div class="card">
     <div class="card-body">
     <p id="caption">{caption}</p>
     <p class="card-like">Like 0</p>
     <p class="card-comments">Commenti 0</p>
     </div>
    </div>
</div>
</div>
`;

const renderPosts = () => {
  let html = "";
  getAllPost().then((posts) => {
    posts.forEach((post) => {
      let cardHtml = templateCard.replace("{src}", post.image);
      html += cardHtml;
    });
    document.getElementById("container").innerHTML = html;
  }).catch((error) => {
    console.error("Errore durante il recupero dei post:", error);
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

let postData = {};

//cambia creaPostButton con il tuo const
posta.onclick = () => {////creaPostButton è solo un'esempio
    postData = {
        descrizione: "",
        immagine: "",
    }
    creaPost(postData)
    .then((response) => {
        console.log("successo", response);
        renderPosts();
        
    })
    .catch((error) => {
        console.log("errore",error);
    })
}



/*

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
*/


