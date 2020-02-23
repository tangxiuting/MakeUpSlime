import DragFall from "../codebase/SpriteDrag/DragFallMS";
import EventListener from "../codebase/EventListenerMS";
import SpriteDrag from "../codebase/SpriteDrag/SpriteDragMS";
import MixComponent from "../CombinedComponent/MixComponentMS";
import { CocosHelper } from "../codebase/utils/CocosHelperMS";


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
export default class AddIngredients extends cc.Component {
    bowl:cc.Node = null;
    bowlUp:cc.Node = null;
    mixLayer:cc.Node = null;
    blender:cc.Node = null;
    addCount:number = 0;
    ingredientNum:number = 0;
    onLoad(){
        if(this.blender == null){
            this.blender =  CocosHelper.findNode(cc.Canvas.instance.node, "blender");
            if(this.blender){
                this.blender.active = false;
            }
        }
        if(this.bowl == null){
            this.bowl =  CocosHelper.findNode(cc.Canvas.instance.node, "bowl");
        }
        if(this.bowlUp == null){
            this.bowlUp =  CocosHelper.findNode(cc.Canvas.instance.node, "bowlUp");
            this.bowlUp.setSiblingIndex(this.bowlUp.parent.childrenCount+1);
        }

        if(this.mixLayer == null){
            this.mixLayer =  CocosHelper.findNode(cc.Canvas.instance.node, "mixLayer");
        }
       
    }

    initIngredients(names:string[]|cc.Node[]){
        for(let sName of names){
            let node:cc.Node = null;
            if(sName instanceof cc.Node){
                node = sName;
            }else {
                node = CocosHelper.findNode(cc.Canvas.instance.node,sName);
            }
             
            let drag = node.getComponent(SpriteDrag);
            if(drag.targetCollider.length == 0 && this.bowl != null){
                let c = this.bowl.getComponent(cc.Collider);
                if(c != null){
                    drag.targetCollider.push(c);
                }
            }

            let fall = node.getComponent(DragFall);
            let fallEvent = new EventListener(this,"startFall",DragFall.fallStart);
            fall.fallLis.push(fallEvent);
            fall.fallLis.push(new EventListener(this,"fallEnd",DragFall.fallEnd));
            this.ingredientNum++;
        }
    }

    initInbowl(names:string[]|cc.Node[]){
        for(let sName of names){
            let node:cc.Node = null;
            if(sName instanceof cc.Node){
                node = sName;
            }else {
                node = CocosHelper.findNode(cc.Canvas.instance.node,sName);
            }
            let fall = node.getComponent(DragFall);
            if(fall.inBowl == null){
                fall.inBowl = CocosHelper.findNode(cc.Canvas.instance.node,sName+"Inbowl");
            }
            if(fall.inBowl != null){
                fall.inBowl.opacity = 0;
                fall.inBowl.scale = 0;
            }
        }
    }

    showBlender(){
        if(this.blender == null){
            return ;
        }
        let moveBlender = this.blender.getComponent(SpriteDrag);
        moveBlender.enabled = false;
        this.blender.setSiblingIndex(this.bowlUp.getSiblingIndex()+1);

        CocosHelper.showBackOut(this.blender,CocosHelper.ShowDirection.show_from_right,()=>{
            moveBlender.enabled = true;
        });
       
     if(this.mixLayer != null){
        let mixCom =   this.mixLayer.getComponent(MixComponent);
        mixCom.mixLis.push(new EventListener(this,"mixEnd",MixComponent.MIXEND));
     }
       
    }

    mixEnd(){
        if(this.blender != null && this.bowlUp != null){
            let moveBlender = this.blender.getComponent(SpriteDrag);
            if(moveBlender){
                moveBlender.enabled = false;
            }
            
            this.blender.setSiblingIndex(this.bowlUp.getSiblingIndex()+1);
        }
        if(this.blender != null){
            CocosHelper.hideNode(this.blender,CocosHelper.ShowDirection.show_from_right,null,false);
        }
        // if(this.bowlUp != null && this.bowl != null){
        //     this.bowlUp.parent = this.bowl;
        //     this.bowlUp.position = cc.Vec2.ZERO;
        // }
    }

    fallEnd(_fall:DragFall){
        _fall.node.runAction(cc.rotateTo(0.4,0));
        CocosHelper.hideNode( _fall.node,CocosHelper.ShowDirection.show_from_right);
        this.addCount++;
        if(this.addCount == this.ingredientNum){
            this.showBlender();
        }
    }

    startFall(_fall:DragFall) {
        let _addTime = _fall.pourTime;
        let node = _fall.node;
        if(this.bowl != null){
            node.setSiblingIndex(this.bowl.getSiblingIndex()+1);
        }
        if(_fall.inBowl ==  null){
            return ;
        }
        node.runAction(cc.moveBy(_addTime,new cc.Vec2(0,50)));
        let actionNode = _fall.inBowl;
        let _tween = new cc.Tween();
        let _endFunc:Function = ()=>{
            EventListener.emitEvents(DragFall.fallEnd, _fall.fallLis,_fall);
        };
        if(actionNode == null){
            actionNode = node;
            _tween.delay(_addTime);
        }else {
            _tween.to(_addTime,{scale:1,opacity:255},null);
        
        }

        _tween.target(actionNode).call(_endFunc).start();

        let Inner = CocosHelper.findNode(node,node.name+"Inner");
        if(Inner){
            let _innerT = new cc.Tween();
            _innerT.by(_addTime,{position: cc.v2(-Inner.getContentSize().width*.45,-40)},null).hide().target(Inner).start();
        }
       
    }

    // update (dt) {}
}
