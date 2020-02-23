import { CocosHelper } from "../../common/common/Script/codebase/utils/CocosHelperMS";
import MoveIn from "../../common/common/Script/compoent/MoveInMS";
import SpriteDrag from "../../common/common/Script/codebase/SpriteDrag/SpriteDragMS";
import fallSpriteCompoent from "../fallSpriteCompoentMS";
import DragEventListener from "../../common/common/Script/codebase/SpriteDrag/DragEventListenerMS";
import TransitionScene from "../../common/common/Script/codebase/TransitionSceneMS";

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
    // onLoad () {}
    @property(cc.AudioClip)
    winAudio: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {  
        let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
        let bowl_up = bowl.getChildByName("bowl_up");
        bowl_up.zIndex = 100;

        let array = ["slimeactivator", "clearglue"];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
            let elementNode = CocosHelper.findNode(cc.Canvas.instance.node, element);
            
            let movein = elementNode.getComponent(MoveIn);
            movein.actionCallBack = ()=>{

                let spCm = elementNode.getComponent(SpriteDrag)
                if(spCm)
                    spCm.enabled = true;
                if(element == "slimeactivator"){
                    let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
                    finger.zIndex = 100;
                    CocosHelper.showHand(finger, elementNode, elementNode, CocosHelper.findNode(cc.Canvas.instance.node, "bowl"));

                }
                
            };

        }
        

    }
    touchBegin(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        console.log("touchBegin");
        
        let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
        finger.stopAllActions();
        finger.active = false;

        let moveNode =  drag.moveNode;
        if(moveNode.getChildByName("shadow"))
            moveNode.getChildByName("shadow").active = false;
    }

    touchCancle(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        let moveNode =  drag.moveNode;
        if(moveNode.getChildByName("shadow"))
            moveNode.getChildByName("shadow").active = false;
    }
    toolIndex = 0;
    touchEnd(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        console.log("TouchEnd");
        let moveNode =  drag.moveNode;
        drag.enabled = false;
        if(moveNode.getChildByName("shadow"))
            moveNode.getChildByName("shadow").active = false;
        
        

        var fallSpriteCm = moveNode.getComponent(fallSpriteCompoent);
        if(fallSpriteCm){
            fallSpriteCm.enabled = true;
            fallSpriteCm.actionStartCallBack = ()=>{

                console.log(moveNode.name);
                if(moveNode.name == "clearglue"){

                    moveNode.getChildByName("clearglue_top").active = false;
                }
            };
            fallSpriteCm.actionEndCallBack = ()=>{
                
                //fallSpriteCm.bowlInFall.zIndex = this.indexZ;
                this.toolIndex = this.toolIndex + 1;
                if(this.toolIndex == 2){

                    this.dealNext();

                }

            };
            
        }
        
    }
    dealNext(){
        let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
        let spoon = bowl.getChildByName("spoon");
        spoon.active = true;
        let moveInCm = spoon.getComponent(MoveIn);
        moveInCm.enabled = true;
        moveInCm.actionCallBack = ()=>{

            console.log("spoonmoveInCm.actionCallBack");
            
            spoon.getComponent(SpriteDrag).enabled = true;

            
        };
    }
    mixEND(){

        console.log("mixEnd");
        


        let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
        let spoon = bowl.getChildByName("spoon");
        spoon.getComponent(SpriteDrag).enabled = false;

        CocosHelper.hideNode(spoon, CocosHelper.ShowDirection.show_from_top,()=>{
            let flowerHeart = CocosHelper.findNode(cc.Canvas.instance.node, "flowerHeart");
            flowerHeart.active = true;
            flowerHeart.getComponent(cc.ParticleSystem).resetSystem();
            spoon.active = false;
            cc.audioEngine.playEffect(this.winAudio, false);


            setTimeout(() => {
                TransitionScene.changeScene("make2AddSceneMS");
    
            }, 2000);
        });
           
    }
    // update (dt) {}
}
