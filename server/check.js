"use strict";

const fs = require('fs');
const crypto = require('crypto');
const c = require('./comunication.js');
const game = require('./game.js');

exports.query = function(query, response) {
  if(query == undefined || query == null) {
    c.responder(response, 400, {error : "User e password não definidos."});
    return false;
  }
  return true;
}

exports.object = function(obj, response) {
  if(obj == undefined) {
    c.responder(response, 400, {error : "Jogada não definida."});
    return false;
  } else if(typeof(obj) != "object") {
    c.responder(response, 400, {error : "Jogada devia ser um objeto."});
    return false;
  } else if(obj == null) {
    return true;
  } else if(obj.row == undefined) {
    c.responder(response, 400, {error : "Jogada não tem a propriedade linha."});
    return false;
  } else if(obj.column == undefined) {
    c.responder(response, 400, {error : "Jogada não tem a propriedade coluna."});
    return false;
  } else if(obj.row == null || typeof(obj.row) != "number" || obj.row < 0 || obj.row > 7) {
    c.responder(response, 400, {error : "Valor de linha inválido."});
    return false;
  } else if(obj.column == null || typeof(obj.column) != "number" || obj.column < 0 || obj.column > 7) {
    c.responder(response, 400, {error : "Valor de coluna inválido."});
    return false;
  } else {
    return true;
  }
}

exports.move = function(jogo, query, response) {
  if(jogo.turn !== query.nick) {
    c.responder(response, 400, {error : "Não é a tua vez de jogar."});
    return false;
  } else if(game.flip(jogo, query.move)) {
    return true;
  } else {
    c.responder(response, 400, {error : "Jogada não é válida."});
    return false;
  }
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

exports.user = function(query, registar, response) { //verifica user e se registar=true, regista se não existir esse user
  return new Promise((resolve, reject) => {
   fs.readFile('dados/utilizadores.json', (err, data) => {
    if (!err) {

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
        catch(e) { c.responder(response, 500, {error : "Erro interno do servidor."}); reject(e); }
        //return true;
        resolve();
      }
      else if(hash === pass) { //se está definido e com a pass correta dá 200
        console.log("encontrou o utilizador!")
        //return true;
        resolve();

      }
      else if(registar) { c.responder(response, 401, { error : "Password errada." }); }
      else { c.responder(response, 402, { error : "Não está autenticado." }); } //???
    } else {c.responder(response, 500, { error :"Erro interno do servidor." });}
     reject(err);
    });
   });
  }
