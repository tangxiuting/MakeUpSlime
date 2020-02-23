import { CocosHelper } from "../../common/common/Script/codebase/utils/CocosHelperMS";
import MoveIn from "../../common/common/Script/compoent/MoveInMS";
import SpriteDrag from "../../common/common/Script/codebase/SpriteDrag/SpriteDragMS";
import DragEventListener from "../../common/common/Script/codebase/SpriteDrag/DragEventListenerMS";
import TipManager from "../TipManagerMS";
import MixComponent from "../../common/common/Script/CombinedComponent/MixComponentMS";
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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.AudioClip)
    fly: cc.AudioClip = null;

    @property(cc.AudioClip)
    cut: cc.AudioClip = null;

    @property(cc.AudioClip)
    fallAudio: cc.AudioClip = null;
    @property(cc.AudioClip)
    power: cc.AudioClip = null;
    @property(cc.AudioClip)
    scoroop: cc.AudioClip = null;
    @property(cc.AudioClip)
    sauceAudio: cc.AudioClip = null;
    @property({type:[cc.SpriteFrame]})
    mixBlenderAnimation:cc.SpriteFrame[] = [];
    @property(cc.AudioClip)
    winAudio: cc.AudioClip = null;
    

    start () {
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
                        var action1 = cc.cardinalSplineTo(1.5, posVector, 0);
                        iterator.active = true;
                        iterator.runAction(cc.sequence(cc.delayTime(index * 0.2),cc.callFunc(()=>{

                            //if(index % 2 == 0)
                                cc.audioEngine.playEffect(self.fly, false);

                        }),action1, cc.callFunc(()=>{

                            let spCm = iterator.getComponent(SpriteDrag)
                            if(spCm)
                                spCm.enabled = true;

                        })));

                    }
                    index++;
                }

            };

        }
        let bg = CocosHelper.findNode(cc.Canvas.instance.node, "bg");

        bg.runAction(cc.repeatForever(cc.sequence(cc.callFunc(()=>{

            let tempNode = null;
            
            if(!this.isTouchToolBool){

                let array = ["bowl_l_content", "bowl_r_content"];
        
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    let moveNode = CocosHelper.findNode(cc.Canvas.instance.node, element);
                    for (const iterator of moveNode.children) {
                        
                        if(iterator.name != "bowl"){
        
                            
                            let sp = iterator.getComponent(SpriteDrag);
                            if(sp && sp.enabled){

                                iterator.runAction(cc.jumpBy(0.5, cc.v2(0, 0), 40, 2));
                                break;
                            }
                        }
                        
                    }
                
                }

            }
            

        }), cc.delayTime(5.0))));
    }
    isTouchToolBool = false;
    touchBegin(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        console.log("touchBegin");
        this.isTouchToolBool = true;
    }

    touchCancle(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
       
    }
    toolIndex = 0;
    touchEnd(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        console.log("TouchEnd");
        let moveNode =  drag.moveNode;
        drag.enabled = false;
        this.isTouchToolBool = false;
        let tagName = moveNode.parent.name == "bowl_l_content" ? "blue" : "pink";

        if(moveNode.name == "lipstick"){

            //口红
            this.dolipstick(moveNode, moveNode.parent.getChildByName("bowl"));

        }
        if(moveNode.name == "eyeshadow_pen"){

            
            this.doeyeshadow_pen(moveNode, moveNode.parent.getChildByName("bowl"));

        }
        if(moveNode.name == "nailpolish"){

            this.donailpolish(moveNode, moveNode.parent.getChildByName("bowl"));
            
        }
        if(moveNode.name == "eyeshadowblink"){

            this.doeyeshadowblink(moveNode, moveNode.parent.getChildByName("bowl"));
        }
        if(moveNode.name == "eyeshadow"){

            this.doeyeshadow(moveNode, moveNode.parent.getChildByName("bowl"));
        }
        if(moveNode.name == "sleepingmask"){

            this.dosleepingmask(moveNode, moveNode.parent.getChildByName("bowl"));
        }
        if(moveNode.name == "glitter"){

            this.doglitter(moveNode, moveNode.parent.getChildByName("bowl"));
        }
        if(moveNode.name == "glitter"){

            this.doglitter(moveNode, moveNode.parent.getChildByName("bowl"));
        }
        if(moveNode.name == "facialgel"){

            this.dofacialgel(moveNode, moveNode.parent.getChildByName("bowl"));
        }
        if(moveNode.name == "lipgloss"){

            this.dolipgloss(moveNode, moveNode.parent.getChildByName("bowl"));
        }

    }
    zorder = 0;
    showlipstickHanf = false;

    dolipgloss(lipsticknode:cc.Node, bowlNode:cc.Node){

        let bowl_nailpolish = bowlNode.getChildByName("lipgloss_bowl");
        
        let pos = bowl_nailpolish.convertToWorldSpaceAR(cc.v2(0, 0));
        let pos1 = lipsticknode.parent.convertToNodeSpaceAR(pos);

        lipsticknode.runAction(cc.sequence(cc.jumpTo(0.5, pos1, 50, 1), cc.callFunc(()=>{

            lipsticknode.active = false;
            bowl_nailpolish.active = true;
            this.zorder = this.zorder + 1;
            bowl_nailpolish.zIndex = this.zorder;
            
            bowl_nailpolish.on(cc.Node.EventType.TOUCH_START,this.ipglossTouch,this);
            bowl_nailpolish.on(cc.Node.EventType.TOUCH_CANCEL,this.ipglossEnd,this);
            bowl_nailpolish.on(cc.Node.EventType.TOUCH_END,this.ipglossEnd,this);

            let facialgel_in = bowl_nailpolish.getChildByName("lipgloss_bowl_in");
            facialgel_in.scale = 0;
            facialgel_in.active = true;


            facialgel_in.runAction(cc.sequence(cc.scaleTo(2.0, 0.5), cc.callFunc(()=>{

                bowl_nailpolish.targetOff(this);
                let bowl_facialgel = bowlNode.getChildByName("bowl_mix").getChildByName("bowl_lipgloss");

                let pos = bowl_facialgel.convertToWorldSpaceAR(cc.v2(0, 0));
                let pos1 = facialgel_in.parent.convertToNodeSpaceAR(pos);

                facialgel_in.runAction(cc.sequence(cc.jumpTo(0.5, pos1, 50, 1), cc.callFunc(()=>{
                    facialgel_in.active = false;
                    bowl_facialgel.active = true;
                    this.zorder = this.zorder + 1;
                    bowl_facialgel.zIndex = this.zorder;
                    cc.audioEngine.stopEffect(this.touchSauceSoundT);
                    bowl_nailpolish.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(1000, 0)), cc.hide()));
                    this.doStep(bowlNode.parent.name);
                })));

            })));

            cc.director.getActionManager().pauseTarget(facialgel_in);

        })));
    }
    touchSauceSoundT = -1;
    ipglossTouch(event: cc.Event.EventTouch){
        this.isTouchToolBool = true;
        let lipsticknode:cc.Node = event.target;

        let facialgel_in = lipsticknode.getChildByName("lipgloss_bowl_in");
        cc.director.getActionManager().resumeTarget(facialgel_in);

        this.touchSauceSoundT = cc.audioEngine.playEffect(this.sauceAudio, true);
    }
    ipglossEnd(event: cc.Event.EventTouch){
        this.isTouchToolBool = false;
        let lipsticknode:cc.Node = event.target;
        let facialgel_in = lipsticknode.getChildByName("lipgloss_bowl_in");
        cc.director.getActionManager().pauseTarget(facialgel_in);

        cc.audioEngine.stopEffect(this.touchSauceSoundT);
    }

    dofacialgel(lipsticknode:cc.Node, bowlNode:cc.Node){

        let bowl_nailpolish = bowlNode.getChildByName("facialgel_bowl");
        
        let pos = bowl_nailpolish.convertToWorldSpaceAR(cc.v2(0, 0));
        let pos1 = lipsticknode.parent.convertToNodeSpaceAR(pos);

        lipsticknode.runAction(cc.sequence(cc.jumpTo(0.5, pos1, 50, 1), cc.callFunc(()=>{

            lipsticknode.active = false;
            bowl_nailpolish.active = true;
            this.zorder = this.zorder + 1;
            bowl_nailpolish.zIndex = this.zorder;
            
            bowl_nailpolish.on(cc.Node.EventType.TOUCH_START,this.facialgelTouch,this);
            bowl_nailpolish.on(cc.Node.EventType.TOUCH_CANCEL,this.facialgelEnd,this);
            bowl_nailpolish.on(cc.Node.EventType.TOUCH_END,this.facialgelEnd,this);

            let facialgel_in = bowl_nailpolish.getChildByName("facialgel_in");
            facialgel_in.scale = 0;
            facialgel_in.active = true;

            facialgel_in.runAction(cc.sequence(cc.scaleTo(2.0, 2.0), cc.callFunc(()=>{

                bowl_nailpolish.targetOff(this);
                let bowl_facialgel = bowlNode.getChildByName("bowl_mix").getChildByName("bowl_facialgel");

                let pos = bowl_facialgel.convertToWorldSpaceAR(cc.v2(0, 0));
                let pos1 = facialgel_in.parent.convertToNodeSpaceAR(pos);

                facialgel_in.runAction(cc.sequence(cc.jumpTo(0.5, pos1, 50, 1), cc.callFunc(()=>{
                    facialgel_in.active = false;
                    bowl_facialgel.active = true;
                    this.zorder = this.zorder + 1;
                    bowl_facialgel.zIndex = this.zorder;
                    cc.audioEngine.stopEffect(this.touchSauceSound);
                    bowl_nailpolish.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(1000, 0)), cc.hide()));
                    this.doStep(bowlNode.parent.name);
                })));

            })));

            cc.director.getActionManager().pauseTarget(facialgel_in);

        })));
    }

    touchSauceSound = -1;

    facialgelTouch(event: cc.Event.EventTouch){
        this.isTouchToolBool = true;
        let lipsticknode:cc.Node = event.target;

        let facialgel_in = lipsticknode.getChildByName("facialgel_in");
        cc.director.getActionManager().resumeTarget(facialgel_in);

        this.touchSauceSound = cc.audioEngine.playEffect(this.sauceAudio, true);
    }
    facialgelEnd(event: cc.Event.EventTouch){
        this.isTouchToolBool = false;
        let lipsticknode:cc.Node = event.target;
        let facialgel_in = lipsticknode.getChildByName("facialgel_in");
        cc.director.getActionManager().pauseTarget(facialgel_in);

        cc.audioEngine.stopEffect(this.touchSauceSound);
    }
    doglitter(lipsticknode:cc.Node, bowlNode:cc.Node){

        let bowl_nailpolish = bowlNode.getChildByName("bowl_glitter");

        let pos = bowl_nailpolish.convertToWorldSpaceAR(cc.v2(0, 0));
        let pos1 = lipsticknode.parent.convertToNodeSpaceAR(pos);

        lipsticknode.runAction(cc.sequence(cc.jumpTo(0.5, pos1, 50, 1), cc.callFunc(()=>{
            this.isTouchToolBool = false;
            lipsticknode.active = false;
            bowl_nailpolish.active = true;
            this.zorder = this.zorder + 1;
            bowl_nailpolish.zIndex = this.zorder;
            let bowl_nailpolish_p = bowl_nailpolish.getChildByName("glitter_p");
            bowl_nailpolish_p.active = true;

            let bowl_nailpolish_in = bowlNode.getChildByName("bowl_mix").getChildByName("bowl_glitter");
            bowl_nailpolish_in.active = true;
            bowl_nailpolish_in.scale = 0;
            this.zorder = this.zorder + 1;
            bowl_nailpolish_in.zIndex = this.zorder;
            cc.audioEngine.playEffect(this.power, false);

            bowl_nailpolish.runAction(cc.sequence(cc.jumpBy(1.0, cc.v2(0, 0), 50, 2),cc.delayTime(1.0),cc.callFunc(()=>{

                cc.audioEngine.playEffect(this.power, false);

            }), cc.jumpBy(1.0, cc.v2(0, 0), 50, 2)));

            bowl_nailpolish_in.runAction(cc.sequence(cc.scaleTo(3.5, 1.0), cc.callFunc(()=>{

                //bowl_nailpolish_in.active = false;
                bowl_nailpolish_p.active = false;
                bowl_nailpolish.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(1000, 0)), cc.hide()));
                this.doStep(bowlNode.parent.name);

            })));

        })));
    }

    dosleepingmask(lipsticknode:cc.Node, bowlNode:cc.Node){

        let bowl_nailpolish = bowlNode.getChildByName("sleepingmask");

        let pos = bowl_nailpolish.convertToWorldSpaceAR(cc.v2(0, 0));
        let pos1 = lipsticknode.parent.convertToNodeSpaceAR(pos);

        lipsticknode.runAction(cc.sequence(cc.jumpTo(0.5, pos1, 50, 1), cc.callFunc(()=>{
            this.isTouchToolBool = false;
            lipsticknode.active = false;
            bowl_nailpolish.active = true;
            this.zorder = this.zorder + 1;
            bowl_nailpolish.zIndex = this.zorder;
            
            let eyeshadowblink_spoon = bowl_nailpolish.getChildByName("sleepingmask_spoon");
            let pos = eyeshadowblink_spoon.position;
            eyeshadowblink_spoon.position = cc.v2(0, 1500);
            eyeshadowblink_spoon.active = true;
            
            eyeshadowblink_spoon.runAction(cc.sequence(cc.jumpTo(0.5, pos, 50, 1), cc.callFunc(()=>{

                eyeshadowblink_spoon.on(cc.Node.EventType.TOUCH_START,this.sleepingmaskTouch,this);
                eyeshadowblink_spoon.on(cc.Node.EventType.TOUCH_CANCEL,this.sleepingmaskEnd,this);
                eyeshadowblink_spoon.on(cc.Node.EventType.TOUCH_END,this.sleepingmaskEnd,this);
                
                eyeshadowblink_spoon.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.25, cc.v2(-10, 7)),cc.moveBy(0.25, cc.v2(10, -7)))));

                let bowl_eyeshadowblink = bowlNode.getChildByName("bowl_mix").getChildByName("bowl_sleepingmask");
                bowl_eyeshadowblink.active = true;
                bowl_eyeshadowblink.scale = 0;

                bowl_eyeshadowblink.runAction(cc.sequence(cc.scaleTo(2.5, 1.0), cc.callFunc(()=>{
                    eyeshadowblink_spoon.targetOff(this);
                    cc.audioEngine.stopEffect(this.slwwpSound);
                    eyeshadowblink_spoon.getChildByName("sleepingmask_spoon_p").active = false;
                    eyeshadowblink_spoon.stopAllActions();
                    eyeshadowblink_spoon.parent.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(1000, 0)), cc.hide()));
                    this.doStep(bowlNode.parent.name);
                })));

               
                this.zorder = this.zorder + 1;
                bowl_eyeshadowblink.zIndex = this.zorder;
                
                cc.director.getActionManager().pauseTarget(bowl_eyeshadowblink);
                cc.director.getActionManager().pauseTarget(eyeshadowblink_spoon);
               

            })));
        })));
    }
    sleepingmaskTouch(event: cc.Event.EventTouch){
        this.isTouchToolBool = true;
        console.log("eyeshadowblinkTouch");
        
        let lipsticknode:cc.Node = event.target;
        let eyeshadowblink_spoon = lipsticknode;
        let eyeshadowblink_bowl_p = eyeshadowblink_spoon.getChildByName("sleepingmask_spoon_p");
        
        let bowl_eyeshadowblink = lipsticknode.parent.parent.getChildByName("bowl_mix").getChildByName("bowl_sleepingmask");

        cc.director.getActionManager().resumeTarget(bowl_eyeshadowblink);
        cc.director.getActionManager().resumeTarget(eyeshadowblink_spoon);
       
        eyeshadowblink_bowl_p.active = true;

        let topParent = lipsticknode.parent.parent.parent;

        this.slwwpSound = cc.audioEngine.playEffect(this.scoroop, true);

        
       
        
    }
    slwwpSound = 0;
    sleepingmaskEnd(event: cc.Event.EventTouch){
        this.isTouchToolBool = false;
        let lipsticknode:cc.Node = event.target;
        let eyeshadowblink_spoon = lipsticknode;
        let eyeshadowblink_bowl_p = eyeshadowblink_spoon.getChildByName("sleepingmask_spoon_p");
        
        let bowl_eyeshadowblink = lipsticknode.parent.parent.getChildByName("bowl_mix").getChildByName("bowl_sleepingmask");

        cc.director.getActionManager().pauseTarget(bowl_eyeshadowblink);
        cc.director.getActionManager().pauseTarget(eyeshadowblink_spoon);
        
        eyeshadowblink_bowl_p.active = false;

        let topParent = lipsticknode.parent.parent.parent;

        cc.audioEngine.stopEffect(this.slwwpSound);
    }


    dolipstick(lipsticknode:cc.Node, bowlNode:cc.Node){

        lipsticknode.runAction(cc.sequence(cc.jumpTo(0.5, cc.v2(bowlNode.position.x + 40, bowlNode.position.y + 150), 50, 1),cc.rotateTo(0.2, -110), cc.callFunc(()=>{


            if(!this.showlipstickHanf){
                this.showlipstickHanf = true;

                let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
                finger.zIndex = 100;
                finger.position = finger.parent.convertToNodeSpaceAR(lipsticknode.convertToWorldSpaceAR(cc.v2(0, 0)));
                finger.active = true;
                finger.stopAllActions();
                finger.runAction(cc.sequence(cc.moveBy(0.5, cc.v2(0, 10)), cc.moveBy(0.5, cc.v2(0, -10)),cc.moveBy(0.5, cc.v2(0, 10)), cc.moveBy(0.5, cc.v2(0, -10)),cc.callFunc(()=>{

                    finger.active = false;

                })));

            }

            lipsticknode.on(cc.Node.EventType.TOUCH_START,this.lipsticknodeTouch,this);
            // lipsticknode.on(cc.Node.EventType.TOUCH_END,this.eye_shadow_TouchUp,this);
            
        })));

    }
    lipsticknodeTouch(event: cc.Event.EventTouch){
        let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
        finger.active = false;
        this.isTouchToolBool = true;
        let lipsticknode:cc.Node = event.target;
        lipsticknode.targetOff(this);


        let lipsticknode_in = lipsticknode.getChildByName("lipstick_in");
        let bowl = lipsticknode.parent.getChildByName("bowl");
        if(lipsticknode_in){
            
            let pos = lipsticknode_in.parent.convertToWorldSpaceAR(lipsticknode_in.position);      
            lipsticknode_in.parent = bowl;
            lipsticknode_in.position = lipsticknode_in.parent.convertToNodeSpaceAR(pos);

            let bowl_lipstick = bowl.getChildByName("bowl_mix").getChildByName("bowl_lipstick");
            cc.audioEngine.playEffect(this.cut, false);

            lipsticknode.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(1000, 0)), cc.hide()));
            this.doStep(bowl.parent.name);
            lipsticknode_in.runAction(cc.sequence(cc.spawn(cc.rotateTo(0.5, bowl_lipstick.rotation), cc.jumpTo(0.5, bowl_lipstick.position, 50, 1)), cc.callFunc(()=>{
                this.isTouchToolBool = false;
                bowl_lipstick.active = true;
                lipsticknode_in.active = false;
                this.zorder = this.zorder + 1;
                bowl_lipstick.zIndex = this.zorder;
            })));
        }
    }
    // update (dt) {}

    doeyeshadow_pen(lipsticknode:cc.Node, bowlNode:cc.Node){

        lipsticknode.runAction(cc.sequence(cc.jumpTo(0.5, cc.v2(bowlNode.position.x + 40, bowlNode.position.y + 150), 50, 1),cc.rotateTo(0.2, -110), cc.callFunc(()=>{


            if(!this.showlipstickHanf){
                this.showlipstickHanf = true;

                let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
                finger.zIndex = 100;
                finger.position = finger.parent.convertToNodeSpaceAR(lipsticknode.convertToWorldSpaceAR(cc.v2(0, 0)));
                finger.active = true;
                finger.stopAllActions();
                finger.runAction(cc.sequence(cc.moveBy(0.5, cc.v2(0, 10)), cc.moveBy(0.5, cc.v2(0, -10)),cc.moveBy(0.5, cc.v2(0, 10)), cc.moveBy(0.5, cc.v2(0, -10)),cc.callFunc(()=>{

                    finger.active = false;

                })));

            }

            lipsticknode.on(cc.Node.EventType.TOUCH_START,this.eyeshadow_penTouch,this);
            // lipsticknode.on(cc.Node.EventType.TOUCH_END,this.eye_shadow_TouchUp,this);
            
        })));

    }
    eyeshadow_penTouch(event: cc.Event.EventTouch){
        let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
        finger.active = false;

        let lipsticknode:cc.Node = event.target;
        lipsticknode.targetOff(this);


        let lipsticknode_in = lipsticknode.getChildByName("eyeshadow_pen_in");
        let bowl = lipsticknode.parent.getChildByName("bowl");
        if(lipsticknode_in){
            
            let pos = lipsticknode_in.parent.convertToWorldSpaceAR(lipsticknode_in.position);      
            lipsticknode_in.parent = bowl;
            lipsticknode_in.position = lipsticknode_in.parent.convertToNodeSpaceAR(pos);

            let bowl_lipstick = bowl.getChildByName("bowl_mix").getChildByName("bowl_eyeshadow_pen");
            cc.audioEngine.playEffect(this.cut, false);

            lipsticknode.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(1000, 0)), cc.hide()));
            this.doStep(bowl.parent.name);
            lipsticknode_in.runAction(cc.sequence(cc.spawn(cc.rotateTo(0.5, bowl_lipstick.rotation), cc.jumpTo(0.5, bowl_lipstick.position, 50, 1)), cc.callFunc(()=>{
                this.isTouchToolBool = false;
                bowl_lipstick.active = true;
                lipsticknode_in.active = false;
                this.zorder = this.zorder + 1;
                bowl_lipstick.zIndex = this.zorder;
            })));
        }
    }

    donailpolish(lipsticknode:cc.Node, bowlNode:cc.Node){

        let bowl_nailpolish = bowlNode.getChildByName("bowl_nailpolish");

        let pos = bowl_nailpolish.convertToWorldSpaceAR(cc.v2(0, 0));
        let pos1 = lipsticknode.parent.convertToNodeSpaceAR(pos);

        lipsticknode.runAction(cc.sequence(cc.jumpTo(0.5, pos1, 50, 1), cc.callFunc(()=>{

            lipsticknode.active = false;
            bowl_nailpolish.active = true;

            let bowl_nailpolish_p = bowl_nailpolish.getChildByName("bowl_nailpolish_p");
            bowl_nailpolish_p.active = true;

            let bowl_nailpolish_in = bowlNode.getChildByName("bowl_mix").getChildByName("bowl_nailpolish_in");
            bowl_nailpolish_in.active = true;
            bowl_nailpolish_in.scale = 0;
            this.zorder = this.zorder + 1;
            bowl_nailpolish_in.zIndex = this.zorder;
            cc.audioEngine.playEffect(this.fallAudio, false);
            this.isTouchToolBool = false;
            bowl_nailpolish_in.runAction(cc.sequence(cc.scaleTo(2.0, 1.0), cc.callFunc(()=>{

                //bowl_nailpolish_in.active = false;

                bowl_nailpolish.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(1000, 0)), cc.hide()));
                this.doStep(bowlNode.parent.name);

            })));

        })));
    }


    doeyeshadowblink(lipsticknode:cc.Node, bowlNode:cc.Node){

        let bowl_nailpolish = bowlNode.getChildByName("eyeshadowblink_bowl");

        let pos = bowl_nailpolish.convertToWorldSpaceAR(cc.v2(0, 0));
        let pos1 = lipsticknode.parent.convertToNodeSpaceAR(pos);

        lipsticknode.runAction(cc.sequence(cc.jumpTo(0.5, pos1, 50, 1), cc.callFunc(()=>{
            this.isTouchToolBool = false;
            lipsticknode.active = false;
            bowl_nailpolish.active = true;
            this.zorder = this.zorder + 1;
            bowl_nailpolish.zIndex = this.zorder;
            
            //lipsticknode.on(cc.Node.EventType.TOUCH_START,this.lipsticknodeTouch,this);
            let eyeshadowblink_spoon = bowl_nailpolish.getChildByName("eyeshadowblink_spoon");
            let pos = eyeshadowblink_spoon.position;
            eyeshadowblink_spoon.position = cc.v2(0, 1500);
            eyeshadowblink_spoon.active = true;
            
            eyeshadowblink_spoon.runAction(cc.sequence(cc.jumpTo(0.5, pos, 50, 1), cc.callFunc(()=>{

                eyeshadowblink_spoon.on(cc.Node.EventType.TOUCH_START,this.eyeshadowblinkTouch,this);
                eyeshadowblink_spoon.on(cc.Node.EventType.TOUCH_CANCEL,this.eyeshadowblinkEnd,this);
                eyeshadowblink_spoon.on(cc.Node.EventType.TOUCH_END,this.eyeshadowblinkEnd,this);
                
                eyeshadowblink_spoon.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.25, cc.v2(7, 7)),cc.moveBy(0.25, cc.v2(-7, -7)))));

                let bowl_eyeshadowblink = bowlNode.getChildByName("bowl_mix").getChildByName("bowl_eyeshadowblink");
                bowl_eyeshadowblink.active = true;
                bowl_eyeshadowblink.scale = 0;

                bowl_eyeshadowblink.runAction(cc.sequence(cc.scaleTo(2.0, 1.0), cc.callFunc(()=>{

                })));

                let eyeshadowblink_in = bowl_nailpolish.getChildByName("eyeshadowblink_in");
                this.zorder = this.zorder + 1;
                bowl_eyeshadowblink.zIndex = this.zorder;
                eyeshadowblink_in.runAction(cc.sequence(cc.fadeOut(4.0), cc.callFunc(()=>{
                    eyeshadowblink_spoon.targetOff(this);
                    cc.audioEngine.stopEffect(this.leftSoundIndex);
                    cc.audioEngine.stopEffect(this.rightSoundIndex);
                    bowl_nailpolish.getChildByName("eyeshadowblink_bowl_p").active = false;
                    eyeshadowblink_spoon.parent.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(1000, 0)), cc.hide()));
                    this.doStep(bowlNode.parent.name);

                })));
                cc.director.getActionManager().pauseTarget(bowl_eyeshadowblink);
                cc.director.getActionManager().pauseTarget(eyeshadowblink_spoon);
                cc.director.getActionManager().pauseTarget(eyeshadowblink_in);

            })));
        })));
    }

    eyeshadowblinkTouch(event: cc.Event.EventTouch){
        this.isTouchToolBool = true;
        console.log("eyeshadowblinkTouch");
        
        let lipsticknode:cc.Node = event.target;
        let eyeshadowblink_spoon = lipsticknode.parent.getChildByName("eyeshadowblink_spoon");
        let eyeshadowblink_bowl_p = lipsticknode.parent.getChildByName("eyeshadowblink_bowl_p");
        let eyeshadowblink_in = lipsticknode.parent.getChildByName("eyeshadowblink_in");

        let bowl_eyeshadowblink = lipsticknode.parent.parent.getChildByName("bowl_mix").getChildByName("bowl_eyeshadowblink");

        cc.director.getActionManager().resumeTarget(bowl_eyeshadowblink);
        cc.director.getActionManager().resumeTarget(eyeshadowblink_spoon);
        cc.director.getActionManager().resumeTarget(eyeshadowblink_in);

        eyeshadowblink_bowl_p.active = true;

        let topParent = lipsticknode.parent.parent.parent;

        if(topParent.name == "bowl_l_content"){

            this.leftSoundIndex = cc.audioEngine.playEffect(this.power, true);

        }
        if(topParent.name == "bowl_r_content"){

            this.rightSoundIndex = cc.audioEngine.playEffect(this.power, true);

        }
        
    }
    leftSoundIndex = -1;
    rightSoundIndex = -1;

    eyeshadowblinkEnd(event: cc.Event.EventTouch){
        this.isTouchToolBool = false;
        let lipsticknode:cc.Node = event.target;
        let eyeshadowblink_spoon = lipsticknode.parent.getChildByName("eyeshadowblink_spoon");
        let eyeshadowblink_bowl_p = lipsticknode.parent.getChildByName("eyeshadowblink_bowl_p");
        let eyeshadowblink_in = lipsticknode.parent.getChildByName("eyeshadowblink_in");

        let bowl_eyeshadowblink = lipsticknode.parent.parent.getChildByName("bowl_mix").getChildByName("bowl_eyeshadowblink");

        cc.director.getActionManager().pauseTarget(bowl_eyeshadowblink);
        cc.director.getActionManager().pauseTarget(eyeshadowblink_spoon);
        cc.director.getActionManager().pauseTarget(eyeshadowblink_in);
        eyeshadowblink_bowl_p.active = false;

        let topParent = lipsticknode.parent.parent.parent;

        if(topParent.name == "bowl_l_content"){
            cc.audioEngine.stopEffect(this.leftSoundIndex);
            cc.audioEngine.stopEffect(this.leftSoundIndex);
            cc.audioEngine.stopEffect(this.rightSoundIndex);
        }
        if(topParent.name == "bowl_r_content"){
            cc.audioEngine.stopEffect(this.rightSoundIndex);
            cc.audioEngine.stopEffect(this.leftSoundIndex);
            cc.audioEngine.stopEffect(this.rightSoundIndex);
        }
    }
    doeyeshadow(lipsticknode:cc.Node, bowlNode:cc.Node){

        let bowl_nailpolish = bowlNode.getChildByName("eyeshadow_bowl");

        let pos = bowl_nailpolish.convertToWorldSpaceAR(cc.v2(0, 0));
        let pos1 = lipsticknode.parent.convertToNodeSpaceAR(pos);

        lipsticknode.runAction(cc.sequence(cc.jumpTo(0.5, pos1, 50, 1), cc.callFunc(()=>{

            lipsticknode.active = false;
            bowl_nailpolish.active = true;
            this.zorder = this.zorder + 1;
            bowl_nailpolish.zIndex = this.zorder;
            
            //lipsticknode.on(cc.Node.EventType.TOUCH_START,this.lipsticknodeTouch,this);
            let eyeshadowblink_spoon = bowl_nailpolish.getChildByName("eyeshadow_spoon");
            let pos = eyeshadowblink_spoon.position;
            eyeshadowblink_spoon.position = cc.v2(0, 1500);
            eyeshadowblink_spoon.active = true;
            
            eyeshadowblink_spoon.runAction(cc.sequence(cc.jumpTo(0.5, pos, 50, 1), cc.callFunc(()=>{

                eyeshadowblink_spoon.on(cc.Node.EventType.TOUCH_START,this.eyeshadowTouch,this);
                eyeshadowblink_spoon.on(cc.Node.EventType.TOUCH_CANCEL,this.eyeshadowEnd,this);
                eyeshadowblink_spoon.on(cc.Node.EventType.TOUCH_END,this.eyeshadowEnd,this);
                
                eyeshadowblink_spoon.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.25, cc.v2(7, 7)),cc.moveBy(0.25, cc.v2(-7, -7)))));

                let bowl_eyeshadowblink = bowlNode.getChildByName("bowl_mix").getChildByName("bowl_eyeshadow");
                bowl_eyeshadowblink.active = true;
                bowl_eyeshadowblink.scale = 0;

                bowl_eyeshadowblink.runAction(cc.sequence(cc.scaleTo(4.0, 1.0), cc.callFunc(()=>{

                })));

                let eyeshadowblink_in = bowl_nailpolish.getChildByName("eyeshadow_in");
                this.zorder = this.zorder + 1;
                bowl_eyeshadowblink.zIndex = this.zorder;
                eyeshadowblink_in.runAction(cc.sequence(cc.fadeOut(4.0), cc.callFunc(()=>{
                    eyeshadowblink_spoon.targetOff(this);
                    cc.audioEngine.stopEffect(this.leftSoundIndexeye);
                    cc.audioEngine.stopEffect(this.rightSoundIndexeye);
                    bowl_nailpolish.getChildByName("eyeshadow_p").active = false;
                    eyeshadowblink_spoon.parent.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(1000, 0)), cc.hide()));

                    this.doStep(bowlNode.parent.name);
                    
                })));
                cc.director.getActionManager().pauseTarget(bowl_eyeshadowblink);
                cc.director.getActionManager().pauseTarget(eyeshadowblink_spoon);
                cc.director.getActionManager().pauseTarget(eyeshadowblink_in);

            })));
        })));
    }
    leftSoundIndexeye = 0;
    rightSoundIndexeye = 0;
    eyeshadowTouch(event: cc.Event.EventTouch){

        console.log("eyeshadowblinkTouch");
        
        let lipsticknode:cc.Node = event.target;
        let eyeshadowblink_spoon = lipsticknode.parent.getChildByName("eyeshadow_spoon");
        let eyeshadowblink_bowl_p = lipsticknode.parent.getChildByName("eyeshadow_p");
        let eyeshadowblink_in = lipsticknode.parent.getChildByName("eyeshadow_in");

        let bowl_eyeshadowblink = lipsticknode.parent.parent.getChildByName("bowl_mix").getChildByName("bowl_eyeshadow");

        cc.director.getActionManager().resumeTarget(bowl_eyeshadowblink);
        cc.director.getActionManager().resumeTarget(eyeshadowblink_spoon);
        cc.director.getActionManager().resumeTarget(eyeshadowblink_in);

        eyeshadowblink_bowl_p.active = true;

        let topParent = lipsticknode.parent.parent.parent;

        if(topParent.name == "bowl_l_content"){

            this.leftSoundIndexeye = cc.audioEngine.playEffect(this.power, true);

        }
        if(topParent.name == "bowl_r_content"){

            this.rightSoundIndexeye = cc.audioEngine.playEffect(this.power, true);

        }
        
    }
 

    eyeshadowEnd(event: cc.Event.EventTouch){

        let lipsticknode:cc.Node = event.target;
        let eyeshadowblink_spoon = lipsticknode.parent.getChildByName("eyeshadow_spoon");
        let eyeshadowblink_bowl_p = lipsticknode.parent.getChildByName("eyeshadow_p");
        let eyeshadowblink_in = lipsticknode.parent.getChildByName("eyeshadow_in");

        let bowl_eyeshadowblink = lipsticknode.parent.parent.getChildByName("bowl_mix").getChildByName("bowl_eyeshadow");

        cc.director.getActionManager().pauseTarget(bowl_eyeshadowblink);
        cc.director.getActionManager().pauseTarget(eyeshadowblink_spoon);
        cc.director.getActionManager().pauseTarget(eyeshadowblink_in);
        eyeshadowblink_bowl_p.active = false;

        let topParent = lipsticknode.parent.parent.parent;

        if(topParent.name == "bowl_l_content"){
            cc.audioEngine.stopEffect(this.leftSoundIndexeye);
            cc.audioEngine.stopEffect(this.leftSoundIndexeye);
                    cc.audioEngine.stopEffect(this.rightSoundIndexeye);
        }
        if(topParent.name == "bowl_r_content"){
            cc.audioEngine.stopEffect(this.rightSoundIndexeye);
            cc.audioEngine.stopEffect(this.leftSoundIndexeye);
                    cc.audioEngine.stopEffect(this.rightSoundIndexeye);
        }
    }

    stepLeft = 0; 
    stepRight = 0
    doStep(boolName){

        let tagName = boolName == "bowl_l_content" ? "blue" : "pink";
        
        if(tagName == "blue"){

            this.stepLeft = this.stepLeft + 1;

        }
        if(tagName == "pink"){

            this.stepRight = this.stepRight + 1;

        }
        console.log(this.stepLeft + "----" + this.stepRight);
        
        if(this.stepLeft == 2 && this.stepRight == 2){

            //是否是第一次
            let isFirst =  cc.sys.localStorage.getItem("isFirst");
            if(isFirst == "isFirst"){
                cc.sys.localStorage.setItem("isFirst", "isFirst");
                //显示下一步按钮

                let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next");
                btn_next.active = true;
                btn_next.scale = 0;

                btn_next.runAction(cc.scaleTo(1.0, 1.0));

            }
            cc.sys.localStorage.setItem("isFirst", "isFirst");

        }

        if((this.stepRight + this.stepLeft) % 2 == 0){

            TipManager.getInstance().jumpTips();
        }

        if(this.stepRight + this.stepLeft >= 15){

            let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next");
            btn_next.active = false;
            this.showNextBigStep();
        }

    }

    touchNext(event){
        var node = event.target;
        node.getComponent(cc.Button).interactable = false;
        if (node.getComponent(cc.AudioSource)) {
            node.getComponent(cc.AudioSource).play();
        }
        let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next");
        btn_next.active = false;
        this.showNextBigStep()

    }

    isJumpNextStep = false;

    showNextBigStep(){

        if(this.isJumpNextStep)
            return;

        this.isJumpNextStep = true;    

        let array = ["bowl_l_content", "bowl_r_content"];
        
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let moveNode = CocosHelper.findNode(cc.Canvas.instance.node, element);
            for (const iterator of moveNode.children) {
                
                if(iterator.name != "bowl"){

                    iterator.runAction(cc.fadeOut(1.0));
                    if(iterator.getComponent(SpriteDrag))
                    iterator.getComponent(SpriteDrag).enabled = false;
                }else{


                    iterator.runAction(cc.moveBy(1.0, cc.v2(0, 60)));

                    let hand = iterator.getChildByName("bowl_hand");
                    hand.active = true;
                    hand.position = cc.v2(0, -500);

                    hand.runAction(cc.sequence(cc.delayTime(1.0), cc.moveTo(1.0, cc.v2(-8, -175)), cc.callFunc(()=>{

                        if(moveNode.name == "bowl_l_content"){

                            //开始
                            this.handLeft();
                            this.handRight();
                        }

                    })));
                }
                
            }
        
        }
    }

    handLeft(){

        let moveNode = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_l_content");
        let bowl = moveNode.getChildByName("bowl");
        let hand = bowl.getChildByName("bowl_hand");

        
        let blenderMix : cc.FiniteTimeAction[] = [];
        let sp = hand.getComponent(cc.Sprite);
        for(let s of this.mixBlenderAnimation){
            blenderMix.push(cc.callFunc(function(){
                sp.spriteFrame = s;
            }));
            blenderMix.push(cc.delayTime(0.45));
        }
        let _blendaction = cc.repeatForever(cc.sequence(blenderMix));
        hand.runAction(_blendaction);


        hand.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1.0, cc.v2(0, 10)), cc.moveBy(1.0, cc.v2(0, -10)))));
        cc.director.getActionManager().pauseTarget(hand);
 
        let bowl_in = bowl.getChildByName("bowl_mix");
        let s1 = cc.scaleTo(0.7,1,0.95);
        let s2 = cc.scaleTo(0.7,0.95,1.08);
        //  let s3 = cc.scaleTo(0.2,1.0,1.0);
        let _mixAction = cc.repeatForever(cc.sequence(s1,s2));
        bowl_in.runAction(_mixAction);
        cc.director.getActionManager().pauseTarget(bowl_in);   

        hand.on(cc.Node.EventType.TOUCH_START,()=>{

            cc.director.getActionManager().resumeTarget(hand);
            cc.director.getActionManager().resumeTarget(bowl_in);

            bowl_in.getComponent(MixComponent).startMix();

        },this);
        hand.on(cc.Node.EventType.TOUCH_CANCEL,()=>{
            cc.director.getActionManager().pauseTarget(hand);
            cc.director.getActionManager().pauseTarget(bowl_in); 
            bowl_in.getComponent(MixComponent).stopMix();
        },this);
        hand.on(cc.Node.EventType.TOUCH_END,()=>{
            cc.director.getActionManager().pauseTarget(hand);
            cc.director.getActionManager().pauseTarget(bowl_in); 
            bowl_in.getComponent(MixComponent).stopMix();
        },this);
        
    }

    
    
    handRight(){

        let moveNode = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_r_content");
        let bowl = moveNode.getChildByName("bowl");
        let hand = bowl.getChildByName("bowl_hand");

        
        let blenderMix : cc.FiniteTimeAction[] = [];
        let sp = hand.getComponent(cc.Sprite);
        for(let s of this.mixBlenderAnimation){
            blenderMix.push(cc.callFunc(function(){
                sp.spriteFrame = s;
            }));
            blenderMix.push(cc.delayTime(0.45));
        }
        let _blendaction = cc.repeatForever(cc.sequence(blenderMix));
        hand.runAction(_blendaction);


        hand.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1.0, cc.v2(0, 10)), cc.moveBy(1.0, cc.v2(0, -10)))));
        cc.director.getActionManager().pauseTarget(hand);
 
        let bowl_in = bowl.getChildByName("bowl_mix");
        let s1 = cc.scaleTo(0.7,1,0.95);
        let s2 = cc.scaleTo(0.7,0.95,1.08);
        //  let s3 = cc.scaleTo(0.2,1.0,1.0);
        let _mixAction = cc.repeatForever(cc.sequence(s1,s2));
        bowl_in.runAction(_mixAction);
        cc.director.getActionManager().pauseTarget(bowl_in);   

        hand.on(cc.Node.EventType.TOUCH_START,()=>{

            cc.director.getActionManager().resumeTarget(hand);
            cc.director.getActionManager().resumeTarget(bowl_in);

            bowl_in.getComponent(MixComponent).startMix();

        },this);
        hand.on(cc.Node.EventType.TOUCH_CANCEL,()=>{
            cc.director.getActionManager().pauseTarget(hand);
            cc.director.getActionManager().pauseTarget(bowl_in); 
            bowl_in.getComponent(MixComponent).stopMix();
        },this);
        hand.on(cc.Node.EventType.TOUCH_END,()=>{
            cc.director.getActionManager().pauseTarget(hand);
            cc.director.getActionManager().pauseTarget(bowl_in); 
            bowl_in.getComponent(MixComponent).stopMix();
        },this);
        
    }

    mixIndex = 0;
    mixEndRight(){

        let moveNode = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_r_content");
        let bowl = moveNode.getChildByName("bowl");
        let hand = bowl.getChildByName("bowl_hand");
        let bowl_in = bowl.getChildByName("bowl_mix");
        bowl_in.getComponent(MixComponent).stopMix();
        hand.targetOff(this);
        hand.stopAllActions();
        bowl_in.stopAllActions();
        bowl_in.scale = 1;
        hand.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(0, -1000)), cc.hide()));

        TipManager.getInstance().jumpTips();
        this.mixIndex = this.mixIndex + 1;
        if(this.mixIndex == 2){
            this.mixIndex = 2000;
            this.makeOver();

        }
    }
    mixEndLeft(){

        let moveNode = CocosHelper.findNode(cc.Canvas.instance.node, "bowl_l_content");
        let bowl = moveNode.getChildByName("bowl");
        let hand = bowl.getChildByName("bowl_hand");
        let bowl_in = bowl.getChildByName("bowl_mix");
        bowl_in.getComponent(MixComponent).stopMix();
        hand.targetOff(this);
        hand.stopAllActions();
        bowl_in.stopAllActions();
        bowl_in.scale = 1;
        hand.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(0, -1000)), cc.hide()));


        TipManager.getInstance().jumpTips();
        this.mixIndex = this.mixIndex + 1;
        if(this.mixIndex == 2){
            this.mixIndex = 2000;
            this.makeOver();

        }


    }

    makeOver(){

        let flowerHeart = CocosHelper.findNode(cc.Canvas.instance.node, "flowerHeart");
        flowerHeart.active = true;
        flowerHeart.getComponent(cc.ParticleSystem).resetSystem();

        cc.audioEngine.playEffect(this.winAudio, false);


        setTimeout(() => {
            TransitionScene.changeScene("selectColorSceneMS");

        }, 2000);
    }


}
