class Region {
    constructor(posX, posY, sizeX, sizeY, world) {
      this.pos = createVector(posX, posY)
      this.size = createVector(sizeX, sizeY)
      this.infectable = []
      this.infected = []
      this.removed = []
      this.world=world
      this.numTravels=0
    }
    fillRand(num) {
      this.infectable = new Array(num).fill(0).map(() => new Human(createVector(random(this.size.x), random(this.size.y)), this, 0))
    }
    show() {
      strokeWeight(1)
      stroke(80)
      rect(this.pos.x, this.pos.y, this.size.x, this.size.y)
      strokeWeight(4)
      push()
      translate(this.pos.x, this.pos.y)
      stroke(0, 0, 255)
      for (let h of this.infectable) {
        h.update()
        h.show()
      }
      stroke(255, 0, 0)
      fill(255, 0, 0, 50)
      for (let h of this.infected) {
        h.infect()
        h.update()
        h.show()
      }
      stroke(0, 255, 0)
      for (let h of this.removed) {
        h.update()
        h.show()
      }
      pop()
    }
    travel() {
      if (random() < travelrate * this.infected.length*this.world.speed) {
        let i = floor(random(this.infected.length))
        this.world.moveHuman(this.infected.splice(i, 1)[0],this.pos)
        this.numTravels++
      }
      if (random() < travelrate * this.infectable.length*this.world.speed) {
        let i = floor(random(this.infectable.length))
        this.world.moveHuman(this.infectable.splice(i, 1)[0],this.pos)
        this.numTravels++
      }
      if (random() < travelrate * this.removed.length*this.world.speed) {
        let i = floor(random(this.removed.length))
        this.world.moveHuman(this.removed.splice(i, 1)[0],this.pos)
        this.numTravels++
      }
    }
    update() {
      this.travel()
      this.show()
    }
  }