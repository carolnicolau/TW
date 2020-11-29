/*
  registar.onclick usar requires
*/
var server = "http://twserver.alunos.dcc.fc.up.pt";
var port = ":8008/";

function error() {
	document.getElementById("mensagemdavez").innerText=("Erro na autenticação.");
}

function func(r) {
	const obj = JSON.parse(r);
	console.log(obj.value);
}

function register(nick, pass) {
	var object = {nick, pass};
	var JSONData = JSON.stringify(object);

    fetch(server + port +"register" , {
    method: 'POST',
    body: JSONData
    })
    .then(function(response) {
       if(response.ok) {
          response.text().then(console.log);
       } else {
          response.json().then((response) => func(response));
       }
    })
	.catch(error);   
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