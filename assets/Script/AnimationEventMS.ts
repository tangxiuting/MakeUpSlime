import SlimeTouchEvent from "./SlimeTouchEventMS";
import MoveIn from "../common/common/Script/compoent/MoveInMS";



const { ccclass, property } = cc._decorator;

@ccclass
export default class AnimationEvent extends cc.Component {
    resetScene() {
        cc.director.loadScene('choose');
    }
    growFinish0() {
        cc.find('Canvas/playLayer5/slime').getComponent(cc.AudioSource).stop();
        cc.find('Canvas/playLayer5/slime').getComponent(SlimeTouchEvent).destroyTouchEvent();
        cc.find('Canvas/playLayer5/slime').getComponent(SlimeTouchEvent).firstPlay = false;
        cc.find('Canvas/playLayer5/slime/decorate').getComponent(cc.ParticleSystem).resetSystem();
        cc.find('Canvas/playLayer5/slime/decorate').getComponent(cc.AudioSource).play();
        cc.find('Canvas/playLayer5/progress/star0').runAction(cc.repeatForever(cc.sequence(cc.rotateBy(1, -30), cc.rotateBy(1, 30))));
        cc.find('Canvas/playLayer5').runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            cc.find('Canvas/playLayer5/slime').getComponent(SlimeTouchEvent).registerTouchEvent();
            cc.find('Canvas/playLayer5/arrow_top').active = true;
        })))

    }
    growFinish1() {
        cc.find('Canvas/playLayer5/slime').getComponent(SlimeTouchEvent).destroyTouchEvent();
        cc.find('Canvas/playLayer5/progress/star1').runAction(cc.repeatForever(cc.sequence(cc.rotateBy(1, -30), cc.rotateBy(1, 30))));
        cc.find('Canvas/playLayer5').runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            cc.find('Canvas/playLayer5/slime').getComponent(cc.AudioSource).stop();
            cc.find('Canvas/playLayer5/slime/decorate').getComponent(cc.ParticleSystem).resetSystem();
            cc.find('Canvas/playLayer5/slime/decorate').getComponent(cc.AudioSource).play();
            cc.find('Canvas/playLayer5/slime/bubble').active = true;
            cc.find('Canvas/playLayer5/slime/tipClick').active = true;
           // cc.find('Canvas/playLayer5/clock').active = true;
        }))) 
    }
    timeOver() {
        if (cc.find('Canvas/playLayer5/progress/mask').height < 390) {
            cc.find('Canvas/playLayer5/btn_reset').getComponent(MoveIn).doShowAction();
            cc.find('Canvas/playLayer5/slime').children.forEach(child => {
                if (child.name == 'bubbleCopy') {
                    child.destroy();
                }
            })
        }
    }
    boomFinish() {
        cc.find('Canvas/playLayer5/boom').active = false;
    }
}