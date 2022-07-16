class Human {
  constructor(pos, region, state) {
    this.pos = pos
    this.region = region
    this.world = region.world
    this.state = state
    this.dir = random(TWO_PI)
    this.seed = random(1000)
    this.spreadD = 14
    this.spreadDsq = this.spreadD ** 2
    this.force = null
    this.anxrad = 20
    this.anxradsq = this.anxrad ** 2
    this.work = undefined
    this.atwork = false
    this.home = region
    this.itime = 0
    this.isTrav = false
    this.nextWorkTime = 0
    this.symptomStart = Infinity
    this.lastTimeWorked = floor(random(20))
  }
  chooseWork(infected = false) {
    let i = floor(random(this.world.avworks.length))
    this.work = this.world.avworks[i]
    this.work.add(this)
    this.workAt = random()
    /*if(this.work.workers.length>this.world.poeppw){
    this.world.works.push(this.work)
    console.log(typeof(this.world.avworks.slice(i,1)))
      console.log(this.world.avworks.length,i)
      if(floor(random(100))==0)
      console.log(this)
    }*/
    this.workStart = random(6, 9)
    this.workDur = random(5, 10)
    this.timework = this.workStart //time to wait until workstate changes
  }
  goWork() {
    this.region.remove(this)
    //this.world.moveHuman(this,this.work)
    this.work.addWorking(this)
    //console.log("test")
    this.atwork = true
    this.region = this.work.region
  }
  goHome() {
    this.region = this.home
    this.work.region.remove(this)
    this.home.add(this)
    this.atwork = false
  }
  getInfected() {
    this.itime = 0
    let incubation = random(110, 130) + this.world.t
    //console.log(incubation)
    this.incubation = incubation
    this.region.remove(this)
    this.state = 1
    this.region.add(this, false)
    //console.log("test")
  }
  newRegion(r) {
    this.region = r
    this.pos.x = random(r.size.x)
    this.pos.y = random(r.size.y)
    return this.pos
  }
  show() {
    strokeWeight(4)
    if (this.isTrav) {
      stroke(115, 0, 115)
      strokeWeight(8)
    }
    point(this.pos.x, this.pos.y)
    fill(255, 0, 0, 100)
    if (this.state == 3) {
      noStroke()
      circle(this.pos.x, this.pos.y, this.spreadD * 2)
      stroke(255, 0, 0)
    }
    if (this.isTrav) {
      switch (this.state) {
        case 0: {
          stroke(0, 0, 255)
          break
        }
        case 1: {
          stroke(255, 255, 0)
          break
        }
        case 2: {
          stroke(0, 255, 0)
          break
        }
        case 3: {
          stroke(255, 0, 0)
          break;
        }
      }
    }
  }
  isNInRegion(npos) {
    //console.log(npos,this)
    return npos.x < 0 || npos.x > this.region.size.x || npos.y < 0 || npos.y > this.region.size.y
  }
  move() {
    let speed = 3
    let dirV
    if (this.force == null) {
      dirV = p5.Vector.fromAngle(this.dir)
    } else {
      dirV = this.force
    }
    dirV.x *= this.world.speed * speed
    dirV.y *= this.world.speed * speed
    let npos = p5.Vector.add(this.pos, dirV)
    //console.log(npos)
    if (this.isNInRegion(npos)) {
      if (this.force != null)
        return 0
      //else
      //console.log("test")
      let turndir = random() > 0.5 ? 10 : -10
      while (this.isNInRegion(npos)) {
        this.dir += turndir
        dirV = p5.Vector.fromAngle(this.dir)
        dirV.x *= this.world.speed * speed
        dirV.y *= this.world.speed * speed
        npos = p5.Vector.add(this.pos, dirV)
      }
      if (this.pos.x >= this.region.size.x)
        this.pos.x = this.region.size.x - 1
      if (this.pos.y >= this.region.size.y)
        this.pos.y = this.region.size.y - 1
    }
    this.pos = npos
    this.force = null
  }
  addForce(dirV) {
    dirV.normalize()
    //dirV.mult(10)
    //dirV.add(this.pos)
    //strokeWeight(1)
    //stroke(255)
    //line(this.pos.x,this.pos.y,dirV.x,dirV.y)
    this.force = dirV
  }
  reject() {
    if (this.itime < 30)
      return
    this.region.infectable.concat(this.region.removed).forEach(h => {
      if (h != this) {
        let dir = p5.Vector.sub(h.pos, this.pos)
        let dist = distSq(this.pos, h.pos)
        //let force=(this.world.anxiety+this.itime*0.1)//*(100-dist)
        /*alert(force)
          alert(dist)
          alert(this.world.anxiety)
          alert(this.itime)*/
        //dir.mult(force)
        if (dist < h.anxradsq)
          h.addForce(dir)
        //console.log("test")
      }
    })
  }
  turnView() {
    this.dir += (noise(this.world.t * 20 + this.seed) * 2 - 1) * this.world.speed
  }
  infect() {
    this.itime += this.world.speed
    if (this.world.t > this.recovt) {
      this.region.remove(this)
      this.state = 2
      this.region.add(this)
    } else {
      let possInf = []
      this.region.infectable.forEach((h, i) => {
        let d = distSq(this.pos, h.pos)
        if (d < this.spreadDsq)
          possInf.push({
            h,
            i
          })
      })
      if (random() < this.world.contag * possInf.length * this.world.speed) {
        let infected = possInf[floor(random(possInf.length))]
        infected.h.getInfected()
      }
    }
  }
  getInfectuous(immediate = false) {
    if (this.world.t > this.incubation || immediate) {
      this.region.remove(this)
      this.state = 3
      this.region.add(this, false)
      //console.log("now")
      this.recovt = this.world.t + random(200, 300)
      this.symptomStart = this.world.t + random(30, 40)
    }
    //console.log(this.world.t,this.incubation)
  }
  travelTo(region) {
    let ppos = this.pos.copy()
    if (this.isTrav || this.atwork)
      return 0
    this.region.remove(this)
    this.travelRegion = region
    region.add(this)
    this.comeBack = this.world.t + random(1, 10)
    //console.log(this.comeBack)
    this.isTrav = true
    strokeWeight(1)
    stroke(150, 100)
    line(ppos.x + this.home.pos.x, ppos.y + this.home.pos.y, this.pos.x + region.pos.x, this.pos.y + region.pos.y)
  }
  travelBack() {
    this.region.remove(this)
    this.home.add(this)
    this.isTrav = false
    //console.log("test")
  }
  updateClock(){
  this.timework=this.world.t+this.workStart
  }
  update() {
    if (this.work != undefined &&
      !this.isTrav) {
      if (this.world.t > this.timework) {
        if (this.atwork) {
          this.goHome()
          this.timework += 24 - this.workDur
        } else if ((this.state == 3 ? this.symptomStart > this.world.t : true))
          if (this.world.workRate > this.workAt || this.lastTimeWorked < this.world.days - 3) {
            this.goWork()
            this.lastTimeWorked = this.world.days
            this.timework += this.workDur
            this.nextWorkTime = this.world.days + floor(random(2, 6))
          }
      }
    }
    //console.log(this.work==undefined,this.workAt)
    if (this.isTrav) {
      if (this.world.t > this.comeBack)
        this.travelBack()
    }
    this.turnView()
    this.move()
    //console.log(typeof(this.work))
  }
}