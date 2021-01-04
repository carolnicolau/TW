"use strict";

const game = require('./game.js');
const fs = require('fs');
const c = require('./comunication.js');



exports.inicial = [
  ["empty","empty","empty","empty","empty","empty","empty","empty"],
  ["empty","empty","empty","empty","empty","empty","empty","empty"],
  ["empty","empty","empty","empty","empty","empty","empty","empty"],
  ["empty","empty","empty","light","dark" ,"empty","empty","empty"],
  ["empty","empty","empty","dark", "light","empty","empty","empty"],
  ["empty","empty","empty","empty","empty","empty","empty","empty"],
  ["empty","empty","empty","empty","empty","empty","empty","empty"],
  ["empty","empty","empty","empty","empty","empty","empty","empty"]
];
exports.countInicial = {"dark": 2, "light": 2, "empty": 60};


function flip_celula(l,c, jogo, vez) {
  jogo.board[l][c] = vez;
}


function flip_linha(dl, dc, l, c, jogo, vez, count) {
  if((l+dl < 0) || (l+dl > 7)) {
    return false;
  }
  if((c+dc < 0) || (c+dc > 7)) {
    return false;
  }
  if(jogo.board[l+dl][c+dc] == 'empty') {
    return false;
  }
  if(jogo.board[l+dl][c+dc] == vez) {
    if(count>0)
      return true;
  }
  else {
    if(flip_linha(dl,dc,l+dl,c+dc, jogo, vez, count+1)) {
      flip_celula(l+dl,c+dc, jogo, vez);
      return true;
    }
    else {
      return false;
    }
  }
}

exports.flip = function(jogo, move) {
  let l = move.row, c = move.column, vez;
  if(jogo.turn === jogo.player1)
    vez = 'dark';
  else if(jogo.turn === jogo.player2)
    vez = 'light';
  else
    console.log("ERROOO!");

    let nw = flip_linha(-1, -1, l, c, jogo, vez, 0);
    let nn = flip_linha(-1,  0, l, c, jogo, vez, 0);
    let ne = flip_linha(-1,  1, l, c, jogo, vez, 0);

    let sw = flip_linha(1, -1, l, c, jogo, vez, 0);
    let ss = flip_linha(1,  0, l, c, jogo, vez, 0);
    let se = flip_linha(1,  1, l, c, jogo, vez, 0);

    let ww = flip_linha(0, -1, l, c, jogo, vez, 0);
    let ee = flip_linha(0,  1, l, c, jogo, vez, 0);

    if(nw || nn || ne || sw || ss || se || ww || ee) {
      flip_celula(l,c, jogo, vez);
      contagem(jogo);
      return true;
    }
  return false;
}

function contagem(jogo) {
  jogo.count.light = 0;
  jogo.count.dark = 0;
  jogo.count.empty = 0;

  for(let i=0; i<8; i++) {
    for(let j=0; j<8; j++) {
      if(jogo.board[i][j] === 'light') {
        jogo.count.light ++;
      } else if(jogo.board[i][j] === 'dark') {
        jogo.count.dark ++;
      } else if(jogo.board[i][j] === 'empty') {
        jogo.count.empty ++;
      }
    }
  }
}

exports.novaRonda = function(jogo) { //depois de um jogador1 jogar
  jogo.turn = mudar_vez(jogo);

  if(calcular_legais(jogo) == 0) { //verifica se próximo jogador2 tem jogadas
    jogo.skip = true;

    jogo.turn = mudar_vez(jogo);
    if(calcular_legais(jogo) == 0) { //verifica se o jogo acabou (se jogador1 não tem jogadas)
      vencedor(jogo);
    } else
      jogo.turn = mudar_vez(jogo);
  }
}

function comparar(a, b) {
  if (a.victories > b.victories) { return -1; }
  if (a.victories < b.victories) { return 1; }
  return 0;
}

