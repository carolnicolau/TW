/*
  registar.onclick usar requires
*/
var server = "http://twserver.alunos.dcc.fc.up.pt:8008/";

function error(msg) {
	document.getElementById("mensagemdavez").innerText=(msg);
}


function func(r) {
	console.log(r.error);
}

function register(nick, pass) {
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

function join(nick, pass) {
	var group = 55;
	var object = {group, nick, pass};
	var JSONData = JSON.stringify(object); 


	fetch(server + "join" , {
	    method: 'POST',
	    body: JSONData
    })
    
  	.then( function(response) {
  		response.json().then( function(data) {
  			if(response.ok) { //200
  				let id = data.game;
  				let cor = data.color;
  				console.log(response);
  				console.log(id);
  				console.log(cor);

  				return id;

       		} else {
       			error("Erro no emparelhamento.");
       			console.log(data.error); //?
       		}
  		});
    })
    .catch(()=>error("Erro no emparelhamento."));
}

function leave(nick, pass) {
	var group = 55;
	var object = {group, nick, pass};
	var JSONData = JSON.stringify(object); 


	fetch(server + "join" , {
	    method: 'POST',
	    body: JSONData
    })
    
  	.then( function(response) {
  		response.json().then( function(data) {
  			if(response.ok) { //200
  				console.log(response);

       		} else {
       			error("Erro na saída.");
       			console.log(data.error); //?
       		}
  		});
    })
    .catch(()=>error("Erro na saída."));
}

function notify(nick, pass, game, move) {
	var group = 55;
	//var move = {row, column};
	var object = {group, nick, pass, move};
	var JSONData = JSON.stringify(object); 


	fetch(server + "notify" , {
	    method: 'POST',
	    body: JSONData
    })
    
  	.then( function(response) {
  		response.json().then( function(data) {
  			if(response.ok) { //200
  				console.log(response);

       		} else {
       			error("Erro na notificação.");
       			console.log(data.error); //?
       		}
  		});
    })
    .catch(()=>error("Erro na notificação."));
}

/*
function status(response) {
    if(response.ok)
        return Promise.resolve(response);
    else
        return Promise.reject(new Error('Invalid status'));
}

fetch(url)
     .then(status)
     .then(response => response.json())
     .then(json => document.getElementById("mensagemdavez").innerText = JSON(json.result));
     .catch(console.log)
     */