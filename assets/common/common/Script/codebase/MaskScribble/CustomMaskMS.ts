import MaskDraw from "./MaskDrawMS";

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

@ccclass
//@inspector("packages://inspector/inspectors/comps/mask.js")
export default class CustomMask extends cc.Mask {

     @property(MaskDraw)
     draw = new MaskDraw();
     @property(cc.Node)
     particleNode:cc.Node = null;
    
     @property({visible:false})
     _enableTouch = true;
     @property
     set enableTouch(b:boolean){
         this._enableTouch = b;
         if(this._enableTouch){
            this.node.on(cc.Node.EventType.TOUCH_START,this.touchBegin.bind(this));
            this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove.bind(this));
            this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd.bind(this));
         }else {
            this.node.off(cc.Node.EventType.TOUCH_START,this.touchBegin);
            this.node.off(cc.Node.EventType.TOUCH_MOVE,this.touchMove);
            this.node.off(cc.Node.EventType.TOUCH_END,this.touchEnd);
         }
     }
     get enableTouch():boolean{
         return this._enableTouch;
     }

  
    onLoad(){
        super.onLoad();
        if(CC_EDITOR){
            cc.Class.attr(this, 'spriteFrame', {visible: false});
            cc.Class.attr(this, 'type', {visible: false});
            cc.Class.attr(this, 'alphaThreshold', {visible: false});
            cc.Class.attr(this, 'segements', {visible: false});
        }
        if(this.draw.mask == null){
            this.draw.mask = this;
        }
        this.enableTouch = this._enableTouch;
    }
    start () {
     

    }

    touchBegin(event:cc.Event.EventTouch){
        if(this.enabledInHierarchy&&this._enableTouch){
            let point = event.touch.getLocation();
            this.draw.addCircle(point);
        }
        
    }

    touchMove(event:cc.Event.EventTouch){
        if(this.enabledInHierarchy&&this._enableTouch){
            let point = event.touch.getLocation();
            let r = this.node.getBoundingBoxToWorld();
            if(r.contains(point)){
                this.draw.addLine(event.getPreviousLocation(),point);
            }
           
        }
    }

    touchEnd(event:cc.Event.EventTouch){
        if(this.enabledInHierarchy&&this._enableTouch){
            
        }
    }

    _hitTest(cameraPt){
        return true;
    }

    _updateGraphics(){
        if(CC_EDITOR){
            super._updateGraphics();
        }
    }

}
