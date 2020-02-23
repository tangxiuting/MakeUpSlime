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

//容器内倒入材料
export enum nodefallType {
    eFallSprite,   //倒入液体 帧动画
    eFallParticle, //倒入 粒子效果
}
//容器内材料类型
export enum nodeInType {
    eInMask,   //往下移动消失
    eInSprite, //换一张图片 渐变消失
}

//倒入材料   名字设定 xxx_fall   xxx_p
@ccclass
export default class fallSpriteCompoent extends cc.Component {

    @property({type:[cc.SpriteFrame],tooltip:"倒入液体的图片"})
    spritePaths:cc.SpriteFrame[] = [];

    @property({type:[cc.SpriteFrame],tooltip:"倒入碗里面渐变的图片"})
    fallBowlInPaths:cc.SpriteFrame[] = [];

    @property({type:cc.Enum(nodefallType),tooltip:"容器倒入材料效果 粒子或者图片帧动画"})
    nodeFallType: nodefallType = nodefallType.eFallSprite;

    @property({type:cc.Enum(nodeInType),tooltip:"容器内材料效果 往下沉或者渐变消失"})
    nodeInType: nodeInType = nodeInType.eInMask;

    @property({tooltip:"旋转角度"})
    rotate:number = 0;

    @property({type:cc.Node, tooltip:"倒入的容器 比如碗"})
    bowlNode:cc.Node = null;

    @property({tooltip:"是否上下左右移动"})
    isFallMove: boolean  = false;

    @property({type:cc.SpriteFrame, tooltip:"容器内材料是否换图片 比如倒水倒牛奶,旋转之后需要换图片"})
    nodeInGoodsSpriteFrame: cc.SpriteFrame  = null;

    @property({type:cc.SpriteFrame, tooltip:"容器是否换图片 比如倒粉, 袋子要换成一个有缺口的"})
    nodechangeSpriteFrame: cc.SpriteFrame  = null;

    @property({type:cc.Vec2, tooltip:"以倒入容器比如碗的中点为准，偏移量"})
    offect: cc.Vec2  = cc.v2(0, 0);

    @property({type:cc.Vec2, tooltip:"工具的移动偏移量"})
    moveoffect: cc.Vec2  = cc.v2(0, 0);

    @property({tooltip:"总共的时间"})
    totalTime: number  = 3;

    @property({type:cc.AudioClip,tooltip:"倒入的音效"})
    audioFall: cc.AudioClip  = null;

    @property({type:cc.Node, tooltip:"倒入碗里面的东西"})
    bowlInFall:cc.Node = null;
    

    private current:number = -1;
    //倒材料帧动画
    private _blendaction:cc.FiniteTimeAction = null;

