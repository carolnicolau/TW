window.onload = function() {

  var cor="Preto";
  var oponente="";
  var dificuldade=1;

  var vez;
  var conteudo;
  var jogadas_legais;
  var tabuleiro;
  var desistiu;
  var vencedor;
  var pode_passar;
  
  var janela = document.getElementsByClassName('janela');
  // Get the button that opens the modal
  var botao = document.getElementsByClassName("botaojanela");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close");

  // sim funciona When the user clicks the button, open the modal 
  botao[0].onclick = function() {
    janela[0].style.display = "block";
  }
  //extra n descrito ??
  botao[1].onclick = function() {
    janela[1].style.display = "block";
  } 

  // sim funciona When the user clicks on <span> (x), close the modal
  span[0].onclick = function() {
    janela[0].style.display = "none";
  }

  //??
  span[1].onclick = function() {
    janela[1].style.display = "none";
  }
  // isto n funciona pq tá bloqueado When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == janela) {
      janela.style.display = "none";
    }
  }
  //FIM DA NAVBAR

  function selectOponente(){
    if(document.getElementById("computador").checked){
     oponente="Computador";
   }
   if (document.getElementById("jogador").checked){
     oponente="Jogador";
   }
 }

 document.getElementById("preto").onclick = function() {
  cor=(document.getElementById("preto").value);
  alert("cor = "+cor);
} 

document.getElementById("branco").onclick = function() {
  cor=(document.getElementById("branco").value);
  alert("cor = "+cor);
}

function selectDificuldade() {
  dificuldade=(document.getElementById("Dificuldade").value); 
}

function escondeEsconde() {
  document.getElementById("coluna_configs").style.visibility = "hidden";
}

