function verifica_linha(conteudo_, v, dl, dc, l, c) {
  //verifica se há uma cor=vez algures na linha (l,c)+d(dl,dc)
  if(conteudo_[l][c] == v)
    return true;
  if(conteudo_[l][c] == ' ')
    return false;
  if((l+dl < 0) || (l+dl > 7)) {
    return false;
  }
  if((c+dc < 0) || (c+dc > 7)) { //celula adjacente direta está fora do tabuleiro
    return false;
  }

  return verifica_linha(conteudo_, v, dl, dc, l+dl, c+dc);
}

function is_legal(conteudo_, v, dl, dc, l, c) {
  //verifica se a posição adjacente a l,c têm cor oposta a vez 
  //e se a reta (l,c)+d(dl,dc) termina em cor=vez
      
  let oposta = (v=='B')? 'P' : 'B';
      
  if((l+dl < 0) || (l+dl > 7)) {
    return false;
  }
  if((c+dc < 0) || (c+dc > 7)) { //celula adjacente direta está fora do tabuleiro
    return false;
  }
  if(conteudo_[l+dl][c+dc] != oposta) { //celula adjacente direta tem de ser da cor oposta
    return false;
  }
  if((l+dl+dl < 0) || (l+dl+dl > 7)) { //celulas proximas estão fora do tabuleiro
    return false;
  }
  if((c+dc+dc < 0) || (c+dc+dc > 7)) {
    return false;
  }
  return verifica_linha(conteudo_, v, dl, dc, l+dl+dl, c+dc+dc); //ver se a linha termina na nossa cor
}

  function calcular_legais(conteudo_, v) { //verificar se cada posição é legal

    let legais = new Array(8);

    for(let l = 0; l<8; l++) {
      legais[l] = new Array(8);

      for(let c=0; c<8; c++) {
        legais[l][c] = ' ';
        if(conteudo_[l][c] == ' ') {

          let nw = is_legal(conteudo_, v, -1, -1, l, c);
          let nn = is_legal(conteudo_, v, -1,  0, l, c);
          let ne = is_legal(conteudo_, v, -1,  1, l, c);

          let sw = is_legal(conteudo_, v, 1, -1, l, c);
          let ss = is_legal(conteudo_, v, 1,  0, l, c);
          let se = is_legal(conteudo_, v, 1,  1, l, c);

          let ww = is_legal(conteudo_, v, 0, -1, l, c);
          let ee = is_legal(conteudo_, v, 0,  1, l, c);

          if(nw || nn || ne || sw || ss || se || ww || ee) {
            legais[l][c] = v; 
          }
        }
      }
    }
    return legais;
  }

  function count_legais(legais) {

    let count=0;
    for(let l = 0; l<8; l++) {    
      for(let c=0; c<8; c++) {
        if(legais[l][c] != ' ') {
          //console.log(legais[l][c]);
          count ++;
        }
      }
    }
    return count;
  }