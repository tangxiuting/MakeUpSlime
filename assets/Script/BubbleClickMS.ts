import PlayController from "./PlayControllerMS";

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
export default class BubbleClick extends cc.Component {
    click() {
        this.node.stopAllActions();
        let scaleX = 1.1;
        let scaleY = 0.9;
        let action = cc.scaleBy(0.1,1.15,0.85);
        let action1 = cc.scaleBy(0.1,0.85,1.15);
        let action2 = cc.scaleTo(0.1,scaleX,scaleY);
        cc.find('Canvas/playLayer5/slime').runAction(cc.repeat(cc.sequence(action,action1,action2),2));
        let height = cc.find('Canvas/playLayer5/progress/mask').height;
        this.node.getComponent(cc.Animation).play('bubble');
        this.node.getComponent(cc.AudioSource).play();
        cc.find('Canvas/playLayer5/slime/tipClick').active = false;
        this.node.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(function () {
            if (this.node.name == 'bubbleCopy') {
                this.node.destroy();
            } else {
                this.node.active = false;
            }
            
            cc.find('Canvas/playLayer5').getComponent(PlayController).createBubble();
            cc.find('Canvas/playLayer5').getComponent(PlayController).bubbleNum = cc.find('Canvas/playLayer5').getComponent(PlayController).bubbleNum + 1;
        }.bind(this))));
        // let animState = cc.find('Canvas/playLayer5/clock').getComponent(cc.Animation).getAnimationState('timing');
        // if (!animState.isPlaying) {
        //     cc.find('Canvas/playLayer5/clock').getComponent(cc.Animation).play('timing');
        // }
        cc.find('Canvas/playLayer5/progress/mask').height = height + 5;
        if (cc.find('Canvas/playLayer5/progress/mask').height >= 390) {
            cc.find('Canvas/playLayer5/boom').active = true;
            cc.find('Canvas/playLayer5/boom').getComponent(cc.AudioSource).play();
            cc.find('Canvas/playLayer5/clock').getComponent(cc.Animation).stop();
            cc.find('Canvas/playLayer5/clock/clock2').rotation = 0;
            cc.find('Canvas/playLayer5/clock').active = false;
            cc.find('Canvas/playLayer5/slime').children.forEach(child => {
                if (child.name == 'bubbleCopy') {
                    child.destroy();
                }
            })
        }
    }
}
