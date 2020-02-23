import MoveIn from "../common/common/Script/compoent/MoveInMS";
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
export default class ClickController extends cc.Component {
    photoNode:cc.Node = null;
    filePath:string = null;
    touchNum: number = 0;
   
    init() {
        this.destroyTouchEvent();
        this.touchNum = 0;
        this.node.getChildByName('pull').stopAllActions();
        this.node.getChildByName('pull').setScale(1);
        this.node.getChildByName('pull').setPosition(cc.v2(0, 0));
        this.node.getChildByName('pull').opacity = 0;
        this.node.getChildByName('tipClick').active = false;
        this.node.getChildByName('pull').children.forEach(child => {
            if (child.name == 'shadow') {
                child.destroy();
            }
        })
        this.node.getChildByName('pull').getComponent(MoveIn).doShowAction();
        this.node.getChildByName('pull').getComponent(MoveIn).actionCallBack = function () {
            this.registerTouchEvent();
            this.node.getChildByName('tipClick').active = true;
        }.bind(this)
    }
    onTouchStart(event) {
       
        if (this.touchNum == 7) {
            // this.node.getChildByName('finish').getComponent(cc.ParticleSystem).resetSystem();
            // this.node.getChildByName('finish').getComponent(cc.AudioSource).play();
            // let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next");
            // btn_next.active = true;
            // btn_next.runAction(cc.repeat(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1)), 2));
            //this.showEgainBtn();
        }
       
        this.node.getChildByName('tipClick').active = false;
        let touches = event.getTouches();
        let handPosition = this.node.convertToNodeSpaceAR(touches[0].getStartLocation());
        let position = this.node.getChildByName('pull').convertToNodeSpaceAR(touches[0].getStartLocation());

        let colider = this.node.getChildByName('pull').getComponent(cc.PolygonCollider);
        
        if (cc.Intersection.pointInPolygon(position, colider.points)) {
           
          
           
            this.touchNum = this.touchNum + 1;
            this.destroyTouchEvent();
            if (this.touchNum % 3 == 0) {
                TipManager.getInstance().jumpTips();
            }
            this.node.getChildByName('hand').runAction(cc.sequence(
                cc.moveTo(0.5, handPosition),
                cc.callFunc(function () {
                    this.node.getChildByName('pull').runAction(cc.sequence(
                        cc.scaleTo(0.1, 1.05, 0.95),
                        cc.scaleTo(0.1, 0.95, 1.05),
                        cc.scaleTo(0.1, 1.02, 0.98),
                        cc.scaleTo(0.1, 0.98, 1.02),
                        cc.scaleTo(0.1, 1, 1)
                    ))
                    this.node.getChildByName('pull').getComponent(cc.AudioSource).play();
                    let num = Math.random() * 3;
                    let node = cc.instantiate(cc.find('pull/hand_shadow', this.node));
                    node.active = true;
                    node.name = 'shadow';
                    node.parent = this.node.getChildByName('pull');
                    node.setPosition(position);
                    cc.find('heartParticle', this.node).setPosition(handPosition);
                    cc.find('heartParticle', this.node).getComponent(cc.ParticleSystem).resetSystem();
                    if (num > 1) {
                        let node1 = cc.instantiate(node);
                        node1.name = 'shadow';
                        node1.parent = this.node.getChildByName('pull');
                        node1.setPosition(cc.v2(position.x - 50, position.y + 10));
                        let nodePos = new cc.Vec2();
                        nodePos = node1.getPosition();
                        if (cc.Intersection.pointInPolygon(nodePos,colider.points)) {
                            node1.active = true;
                        } else {
                            node1.active = false;
                        }
                        if (num > 2) {
                            let node2 = cc.instantiate(node);
                            node2.name = 'shadow';
                            node2.parent = this.node.getChildByName('pull')
                            node2.setPosition(cc.v2(position.x - 80, position.y + 30)); 
                            let nodePos = new cc.Vec2();
                            nodePos = node2.getPosition();
                            if (cc.Intersection.pointInPolygon(nodePos,colider.points)) {
                                node2.active = true;
                            } else {
                                node2.active = false;
                            }
                        }
                    }  
                }.bind(this)),
                cc.moveTo(0.5, cc.v2(-20, 200)),
                cc.callFunc(function () {
                    this.registerTouchEvent();
                }.bind(this))
            ));
        }
    }
    destroyTouchEvent() {
        this.node.getChildByName('pull').off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }
    registerTouchEvent() {
        this.node.getChildByName('pull').on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }
    // camera() {
    //     cc.find('Canvas/btn_camera').getComponent(cc.Button).interactable = false;
    //     CocosHelper.captureNode(cc.Canvas.instance.node).then((texture:cc.RenderTexture)=>{
    //         if(texture != null){      
    //             let spriteFrame = new cc.SpriteFrame();
    //             spriteFrame.setTexture(texture);
    //             this.photoNode = new cc.Node();
    //             let sprite = this.photoNode.addComponent(cc.Sprite);
    //             sprite.spriteFrame = spriteFrame;
    //             //sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    //             cc.find('photo',this.node).active =true;
    //             var maskPhoto = cc.find('photo/mask',this.node);
    //             let designSize = this.photoNode.getContentSize();
    //             let width = maskPhoto.width;
    //             let height = maskPhoto.height;
                
