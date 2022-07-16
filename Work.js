class Work{
  constructor(posX,posY,sizeX,sizeY,world){
    this.pos=createVector(posX,posY)
    this.size=createVector(sizeX,sizeY)
    this.world=world
    this.workers=[]
    this.region=new Region(posX,posY,sizeX,sizeY,this.world,1)
  }
  /*
  show(){
    rect(this.pos.x,this.pos.y,this.size.x,this.size.y)
    }*/
  add(h){
    this.workers.push(h)
    }
  addWorking(h){
    this.region.add(h)
    }
  update(){
    this.region.update()
    }
  }