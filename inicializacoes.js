window.onload = function() {
  var configs = new Configs();
  var user = null;

  //NAVBAR
  var janela = document.getElementsByClassName('janela');
  var botao = document.getElementsByClassName("botaojanela");
  var span = document.getElementsByClassName("close");


  //LOGIN
  document.getElementById("Login").onclick = function() {
    const nick = document.getElementById("User").value;
    const pass = document.getElementById("Pass").value;
    if(nick=='' || pass=='') {
      document.getElementById("mensagemdavez").innerText=("Preencha os campos username e password.");
      return;
    }

    register(nick, pass);
    user = new Utilizador(nick, pass);
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

  //CONFIGS
  //cor
  document.getElementById("preto").onclick = function() {
    configs.cor = (document.getElementById("preto").value);
    document.getElementById("mensagemdavez").innerText=("Escolheste as peças pretas.");
  } 

  document.getElementById("branco").onclick = function() {
    configs.cor = (document.getElementById("branco").value);
    document.getElementById("mensagemdavez").innerText=("Escolheste as peças brancas.");
  }

  //oponente
  document.getElementById("computador").onclick = function() {
    document.getElementsByClassName("cor")[0].style.visibility = "visible";
    document.getElementsByClassName("dificuldade")[0].style.visibility = "visible";
  } 

  document.getElementById("jogador").onclick = function() {
    document.getElementsByClassName("cor")[0].style.visibility = "hidden";
    document.getElementsByClassName("dificuldade")[0].style.visibility = "hidden";
  }

  function selectOponente(){
    if(document.getElementById("computador").checked){
      configs.oponente = "Computador";
    }
    if (document.getElementById("jogador").checked){
      configs.oponente = "Outro Jogador";
    }
  }

  //dificuldade
  function selectDificuldade() {
    configs.dificuldade = (document.getElementById("Dificuldade").value);
  }

  function escondeEsconde() {
    document.getElementById("coluna_configs").style.visibility = "hidden";
  }

  //ACCIONAR BOTÃO DE INICIAR
  document.getElementById("iniciar").onclick = function() {
    selectDificuldade();
    selectOponente();
    
    if(configs.oponente == "Outro Jogador" && user == null) {
      alert("User=null");
      document.getElementById("mensagemdavez").innerText=("Para jogar com outros jogadores online, por favor registe-se.");
      return;

    } else {
      if(configs.oponente == "Outro Jogador" && user != null) {

        document.getElementById("mensagemdavez").innerText=("À espera de um jogador.");
        join(user);
        escondeEsconde(); 

      } else if (configs.oponente == "Computador" && user == null) {
        
        user = new Utilizador("","");
        let jogo = new Jogo(configs, user);  
        comecar();
        escondeEsconde(); 
 
      }      
    }
  }
}