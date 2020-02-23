class jsToCPP {
    static getInstance(): jsToCPP;

    showInterstitial(): bool;
    showBanner(): void;
    hideBanner(): void;
    showReward(): bool;
    showCross(): bool;

    preLoadAds(number):void

    preLoadAllAds():void;

    initOnAdsLoaded(cb : any): void;
    initOnAdsClicked(cb : any): void;
    initOnAdsExpanded(cb : any): void;
    initOnAdsCollapsed(cb : any): void;
    
    initOnAdsLoadFailed(cb : any): void;
    initOnAdsRewarded(cb : any): void;


    sendEmail(subject:string,  body:string):void;
    
    /**
     *  @brief Send Email with pic by system default.
     *
     *  @param subject email subject.
     *  @param content email content.(html style)
     *  @param content email fileName.
     */
    sendEmailAndFilePic( subject:string,  message:string,  fileName:string):void;
    /**
     * @brief pop a system default dialog
     *
     * @param message
     */
    popAlertDialog(message:string):void;
    
    /**
     *  @brief  check network is available
     *
     *  @return true:network is connective.
     */
    checkNetworkAvailable():bool;
    
    /**
     *  @brief  check current device is tablet(android)/ipad(ios).
     *
     *  @return true:is tablet(android)/ipad(ios)
     */
    isTablet():boolean;
    

    listAssetFiles(path:string):number;
    /***********************some function for common libs.*********************/
    /**
     *  @brief show more game page.
     */
     showMoreGame():void;
    
     cacheMoreGame():void;
    /**
     *  @brief show privacy page
     */
    showPrivacy():void;
    
    /**
     *  @brief show NewsBlast
     *
     *  @param NewsBlastMode  NewsModeLaunch  or  NewsModeResume
     */
//    virtual void showNewsBlast(NewsBlastMode);
    
    /***********************some function only valid for Android.*********************/
    /**
     *  @brief  get SD card path.only valid for android OS.
     *
     *  @return SD card path.
     */
    getSDCardPath():string;
    
    /**
     *  @brief only valid for android OS.
     *
     *  @param message
     */
     makeToast(message:string):void;
    
    /**
     *  @brief refresh .only valid for Android OS.
     *
     *  @param sFileDir path
     */
    refreshDCIM(sFileDir:string);
    
    /**
     *  @brief rateUs.
     */
    rateUs():void;

    openUrl(path:string);
    /**
     *  申请保存相册权限
        sFileDir 传入保存的图片路径
        requestCode 保存方法  1代表保存到相册 2代表分享按钮  发邮件
     */
    doRuntimePermission(sFileDir:string, requestCode:number,cb : any);
    setEmailContentAndTitle(sFileDir:string, sFileDir:string);
}