function mostraMostra() {
  document.getElementById("coluna_configs").style.visibility = "visible";
}

  //ACCIONAR BOTÃO DE INICIAR
  document.getElementById("iniciar").onclick = function() {
    jogo();
    escondeEsconde();
  }  

  function soma_pecas(t) {
    let p=0;
    let b=0;
    let li=0;
    let somas = new Array(3);

    for(let l = 0; l<8; l++) {
      for(let c=0; c<8; c++) {
        if(t[l][c] == 'B')
          b ++;
        else if(t[l][c] == 'P')
          p ++;
        else if(t[l][c] == ' ')
          li ++;
      }
    }
    document.getElementById("n_brancas").innerText = b;
    document.getElementById("n_pretas").innerText = p;
    document.getElementById("n_livres").innerText = li;
    somas[0] = p;
    somas[1] = b;
    somas[2] = li;
    return somas;
  }

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

  function computador() {
      console.log("conteudo: ");
      console.log(conteudo);

      let cop = copia_tabuleiro(conteudo);
      console.log(cop);

      let jogada = minimax(cop, dificuldade, vez, -1, -1);


      play(jogada[1],jogada[2],conteudo,vez,false);
      //play(0,0);
      soma_pecas(conteudo);
      MudarDeVez();
  }

    function humano(l, c) {
      if(!vez_computador()) {
        if(jogadas_legais[l][c] == vez){ //verificação passa para jogada válida
          play(l, c,conteudo,vez,false);
          soma_pecas(conteudo);
          MudarDeVez();
        }
      } else {
        alert("Não é a tua vez!");
      }
    }

    function play(l, c,conteudo_,vez_,simulacao) {
      
      if(vez_ =='P') {
        if(!simulacao) {
          let peca1 = tabuleiro[l][c].firstChild;
          peca1.className = "peca preto";
          console.log("Preto jogou!");
        }
        conteudo_[l][c] = 'P';
      } else {
        if(!simulacao) {
          let peca1 = tabuleiro[l][c].firstChild;
          peca1.className = "peca branco";
          console.log("Branco jogou!");
        }
        conteudo_[l][c] = 'B';
      }

      flip(l,c,conteudo_,vez_,simulacao);

      if(!simulacao) {
        let peca2;
        for(let l=0; l<8; l++) {
          for(let c=0; c<8; c++) {
            peca2 = tabuleiro[l][c].firstChild;

            if(vez == 'P'){
              peca2.classList.remove("validas_branco");
              //console.log("remove válida branca: ("+l+","+c+")");
            }
            else if(vez == 'B') {
              peca2.classList.remove("validas_preto");
              //console.log("remove válida preta: ("+l+","+c+")");
            }
          }
        }
      }
    }

      function vez_computador() {
        if((cor=="Branco" && vez=='P') || (cor=="Preto" && vez=='B')) {
          return true;
        }
        return false;
      }

      function oposto_vez(){
        let oposta = (vez=='B')? 'P' : 'B';
        return oposta;
      }

      function apagar() {
        ////////
        cor="Preto";
        dificuldade=1;
        oponente="";

        mostraMostra();
        let base = document.getElementById("base");
        base.innerHTML = "";
        /*
        base.removeChild(base.childNodes[0]);
        base.removeChild(base.childNodes[0]);
        base.removeChild(base.childNodes[0]);
        */
        //location.reload();
      }

      function terminar() {
        console.log("terminando...");
        
        if(desistiu)
          vencedor = "computador";
        else {
          let somas = soma_pecas(conteudo);
          let p  = somas[0];
          let b  = somas[1];
          let li = somas[2];

          /*
          for(let l = 0; l<8; l++) {
            for(let c=0; c<8; c++) {
              if(conteudo[l][c] == 'B')
                b ++;
              else if(conteudo[l][c] == 'P')
                p ++;
              else
                li ++;
            }
          }*/


          if((p>b && cor == "Preto") || (p<b && cor == "Branco" ))
            vencedor = "humano";
          else if((p<b && cor == "Preto") || (p>b && cor == "Branco" ))
            vencedor = "computador";
          else {
            vencedor = "empate";
            console.log("pretas: " + p);
            console.log("brancas: " + b);
            console.log("livres: " + li);
          }
        }
        console.log("vencedor: "+ vencedor);

        //GUARDAR VENCEDOR!!!!!!!
        apagar();
      }

      function MudarDeVez(){

        if(terminou() || desistiu) {
          terminar();
          return;
        }
        
        
        for(let l=0; l<8; l++) {
          for(let c=0; c<8; c++) {
            let peca1 = tabuleiro[l][c].firstChild;
            console.log("removing validas");
            peca1.classList.remove("validas_branco");
            peca1.classList.remove("validas_preto");
          }
        }
        
        if(vez == 'B'){
          vez='P';
          document.getElementById("mensagemdavez").innerText="É a vez das peças pretas.";
          console.log("vez do preto");
        }
        else if(vez =='P'){
          vez='B';
          document.getElementById("mensagemdavez").innerText="É a vez das peças brancas.";
          console.log("vez do branco");
        } 

        jogadas_legais   = calcular_legais(conteudo, vez);
        let n_jogadas_vez     = count_legais(jogadas_legais);
        if(n_jogadas_vez == 0)
          pode_passar = true;

        console.log("jogadas legais de vez: " + n_jogadas_vez);
        console.log(jogadas_legais); 

        let peca1;
        for(let l=0; l<8; l++) {
          for(let c=0; c<8; c++) {
            peca1 = tabuleiro[l][c].firstChild;

            if(jogadas_legais[l][c] == vez) {
              if(vez=='B') {
                peca1.className += " validas_branco";
              }
              else if (vez=='P') {
                peca1.className += " validas_preto";
              }
            }
          }
        }  
        if(vez_computador()) {
          setTimeout(function(){ computador(); }, 1000);
        }     
      }

      function passa() {
        if(pode_passar && !vez_computador()) {
          console.log("passou!");
          pode_passar = false;
          MudarDeVez();
        }
      }

      function desistir() {
        desistiu = true;
        console.log("desistiu!");
        MudarDeVez();
      }


      function terminou() {
        let jogadas_legaisB  = calcular_legais(conteudo, 'B');
        let nB               = count_legais(jogadas_legaisB);
        let jogadas_legaisP  = calcular_legais(conteudo, 'P');
        let nP               = count_legais(jogadas_legaisP);

        if(nB == 0 && nP == 0) {
          alert("jogo acabou!");
          return true;
        }
        else
          return false;
      }

      function flip_celula(l,c,conteudo_, vez_, simulacao) {

        conteudo_[l][c] = vez_;

        if(!simulacao) {
          let peca = tabuleiro[l][c].firstChild;

          if(vez=='P')
            peca.className = "peca preto";
          else
            peca.className = "peca branco";
        }
      }

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
      
      //let oposta = oposto_vez();
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

  function jogo() {

    vez = 'B';
    desistiu = false;
    vencedor;
    conteudo = new Array(8);
    tabuleiro = new Array(8);
    jogadas_legais;
    pode_passar = false;

    const base = document.getElementById("base");
    const tabul = document.createElement("div");
    const passar = document.createElement("button");
    const desist = document.createElement("button");

    tabul.className = "tabuleiro";
    passar.innerText = "Passar jogada";
    desist.innerText = "Desistir";
    desist.id = "desistir";
    passar.id = "passar";
    
    desist.onclick = function() {
      desistir();
    };

    passar.onclick = function() {
      passa();
    };

    base.appendChild(tabul);
    base.appendChild(passar);
    base.appendChild(desist);


    for(let l = 0; l<8; l++) {

      const linha = document.createElement("div");
      linha.className="linha";
      tabul.appendChild(linha);
      conteudo[l] = new Array(8);
      tabuleiro[l] = new Array(8);


      for(let c=0; c<8; c++) {
        const celula = document.createElement("div");
        celula.className="celula";
        tabuleiro[l][c] = celula;


        linha.appendChild(celula);

        const peca =document.createElement("div");

        if((l==3 & c==3) || (l==4 & c==4)) {
          peca.className="peca preto";            
          conteudo[l][c] = 'P'; 

        }
        else if((l==3 & c==4) || (l==4 & c==3)) {
          peca.className="peca branco";
          conteudo[l][c] = 'B'; 

        }
        else {
          peca.className="peca livre";
          conteudo[l][c] = ' '; 

        }
        celula.appendChild(peca);

        celula.onclick = ((fun, posl, posc) => {
          return () => fun(posl, posc);
        })(humano.bind(this), l, c);

      }
    }
    MudarDeVez();
  }
}
