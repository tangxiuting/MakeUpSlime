import RewardManager from "./RewardManagerMS";

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
export default class IconItem extends cc.Component {
    @property
    isRewardLock:boolean = true;
    @property
    index:number = 0;
    @property
    key:string = "";
    @property
    moduleName:string = "";
    @property(cc.Node)
    getFreeNode: cc.Node = null;
    private isOnEvent = false;
    private itemKey:string = "";
    start () {
        if(this.moduleName == ""){
            this.moduleName = this.key;
        }
        if(!this.isOnEvent){
            this.isOnEvent = true;
            let c = this.node;
            c.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this,true);
            c.on(cc.Node.EventType.TOUCH_START,this.touchStart,this,true);
            c.on(cc.Node.EventType.TOUCH_MOVE,this.touchStart,this,true);
        }
        this.init();
    }
    initLisenter(){
        
        let self = this;
        //回调
        RewardManager.getInstance().showRewardLoadingCall = function () {
            
        };
        RewardManager.getInstance().showRewardFalseCall = function () {
            //失败
            self.unLisenter();
        };
        RewardManager.getInstance().removeRewardLoadingCall = function (keyCall:string) {
            //移除
            let islock = RewardManager.getInstance().isLocked(self.itemKey);
            console.log("回调" + self.itemKey);
            self.getFreeNode.active = islock;
            self.unLisenter();
            
        };

    }
    unLisenter(){
        let self = this;
        //回调
        RewardManager.getInstance().showRewardLoadingCall = null;
        RewardManager.getInstance().showRewardFalseCall = null;
        RewardManager.getInstance().removeRewardLoadingCall = null;
    }
    
    init(){
        this.itemKey = RewardManager.getInstance().getItemKey(this.key, this.moduleName, this.index);
        let islock = RewardManager.getInstance().isLocked(this.itemKey);
        this.getFreeNode.active = islock;    
    }
    touchEnd(event:cc.Event.EventTouch){
        console.log("IconItem touchEnd");
        
        if(this.isStopEvent()){
              event.stopPropagationImmediate();
        }

        if(this.getFreeNode.active && cc.sys.isMobile){
            this.initLisenter();
            //reward
            console.log('aaaaaa'+ this.itemKey)
            RewardManager.getInstance().showRewardAds(this.itemKey)
       }

    }

    touchStart(event:cc.Event.EventTouch){
        console.log("IconItem  touchStart");
    //     if(this.isStopEvent()){
    //         event.stopPropagationImmediate();
    //    }
    }

    isStopEvent():boolean{
        if(!cc.sys.isMobile){
            return false;
        }
        return this.getFreeNode.activeInHierarchy;
    }
    // update (dt) {}
}
