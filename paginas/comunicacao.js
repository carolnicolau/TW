/*
  registar.onclick usar requires
*/
var server = "http://twserver.alunos.dcc.fc.up.pt:8155/";
//var server = "http://localhost:8155/";
var group = 55;
var game;
var eventSource;

function register(nick, pass) {
  //console.log("register");
	var object = {nick, pass};
	var JSONData = JSON.stringify(object);

    fetch(server +"register" , {
    method: 'POST',
    body: JSONData
    })
    .then(function(response) {
       if(response.ok) { //200
          mensagem("Entrou!");
          response.text().then(console.log);
       } else {
          response.json().then((response) => mensagem(response.error));
       }
    })
	.catch(()=>mensagem("Erro na autenticação."));
}

function atualizar_classific(ranking) {
  const tabela = document.getElementById("classifacoes");

  const h_linha = document.createElement("tr");
	const h_jogador = document.createElement("th");
	const h_vitorias = document.createElement("th");
	const h_jogos = document.createElement("th");
	const h_jog = document.createTextNode("Jogador");
	const h_vit = document.createTextNode("Vitórias");
	const h_jogo = document.createTextNode("Jogos");

  tabela.appendChild(h_linha);
  h_linha.appendChild(h_jogador);
  h_linha.appendChild(h_vitorias);
  h_linha.appendChild(h_jogos);
  h_jogador.appendChild(h_jog);
  h_vitorias.appendChild(h_vit);
  h_jogos.appendChild(h_jogo);

  for(let i=0; i<ranking.length; i++) {
    const linha = document.createElement("tr");
    const jogador = document.createElement("td");
    const vitorias = document.createElement("td");
    const jogos = document.createElement("td");
    const jog = document.createTextNode(ranking[i].nick);
    const vit = document.createTextNode(ranking[i].victories);
    const jogo = document.createTextNode(ranking[i].games);

    tabela.appendChild(linha);
    linha.appendChild(jogador);
    linha.appendChild(vitorias);
    linha.appendChild(jogos);
    jogador.appendChild(jog);
    vitorias.appendChild(vit);
    jogos.appendChild(jogo);
	}
}

function ranking() {
    //console.log("ranking");

	var object = {};
	var JSONData = JSON.stringify(object);


	fetch(server + "ranking" , {
    method: 'POST',
    body: JSONData
    })

  	.then( function(response) {
  		response.json().then( function(data) {
  			if(response.ok) { //200
  				let rank = data.ranking;
  				//console.log(rank);
  				atualizar_classific(rank);
       		} else {
            mensagem(data.error);
       		}
  		});
    })
    .catch(()=>mensagem("Erro na classificação."));
}

function join(nick, pass) {
  ////console.log("join");

	var object = {group, nick, pass};
  //console.log(object);
	var JSONData = JSON.stringify(object);


	fetch(server + "join" , {
	    method: 'POST',
	    body: JSONData
    })

  	.then( function(response) {
  		response.json().then( function(data) {
  			if(response.ok) { //200
          let configs = Configs.getInstancia();

          if(data.color == 'light') {
            configs.cor = "Branco";
            mensagem("Ficaste com as peças brancas.\nÀ espera de um jogador.");
            mensagem("");
          } else if(data.color == 'dark') {
            configs.cor = "Preto";
            mensagem("Ficaste com as peças pretas.\nÀ espera de um jogador.");
          } else {
            configs.cor = "Preto";
            mensagem("À espera de um jogador.");
          }
  				game = data.game;

					console.log(game);
  				//console.log(data);
          //console.log("cor = " + Configs.getInstancia().cor);

          update(nick, data.color);

       		} else {
       			mensagem(data.error);
       		}
  		});
    })
    .catch(()=>mensagem("Erro no emparelhamento."));
}

function leave(nick, pass, id) {
      //console.log("leave");

	var object = {nick, pass, game};
        //console.log(object);

	var JSONData = JSON.stringify(object);


	fetch(server + "leave" , {
	    method: 'POST',
	    body: JSONData
    })

  	.then( function(response) {
  		response.json().then( function(data) {
  			if(response.ok) { //200
  				//console.log(data);
          //eventSource.close();
       	} else {
       		mensagem(data.error);

          if(data.error == "Referência de jogo inválida.")  {
            //console.log("NÃO É VÁLIDO");
            //console.log(Jogo.getInstancia());
            if(eventSource)
              eventSource.close();
            terminar();
            //console.log(Jogo.getInstancia());
          }
       	}
  		});
    })
    .catch( function() {
      mensagem("Erro na saída.");
    })
}

function notify(nick, pass, move) {
  //console.log("notify");

	var object = {nick, pass, game, move};
	var JSONData = JSON.stringify(object);

  //console.log(JSONData);

	fetch(server + "notify" , {
	    method: 'POST',
	    body: JSONData
    })

  	.then( function(response) {
  		response.json().then( function(data) {
  			if(response.ok) { //200
  				//console.log(data);

       		} else {
       			mensagem(data.error); //?
       		}
  		});
    })
    .catch(()=>mensagem("Erro na notificação."));
}


function update(nick, cor) {
  //console.log("UPDATE");
  //console.log("id: " + game);
  var jogo = Jogo.getInstancia();

  var object = "update?nick=" + nick + "&game=" + game;
  let encoded = encodeURI(object);
  eventSource = new EventSource(server + encoded);

  //eventSource = new EventSource(server + "update?nick=" + nick + "&game=" + game);

  eventSource.onmessage = function(event) {

      const data = JSON.parse(event.data);

      console.log("on message: ");
      console.log(data);

      if(data.winner !== undefined) {
        jogo.vencedor = data.winner;
				console.log("vencedor: " + data.winner);
        terminar();
				eventSource.close();
      }
      else {
        for(let i=0; i<8; i++) {
          for(let j=0; j<8; j++) {

            if(data.board[i][j] == "empty") {
              jogo.conteudo[i][j] = ' ';
            }

            else if(data.board[i][j] == "dark") {
              let peca = jogo.tabuleiro[i][j].firstChild;

              if(jogo.conteudo[i][j] == ' ')
                animar1(peca, "black");
              else if(jogo.conteudo[i][j] == 'B')
                animar2(peca, "FloralWhite", "black");

              jogo.conteudo[i][j] = 'P';
            }

            else if(data.board[i][j] == "light") {
              let peca = jogo.tabuleiro[i][j].firstChild;

              if(jogo.conteudo[i][j] == ' ')
                animar1(peca, "FloralWhite");
              else if(jogo.conteudo[i][j] == 'P')
                animar2(peca, "black", "FloralWhite");

              jogo.conteudo[i][j] = 'B';
            }
          }
        }
        //atualizar_tabuleiro();

        jogo.vez = data.turn;
        mensagem("É a vez de " + data.turn);

        jogo.contagem.light = data.count.light;
        jogo.contagem.dark = data.count.dark;
        jogo.contagem.empty = data.count.empty;
        atualiza_contagem();

        jogo.pode_passar = data.skip;
        jogo.entrou = true;
      }
  }

  eventSource.onerror = function(event) {
    //mensagem("Erro no update.");
		console.error("EventSource failed");
  }
}
