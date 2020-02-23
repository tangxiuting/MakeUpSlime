import { CocosHelper } from "../common/common/Script/codebase/utils/CocosHelperMS";

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
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    @property(cc.AudioClip)
    jump: cc.AudioClip = null;

    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // monster2
    start () {

        let array = [3, 5, 2, 1, 0];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let number = Number(element);

            let nodeMove =  this.node.getChildByName("monster" + number);//   CocosHelper.findNode(cc.Canvas.instance.node, "monster" + number);

            let height = nodeMove.height;

            nodeMove.runAction(cc.sequence(cc.delayTime(0.5 * index),cc.callFunc(()=>{

                cc.audioEngine.playEffect(this.jump, false);

            }),cc.jumpBy(1.0, cc.v2(0, 0), height, 1), cc.callFunc(()=>{

                if(index == array.length - 1){

                    

                }

            })));

        }



    }

    // update (dt) {}
}
