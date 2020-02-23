// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass("MaskDraw")
export default class MaskDraw {

    @property(cc.Mask)
    mask: cc.Mask = null;

    @property()
    r:number = 16;
    
    addCircle(tpos:cc.Vec2){
        if(this.mask != null&&this.mask.enabledInHierarchy){
           
            // let pos = this.mask.node.convertToNodeSpaceAR(tpos);
            // //console.log(this.mask);
            

            // this.mask._graphics.lineWidth = 1;
            // this.mask._graphics.strokeColor = cc.color(255,0,0);
            // this.mask._graphics.fillColor = cc.color(0,255,0);
            // this.mask._graphics.circle (pos.x,pos.y,this.r);
            // this.mask._graphics.fill();
            // this.mask._graphics.stroke();
            let pos = this.mask.node.convertToNodeSpaceAR(tpos);
            // this.mask._graphics.lineWidth = 1;
            // this.mask._graphics.strokeColor = cc.color(255,0,0);
            // this.mask._graphics.fillColor = cc.color(0,255,0);
            // this.mask._graphics.circle (pos.x,pos.y,this.r);
            // this.mask._graphics.fill();
            // this.mask._graphics.stroke();
            var stencil = this.mask._graphics;
            stencil.circle(pos.x,pos.y,this.r);
            stencil.fill();

        }
    }
    addLine(frompos:cc.Vec2,endPos:cc.Vec2){
   
            let newPos = endPos.sub(frompos);
            let lDistance = newPos.mag();
            for(let i=0;i<lDistance;i+=3){
                let ldelta = i/lDistance;
                let lDifX = endPos.x - frompos.x;
                let lDifY = endPos.y - frompos.y;
                this.addCircle(new cc.Vec2(frompos.x+(lDifX*ldelta),frompos.y+(lDifY*ldelta)));
            }
        
    }
    empty(){
        this.mask._graphics.clear();
    }
    
}
