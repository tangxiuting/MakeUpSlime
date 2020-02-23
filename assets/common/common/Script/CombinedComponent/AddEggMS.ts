import NodeComp = require('../codebase/utils/NodeCompMS');
import NodeTransform from '../codebase/utils/NodeTransformMS';
import SpriteDrag from '../codebase/SpriteDrag/SpriteDragMS';
import DragEventListener, { DragEventType } from '../codebase/SpriteDrag/DragEventListenerMS';
import { CocosHelper } from '../codebase/utils/CocosHelperMS';
import EventListener from '../codebase/EventListenerMS';
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
@requireComponent(NodeComp)
export default class AddEgg extends cc.Component {

    @property({type:NodeTransform})
    addTouchPos:NodeTransform = new NodeTransform();
    @property({type:NodeTransform})
    fallPos:NodeTransform = new NodeTransform();
    @property()
    isAutoFall:boolean = false;
    @property({type:cc.Node, visible(){return !this.isAutoFall;}})
    finger:cc.Node = null;
    @property({type:cc.Node})
    eggInBowl:cc.Node = null;
    @property({type:[EventListener]})
    addEggLis:EventListener[] = [];

    //打蛋的音效
    @property(cc.AudioClip)
    eggAudio: cc.AudioClip = null;



    private breakNode:cc.Node = null;
    private fallNode:cc.Node = null;
    private m_drarg:SpriteDrag = null;
    static ADD_EGG_END:string = "ADD_EGG_END";
    start () {
        if(this.m_drarg == null){
            this.m_drarg = this.node.getComponent(SpriteDrag);
            if(this.m_drarg != null){
                this.m_drarg.eventTouchs.push(new DragEventListener(this,"dragToBowl",DragEventType.TouchEnd));
            }
        }

        if(this.breakNode == null){
            this.breakNode = this.node.getChildByName("breakNode");
            this.breakNode.active = false;
        }
        if(this.fallNode == null){
            this.fallNode = this.node.getChildByName("fallNode");
            this.fallNode.active = false;
        }

        if(this.eggInBowl == null){
            this.eggInBowl = CocosHelper.findNode(cc.Canvas.instance.node,this.node.name+"Inbowl");
            if(this.eggInBowl != null){
                this.eggInBowl.active = false;
            }
        }
    }

    dragToBowl(_touch:cc.Event.EventTouch, _lis:SpriteDrag) {
        if(_lis != null){
            _lis.enabled = false;
        }
        let _moveNode = this.node;
       
        let _tween = new cc.Tween();
        _tween.target(_moveNode).to(0.5,{
            position:this.addTouchPos.pos,
            scaleX:this.addTouchPos.scale.x,
            scaleY:this.addTouchPos.scale.y,
            rotation:this.addTouchPos.rotate
        },null).call(this.movetoTouchPos.bind(this)).start();
    }

    movetoTouchPos(){
        if(this.isAutoFall){
            this.showBreakAction();
        }else {
            
        }
    }

    showBreakAction(){
        let _tween = new cc.Tween();
        _tween.target(this.node)
        .by(0.2,{position:new cc.Vec2(20,50)},{progress:null,easing:"expoOut"})
        .by(0.2,{position:new cc.Vec2(-20,-50)},{progress:null,easing:"backOut"})
        .call(()=>{this.breakNode.active = true;this.hideNode();})
        .delay(0.1)
        .to(0.4,{
            position:this.fallPos.pos,
            scaleX:this.fallPos.scale.x,
            scaleY:this.fallPos.scale.y,
            rotation:this.fallPos.rotate
        },null)
        .call(()=>{
            this.breakNode.active = false;
            this.fallNode.active = true;   
            if(this.eggAudio){

                cc.audioEngine.playEffect(this.eggAudio, false);

            }
        })
        .delay(0.3)
        .call(()=>{
            this.fallNode.active = false;
            if(this.eggInBowl){
                this.eggInBowl.active = true;
            }
            for(let _lis of this.addEggLis){
                _lis.emit(AddEgg.ADD_EGG_END,this);
            }
        })
        .start();
    }

    private hideNode(){
        let noshade = this.node.getChildByName("noshade");
        if(noshade){
            noshade.active = false;
        }
        let movingNode = this.node.getChildByName("moving");
        if(movingNode != null){
            movingNode.active = true;
        }

        let s = this.getComponent(cc.Sprite)
        if(s)
           s.enabled = false;
    }
    // update (dt) {}


}
