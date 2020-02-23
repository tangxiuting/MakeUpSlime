/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-05 09:47:01
 * @LastEditTime: 2019-08-13 09:24:17
 * @LastEditors: Please set LastEditors
 */
import NodeComp = require('../utils/NodeCompMS');
import { DragUtil, TweenType } from "./DragUtilMS";
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


//const {ccclass, property,requireComponent} = cc._decorator;
//const {ccclass, property,executionOrder,requireComponent} = cc._decorator;


export enum DragType {
    EndInTouchPos,
    BackToStart,
    LimitInTarget
}

const {ccclass, property,executionOrder,disallowMultiple,menu,executeInEditMode,requireComponent} = cc._decorator;
@ccclass
@executionOrder(1)
@disallowMultiple()
//@menu("common/SpriteDragEventManagerMS")
@executeInEditMode()
@requireComponent(NodeComp)
export default class SpriteDragEventManager extends cc.Component {

    @property({type:[DragEventListener],tooltip:"监听事件"})
    eventTouchs:DragEventListener[]=[];

    @property({type:[cc.Collider],tooltip:"拖动到的目标区域"})
    targetCollider:cc.Collider[] = [];

    @property({type:cc.Collider,tooltip:"节点响应TOUCH_START的范围,默认为结点自身大小,超过节点自身大小无用"})
    touch_collider:cc.Collider = null;

    @property({type:cc.Node,tooltip:"拖动的结点，默认为当前结点"})
    moveNode:cc.Node = null;

    @property({type:cc.Collider, tooltip:"节点响应与目标区域碰撞的范围,默认touch_collider" })
    self_collider:cc.Collider = null;

    @property({})
    isSwallowTouches:boolean = true;

    @property({tooltip:"在拖动时是否固定moveNode的原点"})
    isDragOriginPoint:boolean = false;
    @property({tooltip:"拖动时的偏移值",visible(){return this.isDragOriginPoint;}})
    dragOffset:cc.Vec2 = cc.Vec2.ZERO;
    @property({tooltip:"拖动时是否显示到最上层"})
    isDragToTop:boolean = false;
    @property({tooltip:"拖动时的缩放,默认为节点当前scale"})
    dragScale:cc.Vec2 = null;
    @property({tooltip:"拖动时的旋转,默认为节点当前Rotation"})
    dragRotate:number = null;

    @property({type:cc.Enum(DragType),tooltip:"返回时效果"})
    dragType: DragType = DragType.EndInTouchPos;
    @property({tooltip:"效果时间",visible(){return this.dragType == DragType.BackToStart;}})
    backDuring:number = 0.4;
    @property({type:cc.Enum(TweenType),tooltip:"返回时Easing效果", visible(){return this.dragType == DragType.BackToStart;}})
    backEasingType:TweenType = TweenType.backOut;
    
    cacheMoveToPos:cc.Vec2;
    private isTouch:boolean  = false;
    private isDraging:boolean = false;
    private isCanDrag:boolean = true;
    private m_dragMoveDamp:number = 0;
    private m_originalPos:cc.Vec2;
    private m_originalScale:cc.Vec2;
    private m_originalRotate:number;
    private m_originalSiblingIndex:number;
    private m_dragOffset:cc.Vec2;
    private backEasing:string;
    private backTween:cc.Tween = null;

    private _listener = null;
    private _lisCancele = null;
    private static OnApplicationFocus = "OnApplicationFocus";

    private _moveDeta = cc.Vec2.ZERO;
    private isMoveOut = false;

