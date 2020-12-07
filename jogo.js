class Jogo {

  constructor(user) {
    if (!Jogo.instancia) {  
      //console.log("criando instancia");
      Jogo.instancia = this;
      var configs = Configs.getInstancia();

      //configs
      this.cor = configs.cor;
      //console.log("this.cor = " + this.cor);
      //console.log("configs.cor = " + configs.cor);

      this.oponente = configs.oponente;
      this.dificuldade = configs.dificuldade;
      this.game = configs.game;

      this.vez = 'P';
      this.user = user;

      this.conteudo = new Array(8);
      this.tabuleiro = new Array(8);
      this.jogadas_legais;
      this.desistiu = false;
      this.pode_passar = false;
      this.vencedor = "";
      this.contagem = {dark:"2", light:"2", empty:"60"};

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

          const peca =document.createElement("CANVAS");
          peca.width = 96;
          peca.height = 98;

          this.conteudo[l][c] = ' '; 
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
      //console.log("jogo já criado");
      return Jogo.instancia;
    }
  }

  static getInstancia() {
    return Jogo.instancia;
  }

  static elimina() {
    //console.log("apagando instancia");
    Jogo.instancia = null;
  }
}