const fs = require('fs');
const crypto = require('crypto');
const c = require('./comunication.js');

exports.query = function(query, response) {
  if(query == undefined || query == null) {
    c.responder(response, 400, {error : "User e password não definidos."});
    return false;
  }
  return true;
}

exports.string = function(string, nome, response) {
  if(string == undefined || string == null) {
    c.responder(response, 400, {error : nome + " não definido."});
    return false;
  } else if(typeof(string) != "string") {
    c.responder(response, 400, {error : nome + " tem de ser string."});
    return false;
  }
  return true;
}

/*
const readFile = filePath => {
 return new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf8', (error, fileContent) => {
   if (error != null) {
    reject(error);
    return;
   }

   resolve(fileContent);
  });
 });
}*/

exports.user = function(query, registar, response) { //verifica user e se registar=true, regista se não existir esse user
  fs.readFile('dados/utilizadores.json', function(err,data) {
    if(!err) {
      let users;
      try {users = JSON.parse(data);}
      catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }
      //console.log("users:"); console.log(users);

      let pass = null, nick = null;

      for(let user of users) {
        if(user.nick === query.nick) {
          pass = user.pass;
          nick = user.nick;
        }
      }
      //console.log("\nuser: " + nick + " pass: " + pass);

      const hash = crypto
                   .createHash('md5')
                   .update(query.pass)
                   .digest('hex');
      //console.log("pass: " + hash);

      if(pass == null && registar) { //se não está definido, regista
        //console.log("Registando utilizador.");
        users.push({nick : query.nick , pass: hash , victories : 0, games: 0});
        try { c.escrever(users, 'dados/utilizadores.json'); }
        catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }
        return true;
      }
      else if(hash === pass) { //se está definido e com a pass correta dá 200
        console.log("encontrou o utilizador!")
        return true;
      }
      else if(registar) { c.responder(response, 401, { error : "Password errada." }); }
      else { c.responder(response, 402, { error : "Não está autenticado." }); } //???
    } else { c.responder(response, 500, { error : "Erro interno do servidor." }); }
  });
  return false;
}
