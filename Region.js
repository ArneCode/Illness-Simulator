class Region {
  constructor(posX, posY, sizeX, sizeY, world, type = 0) {
    //alert(`${posX}, ${posY}`)
    this.pos = createVector(posX, posY)
    this.size = createVector(sizeX, sizeY)
    this.infectable = []
    this.infected = []
    this.infectuous=[]
    this.removed = []
    this.world = world
    this.numTravels = 0
    this.type = type
    //if (type == 1) {
     // this.atwork = false
    //console.log(this.all)
  }
  fillRand(num) {
    this.infectable = new Array(num).fill(0).map(() => new Human(createVector(random(this.size.x), random(this.size.y)), this, 0))
  }
  show() {
    strokeWeight(1)
    if (this.type == 0)
      stroke(80)
    else
      stroke(0, 255, 0)
    rect(this.pos.x, this.pos.y, this.size.x, this.size.y)
    strokeWeight(4)
    push()
    translate(this.pos.x, this.pos.y)
    stroke(0, 0, 255)
    for (let h of this.infectable) {
      h.update()
      h.show()
    }
    stroke(255,255,0)
    for(let h of this.infected){
      h.update()
      h.show()
      h.getInfectuous()
    }
    stroke(255, 0, 0)
    fill(255, 0, 0, 50)
    for (let h of this.infectuous) {
      h.infect()
      h.update()
      h.show()
      if (this.world.anxiety >= 1)
        h.reject()
    }
    stroke(0, 255, 0)
    for (let h of this.removed) {
      h.update()
      h.show()
    }
    pop()
  }
  remove(h) {
    let l
    switch (h.state) {
      case 0: {
        l = this.infectable
        break
      }
      case 1: {
        l = this.infected
        break
      }
      case 2: {
        l = this.removed
        break
      }
        case 3:{
          l=this.infectuous
          //console.log(l)
          break
        }
    }
    //console.log(l)
    let i = l.indexOf(h)
    l.splice(i, 1)
  }
  travel() {
    //console.log(this.type+str(random()))
    let region=this.world.regions[floor(random(this.world.regions.length))]
    /*if (random() < this.world.travelrate * this.infected.length * this.world.speed) {
      let i = floor(random(this.infected.length))
      let h=this.infected.splice(i, 1)[0]
      ppos=h.pos
      region.add(h,true)
      pos=h.newRegion(region)

      this.numTravels++
    }
    if (random() < this.world.travelrate * this.infectable.length * this.world.speed) {
      let i = floor(random(this.infectable.length))
      let h=this.infectable.splice(i, 1)[0]
      ppos=h.pos
      region.add(h,true)
      pos=h.newRegion(region)
      
      this.numTravels++
    }
    if (random() < this.world.travelrate * this.removed.length * this.world.speed) {
      let i = floor(random(this.removed.length))
      let h=this.removed.splice(i, 1)[0]
      ppos=h.pos
      region.add(h,true)
      pos=h.newRegion(region)
    
      this.numTravels++
    }
    if (random() < this.world.travelrate * this.infectuous.length * this.world.speed) {
      let i = floor(random(this.infectuous.length))
      let h=this.infectuous.splice(i, 1)[0]
      ppos=h.pos
      region.add(h,true)
      pos=h.newRegion(region)
  
      this.numTravels++
    }*/
    let all=this.all
    if(random()<this.world.travelrate*all.length*this.world.speed){
    let h=all[floor(random(all.length))]
    h.travelTo(region)
      //console.log(ppos.x,ppos.y,pos.x,pos.y)

    
    }
  }
  getl(state) {
    let l
    switch (state) {
      case 0: {
        l = this.infectable
        break
      }
      case 1: {
        l = this.infected
        break
      }
      case 2: {
        l = this.removed
        break
      }
        case 3:{
        l=this.infectuous
          break
        }
    }
        return l
  }
  add(h,newpos=true) {
    let l=this.getl(h.state)
    l.push(h)
    if(newpos){
    h.pos.x=random(this.size.x)
    h.pos.y=random(this.size.y)
      }
  }
  get all() {
    
    let result=this.infectable.concat(this.infected, this.removed,this.infectuous)
    //console.log(result)
    return result
  }
        updateClocks(){
        for(let h of this.all){h.updateClock()}
        }
  update() {
    /*if(this.type==0)
      this.travel()*/
    this.show()
    }
}