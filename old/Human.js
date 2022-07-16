class Human{
    constructor(pos,region,state){
      this.pos=pos
      this.region=region
      this.world=region.world
      this.state=state
      this.dir=random(TWO_PI)
      this.seed=random(1000)
      this.spreadD=15
      this.spreadDsq=this.spreadD**2
      }
    getInfected(){
      this.itime=0
      this.recovt=random(70,120)
      this.state=1
      }
    newRegion(r){
      this.region=r
      this.pos.x=random(r.size.x)
      this.pos.y=random(r.size.y)
      return this.pos
      }
    show(){
      point(this.pos.x,this.pos.y)
      if(this.state==1){
        noStroke()
        circle(this.pos.x,this.pos.y,this.spreadD*2)
        stroke(255,0,0)
        }
      }
    isNInRegion(npos){
      //console.log(npos,this)
      return npos.x<0||npos.x>this.region.size.x||npos.y<0||npos.y>this.region.size.y
      }
    move(){
      let dirV=p5.Vector.fromAngle(this.dir)
      dirV.x*=this.world.speed
      dirV.y*=this.world.speed
      let npos=p5.Vector.add(this.pos,dirV)
      //console.log(npos)
      if(this.isNInRegion(npos)){
        let turndir=random()>0.5?10:-10
      while(this.isNInRegion(npos)){
        this.dir+=turndir
        dirV=p5.Vector.fromAngle(this.dir)
        dirV.x*=this.world.speed
        dirV.y*=this.world.speed
        npos=p5.Vector.add(this.pos,dirV)
        }
      }
        this.pos=npos
      }
    turnView(){
      this.dir+=noise(this.world.t*20+this.seed)*2-1
      }
    infect(){
      this.itime+=this.world.speed
      if(this.itime>this.recovt){
        this.region.removed.push(this)
        this.state=2
        this.region.infected.splice(this.region.infected.indexOf(this),1)
        }else{
      let possInf=[]
      this.region.infectable.forEach((h,i)=>{
        let d=distSq(this.pos,h.pos)
        if(d<this.spreadDsq)
          possInf.push({h,i})
        })
      if(random()<contag*possInf.length*this.world.speed){
        let infected=possInf[floor(random(possInf.length))]
        this.region.infectable.splice(infected.i,1)
        this.region.infected.push(infected.h)
        infected.h.getInfected()
        }}
      }
    update(){
      this.turnView()
      this.move()
      }
    }