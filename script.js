const canvas = document.getElementById("grafico")
const ctx = canvas.getContext("2d")

function ajustarCanvas(){

canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight

}

window.addEventListener("resize",ajustarCanvas)

ajustarCanvas()

let linhas=[]

function calcular(){

let tipo=document.getElementById("tipo").value
let entrada=parseFloat(document.getElementById("entrada").value)
let stop=parseFloat(document.getElementById("stop").value)
let lote=parseFloat(document.getElementById("lote").value)
let rr=parseFloat(document.getElementById("rr").value)

let pipSize = 0.0001

let pips=Math.abs(entrada-stop)/pipSize

let risco=pips*lote*10

let tp

if(tipo=="compra"){

tp=entrada+(pips*pipSize*rr)

}else{

tp=entrada-(pips*pipSize*rr)

}

document.getElementById("resultadoTP").innerText=tp.toFixed(5)
document.getElementById("resultadoStop").innerText=stop.toFixed(5)

linhas=[
{nome:"Entrada",preco:entrada,cor:"yellow"},
{nome:"Stop",preco:stop,cor:"red"},
{nome:"Take Profit",preco:tp,cor:"lime"}
]

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

for(let l of linhas){

let y=canvas.height-((l.preco-min)*escala)

ctx.beginPath()
ctx.moveTo(0,y)
ctx.lineTo(canvas.width,y)

ctx.strokeStyle=l.cor
ctx.lineWidth=2
ctx.stroke()

ctx.fillStyle=l.cor
ctx.fillText(l.nome+" "+l.preco.toFixed(5),10,y-5)

}

}

calcular()
