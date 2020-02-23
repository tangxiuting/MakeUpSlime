const {ccclass, executionOrder} = cc._decorator;

/**
 * 只点击一次的按钮，可用于防重复点击的使用场景
 * 
 */
@ccclass
@executionOrder(-1)
export default class OnceClickButton extends cc.Component {
    private _ccBtn: cc.Button = null;
    private _interactable: boolean = true;
    private _isReset: boolean = true;
    private _onClick: () => void = null;

    onLoad() {
        this.node.on('click', this._onClicked.bind(this));
    }

    start() {
        this._ccBtn = this.node.getComponent(cc.Button);
    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    }

    /**
     * 一次按钮点击事件完成
     */
    private _onClicked() {
        if (!this._isReset) {
            this._interactable = false;
            this._ccBtn && (this._ccBtn.interactable = false);
        }
    }

    private _onTouchEnded(event: cc.Event) {
        if (this._isInteractable()) {
            !!this._onClick && this._onClick();
            event.stopPropagation();
        }
    }

    private _isInteractable() {
        if (this._isReset) {
            this._isReset = false;
            return true;
        }
        return this._interactable || (this._ccBtn && this._ccBtn.interactable);
    }

    /**
     * 设置点击事件回调
     * 
     * @param onClick 点击事件回调方法
     */
    public setOnClick(onClick: () => void) {
        this._onClick = onClick;
    }  

    /**
     * 重新设置状态，但是不会重置点击事件
     */
    public reset() {
        this._isReset = true;
        this._interactable = true;
        this._ccBtn && (this._ccBtn.interactable = true);
    }
}