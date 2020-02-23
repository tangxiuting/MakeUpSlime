import   NodeTransform from "../utils/NodeTransformMS";
import SpriteDrag from "./SpriteDragMS";
import DragEventListener, { DragEventType } from "./DragEventListenerMS";
import EventListener from "../EventListenerMS";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property,requireComponent} = cc._decorator;

@ccclass
@requireComponent(SpriteDrag)
export default class DragFall extends cc.Component {
    @property({type:NodeTransform})
    fallPos:NodeTransform = new NodeTransform();

    @property({type:cc.ParticleSystem})
    fallParticle:cc.ParticleSystem = null;

    @property({type:cc.Node})
    inBowl:cc.Node = null;

    @property({type:[EventListener]})
    fallLis:EventListener[] = [];

    @property({type:cc.SpriteFrame})
    pourFrame:cc.SpriteFrame = null;

    @property()
    pourTime:number = 2;

    @property(cc.Node)
    fallSprite:cc.Node = null;
    @property({type:[cc.SpriteFrame],visible(){return this.fallSprite != null}})
    fallAnimation:cc.SpriteFrame[] = [];

    static fallStart:string = "startFall";
    static fallEnd:string = "stopFall";
    private moveToFallTime:number = 0.4;
    private drag:SpriteDrag = null;
    private fallAAction:cc.Action = null;
    start () {
        this.initData();
    }
  
    initData() {
        if(this.drag == null){
            this.drag = this.getComponent(SpriteDrag);
            this.drag.eventTouchs.push(new DragEventListener(this,"dragToBowl",DragEventType.TouchEnd));

             let funcNames:string[] = ["startFall","stopFall"];
             for(let lisN of funcNames){
                this.fallLis.push(new EventListener(this,lisN,lisN));
             }
        }

        if(this.fallSprite == null){
            this.fallSprite = this.node.getChildByName("fallSprite");
        }

        if(this.fallParticle == null){
            let particle = this.node.getChildByName("particle");
            if(particle != null){
                this.fallParticle = particle.getComponent(cc.ParticleSystem);
            }
        }

       
    }

    dragToBowl(_touch:cc.Event.EventTouch, _lis:SpriteDrag) {
        _lis.enabled = false;
        let _tween = new cc.Tween();
        _tween.target(_lis.moveNode).to(this.moveToFallTime,{
            position:this.fallPos.pos,
            scaleX:this.fallPos.scale.x,
            scaleY:this.fallPos.scale.y,
            rotation:this.fallPos.rotate
        },null).call(()=>{
            for(let _lis of this.fallLis){
                _lis.emit(DragFall.fallStart,this);
            }
        }).start();
    }

    startFall(){
        do{
            if(this.fallSprite==null){
                break;
            } 
            this.fallSprite.active = true; 
            if(this.fallAAction != null){
                break;
            }
            if(this.fallAnimation.length<=0){
                break;
            }
            let sp = this.fallSprite.getComponent(cc.Sprite);
            let blenderMix :cc. FiniteTimeAction[] = [];
            for(let s of this.fallAnimation){
                blenderMix.push(cc.callFunc(function(){
                    sp.spriteFrame = s;
                }));
                blenderMix.push(cc.delayTime(0.15));
            }
            this.fallAAction = cc.repeatForever(cc.sequence(blenderMix));
            this.fallSprite.runAction(this.fallAAction);
        }while(false);
        

        if(this.fallParticle != null){
            this.fallParticle.resetSystem();
        }
        if(this.pourFrame != null){
            let node = this.node;
            
            let movingNode = this.node.getChildByName("moving");
            if(movingNode != null){
                node = movingNode;
            }else {
                let noshade = this.node.getChildByName("noshade");
                if(noshade != null){
                    node = noshade;
                }
            }

            let sp = node.getComponent(cc.Sprite);
            if(sp){
                sp.spriteFrame = this.pourFrame;
            }
        }
    }

    stopFall(){
        do{
            if(this.fallSprite==null){
                break;
            } 
            this.fallSprite.active = false; 
            if(this.fallAAction == null){
                break;
            }
            this.fallSprite.stopAction(this.fallAAction);
            this.fallAAction = null;
        }while(false);
        if(this.fallParticle != null){
            let pos = this.fallParticle.node.parent.convertToWorldSpaceAR(this.fallParticle.node.position);
            this.fallParticle.node.parent = this.node.parent;
            this.fallParticle.node.setSiblingIndex(this.node.getSiblingIndex());
            this.fallParticle.node.position = this.fallParticle.node.parent.convertToNodeSpaceAR(pos);
            this.fallParticle.node.rotation = this.fallParticle.node.rotation +this.node.rotation;
            this.fallParticle.stopSystem();
        }
    }
    // update (dt) {}
}
