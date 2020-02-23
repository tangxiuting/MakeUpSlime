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
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property(cc.SpriteFrame)
    touchSlime: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    touchSlimeAudio: cc.AudioClip = null;

    @property(cc.SpriteFrame)
    pullSlime: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    lachangAudio: cc.AudioClip = null;
    @property(cc.AudioClip)
    batterAudio: cc.AudioClip = null;

    scaleNode = 1.0;
    start () {

        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchBegin,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd,this);


        setTimeout(() => {
            this.scaleNode = this.node.scale;
        }, 500);
    }
    //单点 长按托起

    moveindex = 0;
    touchBegin(){



    }
    pullNode:cc.Node = null;
    distent = 0;
    touchMove(event:cc.Event.EventTouch){

        this.moveindex = this.moveindex + 1;
        
        if(this.moveindex == 3){
            let touch = event.getLocation();
            console.log(this.moveindex);
            let node = new cc.Node();
            node.parent = this.node;
            node.anchorX = 0.5,
            node.anchorY = 0;
    
            node.scaleY = 0;
            node.scaleX = 0;
            let sp = node.addComponent(cc.Sprite);
            sp.spriteFrame = this.pullSlime;

            sp.node.position = this.node.convertToNodeSpaceAR(touch);

            this.pullNode = node;


            this.soundIndex = cc.audioEngine.playEffect(this.lachangAudio, true);

        }else if(this.moveindex > 3){
    
            

            if(this.moveindex >= 95)
                return;
                
            console.log(this.moveindex);
            let touch = event.getLocation();
            let pos = this.pullNode.parent.convertToWorldSpaceAR(this.pullNode.getPosition())
            var angle = pos.angle(event.getPreviousLocation()) * 180 / Math.PI; //    cc.pToAngle(deltaP) / Math.PI * 180
            
            let newV = touch.sub(this.pullNode.getPosition());
            let tempMag = newV.mag();
            if(tempMag > this.distent){
                this.pullNode.scaleY = this.pullNode.scaleY + this.moveindex / 4000;
                this.pullNode.scaleX = this.pullNode.scaleX + this.moveindex / 4000;
            }else{
                this.pullNode.scaleY = this.pullNode.scaleY - this.moveindex / 4000;
                this.pullNode.scaleX = this.pullNode.scaleX + this.moveindex / 4000;
            }
            this.pullNode.scaleX = this.pullNode.scaleX >= 1.0 ? 1.0 : this.pullNode.scaleX;
            this.pullNode.scaleX = this.pullNode.scaleX < 0 ? 0 : this.pullNode.scaleX;
            this.distent = tempMag;
            this.pullNode.angle = angle;

        } 
    }

    touchNum = 0;
    soundIndex = -1;
    touchEnd(event:cc.Event.EventTouch){
        // 
        cc.audioEngine.stopEffect(this.soundIndex);
        if(this.moveindex > 3){

            // this.pullNode.removeFromParent();

            let nodeT = this.pullNode;

            nodeT.runAction(cc.sequence(cc.scaleTo(0.5, 0),cc.callFunc(()=>{
             

                cc.audioEngine.playEffect(this.batterAudio, false);

            }), cc.removeSelf()));

            this.pullNode = null;

            this.moveindex = 0;
        }else{

            this.moveindex = 0;

            this.touchNum = this.touchNum + 1;

            if(this.touchNum % 10 == 0){

                this.node.stopAllActions();
                this.node.scale = this.scaleNode;
                var timeScale = 3.2;
                var scaleRatio = this.node.scale;
                var scale0 = cc.scaleTo(0.11*timeScale,scaleRatio*0.92,scaleRatio);
                var scale1 = cc.scaleTo(0.1*timeScale,scaleRatio,scaleRatio*0.96);
                var scale2 = cc.scaleTo(0.09*timeScale,scaleRatio*0.98,scaleRatio);
                var scale3 = cc.scaleTo(0.08*timeScale,scaleRatio,scaleRatio*0.99);
                var scale4 = cc.scaleTo(0.07*timeScale,scaleRatio);
                
                var seq = cc.sequence(scale0,scale1,scale2,scale3,scale4);

                this.node.runAction(seq);

            }
            if(this.touchNum % 5 == 0){

                TipManager.getInstance().jumpTips();

            }

            let touch = event.getLocation();

            let node = new cc.Node();
            node.parent = this.node;

            let sp = node.addComponent(cc.Sprite);
            sp.spriteFrame = this.touchSlime;

            sp.node.position = this.node.convertToNodeSpaceAR(touch);

            cc.audioEngine.playEffect(this.touchSlimeAudio, false);
            var timeScale = 1.2;
            var scaleRatio = this.node.scale;
            var scale0 = cc.scaleTo(0.11*timeScale,scaleRatio*0.82,scaleRatio);
            var scale1 = cc.scaleTo(0.1*timeScale,scaleRatio,scaleRatio*0.86);
            var scale2 = cc.scaleTo(0.09*timeScale,scaleRatio*0.88,scaleRatio);
            var scale3 = cc.scaleTo(0.08*timeScale,scaleRatio,scaleRatio*0.89);
            var scale4 = cc.scaleTo(0.07*timeScale,scaleRatio);
            
            var seq = cc.sequence(scale0,scale1,scale2,scale3,scale4);
            node.runAction(cc.sequence(seq, cc.delayTime(2.0), cc.fadeOut(1.0),cc.removeSelf()));

        }

    }
    touchCancale(){

        this.moveindex = 0;

    }
    // update (dt) {}
}
