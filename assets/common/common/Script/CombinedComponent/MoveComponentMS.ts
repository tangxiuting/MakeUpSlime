import EventListener from "../codebase/EventListenerMS";


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
export default class MoveComponent extends cc.Component {

    @property({type:[cc.SpriteFrame]})
    mixPaths:cc.SpriteFrame[] = [];

    @property()
    delayPerUnit:number = 2.3;

    @property({type:[EventListener]})
    mixLis:EventListener[] = [];

    //搅拌
    @property(cc.AudioClip)
    spoonAudio: cc.AudioClip = null;



    static MIXING:string = "MIXING";
    static MIXSTOP:string = "MIXSTOP";
    static MIXEND:string = "MIXEND";

    private _count = 0;
    private mixEnable:boolean = false;
    private currntTime:number = 0;
    changeNodes:cc.Node[] = [];
    private current:number = -1;
    setMixPahth(temp:cc.SpriteFrame[]){
        if(this.changeNodes.length != 0){
            for(let n of this.changeNodes){
                if(cc.isValid(n)){
                    n.name = n.name+"pre";
                }
            }
        }
        this.changeNodes = [];
        this.mixPaths = temp;
        this._count = 0;
        this.currntTime = 0;
    }

    startMix() {

        if(this.spoonAudio && this.current == -1)
            this.current = cc.audioEngine.play(this.spoonAudio, true, 1);


        console.log("startMix");
            
        if(this.changeNodes.length == 0){
            for(let f of this.mixPaths){
                let _node = new cc.Node();
                _node.zIndex = -1;
                _node.name = "changing";
                let sp = _node.addComponent(cc.Sprite);
                sp.spriteFrame = f;
                _node.opacity = 0;
                _node.parent = this.node;
                this.changeNodes.push(_node);
            }
        }
        this.mixEnable = true;
    }

    stopMix(){
        cc.audioEngine.stop(this.current);
        this.current = -1;
        this.mixEnable = false;
        EventListener.emitEvents(MoveComponent.MIXSTOP,this.mixLis,this);
    }

    update (dt) {
        this.updateMix(dt);
    }

    updateMix(dt){
        if(!this.mixEnable){
            return ;
        }
        if(this._count>=this.changeNodes.length){
            return ;
        }
      
        let preNode:cc.Node = null;
        let currentNode:cc.Node = null;
        if(this._count == 0){
            let childs = this.node.children;
            for(let _child of childs){
                if(_child.name != "changing"&&_child.active){
                    _child.opacity = (1-this.currntTime/this.delayPerUnit)*255;
                }
            }
        }else if(this._count-1<this.changeNodes.length){
            preNode = this.changeNodes[this._count-1];
            preNode.opacity = (1-this.currntTime/this.delayPerUnit)*255;
        }
        if(this._count<this.changeNodes.length){
            currentNode= this.changeNodes[this._count];
            currentNode.opacity = this.currntTime/this.delayPerUnit*255;
        }
       
        this.currntTime+=dt;
        if(this.currntTime>=this.delayPerUnit){
            if(preNode){
                preNode.opacity = 0;
            }
            if(currentNode){
                currentNode.opacity =255;
            }
            this.currntTime = 0;
            this._count++;
        }
        EventListener.emitEvents(MoveComponent.MIXING,this.mixLis,this);
        if(this._count>=this.changeNodes.length){
            
            cc.audioEngine.stop(this.current);
            EventListener.emitEvents(MoveComponent.MIXEND,this.mixLis,this);
        }
    }
    reset(){
        this._count = 0;
        this.changeNodes = [];

    }
}
