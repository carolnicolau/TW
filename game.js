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
 else (document.getElementById("jogador").checked){
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

    alert("GERAR TABULEIRO");
  }
  
}










