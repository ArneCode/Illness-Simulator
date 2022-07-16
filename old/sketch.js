let r
let world
let chart
let contag=0.05
let travelrate=0.01
let numpoep=1000
let speedSlider
function setup(){
  createCanvas(round(windowWidth),round(windowHeight))
  numpoep=((width*0.66)*height)/550
  let shape={rows:11,cols:8}
  world=new World(width,shape,numpoep,width/3)
  background(255)
  createButton("Bild speichern").mousePressed(()=>saveCanvas("IllnesSim" + str(new Date() / 1000), "png"))
  frameRate(10)
  createElement("br")
  createP("Geschwindigkeit: ").style("color","white")
  speedSlider=createSlider(1,60,10).input(()=>{
    let value=speedSlider.value()
    if(value<20){
      frameRate(20)
      world.speed=value/20
    }else{
    frameRate(speedSlider.value())
    world.speed=1}
    //console.log(frameRate(),world.speed,speedSlider.value())
  })
  speedSlider.style("margin","16px").style("padding","16px")
  }
function draw(){
  background(0)
  world.update()
  }
/*function setup() {
  createCanvas(windowWidth, windowHeight);
  r=new Region(width/2,10,width/2,height)
  r.fillRand(numpoep)
  let ih=new Human(createVector(200,200),r,1)
  ih.getInfected()
  r.infected.push(ih)
  let chartC=[color(255,0,0),color(0,0,255),color(100)]
  chart=new Chart([[],[],[]],width/2,numpoep,chartC)
}

function draw() {
  background(220);
  stroke(0)
  r.update()
  chart.addData([[r.infected.length],[r.infectable.length],[r.removed.length]])
  chart.show()
}*/