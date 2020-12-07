//calcula jogada com minimax e joga ou passa (soma_peças no fim) 
//muda de vez 
//fazia mais sentido usar minimax só no else?
function mensagem(msg) {
  document.getElementById("mensagemdavez").innerText=(msg);
  console.log(msg);
}

function animar_validas(peca, cor) {
  let raio = (peca.width)/2;
  let velocity = 3;

  peca.width = peca.width;

  let ctx = peca.getContext("2d");
  
  ctx.beginPath();
  ctx.lineWidth = 2;   
  //context.arc(x,y,r,sAngle,eAngle,counterclockwise);  
  ctx.arc(raio, raio, raio, 0, 2*Math.PI, false);
  ctx.strokeStyle = cor;
  ctx.stroke();
}

function animar1(canvas, cor) {
var c=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;

var x=cw/2;
var y=ch/2;
var velocidade=2;
var raio=4;

animar1_aux(c, x, y, cw, ch, velocidade, raio, cor);
}

  
function animar1_aux(c, x, y, cw, ch, velocidade, raio, cor) {
  
  c.clearRect(0,0,cw,ch);
  c.beginPath();    
  c.arc(x,y,raio,0,Math.PI*2,false);
  c.strokeStyle=cor;
  c.stroke(); 
  c.fillStyle=cor;
  c.fill();

  if (x+raio>cw || raio<0) {
    velocidade=-velocidade;
    return;  
  }  
  
  raio+=velocidade;

  requestAnimationFrame(()=>(animar1_aux(c, x, y, cw, ch, velocidade, raio, cor)));
}

function animar2(peca, cor, outra) {
  let raio = (peca.width)/2;
  let alpha = raio;
  let velocity = 3;

  let ctx = peca.getContext("2d");

  animar2_aux(peca, raio, alpha, velocity, cor, outra);
}

function animar2_aux(peca, r, alpha, velocity, cor, outra) {

  peca.width = peca.width;

  let ctx = peca.getContext("2d");
  
  ctx.beginPath()
  ctx.ellipse(r, r, alpha, r, 0, 0, Math.PI * 2, false);
  ctx.fillStyle = cor;
  ctx.fill();
 
  alpha -= velocity;
    
  if(alpha < velocity) {
    velocity = -velocity;
    cor = outra;
  }
  
  if(alpha > r) {
    return;
  }
  
  requestAnimationFrame(()=>(animar2_aux(peca, r, alpha, velocity, cor, outra)));
}

/*
function animar2(l, c, cor1, cor2) { 
  var jogo = Jogo.getInstancia();
  let canvas = jogo.tabuleiro[l][c].firstChild;

  let raioY = (canvas.width)/2; // 96/2 = 48 (mod 3 = 0)
  let raioX = raioY;
  let delta = 3;

  let ctx = canvas.getContext("2d");
  console.log("comecou com cor = " + cor1);

  animar2_aux(canvas, raioX, raioY, delta, cor1, cor2);
}

function animar2_aux(canvas, raioX, raioY, delta, cor1, cor2) {
  canvas.width = canvas.width;
  let ctx = canvas.getContext("2d");
  
  ctx.beginPath();
  //ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle [, anticlockwise]);
  ctx.ellipse(raioY, raioY, raioX, raioY, 0, 0, Math.PI * 2, false);
  ctx.fillStyle = cor1;
  ctx.fill();
 
  raioX -= delta;
    
  if(raioX < delta) { //se largura é menor que delta(3) -> só raioX=0
    delta = -delta;   //começa a aumentar
    cor1 = cor2;
    console.log("mudou!! cor = " + cor1);
  }

  
  if(raioX >= raioY) { //se é circulo sai
    console.log("parou com cor = " + cor1);
    //ctx.restore();
    //return;
  } else {  
    //setInterval(animar2_aux(canvas, raioX, raioY, delta, cor1, cor2), 1000);
    requestAnimationFrame(()=>(animar2_aux(canvas, raioX, raioY, delta, cor1, cor2)));
  }
}*/



function computador() {
  var jogo = Jogo.getInstancia();
  console.log("computador");
    console.log(jogo.conteudo);


  if(jogo.pode_passar) {
    console.log("computador passou a vez");
    document.getElementById("mensagemdavez").innerText=("O computador passou a vez.");
    jogo.pode_passar = false;
  }
  else {
    let cop = copia_tabuleiro(jogo.conteudo);
    let jogada = minimax(cop, jogo.dificuldade, jogo.vez, -1, -1);
    let l = jogada[1];
    let c = jogada[2];
    play(l,c,jogo.conteudo,jogo.vez,false);
    console.log("("+l+","+c+") = " + jogo.conteudo[l][c]);
  }

  atualiza_contagem();
  MudarDeVez();
}