exports.ranking = function(player1, vict1, player2, vict2) {
  console.log("player1: " + player1 + " vitorias: " + vict1);
  console.log("player2: " + player2 + " vitorias: " + vict2);
  fs.readFile('dados/utilizadores.json',function(err,data) {
      if(! err) {
          let dados, obj1=null, obj2=null;
          try { dados = JSON.parse(data.toString()); }
          catch(e) { throw e; }

          let users;
          try {users = JSON.parse(data);}
          catch(err) { c.responder(response, 500, {error : "Erro interno do servidor."}); }
          //console.log("users:"); console.log(users);

          for(let user of users) {
            if(user.nick === player1) {
              user.victories += vict1;
              user.games ++;
              obj1 = user;
            }
            else if(user.nick === player2) {
              user.victories += vict2;
              user.games ++;
              obj2 = user;
            }
          }

          console.log("player1:");
          console.log(obj1);
          console.log("player2:");
          console.log(obj2);

          if(obj1 || obj2) {

            console.log(dados);
            try {c.escrever(dados, 'dados/utilizadores.json');}
            catch(e) { throw e; }

            fs.readFile('dados/ranking.json',function(err1,data1) {
                if(! err1) {
                    let dados;
                    try { dados = JSON.parse(data1); }
                    catch(e) { throw e; }

                    console.log(dados);

                    let ranking = dados.ranking;

                    console.log(ranking);

                    let found1 = false, found2 = false;
                    for(let usr of ranking) {
                      if(usr.nick === player1) {
                        usr.victories += vict1;
                        usr.games ++;
                        found1 = true;
                      }
                      else if(usr.nick === player2) {
                        usr.victories += vict2;
                        usr.games ++;
                        found2 = true;
                      }
                    }
                    if(!found1)
                      ranking.push(obj1);
                    if(!found2)
                      ranking.push(obj2);

                    ranking.sort(comparar);
                    ranking.slice(0,9);

                    console.log("novo ranking: ");
                    console.log(ranking);

                    try {c.escrever(dados, 'dados/ranking.json');}
                    catch(e) { throw e; }
                } else { throw err1; }
            });
          } else { c.responder(response, 500, {error : "Erro interno do servidor."});}
      } else { throw err; }
  });
}

function vencedor(jogo) { //player1=dark, player2=light
  if (jogo.count.light > jogo.count.dark) {
    jogo.winner = jogo.player2;
    game.ranking(jogo.player1, 0, jogo.player2, 1);
  } else if (jogo.count.light < jogo.count.dark) {
    jogo.winner = jogo.player1;
    game.ranking(jogo.player1, 1, jogo.player2, 0);
  } else {
    jogo.winner = null;
    game.ranking(jogo.player1, 0,  jogo.player2, 0);
  }
}

function vez(jogo) { //player1=dark, player2=light
  return (jogo.turn == jogo.player1)? 'dark' : 'light';
}
function oposta(jogo) { //player1=dark, player2=light
  return (jogo.turn == jogo.player1)? 'light' : 'dark';
}
function mudar_vez(jogo) { //player1=dark, player2=light
  return (jogo.turn == jogo.player1)? jogo.player2 : jogo.player1;
}

function verifica_linha(jogo, dl, dc, l, c) {
  //verifica se há uma cor=vez algures na linha (l,c)+d(dl,dc)
  if(jogo.board[l][c] == vez(jogo))
    return true;
  if(jogo.board[l][c] == 'empty')
    return false;
  if((l+dl < 0) || (l+dl > 7)) {
    return false;
  }
  if((c+dc < 0) || (c+dc > 7)) { //celula adjacente direta está fora do tabuleiro
    return false;
  }

  return verifica_linha(jogo, dl, dc, l+dl, c+dc);
}

function is_legal(jogo, dl, dc, l, c) {
  //verifica se a posição adjacente a l,c têm cor oposta a vez
  //e se a reta (l,c)+d(dl,dc) termina em cor=vez

  if((l+dl < 0) || (l+dl > 7)) {
    return false;
  }
  if((c+dc < 0) || (c+dc > 7)) { //celula adjacente direta está fora do tabuleiro
    return false;
  }
  if(jogo.board[l+dl][c+dc] != oposta(jogo)) { //celula adjacente direta tem de ser da cor oposta
    return false;
  }
  if((l+dl+dl < 0) || (l+dl+dl > 7)) { //celulas proximas estão fora do tabuleiro
    return false;
  }
  if((c+dc+dc < 0) || (c+dc+dc > 7)) {
    return false;
  }
  return verifica_linha(jogo, dl, dc, l+dl+dl, c+dc+dc); //ver se a linha termina na nossa cor
}

  function calcular_legais(jogo) { //verificar se cada posição é legal
    let count=0;

    for(let l = 0; l<8; l++) {
      for(let c=0; c<8; c++) {
        if(jogo.board[l][c] == 'empty') {

          let nw = is_legal(jogo, -1, -1, l, c);
          let nn = is_legal(jogo, -1,  0, l, c);
          let ne = is_legal(jogo, -1,  1, l, c);

          let sw = is_legal(jogo, 1, -1, l, c);
          let ss = is_legal(jogo, 1,  0, l, c);
          let se = is_legal(jogo, 1,  1, l, c);

          let ww = is_legal(jogo, 0, -1, l, c);
          let ee = is_legal(jogo, 0,  1, l, c);

          if(nw || nn || ne || sw || ss || se || ww || ee) {
            count ++;
          }
        }
      }
    }
    return count;
  }
