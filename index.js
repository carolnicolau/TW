const http = require('http');
const fs = require('fs');
const url  = require('url');

fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err;
    }
const server = http.createServer(function (request, response) {
  const parsedUrl = url.parse(request.url,true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  inicializarFichs();

  switch(request.method) {
    case 'GET':
      path(pathname, query, request, response);
      break;
    case 'POST':
      path(pathname, query, request, response);
      break;
    default:
      response.writeHead(500);
      response.end();
    }
});

server.listen(8155);
});

function path(pathname, query, request, response) {
  switch(pathname) {
      case '/ranking':
        console.log('ranking');
        ranking(response);
        break;
      case '/register':
        console.log('register');
        register(request, response);
        break;
      default:
    }
}

function check(query, response) {
  console.log("olá");

  console.log("nick: " + query.nick);
  console.log("pass: " + query.pass);
  console.log("type of nick: " + typeof(query.nick));
  console.log("type of pass: " + typeof(query.pass));

  if(query == undefined || query == null) {
    console.log("User e password não definidos");
    response.writeHead(400);
    response.write(JSON.stringify({ error : "User e password não definidos" }));
    response.end();
  } else if(query.nick == undefined || query.nick == null) {
    console.log("User não definido");
    response.writeHead(400);
    response.write(JSON.stringify({ error : "User não definido" }));
    response.end();
  } else if(query.pass == undefined || query.pass == null) {
    console.log("Password não definida");
    response.writeHead(400);
    response.write(JSON.stringify({ error : "Password não definida" }));
    response.end();
  } else if(typeof(query.nick) == "string" && typeof(query.pass) == "string") {
    console.log("Entrou");

    fs.readFile('utilizadores.json', function(err,data) {
      if(!err) {
        //let mapa = new ObjectMapper().readValue(data.toString(), HashMap.class);
        let serialMap = JSON.parse(data.toString());
        //let mapa = new Map(Object.entries(obj));


        let mapa = new Map(JSON.parse(serialMap));

        console.log(mapa);
        console.log(serialMap);



        let pass = mapa.get(query.nick);

        if(pass == undefined) { //se não está definido, regista
          console.log("Registando utilizador.");
          mapa.set(query.nick, query.pass);

          try {
            let serialMap = JSON.stringify(Array.from(mapa.entries()));
            console.log(serialMap);
            escrever(serialMap, 'utilizadores.json');
        } catch(err) {  console.log("Erro escrita ficheiro."); }

          response.writeHead(200);
          let msg = JSON.stringify({});
          response.write(msg);
          response.end();
          console.log("aqui");
        }
        else if(query.pass === pass) { //se está definido e com a pass correta dá 200
          console.log("OK");
          response.writeHead(200);
          response.write(JSON.stringify({}));
          response.end();
        }
        else {
          console.log("Password errada.");
          response.writeHead(401);
          response.write(JSON.stringify({ error : "Password errada." }));
          response.end();
        }
      } else {
        console.log("Erro interno do servidor");
        response.writeHead(500);
        response.write(JSON.stringify({ error : "Erro interno do servidor." }));
        response.end();
      }
    });
  }
}

function register(request, response) {
  let body = '';

  request
      .on('data', (chunk) => { body += chunk;  })
      .on('end', () => {
             try {
               query = JSON.parse(body);  /* processar query */
             } catch(err) {  console.log("Erro json"); }
             console.log("O pedido: " + body);
             console.log(query);
             check(query, response);
      })
      .on('error', (err) => { console.log(err.message); });
}

function ranking(response) {
  fs.readFile('ranking.json',function(err,data) {
      if(! err) {
          //dados = JSON.parse(data.toString());
          response.writeHead(200, {'Content-Type': 'application/json'});
          response.end(data);
      }
  });
}

function inicializarFichs() {
  let mapa = new Map();
  let serialMap = JSON.stringify(Array.from(mapa.entries()));
  console.log(serialMap);

  try { escrever(serialMap, 'utilizadores.json');}
  catch(err) { console.log("Erro na criação do ficheiro " + fileName ); }

  try { escrever({}, 'ranking.json');}
  catch(err) { console.log("Erro na criação do ficheiro " + fileName ); }
}

function escrever(dados, fileName) {
  fs.writeFile(fileName, JSON.stringify(dados),(err) => {
      if(err) throw err;
  });
}
