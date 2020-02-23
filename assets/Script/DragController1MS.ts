import MoveIn from "../common/common/Script/compoent/MoveInMS";
import TipManager from "./TipManagerMS";


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
export default class DragController1 extends cc.Component {

    @property(cc.Node)
    touchNode: cc.Node = null;

    @property(cc.Node)
    pull0: cc.Node = null;

    @property(cc.Node)
    pull1: cc.Node = null;


    @property(cc.AudioClip)
    batter: cc.AudioClip = null;

    init() {
        this.destroyTouchEvent();
        this.node.getChildByName('arrow_top').active = false;
        cc.find('slime/pull0',this.node).setScale(cc.v2(1,0));
        cc.find('slime/pull1', this.node).setScale(cc.v2(1, 0));
        cc.find('slime0', this.node).active = false;
        cc.find('slime1', this.node).active = false;
        cc.find('slime2', this.node).active = false;
        this.touchNode.stopAllActions();
        this.touchNode.setScale(1);
        this.touchNode.setPosition(cc.v2(0, 0));
        this.touchNode.opacity = 0;
        this.touchNode.getComponent(MoveIn).doShowAction();
        this.touchNode.getComponent(MoveIn).actionCallBack = function () {
            this.registerTouchEvent();
            this.node.getChildByName('arrow_top').active = true;
        }.bind(this)
        this.registerTouchEvent();
    }
    registerTouchEvent() {
   
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancle,this);
    }
    destroyTouchEvent() {
        this.touchNode.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancle,this)
    }
    isTouchIn = false;
    isTouchLocalPos = cc.v2();
    isMovePull0 = false;
    isMovePull1 = false;
    currentNode:cc.Node = null;
    onTouchStart(event) {
        // cc.find('slime0', this.node).active = false;
        // cc.find('slime1', this.node).active = false;
        // cc.find('slime2', this.node).active = false;
        this.pull0.getComponent(cc.AudioSource).play();

        let colider = this.node.getChildByName('slime').getComponent(cc.PolygonCollider);
        let pos = this.node.getChildByName('slime').convertToNodeSpaceAR(event.getLocation());
        if (cc.Intersection.pointInPolygon(pos, colider.points)) {
           console.log("isIn");
            this.isTouchIn = true;
            this.isTouchLocalPos = event.getLocation();
        }
    }
    //触摸移动；
    onTouchMove(event) {
       
        this.node.getChildByName('arrow_top').active = false;
        var self = this;
        var touches = event.getTouches();
        //触摸刚开始的位置
        var oldPos = self.node.convertToNodeSpaceAR(touches[0].getStartLocation());
        //触摸时不断变更的位置
        var newPos = self.node.convertToNodeSpaceAR(touches[0].getLocation());
        
        if(this.isTouchIn){

            if(!this.isMovePull1){
                this.isMovePull1 = true;
                this.currentNode = this.pull1;
                this.currentNode.position = this.currentNode.parent.convertToNodeSpaceAR(this.isTouchLocalPos);
                this.currentNode.stopAllActions();
                this.currentNode.scaleY = 0;
            }
            if(!this.isMovePull0){
                this.isMovePull0 = true;
                this.currentNode = this.pull0;
                this.currentNode.position = this.currentNode.parent.convertToNodeSpaceAR(this.isTouchLocalPos);
                this.currentNode.stopAllActions();
                this.currentNode.scaleY = 0;
            }

            var subPos = newPos.sub(oldPos);
            let scaleY =  this.currentNode.scaleY+(subPos.y / 10 / 500);
            if (scaleY > 1) {
                scaleY = 1;
            }
            if (scaleY < 0) {
                scaleY = 0;
            }
            this.currentNode.scaleY = scaleY;
            //cc.find('slime/pull1',this.node).scaleY = scaleY;

        }
    }
    onTouchEnd(event) {
        this._touchEnd(event);
    }
    onTouchCancle(event) {
        
        this._touchEnd(event);
    }
    private _touchEnd(event) {
        
        let temp = this.currentNode;
        if(temp)
            temp.runAction(cc.scaleTo(0.5, 1, 0));
        this.currentNode = null;
        this.isTouchIn = false;
        if(this.isMovePull1){
            this.isMovePull1 = false;
            
        }
        if(this.isMovePull0){
            this.isMovePull0 = false;
            
        }

        var touches = event.getTouches();
        var oldPos =touches[0].getStartLocation();
        //触摸时不断变更的位置
        var newPos =touches[0].getLocation();
        
        var subPos = newPos.sub(oldPos);
        cc.log(subPos.y);
        
        //let startPOs =  event.getTouches().;
       
        this.touchNode.setScale(1);
        this.touchNode.stopAllActions();
       
        let self = this;
        // this.destroyTouchEvent();
        this.node.runAction(cc.sequence(
           cc.delayTime(0.5),
            cc.callFunc(function () {
                // this.registerTouchEvent();
                this.touchNode.getComponent(cc.AudioSource).play();
                this.touchNode.runAction(cc.sequence(
                    cc.scaleTo(0.1, 1.05, 0.95),
                    cc.scaleTo(0.1, 0.95, 1.05),
                    cc.scaleTo(0.1, 1.02, 0.98),
                    cc.scaleTo(0.1, 0.98, 1.02),
                    cc.scaleTo(0.1, 1, 1)
                ))
                if (subPos.y > 50) {

                    TipManager.getInstance().jumpTips();

                    cc.find('slime0', this.node).active = true;
                    let w1 = 50+Math.random() * 430;
                    let h1 =  Math.random() * 320;
                    cc.find('slime0', this.node).position = this.node.convertToNodeSpaceAR(cc.Canvas.instance.node.convertToWorldSpaceAR(cc.v2(w1, h1)));
                    cc.find('slime0', this.node).stopAllActions();
                    cc.find('slime0', this.node).runAction(cc.sequence(
                        cc.delayTime(2),
                        cc.callFunc(function () {
                           
                            cc.find('slime0', this.node).active = false;
                        }.bind(this))
                    ));
                    cc.find('slime1', this.node).active = true;
                    let w2 = 240 - Math.random() * 480;
                    let h2 = - Math.random() * 320;
                    cc.find('slime1', this.node).position = this.node.convertToNodeSpaceAR(cc.Canvas.instance.node.convertToWorldSpaceAR(cc.v2(w2, h2)));
                    cc.find('slime1', this.node).stopAllActions();
                    cc.find('slime1', this.node).runAction(cc.sequence(
                        cc.delayTime(2),
                        cc.callFunc(function () {
                            cc.find('slime1', this.node).active = false;
                        }.bind(this))
                    ));
                    let w3 = -50- Math.random() * 430;
                    let h3 = Math.random() * 320;
                    cc.find('slime2', this.node).position = this.node.convertToNodeSpaceAR(cc.Canvas.instance.node.convertToWorldSpaceAR(cc.v2(w3, h3)));
                    cc.find('slime2', this.node).stopAllActions();
                    cc.find('slime2', this.node).active = true;
                    cc.find('slime2', this.node).runAction(cc.sequence(
                        cc.delayTime(2),
                        cc.callFunc(function () {
                            cc.find('slime2', this.node).active = false;
                        }.bind(this))
                    ));
                }
                
            }.bind(this))
        ));

        
        // cc.find('slime/pull0',this.node).runAction(cc.scaleTo(0.5, 1, 0));
        // cc.find('slime/pull1',this.node).runAction(cc.scaleTo(0.5,1, 0));
    }
}
