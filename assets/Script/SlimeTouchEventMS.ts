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
export default class SlimeTouchEvent extends cc.Component {
    firstPlay: boolean = true;
    registerTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancle,this);
    }
    destroyTouchEvent() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancle,this)
    }
    onTouchStart() {
        cc.find('Canvas/playLayer5/arrow_top').active = false;
        cc.find('Canvas/playLayer5/arrow_bottom').active = false;
        this.node.getComponent(cc.AudioSource).play();
        cc.log(this.firstPlay)
        if (this.firstPlay) {
            let animState = this.node.getComponent(cc.Animation).getAnimationState('play0');
            if (animState.isPaused) {
                this.node.getComponent(cc.Animation).resume();
                cc.find('Canvas/playLayer5/progress').getComponent(cc.Animation).resume();
            } else {
                this.node.getComponent(cc.Animation).play('play0');
                cc.find('Canvas/playLayer5/progress').getComponent(cc.Animation).play('grow0');
            }  
        } else {
            let animState = this.node.getComponent(cc.Animation).getAnimationState('play1');
            if (animState.isPaused) {
                this.node.getComponent(cc.Animation).resume();
                cc.find('Canvas/playLayer5/progress').getComponent(cc.Animation).resume();
            } else {
                this.node.getComponent(cc.Animation).play('play1');
                cc.find('Canvas/playLayer5/progress').getComponent(cc.Animation).play('grow1');
            }  
        }

    }
    //触摸移动；
    onTouchMove(event) {

    }
    onTouchEnd() {
        this._touchEnd();
    }
    onTouchCancle(){
        this._touchEnd();
    }
    private _touchEnd() {
        this.node.getComponent(cc.AudioSource).stop();
        this.node.getComponent(cc.Animation).pause();
        cc.find('Canvas/playLayer5/progress').getComponent(cc.Animation).pause();
    }
}
