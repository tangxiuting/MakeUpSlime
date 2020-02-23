import CustomMask from "./CustomMaskMS";

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
export default class IcingMask extends CustomMask {
   
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
    touchBegin(event:cc.Event.EventTouch){ 
        cc.find('Canvas/cake/tipClick').active = false; 
        cc.find('Canvas/cake/finger').active = false;
        if(this.enabledInHierarchy&&this._enableTouch){
            let point = event.touch.getLocation();
            this.draw.addCircle(point);
        }
    }
}