    private initData () {  
        cc.director.getCollisionManager().enabled = true;
       // cc.director.getCollisionManager().enabledDebugDraw = true;

        if(this.touch_collider == null){
                let _box = this.node.addComponent(cc.BoxCollider);
                let _ar = this.node.getAnchorPoint();
                let _size = this.node.getContentSize();
                _box.offset = new cc.Vec2((0.5-_ar.x)*_size.width,(0.5-_ar.y)*_size.height);
                _box.size = this.node.getContentSize();
               this.touch_collider = _box;
         }
        

        if(this.self_collider == null){
            this.self_collider = this.touch_collider;
        }

        if(this.moveNode == null) {
            this.moveNode = this.node;
        }
  

        this.m_originalPos = this.moveNode.position;
        this.m_originalScale = new cc.Vec2(this.moveNode.scaleX,this.moveNode.scaleY)
        this.m_originalRotate = this.moveNode.rotation;
        this.m_originalSiblingIndex = this.moveNode.getSiblingIndex();

        if(this.dragScale == null){
            this.dragScale = this.m_originalScale;
        }
        if(this.dragRotate == null){
            this.dragRotate = this.m_originalRotate;
        }
        this.backEasing = Object.keys(TweenType)[this.backEasingType];
       
    }

 

cancle(touch, event){
        var node = this.node;
        event.type = SpriteDrag.OnApplicationFocus;
        event.touch = touch;
        event.bubbles = true;
        node.dispatchEvent(event);
    }

   hitTest(point,listener){
    if(listener != null){
        if(this._listener == null){
            this._listener = listener;
            this._lisCancele = listener.onTouchCancelled;
        }
        listener.onTouchCancelled = this.cancle.bind(this);
    }
       return DragUtil.pointInCollide(this.getWordPos(point),this.touch_collider);
   }

    private initDataInEDITOR(){
         if(this.dragScale == null){
            this.dragScale = new cc.Vec2(this.node.scaleX,this.node.scaleY);
        }
        if(this.dragRotate == null){
            this.dragRotate = this.node.rotation;
        }
    }

    private getWordPos(cameraPos:cc.Vec2):cc.Vec2 {
        let wordPos:cc.Vec2;
        if(this.node != null){
            let _camr = cc.Camera.findCamera(this.node);
            if(_camr != null){
                let p =  _camr.getScreenToWorldPoint(cameraPos,wordPos);
                return cc.v2(p.x,p.y)
            }
        }
        return cameraPos;
   }

   geOriginalPos():cc.Vec2{
       return this.m_originalPos;
   }

   saveOrignialTransfor(){
       if(this.moveNode != null){
        this.m_originalPos = this.moveNode.position;
        this.m_originalScale = new cc.Vec2(this.moveNode.scaleX,this.moveNode.scaleY)
        this.m_originalRotate = this.moveNode.rotation;
        this.m_originalSiblingIndex = this.moveNode.getSiblingIndex();
       }

   }

    getInTargetIndex(offset0:cc.Vec2=cc.Vec2.ZERO,offset1:cc.Vec2=cc.Vec2.ZERO):number{
    　for (let i=0; i<this.targetCollider.length; i++){
        let _target = this.targetCollider[i];
        if(DragUtil.collideInCollie(this.self_collider,_target,offset0,offset1)){
            return i;
        }
    }
       return -1;
   }

    getOnTargetIndex():number {
    　for (let i=0; i<this.targetCollider.length; i++){
        let _target = this.targetCollider[i];
        if(DragUtil.collideOnCollie(this.self_collider,_target)){
            return i;
        }
    }
       return -1;
   }

   backToOriginal(event: cc.Event.EventTouch) {
       if(this.moveNode == null){
           return ;
       }
    if(this.backTween != null){
        this.backTween.stop();
    }else {
        this.backTween =  new cc.Tween();
    }
    this.backTween.target(this.moveNode).to(this.backDuring,{
        position:this.m_originalPos
        ,scaleX:this.m_originalScale.x
        ,scaleY:this.m_originalScale.y
        ,rotation:this.m_originalRotate
        },{progress:null, easing: this.backEasing}).call(()=>{
            this.backTween = null;
            this.isCanDrag = true;
        if(this.isDragToTop && this.moveNode != null){
            this.moveNode.setSiblingIndex(this.m_originalSiblingIndex);
        }
        if(this.eventTouchs != null){
            let temps:DragEventListener[] = this.eventTouchs.slice().reverse();
            for(let e of temps){
                if(e.emit(DragEventType.TouchCancle , event, this)){
                    break;
                }
            }
        }
       
        }).start();
   }

