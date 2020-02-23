import SlimeTouchEvent from "./SlimeTouchEventMS";

import DataConfig from "./DataConfigMS";
import MoveIn from "../common/common/Script/compoent/MoveInMS";

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
export default class PlayController extends cc.Component {
    @property(cc.Prefab)
    bubblePre: cc.Prefab = null;
    bubbleNum: number = 0;
    maxNum: number = 30;
    @property
    text: string = 'hello';
    init() {
      
        this.node.getChildByName('arrow_bottom').active = false;
        this.node.getChildByName('arrow_top').active = false;
        this.node.getChildByName('slime').getComponent(cc.Animation).stop();
        this.node.getChildByName('progress').getComponent(cc.Animation).stop();
        cc.find('progress/mask', this.node).height = 0;
        cc.find('progress/star0', this.node).stopAllActions();
        cc.find('progress/star1', this.node).stopAllActions();
        cc.find('progress/star0/star0', this.node).active = false;
        cc.find('progress/star0/star1', this.node).active = true;
        cc.find('progress/star1/star0', this.node).active = false;
        cc.find('progress/star1/star1', this.node).active = true;
        cc.find('slime/tipClick', this.node).active = false;
        cc.find('slime/bubble', this.node).getComponent(cc.Button).interactable = true;
        
        cc.find('slime/bubble', this.node).getComponent(cc.Animation).setCurrentTime(0);
        cc.find('slime/bubble', this.node).getComponent(cc.Animation).stop();
        cc.find('slime/bubble', this.node).active = false;
       
        cc.find('Canvas/playLayer5/slime').children.forEach(child => {
            if (child.name == 'bubbleCopy') {
                child.destroy();
            }
        })
        cc.loader.loadRes(`makeupms/image/slime/${this.text}Slime`, cc.SpriteFrame, function (err, spriteFrame) {
            cc.find('slime/slime0', this.node).getComponent(cc.Sprite).spriteFrame = spriteFrame;
            cc.find('slime/slime0', this.node).setScale(0.8);
        }.bind(this))
       
       
        cc.find('slime/mould', this.node).active = true;
        cc.find('slime/mould', this.node).setScale(0.8);
        cc.find('slime/mould', this.node).stopAllActions();
        cc.find('slime/mould', this.node).setPosition(cc.v2(0, 42));
        cc.find('slime/mould', this.node).getComponent(MoveIn).doShowAction();
        cc.find('slime/mould', this.node).getComponent(MoveIn).actionCallBack = function () {
            this.node.getChildByName('slime').getComponent(SlimeTouchEvent).registerTouchEvent();
            this.node.getChildByName('slime').getComponent(SlimeTouchEvent).firstPlay = true;
            this.node.getChildByName('arrow_bottom').active = true;
        }.bind(this);
       
    }
    createBubble() {
        let node = cc.instantiate(this.bubblePre);
        node.active = true;
        cc.find('Canvas/playLayer5/slime').addChild(node);
        node.name = 'bubbleCopy'
        let y = Math.random() * (cc.find('Canvas/playLayer5/slime').height - 200) - ((cc.find('Canvas/playLayer5/slime').height - 200) / 2);
        let x = Math.random() * (cc.find('Canvas/playLayer5/slime').width - 200) - ((cc.find('Canvas/playLayer5/slime').width - 200) / 2);
        node.setPosition(cc.v2(x, y));
        node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            node.destroy();
            this.createBubble();
        }.bind(this))));
        if (this.bubbleNum > 10 && this.bubbleNum <= 20&&cc.find('Canvas/playLayer5/slime').childrenCount<9) {
            this.node.runAction(cc.sequence(cc.delayTime(0.5),
                cc.callFunc(function () {
                    let node1 = cc.instantiate(this.bubblePre);
                    node1.active = true;
                    cc.find('Canvas/playLayer5/slime').addChild(node1);
                    node1.name = 'bubbleCopy'
                    let y1 = Math.random() * (cc.find('Canvas/playLayer5/slime').height - 300) - ((cc.find('Canvas/playLayer5/slime').height - 300) / 2);
                    let x1 = Math.random() * (cc.find('Canvas/playLayer5/slime').width - 300) - ((cc.find('Canvas/playLayer5/slime').width - 300) / 2);
                    node1.setPosition(cc.v2(x1, y1));
                    node1.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                        node1.destroy();
                    }.bind(this))))
                }.bind(this))))
        }else if (this.bubbleNum > 20&&cc.find('Canvas/playLayer5/slime').childrenCount<10) {
            this.node.runAction(cc.sequence(cc.delayTime(0.3),
            cc.callFunc(function () {
                let node1 = cc.instantiate(this.bubblePre);
                cc.find('Canvas/playLayer5/slime').addChild(node1);
                node1.active = true;
                node1.name = 'bubbleCopy'
                let y1 = Math.random() * (cc.find('Canvas/playLayer5/slime').height - 300) - ((cc.find('Canvas/playLayer5/slime').height - 300) / 2);
                let x1 = Math.random() * (cc.find('Canvas/playLayer5/slime').width - 300) - ((cc.find('Canvas/playLayer5/slime').width - 300) / 2);
                node1.setPosition(cc.v2(x1, y1));
                node1.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                    node1.destroy();
                }.bind(this))))
            }.bind(this))))
            this.node.runAction(cc.sequence(cc.delayTime(0.6),
                cc.callFunc(function () {
                    let node2 = cc.instantiate(this.bubblePre);
                    node2.active = true;
                    cc.find('Canvas/playLayer5/slime').addChild(node2);
                    node2.name = 'bubbleCopy'
                    let y2 = Math.random() * (cc.find('Canvas/playLayer5/slime').height - 300) - ((cc.find('Canvas/playLayer5/slime').height - 300) / 2);
                    let x2 = Math.random() * (cc.find('Canvas/playLayer5/slime').width - 300) - ((cc.find('Canvas/playLayer5/slime').width - 300) / 2);
                    node2.setPosition(cc.v2(x2, y2));
                    node2.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                        node2.destroy();
                    }.bind(this))))
                }.bind(this))))
        }
    }
    reset() {
        cc.director.loadScene('playSlime');
    }
    touchBackBtn() {
        TransitionScene.changeScene('choose',7);
    }
}
