window.onload = function() {

  var n_vitorias=0;
  var n_derrotas=0;

  var cor="Preto";
  var oponente="";
  var dificuldade=1;

  var id_jogo;

  var vez;
  var conteudo;
  var jogadas_legais;
  var tabuleiro;
  var desistiu;
  var vencedor;
  var pode_passar;
  
  var janela = document.getElementsByClassName('janela');
  var botao = document.getElementsByClassName("botaojanela");
  var span = document.getElementsByClassName("close");


  document.getElementById("Login").onclick = function() {
    const user = document.getElementById("User").value;
    const pass = document.getElementById("Pass").value;
    if(user=='' || pass=='') {
      document.getElementById("mensagemdavez").innerText=("Preencha os campos username e password.");
      return;
    }

    register(user, pass);
  }

  botao[0].onclick = function() { //regras
    janela[0].style.display = "block";
  }
  botao[1].onclick = function() { //classificação
    janela[1].style.display = "block";
    ranking();
  } 
  span[0].onclick = function() { //regras
    janela[0].style.display = "none";
  }
  span[1].onclick = function() { //classificação
    janela[1].style.display = "none";
    const tabela = document.getElementById("classifacoes");
    tabela.innerHTML = "";
  }
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
  document.getElementById("mensagemdavez").innerText=("Escolheste as peças pretas.");
} 

document.getElementById("branco").onclick = function() {
  cor=(document.getElementById("branco").value);
  document.getElementById("mensagemdavez").innerText=("Escolheste as peças brancas.");
}

function selectDificuldade() {
  dificuldade=(document.getElementById("Dificuldade").value);
  alert(dificuldade);
}

function escondeEsconde() {
  document.getElementById("coluna_configs").style.visibility = "hidden";
}

function mostraMostra() {
  document.getElementById("coluna_configs").style.visibility = "visible";
}

  //ACCIONAR BOTÃO DE INICIAR
  document.getElementById("iniciar").onclick = function() {
    selectDificuldade();
    const user = document.getElementById("User").value;
    const pass = document.getElementById("Pass").value;
    //id_jogo = join(user, pass);
    //console.log("id:" + id_jogo);
    jogo();
    
    escondeEsconde();
  }  

  ////////////////////////////

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

  
  function computador() {
      console.log("conteudo: ");
      console.log(conteudo);

      let cop = copia_tabuleiro(conteudo);
      console.log(cop);

      let jogada = minimax(cop, dificuldade, vez, -1, -1);

      if(pode_passar) {
          console.log("passou!");
          document.getElementById("mensagemdavez").innerText=("O computador passou a vez.");
          pode_passar = false;
      }
      else 
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
        document.getElementById("mensagemdavez").innerText=("Não é a tua vez!");
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

      const user = document.getElementById("User").value;
      const pass = document.getElementById("Pass").value;
      //var move = {"row":l, "column":c};
      //console.log(id_jogo);
      //notify(user, pass, id_jogo, move);

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
        if((cor=="Branco" && vez=='P') || (cor=="Preto" && vez=='B') && oponente == "computador") {
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
        document.getElementById("mensagemdavez").innerText=("Inicia outro jogo!");
        document.getElementById("n_pretas").innerText=("");
        document.getElementById("n_brancas").innerText=("");
        document.getElementById("n_livres").innerText=("");


        const user = document.getElementById("User").value;
        const pass = document.getElementById("Pass").value;
        leave(user, pass);
        /*
        base.removeChild(base.childNodes[0]);
        base.removeChild(base.childNodes[0]);
        base.removeChild(base.childNodes[0]);
        */
        //location.reload();
      }

      function terminar() {
        console.log("terminando...");
        
        if(desistiu) {
          vencedor = "computador";
          
          n_derrotas++;
          //document.getElementById("nderrotasjogador").innerText=(n_derrotas);
          document.getElementById("mensagemdavez").innerText=("Desististe! O computador ganhou...");
        }
        else {
          let somas = soma_pecas(conteudo);
          let p  = somas[0];
          let b  = somas[1];
          let li = somas[2];

          if((p>b && cor == "Preto") || (p<b && cor == "Branco" )) {
            vencedor = "humano";
            
            n_vitorias++;
            //document.getElementById("nvitoriasjogador").innerText=(n_vitorias);
            document.getElementById("mensagemdavez").innerText=("Ganhaste!");
          }
          else if((p<b && cor == "Preto") || (p>b && cor == "Branco" )) {
            vencedor = "computador";

            n_derrotas++;
            //document.getElementById("nderrotasjogador").innerText=(n_derrotas);
            document.getElementById("mensagemdavez").innerText=("Ganhou o computador!");
          }
          else {
            vencedor = "empate";
            console.log("pretas: " + p);
            console.log("brancas: " + b);
            console.log("livres: " + li);
            document.getElementById("mensagemdavez").innerText=("Foi um empate!");
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
        if(vez_computador()) { //vez do oponente oponente(oponente==computador? computador() : timeout/update )
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
    document.getElementById("n_pretas").innerText=("2");
    document.getElementById("n_brancas").innerText=("2");
    document.getElementById("n_livres").innerText=("60");
    MudarDeVez();
  }

/*
  class jogo {

  constructor {
    if (!Jogo.instancia) {
      /*
      var cor="Preto";
      var oponente="";
      var dificuldade=1;
      
      Jogo.instancia = this;
    } else {
      alert("jogo já criado");
      return Jogo.instancia;
    }
  }

  apaga_jogo() {
    Jogo.instancia = null;
  }

}*/
}