    //             let scaleX = null;
    //             let scaleY = null;
                
    //             if (width < designSize.width) {
    //                 scaleX = width / designSize.width;
    //                 this.photoNode.setScale(scaleX);
    //             }
    //             if (height < designSize.height) {
    //                 scaleY = height / designSize.height;
    //                 this.photoNode.setScale(scaleY);
                   
    //             }
    //             if (scaleX && scaleY) {
    //                 if (scaleX > scaleY) {
    //                     this.photoNode.setScale(scaleX);
    //                 } else {
    //                     this.photoNode.setScale(scaleY);
    //                 } 
    //             }
    //             maskPhoto.addChild(this.photoNode);
    //             cc.log(this.photoNode);
    //             if (CC_JSB&& !CC_PREVIEW) {

    //                 let picData = texture.readPixels();
    //                 let width = texture.width;
    //                 let height = texture.height;
    //                 let timeName = Date.parse(new Date().toString());
    //                 this.filePath = jsb.fileUtils.getWritablePath() + timeName+'.png';
    
    //                 let success = jsb.saveImageData(picData, width, height, this.filePath)
    //                 if(!success){
    //                     this.filePath = "";
    //                 }
    //             }
    //         }  
    //    });
    //     this.node.getChildByName('btn_camera').getComponent(cc.AudioSource).play();
    // }
    // downloadImag(){
    //     this.photoNode.destroy();
    //     cc.find('Canvas/photo/btn_x').getComponent(cc.AudioSource).play();
    //     cc.find('photo',this.node).active = false;
    //     cc.find('Canvas/btn_camera').getComponent(cc.Button).interactable = true;
    //     if (CC_JSB&& !CC_PREVIEW) {
    //         if (this.filePath != '') {
    //            jsToCPP.getInstance().doRuntimePermission(this.filePath, 1, function (isSuccess) {  
    //                 console.log("保存相册回调 "+ isSuccess);
    //                 var popup = this.node.getChildByName('popup')
    //                 popup.active = true;
    //                 popup.getComponent(PopupComponet).showPopup();
    //                 popup.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
    //                     popup.getComponent(PopupComponet).hidePopup();
    //                 }.bind(this)))); 
    //                 if(isSuccess){
    //                     popup.getComponent(PopupComponet).setTip('Photo downloaded successfully, please check in the album!');
    //                 }else{
    //                     popup.getComponent(PopupComponet).setTip('Picture download failed. Please check whether access to the album is open or not!');
    //                 }      
    //            }.bind(this));
    //         }
    //         else {
    //             console.log('download failed!');
    //         }
    //     }
    // }
    // shareImage(){
    //     cc.find('Canvas/photo/btn_x').getComponent(cc.AudioSource).play();
    //     this.photoNode.destroy();
    //     cc.find('photo',this.node).active = false;
    //     cc.find('Canvas/btn_camera').getComponent(cc.Button).interactable = true;
    //     if (CC_JSB&& !CC_PREVIEW) {
    //         if (this.filePath != '') {
    //            jsToCPP.getInstance().doRuntimePermission(this.filePath, 2, function (isSuccess) {  
    //                 console.log("保存相册回调 "+ isSuccess);
    //            });
    //         }
    //         else {
    //             console.log('download failed!')
    //         }
    //     }
    // }  
    // closePhoto(){
    //     this.photoNode.destroy();
    //     cc.find('Canvas/btn_camera').getComponent(cc.Button).interactable = true;
    //     cc.find('Canvas/photo/btn_x').getComponent(cc.AudioSource).play();
    //     this.node.getChildByName('photo').active = false;
    // }
    // touchNextBtn() {
    //     cc.audioEngine.stopMusic();
    //     if(CC_JSB){
            
    //         cc.INGAME =  (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "SlimeMakeNew/chiristmas_slime";
    //         console.log(cc.INGAME);
    //         window.require(cc.INGAME+"/src/dating.js");
           
    //     }
    // }
    // touchBackBtn() {
    //     TransitionScene.changeScene('playSlime');
    // }
    // showEgainBtn() {
    //     this.node.getChildByName('playagain_btn').active = true;
    //     this.node.getChildByName('playagain_btn').setPosition(cc.v2(0,600));
    //     this.node.getChildByName('playagain_btn').runAction(cc.sequence(
    //         cc.moveTo(0.5,cc.v2(0,200)),
    //         cc.moveTo(0.1,cc.v2(0,230)),
    //         cc.moveTo(0.1, cc.v2(0, 200)),
    //         cc.callFunc(function () {
    //             this.node.getChildByName('playagain_btn').getComponent(cc.Button).interactable = true;
    //         }.bind(this))
    //     ))
    // }
    // playAgain() {
    //     TransitionScene.changeScene('rubSlime');
    // }

}
