class Chart{
    constructor(shape,_width,maxH,colors){
      this.data=shape
      this.width=_width
      this.maxH=maxH
      this.colors=colors
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
      let length=this.data[0].length
      for(let part in this.data){
        let c=this.colors[part]
        //console.log(c)
        stroke(c)
        //stroke(0)
        beginShape()
        //alert("test")
        for(let i in this.data[part]){
          let posx=(i/length)*this.width
          let posy=map(height-this.data[part][i]-10,-this.maxH+height-10,height,0,height)
          vertex(posx,posy)
          //alert(posx,posy)
        }
        endShape()
        }
      }
    }