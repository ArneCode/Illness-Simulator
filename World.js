const DOTRAV = 0
class World {
  constructor(_width, region_shape, work_shape, num_poep, charth = 0) {
    this.t = 0
    this.homewidth = _width
    this.workwidth = this.homewidth * 0.4
    this.homewidth -= this.workwidth
    this.num_poep = num_poep
    //this.poeppw = Infinity //poeple per workspace
    this.charth = charth
    this.height = height - charth

    this.genRegions(region_shape, work_shape)
    //console.log(this.avworks.length)
    this.setPoepWork()
    this.xoff = 0
    //this.chartw = chartw
    this.randomInf()
    //alert(this)
    if (this.charth > 0) {
      let chartC = [color(255, 0, 0), color(0, 0, 255), color(0, 255, 0), color(255, 255, 0)]
      this.chart = new Chart([
        [],
        [],
        [],
        []
      ], _width - width / 2 - 50, charth, num_poep, chartC, _width / 2)
    }
    //this.randomInf()
    this.infectedT = document.getElementById("numinfected")
    this.infectableT = document.getElementById("numinfectable")
    this.removedT = document.getElementById("numremoved")
    this.infectuousT = document.getElementById("numinfectuous")
    this.speed = 1
    this.contag = 0.03
    this.travelrate = 0.0005
    this.numpoep = 1000
    this.anxiety = 0
    this.dayt = 0
    this.days = 0
    this.nextChartUpdate = 0
    this.workrate = 1
    this.weekDay = 1
    //alert(`${this.homewidth}, ${this.workwidth}, ${this.height}`)
    //this.works.filter(e=>e!=undefined)
    console.log(this)
  }
  get workRate() {
    if (this.weekDay < 6) {
      return this.workrate * 0.7
    } else {
      return this.workrate * (this.weekDay < 7 ? 0.6 : 0.2)
    }
  }
  setPoepWork() {
    //console.log("later")
    for (let r of this.regions) {
      //let all = r.all
      // console.log(r.all.length)
      for (let h of r.all) {
        h.chooseWork()
      }
    }
    this.works = this.works.concat(this.avworks)
    this.avworks = []
  }
  randomInf() {
    //alert("hallo")
    let reg = this.regions[floor(random(this.regions.length))]
    if (reg.infectable.length == 0)
      return 0
    //let pos = createVector(random(reg.size.x), random(reg.size.y))
    let i = floor(random(reg.infectable.length))
    let h = reg.infectable[i]
    h.getInfectuous(true)
    //alert("test")
  }
  moveHuman(human, _region = false) {
    let region
    if (_region)
      region = _region
    else
      region = this.regions[floor(random(this.regions.length))]
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
    stroke(150, 100)
    line(ppos.x, ppos.y, npos.x, npos.y)*/
  }
  genRegions(rshape, wshape) {
    this.regions = []
    this.works = []
    this.avworks = []
    let num_worksp = wshape.rows * wshape.cols
    let {
      rows,
      cols
    } = rshape
    let sizeX = this.homewidth / cols
    let sizeY = this.height / rows
    // alert(`${this.height},${sizeY},${rows}`)
    let i = 0
    let numr = cols * rows
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        i++
        let posX = x * sizeX
        let posY = y * sizeY
        //if (i < numr-1) {
        let r = new Region(posX, posY, sizeX, sizeY, this)
        r.fillRand(floor(this.num_poep / numr))
        this.regions.push(r)
        /*} else {
          let w = new Work(posX, posY, sizeX, sizeY, this)
          this.avworks.push(w)
        }*/
      }
    }
    let {
      wrows,
      wcols
    } = wshape
    //console.log(wshape)
    sizeX = this.workwidth / wcols
    sizeY = this.height / wrows
    for (let x = 0; x < wcols; x++) {
      for (let y = 0; y < wrows; y++) {
        let posX = x * sizeX
        let posY = y * sizeY
        let w = new Work(posX, posY, sizeX, sizeY, this)
        this.avworks.push(w)
        //console.log("test")
      }
    }
  }
  getStats() {
    let ninfected = 0
    let ninfectable = 0
    let nremoved = 0
    let ninfectuous = 0
    for (let r of this.regions) {
      ninfected += r.infected.length
      ninfectable += r.infectable.length
      nremoved += r.removed.length
      ninfectuous += r.infectuous.length
    }
    for (let w of this.works) {
      ninfected += w.region.infected.length

      ninfectable += w.region.infectable.length
      nremoved += w.region.removed.length
      ninfectuous += w.region.infectuous.length
    }
    return [ninfectuous, ninfectable, nremoved, ninfected]
  }
  doPrevention(infectedRel, stats) {
    if (infectedRel > 5) {
      this.travelrate = 0.00005 * DOTRAV
    } else {
      this.travelrate = 0.0001 * DOTRAV
    }
    if (stats[0] == 0 && stats[2] < 10) {
      this.randomInf()
      alert("random Inf")
    }
    if (infectedRel > 15) {
      this.anxiety = 0
    } else if (infectedRel < 0) {
      this.anxiety = 0
    }
  }
  update() {
    // alert("update")
    this.t += this.speed * 0.2
    this.dayt += this.speed * 0.2
    if (this.dayt > 10 && this.dayt < 14) {
      //console.log(this)
    }
    if (this.dayt > 24) {
      this.dayt = 0
      this.days++
      for (let r of this.regions) {
        r.updateClocks()
      }
      this.weekDay++
      if (this.weekDay > 7) {
        this.weekDay = 1
      }
    }
    //("update0")

    push()
    translate(0, this.charth)
    for (let region of this.regions) {
      region.update()
    }
    // alert("update1")
    push()
    translate(this.homewidth, 0)
    for (let w of this.works) {
      w.update()
    }
    pop()
    pop()
    // alert("update2")
    let stats = this.getStats()
    let total = stats[0] + stats[1] + stats[2]+stats[3]
    this.infectedT.innerText = `Infizierte (nicht ansteckend): ${stats[3]} (${(stats[3]/total*100).toFixed(2)}%)`
    this.infectableT.innerText = `Gesunde: ${stats[1]} (${(stats[1]/total*100).toFixed(2)}%)`
    this.removedT.innerText = `Immune/Geheilte: ${stats[2]} (${(stats[2]/total*100).toFixed(2)}%)`
    this.infectuousT.innerText = `Infizierte (ansteckend): ${stats[0]} (${(stats[0]/total*100).toFixed(2)}%)`
    // alert("update4")
    this.doPrevention(stats[0] / total * 100, stats)
    let chartoff = max(max(this.infectedT.offsetWidth, this.infectuousT.offsetWidth), max(this.removedT.offsetWidth, this.infectableT.offsetWidth)) + 40
    this.chart.xoff = chartoff
    if (this.charth > 0) {
      if (stats[0] > 0 && this.t > this.nextChartUpdate) {
        this.chart.addData(stats)
        this.nextChartUpdate += 5
      }
      this.chart.show()
    }
    // alert("update3")

    //alert("update5")
    /*let numTrans=0
    for(let r of this.regions){
      numTrans+=r.numTravels
      }
    //console.log((numTrans*this.speed)/this.t)*/
  }
}