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
export default class DataConfig {
    private static _instance: any;
    public static getInstance(): DataConfig {
        if (DataConfig._instance == null)
        DataConfig._instance = new DataConfig();
        return DataConfig._instance;
    }
    private boxTexture: any = null;

    private isHome: string = "";
    constructor(){
        
    }
    public setIsHome(textureOther){

        this.isHome = textureOther;
        
    }

    public playMusic(){
        cc.audioEngine.stopMusic();
        cc.loader.loadRes("makeupms/bg", cc.AudioClip, function (err, audio) {
            
            cc.loader.setAutoReleaseRecursively(audio, false);
            
            cc.audioEngine.playMusic(audio, true);

        });

    }
    public playMusic2(){
        cc.audioEngine.stopMusic();
        cc.loader.loadRes("makeupms/ba", cc.AudioClip, function (err, audio) {
            
            cc.loader.setAutoReleaseRecursively(audio, false);
            
            cc.audioEngine.playMusic(audio, true);

        });

    }
    public getIsHome(){

        return this.isHome;

    }
    public setTexture(textureOther){

        this.boxTexture = textureOther;
        
    }

    public getTexture(){

        return this.boxTexture;

    }
    private pageTexture: any = null;
    public setPageTexture(textureOther){

        this.pageTexture = textureOther;
        
    }

    public getPageTexture(){

        return this.pageTexture;

    }


    private selectLight: any = null;
    public setSelectLight(textureOther){

        this.selectLight = textureOther;
        
    }

    public getSelectLight(){

        return this.selectLight;

    }


    showPhotoPup(){

        var onResourceLoaded = function(errorMessage, loadedResource)
        {
 
            if(cc.sys.isMobile){
                if( errorMessage ) { cc.log( 'Prefab error11:' + errorMessage ); return; }
            }
            
            cc.loader.setAutoReleaseRecursively(loadedResource, true);

            var newMyPrefab:cc.Node = cc.instantiate( loadedResource );
            console.log(newMyPrefab);
            cc.Canvas.instance.node.addChild( newMyPrefab );
            newMyPrefab.name = "newMyPrefab";
            newMyPrefab.setPosition( 0, 0 );
            console.log("3333");
            newMyPrefab.zIndex = 1000;

        };
        cc.loader.loadRes('makeupms/photo_board', onResourceLoaded);

    }

}
