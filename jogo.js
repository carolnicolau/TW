class Jogo {

  constructor(configs, user) {
    if (!Jogo.instancia) {  
      Jogo.instancia = this;

      //configs
      this.cor = configs.cor;
      this.oponente = configs.oponente;
      this.dificuldade = configs.dificuldade;
      this.game = configs.game;

      this.vez = 'B';
      this.user = user;

      this.conteudo = new Array(8);
      this.tabuleiro = new Array(8);
      this.jogadas_legais;
      this.desistiu = false;
      this.pode_passar = false;
      this.vencedor;
      this.contagem;

      const base = document.getElementById("base");
      const tabul = document.createElement("div");
      const passar = document.createElement("button");
      const desist = document.createElement("button");

      tabul.className = "tabuleiro";
      passar.innerText = "Passar jogada";
      desist.innerText = "Desistir";
      desist.id = "desistir";
      passar.id = "passar";
        
      desist.onclick = function() {
        desistir();
      };

      passar.onclick = function() {
        passa();
      };

      base.appendChild(tabul);
      base.appendChild(passar);
      base.appendChild(desist);


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
          })(humano.bind(this), l, c);

        }
      }
      document.getElementById("n_pretas").innerText=("2");
      document.getElementById("n_brancas").innerText=("2");
      document.getElementById("n_livres").innerText=("60");      
    } else {
      alert("jogo já criado");
      return Jogo.instancia;
    }
  }

  static getInstancia() {
    return Jogo.instancia;
  }

  static elimina() {
    Jogo.instancia = null;
  }
}