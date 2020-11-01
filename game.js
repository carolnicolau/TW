window.onload = function() {

  var jogo;
  
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

  var oponente1="";
  var cor1="Preto";
  var dificuldade1="";

  function selectOponente(){
    if(document.getElementById("computador").checked){
     oponente1="Computador";
   }
   if (document.getElementById("jogador").checked){
     oponente1="Jogador";
   }
 }

  document.getElementById("preto").onclick = function() {
    cor1=(document.getElementById("preto").value);
    alert("cor = "+cor1);
  } 

  document.getElementById("branco").onclick = function() {
    cor1=(document.getElementById("branco").value);
    alert("cor = "+cor1);
  }

  function selectDificuldade(){
    dificuldade1=(document.getElementById("Dificuldade").value); 
  }

  function escondeEsconde() {
      document.getElementById("coluna_configs").style.visibility = "hidden";
    }
  function mostraMostra() {
      document.getElementById("coluna_configs").style.visibility = "visible";
    }
  
  //ACCIONAR BOTÃO DE INICIAR
  document.getElementById("iniciar").onclick = function() {
      jogo = new Jogo(cor1);
      escondeEsconde();
    
  }  

  class Jogo { 

    soma_pecas(p, b, l) {
      p=0;
      b=0;
      l=0;

      for(let l = 0; l<8; l++) {
        for(let c=0; c<8; c++) {
          if(this.conteudo[l][c] == 'B')
            b ++;
          else if(this.conteudo[l][c] == 'P')
            p ++;
          else
            l ++;
        }
      }
      document.getElementById("n_brancas").innerText = b;
      document.getElementById("n_pretas").innerText = p;
      document.getElementById("n_livres").innerText = l;
      return b + p;
    }

    computador() {
      //var jogadas_legais = jogo.calcular_legais(vez, jogo.conteudo);
      this.play(0,0);
      this.MudarDeVez();
    }

    humano(l, c) {
      if(!this.vez_computador()) {
        if(this.jogadas_legais[l][c] == this.vez){ //verificação passa para jogada válida
          this.play(l, c);
          this.MudarDeVez();
        }
      } else {
        alert("Não é a tua vez!");
      }
    }

    play(l, c) {
      var peca1 = this.tabuleiro[l][c].firstChild;
        
      if(this.vez =='P') {
        peca1.className = "peca preto";
        this.conteudo[l][c] = 'P';
        console.log("Preto jogou!");
      } else {
        peca1.className = "peca branco";
        this.conteudo[l][c] = 'B';
        console.log("Branco jogou!");
      }

      this.flip(l,c);

      var peca2;
      for(let l=0; l<8; l++) {
        for(let c=0; c<8; c++) {
          peca2 = this.tabuleiro[l][c].firstChild;

          if(this.vez == 'P'){
            peca2.classList.remove("validas_branco");
            //console.log("remove válida branca: ("+l+","+c+")");
          }
          else if(this.vez == 'B')
            peca2.classList.remove("validas_preto");
            //console.log("remove válida preta: ("+l+","+c+")");
        }
      }
    }


    vez_computador() {
      if((this.cor=="Branco" && this.vez=='P') || (this.cor=="Preto" && this.vez=='B')) {
        return true;
      }
      return false;
    }

    oposto_vez(){
      let oposta = (this.vez=='B')? 'P' : 'B';
      return oposta;
    }

    terminar() {
      console.log("terminando");
      if(this.desistiu)
        this.vencedor = "computador";
      else {
        var p;
        var b; 
        var l;
        soma_pecas(p,b,l);

        if((p>b && cor == 'P') || (p<b && cor == 'B' ))
          this.vencedor = "humano";
        else if((p<b && cor == 'P') || (p>b && cor == 'B' ))
          this.vencedor = "computador";
        else
          this.vencedor = "empate";
      }
      alert("vencedor: "+ this.vencedor);
      location.reload();
    }

    MudarDeVez(){

      if(this.terminou() || this.desistiu) {
        oponente1="";
        cor1="Preto";
        dificuldade1="";
        mostraMostra();
        terminar();
        return;
      }

      if(this.vez == 'B'){
        this.vez='P';
        console.log("vez do preto");
      }
      else if(this.vez=='P'){
        this.vez='B';
        console.log("vez do branco");
      }    

      console.log("já no tabuleiro:");
      for(let l=0; l<8; l++) {
        for(let c=0; c<8; c++) {
          if(this.conteudo[l][c] == this.vez) {
            console.log("\t("+l+","+c+")");
          }
        }
      }


      this.jogadas_legais   = this.calcular_legais(this.vez);
      var n_jogadas_vez     = this.count_legais(this.jogadas_legais);
      var peca1;

      console.log("jogadas legais de vez: " + n_jogadas_vez);
      console.log(this.jogadas_legais); 
      

      for(let l=0; l<8; l++) {
        for(let c=0; c<8; c++) {
          peca1 = this.tabuleiro[l][c].firstChild;
          
          if(this.jogadas_legais[l][c] == this.vez) {
            if(this.vez=='B') {
              peca1.className += " validas_branco";
            }
            else if (this.vez=='P') {
              peca1.className += " validas_preto";
            }
            console.log("\t("+l+","+c+")");
          }
        }
      }  

      if(this.vez_computador()) {
        this.computador();
      }
    }

    desistir() {
      this.desistiu = true;
      alert("ganhou alguém");
      this.MudarDeVez();
    }

    terminou() {
      if(this.soma_pecas()==64) {
        alert("jogo acabou!");
        return true;
      }
      else
        return false;
    }
    
  /****************************************************************************/
    flip_celula(l,c) {

      this.conteudo[l][c] = this.vez;
          let peca = this.tabuleiro[l][c].firstChild;
          
          if(this.vez=='P')
            peca.className = "peca preto";
          else
            peca.className = "peca branco";
    }

    flip_linha(dl, dc, l, c) {     
      if((l+dl < 0) || (l+dl > 7)) {
        return false;
      }
      if((c+dc < 0) || (c+dc > 7)) {
        return false;
      }
      if(this.conteudo[l+dl][c+dc] == ' ') {
        return false;
      }
      if(this.conteudo[l+dl][c+dc] == this.vez) { 
        return true;
      }
      else {
        if(this.flip_linha(dl,dc,l+dl,c+dc)) {
          this.flip_celula(l+dl,c+dc);
          return true;
        }
        else {
          return false;
        }
      }
    }

    flip(l,c) {
      this.flip_linha(-1, -1, l, c);
      this.flip_linha(-1,  0, l, c);
      this.flip_linha(-1,  1, l, c);
            
      this.flip_linha(1, -1, l, c);
      this.flip_linha(1,  0, l, c);
      this.flip_linha(1,  1, l, c);
          
      this.flip_linha(0, -1, l, c);
      this.flip_linha(0,  1, l, c);
    }

    verifica_linha(v, dl, dc, l, c) {
      //verifica se há uma cor=vez algures na linha (l,c)+d(dl,dc)
      if(this.conteudo[l][c] == v)
        return true;
      if(this.conteudo[l][c] == ' ')
        return false;
      if((l+dl < 0) || (l+dl > 7)) {
        return false;
      }
      if((c+dc < 0) || (c+dc > 7)) { //celula adjacente direta está fora do tabuleiro
        return false;
      }

      return this.verifica_linha(v, dl, dc, l+dl, c+dc);
    }

    is_legal(v, dl, dc, l, c) {
      //verifica se a posição adjacente a l,c têm cor oposta a vez 
      //e se a reta (l,c)+d(dl,dc) termina em cor=vez
      
      //let oposta = this.oposto_vez();
      let oposta = (v=='B')? 'P' : 'B';
      
      if((l+dl < 0) || (l+dl > 7)) {
        return false;
      }
      if((c+dc < 0) || (c+dc > 7)) { //celula adjacente direta está fora do tabuleiro
        return false;
      }
      if(this.conteudo[l+dl][c+dc] != oposta) { //celula adjacente direta tem de ser da cor oposta
        return false;
      }
      if((l+dl+dl < 0) || (l+dl+dl > 7)) { //celulas proximas estão fora do tabuleiro
        return false;
      }
      if((c+dc+dc < 0) || (c+dc+dc > 7)) {
        return false;
      }
      return this.verifica_linha(v, dl, dc, l+dl+dl, c+dc+dc); //ver se a linha termina na nossa cor
    }

    calcular_legais(v) { //verificar se cada posição é legal
      var legais = new Array(8);

      for(let l = 0; l<8; l++) {
        legais[l] = new Array(8);
        
        for(let c=0; c<8; c++) {

          if(this.conteudo[l][c] == ' ') {
            legais[l][c] = ' ';

            let nw = this.is_legal(v, -1, -1, l, c);
            let nn = this.is_legal(v, -1,  0, l, c);
            let ne = this.is_legal(v, -1,  1, l, c);
            
            let sw = this.is_legal(v, 1, -1, l, c);
            let ss = this.is_legal(v, 1,  0, l, c);
            let se = this.is_legal(v, 1,  1, l, c);
            
            let ww = this.is_legal(v, 0, -1, l, c);
            let ee = this.is_legal(v, 0,  1, l, c);

            if(nw || nn || ne || sw || ss || se || ww || ee) {
              legais[l][c] = v; 
            }
          }
        }
      }
      return legais;
    }

    count_legais(legais) {
      let count=0;
      for(let l = 0; l<8; l++) {    
        for(let c=0; c<8; c++) {
          if(legais[l][c] != ' ') {
            count ++;
          }
        }
      }
      return count;
    }



    constructor(cor) {

      if (!Jogo.instancia) {
        this.vez = 'B';
        this.cor = cor;
        this.conteudo = new Array(8);
        this.jogadas_legais;
        this.tabuleiro = new Array(8);
        this.desistiu = false;
        this.vencedor = "";

        const base = document.getElementById("base");
        const tabul = document.createElement("div");
        const passar = document.createElement("button");
        const desistir = document.createElement("button");


        tabul.className = "tabuleiro";
        passar.innerText = "Passar jogada";
        desistir.innerText = "Desistir";
        desistir.id = "desistir";

        desistir.onclick = ((fun) => {
              return () => fun();
            })(this.desistir.bind(this));
         
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
              this.conteudo[l][c] = 'P'; 

            }
            else if((l==3 & c==4) || (l==4 & c==3)) {
              peca.className="peca branco";
              this.conteudo[l][c] = 'B'; 

            }
            else {
              peca.className="peca livre";
              this.conteudo[l][c] = ' '; 

            }
            celula.appendChild(peca);
            
            celula.onclick = ((fun, posl, posc) => {
              return () => fun(posl, posc);
            })(this.humano.bind(this), l, c);
           
         }
       }
       console.log(this.conteudo);
       console.log(this.tabuleiro);
        this.MudarDeVez();
        Jogo.instancia = this;
     }
    
    return Jogo.instancia;
   }
}
}