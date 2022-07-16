function distSq(x1,y1,x2=null,y2=null){
    if(x2==null){
      return abs(p5.Vector.sub(x1,y1).magSq())
      }else{
        return abs(((x1-x2)**2)+((y1-y2)**2))
        }
    }