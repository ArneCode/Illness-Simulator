let world
let speedSlider,speedSlider2

function setup() {
  //pixelDensity(0.1)
  createCanvas(round(windowWidth), round(windowHeight))
  numpoep = ((width * 0.66) * height) / 1000
  let rshape = {
    rows: 10,
    cols: 10
  }
  let wshape = {
    wrows: 3,
    wcols: 5
  }
  world = new World(width, rshape, wshape, numpoep,height/4)
  background(255)
  createButton("Bild speichern").mousePressed(() => saveCanvas("IllnesSim" + str(new Date() / 1000), "png"))
  frameRate(10)
  createElement("br")
  createP("Geschwindigkeit: ").style("color", "white")
  speedSlider = createSlider(0.5, 60, 10, 0.1).input(() => {
    let value = speedSlider.value()
    if (value < 20) {
      frameRate(20)
      world.speed = value / 20
    } else {
      frameRate(speedSlider.value())
      world.speed = 1
    }
    //console.log(speedSlider.value())
  })
  speedSlider.style("margin", "16px").style("padding", "16px")
  speedSlider2=createSlider(1,10,1,1)
}

function draw() {
  for(let i=0;i<speedSlider2.value();i++){
    background(0)
  world.update()}
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