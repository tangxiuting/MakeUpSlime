import SpriteDrag from './SpriteDrag/SpriteDragMS'

var math = cc.vmath;
var _vec2a = cc.v2();
var _vec2b = cc.v2();
var _mat4_temp = math.mat4.create();

cc.Node.prototype._hitTest = function(point, listener) {
   
    var drag = this.getComponent(SpriteDrag);
    if(drag && drag.enabledInHierarchy){
        return drag.hitTest(point,listener);
    }
    var w = this._contentSize.width,
            h = this._contentSize.height,
            cameraPt = _vec2a,
            testPt = _vec2b;

        var camera = cc.Camera.findCamera(this);
        if (camera) {
            camera.getScreenToWorldPoint(point, cameraPt);
        } else {
            cameraPt.set(point);
        }

        this._updateWorldMatrix();
        // If scale is 0, it can't be hit.
        if (!math.mat4.invert(_mat4_temp, this._worldMatrix)) {
            return false;
        }
        math.vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        testPt.x += this._anchorPoint.x * w;
        testPt.y += this._anchorPoint.y * h;

        if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
            if (listener && listener.mask) {
                var mask = listener.mask;
                var parent = this;
                for (var i = 0; parent && i < mask.index; ++i, parent = parent.parent) {}
                // find mask parent, should hit test it
                if (parent === mask.node) {
                    var comp = parent.getComponent(cc.Mask);
                    return comp && comp.enabledInHierarchy ? comp._hitTest(cameraPt) : true;
                }
                // mask parent no longer exists
                else {
                        listener.mask = null;
                        return true;
                    }
            } else {
                return true;
            }
        } else {
            return false;
        }
}