import CustomMask from "./CustomMaskMS";
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
export default class EatMask extends CustomMask {

    // onLoad () {}
    @property(MaskDraw)
    backdraw = new MaskDraw();
    start () {

    }

    touchBegin(event:cc.Event.EventTouch){   
    }

    touchMove(event:cc.Event.EventTouch){
       
    }
    touchEnd(event:cc.Event.EventTouch){
        if(this.enabledInHierarchy){
            let point = event.touch.getLocation();
            this.draw.addCircle(point);
            this.backdraw.addCircle(point);
           let eatAudio = this.getComponent(cc.AudioSource);
           if(eatAudio){
               eatAudio.play();
           }
           if(this.particleNode){
               this.particleNode.setPosition(this.node.convertToNodeSpaceAR(point));
               this.particleNode.getComponent(cc.ParticleSystem).resetSystem();
           }
        }
    }
    empty(){
        this.draw.empty();
    }

    // update (dt) {}
}