function humano_offline(l, c) {
  var jogo = Jogo.getInstancia();
    console.log(jogo.conteudo);


  if(vez_humano()) {
      console.log("jogadas legais: " + jogo.jogadas_legais[l][c]);
      
      if(jogo.jogadas_legais[l][c] == jogo.vez){ 
        play(l, c,jogo.conteudo,jogo.vez,false);
        console.log("("+l+","+c+") = " + jogo.conteudo[l][c]);
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
  console.log("humano");

  if(jogo.oponente == "Computador") {
    humano_offline(l,c);
  } else {
    humano_online(l,c);
  }
}

function classificacoes() {
  if (typeof(Storage) !== 'undefined') {
    let keys = Object.keys(localStorage);
    let n = keys.length;
    let rank = new Array(n);

    for(let i=0; i<n; i++) {
      let data = localStorage.getItem(keys[i]);
      rank[i] = JSON.parse(data);
    }
    atualizar_classific(rank);
  }
}


function store(n_vitorias) {
  var jogo = Jogo.getInstancia();

  if (typeof(Storage) !== 'undefined') {
      let nick = jogo.user.nick;
      
      if( nick == "")
        nick = "não autenticado";

      //localStorage.clear();
      let data  = localStorage.getItem(nick);
      let parsed;
  
      if(!data) {
        parsed = { nick, victories : 0, games : 0 } ;
      } else {
        parsed = JSON.parse(data);
      }
      
      parsed.victories = parsed.victories + n_vitorias;
      parsed.games = parsed.games + 1;

      let string = JSON.stringify(parsed);
      localStorage.setItem(nick, string);
    }
}

function terminar_online() {
  var jogo = Jogo.getInstancia();

  if(jogo.vencedor == null) {
      mensagem("Foi empate.");
      alert("Foi empate.");
  } else if(jogo.vencedor == "") {
      console.log("saiu.");
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
        console.log("pretas: " + p);
        console.log("brancas: " + b);
        console.log("livres: " + li);
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
  console.log("terminando....");

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

function comecar() {
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

  animar1(peca1, "red");
  animar1(peca2, "red");
  animar1(peca3, "black");
  animar1(peca4, "black");

  MudarDeVez();
}

function MudarDeVez(){
  var jogo = Jogo.getInstancia();

  console.log(jogo.conteudo);

  if(terminou() || jogo.desistiu == true) {
    terminar();
    return;
  }
     
  oposto_vez(true);

  jogo.jogadas_legais    = calcular_legais(jogo.conteudo, jogo.vez);
  let n_jogadas_vez = count_legais(jogo.jogadas_legais);
  if(n_jogadas_vez == 0)
    jogo.pode_passar = true;

  //console.log(jogo.jogadas_legais);
  formata_validas();

  if(vez_computador()) { //vez do oponente oponente(oponente==computador? computador() : timeout/update )
    setTimeout(function(){ computador(); }, 3000);
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



function passa() {
  var jogo = Jogo.getInstancia();

  if(jogo.pode_passar && vez_humano()) {
    console.log("jogador passou!");
    jogo.pode_passar = false;
    MudarDeVez();
  } else {
    mensagem("Ainda tens jogadas possíveis! Não podes passar a vez.");
  }
}

//se utilizador clica desistiu esta função é chamada
//e desistiu passa a ter valor true
function desistir() {
  console.log("jogador desistiu!");

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

//retorna true se o jogo terminoou porque não há mais jogadas possíveis para nenhum dos jogadores
function terminou() {
  var jogo = Jogo.getInstancia();

  let jogadas_legaisB  = calcular_legais(jogo.conteudo, 'B');
  let nB               = count_legais(jogadas_legaisB);
  let jogadas_legaisP  = calcular_legais(jogo.conteudo, 'P');
  let nP               = count_legais(jogadas_legaisP);

  /*
  console.log("Jogadas legais de preto:");
  console.log(jogadas_legaisP);
  console.log("Jogadas legais de branco:");
  console.log(jogadas_legaisB);
  */
  if(nB == 0 && nP == 0) {
    console.log("jogo terminou");
    return true;
  }
  else
    return false;
}