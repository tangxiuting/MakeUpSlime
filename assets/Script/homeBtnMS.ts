import DataConfig from "./DataConfigMS";
import showLaoding from "../common/common/Script/ads/showLaodingMS";

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



    }

    touchHome(){

        showLaoding.getInstance().showAds(false);
        showLaoding.getInstance().loadingDoneCallback = function () {

            console.log("广告关闭");
            showLaoding.getInstance().loadingDoneCallback = null;
            
            // cc.director.loadScene("makeScene");
            cc.director.loadScene("homeSceneMS");
        }

        // DataConfig.getInstance().setIsHome("");
        // cc.director.loadScene("makeScene");
        //cc.director.loadScene("chooseScene");
    }

    // update (dt) {}
}
