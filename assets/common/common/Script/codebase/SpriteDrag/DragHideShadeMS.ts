import SpriteDrag from "./SpriteDragMS";
import DragEventListener, { DragEventType } from "./DragEventListenerMS";

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
export default class DragHideShade extends cc.Component {

    @property(cc.SpriteFrame)
    movingFrame:cc.SpriteFrame = null;

    private noshade:cc.Node = null;
    private movingNode:cc.Node = null;
    private m_orignalFrame:cc.SpriteFrame = null;

    private thisNodeAction:cc.Tween = null;
    private changeSprite:cc.Sprite = null;
    private drag:SpriteDrag = null;
    start () {
        this.noshade = this.node.getChildByName("noshade");
        this.movingNode = this.node.getChildByName("moving");
        if(this.movingNode != null){
            this.movingNode.active = true;
        }
        if(this.noshade != null){
            let sp = this.noshade.getComponent(cc.Sprite);
            if(sp != null){
                this.changeSprite = sp;
                this.m_orignalFrame = sp.spriteFrame;
            }
        }else {
            let sp = this.getComponent(cc.Sprite);
            if(sp != null){
                this.changeSprite = sp;
                this.m_orignalFrame = sp.spriteFrame;
            }
        }
        
        if(this.drag == null){
            this.drag = this.getComponent(SpriteDrag);
            if(this.drag != null){
                let _touCancle = new DragEventListener();
                _touCancle.dragType = DragEventType.TouchCancle;
                _touCancle.eventHander.handler = "moveBack";
                _touCancle.eventHander.component = "DragHideShade";
                _touCancle.eventHander.target = this.node;
                this.drag.eventTouchs.push(_touCancle);
    
                let _dragBegin = new DragEventListener();
                _dragBegin.dragType = DragEventType.DragBegin;
                _dragBegin.eventHander.handler = "startMove";
                _dragBegin.eventHander.component = "DragHideShade";
                _dragBegin.eventHander.target = this.node;
                this.drag.eventTouchs.push(_dragBegin);
            }
        }
    }

 

    startMove(){
        if(this.movingNode != null || this.noshade != null){
            let s = this.getComponent(cc.Sprite)
            if(s)
               s.enabled = false;
        }
        if(this.movingNode != null){
            this.movingNode.active = true;
            if(this.noshade  != null){
                this.noshade.active = false;
            }
        }

        if(this.movingFrame != null&& this.changeSprite != null){
            this.changeSprite.spriteFrame = this.movingFrame;
        }
    }

    moveBack(){
        if(this.movingNode != null || this.noshade != null){
            let s = this.getComponent(cc.Sprite)
            if(s)
               s.enabled = true;
        }
        if(this.movingNode != null){
            this.movingNode.active = false;
            if(this.noshade  != null){
                this.noshade.active = true;
            }
        }

        if(this.movingFrame != null&& this.changeSprite != null&&this.m_orignalFrame != null){
            this.changeSprite.spriteFrame = this.m_orignalFrame;
        }
    }
    // update (dt) {}
}
