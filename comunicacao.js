/*
  registar.onclick usar requires
*/
var server = "http://twserver.alunos.dcc.fc.up.pt:8008/";
var group = 55;
var game;
var eventSource;

function error(msg) {
	document.getElementById("mensagemdavez").innerText=(msg);
}


function func(r) {
	console.log(r.error);
}

function register(nick, pass) {
  console.log("register");
	var object = {nick, pass};
	var JSONData = JSON.stringify(object);

    fetch(server +"register" , {
    method: 'POST',
    body: JSONData
    })
    .then(function(response) {
       if(response.ok) { //200
          response.text().then(console.log);
       } else {
          response.json().then((response) => func(response));
          error("Erro na autenticação.");
       }
    })
	.catch(()=>error("Erro na autenticação.")); 
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
    console.log("ranking");

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
  				console.log(rank);
  				atualizar_classific(rank);
       		} else {
       			error("Erro na classificação.");
       			console.log(data.error); //?
       		}
  		});
    })
    .catch(()=>error("Erro na classificação."));
}

function join(user) {
  console.log("join");
  const nick = user.nick;
  const pass = user.pass;

	var object = {group, nick, pass};
  console.log(object);
	var JSONData = JSON.stringify(object); 


	fetch(server + "join" , {
	    method: 'POST',
	    body: JSONData
    })
    
  	.then( function(response) {
  		response.json().then( function(data) {
  			if(response.ok) { //200

          if(data.color == 'light') {
            Configs.getInstancia().cor = "Branco";
            document.getElementById("mensagemdavez").innerText=("Ficaste com as peças brancas.");
          } else {
            Configs.getInstancia().cor = "Preto";
            document.getElementById("mensagemdavez").innerText=("Ficaste com as peças pretas.");
          }
  				game = data.game;

  				console.log(data);
          console.log("cor = " + Configs.getInstancia().cor);
          
          new Jogo(user);
          update(nick, data.color);

       		} else {
       			error("Erro no emparelhamento.");
       			console.log(data.error); //?
       		}
  		});
    })
    .catch(()=>error("Erro no emparelhamento."));
}

function leave(nick, pass, id) {
      console.log("leave");

	var object = {nick, pass, game};
        console.log(object);

	var JSONData = JSON.stringify(object); 


	fetch(server + "leave" , {
	    method: 'POST',
	    body: JSONData
    })
    
  	.then( function(response) {
  		response.json().then( function(data) {
  			if(response.ok) { //200
  				console.log(data);
          eventSource.close()
       	} else {
       		error("Erro na saída.");
       		console.log(data.error); //?
       	}
  		});
    })
    .catch(()=>error("Erro na saída."));
}

function notify(nick, pass, move) {
  console.log("notify");

	var object = {nick, pass, game, move};
	var JSONData = JSON.stringify(object); 

  console.log(JSONData);

	fetch(server + "notify" , {
	    method: 'POST',
	    body: JSONData
    })
    
  	.then( function(response) {
  		response.json().then( function(data) {
  			if(response.ok) { //200
  				console.log(data); 

       		} else {
       			error("Erro na notificação.");
       			console.log(data.error); //?
       		}
  		});
    })
    .catch(()=>error("Erro na notificação."));
}


function update(nick, cor) {
  console.log("update");
  console.log("id: " + game);

  /*
  var object = server + "update?nick=" + nick + "&game=" + game;
  let encoded = encodeURIComponent(object);
  eventSource = new EventSource(encoded, { withCredentials: true }); //??? with credentials
  */
  eventSource = new EventSource(server + "update?nick=" + nick + "&game=" + game);
  
  eventSource.onmessage = function(event) {
    
      const data = JSON.parse(event.data);
      console.log(data); //?

      if(!data.winner) {

        for(let i=0; i<8; i++) {
          for(let j=0; j<8; j++) {
            if(data.board[i][j] == "empty")
              Jogo.getInstancia().conteudo[i][j] = ' ';
            else if(data.board[i][j] == "dark")
              Jogo.getInstancia().conteudo[i][j] = 'P';
            else if(data.board[i][j] == "light")
              Jogo.getInstancia().conteudo[i][j] = 'B';
          }
        }
        atualizar_tabuleiro();

        Jogo.getInstancia().vez = data.turn; 
        document.getElementById("mensagemdavez").innerText=("É a vez de " + data.turn);

        Jogo.getInstancia().contagem.light = data.count.light;
        Jogo.getInstancia().contagem.dark = data.count.dark;
        Jogo.getInstancia().contagem.empty = data.count.empty;
        atualiza_contagem();

        Jogo.getInstancia().pode_passar = data.skip;
      }
      else {
        Jogo.vencedor = data.winner;
        terminar();
      }

  }

  eventSource.onerror = function(event) {
    error("Erro no update.");
    console.log(event.error); 
  }
}
