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
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    @property(cc.AudioClip)
    btn: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    photoNode = null;
    filePath = "";
    imagetexture = null;
    start () {

        cc.loader.loadRes("sound/button_camera", cc.AudioClip, function (err, audio) {
            
            if(err){

                return;
            }
            cc.loader.setAutoReleaseRecursively(audio, true);
            cc.audioEngine.playEffect(audio, false);
            
        });

        let maskPhoto = this.node.getChildByName("photo_mask");
        CocosHelper.captureNode(cc.Canvas.instance.node).then((texture:cc.RenderTexture)=>{
            if(texture != null){      
                this.imagetexture = texture;
                let spriteFrame = new cc.SpriteFrame();
                spriteFrame.setTexture(texture);
                this.photoNode = new cc.Node();
                let sprite = this.photoNode.addComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
                //sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                
                let designSize = this.photoNode.getContentSize();
                let width = this.node.width;
                let height = this.node.height;
                
                

                if(height < designSize.height){
                    this.photoNode.setScale(height / designSize.height);
                }

                if(width < designSize.width) {
                    this.photoNode.setScale(width / designSize.width);
                }
                console.log(width);
                console.log(designSize.width);
                console.log(width / designSize.width);
                
                maskPhoto.addChild(this.photoNode);
                cc.log(this.photoNode);
                if (CC_JSB&& !CC_PREVIEW) {

                    let picData = texture.readPixels();
                    let width = texture.width;
                    let height = texture.height;
                    let timeName = Date.parse(new Date().toString());
                    this.filePath = jsb.fileUtils.getWritablePath() + timeName +'.png';
    
                    let success = jsb.saveImageData(picData, width, height, this.filePath)
                    if(!success){
                        this.filePath = "";
                    }
                }
            }  
       });




    }

    touchDown(event){
        cc.audioEngine.playEffect(this.btn, false);
        var node = event.target;
        node.getComponent(cc.Button).interactable = false;

        if(this.imagetexture == null){

            node.getComponent(cc.Button).interactable = true;
            return;

        }

        if (CC_JSB&& !CC_PREVIEW) {
            if (this.filePath != '') {
               jsToCPP.getInstance().doRuntimePermission(this.filePath, 1, function (isSuccess) {  
                    console.log("保存相册回调 "+ isSuccess);
                    var popup = this.node.getChildByName('popup_board')
                    popup.active = true;
                    //popup.getComponent(PopupComponet).showPopup();
                    popup.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                        popup.active = false;
                        node.getComponent(cc.Button).interactable = true;
                    }.bind(this)))); 
                    if(isSuccess){
                        popup.getChildByName("label").getComponent(cc.Label).string = "Photo downloaded successfully, please check in the album!";
                    }else{
                        popup.getChildByName("label").getComponent(cc.Label).string = "Picture download failed. Please check whether access to the album is open or not!";
                        
                    }      
               }.bind(this));
            }
            else {
                node.getComponent(cc.Button).interactable = true;
                console.log('download failed!');
            }
        }

    }
    touchShare(event){
        cc.audioEngine.playEffect(this.btn, false);
        var node = event.target;
        node.getComponent(cc.Button).interactable = false;

        let self = this;
        if (CC_JSB&& !CC_PREVIEW) {
            if (this.filePath != '') {
               jsToCPP.getInstance().doRuntimePermission(this.filePath, 2, function (isSuccess) {  
                    console.log("打开邮箱成功与否 "+ isSuccess);

                    if(!isSuccess){

                        console.log("打开邮箱失败");

                        let photo_mask = self.node.getChildByName("popup_tips");
                        photo_mask.active = true;
                        photo_mask.scale = 0;

                        photo_mask.runAction(cc.scaleTo(0.25, 1));
                    }

               });
               node.getComponent(cc.Button).interactable = true;
            }
            else {
                console.log('download failed!')
                node.getComponent(cc.Button).interactable = true;
            }
        }

    }
    touchHide(){
        cc.audioEngine.playEffect(this.btn, false);
        let photo_mask = this.node.getChildByName("popup_tips");
        photo_mask.active = false;

    }
    touchClose(event){

        var node = event.target;
        node.getComponent(cc.Button).interactable = false;

        this.node.removeFromParent();
        
    }
    // update (dt) {}
}
