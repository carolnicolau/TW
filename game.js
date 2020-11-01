window.onload = function() {

  var vez;
  var cor;
  var conteudo;
  var jogadas_legais;
  var tabuleiro;
  var desistiu;
  var vencedor;
  
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

  var oponente1="";
  var cor1="Preto";
  var dificuldade1="";

  function selectOponente(){
    if(document.getElementById("computador").checked){
     oponente1="Computador";
   }
   if (document.getElementById("jogador").checked){
     oponente1="Jogador";
   }
 }

 document.getElementById("preto").onclick = function() {
  cor1=(document.getElementById("preto").value);
  alert("cor = "+cor1);
} 

document.getElementById("branco").onclick = function() {
  cor1=(document.getElementById("branco").value);
  alert("cor = "+cor1);
}

function selectDificuldade() {
  dificuldade1=(document.getElementById("Dificuldade").value); 
}

function escondeEsconde() {
  document.getElementById("coluna_configs").style.visibility = "hidden";
}

function mostraMostra() {
  document.getElementById("coluna_configs").style.visibility = "visible";
}

  //ACCIONAR BOTÃO DE INICIAR
  document.getElementById("iniciar").onclick = function() {
    jogo(cor1);
    escondeEsconde();
  }  

  function soma_pecas(p, b, l) {
    p=0;
    b=0;
    l=0;

    for(let l = 0; l<8; l++) {
      for(let c=0; c<8; c++) {
        if(conteudo[l][c] == 'B')
          b ++;
        else if(conteudo[l][c] == 'P')
          p ++;
        else
          l ++;
      }
    }
    document.getElementById("n_brancas").innerText = b;
    document.getElementById("n_pretas").innerText = p;
    document.getElementById("n_livres").innerText = l;
    return b + p;
  }

  function computador() {
      //var jogadas_legais = jogo.calcular_legais(vez, jogo.conteudo);
      play(0,0);
      MudarDeVez();
    }

    function humano(l, c) {
      if(!vez_computador()) {
        if(jogadas_legais[l][c] == vez){ //verificação passa para jogada válida
          play(l, c);
          MudarDeVez();
        }
      } else {
        alert("Não é a tua vez!");
      }
    }

    function play(l, c) {
      var peca1 = tabuleiro[l][c].firstChild;

      if(vez =='P') {
        peca1.className = "peca preto";
        conteudo[l][c] = 'P';
        console.log("Preto jogou!");
      } else {
        peca1.className = "peca branco";
        conteudo[l][c] = 'B';
        console.log("Branco jogou!");
      }

      flip(l,c);

      var peca2;
      for(let l=0; l<8; l++) {
        for(let c=0; c<8; c++) {
          peca2 = tabuleiro[l][c].firstChild;

          if(vez == 'P'){
            peca2.classList.remove("validas_branco");
            //console.log("remove válida branca: ("+l+","+c+")");
          }
          else if(vez == 'B')
            peca2.classList.remove("validas_preto");
            //console.log("remove válida preta: ("+l+","+c+")");
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

      function terminar() {
        console.log("terminando");
        
        if(desistiu)
          vencedor = "computador";
        else {
          var p;
          var b; 
          var l;
          soma_pecas(p,b,l);

          if((p>b && cor == 'P') || (p<b && cor == 'B' ))
            vencedor = "humano";
          else if((p<b && cor == 'P') || (p>b && cor == 'B' ))
            vencedor = "computador";
          else
            vencedor = "empate";
        }
        alert("vencedor: "+ vencedor);

        ////////
        oponente1="";
        cor1="Preto";
        dificuldade1="";
        mostraMostra();
        location.reload();
      }

      function MudarDeVez(){

        if(terminou() || desistiu) {
          terminar();
        }

        if(vez == 'B'){
          vez='P';
          console.log("vez do preto");
        }
        else if(vez=='P'){
          vez='B';
          console.log("vez do branco");
        }    

        console.log("já no tabuleiro:");
        for(let l=0; l<8; l++) {
          for(let c=0; c<8; c++) {
            if(conteudo[l][c] == vez) {
              console.log("\t("+l+","+c+")");
            }
          }
        }


        jogadas_legais   = calcular_legais(vez);
        var n_jogadas_vez     = count_legais(jogadas_legais);
        var peca1;

        console.log("jogadas legais de vez: " + n_jogadas_vez);
        console.log(jogadas_legais); 


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
              console.log("\t("+l+","+c+")");
            }
          }
        }  

        if(vez_computador()) {
          computador();
        }
      }

      function desistir() {
        desistiu = true;
        alert("ganhou alguém");
        MudarDeVez();
      }

      function terminou() {/*
        if(soma_pecas()==64) {
          alert("jogo acabou!");
          return true;
        }
        else*/
          return false;
      }

      function flip_celula(l,c) {

        conteudo[l][c] = vez;
        let peca = tabuleiro[l][c].firstChild;

        if(vez=='P')
          peca.className = "peca preto";
        else
          peca.className = "peca branco";
      }

      function flip_linha(dl, dc, l, c) {     
        if((l+dl < 0) || (l+dl > 7)) {
          return false;
        }
        if((c+dc < 0) || (c+dc > 7)) {
          return false;
        }
        if(conteudo[l+dl][c+dc] == ' ') {
          return false;
        }
        if(conteudo[l+dl][c+dc] == vez) { 
          return true;
        }
        else {
          if(flip_linha(dl,dc,l+dl,c+dc)) {
            flip_celula(l+dl,c+dc);
            return true;
          }
          else {
            return false;
          }
        }
      }

      function flip(l,c) {
        flip_linha(-1, -1, l, c);
        flip_linha(-1,  0, l, c);
        flip_linha(-1,  1, l, c);

        flip_linha(1, -1, l, c);
        flip_linha(1,  0, l, c);
        flip_linha(1,  1, l, c);

        flip_linha(0, -1, l, c);
        flip_linha(0,  1, l, c);
      }

      function verifica_linha(v, dl, dc, l, c) {
      //verifica se há uma cor=vez algures na linha (l,c)+d(dl,dc)
      if(conteudo[l][c] == v)
        return true;
      if(conteudo[l][c] == ' ')
        return false;
      if((l+dl < 0) || (l+dl > 7)) {
        return false;
      }
      if((c+dc < 0) || (c+dc > 7)) { //celula adjacente direta está fora do tabuleiro
        return false;
      }

      return verifica_linha(v, dl, dc, l+dl, c+dc);
    }

    function is_legal(v, dl, dc, l, c) {
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
      if(conteudo[l+dl][c+dc] != oposta) { //celula adjacente direta tem de ser da cor oposta
        return false;
      }
      if((l+dl+dl < 0) || (l+dl+dl > 7)) { //celulas proximas estão fora do tabuleiro
        return false;
      }
      if((c+dc+dc < 0) || (c+dc+dc > 7)) {
        return false;
      }
      return verifica_linha(v, dl, dc, l+dl+dl, c+dc+dc); //ver se a linha termina na nossa cor
    }

  function calcular_legais(v) { //verificar se cada posição é legal
    var legais = new Array(8);

    for(let l = 0; l<8; l++) {
      legais[l] = new Array(8);

      for(let c=0; c<8; c++) {

        if(conteudo[l][c] == ' ') {
          legais[l][c] = ' ';

          let nw = is_legal(v, -1, -1, l, c);
          let nn = is_legal(v, -1,  0, l, c);
          let ne = is_legal(v, -1,  1, l, c);

          let sw = is_legal(v, 1, -1, l, c);
          let ss = is_legal(v, 1,  0, l, c);
          let se = is_legal(v, 1,  1, l, c);

          let ww = is_legal(v, 0, -1, l, c);
          let ee = is_legal(v, 0,  1, l, c);

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
          count ++;
        }
      }
    }
    return count;
  }

  function jogo(cor1) {

    vez = 'B';
    cor = cor1;
    conteudo = new Array(8);
    jogadas_legais;
    tabuleiro = new Array(8);
    desistiu = false;
    vencedor = "";

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
