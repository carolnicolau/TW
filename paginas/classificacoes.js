function classificacoes() {
  if (typeof(Storage) !== 'undefined') {
    let keys = Object.keys(localStorage);
    let n = keys.length;
    let rank = new Array(n);

    for(let i=0; i<n; i++) {
      let data = localStorage.getItem(keys[i]);
      rank[i] = JSON.parse(data);
    }
    atualizar_classific(rank);
  }
}






function store(n_vitorias) {
  var jogo = Jogo.getInstancia();

  if (typeof(Storage) !== 'undefined') {
      let nick = jogo.user.nick;
      
      if( nick == "")
        nick = "não autenticado";

      //localStorage.clear();
      let data  = localStorage.getItem(nick);
      let parsed;
  
      if(!data) {
        parsed = { nick, victories : 0, games : 0 } ;
      } else {
        parsed = JSON.parse(data);
      }
      
      parsed.victories = parsed.victories + n_vitorias;
      parsed.games = parsed.games + 1;

      let string = JSON.stringify(parsed);
      localStorage.setItem(nick, string);
    }
}
