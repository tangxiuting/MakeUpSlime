
import HandTouchEvent from "./HandTouchEventMS";
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
export default class RubController extends cc.Component {
    init() {
        this.node.getChildByName('finger').active = false;
        this.node.getChildByName('slime').stopAllActions();
        this.node.getChildByName('slime').setScale(1);
        this.node.getChildByName('slime').setPosition(cc.v2(0, 0));
        this.node.getChildByName('slime').opacity = 0;
        this.node.getChildByName('hand').opacity = 0;
        this.node.getChildByName('hand').stopAllActions();
        this.node.getChildByName('hand').setPosition(cc.v2(0, -110));

        this.node.getChildByName('hand').getComponent(cc.Animation).stop();
        this.node.getChildByName('hand').getComponent(cc.Animation).setCurrentTime(0);
        this.node.getChildByName('hand').getComponent(HandTouchEvent).destroyTouchEvent();
        this.node.getChildByName('slime').getComponent(MoveIn).doShowAction();
        this.node.getChildByName('hand').getComponent(MoveIn).doShowAction();
        this.node.getChildByName('hand').getComponent(MoveIn).actionCallBack = function () {
            this.node.getChildByName('hand').getComponent(HandTouchEvent).registerTouchEvent();
            this.node.getChildByName('finger').active = true;
        }.bind(this)
    }
}
