"use strict";

const http = require('http');
const url  = require('url');
const get = require('./get.js');
const post = require('./post.js');
const conf = require('./conf.js');
const c = require('./comunication.js');

//c.inicializarFichs();

let jogos = new Array();

const server = http.createServer(function (request, response) {
  const parsedUrl = url.parse(request.url,true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log("pedido: " + pathname);
  console.log(query);

  switch(request.method) {
    case 'GET':
      get.doGetRequest(pathname, query, request, response, jogos);
      break;
    case 'POST':
      post.doPostRequest(pathname, query, request, response, jogos);
      break;
    default:
      response.writeHead(501);
      response.end();
    }
});

server.listen(conf.port);
