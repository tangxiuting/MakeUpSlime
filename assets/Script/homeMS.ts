import showLaoding from "../common/common/Script/ads/showLaodingMS";
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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        DataConfig.getInstance().playMusic();

        if(CC_JSB && !CC_PREVIEW){

            
            jsToCPP.getInstance().setEmailContentAndTitle("Makeup Slime", " Check outmy makeup slime. So many makeups to add into the slime and crazy rainbow slime fun. Let's play together.");

        }
        

        // cosmetics6
        let cosmetics6 = CocosHelper.findNode(cc.Canvas.instance.node, "cosmetics6");
        cosmetics6.active = true;
        cosmetics6.opacity = 0;

        cosmetics6.runAction(cc.sequence(cc.fadeIn(1.5),cc.callFunc(()=>{

            let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
            bowl.active = true;
            let moveInCm  = bowl.getComponent(MoveIn);
            moveInCm.enabled = true;
            moveInCm.actionCallBack = ()=>{


                this.show1();

            };

        })));
    }

    show1(){

        for (let index = 0; index < 6; index++) {
            const element = "cosmetics" + index;
            let elementNode = CocosHelper.findNode(cc.Canvas.instance.node, element);
            elementNode.active = true;
            let moveInCm  = elementNode.getComponent(MoveIn);
            moveInCm.delayTime = index * 0.75;
            moveInCm.enabled = true;
            moveInCm.actionCallBack = ()=>{

                if(index == 5){

                    this.show2();

                }


            };

        }


    }
    show2(){

        let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
        let bowl_slime_ = bowl.getChildByName("bowl_slime_");
        let slime1 = bowl.getChildByName("slime1");
        bowl_slime_.active = true;
        bowl_slime_.opacity = 0;

        slime1.active = true;
        slime1.opacity = 0;

        bowl_slime_.runAction(cc.sequence(cc.fadeIn(1.5),cc.callFunc(()=>{
            this.show3();
        })));
        slime1.runAction(cc.sequence(cc.delayTime(1.0),cc.fadeIn(1.5),cc.callFunc(()=>{

        })));
    }
    show3(){

        let logo = CocosHelper.findNode(cc.Canvas.instance.node, "logo");
        logo.active = true;
        let moveInCm  = logo.getComponent(MoveIn);
        moveInCm.enabled = true;
        moveInCm.actionCallBack = ()=>{

            logo.runAction(cc.repeatForever(cc.sequence(cc.moveBy(2.0, cc.v2(0, 10)),cc.moveBy(2.0, cc.v2(0, -10)))));
            let play = CocosHelper.findNode(cc.Canvas.instance.node, "play");
            play.active = true;
            let moveInCm  = play.getComponent(MoveIn);
            moveInCm.enabled = true;
            moveInCm.actionCallBack = ()=>{
                
            };
        };

        
    }
    touchPlay(event, customEventData){
        var node = event.target;
        node.getComponent(cc.Button).interactable = false;
        if (node.getComponent(cc.AudioSource)) {
            node.getComponent(cc.AudioSource).play();
        }
        showLaoding.getInstance().showAds(false);
        showLaoding.getInstance().loadingDoneCallback = function () {

            console.log("广告关闭");
            showLaoding.getInstance().loadingDoneCallback = null;
            DataConfig.getInstance().setIsHome("111");
            // cc.director.loadScene("makeScene");
            cc.director.loadScene("selectSceneMS");
        }
        
    }

    touchUrl(){
        
        if(CC_JSB && !CC_PREVIEW){

            console.log("https://www.crazycampmedia.com/privacys/");
            
            jsToCPP.getInstance().openUrl("http://www.fungalaxymedia.com/privacys/");


        }
            
    }
    touchMore(){
        console.log("touchMore");
        if(CC_JSB && !CC_PREVIEW){

            jsToCPP.getInstance().showMoreGame();


        }
            
    }
    // update (dt) {}
}