   private onDragBegin(event: cc.Event.EventTouch){
       if(this.backTween != null){
           this.backTween.stop();
           this.backTween = null;
       }
    this.m_dragMoveDamp = 0.3;
        if(this.isDragToTop){
             this.moveNode.setSiblingIndex(500);
        }

        let temps:DragEventListener[] = this.eventTouchs.slice().reverse();
    for(let e of temps){
        if(e.emit(DragEventType.DragBegin , event, this)){
            break;
        }
    }
   }

   private onDrag(event: cc.Event.EventTouch){
    let temps:DragEventListener[] = this.eventTouchs.slice().reverse();
    for(let e of temps){
        if(e.emit(DragEventType.Draging , event, this)){
            break;
        }
    }
   }

   private onTouchCancle(event: cc.Event.EventTouch){
     
     if(this.isDraging && this.dragType == DragType.BackToStart){
        this.backToOriginal(event);
     }else {
        this.isCanDrag = true;
        if(this.isDragToTop &&this.isDraging){
            this.moveNode.setSiblingIndex(this.m_originalSiblingIndex);
        }
        let temps:DragEventListener[] = this.eventTouchs.slice().reverse();
    for(let e of temps){
        if(e.emit(DragEventType.TouchCancle , event, this)){
            break;
        }
    }
     }
    
   }

   private onTouchEnd(event: cc.Event.EventTouch){
  
       this.isCanDrag = true;
       let temps:DragEventListener[] = this.eventTouchs.slice().reverse();
       for(let e of temps){
           if(e.emit(DragEventType.TouchEnd, event, this)){
               break;
           }
       }
   }
    touchStart(event: cc.Event.EventTouch){
        if(!this.isCanDrag){
            return ;
        }
        let touchLoc = this.getWordPos(event.getLocation());

        if (DragUtil.pointInCollide(touchLoc,this.touch_collider)) {
            this._moveDeta = cc.Vec2.ZERO;
            this.isMoveOut = false;
            this.isDraging = false;
          this.isTouch = true;
          this.isCanDrag = true;
          if(this.isSwallowTouches){
            event.stopPropagation();

        let temps:DragEventListener[] = this.eventTouchs.slice().reverse();
        for(let e of temps){
            if(e.emit(DragEventType.TouchDown , event, this)){
                break;
            }
        }
        }
      }
      else {
          //this.isTouch = false;
      }
    }

