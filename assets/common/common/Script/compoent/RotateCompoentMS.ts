import EventListener from "../codebase/EventListenerMS";


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
export default class NewClass extends cc.Component {

    @property({type:[EventListener],tooltip:"监听事件"})
    eventTouchs:EventListener[]=[];


    @property({tooltip:"完成的角度"})
    endRotate:number = 0;

    start () {
        
    }
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this);

    }

    onDisable() {

        this.node.off(cc.Node.EventType.TOUCH_START,this.touchStart,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.touchEnd,this);

    }
    private touchPrePos:cc.Vec2 = cc.v2(0, 0);
    touchMove(event: cc.Event.EventTouch) {
        let size = this.node.getContentSize();//->getContentSize();
        let centerPos = this.node.convertToWorldSpaceAR(cc.v2(0,0));
        
        let newPos = this.getWordPos(event.getLocation());
        let prePos = this.getWordPos(event.getPreviousLocation());
   
        let touchPos = event.getDelta();
        let endDirect = touchPos.sub(centerPos);// - centerPos;
        let preDirect = this.touchPrePos.sub(centerPos);// - centerPos;
        let angel = endDirect.angle(preDirect) * 180 / 3.1415926;

        let newRotate = this.node.rotation + angel * 20;
        this.node.rotation = newRotate;

        if(newRotate >= this.endRotate){
            this.node.rotation = this.endRotate;
            this.enabled = false;
            let temps:EventListener[] = this.eventTouchs.slice().reverse();
            for(let e of temps){
                if(e.emit("RotaEnd", event, this)){
                    break;
                }
            }

        }
        
    }
    touchStart(event: cc.Event.EventTouch){
        
        this.touchPrePos = cc.v2(0, 0);
    }
    touchEnd(event: cc.Event.EventTouch){

        

    }
    private getWordPos(cameraPos:cc.Vec2):cc.Vec2 {
        let wordPos:cc.Vec2;
        if(this.node != null){
            let _camr = cc.Camera.findCamera(this.node);
            if(_camr != null){
                let p = _camr.getScreenToWorldPoint(cameraPos,wordPos);
                return cc.v2(p.x,p.y);
            }
        }
        return cameraPos;
   }
    // update (dt) {}
}
