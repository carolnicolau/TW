window.onload = function() {

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
    alert("preto!");
    cor=(document.getElementById("preto").value);
    alert("cor = "+cor);
    //vez='P';
  } 

  document.getElementById("branco").onclick = function() {
    alert("branco!");
    cor=(document.getElementById("branco").value);
    alert("cor = "+cor);
    //vez='B';
  }

  function selectDificuldade(){
    dificuldade=(document.getElementById("Dificuldade").value)
  }

  function MudarDeVez(){
    if(vez == 'B' ){
      vez='P';
    }
    else if(vez=='P'){
      vez='B';
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
    var jogo = new Jogo();
    escondeEsconde();
  }

  class Jogo { 
    
    play(l, c) {
      var peca1 = this.tabuleiro[l][c].firstChild;
      if(vez=='P') {
        peca1.className= "peca preto";
      } else {
        peca1.className= "peca branco";
      }
    }

    constructor() {

      if (!Jogo._instance) {
        Jogo._instance = this;

        this.conteudo = new Array(8);
        this.tabuleiro = new Array(8);

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
              this.conteudo[l][c] = "P"; 

            }
            else if((l==3 & c==4) || (l==4 & c==3)) {
              peca.className="peca branco";
              this.conteudo[l][c] = "B"; 

            }
            else {
              peca.className="peca livre";
              this.conteudo[l][c] = "L"; 

            }
            celula.appendChild(peca);
            
            if((vez=='P' && cor=="Preto") || (vez=='B' && cor=="Branco")) {
              celula.onclick = ((fun, posl, posc) => {
               return () => fun(posl, posc);
             })(this.play.bind(this), l, c);
           }
         }
       }
       console.log(this.conteudo);
       console.log(this.tabuleiro);
     }
     return Jogo._instance;
   }
   //////////????????????
   static getInstance() {
    return this._instance;
  }
} 
}