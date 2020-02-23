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
export enum DragEventType {
  TouchDown,
  DragBegin,
  Draging,
  TouchEnd,
  TouchCancle
}

const {ccclass, property} = cc._decorator;
@ccclass("DragEventListener")
export default class DragEventListener extends EventListener{
  @property({override:true,visible:false})
  eventName:string='TouchEnd';
  @property({type: cc.Enum(DragEventType),visible:false})
  private _dragType:DragEventType = DragEventType.TouchEnd;
  @property({type: cc.Enum(DragEventType)})
  set dragType(_type:DragEventType){
    this._dragType = _type;
    this.eventName = Object.keys(DragEventType)[_type];
  }
  get dragType():DragEventType{
    return this._dragType;
  }

  constructor(com  :cc.Component = null,handerName :string = null,eventType :DragEventType = null){
    super(com,handerName);
    if(eventType != null){
      this.dragType = eventType;
    }
  }

  emit(type:DragEventType|string, ...params: any[]):boolean{
    let tempType:string;
    if(typeof type == "string"){
      tempType = type;
    }else {
      tempType = Object.keys(DragEventType)[type];
    }
    return super.emit(tempType,...params);
  }
}
