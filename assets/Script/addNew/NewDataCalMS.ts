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
export default class NewDataCal {
    private static _instance: any;
    public static getInstance(): NewDataCal {
        if (NewDataCal._instance == null)
            NewDataCal._instance = new NewDataCal();
        return NewDataCal._instance;
    }
    constructor(){
        
    }
    isPlayBlue = false;
    isPlayPink = false;

    selectName = "blue";
    setSelectName(name){
        this.selectName = name;

    }
    getSelectName(){
        return this.selectName;
    }


    setBoolValue(name, isPlay){
        if(name == "blue"){

            this.isPlayBlue = isPlay;

        }
        if(name == "pink"){

            this.isPlayPink= isPlay;
            ;

        }
    }

    getBoolValue(name){
        let isPlay = false;
        if(name == "blue"){

            isPlay = this.isPlayBlue;

        }
        if(name == "pink"){

            isPlay = this.isPlayPink;

        }
        return isPlay;
    }


    showUI(){
        var CanvasNode = cc.find( 'Canvas' );
        if( !CanvasNode ) { cc.log( 'find Canvas error' ); return; } 
        
        var onResourceLoaded = function(errorMessage, loadedResource)
        {
            if(cc.sys.isMobile){
                if( errorMessage ) { cc.log( 'Prefab error11:' + errorMessage ); return; }
            }
            
            if( !( loadedResource instanceof cc.Prefab ) ) { cc.log( 'Prefab error22' ); return; } 
            
            var newMyPrefab = cc.instantiate( loadedResource );
            console.log(newMyPrefab);
            CanvasNode.addChild( newMyPrefab );
            newMyPrefab.name = "newMyPrefab";
            newMyPrefab.setPosition( 0, 0 );
            
            newMyPrefab.zIndex = 1000;
            
            cc.loader.setAutoReleaseRecursively(loadedResource, true);

        };
        cc.loader.loadRes('makeupms/uishowMS', onResourceLoaded);

    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
