import { CocosHelper } from "../common/common/Script/codebase/utils/CocosHelperMS";
import DataConfig from "./DataConfigMS";
import MoveComponent from "../common/common/Script/CombinedComponent/MoveComponentMS";
import { ShowDirection } from "../common/common/Script/compoent/MoveInMS";
import ShaderHelper from "./tool/components/ShaderHelperMS";
import ShaderTime from "./tool/components/ShaderTimeMS";
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
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    @property(cc.AudioClip)
    flyAudio: cc.SpriteFrame = null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.AudioClip)
    done: cc.SpriteFrame = null;
    @property(cc.AudioClip)
    touch: cc.SpriteFrame = null;
    @property(cc.AudioClip)
    touchHandTopBeginAudio: cc.SpriteFrame = null;
    
    // onLoad () {}

    start () {
        DataConfig.getInstance().playMusic();

        let showContent = CocosHelper.findNode(cc.Canvas.instance.node, "showContent");
        ;
        showContent.active = true;
        showContent.zIndex = 100;
        showContent.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(DataConfig.getInstance().getPageTexture());

        showContent.getComponent(ShaderHelper).enabled = true;

        showContent.getComponent(ShaderTime).enabled = true;


        let array = ["plate_slime0", "plate_slime1" ,"plate_slime2"];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let plate_slime = CocosHelper.findNode(cc.Canvas.instance.node, element);

            let node = new cc.Node();
            node.parent = plate_slime;

            let sp = node.addComponent(cc.Sprite);
            sp.spriteFrame = new cc.SpriteFrame(DataConfig.getInstance().getTexture());

        }
        let touchLeft = CocosHelper.findNode(cc.Canvas.instance.node, "touchLeft");
        let touchRight = CocosHelper.findNode(cc.Canvas.instance.node, "touchRight");

        touchLeft.on(cc.Node.EventType.TOUCH_MOVE,this.touchLeftMove,this);
        let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");

        setTimeout(() => {
            CocosHelper.showHand(finger, touchLeft, touchLeft, touchRight);
        }, 1000);

    }

    touchLeftMove(event:cc.Event.EventTouch){

        let detal = event.getDelta();
        let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
        let touchRight = CocosHelper.findNode(cc.Canvas.instance.node, "touchRight");
        finger.stopAllActions();
        finger.active = false;
        if(detal.x > 0){

            cc.audioEngine.playEffect(this.touch, false);

            let touchLeft = CocosHelper.findNode(cc.Canvas.instance.node, "touchLeft");
            touchLeft.off(cc.Node.EventType.TOUCH_MOVE,this.touchLeftMove,this)

            let plate_slime1_ = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime1_");
            plate_slime1_.active = true;
            let plate_slime0 = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime0");
            plate_slime0.active = false;
            let plate_slime1 = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime1");
            plate_slime1.active = true;
            CocosHelper.showHand(finger, touchRight, touchRight, touchLeft);

            touchRight.on(cc.Node.EventType.TOUCH_MOVE,this.touchRightMove,this);

        }

    }
    touchRightMove(event){

        let detal = event.getDelta();
        let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
        let touchRight = CocosHelper.findNode(cc.Canvas.instance.node, "touchRight");
        finger.stopAllActions();

        if(detal.x < 0){
            cc.audioEngine.playEffect(this.touch, false);
            let touchLeft = CocosHelper.findNode(cc.Canvas.instance.node, "touchLeft");
            touchRight.off(cc.Node.EventType.TOUCH_MOVE,this.touchRightMove,this)

            let plate_slime1_ = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime2_");
            plate_slime1_.active = true;
            let plate_slime0 = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime1");
            plate_slime0.active = false;
            let plate_slime1 = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime2");
            plate_slime1.active = true;
            
            let plate_pull_in = CocosHelper.findNode(cc.Canvas.instance.node, "plate_pull_in");
            let moveCom = plate_pull_in.getComponent(MoveComponent);

            let array = [];
            for (let index = 3; index < 7; index++) {
                let element = "makeupms/slime/plate_slime" + index;
                element = (index == 5 || index == 6) ? element + "_1" : element;

                array.push(element);
                
            }
            let self = this;
            cc.loader.loadResArray(array, cc.SpriteFrame, function (err, sps) {
                
                if(err){

                    console.log(err + "");
                    return;
                    
                }
                moveCom.setMixPahth(sps);
                
                console.log("showHand");
                
                self.showHand();

            })
        }
    }

    private handShow = false;
    showHand(){
        if(this.handShow)
            return;
        this.handShow = true;    

        let hand_move = CocosHelper.findNode(cc.Canvas.instance.node, "hand_move");
        
        // cc.audioEngine.playEffect(this.flyAudio, false);
        hand_move.active = true;
        // CocosHelper.showBackOut(hand_move, ShowDirection.bottom, ()=>{

            
        // });
        hand_move.on(cc.Node.EventType.TOUCH_START,this.touchHandBegin,this);
        hand_move.on(cc.Node.EventType.TOUCH_MOVE,this.touchHandMove,this);
        hand_move.on(cc.Node.EventType.TOUCH_END,this.touchHandEnd,this);
        hand_move.on(cc.Node.EventType.TOUCH_CANCEL,this.touchHandCancle,this);

        //let hand_move = CocosHelper.findNode(cc.Canvas.instance.node, "hand_move");
        let slime_hand_r = hand_move.getChildByName("slime_hand_r");
        let slime_hand_r1 = hand_move.getChildByName("slime_hand_r1");
        let slime_hand_l1 = hand_move.getChildByName("slime_hand_l1");
        let slime_hand_l = hand_move.getChildByName("slime_hand_l");
        
        slime_hand_r.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(-20, 20)),cc.moveBy(0.5, cc.v2(0, -20)),cc.moveBy(0.5, cc.v2(20, 0)))));
        slime_hand_r1.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(-20, 20)),cc.moveBy(0.5, cc.v2(0, -20)),cc.moveBy(0.5, cc.v2(20, 0)))));
        slime_hand_l1.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(20, 20)),cc.moveBy(0.5, cc.v2(0, -20)),cc.moveBy(0.5, cc.v2(-20, 0)))));
        slime_hand_l.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(20, 20)),cc.moveBy(0.5, cc.v2(0, -20)),cc.moveBy(0.5, cc.v2(-20, 0)))));
        //hand_move.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(0, 20)),cc.moveBy(0.5, cc.v2(0, -20)))));
        cc.director.getActionManager().pauseTarget(slime_hand_r);
        cc.director.getActionManager().pauseTarget(slime_hand_r1);
        cc.director.getActionManager().pauseTarget(slime_hand_l1);
        cc.director.getActionManager().pauseTarget(slime_hand_l);
        let plate_pull_in = CocosHelper.findNode(cc.Canvas.instance.node, "plate_pull_in");
        var timeScale = 5.2;
        var scaleRatio = this.node.scale;
        var scale0 = cc.scaleTo(0.11*timeScale,scaleRatio*0.82,scaleRatio);
        var scale1 = cc.scaleTo(0.1*timeScale,scaleRatio,scaleRatio*0.86);
        var scale2 = cc.scaleTo(0.09*timeScale,scaleRatio*0.88,scaleRatio);
        var scale3 = cc.scaleTo(0.08*timeScale,scaleRatio,scaleRatio*0.89);
        var scale4 = cc.scaleTo(0.07*timeScale,scaleRatio);
        var call = cc.callFunc(function () {
        // console.log(self.actionCallBack);
            
        }, this);
        var seq = cc.sequence(scale0,scale1,scale2,scale3,scale4,call);
        plate_pull_in.runAction(cc.repeatForever(seq));
        cc.director.getActionManager().pauseTarget(plate_pull_in);
    }
    touchHandBegin(){

        console.log("touchHandBegin");
        
        let hand_move = CocosHelper.findNode(cc.Canvas.instance.node, "hand_move");
        
        let plate_pull_in = CocosHelper.findNode(cc.Canvas.instance.node, "plate_pull_in");
        let moveCom = plate_pull_in.getComponent(MoveComponent);
        moveCom.enabled = true;
    }
    private sound = -1;
    soundIndex = -1;
    touchHandMove(event:cc.Event.EventTouch){
        let hand_move = CocosHelper.findNode(cc.Canvas.instance.node, "hand_move");
        
        let plate_pull_in = CocosHelper.findNode(cc.Canvas.instance.node, "plate_pull_in");
        let moveCom = plate_pull_in.getComponent(MoveComponent);
        let detal = event.getDelta();
        if(Math.abs(detal.x) > 0 || Math.abs(detal.y) > 0){
            if(this.sound == -1){
                console.log("detal.x");
                this.sound = 0;
                moveCom.startMix();
                cc.director.getActionManager().resumeTarget(hand_move);
                cc.director.getActionManager().resumeTarget(plate_pull_in);
                let slime_hand_r = hand_move.getChildByName("slime_hand_r");
                let slime_hand_r1 = hand_move.getChildByName("slime_hand_r1");
                let slime_hand_l1 = hand_move.getChildByName("slime_hand_l1");
                let slime_hand_l = hand_move.getChildByName("slime_hand_l");
                //hand_move.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(0, 20)),cc.moveBy(0.5, cc.v2(0, -20)))));
                cc.director.getActionManager().resumeTarget(slime_hand_r);
                cc.director.getActionManager().resumeTarget(slime_hand_r1);
                cc.director.getActionManager().resumeTarget(slime_hand_l1);
                cc.director.getActionManager().resumeTarget(slime_hand_l);
                setTimeout(() => {
                    this.sound = -1;
                }, 1000);

                

            }
        }else{
            this.sound = -1;
            moveCom.stopMix();
            cc.director.getActionManager().pauseTarget(hand_move);
            cc.director.getActionManager().pauseTarget(plate_pull_in);
            let slime_hand_r = hand_move.getChildByName("slime_hand_r");
                let slime_hand_r1 = hand_move.getChildByName("slime_hand_r1");
                let slime_hand_l1 = hand_move.getChildByName("slime_hand_l1");
                let slime_hand_l = hand_move.getChildByName("slime_hand_l");
                //hand_move.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(0, 20)),cc.moveBy(0.5, cc.v2(0, -20)))));
                cc.director.getActionManager().pauseTarget(slime_hand_r);
                cc.director.getActionManager().pauseTarget(slime_hand_r1);
                cc.director.getActionManager().pauseTarget(slime_hand_l1);
                cc.director.getActionManager().pauseTarget(slime_hand_l);
        }
    }
    touchHandEnd(){
        this.sound = -1;
        let hand_move = CocosHelper.findNode(cc.Canvas.instance.node, "hand_move");
        
        console.log("touchHandEnd");
        let plate_pull_in = CocosHelper.findNode(cc.Canvas.instance.node, "plate_pull_in");
        let moveCom = plate_pull_in.getComponent(MoveComponent);
        moveCom.stopMix();
        cc.director.getActionManager().pauseTarget(hand_move);
        cc.director.getActionManager().pauseTarget(plate_pull_in);
        let slime_hand_r = hand_move.getChildByName("slime_hand_r");
        let slime_hand_r1 = hand_move.getChildByName("slime_hand_r1");
        let slime_hand_l1 = hand_move.getChildByName("slime_hand_l1");
        let slime_hand_l = hand_move.getChildByName("slime_hand_l");
        //hand_move.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(0, 20)),cc.moveBy(0.5, cc.v2(0, -20)))));
        cc.director.getActionManager().pauseTarget(slime_hand_r);
        cc.director.getActionManager().pauseTarget(slime_hand_r1);
        cc.director.getActionManager().pauseTarget(slime_hand_l1);
        cc.director.getActionManager().pauseTarget(slime_hand_l);
    }
    touchHandCancle(){
        this.sound = -1;
        let hand_move = CocosHelper.findNode(cc.Canvas.instance.node, "hand_move");
        
        let plate_pull_in = CocosHelper.findNode(cc.Canvas.instance.node, "plate_pull_in");
        let moveCom = plate_pull_in.getComponent(MoveComponent);
        cc.director.getActionManager().pauseTarget(hand_move);
        cc.director.getActionManager().pauseTarget(plate_pull_in);
        moveCom.stopMix();
        let slime_hand_r = hand_move.getChildByName("slime_hand_r");
        let slime_hand_r1 = hand_move.getChildByName("slime_hand_r1");
        let slime_hand_l1 = hand_move.getChildByName("slime_hand_l1");
        let slime_hand_l = hand_move.getChildByName("slime_hand_l");
        //hand_move.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(0, 20)),cc.moveBy(0.5, cc.v2(0, -20)))));
        cc.director.getActionManager().pauseTarget(slime_hand_r);
        cc.director.getActionManager().pauseTarget(slime_hand_r1);
        cc.director.getActionManager().pauseTarget(slime_hand_l1);
        cc.director.getActionManager().pauseTarget(slime_hand_l);
        
    }
    MixEnd(){

        let plate_pull_in = CocosHelper.findNode(cc.Canvas.instance.node, "plate_pull_in");

        plate_pull_in.stopAllActions();
        plate_pull_in.runAction(cc.scaleTo(0.2, 1.0));

        let hand_move = CocosHelper.findNode(cc.Canvas.instance.node, "hand_move");
        hand_move.stopAllActions();
        hand_move.runAction(cc.moveTo(0.2, cc.v2(0, -80)));

        let slime_hand_r = hand_move.getChildByName("slime_hand_r");
        let slime_hand_r1 = hand_move.getChildByName("slime_hand_r1");
        let slime_hand_l1 = hand_move.getChildByName("slime_hand_l1");
        let slime_hand_l = hand_move.getChildByName("slime_hand_l");

        slime_hand_r.stopAllActions();
        slime_hand_r1.stopAllActions();
        slime_hand_l1.stopAllActions();
        slime_hand_l.stopAllActions();

        slime_hand_r.runAction(cc.moveTo(0.2, cc.v2(201, -179)));
        slime_hand_r1.runAction(cc.moveTo(0.2, cc.v2(200, -199)));
        slime_hand_l1.runAction(cc.moveTo(0.2, cc.v2(-200, -205)));
        slime_hand_l.runAction(cc.moveTo(0.2, cc.v2(-202, -182)));

        hand_move.off(cc.Node.EventType.TOUCH_START,this.touchHandBegin,this);
        hand_move.off(cc.Node.EventType.TOUCH_MOVE,this.touchHandMove,this);
        hand_move.off(cc.Node.EventType.TOUCH_END,this.touchHandEnd,this);
        hand_move.off(cc.Node.EventType.TOUCH_CANCEL,this.touchHandCancle,this);

        hand_move.on(cc.Node.EventType.TOUCH_MOVE,this.touchHandTopMove,this);
        hand_move.on(cc.Node.EventType.TOUCH_START,this.touchHandTopBegin,this);
        hand_move.on(cc.Node.EventType.TOUCH_END,this.touchHandTopEnd,this);
        hand_move.on(cc.Node.EventType.TOUCH_CANCEL,this.touchHandTopEnd,this);

        this.hand_move_pos = hand_move.position;

        let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
        finger.active = true;
        
        let nodePos1 = finger.parent.convertToNodeSpaceAR(hand_move.convertToWorldSpaceAR(cc.v2(0, 0)));
        finger.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
                
            finger.setPosition(nodePos1);

        }),cc.moveBy(1.0, cc.v2(0, 100)),cc.callFunc(function () {
            
            finger.setPosition(cc.v2(1000, 1000000));

        }),cc.delayTime(1.0))));


    }

    hand_move_pos = cc.v2(0, 0);

    touchHandTopBegin(){

        if(this.isBegin)
            return;
        this.isBegin = true;

        if(this.isMove)
            return;
        cc.audioEngine.stopEffect(this.soundIndex);
        this.soundIndex = -1;
        let slime_hand_r = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r");
        let slime_hand_r1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r1");
        let slime_hand_l = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l");
        let slime_hand_l1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l1");
        slime_hand_r.active = false;
        slime_hand_l.active = false;

        slime_hand_r1.active = true;
        slime_hand_l1.active = true;

        let hand_move = CocosHelper.findNode(cc.Canvas.instance.node, "hand_move");
        hand_move.runAction(cc.scaleTo(0.2, 0.95));

        this.moveindex = 0;
    }

    moveindex = 0;
    private isMove = false;
    private isBegin = false;
    touchHandTopMove(event){
        let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
        finger.stopAllActions();
        finger.active = false;

        let detal = event.getDelta();

        if(this.isMove)
            return;

            if(this.soundIndex == -1){
                this.soundIndex = cc.audioEngine.playEffect(this.touchHandTopBeginAudio, true);


            }
        

        if(detal.y > 0){
            let slime_hand_r = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r");
            let slime_hand_r1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r1");
            let slime_hand_l = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l");
            let slime_hand_l1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l1");
            slime_hand_r.active = false;
            slime_hand_l.active = false;
    
            slime_hand_r1.active = true;
            slime_hand_l1.active = true;
            console.log(this.moveindex);
            
            this.moveindex = this.moveindex + 0.06;
            //this.moveindex = this.moveindex > 7.9 ? 7.9 : this.moveindex;
            if(this.moveindex > 7.9)
                return;
            let hand_move = CocosHelper.findNode(cc.Canvas.instance.node, "hand_move");
            // hand_move.position.y = hand_move.position.y + this.moveindex;

            // hand_move.setPosition(hand_move.getPosition().add(cc.v2(0, this.moveindex * 0.5)));

            let slime4_l = CocosHelper.findNode(cc.Canvas.instance.node, "slime4_l");
            let slime4_r = CocosHelper.findNode(cc.Canvas.instance.node, "slime4_r");

            slime4_l.scaleY = slime4_l.scaleY + this.moveindex / 350;
            slime4_r.scaleY = slime4_r.scaleY + this.moveindex / 350;

            let plate_pull_in = CocosHelper.findNode(cc.Canvas.instance.node, "plate_pull_in");
            plate_pull_in.scaleY = plate_pull_in.scaleY - this.moveindex / 1000;
            plate_pull_in.scaleX = plate_pull_in.scaleX + this.moveindex / 1000;

            // let slime_hand_r1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r1");
            // let slime_hand_l1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l1");
            slime_hand_r1.setPosition(slime_hand_r1.getPosition().add(cc.v2(0, this.moveindex * 0.65)));
            slime_hand_l1.setPosition(slime_hand_l1.getPosition().add(cc.v2(0, this.moveindex * 0.65)));
        }


    }

    touchEnd = false;
    touchHandTopEnd(){

        cc.audioEngine.stopEffect(this.soundIndex);
        this.soundIndex = -1;
        if(this.touchEnd)
            return;
        this.touchEnd = true;
        this.isMove = true;
        cc.audioEngine.stopEffect(this.soundIndex);
        this.soundIndex = -1;
        let isShowP = false;
        if(this.moveindex > 5)
            isShowP = true;

        let isShowMove = false;
        if(this.moveindex > 0.5)
            isShowMove = true;

        this.moveindex = 0;
        let hand_move = CocosHelper.findNode(cc.Canvas.instance.node, "hand_move");

        let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next");
        if(!btn_next.active){

            btn_next.active = true;

            CocosHelper.createShake(btn_next, 7);

        }

        // hand_move.runAction(cc.moveTo(0.5, this.hand_move_pos));

        if(!isShowMove){

            this.isMove = false;
                this.isBegin = false;
                this.touchEnd = false;
                let slime_hand_r = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r");
                let slime_hand_r1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r1");
                let slime_hand_l = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l");
                let slime_hand_l1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l1");
                slime_hand_r.active = true;
                slime_hand_l.active = true;
                slime_hand_r1.stopAllActions();
                slime_hand_l1.stopAllActions();
                slime_hand_r1.setPosition(cc.v2(200, -199));
                slime_hand_l1.setPosition(cc.v2(-200, -199));
                slime_hand_r1.active = false;
                slime_hand_l1.active = false;
                this.moveindex = 0;

            let slime4_l = CocosHelper.findNode(cc.Canvas.instance.node, "slime4_l");
            let slime4_r = CocosHelper.findNode(cc.Canvas.instance.node, "slime4_r");
            slime4_l.runAction(cc.scaleTo(0.05, 1.0, 0));
            slime4_r.runAction(cc.scaleTo(0.05, 1.0, 0));
            let plate_pull_in = CocosHelper.findNode(cc.Canvas.instance.node, "plate_pull_in");

            // let slime_hand_r1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r1");
            // let slime_hand_l1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l1");
            
            // slime_hand_r1.runAction(cc.moveTo(0.05, cc.v2(200, -199)));
            // slime_hand_l1.runAction(cc.moveTo(0.05, cc.v2(-200, -199)));

            return;
        }

        let slime4_l = CocosHelper.findNode(cc.Canvas.instance.node, "slime4_l");
        let slime4_r = CocosHelper.findNode(cc.Canvas.instance.node, "slime4_r");
        slime4_l.runAction(cc.scaleTo(0.35, 1.0, 0));
        slime4_r.runAction(cc.scaleTo(0.35, 1.0, 0));
        let plate_pull_in = CocosHelper.findNode(cc.Canvas.instance.node, "plate_pull_in");

        let slime_hand_r1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r1");
        let slime_hand_l1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l1");
        
        slime_hand_r1.runAction(cc.moveTo(0.35, cc.v2(200, -199)));
        slime_hand_l1.runAction(cc.moveTo(0.35, cc.v2(-200, -199)));
        var timeScale = 1.2;
        var scaleRatio = 1.0;
        var scale0 = cc.scaleTo(0.11*timeScale,scaleRatio*0.82,scaleRatio);
        var scale1 = cc.scaleTo(0.1*timeScale,scaleRatio,scaleRatio*0.86);
        var scale2 = cc.scaleTo(0.09*timeScale,scaleRatio*0.88,scaleRatio);
        var scale3 = cc.scaleTo(0.08*timeScale,scaleRatio,scaleRatio*0.89);
        var scale4 = cc.scaleTo(0.07*timeScale,scaleRatio);
        var call = cc.callFunc(function () {
        // console.log(self.actionCallBack);
            
        }, this);
        plate_pull_in.stopAllActions();
        // plate_pull_in.scale = 1.0;
        var seq = cc.sequence(scale0,scale1,scale2,scale3,scale4,call);
        plate_pull_in.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(()=>{

            let slime_hand_r = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r");
            let slime_hand_r1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_r1");
            let slime_hand_l = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l");
            let slime_hand_l1 = CocosHelper.findNode(cc.Canvas.instance.node, "slime_hand_l1");
            slime_hand_r.active = true;
            slime_hand_l.active = true;
            slime_hand_r1.stopAllActions();
            slime_hand_l1.stopAllActions();
            slime_hand_r1.setPosition(cc.v2(200, -199));
            slime_hand_l1.setPosition(cc.v2(-200, -199));
            slime_hand_r1.active = false;
            slime_hand_l1.active = false;
            this.moveindex = 0;
            if(isShowP){

                let decorateParticle = CocosHelper.findNode(cc.Canvas.instance.node, "decorateParticle");
                decorateParticle.active = true;
                decorateParticle.getComponent(cc.ParticleSystem).resetSystem();

                cc.audioEngine.playEffect(this.done, false);

                //增加
                if(this.touchEndNum % 2 == 0){

                    TipManager.getInstance().jumpTips();
                    
                }

                this.touchEndNum = this.touchEndNum + 1;

            }

        }), seq));
        setTimeout(() => {
            this.isMove = false;
            this.isBegin = false;
            this.touchEnd = false;
        }, 500);
    }

    touchEndNum = 0;

    touchNet(event){

        var node = event.target;
        node.getComponent(cc.Button).interactable = false;

        let width = cc.view.getVisibleSize().width;//   visibleRect.width;
        let height = cc.view.getVisibleSize().height;
            

        CocosHelper.captureNodeSize(cc.Canvas.instance.node, width, height).then((texture:cc.RenderTexture)=>{
        
            if(texture == null){
                
            }else {
                DataConfig.getInstance().setPageTexture(texture);
                cc.director.loadScene("play3SceneMS");
                
            }
        
        });

    }
    // update (dt) {}
}
