import showLaoding from "../../common/common/Script/ads/showLaodingMS";
import NewDataCal from "./NewDataCalMS";

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
    touchPlayAgain(event, customEventData){
        var node = event.target;
        node.getComponent(cc.Button).interactable = false;
        if (node.getComponent(cc.AudioSource)) {
            node.getComponent(cc.AudioSource).play();
        }

        NewDataCal.getInstance().setBoolValue("blue", false);
        NewDataCal.getInstance().setBoolValue("pink", false);



        showLaoding.getInstance().showAds(false);
        showLaoding.getInstance().loadingDoneCallback = function () {

            console.log("广告关闭");
            showLaoding.getInstance().loadingDoneCallback = null;
            
            // cc.director.loadScene("makeScene");
            cc.director.loadScene("selectColorSceneMS");
        }
        
    }
    touchPlayNext(event, customEventData){
        var node = event.target;
        node.getComponent(cc.Button).interactable = false;
        if (node.getComponent(cc.AudioSource)) {
            node.getComponent(cc.AudioSource).play();
        }
        NewDataCal.getInstance().setBoolValue("blue", false);
        NewDataCal.getInstance().setBoolValue("pink", false);


        showLaoding.getInstance().showAds(false);
        showLaoding.getInstance().loadingDoneCallback = function () {

            console.log("广告关闭");
            showLaoding.getInstance().loadingDoneCallback = null;
            
            // cc.director.loadScene("makeScene");
            cc.director.loadScene("selectSceneMS");
        }
        
    }
    // update (dt) {}
}
