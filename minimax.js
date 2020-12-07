///////////////////////////////
//retorna o número de peças brancas, pretas e livres
function soma_pecas(t) {

  let dark=0;
  let light=0;
  let empty=0;
  
  for(let l = 0; l<8; l++) {
    for(let c=0; c<8; c++) {
      if(t[l][c] == 'B')
        light ++;
      else if(t[l][c] == 'P')
        dark ++;
      else if(t[l][c] == ' ')
        empty ++;
    }
  }
  
  let somas = {dark, light, empty};
  return somas;
}

/*
function atualizar_tabuleiro() {
  var jogo = Jogo.getInstancia();
  var peca;

  for(let l = 0; l<8; l++) {
    for(let c=0; c<8; c++) {
      peca = jogo.tabuleiro[l][c].firstChild;
      if(jogo.conteudo[l][c] == 'P')
        peca.className = "peca preto";
      else if(jogo.conteudo[l][c] == 'B')
        peca.className = "peca branco";
      else
        peca.className = "peca";
    }
  }
}*/


//atualiza o elem tabuleiro (se não é uma simulação - dentro do minimax)
//flip(l,c)
//limpa formatação das jogadas válidas
function play(l, c,conteudo_,vez_,simulacao) {
  var jogo = Jogo.getInstancia();
    
  if(vez_ =='P') {
    if(!simulacao) {
      let peca1 = jogo.tabuleiro[l][c].firstChild;
      animar1(peca1, "black");
      //peca1.className = "peca preto";
      //console.log("Preto jogou (" + l + "," + c + ")");
    }
    conteudo_[l][c] = 'P';

  } else {
    if(!simulacao) {
      let peca1 = jogo.tabuleiro[l][c].firstChild;
      animar1(peca1, "FloralWhite");
      //peca1.className = "peca branco";
      //console.log("Branco jogou (" + l + "," + c + ")");
    }
    conteudo_[l][c] = 'B';
  }


  flip(l,c,conteudo_,vez_,simulacao);  

  /*
  if(!simulacao) { //??????????????????????????????????????????????????
    let peca2;
    for(let l=0; l<8; l++) {
      for(let c=0; c<8; c++) {
        peca2 = jogo.tabuleiro[l][c].firstChild;

        if(vez == 'P'){
          peca2.classList.remove("validas_branco");
        }
        else if(vez == 'B') {
          peca2.classList.remove("validas_preto");
        }
      }
    }
  }*/
}

function avalia(copia) {

  var jogo = Jogo.getInstancia();

    let somas = soma_pecas(copia);
    let p  = somas.dark;
    let b  = somas.light;

    if(jogo.cor=="Preto") //jogador
      return b - p; //peças_computador - peças_jogador
    else
      return p - b; //peças_computador - peças_jogador
  }

  function minimax(tabuleiro_, profundidade, vez_, x, y) {

    var jogo = Jogo.getInstancia();
    let legais = calcular_legais(tabuleiro_, vez_);
    let res = new Array(3);
    
    if(profundidade==0 || count_legais(legais) == 0) {
      res[0] = avalia(tabuleiro_);
      res[1] = x;
      res[2] = y;
      return res;
    }

    let oposta_ = (vez_=='B')? 'P' : 'B';

    if(vez_!=jogo.cor) { //vez do computador
      maxAval = -99999;
      for(let l=0; l<8; l++) {
        for(let c=0; c<8; c++) {
          let copia = copia_tabuleiro(tabuleiro_);

          if(legais[l][c]==vez_) {
            play(l, c,copia,vez_,true);

            aval = minimax(copia, profundidade-1, oposta_, l, c)[0];
            
            if(aval>maxAval) {
              maxAval = aval;
              x=l;
              y=c;
            }
          }
        }
      }
      res[0] = maxAval;
      res[1] = x;
      res[2] = y;
      return res;
    }

    else { //vez do humano (cor=vez)
      minAval = 99999;
      for(let l=0; l<8; l++) {
        for(let c=0; c<8; c++) {
          let copia = copia_tabuleiro(tabuleiro_);
          

          if(legais[l][c]==vez_) {
            play(l, c,copia,vez_,true);

            aval = minimax(copia, profundidade-1, oposta_, l, c)[0];
            if(aval<minAval) {
              minAval = aval;
              x=l;
              y=c;
            }
          }
        }
      }
    }
    res[0] = minAval;
    res[1] = x;
    res[2] = y;
    return res;
  }


  function copia_tabuleiro(t) {
    var copia_ = new Array(8);
    
    for(let l = 0; l<8; l++) {
      copia_[l] = new Array(8);
     
      for(let c=0; c<8; c++) {
        copia_[l][c] = t[l][c];
      }
    }
    return copia_;
  }

