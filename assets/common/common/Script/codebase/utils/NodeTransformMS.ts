import { CocosHelper } from "./CocosHelperMS";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export enum OptionType{
    None,
    RecordNode,
    SaveNode,
    previewNode
}

if(CC_EDITOR){
    class NodeCache{
           pos:cc.Vec2 = null;
           scale:cc.Vec2 = null;
           rotate:number = null;
           node:cc.Node = null;
           isRecoding = false;
           tans = null;
           static  caches:Array<NodeCache> = new Array<NodeCache>();
       }
}
const {ccclass, property} = cc._decorator;

@ccclass("NodeTransform")
export default class NodeTransform {

    @property({visible:false})
    private _pos:cc.Vec2 = cc.Vec2.ZERO;
    @property({type: cc.Vec2})
    set pos(temp:cc.Vec2){
        if(CC_EDITOR){
            this.hasSet = true;
        }
        this._pos = temp;
    }
    get pos():cc.Vec2{
        return this._pos;
    }

    @property({visible:false})
    private _scale:cc.Vec2 = new cc.Vec2(1,1);
    @property({type: cc.Vec2})
    set scale(temp:cc.Vec2){
        if(CC_EDITOR){
            this.hasSet = true;
        }
        this._scale = temp;
    }
    get scale():cc.Vec2{
        return this._scale;
    }

    @property({visible:false})
    private _rotate:number = 0;
    @property({type: cc.Float})
    set rotate(temp:number){
        if(CC_EDITOR){
            this.hasSet = true;
        }
        this._rotate = temp;
    }
    get rotate():number{
        return this._rotate;
    }

    @property({visible:false})
    private hasSet:boolean = false;

    private _currentNode:cc.Node;
 
    @property({type: cc.Enum(OptionType),visible:false})
    private _optionType:OptionType = OptionType.None;
    @property({type: cc.Enum(OptionType)})
    set optionType(_type:OptionType){
         this.cacheTransforms(_type);
    }
     get optionType():OptionType{
       return this._optionType;
    }
   
    getTween(_time:number){
        let _tween = new cc.Tween();
        _tween.to(_time,{position:this.pos,scaleX:this.scale.x,scaleY:this.scale.y,rotation:this.rotate},null);
        return _tween;
    }

    private cacheTransforms(_type:OptionType) {
       
        if(CC_EDITOR){
            if(this._currentNode == null){
                this._currentNode = CocosHelper.findNode_if(cc.director.getScene() ,(node:cc.Node)=>{
                    if(node != null){
                        let comps = node.getComponents(cc.Component);
                        for(let com of comps){
                            let keys = Object.keys(com);
                            for(let k of keys){
                                let m = com[k];
                                if(m == this){
                                    return true;
                                }else if(m instanceof Array){
                                    for(let a of m){
                                        if(a == this){
                                            return true;
                                        }else if(a.constructor.name == "NodeTransformKey" && a.value == this){
                                            return true;

                                        }
                                    }
                                }
                            }
                        }
                    }
                    return false;
                });
                if(this._currentNode != null){
                    this._currentNode.on(cc.Node.EventType.POSITION_CHANGED,()=>{
                        if(this._optionType == OptionType.RecordNode){
                            this.pos = this._currentNode.position;
                        }
                    });
                    this._currentNode.on(cc.Node.EventType.SCALE_CHANGED,()=>{
                        if(this._optionType == OptionType.RecordNode){
                            this.scale = new cc.Vec2(this._currentNode.scaleX,this._currentNode.scaleY);
                        }
                    });
                    this._currentNode.on(cc.Node.EventType.ROTATION_CHANGED,()=>{
                        if(this._optionType == OptionType.RecordNode){
                            this.rotate = this._currentNode.rotation;
                        }
                    });
                }
            }
        
       
            if(this._currentNode == null){
                return ;
            }
          
            // @ts-ignore
            for(let c of NodeCache.caches) {
                if(c.node  == this._currentNode && c.tans != this && c.isRecoding) {
                    cc.log("已有其它节点信息正在记录");
                    return ;
                }
            }

            // @ts-ignore
            let _cache:NodeCache = null;
            // @ts-ignore
            for(let c of NodeCache.caches) {
                if(c.tans  == this){
                    _cache = c;
                }
            }
         
            let _preType  = this._optionType;
            this._optionType = _type;

            if(this._optionType == OptionType.RecordNode){
                if(_cache == null){
                    // @ts-ignore
                    _cache = new NodeCache();
                    _cache.pos = this._currentNode.getPosition();
                    _cache.node = this._currentNode;
                    _cache.tans = this;
                    _cache.scale = new cc.Vec2(this._currentNode.scaleX,this._currentNode.scaleY);
                    _cache.rotate = this._currentNode.rotation;
                    // @ts-ignore
                    NodeCache.caches.push(_cache);
                }
                _cache.isRecoding = true;

               
            }else {
                if(this._optionType == OptionType.previewNode){
                    let _prePos:cc.Vec2;
                    let _preScale:cc.Vec2;
                    let preRotate:number;
                    if(_cache != null){
                        _prePos = _cache.pos;
                        _preScale = _cache.scale;
                        preRotate = _cache.rotate;
                    }else {
                        _prePos= this._currentNode.getPosition();
                        _preScale = new cc.Vec2(this._currentNode.scaleX,this._currentNode.scaleY);
                        preRotate = this._currentNode.rotation;
                    }
                    let tww = new cc.Tween();
                    tww.target(this._currentNode).to(0.2,{
                        position:this.pos
                        ,scaleX:this.scale.x
                        ,scaleY:this.scale.y
                        ,rotation:this.rotate
                        },null).call(()=>{
                            CocosHelper.findNode_if(this._currentNode,function (_node:cc.Node){
                                let fallParticle = _node.getComponent(cc.ParticleSystem);
                                if(fallParticle){
                                    fallParticle.resetSystem();
                                }
                                return false;
                            });
                        }).delay(1.3).call(()=>{
                            CocosHelper.findNode_if(this._currentNode,function (_node:cc.Node){
                                let fallParticle = _node.getComponent(cc.ParticleSystem);
                                if(fallParticle){
                                    fallParticle.stopSystem();
                                }
                                return false;
                            });
                            this._currentNode.setPosition(_prePos);
                            this._currentNode.setScale(_preScale.x,_preScale.y);
                            this._currentNode.angle = -preRotate;
                            this._optionType = OptionType.None;
                        }).start();
                }
                if(_cache != null){
                    this._currentNode.position = _cache.pos;
                    this._currentNode.rotation = _cache.rotate;
                    this._currentNode.scaleX = _cache.scale.x;
                    this._currentNode.scaleY = _cache.scale.y;
               
                    // @ts-ignore
                    let index = NodeCache.caches.indexOf(_cache);
                    if(index>-1){
                        // @ts-ignore
                        NodeCache.caches.splice(index);
                    }
                }


            }

            if(this.hasSet&&this._optionType == OptionType.RecordNode&&_cache != null){
                this._currentNode.position = this._pos;
                this._currentNode.rotation = this._rotate;
                this._currentNode.setScale(this._scale.x,this._scale.y);
             }
            
        }
    }
}
