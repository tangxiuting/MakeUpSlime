import SlapController from "./SlapControllerMS";
import ClickController from "./ClickControllerMS";

import RubController from "./RubControllerMS";
import PlayController from "./PlayControllerMS";

import DragController1 from "./DragController1MS";
import showLaoding from "../common/common/Script/ads/showLaodingMS";
import TransitionScene from "../common/common/Script/codebase/TransitionSceneMS";
import NewDataCal from "./addNew/NewDataCalMS";
import { CocosHelper } from "../common/common/Script/codebase/utils/CocosHelperMS";

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
export default class PlaySlimesController extends cc.Component {
    onLoad() {
        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            this.node.getComponent(cc.AudioSource).play();
        }.bind(this))));
        for (let i = 1; i <= 5; i++){
            if (i == 1) {
                cc.find(`Canvas/playLayer${i}`).active = true;
                cc.find(`Canvas/btns/${i}/yes`).active = true;

            } else {
                cc.find(`Canvas/playLayer${i}`).active = false;
                cc.find(`Canvas/btns/${i}/yes`).active = false;
            }
        }
        setTimeout(() => {
            let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next");
            btn_next.active = true;
        }, 8000);

    }
    init() {
        cc.find('Canvas/playLayer1').getComponent(SlapController).init();
        cc.find('Canvas/playLayer2').getComponent(ClickController).init();
        cc.find('Canvas/playLayer3').getComponent(DragController1).init();
        cc.find('Canvas/playLayer4').getComponent(RubController).init();
        cc.find('Canvas/playLayer5').getComponent(PlayController).init();


        
    }
    btnClick(event) {
        let name = event.target.name;
        event.target.parent.getComponent(cc.AudioSource).play();
        cc.log(event.target.parent);
       
        for (let i = 1; i <= 5; i++){
            if (i == Number(name)) {
                cc.find(`Canvas/playLayer${i}`).active = true;
                cc.find(`Canvas/btns/${i}/yes`).active = true;

            } else {
                cc.find(`Canvas/playLayer${i}`).active = false;
                cc.find(`Canvas/btns/${i}/yes`).active = false;
            }
        }
        this.init();
        
    }
    touchNextBtn(event, data) {
        let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next");
        btn_next.active = false;
        //data blue pink
        if(data == "blue"){


            NewDataCal.getInstance().setBoolValue("blue", true);

        }
        if(data == "pink"){


            NewDataCal.getInstance().setBoolValue("pink", true);

        }
        let isPlayBlue = NewDataCal.getInstance().getBoolValue("blue");
        let isPlayPink = NewDataCal.getInstance().getBoolValue("pink");

       
        if(isPlayBlue && isPlayPink){

            NewDataCal.getInstance().showUI();

        }else{

            showLaoding.getInstance().loadingDoneCallback = function () {
                showLaoding.getInstance().loadingDoneCallback = null;
                TransitionScene.changeScene('selectColorSceneMS');
            }
            //显示全屏广告
            showLaoding.getInstance().showAds(false);

        }

        // showLaoding.getInstance().loadingDoneCallback = function () {
        //     showLaoding.getInstance().loadingDoneCallback = null;
        //     TransitionScene.changeScene('packSlime',7);
        // }
        // //显示全屏广告
        // showLaoding.getInstance().showAds(false);
       
    }
}
