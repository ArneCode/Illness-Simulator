class Chart{
  constructor(shape,_width,_height,maxH,colors,xoff){
    this.data=shape
    this.height=_height
    this.width=_width
    this.maxH=maxH
    this.colors=colors
    this.xoff=xoff
    //console.log(this.width,xoff)
    }
  setData(data){
    this.data=data
    }
  addData(d){
    for(let i=0;i<d.length;i++){
      this.data[i]=this.data[i].concat(d[i])
      }
    }
  show(){
    //console.log(this)
    //alert("hallo")
    noFill()
    //stroke(255,0,0)
    //console.log(this.canvas)
    //background(0)
    //console.log(this.data)      
    push()
    translate(this.xoff,0)
    let length=this.data[0].length
    for(let part in this.data){
      let c=this.colors[part]
      //console.log(c)
      stroke(c)
      //stroke(0)
      beginShape()
      //alert("test")
      let posy,posx
      for(let i in this.data[part]){
        posx=(i/length)*this.width
        posy=map(this.height-this.data[part][i]-10,-this.maxH+this.height-10,this.height,0,this.height)
        vertex(posx,posy)
        //alert(posx,posy)
      }
      vertex(this.width,posy)
      endShape()
      }
    pop()
    }
  
  }