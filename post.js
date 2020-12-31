const http = require('http');
const fs = require('fs');
const url  = require('url');
const path = require('path');
const crypto = require('crypto');
const conf = require('./conf.js');
const game = require('./game.js');
const c = require('./comunication.js');
const check = require('./check.js');

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
  if(check.query(query, response) && check.string(query.nick, "User", response) && check.string(query.pass, "Password", response)) {
    console.log("args checked");
    if(check.user(query, true, response)) {
      console.log("aqui");
      c.responder(response, 200, {});
    }
  }
}

function ranking(response) {
  fs.readFile('dados/ranking.json',function(err,data) {
      if(! err) {
          dados = data.toString();
          response.writeHead(200, {'Content-Type': 'application/json'});
          console.log(dados);
          response.end(dados);
      } else { c.responder(response, 500, { error : "Erro interno do servidor." }); }
  });
}

function join(query, response) {
  console.log("pedido:");
  console.log(query);
  if(check.query(query, response) && check.string(query.nick, "User", response) && check.string(query.pass, "Password", response)) {
    console.log("args checked");
    if(check.user(query, false, response)) {
      console.log("user checked");

          //existe jogo à espera ou cria-se
          fs.readFile('dados/jogos.json', function(err,data) {
            if(!err) {
              console.log("Reading file");
              let jogos;
              try {jogos = JSON.parse(data);}
              catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }

              console.log("Jogos:"); console.log(jogos);

              let encontrou = false;

              for(let jogo of jogos) {
                if(jogo.player2 === null) {
                  console.log("Encontrou jogador para jogar! Jogo encontrado:");

                  jogo.player2 = query.nick;
                  mensagem = {color : "light", game : jogo.id};
                  encontrou = true;

                }
              }

              if(!encontrou) { // cria NOVO jogo
                console.log("Não encontrou jogador para jogar... Jogo criado:");

                let value = Number(new Date).toString() + query.nick;

                const hash = crypto
                             .createHash('md5')
                             .update(value)
                             .digest('hex');

                // turn, board, count, [skip], [winner]
                mensagem = {color : "dark", game : hash};
                jogo = {id : hash ,
                        player1 : query.nick ,
                        player2 : null,
                        turn: query.nick,
                        board: game.inicial,
                        count: game.countInicial
                      };
                jogos.push(jogo);

                //new Data() - nascimento >= 2
                // jogo = {id, player1, player2, nascimento=new Date();}
                // jogos = [....{id, player1, nick}...{id, nick, null}]
              }
              console.log(jogo);
              try  { c.escrever(jogos, "dados/jogos.json"); }
              catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }

              console.log("jogos:")
              console.log(jogos);

              c.responder(response, 200, mensagem);
            } else { c.responder(response, 500, {error : "Erro interno do servidor."}); }
        });
      }
    }
}

function leave(query, response) {
  //pedido: game, nick, password
  //resposta: winner

  if(check.query(query, response) && check.string(query.nick, "User", response) && check.string(query.pass, "Password", response)) {
    if(check.user(query, false, response)) {
      fs.readFile('dados/jogos.json', function(err,data) {
        if(!err) {
          try {jogos = JSON.parse(data);}
          catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }

          let i = 0, index = -1;

          for(let jogo of jogos) {
            console.log("jogo of jogos: " + jogo);
            if(jogo.id === query.game && jogo.winner == undefined) {
              console.log("Existe jogo!");

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

          /*
            jogos.splice(index, 1); //NÃO -> terminado = true
            //checkVida -> terminado =true (2 min)
            */

          if(index > -1) {
            c.responder(response, 200, {});
            try { c.escrever(jogos, 'dados/jogos.json'); }
            catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }
          } else { c.responder(response, 400, {error : "Referência de jogo inválida."}); }
        } else { c.responder(response, 500, {error : "Erro interno do servidor."}); }
      });
    }
  }
}

function notify(query, response) {
  //nick	pass	game	move
  //JOGO = turn, board, count, [skip], [winner]
  //verificar: game nick password

  if(check.query(query, response) && check.string(query.nick, "User", response) && check.string(query.pass, "Password", response)) {
    if(check.user(query, false, response)) {
      fs.readFile('dados/jogos.json', function(err,data) {
        if(!err) {
          try {jogos = JSON.parse(data);}
          catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }

          let i = 0, index = -1;

          for(let jogo of jogos) {
            console.log("jogo of jogos: " + jogo);
            if(jogo.id === query.game && jogo.winner == undefined) {
              console.log("Existe!");
            }
            i ++;
          }

          if(index > -1) {
            c.responder(response, 200, {});
            try {c.escrever(jogos, 'dados/jogos.json');}
            catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }
          } else { c.responder(response, 400, {error : "Referência de jogo inválida."}); }
        } else { c.responder(response, 500, {error : "Erro interno do servidor."}); }
      });
    }
  }
}
