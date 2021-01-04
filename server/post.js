"use strict";

const http = require('http');
const fs = require('fs');
const url  = require('url');
const path = require('path');
const crypto = require('crypto');
const conf = require('./conf.js');
const game = require('./game.js');
const c = require('./comunication.js');
const check = require('./check.js');
const updater = require('./updater.js');

exports.doPostRequest = function(pathname, query, request, response, jogos) {
  let body = '';

  request
      .on('data', (chunk) => { body += chunk; })
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
                   join(query, response, jogos);
                   break;
                 case '/leave':
                   console.log('leave');
                   leave(query, response, jogos);
                   break;
                 case '/notify':
                   console.log('notify');
                   notify(query, response, jogos);
                   break;
                 default:
               }
      })
      .on('error', (err) => { console.log(err.message); });
}

function register(query, response) {
  if(check.query(query, response) && check.string(query.nick, "User", response) && check.string(query.pass, "Password", response)) {
    console.log("args checked");
    check.user(query, true, response)
      .then(() => c.responder(response, 200, {}))
      .catch(()=>(console.log("Promessa rejeitada")));
  }
}

function ranking(response) {
  fs.readFile('dados/ranking.json',function(err,data) {
      if(! err) {
          let dados = data.toString();
          response.writeHead(200, {'Content-Type': 'application/json'});
          console.log(dados);
          response.end(dados);
      } else { c.responder(response, 500, { error : "Erro interno do servidor." }); }
  });
}

function join(query, response, jogos) {
  if(check.query(query, response) && check.string(query.nick, "User", response) && check.string(query.pass, "Password", response)) {
    console.log("args checked");

    check.user(query, false, response).then(() => {
      console.log("user checked");

      let encontrou = false, jogo, mensagem;

              for(jogo of jogos) {
                if(jogo.player2 === null) {
                  console.log("Encontrou jogador para jogar! Jogo encontrado:");

                  jogo.player2 = query.nick;
                  mensagem = {color : "light", game : jogo.game};
                  encontrou = true;
                  //console.log(jogo);

                  break;
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
                let responses = new Array();
                jogo = {game : hash ,
                        player1 : query.nick ,
                        player2 : null,
                        turn: query.nick,
                        board: game.inicial,
                        count: game.countInicial,
                        responses
                      };
                jogos.push(jogo);
                //console.log(jogo);

                //new Data() - nascimento >= 2
                // jogo = {id, player1, player2, nascimento=new Date();}
                // jogos = [....{id, player1, nick}...{id, nick, null}]
              }
              c.responder(response, 200, mensagem);
              updater.update(jogo);
            })
            .catch(err => console.log(err));
      }
    }


function leave(query, response, jogos) {
  //pedido: game, nick, password
  //resposta: winner

  if(check.query(query, response) && check.string(query.nick, "User", response) && check.string(query.pass, "Password", response)) {
    check.user(query, false, response).then(() => {
      /*fs.readFile('dados/jogos.json', function(err,data) {
        if(!err) {
          try {jogos = JSON.parse(data);}
          catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }*/

          let jogo, found = false;

          for(jogo of jogos) {
            if(jogo.game === query.game && jogo.winner == undefined) {
              console.log("Existe jogo!");
              found = true;
              break;
            }
          }



          /*
            jogos.splice(index, 1); //NÃO -> terminado = true
            //checkVida -> terminado =true (2 min)
            */

          if(found) {
            //try { c.escrever(jogos, 'dados/jogos.json'); }
            //catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }


            if(jogo.player1 === query.nick) {
              jogo.winner = jogo.player2;
              game.ranking(jogo.player1, 0, jogo.player2, 1);
            } else if(jogo.player2 === query.nick) {
              jogo.winner = jogo.player1;
              game.ranking(jogo.player1, 1, jogo.player2, 0);
            }

            c.responder(response, 200, {});
            updater.update(jogo);

          } else { c.responder(response, 400, {error : "Referência de jogo inválida."}); }
        //} else { c.responder(response, 500, {error : "Erro interno do servidor."}); }
      //});
    })
    .catch(err => console.log(err));
  }
}

function notify(query, response, jogos) {
  //nick	pass	game	move
  //JOGO = turn, board, count, [skip], [winner]
  //verificar: game nick password

  if(check.query(query, response) && check.object(query.move, response) && check.string(query.nick, "User", response) && check.string(query.pass, "Password", response)) {
    check.user(query, false, response).then(() => {

      /*
      try{ler('dados/jogos.json', obj)}
      catch{}
      if(obj!=null) {
        ...
      }*/

      /*fs.readFile('dados/jogos.json', function(err,data) {
        if(!err) {
          try {jogos = JSON.parse(data);}
          catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }*/

          let found = false, jogo;

          for(jogo of jogos) {
            if(jogo.game === query.game && jogo.winner == undefined && jogo.player1 != null && jogo.player2 != null) {
              console.log("Existe!");
              found = true; break;
            }
          }

          if(found) {
            if(check.move(jogo, query, response)) {
              //try {c.escrever(jogos, 'dados/jogos.json');} //????
              //catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }

              game.novaRonda(jogo);
              c.responder(response, 200, {});
              updater.update(jogo);
            }
          } else { c.responder(response, 400, {error : "Referência de jogo inválida."}); }
        //} else { c.responder(response, 500, {error : "Erro interno do servidor."}); }
      //});
    })
    .catch(err => console.log(err));
  }
}
