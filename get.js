"use strict";

const http = require('http');
const fs = require('fs');
const url  = require('url');
const path = require('path');
const crypto = require('crypto');
const conf = require('./conf.js');
const game = require('./game.js');
const updater = require('./updater.js');
const check = require('./check.js');
const c = require('./comunication.js');


//VERIFICAÇÕES
function get(query, jogos) {
    let found = false, i=0, jogo;


    for(jogo of jogos) {
      console.log(jogo.game);
      if(jogo.game === query.game) {
        found = true;
        break;
      }
      i++;
    }
    if(found) {
      return jogo;
    } else {
      console.log("ERRO: JOGO NULL");
      return null;
    }
}

exports.doGetRequest = function(pathn, query, request, response, jogos) {
  if(pathn === '/update') {
    let jogo = get(query, jogos);

      //verificar jogador

    if(jogo) {
      updater.remember(response, jogo);
      request.on('close', () => updater.forget(response, jogo));
      setImmediate(() => updater.update(jogo));
    }

  } else {
  const pathname = getPathname(request);
  console.log("GET request: " + pathn);
  console.log("Pathname: " + pathname);

    if(pathname === null) {
        response.writeHead(403); // Forbidden
        response.end();
        console.log("Forbidden");
    } else {
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
  }
}

function getPathname(request) {
    const purl = url.parse(request.url);
    let pathname;
    if(purl.pathname === '/') {
      pathname = path.normalize(conf.documentRoot + purl.pathname);
    } else {
      pathname = path.normalize(conf.documentRoot + 'paginas/' + purl.pathname);
    }
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
