//função flip vira todas as peças que devem ser viradas ao jogar l,c
//o booleano simulação indica se esta jogada l,c está a acontecer dentro de um minimax
//para que, caso seja verdadeiro, não sejam modificados elementos html


function flip_celula(l,c,conteudo_, vez_, simulacao) {

  conteudo_[l][c] = vez_;
  
  if(!simulacao) {
    let jogo = Jogo.getInstancia();
    let peca = jogo.tabuleiro[l][c].firstChild;

    
  console.log("("+l+","+c+") = " + conteudo_[l][c]);


    if(vez_=='P') {
      //peca.className = "peca preto";
      //animar1(peca, "black");
      animar2(peca, "FloralWhite", "black");
    } else {
      //peca.className = "peca branco";
      //animar1(peca, "red");
      animar2(peca, "black","FloralWhite");
    }
  }
}

/*
async function flip_celula(l,c,conteudo_, vez_, simulacao) {

  conteudo_[l][c] = vez_;
  
  if(!simulacao) {
    let jogo = Jogo.getInstancia();
    let peca = jogo.tabuleiro[l][c].firstChild;


  //console.log("("+l+","+c+") = " + conteudo_[l][c]);


    if(vez_=='P') {
      //peca.className = "peca preto";
      //animar1(peca, "black");
      let string = await animar2(peca, "red","black");
      console.log("flip terminou");
      resolve(string);

      } else {
      //peca.className = "peca branco";
      //animar1(peca, "red");

      return new Promise(async (resolve, reject) => {
        let string = await animar2(peca, "black","red");
        console.log("flip terminou");
        resolve(string);
      })
    }
  }
}
*/

function flip_linha(dl, dc, l, c, conteudo_, vez_, simulacao) {     
  if((l+dl < 0) || (l+dl > 7)) {
    return false;
  }
  if((c+dc < 0) || (c+dc > 7)) {
    return false;
  }
  if(conteudo_[l+dl][c+dc] == ' ') {
    return false;
  }
  if(conteudo_[l+dl][c+dc] == vez_) { 
    return true;
  }
  else {
    if(flip_linha(dl,dc,l+dl,c+dc,conteudo_,vez_,simulacao)) {
      flip_celula(l+dl,c+dc,conteudo_,vez_,simulacao);
      return true;
    }
    else {
      return false;
    }
  }
}

function flip(l,c,conteudo_,vez_,simulacao) {

  flip_linha(-1, -1, l, c,conteudo_,vez_,simulacao);
  flip_linha(-1,  0, l, c,conteudo_,vez_,simulacao);
  flip_linha(-1,  1, l, c,conteudo_,vez_,simulacao);

  flip_linha(1, -1, l, c,conteudo_,vez_,simulacao);
  flip_linha(1,  0, l, c,conteudo_,vez_,simulacao);
  flip_linha(1,  1, l, c,conteudo_,vez_,simulacao);

  flip_linha(0, -1, l, c,conteudo_,vez_,simulacao);
  flip_linha(0,  1, l, c,conteudo_,vez_,simulacao);
}