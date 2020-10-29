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

  function selectOponente(){
    if(document.getElementById("computador").checked){
     oponente="Computador";
   }
   if (document.getElementById("jogador").checked){
     oponente="Jogador";
   }
 }

  var vez = 0; //0-user 1-oponente
  var cor="Preto";

  document.getElementById("preto").onclick = function() {
    cor=(document.getElementById("preto").value);
    vez=0;
  } 

  document.getElementById("branco").onclick = function() {
    cor=(document.getElementById("branco").value);
    vez = 1;
  }

  var dificuldade="";

  function selectDificuldade(){
    dificuldade=(document.getElementById("Dificuldade").value)
  }

  function MudarDeVez(){
    if(vez == 1 ){
      vez=0;
    }
    else if(vez==0){
      vez=1;
    }
  }


  //ACCIONAR BOTÃO DE INICIAR
  document.getElementById("iniciar").onclick = function() {
    var tabuleiro = new Tabuleiro();
  }

  class Tabuleiro {
      constructor() {
        //this.conteudo  = nome;

        const base = document.getElementById("base");
        const tabul = document.createElement("div");

        tabul.className = "tabuleiro";
        base.appendChild(tabul);

        for(let l = 0; l<8; l++) {

          const linha = document.createElement("div");
          linha.className="linha";
          tabul.appendChild(linha);

          for(let c=0; c<8; c++) {
            const celula = document.createElement("div");
            celula.className="celula";
            linha.appendChild(celula);

            const peca =document.createElement("div");

            if((l==3 & c==3) || (l==4 & c==4)) {
              peca.className="peca preto";
            }
            else if((l==3 & c==4) || (l==4 & c==3)) {
              peca.className="peca branco";
            }
            else {
              peca.className="peca livre";
            }
            celula.appendChild(peca);

            //celula.onclick = ( (fun,pos) => {return () => fun(pos);} ) (this.play.bind(this),i);
        }
      }
    }
/*
    clicar() {}

    limpar_jogo() {}
    */
    
  } 

  /*
    class Singleton {
      constructor() {
        if (!Singleton._instance) {
          Singleton._instance = this;
        }
        return Singleton._instance;
      }
      static getInstance() {
        return this._instance;
      }
      function Singleton() {
        if (!Singleton._instance) {
          Singleton._instance = this;
        }

        Singleton.getInstance = function () {
          return this._instance;
        };
        return Singleton._instance;
      }

*/
}