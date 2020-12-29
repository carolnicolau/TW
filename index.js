const http = require('http');
const fs = require('fs');
const url  = require('url');
const path = require('path');
const crypto = require('crypto');
const conf = require('./conf.js');

const server = http.createServer(function (request, response) {
  const parsedUrl = url.parse(request.url,true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  //inicializarFichs();

  switch(request.method) {
    case 'GET':
      doGetRequest(pathname, query, request, response);
      break;
    case 'POST':
      doPostRequest(pathname, query, request, response);
      break;
    default:
      response.writeHead(501);
      response.end();
    }
});

server.listen(conf.port);

function doGetRequest(pathn, query, request, response) {
  const pathname = getPathname(request);
  console.log("GET request: " + pathn);
  console.log("Pathname: " + pathname);

    if(pathname === null) {
        response.writeHead(403); // Forbidden
        response.end();
        console.log("Forbidden");
    } else
        fs.stat(pathname,(err,stats) => {
            if(err) {
                response.writeHead(500); // Internal Server Error
                response.end();
                console.log("Internal Server Error");

            } else if(stats.isDirectory()) {
                if(pathname.endsWith('/')) {
                  console.log("do GET pathname: " + pathname+conf.defaultIndex);
                   doGetPathname(pathname+conf.defaultIndex,response);
                } else {
                  console.log("Moved Permanently");

                   response.writeHead(301, // Moved Permanently
                                      {'Location': pathname+'/' });
                   response.end();
                }
            } else
                doGetPathname(pathname,response);
       });
}

function getPathname(request) {
    const purl = url.parse(request.url);
    let pathname = path.normalize(conf.documentRoot+purl.pathname);

    if(! pathname.startsWith(conf.documentRoot))
       pathname = null;

    return pathname;
}

function doGetPathname(pathname,response) {
    const mediaType = getMediaType(pathname);
    const encoding = isText(mediaType) ? "utf8" : null;

    fs.readFile(pathname,encoding,(err,data) => {
    if(err) {
        response.writeHead(404); // Not Found
        response.end();
    } else {
        response.writeHead(200, { 'Content-Type': mediaType });
        response.end(data);
    }
  });
}

function getMediaType(pathname) {
    const pos = pathname.lastIndexOf('.');
    let mediaType;

    if(pos !== -1)
       mediaType = conf.mediaTypes[pathname.substring(pos+1)];

    if(mediaType === undefined)
       mediaType = 'text/plain';
    return mediaType;
}

function isText(mediaType) {
    if(mediaType.startsWith('image'))
      return false;
    else
      return true;
}

function doPostRequest(pathname, query, request, response) {
  let body = '';

  request
      .on('data', (chunk) => { body += chunk;  })
      .on('end', () => {
             try {
               query = JSON.parse(body);  /* processar query */
             } catch(err) {  console.log("Erro json"); }
             //console.log("O pedido: " + body);

             switch(pathname) {
                 case '/ranking':
                   console.log('ranking');
                   ranking(response);
                   break;
                 case '/register':
                   console.log('register');
                   register(query, response);
                   break;
                 case '/join':
                   console.log('join');
                   join(query, response);
                   break;
                 default:
               }
      })
      .on('error', (err) => { console.log(err.message); });
}

function register(query, response) {
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

    fs.readFile('dados/utilizadores.json', function(err,data) {
      if(!err) {

        let users;
        try {users = JSON.parse(data);}
        catch(err) {console.log("ERRO!");}

        console.log("users:")
        console.log(users);

        let pass = null;
        let nick = null;

        for(let user of users) {
          console.log("user of users: " + user);
          if(user.nick === query.nick) {
            console.log("Existe!");
            pass = user.pass;
            nick = user.nick;
          }
        }
        console.log("\nuser: " + nick + " pass: " + pass);


        if(pass == null) { //se não está definido, regista
          console.log("Registando utilizador.");

          users.push({nick : query.nick , pass: query.pass , victories : 0, games: 0});

          escrever(users, 'dados/utilizadores.json');

          response.writeHead(200);
          let msg = JSON.stringify({});
          response.write(msg);
          response.end();
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

function ranking(response) {
  fs.readFile('dados/ranking.json',function(err,data) {
      if(! err) {
          dados = data.toString();
          response.writeHead(200, {'Content-Type': 'application/json'});
          console.log(dados);

          response.end(dados);
      }
  });
}

function join(query, response) {
  //group, nick, pass
  let value = Number(new Date).toString(36);
  const hash = crypto
               .createHash('md5')
               .update(value)
               .digest('hex');
  console.log("value: " + value);
  console.log("game: " + value);

  //game, nick1, nick2
}



function inicializarFichs() {
  let users = [];
  let ranking = {ranking : []};

  try { escrever(users, 'dados/utilizadores.json');}
  catch(err) { console.log("Erro na criação do ficheiro utilizadores.json"); }

  try { escrever(ranking, 'dados/ranking.json');}
  catch(err) { console.log("Erro na criação do ficheiro ranking.json"); }
}

function escrever(dados, fileName) {
  let serialDados;
  try {serialDados = JSON.stringify(dados);}
  catch(err) {console.log("ERRO escrita!");}

  console.log("dados: " + dados);
  console.log("dados serializ: " + serialDados);

  fs.writeFile(fileName, serialDados,(err) => {
      if(err) throw err;
  });
}
