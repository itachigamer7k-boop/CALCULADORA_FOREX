const canvas = document.getElementById("grafico")
const ctx = canvas.getContext("2d")

function ajustarCanvas(){

if(window.innerWidth < 768){

canvas.width = window.innerWidth
canvas.height = 500

}else{

canvas.width = window.innerWidth - 260
canvas.height = window.innerHeight

}

}

ajustarCanvas()

window.addEventListener("resize", ajustarCanvas)

let linhas=[]
let dragging=null

canvas.addEventListener("mousedown",e=>{

let y=e.offsetY

for(let l of linhas){

if(Math.abs(y-l.y)<6 && l.drag){

dragging=l

}

}

})

canvas.addEventListener("mouseup",()=>dragging=null)

canvas.addEventListener("mousemove",e=>{

if(!dragging) return

let min=dragging.min
let max=dragging.max

let preco=max-((e.offsetY/canvas.height)*(max-min))

dragging.preco=preco

recalcular()

})

function calcular(){

let par=document.getElementById("par").value
let tipo=document.getElementById("tipo").value
let entrada=parseFloat(document.getElementById("entrada").value)
let stop=parseFloat(document.getElementById("stop").value)
let lote=parseFloat(document.getElementById("lote").value)
let rr=parseFloat(document.getElementById("rr").value)
let parciais=parseInt(document.getElementById("parciais").value)

let pipSize = par.includes("JPY") ? 0.01 : 0.0001

let pips=Math.abs(entrada-stop)/pipSize

let riscoUSD=pips*lote*10

let tp

if(tipo=="compra"){
tp=entrada+(pips*pipSize*rr)
}else{
tp=entrada-(pips*pipSize*rr)
}

document.getElementById("resultadoTP").innerText=tp.toFixed(5)
document.getElementById("resultadoStop").innerText=stop.toFixed(5)

linhas=[]

linhas.push({
nome:"Entrada",
preco:entrada,
cor:"yellow",
info:lote+" lot"
})

linhas.push({
nome:"Stop",
preco:stop,
cor:"red",
info:"-$"+riscoUSD.toFixed(2)
})

let loteParcial=lote/parciais

for(let i=1;i<=parciais;i++){

let preco

if(tipo=="compra"){
preco=entrada+(pips*pipSize*rr/parciais)*i
}else{
preco=entrada-(pips*pipSize*rr/parciais)*i
}

let lucroPips=Math.abs(preco-entrada)/pipSize
let lucroUSD=lucroPips*loteParcial*10

if(i==parciais){

linhas.push({
nome:"Take Profit",
preco:preco,
cor:"lime",
info:"+$"+(lucroPips*lote*10).toFixed(2),
qtd:loteParcial,
porcentagem:100,
drag:true
})

}else{

linhas.push({
nome:"Alvo "+i,
preco:preco,
cor:"cyan",
info:"+$"+lucroUSD.toFixed(2),
qtd:loteParcial,
porcentagem:(i/parciais)*100,
drag:true
})

}

}

desenhar()

}

function recalcular(){

let entrada=linhas[0].preco
let lote=parseFloat(document.getElementById("lote").value)
let parciais=parseInt(document.getElementById("parciais").value)

let loteParcial=lote/parciais

for(let l of linhas){

if(l.nome.includes("Alvo")){

let lucro=Math.abs(l.preco-entrada)*10000*loteParcial*10

l.info="+$"+lucro.toFixed(2)

}

if(l.nome=="Take Profit"){

let lucro=Math.abs(l.preco-entrada)*10000*lote*10

l.info="+$"+lucro.toFixed(2)

}

}

desenhar()

}

function desenhar(){

ctx.clearRect(0,0,canvas.width,canvas.height)

let precos=linhas.map(l=>l.preco)

let max=Math.max(...precos)
let min=Math.min(...precos)

let margem=(max-min)*0.5

max+=margem
min-=margem

let escala=canvas.height/(max-min)

let step=(max-min)/10

for(let p=min;p<=max;p+=step){

let y=canvas.height-((p-min)*escala)

ctx.fillStyle="#94a3b8"

ctx.textAlign="right"

ctx.fillText(p.toFixed(5),canvas.width-10,y)

}

for(let l of linhas){

let y=canvas.height-((l.preco-min)*escala)

l.y=y
l.min=min
l.max=max

ctx.beginPath()
ctx.moveTo(0,y)
ctx.lineTo(canvas.width,y)

ctx.strokeStyle=l.cor
ctx.lineWidth=2
ctx.stroke()

ctx.fillStyle=l.cor

ctx.textAlign="left"

ctx.fillText(l.nome+" ("+l.info+")",10,y-5)

let direita=""

if(l.qtd){

direita=l.qtd.toFixed(2)+" ("+l.porcentagem+"%) "+l.preco.toFixed(5)

}else{

direita=l.preco.toFixed(5)

}

ctx.textAlign="right"

ctx.fillText(direita,canvas.width-80,y-5)

}

}


calcular()
