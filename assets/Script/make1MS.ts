import SpriteDrag from "../common/common/Script/codebase/SpriteDrag/SpriteDragMS";
import DragEventListener from "../common/common/Script/codebase/SpriteDrag/DragEventListenerMS";
import { CocosHelper } from "../common/common/Script/codebase/utils/CocosHelperMS";
import MoveIn from "../common/common/Script/compoent/MoveInMS";
import DataConfig from "./DataConfigMS";

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
    done: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    indexIng : number = 0;
    soundIndex = -1;
    totalContent = 400;
    start () {
        
        let node = this.node.getChildByName("tool");//CocosHelper.findNode(cc.Canvas.instance.node, "tool");


        let moveCm = node.getComponent(MoveIn);
        moveCm.actionCallBack = ()=>{

            node.getComponent(SpriteDrag).enabled = true;

            let progressBar = this.node.getChildByName("progressBar");//CocosHelper.findNode(cc.Canvas.instance.node, "progressBar");
            progressBar.opacity = 0;
            progressBar.active = true;
            progressBar.runAction(cc.fadeIn(1.0));

            progressBar.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.015), cc.callFunc(()=>{

                progressBar.getComponent(cc.ProgressBar).progress =  progressBar.getComponent(cc.ProgressBar).progress + 0.005

                if(progressBar.getComponent(cc.ProgressBar).progress > 1.0){
                    cc.audioEngine.stopAllEffects();
                    progressBar.stopAllActions();
                    let tool = this.node.getChildByName("tool");//CocosHelper.findNode(cc.Canvas.instance.node, "tool");
                    let box = this.node.getChildByName("box");//CocosHelper.findNode(cc.Canvas.instance.node, "box");
        
                    CocosHelper.hideNode(tool, CocosHelper.ShowDirection.show_from_right);
                    CocosHelper.hideNode(box, CocosHelper.ShowDirection.show_from_right);
        
                    let decorateParticle = slime.getChildByName("decorateParticle");
                    decorateParticle.active = true;
                    
                    cc.audioEngine.playEffect(this.done, false);
        
                    //next
                    this.showNext();
                }

            }))));

            let slime =  this.node.getChildByName("slime");   //CocosHelper.findNode(cc.Canvas.instance.node, "slime");
            let slime_in = slime.getChildByName("slime_in");
            slime_in.opacity = 0;
            slime_in.active = true;

            slime_in.runAction(cc.fadeIn(4));

            let moveNode = this.node.getChildByName("tool");//CocosHelper.findNode(cc.Canvas.instance.node, "tool");
            moveNode.getChildByName("tool_p").active = true;
            moveNode.getChildByName("tool_p").getComponent(cc.ParticleSystem).resetSystem();
            //this.soundIndex = cc.audioEngine.playEffect(this.movePour, true);
        
            node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(()=>{

                
            }),cc.delayTime(1.5))));

            moveNode.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1.0, cc.v2(-20, 0)),cc.moveBy(1.0, cc.v2(20, 0)))));
        };

    }
    
    showNext(){

        // let home = DataConfig.getInstance().getIsHome();
        // if(home == ""){

        //     cc.director.loadScene("homeSceneMS");

        // }else{

        //     cc.director.loadScene("showSceneMS");

        // }


    }

    touchBegin(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        console.log("touchBegin");
        
        // let moveNode =  drag.moveNode;
        // moveNode.getChildByName("tool_p").active = true;
        // moveNode.getChildByName("tool_p").getComponent(cc.ParticleSystem).resetSystem();
        // this.soundIndex = cc.audioEngine.playEffect(this.movePour, true);
        

    }
    touchIng(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
       
        // this.indexIng = this.indexIng + 1;

        // let slime = CocosHelper.findNode(cc.Canvas.instance.node, "slime");
        // let slime_in = slime.getChildByName("slime_in");
        // let progressBar = CocosHelper.findNode(cc.Canvas.instance.node, "progressBar");
        // slime_in.opacity = (this.indexIng * 255) / this.totalContent ;
        // progressBar.getComponent(cc.ProgressBar).progress = this.indexIng / this.totalContent;
        
        // if(progressBar.getComponent(cc.ProgressBar).progress > 1.0){
        //     cc.audioEngine.stopAllEffects();
        //     this.soundIndex = -1;
        //     drag.enabled = false;

        //     let tool = CocosHelper.findNode(cc.Canvas.instance.node, "tool");
        //     let box = CocosHelper.findNode(cc.Canvas.instance.node, "box");

        //     CocosHelper.hideNode(tool, CocosHelper.ShowDirection.show_from_right);
        //     CocosHelper.hideNode(box, CocosHelper.ShowDirection.show_from_right);

        //     let decorateParticle = slime.getChildByName("decorateParticle");
        //     decorateParticle.active = true;

        //     cc.audioEngine.playEffect(this.done, false);

        //     //next

        // }

    }
    touchCancle(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        // let self = this;
        
        // let moveNode =  drag.moveNode;

        // // moveNode.getChildByName("tool_p").active = false;
        // moveNode.getChildByName("tool_p").getComponent(cc.ParticleSystem).stopSystem();
        // cc.audioEngine.stopAllEffects();
        // this.soundIndex = -1;
    }
    
    touchEnd(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        // console.log("TouchEnd");
        
        // cc.audioEngine.stopAllEffects();
        // this.soundIndex = -1;
        // let self = this;
        
        // let moveNode =  drag.moveNode;

        // // moveNode.getChildByName("tool_p").active = false;
        // moveNode.getChildByName("tool_p").getComponent(cc.ParticleSystem).stopSystem();

        // console.log(moveNode.getChildByName("tool_p").name);
        

    }
    // update (dt) {}
}
