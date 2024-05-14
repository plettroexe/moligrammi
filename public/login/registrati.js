const Nome = document.getElementById("Nome");
const pass = document.getElementById("Password");
const confPass = document.getElementById("Password1");
const conferma = document.getElementById("conferma");

const RegisterButton = document.getElementById("Register");

const register = (arrayUtenze) => {
  return new Promise((resolve, reject) => {
    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arrayUtenze),
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

RegisterButton.onclick = () => {
  let arrayutenze = {
    username: Nome.value,
    password: pass.value,
  };

  if(pass.value === confPass.value && verificaEmail(arrayutenze.username)){
  register(arrayutenze)
    .then((response) => {
      console.log("Response from server:", response);
      stampaConferma();
    })
    .catch((error) => {
      console.error("Error:", error);
    });


  window.location.href = "/login";
  }
};

function stampaConferma() {
      conferma.innerText = "Bravo, ti sei registrato!";
  }

function verificaEmail(email) {
   
    const partiEmail = email.split('@');
    const dominio = partiEmail[1];

   
    if (partiEmail.length === 2 && dominio === 'itis-molinari.eu') {
        
        return true;
    } else {
        return false;
    }
}
