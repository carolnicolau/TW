class Utilizador {
  	
  	constructor(nick, pass) {//????????????
		Utilizador.instancia = this;
		this.nick = nick;
		this.pass = pass;
		this.n_vitorias=0;
  		this.n_derrotas=0;
	}

	static getInstancia() {
      	return Utilizador.instancia;
    }
}

class Configs {
  	
  	constructor() {
  		if (!Configs.instancia) { 
	  		Configs.instancia = this;
			this.cor = "Preto";
			this.oponente = "Computador";
			this.dificuldade = 1;
			this.game = "";
		}
	}

	static getInstancia() {
      return Configs.instancia;
    }

    static reset() {
		Configs.instancia.cor = "Preto";
		Configs.instancia.oponente = "Computador";
		Configs.instancia.dificuldade = 1;
		Configs.instancia.game = "";
    }
}
