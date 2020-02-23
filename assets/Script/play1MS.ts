import { CocosHelper } from "../common/common/Script/codebase/utils/CocosHelperMS";
import { ShowDirection } from "../common/common/Script/compoent/MoveInMS";
import IconItem from "../common/common/Script/ads/IconItemMS";
import SpriteDrag from "../common/common/Script/codebase/SpriteDrag/SpriteDragMS";
import DragEventListener from "../common/common/Script/codebase/SpriteDrag/DragEventListenerMS";
import fallSpriteCompoent from "./fallSpriteCompoentMS";
import DataConfig from "./DataConfigMS";
import ShaderHelper from "./tool/components/ShaderHelperMS";
import ShaderTime from "./tool/components/ShaderTimeMS";
import RewardManager from "../common/common/Script/ads/RewardManagerMS";
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
export default class play1 extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    touchNodeVector: cc.Node[] = [];

    @property(cc.Prefab)
    insta: cc.Prefab = null;
    @property(cc.Node)
    private conteneNode: cc.Node = null;
    @property(cc.Node)
    iconBg: cc.Node = null;

    @property(cc.SpriteFrame)
    liquidSprime: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    liquidSprime1: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    liquidSprime2: cc.SpriteFrame = null;
    @property(cc.AudioClip)
    liquidAUDIO: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    touchBtnAudio: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    flyAudio: cc.SpriteFrame = null;
    @property(cc.AudioClip)
    flyAudioOut: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    sauceOut: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    movePour: cc.SpriteFrame = null;
    @property(cc.AudioClip)
    win: cc.SpriteFrame = null;
    @property(cc.AudioClip)
    swip: cc.SpriteFrame = null;
    @property(cc.AudioClip)
    push: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    doneAudio: cc.SpriteFrame = null;
    @property(cc.AudioClip)
    flyTop: cc.SpriteFrame = null;

    
    private iconsPool: cc.NodePool = null;
    private selectItemName = "";
    start () {
        RewardManager.getInstance().loadConfig();
        DataConfig.getInstance().playMusic();
        let showContent = CocosHelper.findNode(cc.Canvas.instance.node, "showContent");
        ;
        showContent.active = true;
        showContent.zIndex = 100;
        showContent.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(DataConfig.getInstance().getPageTexture());

        showContent.getComponent(ShaderHelper).enabled = true;

        showContent.getComponent(ShaderTime).enabled = true;
        if (this.iconsPool == null) {
            this.iconsPool = new cc.NodePool;
            for (let i = 0; i < 5; i++) {
                this.iconsPool.put(cc.instantiate(this.insta));
            }
        }

        CocosHelper.findNode(cc.Canvas.instance.node, "box_up").zIndex = 10;;
        CocosHelper.findNode(cc.Canvas.instance.node, "bowl_up").zIndex = 10;
        
        this.showTips();
    }

    showTips(){
        let bg = CocosHelper.findNode(cc.Canvas.instance.node, "box_up");

        bg.runAction(cc.repeatForever(cc.sequence(cc.callFunc(()=>{

            let tempNode = null;
            for (const iterator of this.touchNodeVector) {
                
                if(iterator.width != 0){

                    tempNode = iterator;
                    break;
                }

            }
            let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
            console.log(bowl.color.getR());
            if(tempNode){

                if(Number(bowl.color.getR()) > 120){

                    let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
                    finger.zIndex = 100;
                    finger.position = finger.parent.convertToNodeSpaceAR(tempNode.convertToWorldSpaceAR(cc.v2(0, 0)));
                    finger.active = true;
                    finger.stopAllActions();
                    finger.runAction(cc.sequence(cc.moveBy(0.5, cc.v2(0, 10)), cc.moveBy(0.5, cc.v2(0, -10)),cc.moveBy(0.5, cc.v2(0, 10)), cc.moveBy(0.5, cc.v2(0, -10)),cc.callFunc(()=>{
    
                        finger.active = false;
    
                    })));
    
                }

            }
            
            
            // if(!cc.audioEngine.isMusicPlaying()){

            //     DataConfig.getInstance().playMusic();

            // }

        }), cc.delayTime(5.0))));

        let box = CocosHelper.findNode(cc.Canvas.instance.node, "box");

        box.runAction(cc.repeatForever(cc.sequence(cc.callFunc(()=>{

            
            // if(!cc.audioEngine.isMusicPlaying()){

            //     DataConfig.getInstance().playMusic();
                
            // }

        }), cc.delayTime(10.0))));

    }



    //处理是否做完
    private _step = 0;
    doDealStep(){

        this._step = this._step + 1;

        console.log("this._step");
        
        if(this._step % 2 == 0){

            TipManager.getInstance().jumpTips();

        }


        if(this._step == 7){
            let plate_slime:cc.Node = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime");
         
            let texture = CocosHelper.captureNode2(plate_slime);

            DataConfig.getInstance().setTexture(texture);

            console.log(texture);
            let width = cc.view.getVisibleSize().width;//   visibleRect.width;
            let height = cc.view.getVisibleSize().height;
            plate_slime.getChildByName("plate_slime_t").active = false;
            
            CocosHelper.captureNodeSize(plate_slime, width, height).then((texture:cc.RenderTexture)=>{
                plate_slime.getChildByName("plate_slime_t").active = true;
                if(texture == null){
                    
                }else {
                    // var node = new cc.Node();
                    // var sprite = node.addComponent(cc.Sprite);
                    // sprite.spriteFrame = new cc.SpriteFrame(texture);
                    // cc.Canvas.instance.node.addChild(node);
                    // node.x = 0;
                    // node.y = 0;
                    DataConfig.getInstance().setTexture(texture);
                    let flowerHeart = CocosHelper.findNode(cc.Canvas.instance.node, "finish");
                    flowerHeart.active = true;
                    flowerHeart.getComponent(cc.ParticleSystem).resetSystem();
        
                    cc.audioEngine.playEffect(this.win, false);
        
                    setTimeout(() => {
                        CocosHelper.captureNodeSize(cc.Canvas.instance.node, width, height).then((texture1:cc.RenderTexture)=>{
            
                            if(texture1 == null){
                                
                            }else {
                                
                                DataConfig.getInstance().setPageTexture(texture1);
                                
                            }
                      
                        });
                        cc.director.loadScene("play2SceneMS");
                    }, 3000);
                    
                    // console.log(sprite.node.width);
                    //cc.director.loadScene("MakeScene9");
                    
                    // cc.director.loadScene("play1SceneMS");
                }
            
            });
        }
    }

    btnTest(){

        let plate_slime:cc.Node = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime");
         
        let texture = CocosHelper.captureNode2(plate_slime);

        DataConfig.getInstance().setTexture(texture);

        console.log(texture);
        let width = cc.view.getVisibleSize().width;//   visibleRect.width;
        let height = cc.view.getVisibleSize().height;
        plate_slime.getChildByName("plate_slime_t").active = false;
        
        CocosHelper.captureNodeSize(plate_slime, width, height).then((texture:cc.RenderTexture)=>{
            plate_slime.getChildByName("plate_slime_t").active = true;
            if(texture == null){
                
            }else {
                var node = new cc.Node();
                var sprite = node.addComponent(cc.Sprite);
                sprite.spriteFrame = new cc.SpriteFrame(texture);
                cc.Canvas.instance.node.addChild(node);
                node.x = 0;
                node.y = 0;

                DataConfig.getInstance().setTexture(texture);
                console.log(sprite.node.width);
                //cc.director.loadScene("MakeScene9");
                cc.director.loadScene("play2SceneMS");
            }
          
       });
        // var node = new cc.Node();
        // var sprite = node.addComponent(cc.Sprite);
        // sprite.spriteFrame = new cc.SpriteFrame(texture);
        // cc.Canvas.instance.node.addChild(node, 100);
        // node.x = 0;
        // node.y = 0;

       // console.log(sprite.node.width);
        

            // cc.director.loadScene("play2SceneMS");

    }

    touchNode(event, customEventData){

        console.log(customEventData);
        let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
        finger.zIndex = 100;
        
        finger.active = false;

        var node = event.target;
        // node.getComponent(cc.Button).interactable = false;
        //禁用按钮
        this.touchNodeVector.forEach(element => {
            element.getComponent(cc.Button).interactable = false;
        });

        this.selectItemName = customEventData;

        this.toolFly(customEventData, ()=>{

            this.changeStatus(false);

            this.showBtn(true);

            this.showTool(customEventData);
            let finger = CocosHelper.findNode(cc.Canvas.instance.node, "finger");
            finger.zIndex = 100;
        
            finger.active = false;
        }, true);

        console.log(customEventData);
        
    }
    showTool(customEventData){

        if(customEventData == "air"){

            this.showAir();

            return;
        }

        this.showIconBg(customEventData)

        let node:cc.Node = CocosHelper.findNode(cc.Canvas.instance.node, "ui_board");
            
        node.active = true;
        node.opacity = 0;

        //cc.Widget 存在  执行进入动画 延迟一帧

        setTimeout(() => {
            
            let endPosiont = node.position;
            let statPos:cc.Vec2 = endPosiont.sub(cc.v2(-400, 0));
            node.setPosition(statPos);
            node.runAction(cc.sequence(cc.spawn(cc.moveTo(0.56, endPosiont), cc.fadeIn(0.5)), cc.callFunc(()=>{
                    
            })));

        }, 100);
    };
    showIconBg(customData:string){
        let array = ["nail_polish", "eye_shadow", "lipstick", "liquid", "air", "mascara","light"];

        let selectToolIndex = 0;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(element == customData){

                selectToolIndex = index;
                break;

            }
        }

        let arrayIcon = [
            ["nail_polish_red","nail_polish_purple","nail_polish_greed","nail_polish_blue"],
            ["eye_shadow_blue","eye_shadow_brown","eye_shadow_pink","eye_shadow_purple"],
            ["lipstick_golden","lipstick_greed","lipstick_orange","lipstick_pink","lipstick_purple"],
            ["liquid_foundation_0","liquid_foundation_1"],
            ["air"],
            ["mascara_blue","mascara_brown","mascara_orange","mascara_purple"],
            ["light_golden","light_rainbow0","light_rainbow1"]
        ]

        let tempiconPaths = arrayIcon[selectToolIndex];

        let icon_board = CocosHelper.findNode(cc.Canvas.instance.node, "ui_board");
        icon_board.active = true;

        let iconPaths: string[] = [];

        for (let index = 0; index < tempiconPaths.length; index++) {
            iconPaths.push("makeupms/icon/"+tempiconPaths[index]); 
            
        }
        let v = this.conteneNode.children.slice();
        for (let c of v) {
            this.iconsPool.put(c);
        }
        let self = this;
        cc.loader.loadResArray(iconPaths, cc.SpriteFrame, (erro, frames: cc.SpriteFrame[]) => {

            for (let i = 0; i < frames.length; i++) {
                let node: cc.Node = null;
                if (self.iconsPool.size() > 0) {
                    node = self.iconsPool.get();
                } else {
                    node = cc.instantiate(self.insta);
                }
                
                node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = frames[i];
                node.parent = self.conteneNode;
                let item = node.getComponent(IconItem);
                item.index = i;
                item.isRewardLock = i % 2 == 0;
                item.key = item.moduleName = customData;

                if(i == 0){
                    item.key = "lock";
                }
                
                item.init();
                let event = new cc.Component.EventHandler;
                event.component = "play1";
                event.handler = "touchItem";
                event.target = self.node;
                item.getComponent(cc.Toggle).isChecked = false;
                item.getComponent(cc.Toggle).checkEvents = [event];
            }

        });

        let scrollview = icon_board.getChildByName("scrollview");

        let scrollviewCm = scrollview.getComponent(cc.ScrollView);
        scrollviewCm.scrollToLeft();

    }

    touchItem(a: cc.Toggle){

        if(a.isChecked){

            cc.audioEngine.playEffect(this.touchBtnAudio, false);

            let node = a.node;
            let item = node.getComponent(IconItem);
            let index = item.index;
            let pos = a.node.convertToWorldSpaceAR(cc.v2(0, 0));

            console.log(node.name + " " + item.moduleName);
            
            //liquid
            if(item.moduleName.indexOf("liquid") != -1){

                this.showLiquid(index)  


            }else if(item.moduleName.indexOf("lipstick") != -1){


                this.showlipstick(index);

            }else if(item.moduleName.indexOf("mascara") != -1){


                this.showmascara(index);

            }else if(item.moduleName.indexOf("nail_polish") != -1){


                this.shownail_polish(index);

            }else if(item.moduleName.indexOf("eye_shadow") != -1){


                this.showeye_shadow(index);

            }else if(item.moduleName.indexOf("light") != -1){


                this.showlight(index);

            }
            

        }

    }

    //---------------------------------------
    isShowLight = false;
    showlight(index){

        if(this.isShowLight)
            return;
            this.isShowLight = true;
        let light_small = CocosHelper.findNode(cc.Canvas.instance.node, "light_small");
        light_small.stopAllActions();
        let pos = cc.v2(-167, 93);
        light_small.position = cc.v2(-167, -993);
        light_small.active = true;
        
        this.selectLightTempIndex = index;
        cc.audioEngine.playEffect(this.flyAudio, false);

        light_small.active = true;
        light_small.runAction(cc.sequence(cc.moveTo(1.0, pos), cc.callFunc(()=>{
            this.isShowLight = false;
            light_small.getComponent(SpriteDrag).enabled = true;
        })));


        // setTimeout(() => {
        //     CocosHelper.showBackOut(light_small, ShowDirection.left, ()=>{
        //         light_small.getComponent(SpriteDrag).enabled = true;
        //     });
        //     light_small.runAction(cc.fadeIn(2.0));
        // }, 300);

        let light_move = CocosHelper.findNode(cc.Canvas.instance.node, "light_move");
        
        light_move.stopAllActions();
        light_move.position = cc.v2(0, 227);
        light_move.active = false;
        this.selectlipstick = index;
        
        let array = ["light_golden","light_rainbow0","light_rainbow1"];


        DataConfig.getInstance().setSelectLight(array[index]);

        cc.loader.loadRes("makeupms/light/" + array[index], cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
            
            light_move.getChildByName("light_move_in").getComponent(cc.Sprite).spriteFrame = sp;
        });
        cc.loader.loadRes("makeupms/light/small/" + array[index], cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
            let light_inslime = CocosHelper.findNode(cc.Canvas.instance.node, "light_inslime");
            
            light_inslime.getComponent(cc.Sprite).spriteFrame = sp;
        });

        cc.audioEngine.playEffect(this.flyAudio, false);

        setTimeout(() => {
            
            CocosHelper.showBackOut(light_move, ShowDirection.top, ()=>{

                let air_inslime = CocosHelper.findNode(cc.Canvas.instance.node, "light_inslime");//eye_shadow_move.getChildByName("");
                air_inslime.active = true;
                air_inslime.scale = 0;
                air_inslime.stopAllActions();
                air_inslime.runAction(cc.sequence(cc.delayTime(1.0),cc.scaleTo(3.0, 1.0), cc.callFunc(()=>{
                    
                    this.isLightShow = false;
                    light_small.active = false;
                    // cc.audioEngine.stopAllEffects();
                    cc.audioEngine.stopEffect(this.soundIndex);
                    
                    cc.audioEngine.playEffect(this.flyAudioOut, false);
                    CocosHelper.hideNode(light_move, ShowDirection.right);
                    this.changeStatus(true);
                    this.selectItemName = "";
                    this.toolBoardMiss();
                    let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "light0");
                    bowl.active = false;
                    let liquid_touch = bowl.getChildByName("light_touch");
                    liquid_touch.position = cc.v2(1000, 10000);
                    liquid_touch.width = 0;
                    liquid_touch.height = 0;
                    
                    this.doDealStep()
                })));
    
                cc.director.getActionManager().pauseTarget(air_inslime);
    
    
            });
        }, 300);

    }
    selectLightTempIndex = 0;
    light_smallTouchBegin(){

        let icon_board = CocosHelper.findNode(cc.Canvas.instance.node, "ui_board");
        icon_board.active = false;
        let btn_reset = CocosHelper.findNode(cc.Canvas.instance.node, "btn_reset");
        btn_reset.active = false;

    }
    isLightShow = false;
    light_smallTouchIng(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        let light_small = CocosHelper.findNode(cc.Canvas.instance.node, "light_small");
        let light_move = CocosHelper.findNode(cc.Canvas.instance.node, "light_move");
        let air_inslime = CocosHelper.findNode(cc.Canvas.instance.node, "light_inslime");
        let pos = light_small.convertToWorldSpaceAR(cc.v2(-50, 0));
        let moveNode =  drag.moveNode;
        if(light_move.getBoundingBox().contains(light_move.parent.convertToNodeSpaceAR(pos))){
            if(!this.isLightShow){
                this.isLightShow = true;
                cc.director.getActionManager().resumeTarget(air_inslime);

                
                
                moveNode.getChildByName("tool_p" + this.selectLightTempIndex).active = true;
                
                moveNode.children.forEach(element => {
                    
                    if(element.getComponent(cc.ParticleSystem)){

                        element.getComponent(cc.ParticleSystem).resetSystem()

                    }

                });

                //moveNode.getChildByName("tool_p").getComponent(cc.ParticleSystem).resetSystem();
                this.soundIndex = cc.audioEngine.playEffect(this.movePour, true);
                
            }
        }else{
            cc.director.getActionManager().pauseTarget(air_inslime);

            moveNode.getChildByName("tool_p" + this.selectLightTempIndex).active = false;
            //cc.audioEngine.stopAllEffects();
            cc.audioEngine.stopEffect(this.soundIndex);
            //this.soundIndex

            this.isLightShow = false;
        }

    }
    soundIndex = -1;
    light_smallTouchUp(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        let moveNode =  drag.moveNode;
        let air_inslime = CocosHelper.findNode(cc.Canvas.instance.node, "light_inslime");
        cc.director.getActionManager().pauseTarget(air_inslime);

        moveNode.getChildByName("tool_p" + this.selectLightTempIndex).active = false;
        // cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopEffect(this.soundIndex);
        this.isLightShow = false;
    }

    showeye_shadow(index){

        let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "eye_shadow_move");
        
        //CocosHelper.findNode(cc.Canvas.instance.node, "liquid_touch");
       
        liquid.stopAllActions();
        liquid.position = cc.v2(167, 146);
        liquid.active = false;
        this.selectlipstick = index;
        let array = ["eye_shadow_blue","eye_shadow_brown","eye_shadow_pink","eye_shadow_purple"];

        cc.loader.loadRes("makeupms/eye_shadow/" + array[index], cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
            
            liquid.getComponent(cc.Sprite).spriteFrame = sp;
        });

        cc.loader.loadRes("makeupms/eye_shadow/small/" + array[index], cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
            
            liquid.getChildByName("eye_shadow_move_in").getComponent(cc.Sprite).spriteFrame = sp;
        });

        cc.audioEngine.playEffect(this.flyAudio, false);

        CocosHelper.showBackOut(liquid, ShowDirection.top, ()=>{

            liquid.on(cc.Node.EventType.TOUCH_START,this.eye_shadowTouch,this);
            // air_in_touch.on(cc.Node.EventType.TOUCH_START,this.air_in_Touch,this);
            // air_in_touch.on(cc.Node.EventType.TOUCH_END,this.air_in_TouchUp,this);

        });

    }
    eye_shadowTouch(){
        let icon_board = CocosHelper.findNode(cc.Canvas.instance.node, "ui_board");
        icon_board.active = false;
        let btn_reset = CocosHelper.findNode(cc.Canvas.instance.node, "btn_reset");
        btn_reset.active = false;
        let eye_shadow_move = CocosHelper.findNode(cc.Canvas.instance.node, "eye_shadow_move");
        eye_shadow_move.targetOff(this);
        let eye_shadow_move_lid = eye_shadow_move.getChildByName("eye_shadow_move_lid");
        
        eye_shadow_move_lid.runAction(cc.sequence(cc.fadeOut(0.25), cc.callFunc(()=>{


            eye_shadow_move.runAction(cc.sequence(cc.rotateTo(0.5, -137), cc.callFunc(()=>{


                eye_shadow_move.on(cc.Node.EventType.TOUCH_START,this.eye_shadow_Touch,this);
                eye_shadow_move.on(cc.Node.EventType.TOUCH_END,this.eye_shadow_TouchUp,this);
    
                let air_inslime = eye_shadow_move.getChildByName("eye_shadow_move_in");
                air_inslime.active = true;
                air_inslime.scale = 0;
                air_inslime.runAction(cc.sequence(cc.scaleTo(3.0, 1.0), cc.callFunc(()=>{
                    
                    //cc.audioEngine.stopAllEffects();
                    cc.audioEngine.stopEffect(this.soundIndex);
                    eye_shadow_move.targetOff(this);
                    
                    let liquid_fall = air_inslime;

                    let pos = liquid_fall.parent.convertToWorldSpaceAR(liquid_fall.position);

                    let plate_slime = CocosHelper.findNode(cc.Canvas.instance.node, "content_tool").getChildByName("plate").getChildByName("plate_slime");
                    
                    liquid_fall.parent = plate_slime;
                    liquid_fall.position = liquid_fall.parent.convertToNodeSpaceAR(pos);
                    liquid_fall.zIndex = this._step;
                    
                    let X = 200 - Math.random() * 400;
                    let Y = 90 - Math.random() * 170;
                    console.log(X + "  " + Y);
                    
                    liquid_fall.runAction(cc.sequence(cc.delayTime(0.01),cc.jumpTo(0.5, cc.v2(X, Y), 50, 1), cc.callFunc(()=>{
                        cc.audioEngine.playEffect(this.flyAudioOut, false);
                        CocosHelper.hideNode(eye_shadow_move, ShowDirection.right);
                        this.changeStatus(true);
                        this.selectItemName = "";
                        this.toolBoardMiss();
                        let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "box");
                        let liquid_touch = bowl.getChildByName("eye_shadow_touch");;
                        bowl.getChildByName("eye_shadow1").active = false;;
                        bowl.getChildByName("eye_shadow2").active = false;;
                        bowl.getChildByName("eye_shadow0").active = false;;
                        liquid_touch.position = cc.v2(1000, 10000);
                        liquid_touch.width = 0;
                        liquid_touch.height = 0;
                        this.doDealStep();
                    })));


                    
                })));
    
                cc.director.getActionManager().pauseTarget(air_inslime);


            })))

        })));


    }
    eye_shadow_Touch(){
        let air_inslime = CocosHelper.findNode(cc.Canvas.instance.node, "eye_shadow_move_in");
            cc.director.getActionManager().resumeTarget(air_inslime);
            cc.audioEngine.stopEffect(this.soundIndex);
            this.soundIndex = cc.audioEngine.playEffect(this.sauceOut, true);
    }
    eye_shadow_TouchUp(){

        let air_inslime = CocosHelper.findNode(cc.Canvas.instance.node, "eye_shadow_move_in");
        cc.director.getActionManager().pauseTarget(air_inslime);
        // cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopEffect(this.soundIndex);
    }

    shownail_polish(index){

        let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "nail_move");
        let plate_slime = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime");
        //CocosHelper.findNode(cc.Canvas.instance.node, "liquid_touch");
        liquid.getComponent(SpriteDrag).enabled = false;;
        liquid.stopAllActions();
        liquid.position = cc.v2(167, 146);
        liquid.active = false;
        this.selectlipstick = index;
        let array = ["nail_polish_red","nail_polish_purple","nail_polish_greed","nail_polish_blue"];

        let nail_move_p = liquid.getChildByName("nail_move_p");

        cc.loader.loadRes("makeupms/nail_polish/p/" + array[index], cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
            
            let pCm = nail_move_p.getComponent(cc.ParticleSystem);
            pCm.custom = true;
            pCm.spriteFrame = sp;
            pCm.resetSystem();
            
        });


        cc.loader.loadRes("makeupms/nail_polish/" + array[index], cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
            
            liquid.getChildByName("nail_up").getComponent(cc.Sprite).spriteFrame = sp;
        });

        cc.loader.loadRes("makeupms/nail_polish/small/" + array[index], cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
            
            plate_slime.getChildByName("nail_polish_inslime").getComponent(cc.Sprite).spriteFrame = sp;
        });

        cc.audioEngine.playEffect(this.flyAudio, false);

        CocosHelper.showBackOut(liquid, ShowDirection.top, ()=>{

            liquid.getComponent(SpriteDrag).enabled = true;;

        });
    }
    nail_movebegin(){

        let icon_board = CocosHelper.findNode(cc.Canvas.instance.node, "ui_board");
        icon_board.active = false;
        let btn_reset = CocosHelper.findNode(cc.Canvas.instance.node, "btn_reset");
        btn_reset.active = false;

    }
    nail_moveEnd(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){
        let moveNode =  drag.moveNode;
        drag.enabled = false;

        let nail_move = CocosHelper.findNode(cc.Canvas.instance.node, "nail_move");


        nail_move.getChildByName("nail-polish_lid_").runAction(cc.fadeOut(0.25));;
        nail_move.getChildByName("nail-polish_lid").runAction(cc.fadeOut(0.25));

        var fallSpriteCm = moveNode.getComponent(fallSpriteCompoent);
        if(fallSpriteCm){
            fallSpriteCm.enabled = true;
            fallSpriteCm.bowlInFall.zIndex = this._step;
            fallSpriteCm.actionStartCallBack = ()=>{

                console.log(moveNode.name);
                
            };
            fallSpriteCm.actionEndCallBack = ()=>{
                
                cc.audioEngine.playEffect(this.flyAudioOut, false);
                CocosHelper.hideNode(nail_move, ShowDirection.right);
                this.changeStatus(true);
                this.selectItemName = "";
                this.toolBoardMiss();
                let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "box");
                let liquid_touch = bowl.getChildByName("nail_polish_touch");;

                bowl.getChildByName("nail_polish1").active = false;;
                bowl.getChildByName("nail_polish2").active = false;;
                bowl.getChildByName("nail_polish3").active = false;;
                bowl.getChildByName("nail_polish0").active = false;;
                
                this.doDealStep();
                liquid_touch.position = cc.v2(1000, 10000);
                liquid_touch.width = 0;
                liquid_touch.height = 0;
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


    showAir(){

        let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "air_move");
        
        liquid.position = cc.v2(167, 146);
        liquid.active = false;
        
        cc.audioEngine.playEffect(this.flyAudio, false);

        CocosHelper.showBackOut(liquid, ShowDirection.top, ()=>{

            liquid.on(cc.Node.EventType.TOUCH_START,this.airTouch,this);
            
        });

    }

    airTouch(){
        let icon_board = CocosHelper.findNode(cc.Canvas.instance.node, "ui_board");
        icon_board.active = false;
        let btn_reset = CocosHelper.findNode(cc.Canvas.instance.node, "btn_reset");
        btn_reset.active = false;
        let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "air_move");
        let air_in_touch = CocosHelper.findNode(cc.Canvas.instance.node, "air_in_touch");
        liquid.targetOff(this);
        
        let air_in = CocosHelper.findNode(cc.Canvas.instance.node, "air_in");
        ;
       
        air_in.runAction(cc.sequence(cc.moveTo(0.25,air_in.parent.convertToNodeSpaceAR( air_in_touch.convertToWorldSpaceAR(cc.v2(0, 0)))),cc.callFunc(()=>{

            air_in.active = false;
            air_in_touch.active = true;

            CocosHelper.hideNode(liquid, ShowDirection.right);

            air_in_touch.on(cc.Node.EventType.TOUCH_START,this.air_in_Touch,this);
            air_in_touch.on(cc.Node.EventType.TOUCH_END,this.air_in_TouchUp,this);

            let air_inslime = CocosHelper.findNode(cc.Canvas.instance.node, "air_inslime");
            air_inslime.active = true;
            air_inslime.scale = 0;
            air_inslime.zIndex = this._step;
            air_inslime.runAction(cc.sequence(cc.scaleTo(3.0, 1.0), cc.callFunc(()=>{
                
                // cc.audioEngine.stopAllEffects();
                cc.audioEngine.stopEffect(this.soundIndex);
                let air_in_touch = CocosHelper.findNode(cc.Canvas.instance.node, "air_in_touch");
                air_in_touch.targetOff(this);
                air_in_touch.getChildByName("air_in_touch_orgin").active = true;
                air_in_touch.getChildByName("air_in_touch_push").active = false;
                air_in_touch.getChildByName("air_in_touch_fall").active = false;

                cc.audioEngine.playEffect(this.flyAudioOut, false);
                CocosHelper.hideNode(air_in_touch, ShowDirection.right);
                this.changeStatus(true);
                this.selectItemName = "";
                this.toolBoardMiss();
                let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "box");
                let liquid_touch = bowl.getChildByName("air_touch");;
                bowl.getChildByName("air0").active = false;;
                liquid_touch.position = cc.v2(1000, 10000);
                liquid_touch.width = 0;
                liquid_touch.height = 0;
                this.doDealStep();
            })));

            cc.director.getActionManager().pauseTarget(air_inslime);

        })));

    }
    air_in_Touch(){
        let air_in_touch = CocosHelper.findNode(cc.Canvas.instance.node, "air_in_touch");
        air_in_touch.getChildByName("air_in_touch_orgin").active = false;
        air_in_touch.getChildByName("air_in_touch_push").active = true;
        air_in_touch.getChildByName("air_in_touch_fall").active = true;
        air_in_touch.getChildByName("air_in_touch_fall").opacity = 0;
        cc.audioEngine.stopEffect(this.soundIndex);
        this.soundIndex = cc.audioEngine.playEffect(this.sauceOut, true);
        air_in_touch.getChildByName("air_in_touch_fall").runAction(cc.sequence(cc.fadeIn(0.2), cc.callFunc(()=>{

            let air_inslime = CocosHelper.findNode(cc.Canvas.instance.node, "air_inslime");
            cc.director.getActionManager().resumeTarget(air_inslime);

            

        })));

    }
    air_in_TouchUp(){

        let air_in_touch = CocosHelper.findNode(cc.Canvas.instance.node, "air_in_touch");
        air_in_touch.getChildByName("air_in_touch_orgin").active = true;
        air_in_touch.getChildByName("air_in_touch_push").active = false;
        air_in_touch.getChildByName("air_in_touch_fall").active = false;

        let air_inslime = CocosHelper.findNode(cc.Canvas.instance.node, "air_inslime");
        cc.director.getActionManager().pauseTarget(air_inslime);
        //cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopEffect(this.soundIndex);
    }

    showmascara(index){

        let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "mascara_move");
        //CocosHelper.findNode(cc.Canvas.instance.node, "liquid_touch");
        liquid.getComponent(SpriteDrag).enabled = false;;
        liquid.stopAllActions();
        liquid.position = cc.v2(167, 146);
        liquid.active = false;
        this.selectlipstick = index;
        let array = ["mascara_blue","mascara_brown","mascara_orange","mascara_purple"];

        cc.loader.loadRes("makeupms/mascara/" + array[index] + 2, cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
                

            liquid.getChildByName("mascara_lid").getComponent(cc.Sprite).spriteFrame = sp;
        });

        cc.loader.loadRes("makeupms/mascara/" + array[index] + 1, cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
               

            liquid.getChildByName("mascara_blue1").getComponent(cc.Sprite).spriteFrame = sp;
        });

        cc.loader.loadRes("makeupms/mascara/" + array[index] + 0, cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
               

            liquid.getChildByName("mascara_blue0").getComponent(cc.Sprite).spriteFrame = sp;
        });
        cc.loader.loadRes("makeupms/mascara/" + array[index] + 0, cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
               

            liquid.getComponent(cc.Sprite).spriteFrame = sp;
        });
        

        cc.audioEngine.playEffect(this.flyAudio, false);

        CocosHelper.showBackOut(liquid, ShowDirection.top, ()=>{

            liquid.getComponent(SpriteDrag).enabled = true;;

        });
        this.lipstickNum = 0;
    }
    mascaraMoveIng = false;
    mascaraTouchBegin(){

        let icon_board = CocosHelper.findNode(cc.Canvas.instance.node, "ui_board");
        icon_board.active = false;
        let btn_reset = CocosHelper.findNode(cc.Canvas.instance.node, "btn_reset");
        btn_reset.active = false;

        // let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next");
        // btn_next.active = true;
        let mascara_move = CocosHelper.findNode(cc.Canvas.instance.node, "mascara_move");

        mascara_move.getChildByName("mascara_blue1").runAction(cc.fadeOut(0.5));

        this.mascaraMoveIng = false;
    }
    mascaraCanSauce = true;
    mascaraTouchIng(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){

        var angle = event.getLocation().angle(event.getPreviousLocation()) * 180 / Math.PI; //    cc.pToAngle(deltaP) / Math.PI * 180
        this.tempRotate = -angle;

        let mascara_move = CocosHelper.findNode(cc.Canvas.instance.node, "mascara_move");
        let bg = CocosHelper.findNode(cc.Canvas.instance.node, "bg");
        let plate_slime = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime");
        let pos = mascara_move.convertToWorldSpaceAR(cc.v2(0, -100));
        if( this.mascaraCanSauce &&  plate_slime.getBoundingBox().contains(plate_slime.parent.convertToNodeSpaceAR(pos))){
            this.mascaraCanSauce = false;
            let node = new cc.Node();
            node.parent = plate_slime;
            node.position = plate_slime.convertToNodeSpaceAR(pos);
            node.angle = -this.tempRotate;
            node.zIndex = this._step;
            console.log(this.tempRotate);
            

            let array = ["mascara_blue","mascara_brown","mascara_orange","mascara_purple"];

            // cc.audioEngine.stopAllEffects();
            cc.audioEngine.stopEffect(this.soundIndex);
            this.soundIndex = cc.audioEngine.playEffect(this.swip, false);
            //cc.audioEngine.playEffect(this.swip, false);

            cc.loader.loadRes("makeupms/mascara/small/" + array[this.selectlipstick], cc.SpriteFrame, function (err, sp) {
    
                if(err)
                    return;
                
                node.addComponent(cc.Sprite).spriteFrame = sp;
            });
            this.lipstickNum = this.lipstickNum + 1;

            if(this.lipstickNum == 4){

                let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next");
                let decorateParticle = CocosHelper.findNode(cc.Canvas.instance.node, "decorateParticle");
                
                if(!btn_next.active){

                    // btn_next.scale = 0;
                    
                    decorateParticle.position = cc.v2(0, 0);
                    decorateParticle.active = true;
                    decorateParticle.getComponent(cc.ParticleSystem).resetSystem();

                    cc.audioEngine.playEffect(this.doneAudio, false);
                    btn_next.active = true;
                    this.lipstickNum = -10000;
                    
                    
                }
            }
        }


        if(!this.mascaraMoveIng){
            this.mascaraMoveIng = true;
            
            bg.stopAllActions();
            bg.runAction(cc.repeatForever(cc.sequence(cc.callFunc(()=>{

                
                this.mascaraCanSauce = true;
                

            }),cc.delayTime(1.3))));
        }
        
        
    }
    mascaraTouchEnd(){

        let bg = CocosHelper.findNode(cc.Canvas.instance.node, "bg");
        bg.stopAllActions();
    }


    selectlipstick = 0;
    showlipstick(index){

        let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "lipstick");
        //CocosHelper.findNode(cc.Canvas.instance.node, "liquid_touch");
        liquid.getComponent(SpriteDrag).enabled = false;;
        liquid.stopAllActions();
        liquid.position = cc.v2(167, 146);
        liquid.active = false;
        this.selectlipstick = index;
        let array = ["lipstick_golden","lipstick_greed","lipstick_orange","lipstick_pink","lipstick_purple"];

        cc.loader.loadRes("makeupms/lipstick/" + array[index], cc.SpriteFrame, function (err, sp) {

            if(err){
                console.log(err + "");
                
                return;
            }
               

            liquid.getComponent(cc.Sprite).spriteFrame = sp;
        });

        cc.audioEngine.playEffect(this.flyAudio, false);

        CocosHelper.showBackOut(liquid, ShowDirection.top, ()=>{

            liquid.getComponent(SpriteDrag).enabled = true;;

        });
        this.lipstickNum = 0;
    }

    tempRotate = 0;
    lipstickmove = false;
    lipstickTouchBegin(){

        let icon_board = CocosHelper.findNode(cc.Canvas.instance.node, "ui_board");
        icon_board.active = false;
        let btn_reset = CocosHelper.findNode(cc.Canvas.instance.node, "btn_reset");
        btn_reset.active = false;

        let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "lipstick");
        this.lipstickmove = false;
        let bg = CocosHelper.findNode(cc.Canvas.instance.node, "bg");
        bg.stopAllActions();
        this.lipsticCankmove = false;
    }
    lipsticCankmove = true;

    lipstickNum = 0;

    lipstickTouchIng(event:cc.Event.EventTouch, drag:SpriteDrag, lisenter:DragEventListener, data:string){

        var angle = event.getLocation().angle(event.getPreviousLocation()) * 180 / Math.PI; //    cc.pToAngle(deltaP) / Math.PI * 180
        this.tempRotate = -angle;
        let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "lipstick");
        let pos = liquid.convertToWorldSpaceAR(cc.v2(0, 100));
        let plate_slime = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime");
        
        if(this.lipsticCankmove && plate_slime.getBoundingBox().contains(plate_slime.parent.convertToNodeSpaceAR(pos))){
            this.lipsticCankmove = false;
            let node = new cc.Node();
            node.parent = plate_slime;
            node.position = plate_slime.convertToNodeSpaceAR(pos);
            node.angle = -this.tempRotate;
            node.zIndex = this._step;
            console.log(this.tempRotate);
            
            let array = ["lipstick_golden","lipstick_greed","lipstick_orange","lipstick_pink","lipstick_purple"];

            //cc.audioEngine.stopAllEffects();
            cc.audioEngine.stopEffect(this.soundIndex);
            this.soundIndex = cc.audioEngine.playEffect(this.swip, false);
            cc.loader.loadRes("makeupms/lipstick/small/" + array[this.selectlipstick], cc.SpriteFrame, function (err, sp) {
    
                if(err)
                    return;
                
                node.addComponent(cc.Sprite).spriteFrame = sp;
            });


            this.lipstickNum = this.lipstickNum + 1;

            if(this.lipstickNum == 4){

                let btn_next = CocosHelper.findNode(cc.Canvas.instance.node, "btn_next");
                let decorateParticle = CocosHelper.findNode(cc.Canvas.instance.node, "decorateParticle");
                
                if(!btn_next.active){

                    
                    // btn_next.scale = 0;
                    decorateParticle.position = cc.v2(0, 0);
                    decorateParticle.active = true;
                    decorateParticle.getComponent(cc.ParticleSystem).resetSystem();

                    cc.audioEngine.playEffect(this.doneAudio, false);
                    btn_next.active = true;
                    this.lipstickNum = -10000;
                    
                    
                }
            }

            
        }

        if(!this.lipstickmove){
            // setTimeout(() => {
            //     this.lipsticCankmove = true;
            // }, 500);
            this.lipstickmove = true;
            let bg = CocosHelper.findNode(cc.Canvas.instance.node, "bg");
            bg.stopAllActions();
            let plate_slime = CocosHelper.findNode(cc.Canvas.instance.node, "plate_slime");
            bg.runAction(cc.repeatForever(cc.sequence(cc.callFunc(()=>{
    
                this.lipsticCankmove = true;
    
            }),cc.delayTime(1.3))));
        }

        
    }
    lipstickTouchEnd(){

        let bg = CocosHelper.findNode(cc.Canvas.instance.node, "bg");
        bg.stopAllActions();
    }

    showLiquid(index){

        let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "liquid");
        let liquid_touch = liquid.getChildByName("liquid_touch");//CocosHelper.findNode(cc.Canvas.instance.node, "liquid_touch");
        liquid.stopAllActions();
        liquid.position = cc.v2(171,112);
        liquid.active = false;
        if(index == 1){

            liquid.getChildByName("liquid_up").getComponent(cc.Sprite).spriteFrame = this.liquidSprime;

            liquid_touch.getChildByName("liquid_fall1").getComponent(cc.Sprite).spriteFrame = this.liquidSprime1;
            liquid_touch.getChildByName("liquid_fall2").getComponent(cc.Sprite).spriteFrame = this.liquidSprime1;
            liquid_touch.getChildByName("liquid_fall3").getComponent(cc.Sprite).spriteFrame = this.liquidSprime1;

        }else{

            liquid.getChildByName("liquid_up").getComponent(cc.Sprite).spriteFrame = liquid.getComponent(cc.Sprite).spriteFrame;
            liquid_touch.getChildByName("liquid_fall1").getComponent(cc.Sprite).spriteFrame = this.liquidSprime2;
            liquid_touch.getChildByName("liquid_fall2").getComponent(cc.Sprite).spriteFrame = this.liquidSprime2;
            liquid_touch.getChildByName("liquid_fall3").getComponent(cc.Sprite).spriteFrame = this.liquidSprime2;

        }

        cc.audioEngine.playEffect(this.flyAudio, false);

        CocosHelper.showBackOut(liquid, ShowDirection.top);

        liquid.on(cc.Node.EventType.TOUCH_START,this.liquidTouch,this);
    }

    private liquidTouchIndex = 0;
    private isTouchTool = false;
    liquidTouch(){
        let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "liquid");
        let liquid_touch = liquid.getChildByName("liquid_touch");;

        if(this.isTouchTool)
            return 
        this.isTouchTool = true;

        this.hideUi();
        //打开盖子
        if(this.liquidTouchIndex == 0){

            let liquid_lid = liquid.getChildByName("liquid_lid");

            liquid_lid.runAction(cc.sequence(cc.moveBy(0.5, cc.v2(0, 50)),cc.callFunc(()=>{

                this.isTouchTool = false;

            }), cc.fadeOut(0.5)));

            
            this.liquidTouchIndex = this.liquidTouchIndex + 1;

        }else{

            let liquid_fall = liquid_touch.getChildByName("liquid_fall" + this.liquidTouchIndex);
            liquid_fall.active = true;
            liquid_fall.scale = 0;
            
            // cc.scaleTo(1.0, -1.0, 1.0),
            
            liquid.runAction(cc.rotateTo(0.25, -19));

            liquid_touch.runAction(cc.sequence(cc.moveBy(0.5, cc.v2(0, -20)),cc.callFunc(()=>{})));

            cc.audioEngine.playEffect(this.push, false);
            
            liquid_fall.runAction(cc.sequence(cc.scaleTo(0.5, -1.0, 1.0),cc.callFunc(()=>{
                
                let pos = liquid_fall.parent.convertToWorldSpaceAR(liquid_fall.position);

                let plate_slime = CocosHelper.findNode(cc.Canvas.instance.node, "content_tool").getChildByName("plate").getChildByName("plate_slime");
                
                liquid_fall.parent = plate_slime;
                liquid_fall.position = liquid_fall.parent.convertToNodeSpaceAR(pos);
                liquid_fall.zIndex = this._step;
                
                let X = 200 - Math.random() * 400;
                let Y = 90 - Math.random() * 170;
                console.log(X + "  " + Y);
                
                liquid_touch.runAction(cc.sequence(cc.moveBy(0.5, cc.v2(0, 20)),cc.callFunc(()=>{})));
                liquid_fall.runAction(cc.sequence(cc.delayTime(0.01),cc.jumpTo(0.5, cc.v2(X, Y), 50, 1), cc.callFunc(()=>{
                    this.liquidTouchIndex = this.liquidTouchIndex + 1;
                    this.isTouchTool = false;
                    if(this.liquidTouchIndex == 4){
                        this.isTouchTool = false;
                        cc.audioEngine.playEffect(this.flyAudioOut, false);
                        CocosHelper.hideNode(liquid, ShowDirection.right);
                        this.changeStatus(true);
                        this.selectItemName = "";
                        this.toolBoardMiss();
                        let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
                        let liquid_touch = bowl.getChildByName("liquid_touch");;

                        liquid_touch.position = cc.v2(1000, 10000);
                        liquid_touch.width = 0;
                        liquid_touch.height = 0;
                        this.doDealStep();
                    }

                })));


            })));

        }

    }


    touchBtnDone(event, customEventData){

        var node = event.target;
        node.active = false;

        cc.audioEngine.playEffect(this.touchBtnAudio, false);
        this.toolBoardMiss();

        if(this.selectItemName == "lipstick"){

            let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "lipstick");
            liquid.getComponent(SpriteDrag).enabled = false;
            cc.audioEngine.playEffect(this.flyAudioOut, false);
            CocosHelper.hideNode(liquid, ShowDirection.left);
            this.changeStatus(true);
            this.selectItemName = "";
            this.toolBoardMiss();
            let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
            let liquid_touch = bowl.getChildByName("lipstick_touch");;

            bowl.getChildByName("lipstick0").active = false;;
            bowl.getChildByName("lipstick1").active = false;;
            bowl.getChildByName("lipstick2").active = false;;

            liquid_touch.position = cc.v2(1000, 10000);
            liquid_touch.width = 0;
            liquid_touch.height = 0;
            this.doDealStep();
        }else if(this.selectItemName == "mascara"){
            
            let liquid = CocosHelper.findNode(cc.Canvas.instance.node, "mascara_move");
            liquid.getComponent(SpriteDrag).enabled = false;
            cc.audioEngine.playEffect(this.flyAudioOut, false);
            CocosHelper.hideNode(liquid, ShowDirection.left);
            this.changeStatus(true);
            this.selectItemName = "";
            this.toolBoardMiss();
            let bowl = CocosHelper.findNode(cc.Canvas.instance.node, "mascara");
            let liquid_touch = bowl.getChildByName("mascara_touch");;
            liquid_touch.position = cc.v2(1000, 10000);
            liquid_touch.width = 0;
            liquid_touch.height = 0;
            bowl.getChildByName("mascara0").active = false;;
            bowl.getChildByName("mascara1").active = false;;
            bowl.getChildByName("mascara2").active = false;;
            bowl.getChildByName("mascara3").active = false;;
            bowl.getChildByName("mascara4").active = false;;
            this.doDealStep();
        }

    }
    touchBtnReset(){
        cc.audioEngine.playEffect(this.touchBtnAudio, false);
        this.toolBoardMiss();
    }

    hideUi(){

        this.showBtn(false);
        let icon_board = CocosHelper.findNode(cc.Canvas.instance.node, "ui_board");
        icon_board.active = false;
        
    }

    toolBoardMiss(){

        this.showBtn(false);
        let icon_board = CocosHelper.findNode(cc.Canvas.instance.node, "ui_board");
        icon_board.active = false;
        this.changeStatus(true);

        this.toolFly(this.selectItemName, ()=>{
            //禁用按钮
            this.touchNodeVector.forEach(element => {
                element.getComponent(cc.Button).interactable = true;
            });

        }, false);


    }

    showNextBtn(){

        let array = ["btn_next"];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
            let node:cc.Node = CocosHelper.findNode(cc.Canvas.instance.node, element);
            
            node.active = true;
            node.opacity = 0;

            //cc.Widget 存在  执行进入动画 延迟一帧

            setTimeout(() => {
                
                let endPosiont = node.position;
                let statPos:cc.Vec2 = endPosiont.sub(cc.v2(400, 0));
                node.setPosition(statPos);
                node.runAction(cc.sequence(cc.spawn(cc.moveTo(0.56, endPosiont), cc.fadeIn(0.5)), cc.callFunc(()=>{

                })));

            }, 100);

        }

    }
    showBtn(isShow){    
        // "btn_next", 
        let array = ["btn_reset"];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
            let node:cc.Node = CocosHelper.findNode(cc.Canvas.instance.node, element);
            
            if(!isShow){

                node.active = false;

            }else{

                node.active = true;
                node.opacity = 0;
    
                //cc.Widget 存在  执行进入动画 延迟一帧
    
                setTimeout(() => {
                    
                    let endPosiont = node.position;
                    let statPos:cc.Vec2 = endPosiont.sub(cc.v2(400, 0));
                    node.setPosition(statPos);
                    node.runAction(cc.sequence(cc.spawn(cc.moveTo(0.56, endPosiont), cc.fadeIn(0.5)), cc.callFunc(()=>{
    
                    })));
    
                }, 100);

            }


        }

    }

    toolFly(customEventData, call:() => void, isMiss){

        let tempDetal = isMiss ? 500 : -500;


        if(customEventData == ""){


            if(call)
                call();
            return;
        }

        let nodeVector:cc.Node[] = [];
        for (let index = 0; index < 5; index++) {
            console.log(customEventData + index);
            let node:cc.Node = CocosHelper.findNode(cc.Canvas.instance.node, customEventData + index);
            
            if(!node)
                break
            nodeVector.push(node);
            console.log(node.name);
        }

        cc.audioEngine.playEffect(this.flyTop, false);

        for (let index = 0; index < nodeVector.length; index++) {
            const moveNode = nodeVector[index];
            moveNode.zIndex = 100;
            moveNode.runAction(cc.sequence(cc.delayTime(index * 0.05),cc.moveBy(0.3, cc.v2(0, tempDetal)),cc.callFunc(()=>{
                moveNode.zIndex = 2;
                if(index == nodeVector.length - 1){

                    if(call)
                        call();

                }

            })));

        }

    }

    //点击到工具的状态
    changeStatus(isShow){

        let array = ["bowl", "box", "mascara", "light0", "bg_t"];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let bowl = CocosHelper.findNode(cc.Canvas.instance.node, element);
            this.doGrey(bowl,isShow);
        }

    }

    doGrey(node:cc.Node,isShow){
        let tempDetal = isShow ? 255 : 100;
        node.color = new cc.Color(tempDetal, tempDetal, tempDetal, 255);
        node.children.forEach(element => {  

            element.color = new cc.Color(tempDetal, tempDetal, tempDetal, 255);
            
        });

    }

    // update (dt) {}
}
