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
    fly: cc.AudioClip = null;

    @property(cc.AudioClip)
    choose: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let cosmetics6 = CocosHelper.findNode(cc.Canvas.instance.node, "slime0");
        cosmetics6.active = true;
        cosmetics6.opacity = 0;

        cosmetics6.runAction(cc.sequence(cc.fadeIn(1.5),cc.callFunc(()=>{

            let star11 = CocosHelper.findNode(cc.Canvas.instance.node, "star11");
            star11.active = true;
            star11.getComponent(cc.ParticleSystem).resetSystem();
            this.show();
           
        }),cc.spawn(cc.jumpBy(1.5, cc.v2(0, 0), 100, 2), cc.rotateBy(1.5, 360))));
    }

    show(){
        let slime0 = CocosHelper.findNode(cc.Canvas.instance.node, "slime0");
        let array = ["slime1", "slime2", "slime3", "slime4", "slime5"];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
            let moveNode = CocosHelper.findNode(cc.Canvas.instance.node, element);
            let pos = moveNode.position;

            moveNode.position = slime0.position;
            moveNode.scale = 0;
            moveNode.active = true;

            moveNode.runAction(cc.sequence(cc.delayTime(0.5 + index * 0.25),cc.callFunc(()=>{

                moveNode.position = slime0.position;
            
                cc.audioEngine.playEffect(this.fly, false);

                if(index == 3){

                    
                    //CocosHelper.findNode(cc.Canvas.instance.node, "btn_next").active = true;

                    setTimeout(() => {
            

                        let font1 = CocosHelper.findNode(cc.Canvas.instance.node, "font2")
                        
                        let moveCm = font1.getComponent(MoveIn);
                        
                        font1.active = true;
                        moveCm.enabled = true;
                        moveCm.actionCallBack = function () {
                            
                            CocosHelper.findNode(cc.Canvas.instance.node, "btn_next").active = true;
            
                            font1.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1.0, cc.v2(0, 10)),cc.moveBy(1.0, cc.v2(0, -10)))));
            
                        };
                    }, 1000);

                }


            }), cc.spawn(cc.moveTo(1.5, pos).easing(cc.easeElasticOut(0.5)),cc.scaleTo(1.0, 1.0))));

        }

    }

    touchSlime(event, customEventData){

        var node:cc.Node = event.target;
        node.getComponent(cc.Button).interactable = false;
        cc.audioEngine.playEffect(this.choose, false);
        if(node.name == "slime0"){
            let rota = node.rotation;
            rota = rota == 0 ? 45 : 0;
            node.runAction(cc.sequence(cc.rotateTo(0.5, rota),cc.callFunc(()=>{

                node.getComponent(cc.Button).interactable = true;

            })));


        }else{

            var timeScale = 1.2;
            var scaleRatio = node.scale;
            var scale0 = cc.scaleTo(0.11*timeScale,scaleRatio*0.82,scaleRatio);
            var scale1 = cc.scaleTo(0.1*timeScale,scaleRatio,scaleRatio*0.86);
            var scale2 = cc.scaleTo(0.09*timeScale,scaleRatio*0.88,scaleRatio);
            var scale3 = cc.scaleTo(0.08*timeScale,scaleRatio,scaleRatio*0.89);
            var scale4 = cc.scaleTo(0.07*timeScale,scaleRatio);
            var call = cc.callFunc(function () {
            // console.log(self.actionCallBack);
                node.getComponent(cc.Button).interactable = true;
            }, this);
            var seq = cc.sequence(scale0,scale1,scale2,scale3,scale4,call);
            node.runAction(seq);

        }


    }

    touchNet(event){

        var node = event.target;
        node.getComponent(cc.Button).interactable = false;
        let width = cc.view.getVisibleSize().width;//   visibleRect.width;
        let height = cc.view.getVisibleSize().height;
        

        CocosHelper.captureNodeSize(cc.Canvas.instance.node, width, height).then((texture:cc.RenderTexture)=>{
            
            if(texture == null){
                
            }else {
                
                DataConfig.getInstance().setPageTexture(texture);
                cc.director.loadScene("make1SceneMS");  
            }
      
        });

        

    }
    // update (dt) {}
}
