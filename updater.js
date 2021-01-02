let responses = [];

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    sse: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};


module.exports.remember = function(response) {
    responses.push(response);
}

module.exports.forget = function(response) {
    let pos = responses.findIndex((resp) => resp === response);
    if(pos > -1)
      responses.splice(pos,1);
}

module.exports.update = function(message) {
    //console.log('data:');
    //console.log(message );

    for(let response of responses) {
        let msg = JSON.stringify(message);

        response.writeHead(200, headers.sse);
        response.write('data: '+ msg+'\n\n');
    }
}
