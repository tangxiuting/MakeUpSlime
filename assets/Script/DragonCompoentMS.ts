import { DragonBoneScaleTo, dragonBoneScaleTo } from "./DragonBoneActionsMS";
import EventListener from "../common/Script/codebase/EventListenerMS";

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
export default class DragonCompoent extends cc.Component {

    @property({type:cc.Node})
    moveNodes:cc.Node[] = [];

    onLoad () {
        
    }
    Pulling = "Pulling";
    PullEnd = "PullEnd";
    PullStand = "PullStand";

    // private moveNodes:cc.Node[];
    private _startPos:cc.Vec2 = cc.v2(0,0); 
    private _endPos:cc.Vec2 = cc.v2(0,0);
    private _isTouchMove:boolean;
    private _moveBone:dragonBones.Bone = null;
    start () {

        this.initListner();
        
    }


    private distanceSquared(pos1:cc.Vec2, pos2:cc.Vec2){

        let dx = pos2.x - pos1.x;
        let dy = pos2.y - pos1.y;
        return (dx * dx + dy * dy);

    }

    private initListner(){

        // this.node.setPosition
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.find('Canvas').emit("PullTouch");
        },this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event:cc.Event.EventTouch) {
            // console.log("TOUCH_MOVE");
            let prePos = this.node.getPosition();
            let deta:cc.Vec2 = event.getDelta();
            this._isTouchMove = Math.sqrt(deta.x * deta.x + deta.y * deta.y) > 4;
            if(!this._isTouchMove){
                // this.scheduleOnce(this.checkTouchMove, 0.4);
            }else {
                // this.unSchedule(this.checkTouchMove, this);
            }
            deta.y = 0;
            let newPos = this.node.getPosition().add(deta);
            let adjustMove:boolean = this.distanceSquared(newPos, this._endPos) <= this.distanceSquared(this._startPos, this._endPos);
            if(adjustMove){
                let isEnd: boolean = this.distanceSquared(newPos, this._startPos) >= this.distanceSquared(this._endPos, this._startPos);
               if(isEnd){
                   newPos = this._endPos;
                   deta = this._endPos.sub(prePos);
               }
               this.node.setPosition(newPos);
               if(this._moveBone){
                   this._moveBone.offset.x = this._moveBone.offset.x + deta.x;
                   
                   this._moveBone.invalidUpdate();
               }
               for(let _node of this.moveNodes){
                    
                   _node.setPosition(_node.getPosition().add(deta));
               }
               if(isEnd){
                    //发射事件 PullEnd
                    // this.node.dispatchEvent( new cc.Event.EventCustom(this.PullEnd, true));
                    // let noti = new cc.EventTarget();
                    // console.log("emit(this.PullEnd)");
                    
                    cc.find('Canvas').emit(this.PullEnd);
               }else {
                    // console.log("emit(Pulling)");
                    cc.find('Canvas').emit(this.Pulling);
                    //发射事件  Pulling
                    // this.node.dispatchEvent( new cc.Event.EventCustom(this.Pulling, true));
                    
               }
           }


        },this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            
            this.scaleAction();
            cc.find('Canvas').emit(this.PullEnd);
        },this);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            
            this.scaleAction();
            cc.find('Canvas').emit(this.PullEnd);
        },this);
        
    }
    private checkTouchMove(float){
        if(!this._isTouchMove){
            //dispatcherEvent(PullStand);
            //发送停止事件
        }
    
    }
    private scaleAction() {
        if(this._moveBone){
            let actionTag = 101014;
            this.node.stopActionByTag(actionTag);
            let timeScale = 1;
            let _btnScale = 1;
            
            
            let lScale0 = dragonBoneScaleTo(0, _btnScale, _btnScale);
            let lScale1 = dragonBoneScaleTo(0.13*timeScale, _btnScale, _btnScale-0.2);
            let lScale2 = dragonBoneScaleTo(0.11*timeScale, _btnScale-0.2, _btnScale);
            let lScale3 = dragonBoneScaleTo(0.10*timeScale, _btnScale, _btnScale-0.14);
            let lScale4 = dragonBoneScaleTo(0.09*timeScale, _btnScale-0.12, _btnScale);
            let lScale5 = dragonBoneScaleTo(0.08*timeScale, _btnScale, _btnScale-0.11);
            let lScale6 = dragonBoneScaleTo(0.07*timeScale, _btnScale, _btnScale);
            lScale0.setScaleBone(this._moveBone);
            lScale1.setScaleBone(this._moveBone);
            lScale2.setScaleBone(this._moveBone);
            lScale3.setScaleBone(this._moveBone);
            lScale4.setScaleBone(this._moveBone);
            lScale5.setScaleBone(this._moveBone);
            lScale6.setScaleBone(this._moveBone);
            let ret = cc.sequence(lScale0, lScale1, lScale2, lScale3, lScale4, lScale5, lScale6);
            ret.setTag(actionTag);
            this.node.runAction(ret);
        }
    }

    /*--------------------------------*/
    setMoveBone(bone:dragonBones.Bone){
        this._moveBone = bone;
    }
    getMoveBone(){

        return this._moveBone;
    }
    setStartPos(pos : cc.Vec2){
        this._startPos = pos;
    }
    setEndPos(pos : cc.Vec2){
        this._endPos = pos;
    }
    addMoveNodes(node:cc.Node){
        if(node)
            this.moveNodes.push(node);
    }
    getStartPos():cc.Vec2{

        return this._startPos;
    }
    getEndPos():cc.Vec2{

        return this._endPos;
    }
    getMoveNodes(){ 
        return this.moveNodes;
    }
    /*-----------------------------------*/
}
