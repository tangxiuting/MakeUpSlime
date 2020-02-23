// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export enum TweenType { linear=0 ,fade 
    ,quadIn ,quadOut,quadInOut ,quadOutIn
    ,cubicIn ,cubicOut,cubicInOut,cubicOutIn
    ,quartIn ,quartOut,quartInOut ,quartOutIn
    ,quintIn ,quintOut,quintInOut ,quintOutIn
    ,sineIn ,sineOut,sineInOut ,sineOutIn
    ,expoIn ,expoOut,expoInOut ,expoOutIn
    ,circIn , circOut , circInOut , circOutIn 
    ,elasticIn , elasticOut , elasticInOut , elasticOutIn 
    ,backIn , backOut , backInOut , backOutIn 
    ,bounceIn , bounceOut , bounceInOut , bounceOutIn
}

export  class DragUtil{
    /** 点在碰撞器内 */
    static pointInCollide(wordPos:cc.Vec2, cd:cc.Collider ,offset0:cc.Vec2=cc.Vec2.ZERO,offset1:cc.Vec2=cc.Vec2.ZERO):boolean {
        if(cd == null){
            return false;
        }
        let word = (cd as any).world;
        if(DragUtil.isBoxOrPolygo(cd)){
            let points = word.points;
            if(!offset1.equals(cc.Vec2.ZERO)){
                let points : cc.Vec2[] = word.points.slice();
                for(let i=0;i<points.length;i++){
                    points[i] = points[i].add(offset1);
                }
            }
            
            return cc.Intersection.pointInPolygon(wordPos.add(offset0),points);
        }else if(cd instanceof cc.CircleCollider){
            let pos:cc.Vec2 = word.position;
            let r:number = word.radius;
            let disVec = wordPos.add(offset0).sub(pos.add(offset1));
            return disVec.magSqr()<r*r;
        }
        return true;
    }

    /** 碰撞器相交*/
    static collideOnCollie(cd1:cc.Collider,cd2:cc.Collider ,offset0:cc.Vec2=cc.Vec2.ZERO,offset1:cc.Vec2=cc.Vec2.ZERO):boolean{
        if(cd1 == null || cd2 == null){
            return false;
        }
        let word1 = (cd1 as any).world;
        let word2 = (cd2 as any).world;
        if(DragUtil.isBoxOrPolygo(cd1) && DragUtil.isBoxOrPolygo(cd2)){
            return cc.Intersection.polygonPolygon(word1.points,word2.points);
        }else if(cd1 instanceof cc.CircleCollider && cd2 instanceof cc.CircleCollider){
             return cc.Intersection.circleCircle({position:word1.position, radius:word1.radius},{position:word2.position, radius:word2.radius});
        }else if(cd1 instanceof cc.CircleCollider && DragUtil.isBoxOrPolygo(cd2)){
            return cc.Intersection.polygonCircle(word2.points,{position:word1.position, radius:word1.radius});
        }else if(cd2 instanceof cc.CircleCollider && DragUtil.isBoxOrPolygo(cd1)){
            return cc.Intersection.polygonCircle(word1.points,{position:word2.position, radius:word2.radius});
        }
        return false;
    }
     /**cd1 all in cd2*/
    static collideInCollie(cd1:cc.Collider,cd2:cc.Collider ,offset0:cc.Vec2=cc.Vec2.ZERO,offset1:cc.Vec2=cc.Vec2.ZERO):boolean{
        if(cd1 == null || cd2 == null){
            return false;
        }
        let word1 = (cd1 as any).world;
        let word2 = (cd2 as any).world;
        if(DragUtil.isBoxOrPolygo(cd1)){
            let points1:cc.Vec2[] = word1.points;
            let flag = true;
            for(let p of points1){
                if(!DragUtil.pointInCollide(p,cd2,offset0,offset1)){
                    flag = false;
                    break;
                }
            }
            return flag;
        }else if(cd1 instanceof cc.CircleCollider && cd2 instanceof cc.CircleCollider){
            let pos1:cc.Vec2 = word1.position;
            let pos2:cc.Vec2 = word2.position;
            let r1:number = word1.radius
            let r2:number = word2.radius;
            if(r1>r2){
                return false;
            } else {
                let disV = pos2.add(offset1).sub(pos1.add(offset0));
                return disV.magSqr()<(r2-r1)*(r2-r1);
            }
        }else if(cd1 instanceof cc.CircleCollider && DragUtil.isBoxOrPolygo(cd2)){
            let pos1:cc.Vec2 = word1.position;
            let r1:number = word1.radius;
            if(!DragUtil.pointInCollide(pos1,cd2,offset0,offset1)){
                return false;
            }
            let points2:cc.Vec2[] = word2.points;
            let flag = true;
            for(let i=0;i<points2.length;i++){
                let star = points2[i].add(offset1);
                let end = points2[(i+1)%points2.length].add(offset1);
              let dis =  cc.Intersection.pointLineDistance(pos1.add(offset0),star,end,true);
               if(dis as any <r1){
                   flag = false;
                   break;
               }
            }
            return flag;
        }
        return false;
    }

    static isBoxOrPolygo(cd:cc.Collider) :boolean{
        return  cd instanceof cc.BoxCollider || cd instanceof cc.PolygonCollider;
    }
}
