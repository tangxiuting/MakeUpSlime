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
export default class SlapController extends cc.Component {
    photoNode:cc.Node = null;
    filePath:string = null;
    touchNum: number = 0;
    onLoad() {
        this.node.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(function () {
                this.init()
            }.bind(this))
        ))
      
    }
    init() {
        this.destroyTouchEvent();
        this.touchNum = 0;
        this.node.getChildByName('slime').stopAllActions();
        this.node.getChildByName('slime').setScale(1);
        this.node.getChildByName('slime').setPosition(cc.v2(0, 0));
        this.node.getChildByName('slime').opacity = 0;
        this.node.getChildByName('slime').getComponent(MoveIn).enabled = true;
        this.node.getChildByName('slime').getComponent(MoveIn).doShowAction();
        this.node.getChildByName('tipClick').active = false;
        cc.find('slime/slime', this.node).children.forEach(child => {
            if (child.name == 'shadow') {
                child.destroy();
            }
        })
        this.node.getChildByName('slime').getComponent(MoveIn).actionCallBack = function () {
            cc.log(this.node.getChildByName('slime').position);
            this.registerTouchEvent();
            this.node.getChildByName('tipClick').active = true;
        }.bind(this)
    }
    onTouchStart(event) {
       
        this.node.getChildByName('tipClick').active = false;
        let touches = event.getTouches();
        let handPosition = this.node.convertToNodeSpaceAR(touches[0].getStartLocation());
        let position = cc.find('slime/slime', this.node).convertToNodeSpaceAR(touches[0].getStartLocation());

        let colider = cc.find('slime/slime', this.node).getComponent(cc.PolygonCollider);
        
        if (cc.Intersection.pointInPolygon(position, colider.points)) {
           
          
           
            this.touchNum = this.touchNum + 1;
            this.destroyTouchEvent();
            if (this.touchNum % 3 == 0) {
                TipManager.getInstance().jumpTips();
            }
            this.node.getChildByName('hand').runAction(cc.sequence(
                cc.moveTo(0.5, handPosition),
                cc.callFunc(function () {
                    this.node.getChildByName('slime').runAction(cc.sequence(
                        cc.scaleTo(0.1, 1.05, 0.95),
                        cc.scaleTo(0.1, 0.95, 1.05),
                        cc.scaleTo(0.1, 1.02, 0.98),
                        cc.scaleTo(0.1, 0.98, 1.02),
                        cc.scaleTo(0.1, 1, 1)
                    ))
                    this.node.getChildByName('slime').getComponent(cc.AudioSource).play();
                    let node = cc.instantiate(cc.find('slime/slime/hand_shadow', this.node));
                    node.active = true;
                    node.name = 'shadow';
                    node.parent = this.node.getChildByName('slime').getChildByName('slime');
                    node.setPosition(position);
                    node.runAction(cc.fadeTo(4, 0));
                    // cc.find('heartParticle', this.node).setPosition(handPosition);
                    // cc.find('heartParticle', this.node).getComponent(cc.ParticleSystem).resetSystem();
                }.bind(this)),
                cc.moveTo(0.5, cc.v2(0, -400)),
                cc.callFunc(function () {
                    this.registerTouchEvent();
                }.bind(this))
            ));
        }
    }
    destroyTouchEvent() {
        this.node.getChildByName('slime').off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }
    registerTouchEvent() {
        this.node.getChildByName('slime').on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }
}
