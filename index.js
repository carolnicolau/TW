const http = require('http');
const fs = require('fs');
const url  = require('url');

const server = http.createServer(function (request, response) {
  const parsedUrl = url.parse(request.url,true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  const dados = {frase: 'olá'};
  escrever(dados);

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

function register(request, response) {
  let body = '';

  request
      .on('data', (chunk) => { body += chunk;  })
      .on('end', () => {
             try { query = JSON.parse(body);  /* processar query */
                  console.log(query); }
             catch(err) {  /* erros de JSON */ }
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

function escrever(dados) {
  fs.writeFile('ranking.json',JSON.stringify(dados),(err) => {
      if(err) throw err;
  });
}
