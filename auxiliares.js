function mensagem(msg) {
  document.getElementById("mensagemdavez").innerText=(msg);
  //console.log(.log(msg);
}

function terminar_online() {
  var jogo = Jogo.getInstancia();

  if(jogo.vencedor == null) {
      mensagem("Foi empate.");
      alert("Foi empate.");
  } else if(jogo.vencedor == "") {
      //console.log(.log("saiu.");
  } else {
      mensagem( jogo.vencedor + " ganhou o jogo!");
      alert( jogo.vencedor + " ganhou o jogo!");
  }
}

function terminar_offline() {
  var jogo = Jogo.getInstancia();
  let n_vitorias = 0;

    if(jogo.desistiu) {
      jogo.vencedor = "computador";
            
      mensagem("Desististe! O computador ganhou...");
      alert("Desististe! O computador ganhou...");      
    }
    else {
      let somas = jogo.contagem;
      let p  = somas.dark;
      let b  = somas.light;
      let li = somas.empty;

      if((p>b && jogo.cor == "Preto") || (p<b && jogo.cor == "Branco" )) {
        jogo.vencedor = "humano";
              
        n_vitorias++;
        mensagem("Ganhaste!");
        alert("Ganhaste!");
      }
      else if((p<b && jogo.cor == "Preto") || (p>b && jogo.cor == "Branco" )) {
        jogo.vencedor = "computador";

        mensagem("Ganhou o computador ...");
        alert("Ganhou o computador ...");
      }
      else {
        jogo.vencedor = "empate";
        //console.log(.log("pretas: " + p);
        //console.log(.log("brancas: " + b);
        //console.log(.log("livres: " + li);
        mensagem("Foi um empate!");
        alert("Foi um empate!");
      }
    }

    store(n_vitorias);
}


//calcula o vencedor e chama apagar
//acrescentar timeout antes de apagar para dar tempo de ler as msgs???
function terminar() {
  var jogo = Jogo.getInstancia();
  //console.log(.log("terminando....");

  if(jogo.oponente == "Computador") {    
    terminar_offline();
  } else {
    terminar_online();
  }
  
  //GUARDAR VENCEDOR!!!!!!!
  //let x = setTimeout(apagar, 2500);
  apagar();
}

function atualiza_contagem() {
  var jogo = Jogo.getInstancia();

  if(jogo.oponente == "Computador") {
    jogo.contagem = soma_pecas(jogo.conteudo);
  }
  document.getElementById("n_brancas").innerText = jogo.contagem.light;
  document.getElementById("n_pretas").innerText = jogo.contagem.dark;
  document.getElementById("n_livres").innerText = jogo.contagem.empty;
}

function formata_validas() {
  var jogo = Jogo.getInstancia();
  let peca1;
  
  for(let l=0; l<8; l++) {
    for(let c=0; c<8; c++) {


      if(jogo.conteudo[l][c] == ' ') {
        peca1 = jogo.tabuleiro[l][c].firstChild;
        peca1.width = peca1.width;
      }

      /*
      if(jogo.vez=='B') {
        peca1.classList.remove("validas_preto");
      }
      else if (jogo.vez=='P') {
        peca1.classList.remove("validas_branco");
      }*/
    }
  }  
  
  for(let l=0; l<8; l++) {
    for(let c=0; c<8; c++) {
      peca1 = jogo.tabuleiro[l][c].firstChild;

      if(jogo.jogadas_legais[l][c] == jogo.vez) { //se (l,c) é uma jogada legal de vez
        if(jogo.vez=='B') {
          //peca1.classList += " validas_branco";
          animar_validas(peca1, "yellow");
        }
        else if (jogo.vez=='P') {
          //peca1.className += " validas_preto";
          animar_validas(peca1, "purple");
        }
      }
    }
  }  
}


function vez_humano() {
  var jogo = Jogo.getInstancia();

  if((jogo.cor=="Branco" && jogo.vez=='B') || (jogo.cor=="Preto" && jogo.vez=='P')) {
    return true;
  }
  if(jogo.user.nick == jogo.vez) {
    return true;
  }
  return false;
}

//retorna true se é a vez do computador
//e false se não é
function vez_computador() {
  var jogo = Jogo.getInstancia();

  if(jogo.oponente == "Computador" && ((jogo.cor=="Branco" && jogo.vez=='P') || (jogo.cor=="Preto" && jogo.vez=='B'))) {
    return true;
  }
  return false;
}



//retorna a cor que não está na sua vez de jogar
function oposto_vez(imprime){
  var jogo = Jogo.getInstancia();

  if(jogo.vez == 'B'){
    jogo.vez='P';

    if(imprime) {
      document.getElementById("mensagemdavez").innerText="É a vez das peças pretas.";
      //console.log(.log("vez do preto");
    }
  }
  else if(jogo.vez =='P'){
    jogo.vez='B';

    if(imprime) {
      document.getElementById("mensagemdavez").innerText="É a vez das peças brancas.";
      //console.log(.log("vez do branco");
    }
  }
}


function mostraMostra() {
    document.getElementById("coluna_configs").style.visibility = "visible";
  }

//apaga o elem tabuleiro e nº de pecas da tabela
//informa o servidor que sai do jogo
function apagar() {
  var jogo = Jogo.getInstancia();
  //console.log(.log("apagando");

  Configs.reset();
  mostraMostra();

  let base = document.getElementById("base");
  base.innerHTML = "";

  document.getElementById("mensagemdavez").innerText=("Inicia outro jogo!");
  document.getElementById("n_pretas").innerText=("");
  document.getElementById("n_brancas").innerText=("");
  document.getElementById("n_livres").innerText=("");
  
  Jogo.elimina();
}

//retorna true se o jogo terminoou porque não há mais jogadas possíveis para nenhum dos jogadores
function terminou() {
  var jogo = Jogo.getInstancia();

  let jogadas_legaisB  = calcular_legais(jogo.conteudo, 'B');
  let nB               = count_legais(jogadas_legaisB);
  let jogadas_legaisP  = calcular_legais(jogo.conteudo, 'P');
  let nP               = count_legais(jogadas_legaisP);

  if(nB == 0 && nP == 0) {
    //console.log(.log("jogo terminou");
    return true;
  }
  else
    return false;
}