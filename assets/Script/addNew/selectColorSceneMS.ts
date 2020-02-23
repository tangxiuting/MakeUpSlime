import { CocosHelper } from "../../common/common/Script/codebase/utils/CocosHelperMS";
import MoveIn from "../../common/common/Script/compoent/MoveInMS";
import NewDataCal from "./NewDataCalMS";
import TransitionScene from "../../common/common/Script/codebase/TransitionSceneMS";

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

        let isPlayBlue = NewDataCal.getInstance().getBoolValue("blue");
        let isPlayPink = NewDataCal.getInstance().getBoolValue("pink");

        if(isPlayBlue){

            let bowl_l = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_l")
            let bowl_r = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_r")
            bowl_l.position = cc.v2(-258, -23);
            bowl_r.position = cc.v2(258, -23);

            bowl_l.active = true;
            bowl_r.active = true;

            let ui1 = bowl_l.getChildByName("ui1");
            let ui0 = bowl_l.getChildByName("ui0");

            ui1.getComponent(cc.Sprite).spriteFrame = ui0.getComponent(cc.Sprite).spriteFrame
        }else if(isPlayPink){

            let bowl_l = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_l")
            let bowl_r = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_r")
            bowl_l.position = cc.v2(258, -23);
            bowl_r.position = cc.v2(-258, -23);

            bowl_l.active = true;
            bowl_r.active = true;


            let ui1 = bowl_r.getChildByName("ui1");
            let ui0 = bowl_r.getChildByName("ui0");

            ui1.getComponent(cc.Sprite).spriteFrame = ui0.getComponent(cc.Sprite).spriteFrame
        }else{

            let bowl_l = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_l")
            let bowl_r = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_r")
            
            bowl_l.active = true;
            bowl_r.active = true;

        }


        let font1 = CocosHelper.findNode(cc.Canvas.instance.node, "font")
                        
        let moveCm = font1.getComponent(MoveIn);
        
        font1.active = true;
        moveCm.enabled = true;
        moveCm.actionCallBack = function () {
            
            font1.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1.0, cc.v2(0, 10)),cc.moveBy(1.0, cc.v2(0, -10)))));

            let newNode = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_r");
            
            newNode.getChildByName("ui1").runAction(cc.repeatForever(cc.sequence(cc.moveBy(2.0,cc.v2(0, 10)),cc.moveBy(2.0,cc.v2(0, -10)))));

            let old = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_l");

            old.getChildByName("ui1").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(2.0, 1.05),cc.scaleTo(2.0, 1.0))));

        };
    }

    selectItem(event){
        var nodeBtn:cc.Node = event.target;
        let array = ["bowl_r", "bowl_l"];
        if (nodeBtn.getComponent(cc.AudioSource)) {
            nodeBtn.getComponent(cc.AudioSource).play();
        }
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
            let moveNode = CocosHelper.findNode(cc.Canvas.instance.node, element);
            moveNode.getChildByName("touch_right").getComponent(cc.Button).interactable = false;
            console.log(nodeBtn.name);
            
            if(nodeBtn.parent.name != element)
                moveNode.runAction(cc.fadeOut(0.5));

        }
        nodeBtn.stopAllActions();
        nodeBtn.angle = 0;
        nodeBtn.scale = 1.0;
        nodeBtn.parent.runAction(cc.sequence(cc.spawn(cc.jumpTo(1.0, cc.v2(0, 0)), cc.scaleTo(1.0, 1.1)),cc.callFunc(()=>{

            let finish = CocosHelper.findNode(cc.Canvas.instance.node, "finish")
            finish.active = true;
            if (finish.getComponent(cc.AudioSource)) {
                finish.getComponent(cc.AudioSource).play();
            }
            setTimeout(() => {
                
                //TransitionScene.changeScene("");
                if(nodeBtn.parent.name == "bowl_r"){

                    TransitionScene.changeScene("play1PinkSceneMS");

                }else{


                    TransitionScene.changeScene("play1BlueSceneMS");

                }


            }, 2000);

        })));


        let font1 = CocosHelper.findNode(cc.Canvas.instance.node, "font")
        font1.stopAllActions();
        font1.runAction(cc.moveBy(0.5,cc.v2(0, 500)));
    }


    // update (dt) {}
}
