"use strict";

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
//exports.jogadasLegais = function ou verificar jogada
//atualizar contagem

function flip_celula(l,c, jogo, vez) {
  jogo.board[l][c] = vez;

  if(vez === 'light') {
    jogo.count.light ++;
    jogo.count.dark --;
  } else {
    jogo.count.light --;
    jogo.count.dark ++;
  }
}


function flip_linha(dl, dc, l, c, jogo, vez) {
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
    return true;
  }
  else {
    if(flip_linha(dl,dc,l+dl,c+dc, jogo, vez)) {
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

  if(flip_linha(-1, -1, l, c, jogo, vez)||
    flip_linha(-1,  0, l, c, jogo, vez)||
    flip_linha(-1,  1, l, c, jogo, vez)||

    flip_linha(1, -1, l, c, jogo, vez)||
    flip_linha(1,  0, l, c, jogo, vez)||
    flip_linha(1,  1, l, c, jogo, vez)||

    flip_linha(0, -1, l, c, jogo, vez)||
    flip_linha(0,  1, l, c, jogo, vez)) {

      flip_celula(l,c, jogo, vez);
      return true;
    }
  return false;
}

exports.novaRonda = function(jogo) { //depois de um jogador1 jogar
  jogo.turn = mudar_vez(jogo);

  if(calcular_legais(jogo) == 0) { //verifica se próximo jogador2 tem jogadas
    jogo.skip = true;

    jogo.turn = mudar_vez(jogo);
    if(calcular_legais() == 0) //verifica se o jogo acabou (se jogador1 não tem jogadas)
      vencedor(jogo);
    else
      jogo.turn = mudar_vez(jogo);
  }
}
/*
function comparar(a, b) {
  if (a.victories > b.victories) { return -1; }
  if (a.victories < b.victories) { return 1; }
  return 0;
}

function atual_ranking(winner) {
  fs.readFile('dados/users.json',function(err,data) {
      if(! err) {
          let dados;
          try { dados = data.toString(); }
          catch(e) { throw e; }

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

          console.log(dados);
          try {c.escrever(dados, 'dados/ranking.json');}
          catch(e) { throw e; }
      } else { throw err }
  });

  fs.readFile('dados/ranking.json',function(err,data1) {
      if(! err) {
          let dados;
          try { dados = data1.toString(); }
          catch(e) { throw e; }

          console.log(dados);

          let ranking = dados.ranking;

          console.log(ranking);

          let obj = {}

          ranking.push({nick: winner, }});
          ranking.sort(comparar);
          ranking.slice(0,9);

          try {c.escrever(dados, 'dados/ranking.json');}
          catch(e) { throw e; }
      } else { throw err }
  });
}*/

function vencedor(jogo) { //player1=dark, player2=light
  if (jogo.count.light > jogo.count.dark)
    jogo.winner = jogo.player2;
  else if (jogo.count.light < jogo.count.dark)
    jogo.winner = jogo.player1;
  else
    jogo.winner = null;
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
