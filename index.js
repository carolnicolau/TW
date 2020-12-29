const http = require('http');
const fs = require('fs');
const url  = require('url');
const path = require('path');
const conf = require('./conf.js');

const server = http.createServer(function (request, response) {
  const parsedUrl = url.parse(request.url,true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  inicializarFichs();

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

    let data = fs.readFileSync('utilizadores.json');
    //fs.readFile('utilizadores.json', function(err,data) {
      //if(!err) {
        //let serialMap = JSON.parse(data.toString());
        //let mapa = new Map(JSON.parse(serialMap));

        let users = JSON.parse(data.toString());
        let arr = users.users;

        console.log("users: " + arr);

        //let mapa = new Map(users.users);

        let pass = null;
        let nick = null;

        for(let user of arr) {
          console.log("user of users: " + user);
          if(user.nick === query.nick) {
            console.log("Existe!");
            pass = user.pass;
            nick = user.nick;
          }
        }

        console.log("\nuser: " + nick + " pass: " + pass);

        //let pass = mapa.get(query.nick);

        if(pass == null) { //se não está definido, regista
          console.log("Registando utilizador.");
          //mapa.set(query.nick, query.pass);
          arr.push({nick : query.nick , pass: query.pass , victories : 0, games: 0});

          users.users = arr;
          let serialUsers = JSON.stringify(users);
          escrever(serialUsers, 'utilizadores.json');
          /*
          try {
            //let serialMap = JSON.stringify(Array.from(mapa.entries()));
            //let serialMap = JSON.stringify(mapa);

            users.users = arr;
            let serialUsers = JSON.stringify(users);

            console.log("Users atual: " + serialUsers);
            escrever(serialUsers, 'utilizadores.json');
        } catch(err) {  console.log("Erro escrita ficheiro."); }*/

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
      /*} else {
        console.log("Erro interno do servidor");
        response.writeHead(500);
        response.write(JSON.stringify({ error : "Erro interno do servidor." }));
        response.end();
      }
    });*/
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
             check(query, response);
      })
      .on('error', (err) => { console.log(err.message); });
}

function ranking(response) {
  fs.readFile('ranking.json',function(err,data) {
      if(! err) {
          dados = JSON.parse(data.toString());
          response.writeHead(200, {'Content-Type': 'application/json'});
          response.end(dados);
          console.log(dados);
      }
  });
}



function inicializarFichs() {
  let users = {users : []};
//let serialUsers = JSON.stringify(users);

  let ranking = {ranking : []};
  //let serialRanking = JSON.stringify(ranking);

  //let array = {users : []};
  //let serialArr = JSON.stringify(obj);

  escrever(users, 'utilizadores.json');
  escrever(users, 'ranking.json');
  /*
  try { escrever(users, 'utilizadores.json');}
  catch(err) { console.log("Erro na criação do ficheiro utilizadores.json"); }

  try { escrever(users, 'ranking.json');}
  catch(err) { console.log("Erro na criação do ficheiro ranking.json"); }
  */
}

function escrever(dados, fileName) {
  fs.writeFileSync(fileName, JSON.stringify(dados));
  /*fs.writeFile(fileName, JSON.stringify(dados),(err) => {
      if(err) throw err;
  });*/
}
