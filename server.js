
const mysql = require("mysql2");
const conf = require("./conf.js");
const connection = mysql.createConnection(conf);
const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
server.listen(80, () => {
  console.log("- server running");
});

//FUNZIONE PER L'ESECUZIONE DELLE QUERY
const executeQuery = (sql) => {
   return new Promise((resolve, reject) => {      
         connection.query(sql, function (err, result) {
            if (err) {
               console.error(err);
               reject();     
            } 
            resolve(result);         
      });
   })
}

// FUNZIONE PER LA LOGIN (RICHIEDE NOME E PASSWORD DAL CLIENT) SE LA LOGIN FUNZIONA, BISOGNA SALVARE NELLA CACHE REMOTA IL NOME UTENTE
const checkLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    const template =" SELECT password FROM utente WHERE nomeutente = '%USERNAME' AND password = '%PASSWORD'";
    const sql = template.replace("%USERNAME", username).replace("%PASSWORD", password);
    executeQuery(sql)
      .then((result) => {
        if (result.length > 0) {
          resolve(true); 
          console.log("LOGIN EFFETTUATO");
        } else {
          resolve(false);
           console.log("CREDENZIALI SBAGLIATE");
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username + " - " + password);
  checkLogin(username, password)
    .then((result) => {
      if (result === true) {
        res.json({ result: "true" });
      } else {
        res.status(401).json({ result: "false" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ result: "Internal Server Error" });
    });
});

// FUNZIONI PER LA REGISTRAZIONE (RICHIEDE NOME E PASSWORD DAL CLIENT), SALVA NEL DB IL NUOVO UTENTE E NE CREA IL PROFILO, SE LA REGISTRAZIONE FUNZIONA, BISOGNA SALVARE NELLA CACHE REMOTA IL NOME UTENTE
const checkSignIn = (username, password) => {
  if(username.length<1 || password.length<1){
    return false;
  }else{
  return new Promise((resolve, reject) => {
    const template =" SELECT nomeutente FROM utente WHERE nomeutente = '%USERNAME'";
    const sql = template.replace("%USERNAME", username);
    executeQuery(sql)
      .then((result) => {
        if (result.length > 0) {
          resolve(true); 
          console.log("UTENTE GIÀ REGISTRATO");
        } else {
           console.log("INSERIMENTO UTENTE NUOVO");
          insertUtente(username, password);
          creaProfilo(username);
          resolve(username);
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
  }
};
const insertUtente = (username, password) => {
    const template =" INSERT INTO utente (nomeutente, password) VALUES ('%USERNAME','%PASSWORD')";
    const sql = template.replace("%USERNAME", username).replace("%PASSWORD", password);
    executeQuery(sql)
};


const creaProfilo = (username) => {
    const template =" INSERT INTO profilo ( seguiti, followers,nomeUtente) VALUES ('0','0','%USERNAME')";
    const sql = template.replace("%USERNAME", username);
    executeQuery(sql);
};

  app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username + " - " + password);
    checkSignIn(username, password).then((result)=>{
      res.json({ username: result });
    });
  });
//FUNZIONE PER PRENDERE L'ID DEL PROPRIO PROFILO, DA RICHIAMARE SUBITO DOPO LA LOGIN/SIGNIN E SALVARE IN CACHE REMOTA L'ID

const getIDProfilo= (username) => {
  return new Promise((resolve, reject) => {
    const template =" SELECT id FROM Profilo WHERE nomeutente='%USERNAME'";
    const sql = template.replace("%USERNAME", username);
    executeQuery(sql).then((result)=>{
      resolve(result);
    })
  });
};
app.post("/profilo", (req, res) => {
  const username = req.body.username;
getIDProfilo(username).then((result)=>{
    res.json({ id: result });
  });
});

//FUNZIONI PER CREARE IL POST PRENDE IN INGRESSO LE COSE INSERITE DA TASTIERA E IL NOME UTENTE E L'ID DEL PROFILO SALVATI IN CACHE. SE L'UTENTE METTERA' IL TAG, ANDRA' NEL DIZIONARIO DI INPUT COL NOME SCELTO PER IL TAG COME VALORE PER L'APPOSITA CHIAVE "TAG", INVECE SE L'UTENTE NON VUOLE METTERE UN TAG, ANDRA' NEL DIZIONARIO DI INPUT: "" COME CHIAVE DI"TAG"
const creaPost = (username,idProfilo, dataora, descrizione, immagine, posizione, nomeTag ) => {
    const template ="INSERT INTO Post (dataora,immagine, descrizione, likes, posizione, nomeUtente, IdProfilo, nomeTag) VALUES ('%DATAORA','%IMMAGINE','%DESCRIZIONE','0','%POSIZIONE','%USERNAME','%IDPROFILO','%NOMETAG')";
    const sql = template.replace("%DATAORA", dataora).replace("%IMMAGINE",immagine).replace( "%DESCRIZIONE", descrizione).replace("%POSIZIONE", posizione).replace("%USERNAME", username).replace("%IDPROFILO", idProfilo).replace("%NOMETAG", nomeTag);
    executeQuery(sql)

};

const usaTag=(nomeTag)=>{
    const template =" SELECT nome, utilizzi FROM tag WHERE nome = '%NAME'";
    const sql = template.replace("%NAME", nomeTag);
    executeQuery(sql)
      .then((result) => {
        if (result.length > 0) { 
          console.log("ESISTE GIÀ UN TAG CON QUESTO NOME");
          aggiornaTag(nomeTag, result.utilizzi);
        } else {
           console.log("CREAZIONE NUOVO TAG");
           creaTag(nomeTag);
        }
      });
}

const creaTag=(name)=>{
  const template =" INSERT INTO tag ( nome, utilizzi) VALUES ('%NAME','1')";
  const sql = template.replace("%NAME", name);
  executeQuery(sql);
}

const aggiornaTag=(name, utilizzi)=>{
  utilizzi++;
  const template =" UPDATE tag SET utilizzi='%UTILIZZI' WHERE nome='%NAME'";
  const sql = template.replace("%NAME", name).replace( "%UTILIZZI", utilizzi);
  executeQuery(sql);
}

app.post("/creaPost", (req, res) => {
  const username = req.body.username;
  const tag = req.body.tag;
  const posizione = req.body.posizione;
  const descrizione = req.body.descrizione;
  const immagine = req.body.immagine;
  const dataora = req.body.dataora;
  const idProfilo = req.body.idProfilo;
  if(tag===""){
    creaPost(username,idProfilo, dataora, descrizione, immagine, posizione, tag);
  }else{
    usaTag(tag);
    creaPost(username,idProfilo, dataora, descrizione, immagine, posizione, tag);
  }
});

//FUNZIONE PER VISUALIZZARE I POST NELLA HOME PAGE (DA RANDOMIZZARE NELLA STAMPA;

const getAllPost= () => {
  return new Promise((resolve, reject) => {
    const template =" SELECT * FROM Post ";
    const sql = template;
    executeQuery(sql).then((result)=>{
      resolve(result); //RESTITUISCE UNA MATRICE CONTENENTE TUTTI I VALORI DI TUTTI I POST
    })
  });
};
app.post("/homepage", (req, res) => {
getAllPost().then((result)=>{
    res.json({ matrice: result });
  });
});
//FUNZIONE PER VISUALIZZARE I POST NELLA HOME PAGE IN ORDINE DECRESCENTE DAI LIKE (dal più piaciuto al meno piaciuto)

const getBest= () => {
  return new Promise((resolve, reject) => {
    const template =" SELECT * FROM Post ORDER BY likes DESC";
    const sql = template;
    executeQuery(sql).then((result)=>{
      resolve(result); //RESTITUISCE UNA MATRICE CONTENENTE TUTTI I VALORI DI TUTTI I POST IN ORDINE
    })
  });
};
app.post("/theBest", (req, res) => {
getBest().then((result)=>{
    res.json({ matrice: result });
  });
});

//FUNZIONE PER VISUALIZZARE I POST DI UN PROFILO A SCELTA ( ANCHE IL PROPRIO), PRENDE IN INGRESSO L'ID DEL PROFILO.

const getPostBy = (idProfilo) => {
  return new Promise((resolve, reject) => {
    const template =" SELECT * FROM Post WHERE IdProfilo='%IDPROFILO'";
    const sql = template.replace( "%IDPROFILO", idProfilo);
    executeQuery(sql).then((result)=>{
      resolve(result); //RESTITUISCE UNA MATRICE CONTENENTE TUTTI I VALORI DI TUTTI I POST DEL PROFILO
    })
  });
};

app.post("/postby", (req, res) => {
getPostBy(req.idProfilo).then((result)=>{
    res.json({ matrice: result });
  });
});

//FUNZIONE PER VISUALIZZARE LE INFO DI UN PROFILO SCELTO ( ANCHE IL PROPRIO), PRENDE IN INGRESSO L'ID DEL PROFILO.

const getProfileBy = (idProfilo) => {
  return new Promise((resolve, reject) => {
    const template =" SELECT * FROM Profilo WHERE id='%IDPROFILO'";
    const sql = template.replace( "%IDPROFILO", idProfilo);
    executeQuery(sql).then((result)=>{
      resolve(result); //RESTITUISCE UN ARRAY CONTENENTE TUTTI I VALORI DEL PROFILO
    })
  });
};

app.post("/profileby", (req, res) => {
getProfileBy(req.idProfilo).then((result)=>{
    res.json({ array: result });
  });
});

//FUNZIONE PER VISUALIZZARE TUTTI I PROFILI CHE SI SEGUONO, FA VEDERE IL NOME, I FOLLOWER E I SEGUITI DI TUTTI GLI ACCOUNT E DA ANCHE L'ID PROFILO DI OGNUNO COSICCHE UNO POSSA ANDARE A VEDERE UN PROFILO CLICCANDO SUL NOME.

//PRENDE IN INGRESSO O L'ID DI UN PROFILO SELEZIONATO, DI UN UTENTE O IL PROPRIO
const getSeguiti = (idProfilo) => {
  return new Promise((resolve, reject) => {
    const template =" SELECT * FROM Profilo JOIN segue ON segue.IdProfilo='%IDPROFILO'";
    const sql = template.replace( "%IDPROFILO", idProfilo);
    executeQuery(sql).then((result)=>{
      resolve(result); //RESTITUISCE UNA MATRICE CONTENENTE TUTTI I VALORI DEI PROFILI CHE SEGUONO L'INPUT
    })
  });
};

app.post("/getSeguiti", (req, res) => {
getSeguiti(req.idProfilo).then((result)=>{
    res.json({ seguiti: result });
  });
});

//FUNZIONE PER VISUALIZZARE TUTTI I FOLLOWERS DI UN PROFILO, FA VEDERE IL NOME, I FOLLOWER E I SEGUITI DI TUTTI GLI ACCOUNT E DA ANCHE L'ID PROFILO DI OGNUNO COSICCHE UNO POSSA ANDARE A VEDERE UN PROFILO CLICCANDO SUL NOME.

//PRENDE IN INGRESSO IL NOME DI UN PROFILO SELEZIONATO: SE E' DEL PROPRIO PROFILO BASTA PRENDERLO DALLA CACHE, ALTRIMENTI USARE LA PRIMA FUNZIONE APP GETNOME QUI SOTTO INSERENDO L'ID DEL PROFILO DESIDERATO.


const getNomeUtente = (idProfilo) => {
  return new Promise((resolve, reject) => {
    const template =" SELECT nomeUtente FROM Profilo WHERE id='%IDPROFILO'";
    const sql = template.replace( "%IDPROFILO", idProfilo);
    executeQuery(sql).then((result)=>{
      resolve(result); 
    })
  });
};
app.post("/getNomeUtente", (req, res) => {
getNomeUtente(req.idProfilo).then((result)=>{
    res.json({ nome: result });
  });
});

const getFollowers = (nome) => {
  return new Promise((resolve, reject) => {
    const template =" SELECT * FROM Profilo JOIN segue ON segue.nomeUtente='%NOMEUTENTE'";
    const sql = template.replace( "%NOMEUTENTE", nome);
    executeQuery(sql).then((result)=>{
      resolve(result); //RESTITUISCE UNA MATRICE CONTENENTE TUTTI I VALORI DEI PROFILI CHE SEGUONO L'INPUT
    })
  });
};
app.post("/getFollowers", (req, res) => {
getFollowers(req.nome).then((result)=>{
    res.json({ followers: result });
  });
});

//FUNZIONE PER CANCELLARE UN POST PROPRIO, PRENDE IN INGRESSO L'ID DEL POST DA CANCELLARE

const deletePost=(idPost) => {
    const template =" DELETE FROM utente WHERE Id='%IDPOST'";
    const sql = template.replace("%IDPOST", idPost);
    executeQuery(sql)
};
app.post("/deletePost", (req, res) => {
deletePost(req.id);
});

//FUNZIONE PER SEGUIRE UN PROFILO, PRENDE IN INGRESSO L'ID DEL PROFILO DA SEGUIRE, IL NOME DEL PROFILO DA SEGUIRE (PRESO CON LA FUNZIONE DI PRIMA GETNOMEUTENTE) E IL NOME DELL'UTENTE PRESO DALLA CACHE.

const insertSeguire = (username, name, idProfilo  ) => {
  const chiave=username+".segue."+name;
  const template =" INSERT INTO segue (XsegueY,nomeUtente,idProfilo) VALUES ('%CHIAVE','%USERNAME','%IDPROFILO')";
  const sql = template.replace("%CHIAVE",chiave).replace("%USERNAME", username).replace("%IDPROFILO", idProfilo);
  executeQuery(sql);
};

app.post("/insertSeguire", (req, res) => {
  insertSeguire(req.username,req.name, req.idProfilo);
});

//FUNZIONE PER TOGLIERE IL FOLLOW A QUALCUNO, RICHIEDE NOMEUTENTE PRESO DALLA CACHE E ID DEL PROFILO DA NON SEGUIRE
const deleteSegui=(nomeUtente,idProfilo) => {
  const template =" DELETE FROM segue WHERE nomeUtente='%NOMEUTENTE' AND IdProfilo='%IDPROFILO'";
  const sql = template.replace("%NOMEUTENTE", nomeUtente).replace( "%IDPROFILO", idProfilo);
  executeQuery(sql)
};
app.post("/deleteSegui", (req, res) => {
deleteSegui(req.nomeUtente,req.id);
});
//UNA VOLTA CHE SI METTE O SI TOGLIE IL FOLLOW A QUALCUNO BISOGNA ANCHE AGGIORNARE I RISPETTIVI PROFILI CON QUESTE FUNZIONCINE

//PER AGGIORNARE I SEGUITI DEL PROPRIO PROFILO VA MESSO IN INPUT SOLO IL NOMEUTENTE SEMPRE PRESO DALLA CACHE
const aggiornamentoS=(nome)=>{
    const template =" SELECT COUNT(nomeUtente) FROM segue WHERE nomeUtente = '%NAME'";
    const sql = template.replace("%NAME", nome);
    executeQuery(sql)
      .then((result) => {
       aggiornaSeguiti(nome,result);
      });
}

const aggiornaSeguiti=(nome,numeroSeguiti)=>{
  const template =" UPDATE Profilo SET seguiti='%SEGUITI' WHERE nomeUtente='%NAME'";
  const sql = template.replace("%NAME", nome).replace( "%SEGUITI",numeroSeguiti);
  executeQuery(sql);
}

app.post("/updateSeguire", (req, res) => {
  aggiornamentoS(req.username);
});

//PER AGGIORNARE I FOLLOWER DEL PROFILO A CUI TOGLIEREMO IL FOLLOW METTEREMO IN INPUT SOLO L'ID DEL PROFILO A CUI TOGLIAMO IL FOLLLOW 
const aggiornamentoF=(id)=>{
    const template =" SELECT COUNT(IdProfilo) FROM segue WHERE IdProfilo = '%IDPROFILO'";
    const sql = template.replace("%IDPROFILO", id);
    executeQuery(sql)
      .then((result) => {
       aggiornaFollower(id,result);
      });
}

const aggiornaFollower=(id,numeroFollowers)=>{
  const template =" UPDATE Profilo SET followers='%FOLLOWERS' WHERE IdProfilo='%IDPROFILO'";
  const sql = template.replace("%IDPROFILO", id).replace( "%IDPROFILO",numeroFollowers);
  executeQuery(sql);
}

app.post("/updateFollowers", (req, res) => {
  aggiornamentoF(req.id);
});

//FUNZIONE PER METTERE O TOGLIERE IL LIKE AD UN POST E DI METTERE O TOGLIERE UN COMMENTO A QUALCUNO. NEL BODY DELLA REQUEST VA MESSO IL NOMEUTENTE PRESO DALLA CACHE, L'ID DEL POST E: SE SI VUOLE METTERE LIKE SI METTERA' COME VALORE 'LIKE' ALLA CHIAVE DI INPUT 'CODICE' E LA CHIAVE 'COMMENTO' SARA' ="", MENTRE SE SI VUOLE METTERE UN COMMENTO SI METTERA' COME VALORE 'COMMENTO' A 'CODICE' E IL VALORE DELLA CHIAVE 'COMMENTO' NON SARA' VUOTA MA CONTERRA' IL TESTO DEL COMMENTO.

const insertLikeCommento = (codice,commento,nomeUtente,idPost) => {
if(codice==="like"){
  codiceFinale=""+nomeUtente+".metteLike."+idPost;
  const template =" INSERT INTO interagisce (codiceInterazione,nomeUtente,IdPost) VALUES ('%CODICE','%USERNAME','%IDPOST')";
  const sql = template.replace("%CODICE",codiceFinale).replace("%USERNAME", nomeUtente).replace("%IDPOST", idPost);
   executeQuery(sql);
}else if(codice==="commento"){
  codiceFinale=""+nomeUtente+".commenta."+idPost;
  const template =" INSERT INTO interagisce (codiceInterazione,commento,nomeUtente,IdPost) VALUES ('%CODICE','%COMMENTO','%USERNAME','%IDPOST')";
  const sql = template.replace("%CODICE",codiceFinale).replace("%COMMENTO",commento).replace("%USERNAME", nomeUtente).replace("%IDPOST", idPost);
   executeQuery(sql);
}
};

app.post("/insertInterazione", (req, res) => {
  insertLikeCommento(req.codice,req.commento,req.name,req.idPost);
});

//FUNZIONE PER CANCELLARE UN LIKE O UN COMMENTO, PRENDE IN INGRESSO IL NOMEUTENTE PRESO DALLA CACHE, L'ID DEL POST E IL CODICE, COME PRIMA O "LIKE" SE SI VUOLE TOGLIERE IL LIKE AD UN POST O "COMMENTO" SE SI VUOLE TOGLIERE UN COMMENTO

const deleteLikeCommento = (codice,nomeUtente,idPost) => {
if(codice==="like"){
  codiceFinale=""+nomeUtente+".metteLike."+idPost;
  const template =" DELETE FROM interagisce WHERE codiceInterazione='%CODICE' AND nomeUtente='%USERNAME' AND IdPost='%IDPOST'";
  const sql = template.replace("%CODICE",codiceFinale).replace("%USERNAME", nomeUtente).replace("%IDPOST", idPost);
   executeQuery(sql);
}else if(codice==="commento"){
  codiceFinale=""+nomeUtente+".commenta."+idPost;
  const template =" DELETE FROM interagisce WHERE codiceInterazione='%CODICE' AND nomeUtente='%USERNAME' AND IdPost='%IDPOST'";
  const sql = template.replace("%CODICE",codiceFinale).replace("%USERNAME", nomeUtente).replace("%IDPOST", idPost);
   executeQuery(sql);
}
};

app.post("/insertInterazione", (req, res) => {
  deleteLikeCommento(req.codice,req.name,req.idPost);
});

//FUNZIONE PER VISUALIZZARE TUTTI I POST CHE USANO UN TAG, PRENDE IN INGRESSO IL NOME DEL TAG.

const getPostByTag = (nomeTag) => {
  return new Promise((resolve, reject) => {
    const template =" SELECT * FROM Post WHERE nomeTag='%NOMETAG'";
    const sql = template.replace( "%NOMETAG", nomeTag);
    executeQuery(sql).then((result)=>{
      resolve(result); 
    })
  });
};

app.post("/postbytag", (req, res) => {
getPostByTag(req.nomeTag).then((result)=>{
    res.json({ matrice: result });
  });
});