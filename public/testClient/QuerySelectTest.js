const Button = document.getElementById("GetAllPost");

//getAllPost
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

//getPostBy
const getPostBy = (idprofilo) => {
  return new Promise((resolve, reject) => {
    fetch("/postby", {
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

//getProfileDetails
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

//getSeguiti
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
//getNomeUtente
const getNomeUtente  = (idprofilo) => {
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
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// getFollowers
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

//PROFILO GetPostByTag
const getPostByTag = (nomeTag) => {
  return new Promise((resolve, reject) => {
    fetch("/postbytag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nomeTag: nomeTag }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella richiesta");
        }
        return response.json();
      })
      .then((json) => {
        resolve(json.id);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


// getBest
const getBest = () => {
  return new Promise((resolve, reject) => {
    fetch("/profilo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella richiesta");
        }
        return response.json();
      })
      .then((json) => {
        resolve(json.id);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
//PROFILO GETID
const getIDProfilo = (username) => {
  return new Promise((resolve, reject) => {
    fetch("/profilo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella richiesta");
        }
        return response.json();
      })
      .then((json) => {
        resolve(json.id);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const username = "Angelo";
Button.onclick = () => {
  //TEST POST
  getAllPost()
    .then((result) => {
      console.log("getAllPost", result); //Restituisce Matrice Vuota (per ora)
    })
    .catch((error) => {
      console.error("Error", error);
    });

  //TEST POST Specifico ID
  getPostBy(1)
    .then((result) => {
      console.log("getPostBy", result); //Restituisce vuoto per ora
    })
    .catch((error) => {
      console.error("Error", error);
    });

  //TEST POST profiloDetails BY ID
  getProfileDetails(1)
    .then((result) => {
      console.log("getProfileDetails", result); //Restituisce vuoto per ora
    })
    .catch((error) => {
      console.error("Error", error);
    });

  //TEST POST getSeguiti BY ID
    getSeguiti(1)
    .then((result) => {
      console.log("getSeguiti", result); //Restituisce vuoto per ora
    })
    .catch((error) => {
      console.error("Error", error);
    });

  //TEST POST getPostByTag BY ID
    getPostByTag("#NoScuola")
  .then((result) => {
    console.log("getPostByTag", result); //Restituisce vuoto per ora
  })
  .catch((error) => {
    console.error("Error", error);
  });

  //TEST POST getBest BY ID
  getBest("")
  .then((result) => {
    console.log("getBest", result); //Restituisce vuoto per ora
  })
  .catch((error) => {
    console.error("Error", error);
  });
  
  //Test getNomeUtente & getFollowers
  getNomeUtente(1)
  .then((nome) => {
    console.log("Nome",nome)
    getFollowers(nome)
    .then((followers) => {
      console.log("Followers",followers);
    }) 
      .catch((error) => {
      console.error("Errore", error);
    })
    .catch((error) => {
      console.error("Errore", error);
    });
  })
  
  //TEST
  getIDProfilo(username)
    .then((id) => {
      console.log("getIDProfilo", id);
    })
    .catch((error) => {
      console.error("Errore durante il recupero dell'ID del profilo:", error);
    });
  
};
