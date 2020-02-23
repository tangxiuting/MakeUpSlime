import { CocosHelper } from "../common/common/Script/codebase/utils/CocosHelperMS";
import MoveIn, { ShowDirection, ActionType } from "../common/common/Script/compoent/MoveInMS";

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
    @property(cc.AudioClip)
    fly: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        // cosmetics5
        
        

        setTimeout(() => {
            

            let font1 = CocosHelper.findNode(cc.Canvas.instance.node, "font1")
            
            let moveCm = font1.getComponent(MoveIn);
            
            font1.active = true;
            moveCm.enabled = true;
            moveCm.actionCallBack = function () {
                
                CocosHelper.findNode(cc.Canvas.instance.node, "btn_next").active = true;

                font1.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1.0, cc.v2(0, 10)),cc.moveBy(1.0, cc.v2(0, -10)))));

            };
        }, 2000);

        for (let index = 0; index < 15; index++) {
            const element = "cosmetics" + index;
            let node = CocosHelper.findNode(cc.Canvas.instance.node, element);
            node.active = false;

            let node_ = node.getChildByName(element + "_");
            if(node_){
                console.log(node_.name);
                
                node_.zIndex = -1;
            }
                
            let moveCm = node.addComponent(MoveIn);
            moveCm.direction = ShowDirection.bottom;
            moveCm.action = ActionType.JumpTo;
            moveCm.isLoad = false;
            moveCm.delayTime = 1.0 + (Math.random() * (index % 7)) * 0.15;;
            if(index > 5){
                moveCm.direction = ShowDirection.top;
                moveCm.delayTime = 1.0 + (Math.random()* (index % 7)) * 0.15;;
            }
            if(index % 3 == 0){

                moveCm.scoreAudio = this.fly;

            }
            node.active = true;
        }

    }
    touchNet(event){

        var node = event.target;
        node.getComponent(cc.Button).interactable = false;
        cc.director.loadScene("chooseSceneMS"); 
        
    }
    // update (dt) {}
}
