const http = require('http');
const fs = require('fs');
const url  = require('url');
const path = require('path');
const crypto = require('crypto');
const conf = require('./conf.js');

exports.doPostRequest = function(pathname, query, request, response) {
  let body = '';

  request
      .on('data', (chunk) => { body += chunk;  })
      .on('end', () => {
             try {
               query = JSON.parse(body);  /* processar query */
             } catch(err) {  console.log("Erro json"); }
             //console.log("O pedido: " + body);

             switch(pathname) {
                 case '/ranking':
                   console.log('ranking');
                   ranking(response);
                   break;
                 case '/register':
                   console.log('register');
                   register(query, response);
                   break;
                 case '/join':
                   console.log('join');
                   join(query, response);
                   break;
                 case '/leave':
                   console.log('leave');
                   leave(query, response);
                   break;
                 default:
               }
      })
      .on('error', (err) => { console.log(err.message); });
}

function register(query, response) {
  if(query == undefined || query == null) { //checkQuery(query) -> Bool
    console.log("User e password não definidos");
    response.writeHead(400);
    response.write(JSON.stringify({ error : "User e password não definidos" }));
    response.end();
  } else if(query.nick == undefined || query.nick == null) { //checkString(Nick) -> Bool
    console.log("User não definido");
    response.writeHead(400);
    response.write(JSON.stringify({ error : "User não definido" }));
    response.end();
  } else if(query.pass == undefined || query.pass == null) { //checkString(pass) -> Bool
    console.log("Password não definida");
    response.writeHead(400);
    response.write(JSON.stringify({ error : "Password não definida" }));
    response.end();
  } else if(typeof(query.nick) == "string" && typeof(query.pass) == "string") { // != string : mandar erro

    fs.readFile('dados/utilizadores.json', function(err,data) {
      if(!err) {

        let users;
        try {users = JSON.parse(data);}
        catch(err) {console.log("ERRO!");}

        console.log("users:")
        console.log(users);

        let pass = null;
        let nick = null;

        for(let user of users) {
          console.log("user of users: " + user);
          if(user.nick === query.nick) {
            console.log("Existe!");
            pass = user.pass;
            nick = user.nick;
          }
        }
        console.log("\nuser: " + nick + " pass: " + pass);

        const hash = crypto
                     .createHash('md5')
                     .update(query.pass)
                     .digest('hex');
        console.log("pass: " + hash);


        if(pass == null) { //se não está definido, regista
          console.log("Registando utilizador.");
          users.push({nick : query.nick , pass: hash , victories : 0, games: 0});
          escrever(users, 'dados/utilizadores.json');

          response.writeHead(200);
          let msg = JSON.stringify({});
          response.write(msg);
          response.end();
        }
        else if(hash === pass) { //se está definido e com a pass correta dá 200
          console.log("OK");
          response.writeHead(200);
          response.write(JSON.stringify({}));
          response.end();
        }
        else {
          console.log("Password errada.");
          response.writeHead(401);
          response.write(JSON.stringify({ error : "Password errada." }));
          response.end();
        }
      } else {
        console.log("Erro interno do servidor");
        response.writeHead(500);
        response.write(JSON.stringify({ error : "Erro interno do servidor." }));
        response.end();
      }
    });
  }
}

function ranking(response) {
  fs.readFile('dados/ranking.json',function(err,data) {
      if(! err) {
          dados = data.toString();
          response.writeHead(200, {'Content-Type': 'application/json'});
          console.log(dados);

          response.end(dados);
      }
  });
}

