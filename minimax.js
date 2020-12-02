function avalia(copia) {
    let somas = soma_pecas(copia);
    let p  = somas[0];
    let b  = somas[1];

    if(cor=="Preto") //jogador
      return b - p; //peças_computador - peças_jogador
    else
      return p - b; //peças_computador - peças_jogador
  }

  function minimax(tabuleiro_, profundidade, vez_, x, y) {
    
    let legais = calcular_legais(tabuleiro_, vez_);
    let res = new Array(3);
    
    if(profundidade==0 || count_legais(legais) == 0) {
      res[0] = avalia(tabuleiro_);
      res[1] = x;
      res[2] = y;
      console.log("profundidade "+ profundidade+": " + res[0] + " x="+x+" y="+y );
      return res;
    }

    let oposta_ = (vez_=='B')? 'P' : 'B';
    console.log("vez: " + vez_);
    console.log("cor: " + cor[0]);
    console.log("oposta: " + oposta_);

    if(vez_!=cor[0]) { //vez do computador
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
      console.log("profundidade"+profundidade+": max=" +maxAval+ " x=" +x+ " y=" +y);
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
    console.log("profundidade "+profundidade+": min=" +minAval+ " x=" +x+ " y=" +y);
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
