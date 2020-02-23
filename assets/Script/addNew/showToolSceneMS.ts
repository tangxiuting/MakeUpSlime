import { CocosHelper } from "../../common/common/Script/codebase/utils/CocosHelperMS";
import MoveIn from "../../common/common/Script/compoent/MoveInMS";
import TransitionScene from "../../common/common/Script/codebase/TransitionSceneMS";
import DataConfig from "../DataConfigMS";

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
        DataConfig.getInstance().playMusic2();
        let array = ["bowl_l_content", "bowl_r_content"];
        
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let moveNode = CocosHelper.findNode(cc.Canvas.instance.node, element);
            for (const iterator of moveNode.children) {
                
                if(iterator.name != "bowl"){

                    iterator.active = false;
                    
                }
                
            }

            let moveCm = moveNode.getComponent(MoveIn);
            let self = this;
            moveCm.actionCallBack = function () {
                let index = 0;
                for (const iterator of moveNode.children) {
                    
                    if(iterator.name != "bowl"){
    
                        iterator.active = false;
                        
                        let pos:cc.Vec2 = iterator.position;
                        let tempW = 260 - Math.random() * 520;
                        let tempH = 260 - Math.random() * 520;
                        let pos1:cc.Vec2 = cc.v2(pos.x + tempW, pos.y + tempH);

                        let startPos = moveNode.name == "bowl_l_content" ? cc.v2(-500, 500) : cc.v2(500, 500) ;

                        let posVector = [startPos, pos1, pos];
                        iterator.position = cc.v2(-500, 500);
                        var action1 = cc.cardinalSplineTo(1, posVector, 0);
                        iterator.active = true;
                        iterator.runAction(cc.sequence(cc.delayTime(index * 0.2),cc.callFunc(()=>{

                            //if(index % 2 == 0)
                                cc.audioEngine.playEffect(self.fly, false);

                        }),action1, cc.callFunc(()=>{

                        })));

                    }
                    index++;
                }

            };

        }

        let font1 = CocosHelper.findNode(cc.Canvas.instance.node, "font")
                        
        let moveCm = font1.getComponent(MoveIn);
        
        font1.active = true;
        moveCm.enabled = true;
        moveCm.actionCallBack = function () {
            
            font1.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1.0, cc.v2(0, 10)),cc.moveBy(1.0, cc.v2(0, -10)))));

            let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next")
            btn_next.active = true;
            btn_next.opacity = 0;

            btn_next.runAction(cc.fadeIn(1.0));
            btn_next.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.1), cc.scaleTo(0.5, 1.0))));
        };

    }

    touchItem(event, customEventData){
        var node = event.target;
        node.getComponent(cc.Button).interactable = false;
        if (node.getComponent(cc.AudioSource)) {
            node.getComponent(cc.AudioSource).play();
        }

        //next
        TransitionScene.changeScene("make1AddSceneMS");

    }

    // update (dt) {}
}
