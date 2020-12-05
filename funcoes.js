//calcula jogada com minimax e joga ou passa (soma_peças no fim) 
//muda de vez 
//fazia mais sentido usar minimax só no else?
function computador() {
  var jogo = Jogo.getInstancia();
  console.log("computador");

  if(jogo.pode_passar) {
    console.log("computador passou a vez");
    document.getElementById("mensagemdavez").innerText=("O computador passou a vez.");
    jogo.pode_passar = false;
  }
  else {
    let cop = copia_tabuleiro(jogo.conteudo);
    let jogada = minimax(cop, jogo.dificuldade, jogo.vez, -1, -1);
    play(jogada[1],jogada[2],jogo.conteudo,jogo.vez,false);
  }

  atualiza_contagem();
  MudarDeVez();
}

//se não é a vez do computador e utilizador escolhe uma jogada válida
//joga essa jogada, soma_pecas e muda de vez
function humano(l, c) {
  var jogo = Jogo.getInstancia();
  console.log("humano");

  if(vez_humano()) {

    if(jogo.jogadas_legais[l][c] == jogo.vez){ 
      play(l, c,jogo.conteudo,jogo.vez,false);
        atualiza_contagem();
        MudarDeVez();
    }
  } else {
    document.getElementById("mensagemdavez").innerText=("Não é a tua vez!");
  }
}

//calcula o vencedor e chama apagar
//acrescentar timeout antes de apagar para dar tempo de ler as msgs???
function terminar() {
  var jogo = Jogo.getInstancia();
  console.log("terminando....");

        
  if(jogo.desistiu) {
    jogo.vencedor = "computador";
          
    jogo.user.n_derrotas++;
    //document.getElementById("nderrotasjogador").innerText=(n_derrotas);
    document.getElementById("mensagemdavez").innerText=("Desististe! O computador ganhou...");
  }
  else {
    let somas = jogo.contagem;
    let p  = somas.dark;
    let b  = somas.ligth;
    let li = somas.empty;

    if((p>b && jogo.cor == "Preto") || (p<b && jogo.cor == "Branco" )) {
      jogo.vencedor = "humano";
            
      jogo.user.n_vitorias++;
      //document.getElementById("nvitoriasjogador").innerText=(n_vitorias);
      document.getElementById("mensagemdavez").innerText=("Ganhaste!");
    }
    else if((p<b && jogo.cor == "Preto") || (p>b && jogo.cor == "Branco" )) {
      jogo.vencedor = "computador";

      jogo.user.n_derrotas++;
      //document.getElementById("nderrotasjogador").innerText=(n_derrotas);
      document.getElementById("mensagemdavez").innerText=("Ganhou o computador ...");
    }
    else {
      jogo.vencedor = "empate";
      console.log("pretas: " + p);
      console.log("brancas: " + b);
      console.log("livres: " + li);
      document.getElementById("mensagemdavez").innerText=("Foi um empate!");
    }
  }
  console.log("vencedor: "+ jogo.vencedor);

  //GUARDAR VENCEDOR!!!!!!!
  let x = setTimeout(apagar, 2500);
}

function atualiza_contagem() {
  var jogo = Jogo.getInstancia();

  if(jogo.oponente == "Computador") {
    jogo.contagem = soma_pecas(jogo.conteudo);
  }
  document.getElementById("n_brancas").innerText = jogo.contagem.ligth;
  document.getElementById("n_pretas").innerText = jogo.contagem.dark;
  document.getElementById("n_livres").innerText = jogo.contagem.empty;
}

function formata_validas() {
  var jogo = Jogo.getInstancia();
  let peca1;

  for(let l=0; l<8; l++) {
    for(let c=0; c<8; c++) {
      peca1 = jogo.tabuleiro[l][c].firstChild;

      if(jogo.vez=='B') {
        peca1.classList.remove("validas_preto");
      }
      else if (jogo.vez=='P') {
        peca1.classList.remove("validas_branco");
      }

      if(jogo.jogadas_legais[l][c] == jogo.vez) { //se (l,c) é uma jogada legal de vez
        if(jogo.vez=='B') {
          peca1.classList += " validas_branco";
        }
        else if (jogo.vez=='P') {
          peca1.className += " validas_preto";
        }
      }
    }
  }  
}

function comecar() {
  oposto_vez(false);
  MudarDeVez();
}

function MudarDeVez(){
  var jogo = Jogo.getInstancia();

  if(terminou() || jogo.desistiu) {
    terminar();
    return;
  }
     
  oposto_vez(true);

  jogo.jogadas_legais    = calcular_legais(jogo.conteudo, jogo.vez);
  let n_jogadas_vez = count_legais(jogo.jogadas_legais);
  if(n_jogadas_vez == 0)
    jogo.pode_passar = true;

  console.log(jogo.jogadas_legais);
  formata_validas();

  if(vez_computador()) { //vez do oponente oponente(oponente==computador? computador() : timeout/update )
    setTimeout(function(){ computador(); }, 1000);
  }     
}
function vez_humano() {
  var jogo = Jogo.getInstancia();

  if((jogo.cor=="Branco" && jogo.vez=='B') || (jogo.cor=="Preto" && jogo.vez=='P')) {
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
      console.log("vez do preto");
    }
  }
  else if(jogo.vez =='P'){
    jogo.vez='B';

    if(imprime) {
      document.getElementById("mensagemdavez").innerText="É a vez das peças brancas.";
      console.log("vez do branco");
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
  console.log("apagando");

  ////////
  /*
  jogo.cor="Preto";
  jogo.dificuldade=1;
  jogo.oponente="";
  */
  Configs.reset();
  mostraMostra();
  let base = document.getElementById("base");
  base.innerHTML = "";
  
  if(jogo.oponente == "Outro Jogador") {
    const nick = jogo.user.nick;
    const pass = jogo.user.pass;
    const game = jogo.game;
    leave(nick, pass, game);
  }
  Jogo.elimina();


  document.getElementById("mensagemdavez").innerText=("Inicia outro jogo!");
  document.getElementById("n_pretas").innerText=("");
  document.getElementById("n_brancas").innerText=("");
  document.getElementById("n_livres").innerText=("");
  /*
  base.removeChild(base.childNodes[0]);
  base.removeChild(base.childNodes[0]);
  base.removeChild(base.childNodes[0]);
  */
  //location.reload();
}



function passa() {
  var jogo = Jogo.getInstancia();

  if(jogo.pode_passar && !vez_computador()) {
    console.log("jogador passou!");
    jogo.pode_passar = false;
    MudarDeVez();
  }
}

//se utilizador clica desistiu esta função é chamada
//e desistiu passa a ter valor true
function desistir() {
  var jogo = Jogo.getInstancia();

  jogo.desistiu = true;
  console.log("jogador desistiu!");
  MudarDeVez();
}

//retorna true se o jogo terminoou porque não há mais jogadas possíveis para nenhum dos jogadores
function terminou() {
  var jogo = Jogo.getInstancia();

  let jogadas_legaisB  = calcular_legais(jogo.conteudo, 'B');
  let nB               = count_legais(jogadas_legaisB);
  let jogadas_legaisP  = calcular_legais(jogo.conteudo, 'P');
  let nP               = count_legais(jogadas_legaisP);

  if(nB == 0 && nP == 0) {
    console.log("jogo terminou");
    return true;
  }
  else
    return false;
}