    //开始倒的回调
    public actionStartCallBack : () => void;
    public actionEndCallBack : () => void;
    start () {

        let nodeNmae = this.node.name;
        //转换坐标
        let bowlWorls = this.bowlNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let moveToPos = cc.v2(this.offect.x + bowlWorls.x, this.offect.y + bowlWorls.y);

        let nowPos = this.node.parent.convertToNodeSpaceAR(moveToPos);
        let self = this;
        this.rotate = -this.rotate;
        //旋转移动
        let action = new cc.Tween().target(this.node).to(1, { position: nowPos, rotation: this.rotate },null)
        .call(()=>{

            if(self.fallBowlInPaths.length != 0){

                if(self.bowlInFall){
                    //碗内的东西出现
                    self.bowlInFall.active = true;
                    self.bowlInFall.opacity = 0;
                    self.bowlInFall.runAction(cc.sequence(cc.fadeIn(1.0), cc.callFunc(function () {
                        
                        let sp = self.bowlInFall.getComponent(cc.Sprite);
                        let blenderMix :cc.FiniteTimeAction[] = [];
                        for(let s of self.fallBowlInPaths){
                            blenderMix.push(cc.callFunc(function(){
                                sp.spriteFrame = s;
                            }));
                            blenderMix.push(cc.delayTime(0.5));
                        }
                        let _blendaction = cc.sequence(blenderMix);
                        self.bowlInFall.runAction(_blendaction);

                    })));
                    
                }
                
            }else{

                if(self.bowlInFall){
                    //碗内的东西出现
                    self.bowlInFall.active = true;
                    self.bowlInFall.opacity = 0;
                    self.bowlInFall.runAction(cc.sequence(cc.delayTime(0.5),cc.fadeIn(this.totalTime - 0.5)));
                }

            }

            if(this.nodechangeSpriteFrame){

                let sp = this.node.getComponent(cc.Sprite);
                sp.spriteFrame = this.nodechangeSpriteFrame;
                    
            }   


            //开始倒
            if(self.actionStartCallBack){
                self.actionStartCallBack();
            }

            if(this.audioFall)
                this.current = cc.audioEngine.play(this.audioFall, true, 1);

            //回调
            //倒材料 帧动画
            if(this.nodeFallType == nodefallType.eFallSprite && this._blendaction == null){
                let fallNode = CocosHelper.findNode(this.node, this.node.name + "_fall");
                fallNode.active = true;
                let sp = fallNode.getComponent(cc.Sprite);
                let blenderMix :cc.FiniteTimeAction[] = [];
                for(let s of this.spritePaths){
                    blenderMix.push(cc.callFunc(function(){
                        sp.spriteFrame = s;
                    }));
                    blenderMix.push(cc.delayTime(0.15));
                }
                this._blendaction = cc.repeatForever(cc.sequence(blenderMix));
                fallNode.runAction(this._blendaction);
            }

            //倒材料 粒子效果 暂缺
            if(this.nodeFallType == nodefallType.eFallParticle){
                let fallNode = CocosHelper.findNode(this.node, this.node.name + "_p")
                fallNode.active = true;
                let p = fallNode.getComponent(cc.ParticleSystem);;
                p.resetSystem();
                
                let fallNodeIn = CocosHelper.findNode(this.node, this.node.name + "_in");
                if(fallNodeIn){
                    fallNodeIn.active = true;
                    let sp = fallNodeIn.getComponent(cc.Sprite);
                    if(this.nodeInGoodsSpriteFrame){

                        sp.spriteFrame = this.nodeInGoodsSpriteFrame;

                        let fadeOut = cc.fadeOut(this.totalTime + 0.5);
                        fallNodeIn.runAction(fadeOut);

                    }else{

                        let fadeOut = cc.fadeOut(this.totalTime + 0.5);
                        fallNodeIn.runAction(fadeOut);

                    }
                    
                }


            }
            //杯子内材料 渐变消失
            if(this.nodeInType == nodeInType.eInSprite){
                let fallNodeIn = CocosHelper.findNode(this.node, this.node.name + "_in");
                if(fallNodeIn){
                    fallNodeIn.active = true;
                    let sp = fallNodeIn.getComponent(cc.Sprite);
                    if(this.nodeInGoodsSpriteFrame){

                        sp.spriteFrame = this.nodeInGoodsSpriteFrame;

                    }
                    let fadeOut = cc.fadeOut(this.totalTime);
                    fallNodeIn.runAction(fadeOut);
                }
                
            }
            //杯子内材料 移动消失 暂缺
            if(this.nodeInType == nodeInType.eInMask){


            }

            if(this.isFallMove){
                let moveOne = cc.v2(-this.moveoffect.x, -this.moveoffect.y);
                let moveTwo = cc.v2(this.moveoffect.x, this.moveoffect.y);

                let moveBy1 = cc.moveBy(this.totalTime / 2, moveOne);
                let moveBy2 = cc.moveBy(this.totalTime / 2, moveTwo);
                let self = this;
                let se = cc.sequence(moveBy1, moveBy2, cc.callFunc(function () {
                    
                    self.moveOut();

                }))
                this.node.runAction(se);
            }else{
                let self = this;
                let se = cc.sequence(cc.delayTime(this.totalTime), cc.callFunc(function () {
                    
                    self.moveOut();
                }))
                this.node.runAction(se);
            }

        })
        .start();
    }
    //消失出去
    moveOut(){
        let self = this;
        
        //停止音效
        cc.audioEngine.stop(this.current);

        let fallNodeP = CocosHelper.findNode(self.node, self.node.name + "_p");
        let fallNodefall = CocosHelper.findNode(self.node, self.node.name + "_fall");
        if(fallNodeP)
            fallNodeP.active = false;
        if(fallNodefall)
            fallNodefall.active = false;

        let moveBy1 = cc.moveBy(1, cc.v2(1000, 0));
        let moveBy2 = cc.rotateTo(1, 0);
        let se = cc.sequence(cc.spawn(moveBy1, moveBy2), cc.callFunc(function () {
                    
            self.node.active = false;
            //动画完成之后的回调
            if(self.actionEndCallBack)
                self.actionEndCallBack();

        }))
        this.node.runAction(se);
    }
    // update (dt) {}
}
