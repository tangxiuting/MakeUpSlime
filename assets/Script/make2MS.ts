import SpriteDrag from "../common/common/Script/codebase/SpriteDrag/SpriteDragMS";
import DragEventListener from "../common/common/Script/codebase/SpriteDrag/DragEventListenerMS";
import { CocosHelper } from "../common/common/Script/codebase/utils/CocosHelperMS";
import MoveIn, { ShowDirection } from "../common/common/Script/compoent/MoveInMS";
import fallSpriteCompoent from "./fallSpriteCompoentMS";
import DataConfig from "./DataConfigMS";
import ShaderHelper from "./tool/components/ShaderHelperMS";
import ShaderTime from "./tool/components/ShaderTimeMS";
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
    @property(cc.AudioClip)
    winAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    pushAudio: cc.AudioClip = null;

    @property(cc.SpriteFrame)
    foameFrame: cc.SpriteFrame = null;

    indexZ = 0;

    
    start () {

        let showContent = CocosHelper.findNode(cc.Canvas.instance.node, "showContent");
        ;
        showContent.active = true;
        showContent.zIndex = 100;
        showContent.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(DataConfig.getInstance().getPageTexture());

        showContent.getComponent(ShaderHelper).enabled = true;

        showContent.getComponent(ShaderTime).enabled = true;


        let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
        let bowl_up = bowl.getChildByName("bowl_up");
        bowl_up.zIndex = 100;

        let array = ["borax", "vaseline", "schoolglue", "water"];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
            let elementNode = CocosHelper.findNode(cc.Canvas.instance.node, element);
            
            let movein = elementNode.getComponent(MoveIn);
            movein.actionCallBack = ()=>{

                let spCm = elementNode.getComponent(SpriteDrag)
                if(spCm)
                    spCm.enabled = true;

                if(element == "water"){
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
    touchEnd(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        console.log("TouchEnd");
        let moveNode =  drag.moveNode;
        drag.enabled = false;
        if(moveNode.getChildByName("shadow"))
            moveNode.getChildByName("shadow").active = false;
        
        if(moveNode.name == "vaseline"){
            let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
            let pos = moveNode.parent.convertToNodeSpaceAR(bowl.convertToWorldSpaceAR(cc.v2(222, 76)));

            moveNode.runAction(cc.sequence(cc.jumpTo(0.5, pos, 100, 1),cc.rotateTo(0.2, -45), cc.callFunc(()=>{

                let finger2 = CocosHelper.findNode(cc.Canvas.instance.node, "finger2");
                let chick = CocosHelper.findNode(cc.Canvas.instance.node, "chick");

                chick.position = chick.parent.convertToNodeSpaceAR(moveNode.convertToWorldSpaceAR(cc.v2(0, 0)));
                finger2.position = finger2.parent.convertToNodeSpaceAR(moveNode.convertToWorldSpaceAR(cc.v2(0, 0)));

                finger2.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(0, 10)),cc.moveBy(0.5, cc.v2(0, -10)))));
                chick.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.1),cc.scaleTo(0.5, 1.1))));

                finger2.zIndex = 100;
                chick.zIndex = 100;

                //moveNode.getComponent(cc.Button).interactable = true;
                moveNode.on(cc.Node.EventType.TOUCH_START,this.touchTool,this);
                


            })));

        }

        var fallSpriteCm = moveNode.getComponent(fallSpriteCompoent);
        if(fallSpriteCm){
            fallSpriteCm.enabled = true;
            fallSpriteCm.actionStartCallBack = ()=>{

                console.log(moveNode.name);
                
            };
            fallSpriteCm.actionEndCallBack = ()=>{
                this.indexZ = this.indexZ + 2;
                fallSpriteCm.bowlInFall.zIndex = this.indexZ;
                
                this.dealNext();
                // console.log("isOver one");
                // let flowerHeart = CocosHelper.findNode(cc.Canvas.instance.node, "flowerHeart");
                // flowerHeart.active = true;
                // flowerHeart.getComponent(cc.ParticleSystem).resetSystem();
    
                // cc.audioEngine.playEffect(this.winAudio, false);
                
                // setTimeout(() => {
                    

                    

                   
                // }, 3000);
    

            };
            
        }
        
    }

    private isTouch = false;

    private pushIndex = 1;
    touchTool(event, customEventData){

        if(this.isTouch)
            return;
        this.isTouch = true;
        let finger2 = CocosHelper.findNode(cc.Canvas.instance.node, "finger2");
        let chick = CocosHelper.findNode(cc.Canvas.instance.node, "chick");
        finger2.stopAllActions();
        finger2.active = false;
        chick.stopAllActions();
        chick.active = false;
        
        // var node = event.target;
        // node.getComponent(cc.Button).interactable = false;

        cc.audioEngine.playEffect(this.pushAudio, false);
        

        let vaseline = CocosHelper.findNode(cc.Canvas.instance.node, "vaseline");

        let vaseline_in = vaseline.getChildByName("vaseline_in");

        let vaseline_t = vaseline.getChildByName("vaseline_t");

        vaseline_in.runAction(cc.moveTo(0.25, cc.v2(-14, 4)));

        let bowl_foam1 = vaseline_in.getChildByName("bowl_foam" + this.pushIndex);
        bowl_foam1.scale = 0;
        bowl_foam1.active = true;
        let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
        let bowl_in = bowl.getChildByName("bowl_in");

        let self = this;
        bowl_foam1.runAction(cc.sequence(cc.scaleTo(0.25, 0.8), cc.callFunc(()=>{

            let pos = bowl_foam1.parent.convertToWorldSpaceAR(bowl_foam1.position);

            bowl_foam1.parent = bowl_in;
            this.indexZ = this.indexZ + 2;
            bowl_foam1.zIndex = this.indexZ;
            bowl_foam1.position = bowl_foam1.parent.convertToNodeSpaceAR(pos);

            bowl_foam1.runAction(cc.sequence(cc.moveTo(0.25, cc.v2(this.pushIndex * 30, 0)),cc.callFunc(function () {

                vaseline_in.runAction(cc.moveTo(0.2, cc.v2(-14, 32)));

                self.isTouch = false;
                self.pushIndex = self.pushIndex + 1;

                if(self.pushIndex == 4){

                    self.isTouch = true;

                    CocosHelper.hideNode(vaseline, ShowDirection.right);
                    self.dealNext();
                }   

            })));

            //node.getComponent(cc.Button).interactable = true;

        })));

    }

    private step = 0;

    dealNext(){
        this.step = this.step + 1;

        if(this.step == 4){

            let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
            let spoon = bowl.getChildByName("spoon");
            spoon.active = true;
            let moveInCm = spoon.getComponent(MoveIn);
            moveInCm.enabled = true;
            moveInCm.actionCallBack = ()=>{


                spoon.getComponent(SpriteDrag).enabled = true;


                


            };
            
        }

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
            let width = cc.view.getVisibleSize().width;//   visibleRect.width;
            let height = cc.view.getVisibleSize().height;
            CocosHelper.captureNodeSize(cc.Canvas.instance.node, width, height).then((texture:cc.RenderTexture)=>{
            
                if(texture == null){
                    
                }else {
                    DataConfig.getInstance().setPageTexture(texture);
                    
                    
                }
          
            });
            setTimeout(() => {
                
                showLaoding.getInstance().showAds(false);
                showLaoding.getInstance().loadingDoneCallback = function () {
        
                    console.log("广告关闭");
                    showLaoding.getInstance().loadingDoneCallback = null;
                    cc.director.loadScene("play1SceneMS");
                    
                    
                }
                
            }, 3000);   
            
            

        },false);

    }

    // update (dt) {}
}
