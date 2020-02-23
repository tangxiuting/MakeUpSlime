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

@ccclass("EventListener")
export default class EventListener{
    @property({override:true,tooltip:"事件名称"})
    eventName:string='';
    @property(cc.Component.EventHandler)
    eventHander:cc.Component.EventHandler = new cc.Component.EventHandler();
    @property()
    isEnable:boolean = true;
    @property({tooltip:"是否中断其它监听"})
    isSwallow:boolean = false;

    constructor(com  :cc.Component = null,handerName :string = null,eventName :string = null){
      if(com != null && handerName != null){
        this.eventHander.target = com.node;
      
        var className = cc.js.getClassName(com);
        var trimLeft = className.lastIndexOf('.');
        if (trimLeft >= 0) {
            className = className.slice(trimLeft + 1);
        }
        this.eventHander.component = className;

        this.eventHander.handler = handerName;
      }
      if(eventName != null){
        this.eventName = eventName;
      }
    }

    static emitEvents(_eventName:string,events: EventListener[], ...params: any[]): void{
      for(let e of events){
        if(e.emit(_eventName,...params)){
          break;
      }
      }
    }

    emit(_eventName:string, ...params: any[]):boolean{
        if(_eventName == ""){
            return ;
        }
        if(_eventName != this.eventName){
            return false;
          }
          if(!this.isEnable){
            return false;
          }
          if(this.eventHander == null){
            return false;
          }
       
          let tempParams = params.slice();
          tempParams.push(this);
          this.eventHander.emit(tempParams);
          return this.isSwallow;
    }
        
}
