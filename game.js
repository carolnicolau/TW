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
