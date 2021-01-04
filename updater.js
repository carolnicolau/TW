"use strict";

const sse = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive',

        'Transfer-Encoding': 'chunked'
};


module.exports.remember = function(response, jogo) {
    jogo.responses.push(response);
}

module.exports.forget = function(response, jogo) {
    let pos = jogo.responses.findIndex((resp) => resp === response);
    if(pos > -1) {
      jogo.responses.splice(pos,1);
    }
    /* aqui deviamos esquecer também o jogo, mas por causa do erro no update o cliente nem sempre vê a resposta à primeira e manda o evento 'on close' a cada erro
    let pos = jogos.findIndex((j) => j === jogo);
    if(pos > -1) {
      jogos.splice(pos,1);
    }
    */
}

module.exports.update = function(jogo) {
    let mensagem = {game : jogo.game ,
                    player1 : jogo.player1 ,
                    player2 : jogo.player2,
                    turn: jogo.turn,
                    board: jogo.board,
                    count: jogo.count,
                    skip: jogo.skip,
                    winner: jogo.winner
                    }
    let msg = JSON.stringify(mensagem);

    for(let response of jogo.responses) {

        response.writeHead(200, sse);
        response.write('data: '+ msg + '\n\n');
    }
}
