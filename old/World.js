class World {
    constructor(_width, region_shape, num_poep, chartw = 0) {
      this.width = _width - chartw
      this.num_poep = num_poep
      this.genRegions(region_shape)
      this.xoff = 0
      this.chartw = chartw
      this.randomInf()
      //alert(this)
      if (this.chartw > 0) {
        let chartC = [color(255, 0, 0), color(0, 0, 255), color(0,255,0)]
        this.chart = new Chart([
          [],
          [],
          []
        ], chartw, num_poep, chartC)
      }
      //this.randomInf()
      this.infectedT=document.getElementById("numinfected")
      this.infectableT=document.getElementById("numinfectable")
      this.removedT=document.getElementById("numremoved")
      this.speed=1
      this.t=0
    }
    randomInf() {
      //alert("hallo")
      let reg = this.regions[floor(random(this.regions.length))]
      let pos = createVector(random(reg.size.x), random(reg.size.y))
      let h = new Human(pos, reg, 1)
      h.getInfected()
      reg.infected.push(h)
      //alert("test")
    }
    moveHuman(human) {
      let region = this.regions[floor(random(this.regions.length))]
      switch (human.state) {
        case 0: {
          region.infectable.push(human)
          break;
        }
        case 1: {
          region.infected.push(human)
          break;
        }
        case 2: {
          region.removed.push(human)
          break;
        }
      }
      let ppos = p5.Vector.add(human.pos, human.region.pos)
      let npos = p5.Vector.add(human.newRegion(region), region.pos)
      /*strokeWeight(1)
      stroke(0, 255, 0,70)
      line(ppos.x, ppos.y, npos.x, npos.y)*/
    }
    genRegions(shape) {
      this.regions = []
      let {
        rows,
        cols
      } = shape
      let sizeX = this.width / cols
      let sizeY = height / rows
      let numr = cols * rows
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          let posX = x * sizeX
          let posY = y * sizeY
          let r = new Region(posX, posY, sizeX, sizeY, this)
          r.fillRand(floor(this.num_poep / numr))
          this.regions.push(r)
        }
      }
    }
    getStats() {
      let ninfected = 0
      let ninfectable = 0
      let nremoved = 0
      for (let r of this.regions) {
        ninfected += r.infected.length
        ninfectable += r.infectable.length
        nremoved += r.removed.length
      }
      return [ninfected, ninfectable, nremoved]
    }
    update() {
      this.t+=this.speed
      push()
      translate(this.chartw, 0)
      for (let region of this.regions) {
        region.update()
      }
      pop()
      let stats = this.getStats()
      if (this.chartw > 0) {
        if (stats[0] > 0){
          //if(this.speed>1||this.time%2<1)
          this.chart.addData(stats)
        }
        this.chart.show()
      }
      let total=stats[0]+stats[1]+stats[2]
      this.infectedT.innerText=`Infizierte: ${stats[0]} (${(stats[0]/total*100).toFixed(2)}%)`
      this.infectableT.innerText=`Gesunde: ${stats[1]} (${(stats[1]/total*100).toFixed(2)}%)`
      this.removedT.innerText=`Immune/Geheilte: ${stats[2]} (${(stats[2]/total*100).toFixed(2)}%)`
      /*let numTrans=0
      for(let r of this.regions){
        numTrans+=r.numTravels
        }
      //console.log((numTrans*this.speed)/this.t)*/
    }
  }