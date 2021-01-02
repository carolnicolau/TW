

function computador() {
  var jogo = Jogo.getInstancia();
  //console.log(.log("computador");
    //console.log(.log(jogo.conteudo);


  if(jogo.pode_passar) {
    //console.log(.log("computador passou a vez");
    document.getElementById("mensagemdavez").innerText=("O computador passou a vez.");
    jogo.pode_passar = false;
  }
  else {
    let cop = copia_tabuleiro(jogo.conteudo);
    let jogada = minimax(cop, jogo.dificuldade, jogo.vez, -1, -1);
    let l = jogada[1];
    let c = jogada[2];
    play(l,c,jogo.conteudo,jogo.vez,false);
    //console.log(.log("("+l+","+c+") = " + jogo.conteudo[l][c]);
  }

  atualiza_contagem();
  MudarDeVez();
}

function humano_offline(l, c) {
  var jogo = Jogo.getInstancia();
    //console.log(.log(jogo.conteudo);


  if(vez_humano()) {
      //console.log(.log("jogadas legais: " + jogo.jogadas_legais[l][c]);
      
      if(jogo.jogadas_legais[l][c] == jogo.vez){ 
        play(l, c,jogo.conteudo,jogo.vez,false);
        //console.log(.log("("+l+","+c+") = " + jogo.conteudo[l][c]);
        atualiza_contagem();
        MudarDeVez();
      }
  } else {
      document.getElementById("mensagemdavez").innerText=("Não é a tua vez!");
  }
}

function humano_online(l, c) {
  var jogo = Jogo.getInstancia();
  let nick = jogo.user.nick;
  let pass = jogo.user.pass;

  var move = {row:l, column:c};
  notify(nick, pass , move);
}

//se não é a vez do computador e utilizador escolhe uma jogada válida
//joga essa jogada, soma_pecas e muda de vez
function humano(l, c) {
  var jogo = Jogo.getInstancia();
  //console.log(.log("humano");

  if(jogo.oponente == "Computador") {
    humano_offline(l,c);
  } else {
    humano_online(l,c);
  }
}




function comecar() {
    //console.log(.log("comecando");
  oposto_vez(false);
  var jogo = Jogo.getInstancia();
  
  let peca1 = jogo.tabuleiro[3][3].firstChild;
  let peca2 = jogo.tabuleiro[4][4].firstChild;
  let peca3 = jogo.tabuleiro[3][4].firstChild;
  let peca4 = jogo.tabuleiro[4][3].firstChild;

  jogo.conteudo[3][3] = 'B'; 
  jogo.conteudo[4][4] = 'B'; 
  jogo.conteudo[3][4] = 'P'; 
  jogo.conteudo[4][3] = 'P'; 

  animar1(peca1, "FloralWhite");
  animar1(peca2, "FloralWhite");
  animar1(peca3, "black");
  animar1(peca4, "black");

  MudarDeVez();
}

function MudarDeVez(){
  var jogo = Jogo.getInstancia();

  //console.log(.log(jogo.conteudo);

  if(terminou() || jogo.desistiu == true) {
    terminar();
    return;
  }
     
  oposto_vez(true);

  jogo.jogadas_legais    = calcular_legais(jogo.conteudo, jogo.vez);
  let n_jogadas_vez = count_legais(jogo.jogadas_legais);
  if(n_jogadas_vez == 0)
    jogo.pode_passar = true;

  ////console.log(.log(jogo.jogadas_legais);
  formata_validas();

  if(vez_computador()) { //vez do oponente oponente(oponente==computador? computador() : timeout/update )
    setTimeout(function(){ computador(); }, 1500);
  }     
}





function passa() {
  var jogo = Jogo.getInstancia();

  if(jogo.pode_passar && vez_humano()) {
      //console.log(.log("jogador passou!");

      if(jogo.oponente == "Computador")  {
        jogo.pode_passar = false;

        MudarDeVez();
      } else {
        let nick = jogo.user.nick;
        let pass = jogo.user.pass;

        notify(nick, pass , null);
      }

  } else {
    if(vez_humano())
      mensagem("Ainda tens jogadas possíveis! Não podes passar a vez.");
    else      
      mensagem("Não é a tua vez de jogar.");
  }
}

//se utilizador clica desistiu esta função é chamada
//e desistiu passa a ter valor true
function desistir() {
  //console.log(.log("jogador desistiu!");

  var jogo = Jogo.getInstancia();
  jogo.desistiu = true;

  if(jogo.oponente == "Outro Jogador") {
    const nick = jogo.user.nick;
    const pass = jogo.user.pass;
    const game = jogo.game;
    
    leave(nick, pass, game);

  } else {
    MudarDeVez();
  }
}

