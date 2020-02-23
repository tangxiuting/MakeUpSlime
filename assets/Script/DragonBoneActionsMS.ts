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


/**
 * 自定义龙骨动作类 
 * DragonBoneScaleBy
 * DragonBoneScaleTo
 */

@ccclass

/** DragonBoneScaleBy */
export default class DragonBoneScaleBy extends cc.ActionInterval {

    /**节点 */
    _target: cc.Node;

    _scaleDelta:cc.Vec2 = cc.v2(0, 0);;
    _startScale:cc.Vec2 = cc.v2(0, 0);
    _previousScale:cc.Vec2 = cc.v2(0, 0);;

    //需要动作的骨骼
    _scaleBone:dragonBones.Bone = null;
    setScaleBone(bone:dragonBones.Bone){
        this._scaleBone = bone;
    }
    getBone(){return this._scaleBone};

    //构造方法
    /**
     * 
     * @param duration 时间
     * @param deltaX x
     * @param detaY y
     */
    constructor(duration, deltaX, detaY){
        super();
        
        this.initWithDuration(duration, deltaX, detaY);
    }
    //初始化
    initWithDuration(duration, deltaX, detaY){
        if(super["initWithDuration"](duration, this)){
            this._scaleDelta = cc.v2(deltaX,detaY);
            return true
        }
        return false;
    };
    startWithTarget(target:cc.Node){
        //父类global
        super["startWithTarget"](this, target);
        if(this._scaleBone != null){
            this._startScale.x = this._scaleBone.offset.x;
            this._startScale.y =  this._scaleBone.offset.y;
            this._previousScale = this._startScale;
            
        }
    };
    update(t){
        if(this._scaleBone != null){
            let newPos:cc.Vec2;
            //计算值
            let currentPos = cc.v2(this._scaleBone.offset.scaleX, this._scaleBone.offset.scaleY);
            let diff = currentPos.sub(this._previousScale);
            this._startScale = this._startScale.add(diff);
            newPos = this._startScale.add(cc.v2(this._scaleDelta.x * t, this._scaleDelta.y * t));
            this._previousScale = newPos;

            this._scaleBone.offset.scaleX =  newPos.x;; 
            this._scaleBone.offset.scaleY =  newPos.y;; ;
            this._scaleBone.invalidUpdate();
        }
    };
    // update (dt) {}
}

/** DragonBoneScaleTo */
export class DragonBoneScaleTo extends DragonBoneScaleBy{

    _endScale:cc.Vec2;

    constructor(duration, deltaX, detaY){
        super(duration, deltaX, detaY);
        
        this.initWithDurations(duration, deltaX, detaY);
    }
    initWithDurations(duration,   deltaX,  detaY){
        if(super["initWithDuration"](duration,   deltaX,  detaY)){
            this._endScale = cc.v2(deltaX, detaY);
            return true;
        }
    }
    
    startWithTarget(target:cc.Node){
        super["startWithTarget"](target);
        if(this._scaleBone){
            this._scaleDelta = this._endScale.sub(cc.v2(this._scaleBone.offset.scaleX, this._scaleBone.offset.scaleY));
        }
    };

}
//导出
export var dragonBoneScaleBy = function(duration, R, angle){
    return new DragonBoneScaleBy(duration, R, angle);
}
export var dragonBoneScaleTo = function(duration, R, angle){
    return new DragonBoneScaleTo(duration, R, angle);
}