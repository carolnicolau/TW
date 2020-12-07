function animar_validas(peca, cor) {
  let raio = (peca.width)/2;
  let velocity = 3;

  peca.width = peca.width;

  let ctx = peca.getContext("2d");
  
  ctx.beginPath();
  ctx.lineWidth = 2;   
  //context.arc(x,y,r,sAngle,eAngle,counterclockwise);  
  ctx.arc(raio, raio, raio, 0, 2*Math.PI, false);
  ctx.strokeStyle = cor;
  ctx.stroke();
}

function animar1(canvas, cor) {
var c=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;

var x=cw/2;
var y=ch/2;
var velocidade=2;
var raio=4;

animar1_aux(c, x, y, cw, ch, velocidade, raio, cor);
}

  
function animar1_aux(c, x, y, cw, ch, velocidade, raio, cor) {

  c.clearRect(0,0,cw,ch);
  c.beginPath();    
  c.arc(x,y,raio,0,Math.PI*2,false);
  c.strokeStyle=cor;
  c.stroke(); 
  c.fillStyle=cor;
  c.fill();

  //if(x+raio>cw || raio<0) {
    //velocidade=-velocidade;
  if(x+raio>=cw) {
    return;  
  }  
  
  raio+=velocidade;

  requestAnimationFrame(()=>(animar1_aux(c, x, y, cw, ch, velocidade, raio, cor)));
}

function animar2(peca, cor, outra) {
  //console.log("animando");


  let raio = (peca.width)/2;
  let alpha = raio;
  let velocity = 3;

  let ctx = peca.getContext("2d");

  animar2_aux(peca, raio, alpha, velocity, cor, outra);
}

function animar2_aux(peca, r, alpha, velocity, cor, outra) {

  peca.width = peca.width;

  let ctx = peca.getContext("2d");
  
  ctx.beginPath()
  ctx.ellipse(r, r, alpha, r, 0, 0, Math.PI * 2, false);
  ctx.fillStyle = cor;
  ctx.fill();
 
  alpha -= velocity;
    
  if(alpha < velocity) {
    velocity = -velocity;
    cor = outra;
  }
  
  if(alpha > r) {
    return;
  }
  
  requestAnimationFrame(()=>(animar2_aux(peca, r, alpha, velocity, cor, outra)));
}

/*
async function animar2(peca, cor, outra) {
  //console.log(.log("animando");


  let r = (peca.width)/2;
  let alpha = r;
  let velocity = 3;

  let ctx = peca.getContext("2d");


  return new Promise( async (resolve, reject) => {
    let string = await animar2_aux(peca, r, alpha, velocity, cor, outra);
    console.log("1 terminou");
    resolve(string);
  })
  
}

async function animar2_aux(peca, r, alpha, velocity, cor, outra) {
  return new Promise((resolve, reject) => {
    peca.width = peca.width;
    let ctx = peca.getContext("2d");
    
    ctx.beginPath()
    ctx.ellipse(r, r, alpha, r, 0, 0, Math.PI * 2, false);
    ctx.fillStyle = cor;
    ctx.fill();
   
    alpha -= velocity;
      
    if(alpha < velocity) {
      velocity = -velocity;
      cor = outra;
    }
    
    if(alpha > r) {
      console.log("2 terminou");
      resolve("terminei!");
    }
    

    return new Promise( async (resolve, reject) => {
      let string = await animar2_aux(peca, r, alpha, velocity, cor, outra);
      resolve(string);

    })
  })
}
*/
