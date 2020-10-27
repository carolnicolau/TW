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

var cor=null;

var branco= document.getElementById("branco");

branco.addEventListener("click", function( ) {
    cor = branco.getAttribute("value");
}, false);

var preto= document.getElementById("preto");
preto.addEventListener("click", function( ) {
    cor= preto.getAttribute("value");

}, false);





