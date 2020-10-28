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

  var cor="";

  document.getElementById("preto").onclick = function() {
    cor=(document.getElementById("preto").value);
  } 

  document.getElementById("branco").onclick = function() {
    cor=(document.getElementById("branco").value);
  }

  var dificuldade="";

  function selectDificuldade(){
    dificuldade=(document.getElementById("Dificuldade").value)
  }

  //ACCIONAR BOTÃO DE INICIAR
  document.getElementById("iniciar").onclick = function() {

    if(cor=="" && oponente == "") {
      alert("Selecione as configurações");
    }
    else {
      alert( "oioioioi");
      const base = document.getElementById("base");
      const tabul = document.createElement("div");

      tabul.className = "tabuleiro";
      base.appendChild(tabul);
    }
  }

  /*
  //Gerar Tabuleiro
  const tabuleiro = new Tabuleiro("base"); //chamar só depois de selecionar configs?
  
  class Tabuleiro {

    constructor(id_base) {

      const base = document.getElementById(id_base);
      const tabul = document.createElement("div");

      tabul.className = "tabuleiro";
      tabul.id = "tabul";
      base.appendChild(tabul);


      /*
      for(let l = 0; l<8; l++) {
        const linha = document.createElement("div");
        for(let c=0; c<8; c++) {
          const celula = document.createElement("div");
        }
      }

      parent.appendChild(counter);
      counter.appendChild(incr);
      counter.appendChild(reset);
      counter.appendChild(this.display);
      
    }
  }
  */
}