import NodeComp = require('../codebase/utils/NodeCompMS');
import NodeTransform from '../codebase/utils/NodeTransformMS';
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property,requireComponent,disallowMultiple,executeInEditMode} = cc._decorator;

@ccclass("NodeTransformKey")
export class NodeTransformKey{ 
    @property()
    key:string=""
    @property(NodeTransform)
    value:NodeTransform = new NodeTransform;
}

@ccclass
@requireComponent(NodeComp)
@disallowMultiple()
@executeInEditMode()
export default class TransformRecord extends cc.Component {
    @property([NodeTransformKey])
    transforems:NodeTransformKey[] =  [];

    onLoad(){
        
    }

    getTransform(key:string):NodeTransform{
        for(let a of this.transforems){
            if(a.key == key){
                return a.value;
            }
        }
        return null;
    }
   
}
