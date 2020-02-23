import { CocosHelper } from "../common/common/Script/codebase/utils/CocosHelperMS";
import ShaderHelper from "./tool/components/ShaderHelperMS";
import TransitionScene from "../common/common/Script/codebase/TransitionSceneMS";
import DataConfig from "./DataConfigMS";
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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property({type:[cc.SpriteFrame]})
    boomSp:cc.SpriteFrame[] = [];

    @property(cc.AudioClip)
    boom: cc.AudioClip = null;

    @property(cc.AudioClip)
    winAudio: cc.AudioClip = null;
    

    isShowBubble = false;
    start () {

        let slime2 = CocosHelper.findNode(cc.Canvas.instance.node, "slime2");
        let name = DataConfig.getInstance().getSelectLight();
        cc.loader.loadRes("makeupms/light/fen/" + name, cc.SpriteFrame, function (err, sp) {

            if(err)
                return;

            slime2.getComponent(cc.Sprite).spriteFrame = sp;
        })

        if(name == "light_golden"){

            slime2.active = false;

        }

        let showContent = CocosHelper.findNode(cc.Canvas.instance.node, "showContent");
        
        showContent.active = true;
        showContent.zIndex = 100;
        showContent.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(DataConfig.getInstance().getPageTexture());

        showContent.getComponent(ShaderHelper).enabled = true;

        showContent.getComponent(ShaderTime).enabled = true;
        this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(3.0), cc.callFunc(()=>{

            if(!this.isShowBubble){
                this.isShowBubble = true;
                
            }
            this.showBubble();
        }))));

        let bg = CocosHelper.findNode(cc.Canvas.instance.node, "bg");
        let slime0 = CocosHelper.findNode(cc.Canvas.instance.node, "slime0");
        bg.runAction(cc.repeatForever(cc.sequence(cc.delayTime(10.0), cc.callFunc(()=>{

            slime0.getComponent(ShaderHelper).program = 3 % ShaderHelper.effectAssets.length;
            
 
         }),cc.delayTime(10.0), cc.callFunc(()=>{
 
             slime0.getComponent(ShaderHelper).program =  ShaderHelper.effectAssets.length - 1;
 
         }))));

         CocosHelper.findNode(cc.Canvas.instance.node, "btn_home").zIndex = 1000;
         CocosHelper.findNode(cc.Canvas.instance.node, "btn_next").zIndex = 1000;

    }

    bubbleNum = 0;
    showBubble(){

        let Y= 250 - Math.random() * 500;
        let X = 450 - Math.random() * 900;
        
        let node = new cc.Node();

        node.parent = cc.Canvas.instance.node;
        node.position = cc.v2(X, Y);
        let sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = this.boomSp[0];

        node.scale = 0;
        var timeScale = 1.2;
        var scaleRatio = this.node.scale;
        var scale0 = cc.scaleTo(0.11*timeScale,scaleRatio*0.82,scaleRatio);
        var scale1 = cc.scaleTo(0.1*timeScale,scaleRatio,scaleRatio*0.86);
        var scale2 = cc.scaleTo(0.09*timeScale,scaleRatio*0.88,scaleRatio);
        var scale3 = cc.scaleTo(0.08*timeScale,scaleRatio,scaleRatio*0.89);
        var scale4 = cc.scaleTo(0.07*timeScale,scaleRatio);
        
        var seq = cc.sequence(scale0,scale1,scale2,scale3,scale4);
        node.runAction(cc.sequence(cc.scaleTo(0.5, 1.0), seq ));

        node.on(cc.Node.EventType.TOUCH_START, ()=>{
            node.targetOff(this);

            if(this.bubbleNum % 2 == 0){

                TipManager.getInstance().jumpTips();

            }

            this.bubbleNum = this.bubbleNum + 1;
                
           let blenderMix :cc. FiniteTimeAction[] = [];
           for(let s of this.boomSp){
               blenderMix.push(cc.callFunc(function(){
                   sp.spriteFrame = s;
               }));
               blenderMix.push(cc.delayTime(0.15));
           }
           cc.audioEngine.playEffect(this.boom, false);
           let _blendaction = cc.sequence(blenderMix, cc.callFunc(()=>{

                this.isShowBubble = false;

           }));
           node.runAction(_blendaction);
           node.runAction(cc.sequence(cc.delayTime(0.7), cc.fadeOut(0.2), cc.removeSelf()));

        },this);

    }
    touchNext(event, customEventData){

        var node = event.target;
        node.getComponent(cc.Button).interactable = false;
        node.active = false;
        // cc.audioEngine.stopAllEffects();
        // DataConfig.getInstance().playMusic();
        var onProgress = (completedCount, totalCount, item) => { //进度回调
            //cc.log("LoadingScene onProgress", completedCount, totalCount)

            let percent = completedCount / totalCount
            console.log(percent);
            
        }
        // cc.director.preloadScene('play4SceneMS', onProgress, () => {
        // });
        let slime0 = CocosHelper.findNode(cc.Canvas.instance.node, "slime0");
   
        
        let flowerHeart = CocosHelper.findNode(cc.Canvas.instance.node, "finish");
        flowerHeart.active = true;
        flowerHeart.getComponent(cc.ParticleSystem).resetSystem();
        flowerHeart.zIndex = 100;
        cc.audioEngine.playEffect(this.winAudio, false);

        setTimeout(() => {
            let width = cc.view.getVisibleSize().width;//   visibleRect.width;
            let height = cc.view.getVisibleSize().height;
            CocosHelper.captureNodeSize(cc.Canvas.instance.node, width, height).then((texture1:cc.RenderTexture)=>{
            
                if(texture1 == null){
                    
                }else {
                    
                    DataConfig.getInstance().setPageTexture(texture1);
                    
                }
          
            });
            TransitionScene.changeScene('play4SceneMS');
        }, 3000);
        
    }

    // update (dt) {}
}
