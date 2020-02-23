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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        DataConfig.getInstance().playMusic();
        let font1 = CocosHelper.findNode(cc.Canvas.instance.node, "font")
                        
        let moveCm = font1.getComponent(MoveIn);
        
        font1.active = true;
        moveCm.enabled = true;
        moveCm.actionCallBack = function () {
            
            font1.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1.0, cc.v2(0, 10)),cc.moveBy(1.0, cc.v2(0, -10)))));

            let newNode = CocosHelper.findNode(cc.Canvas.instance.node, "new");

            newNode.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(2.0,-5),cc.rotateTo(2.0, 5))));

            let old = CocosHelper.findNode(cc.Canvas.instance.node, "old");

            old.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(2.0, 1.05),cc.scaleTo(2.0, 1.0))));

        };

    }

    touchItem(event){
        var nodeBtn:cc.Node = event.target;
        let array = ["old", "new"];
        if (nodeBtn.getComponent(cc.AudioSource)) {
            nodeBtn.getComponent(cc.AudioSource).play();
        }
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
            let moveNode = CocosHelper.findNode(cc.Canvas.instance.node, element);
            moveNode.getComponent(cc.Button).interactable = false;
            console.log(nodeBtn.name);
            
            if(nodeBtn.name != element)
                moveNode.runAction(cc.fadeOut(0.5));

        }
        nodeBtn.stopAllActions();
        nodeBtn.angle = 0;
        nodeBtn.scale = 1.0;
        nodeBtn.runAction(cc.sequence(cc.spawn(cc.jumpTo(1.0, cc.v2(0, 0)), cc.scaleTo(1.0, 1.1)),cc.callFunc(()=>{

            let finish = CocosHelper.findNode(cc.Canvas.instance.node, "finish")
            finish.active = true;
            if (finish.getComponent(cc.AudioSource)) {
                finish.getComponent(cc.AudioSource).play();
            }
            setTimeout(() => {
                
                //TransitionScene.changeScene("");

                if(nodeBtn.name == "old"){

                    TransitionScene.changeScene("showSceneMS");

                }else{


                    TransitionScene.changeScene("showToolSceneMS");

                }


            }, 2000);

        })));


        let font1 = CocosHelper.findNode(cc.Canvas.instance.node, "font")
        font1.stopAllActions();
        font1.runAction(cc.moveBy(0.5,cc.v2(0, 500)));
    }

    // update (dt) {}
}