function join(query, response) {
  if(query == undefined || query == null) { //checkQuery(query) -> Bool
    console.log("User e password não definidos");
    response.writeHead(400);
    response.write(JSON.stringify({ error : "User e password não definidos" }));
    response.end();
  } else if(query.nick == undefined || query.nick == null) { //checkString(Nick) -> Bool
    console.log("User não definido");
    response.writeHead(400);
    response.write(JSON.stringify({ error : "User não definido" }));
    response.end();
  } else if(query.pass == undefined || query.pass == null) { //checkString(pass) -> Bool
    console.log("Password não definida");
    response.writeHead(400);
    response.write(JSON.stringify({ error : "Password não definida" }));
    response.end();
  } else if(query.group == undefined || query.group == null) { //checkString(pass) -> Bool
    console.log("Grupo não definido");
    response.writeHead(400);
    response.write(JSON.stringify({ error : "Grupo não definido" }));
    response.end();
  } else if(typeof(query.nick) == "string" && typeof(query.pass) == "string" && query.group === 55)  {
    //group, nick, pass
    fs.readFile('dados/utilizadores.json', function(err,data) {
      if(!err) {

        let users;
        let mensagem;
        try {users = JSON.parse(data);}
        catch(err) {console.log("ERRO!");}

        console.log("users:")
        console.log(users);

        let pass = null;
        let nick = null;

        for(let user of users) {
          console.log("user of users: " + user);
          if(user.nick === query.nick) {
            console.log("Existe!");
            pass = user.pass;
            nick = user.nick;
          }
        }
        console.log("\nuser: " + nick + " pass: " + pass);

        const hash = crypto
                     .createHash('md5')
                     .update(query.pass)
                     .digest('hex');
        console.log("pass: " + hash);

        if(hash === pass) {
          //existe jogo à espera ou cria-se
          fs.readFile('dados/jogos.json', function(err,data) {
            if(!err) {
              let jogos;
              try {jogos = JSON.parse(data);}
              catch(err) {console.log("ERRO!");}

              let encontrou = false;

              for(let jogo of jogos) {
                if(jogo.player2 === null) {
                  console.log("Encontrou jogador para jogar!");

                  jogo.player2 = query.nick;
                  mensagem = {color : "light", game : jogo.id};
                  encontrou = true;
                }
              }

              if(!encontrou) {
                let value = Number(new Date).toString() + query.nick;

                const hash = crypto
                             .createHash('md5')
                             .update(value)
                             .digest('hex');


                mensagem = {color : "dark", game : hash};
                jogo = {id : hash , player1 : query.nick , player2 : null};
                jogos.push(jogo);

                //new Data() - nascimento >= 2
                // jogo = {id, player1, player2, nascimento=new Date();}
                // jogos = [....{id, player1, nick}...{id, nick, null}]
              }
              try  {escrever(jogos, "dados/jogos.json");}
              catch(err) {console.log("ERRO!");}

              console.log("jogos:")
              console.log(jogos);

              response.writeHead(200);
              let msg = JSON.stringify(mensagem);
              console.log("resposta join: " + msg);
              response.write(msg);
              response.end();
            }
          });
        } else {
          console.log("Não está autenticado.");
          response.writeHead(401);
          response.write(JSON.stringify({ error : "Não está autenticado." }));
          response.end();
        }
      }
    });
  } else {
    console.log("Erro interno do servidor");
    response.writeHead(500);
    response.write(JSON.stringify({ error : "Erro interno do servidor." }));
    response.end();
  }
}

function leave(query, response) {
  //pedido: game, nick, password
  //resposta: winner

  //verificar: game nick password
  fs.readFile('dados/jogos.json', function(err,data) {
    if(!err) {
      try {jogos = JSON.parse(data);}
      catch(err) {console.log("ERRO!");}

      let i = 0, index = -1;

      for(let jogo of jogos) {
        console.log("jogo of jogos: " + jogo);
        if(jogo.id === query.game && jogo.winner == undefined) {
          console.log("Existe!");

          if(jogo.player1 === query.nick) {
            index = i; //verificar pass!! logo no inicio
            jogo.winner = jogo.player2;


          } else if(jogo.player2 === query.nick) {
            index = i; //verificar pass!! logo no inicio
            jogo.winner = jogo.player1;
          }
        }
        i ++;
      }

      if(index > -1) {
        response.writeHead(200);
        response.write(JSON.stringify({})); //acrescentar msgs de erro
        response.end();
        try {escrever(jogos, 'dados/jogos.json');}
        catch(err) {console.log("ERRO!");}
      }/*
        jogos.splice(index, 1); //NÃO -> terminado = true
        //checkVida -> terminado =true (2 min)
        */

    }
  });
}


function inicializarFichs() {
  let users = [];
  let ranking = {ranking : []};
  let jogos = [];

  try { escrever(users, 'dados/utilizadores.json');}
  catch(err) { console.log("Erro na criação do ficheiro utilizadores.json"); }

  try { escrever(ranking, 'dados/ranking.json');}
  catch(err) { console.log("Erro na criação do ficheiro ranking.json"); }

  try { escrever(jogos, 'dados/jogos.json');}
  catch(err) { console.log("Erro na criação do ficheiro jogos.json"); }
}

function escrever(dados, fileName) {
  let serialDados;
  try {serialDados = JSON.stringify(dados);}
  catch(err) {console.log("ERRO escrita!");}

  console.log("dados: " + dados);
  console.log("dados serializ: " + serialDados);

  fs.writeFile(fileName, serialDados,(err) => {
      if(err) throw err;
  });
}