    touchMove(event: cc.Event.EventTouch) {
        if(!this.isTouch||!this.isCanDrag || this.moveNode == null){
            return ;
        }
        if(this.isSwallowTouches){
            event.stopPropagation();
        }

        let newPos = this.getWordPos(event.getLocation());
        let prePos = this.getWordPos(event.getPreviousLocation());
        let newInp = this.moveNode.parent.convertToNodeSpaceAR(newPos);
        let preInp = this.moveNode.parent.convertToNodeSpaceAR(prePos);
    

        if(this.dragType == DragType.LimitInTarget){
            if(!this.isDraging){
                this.m_dragOffset = cc.Vec2.ZERO;
                if(!this.isDragOriginPoint){
                    this.m_dragOffset = newInp.sub(this.moveNode.position);
                }else{
                    this.m_dragOffset = this.dragOffset;
                }
                this.onDragBegin(event);
                this.isDraging = true;
            }
             this._moveDeta.addSelf(newInp.sub(preInp));

             if(this.isMoveOut&& DragUtil.pointInCollide(newPos,this.touch_collider)){
                 this.m_dragOffset = newInp.sub(this.moveNode.position);
            }
            let precake = this.moveNode.position.add(this.m_dragOffset);
           
            let prePos = this.moveNode.position.add(this.m_dragOffset);
            let newpos = prePos.lerp(newInp,this.m_dragMoveDamp);

            if(this.getInTargetIndex(newpos.sub(precake)) != -1){
                this._moveDeta = cc.Vec2.ZERO;
                this.cacheMoveToPos = newInp;
                this.isMoveOut  = false;
            }else{
                this.cacheMoveToPos = precake;
                this.isMoveOut = true;
              //  cc.log("vex"+this._moveDeta);
            
               
            }
        }else {
            if(!this.isDraging){
                this.m_dragOffset = cc.Vec2.ZERO;
                if(!this.isDragOriginPoint){
                    this.m_dragOffset = newInp.sub(this.moveNode.position);
                }else{
                    this.m_dragOffset = this.dragOffset;
                }
                this.onDragBegin(event);
                this.isDraging = true;
            }
            this.cacheMoveToPos = newInp;
        }
       
       this.onDrag(event);
    }
    touchEnd(event: cc.Event.EventTouch) {
        if(!this.isTouch||!this.isCanDrag || this.moveNode == null){
            return ;
        }
        this.isTouch = false;
        if(this.isSwallowTouches){
            event.stopPropagation();
        }

        switch (this.dragType){
            case DragType.BackToStart:
                    if(this.getOnTargetIndex() == -1) {
                        this.onTouchCancle(event);
                    }else {
                        this.onTouchEnd(event);
                    }
                break;
            case DragType.EndInTouchPos:
                    this.onTouchEnd(event);
                break;
        };
       
        this.isDraging = false;
    }
    touchCancel(event: cc.Event.EventTouch) {
        if(!this.isTouch||!this.isCanDrag){
            return ;
        }
        cc.log(SpriteDrag.OnApplicationFocus);
        this.isTouch = false;
        if(this.isSwallowTouches){
            event.stopPropagation();
        }
        this.onTouchCancle(event);
        this.isDraging = false;
       
    }


    private disposeLis(){
        if(this._listener != null && this._lisCancele != null){
            this._listener.onTouchCancelled = this._lisCancele;
            this._listener = null;
            this._lisCancele = null;
        }
    } 

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd,this);
        this.node.on(SpriteDrag.OnApplicationFocus,this.touchCancel,this);
    }

    onDisable() {
        this.isTouch = false;
        this.disposeLis();
        this.node.off(cc.Node.EventType.TOUCH_START,this.touchStart,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.touchEnd,this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd,this);
        this.node.off(SpriteDrag.OnApplicationFocus,this.touchCancel,this);
    }

    onLoad () {
        if(CC_EDITOR){
            this.initDataInEDITOR();
        }else {
            this.initData();
        }
    }

    start(){
        if(!CC_EDITOR){
            this.initData();
        }
    }

    destroy(){
        this.disposeLis();
        return super.destroy();
    }
   onDestroy(){
      this.disposeLis();
    }

    update(dt:number){
        if(this.isDraging== true &&this.isTouch == true){
            if(this.m_dragMoveDamp<1) {
                this.m_dragMoveDamp+=0.01;
            }
            
            let prePos = this.moveNode.position.add(this.m_dragOffset);
            let newpos = prePos.lerp(this.cacheMoveToPos,this.m_dragMoveDamp);
            this.moveNode.setPosition(newpos.sub(this.m_dragOffset));

            let preScale = new cc.Vec2(this.moveNode.scaleX,this.moveNode.scaleY);
            let newScale = preScale.lerp(this.dragScale,this.m_dragMoveDamp);
            this.moveNode.setScale(newScale.x,newScale.y);

            let preRotate = this.moveNode.rotation;
            let newRotate = cc.misc.lerp(preRotate, this.dragRotate, this.m_dragMoveDamp);
            this.moveNode.angle = -newRotate;
            
        }
    }
    // update (dt) {}
}
