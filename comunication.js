"use strict";

const http = require('http');
const fs = require('fs');
const url  = require('url');
const path = require('path');
const crypto = require('crypto');
const conf = require('./conf.js');
const game = require('./game.js');
const c = require('./comunication.js');


exports.inicializarFichs = function() {
  let users = [];
  let ranking = {ranking : []};
  let jogos = [];

  try { c.escrever(users, 'dados/utilizadores.json');}
  catch(err) { console.log("Erro na criação do ficheiro utilizadores.json"); console.log(err); }

  try { c.escrever(ranking, 'dados/ranking.json');}
  catch(err) { console.log("Erro na criação do ficheiro ranking.json"); console.log(err); }

  try { c.escrever(jogos, 'dados/jogos.json');}
  catch(err) { console.log("Erro na criação do ficheiro jogos.json"); console.log(err); }
}

exports.responder = function(response, cod, msg) {
  response.writeHead(cod);
  response.write(JSON.stringify(msg));
  response.end();
  console.log("resposta:");
  console.log(msg);
}


exports.escrever = function(dados, fileName) {
  let serialDados;
  try {serialDados = JSON.stringify(dados);}
  catch(err) {console.log("ERRO escrita!");}

  console.log("dados: " + dados);
  console.log("dados serializ: " + serialDados);

  fs.writeFile(fileName, serialDados,(err) => {
      if(err) throw err;
  });
}
