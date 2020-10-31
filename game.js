window.onload = function() {

  var jogo;
  
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

  var oponente="";
  var vez = 'P';
  var cor="Preto";
  var dificuldade="";

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

  function selectDificuldade(){
    dificuldade=(document.getElementById("Dificuldade").value); 
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

  function MudarDeVez(){
    if(n_jogadas_vez == 0 && n_jogadas_op == 0) {
      console.log("termina!!!!");
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
        if(jogo.conteudo[l][c] == vez) {
          console.log("\t("+l+","+c+")");
        }
      }
    }
    
    jogo.jogadas_legais   = jogo.calcular_legais(vez);
    //var jogadas_legais_op = jogo.calcular_legais(oposto_vez());
    var n_jogadas_vez     = jogo.count_legais(jogo.jogadas_legais);
    //var n_jogadas_op      = jogo.count_legais(jogadas_legais_op);
    
    console.log("jogadas legais de vez: " + n_jogadas_vez);
    console.log(jogo.jogadas_legais); 
    for(let l=0; l<8; l++) {
      for(let c=0; c<8; c++) {
        if(jogo.jogadas_legais[l][c] == vez) {
          console.log("\t("+l+","+c+")");
        }
      }
    }
    /*
    console.log("jogadas legais de op: " + n_jogadas_op); 
    console.log(jogadas_legais_op); 
    for(let l=0; l<8; l++) {
      for(let c=0; c<8; c++) {
        if(jogadas_legais_op[l][c] == oposto_vez()) {
          console.log("\t("+l+","+c+")");
        }
      }
    }
    */
    if(vez_computador()) {
      computador();
    }
  }

  function desistir() {
    alert("ganhou alguém");
  }

  function escondeEsconde() {
    document.getElementById("coluna_configs").style.visibility = "hidden";
  }
  function mostraMostra() {
    document.getElementById("coluna_configs").style.visibility = "visible";
  }
  //ACCIONAR BOTÃO DE INICIAR
  document.getElementById("iniciar").onclick = function() {
    jogo = new Jogo();
    escondeEsconde();

    /***************************/
    jogo.jogadas_legais   = jogo.calcular_legais(vez);
    //var jogadas_legais_op = jogo.calcular_legais(oposto_vez());
    var n_jogadas_vez     = jogo.count_legais(jogo.jogadas_legais);
    //var n_jogadas_op      = jogo.count_legais(jogadas_legais_op);
    
    console.log("jogadas legais de vez: " + n_jogadas_vez);
    console.log(jogo.jogadas_legais); 
    for(let l=0; l<8; l++) {
      for(let c=0; c<8; c++) {
        if(jogo.jogadas_legais[l][c] == vez) {
          console.log("\t("+l+","+c+")");
        }
      }
    }
    /***************************/
    if(vez_computador())
      computador();
  }

  function soma_pecas() {
      let conta_pretas=0;
      let conta_brancas=0;
      let conta_livres=0;

      for(let l = 0; l<8; l++) {
        for(let c=0; c<8; c++) {
          if(jogo.conteudo[l][c] == 'B')
            conta_brancas ++;
          else if(jogo.conteudo[l][c] == 'P')
            conta_pretas ++;
          else
            conta_livres ++;
        }
      }
      document.getElementById("n_brancas").innerText = conta_brancas;
      document.getElementById("n_pretas").innerText = conta_pretas;
      document.getElementById("n_livres").innerText = conta_livres;
    }

  function computador() {
    //var jogadas_legais = jogo.calcular_legais(vez, jogo.conteudo);
    jogo.play(1,1);
    MudarDeVez();
  }

  class Jogo { 

    verifica_linha(v, dl, dc, l, c) {
      //verifica se há uma cor=vez algures na linha (l,c)+d(dl,dc)
      if(this.conteudo[l][c] == v)
        return true;
      if(this.conteudo[l][c] == ' ')
        return false;
      if((l+dl < 0) || (l+dl > 7)) {
        return false;
      }
      if((c+dc < 0) || (c+dc > 7)) { //celula adjacente direta está fora do tabuleiro
        return false;
      }

      return this.verifica_linha(v, dl, dc, l+dl, c+dc);
    }

    is_legal(v, dl, dc, l, c) {
      //verifica se a posição adjacente a l,c têm cor oposta a vez 
      //e se a reta (l,c)+d(dl,dc) termina em cor=vez
      let oposta = oposto_vez();
      
      if((l+dl < 0) || (l+dl > 7)) {
        return false;
      }
      if((c+dc < 0) || (c+dc > 7)) { //celula adjacente direta está fora do tabuleiro
        return false;
      }
      if(this.conteudo[l+dl][c+dc] != oposta) { //celula adjacente direta é da cor oposta
        return false;
      }
      if((l+dl+dl < 0) || (l+dl+dl > 7)) { //celulas proximas estão fora do tabuleiro
        return false;
      }
      if((c+dc+dc < 0) || (c+dc+dc > 7)) {
        return false;
      }
      return this.verifica_linha(v, dl, dc, l+dl+dl, c+dc+dc); //ver se a linha termina na nossa cor
    }

    calcular_legais(v) { //verificar se cada posição é legal
      var legais = new Array(8);

      for(let l = 0; l<8; l++) {
        legais[l] = new Array(8);
        
        for(let c=0; c<8; c++) {
          legais[l][c] = ' ';

          let nw = this.is_legal(v, -1, -1, l, c);
          let nn = this.is_legal(v, -1,  0, l, c);
          let ne = this.is_legal(v, -1,  1, l, c);
          
          let sw = this.is_legal(v, 1, -1, l, c);
          let ss = this.is_legal(v, 1,  0, l, c);
          let se = this.is_legal(v, 1,  1, l, c);
          
          let ww = this.is_legal(v, 0, -1, l, c);
          let ee = this.is_legal(v, 0,  1, l, c);

          if(nw || nn || ne || sw || ss || se || ww || ee) {
            legais[l][c] = v; 
          }
        }
      }
      return legais;
    }

    count_legais(legais) {
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

    humano(l, c) {
      if(!vez_computador()) {
        this.play(l, c);
        MudarDeVez();
      } else {
        alert("Não é a tua vez!");
      }
    }

    play(l, c) {
      //this.jogadas_legais = this.calcular_legais();

      var peca1 = this.tabuleiro[l][c].firstChild;
        
      if(this.conteudo[l][c] == ' '){ //verificação passa para jogada válida
        if(vez =='P') {
          peca1.className = "peca preto";
          this.conteudo[l][c] = 'P';
          console.log("Preto jogou!");
        } else {
          peca1.className = "peca branco";
          this.conteudo[l][c] = 'B';
          console.log("Branco jogou!");
        }
        soma_pecas();
      }
    }

    constructor() {

      if (!Jogo.instancia) {
        Jogo.instancia = this;

        this.conteudo = new Array(8);
        this.jogadas_legais;
        this.tabuleiro = new Array(8);

        /*
        oponente="";
        vez = 'P';
        cor="Preto";
        dificuldade="";
        */
        const base = document.getElementById("base");
        const tabul = document.createElement("div");
        const passar = document.createElement("button");
        const desistir = document.createElement("button");


        tabul.className = "tabuleiro";
        passar.innerText = "Passar jogada";
        desistir.innerText = "Desistir";
        desistir.id = "desistir";

        desistir.onclick = function() {
          mostraMostra();
        };
         
        base.appendChild(tabul);
        base.appendChild(passar);
        base.appendChild(desistir);


        for(let l = 0; l<8; l++) {

          const linha = document.createElement("div");
          linha.className="linha";
          tabul.appendChild(linha);
          this.conteudo[l] = new Array(8);
          this.tabuleiro[l] = new Array(8);


          for(let c=0; c<8; c++) {
            const celula = document.createElement("div");
            celula.className="celula";
            this.tabuleiro[l][c] = celula;


            linha.appendChild(celula);

            const peca =document.createElement("div");

            if((l==3 & c==3) || (l==4 & c==4)) {
              peca.className="peca preto";            
              this.conteudo[l][c] = 'P'; 

            }
            else if((l==3 & c==4) || (l==4 & c==3)) {
              peca.className="peca branco";
              this.conteudo[l][c] = 'B'; 

            }
            else {
              peca.className="peca livre";
              this.conteudo[l][c] = ' '; 

            }
            celula.appendChild(peca);
            
            celula.onclick = ((fun, posl, posc) => {
              return () => fun(posl, posc);
            })(this.humano.bind(this), l, c);
           
         }
       }
       console.log(this.conteudo);
       console.log(this.tabuleiro);
     }
     return Jogo.instancia;
   }
   //////////????????????
   static getInstancia() {
    return this._instance;
  }
} 
}