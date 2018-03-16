/**
     * @constructs
     * 窗口构造函数
     *
     * @param {Number} width 窗口内容部分宽
     * @param {Number} height 窗口内容部分高
     * @param {string|Dom} title 标题内容,可以是字符串或者html Dom
     * @param {stirng|Dom} strOrdom 内容,可以是字符串或者html Dom
     * @param {Function} okCallback 确定按钮回调方法，如果不设置或者设置为null则不显示确定按钮
     * @param {Function} cancelCallBack 取消按钮回调方法，如果不设置或者设置为null则不显示取消按钮
     * @param {Object} ok 按钮自定义 {class:'',name:''} class css样式
     * @param {Object} cancel 按钮自定义 {class:'',name:''}
     * @param {Function} closeHandle 窗口关闭时的回调函数
     * @param {Number} autoHideTime自动隐藏时间
     */

    import utils from "src/verdor/utils";
    import dom from "src/verdor/dom";
    import global from "src/manager/global";
    
     export class Win{

        constructor(width = 400, height = 350, title, strOrdom, okCallback, cancelCallBack, ok, cancel, closeHandle, autoHideTime){
            this.dom = dom(utils.createDomWithStr("<div class= 'win center'><div class= 'win-head'><span class= 'win-head-logo noselect' ></span><span class= 'win-head-title noselect'>标题栏</span><span class= 'win-head-close noselect'></span></div><div class= 'win-body'></div><div class= 'win-bottom'><a class= 'win-cancel gray'>取消</a><a class= 'win-ok blue '>确定</a></div></div>"));
            if(utils.type(strOrdom)==="string" && strOrdom.indexOf("<") !== 0) {
                strOrdom = '<div class="win-body-str">' + strOrdom + '</div>';
            }

            this.autoHideTime = autoHideTime === undefined ? 0 : parseInt(autoHideTime);
            this.closeHandle = closeHandle;

            var domV = this.dom[0];
            document.body.appendChild(domV);
            this.onlyID = utils.getOnlyId();
            domV.setAttribute("id",this.onlyID);
       
            if(title) this.dom.find('.win-head-title')[0].innerHTML = title;
            if(strOrdom instanceof String) this.dom.find('.win-body')[0].innerHTML = strOrdom;
            else if(utils.isDom(strOrdom)){
                if(strOrdom.style.display=="none") strOrdom.style.display = "block";
                this.dom.find('.win-body')[0].appendChild(strOrdom);
            }

            var noOk = utils.type(okCallback)!="function";
            var noCancel = utils.type(cancelCallBack)!="function";

            this.cancelCallBack = cancelCallBack;
            this.okCallback = okCallback;
            
            if(noOk) {
                dom(this.dom.find(".win-ok")).hide();
            } else {
                if(utils.type(ok) == "object") {
                    var okbtn = this.dom.find('.win-ok')[0];
                    if(ok.class) {
                        dom(okbtn).removeClass('blue');
                        dom(okbtn).addClass(ok.class);
                    }
                    if(ok.name) {
                        okbtn.innerHTML = ok.name;
                    }
                }
            }

            if(noCancel) {
                dom(this.dom.find(".win-cancel")[0]).hide();
            } else {
                if(utils.type(cancel) == "object") {
                    var cancelbtn = this.dom.find('.win-cancel')[0];
                    if(cancel.class) {
                        dom(cancelbtn).removeClass('gray');
                        dom(cancelbtn).addClass(cancel.class);
                    }
                    if(cancel.name) {
                        cancelbtn.innerHtml = cancel.name;
                    }
                }
            }

            dom(this.dom.find(".win-body")[0]).css({
                "width": 'auto',
                "height": utils.type(height) == "number" ? height +"px" : 'auto'
            });
         
            this.dom.css({
                "width": width +"px",
                "height": 'auto'
            });
            
            if(noOk && noCancel) {
                dom(this.dom.find(".win-bottom")[0]).hide();
            }
    
            if((noOk && !noCancel) || (!noOk && noCancel)) {
                dom(this.dom.find('.win-cancel')[0]).css({
                    "width": "100%"
                });
                dom(this.dom.find('.win-ok')[0]).css({
                    "width": "100%"
                });
            }
    
            this._mask = utils.createDomWithStr('<div id="mask' + this.onlyID + '" class="win-mask"></div>');

            this.winHeadClose = this.dom.find(".win-head-close")[0];
            this.winCancle = this.dom.find(".win-cancel")[0];
            this.winOk = this.dom.find(".win-ok")[0];
            
            this.winHeadClose.addEventListener("click",this.close);
            this._mask.addEventListener("click",this.close);
            this.winCancle.addEventListener("click",this.cancle);
            this.winOk.addEventListener("click",this.ok);

            domV.parentNode.removeChild(domV);

        }

        cancle=()=>{
            
            if(this.cancelCallBack) {
                var cancelback = this.cancelCallBack(this)
                if(utils.type(cancelback) == "boolean") {
                    if(cancelback) this.close();
                } else {
                    this.close();
                }
            } else {
                this.close();
            }
        }

        ok=()=>{

            if(this.okCallback) {
                
                var okback = this.okCallback(this);
                if(utils.type(okback) === "boolean") {
                    if(okback) this.close();
                } else {
                    this.close();
                }
            } else {
                this.close();
            }

        }

        resetSize() {
            var headHeight = dom(this.dom.find(".win-head")[0]).height();
            var bottomheight = dom(this.dom.find(".win-bottom")[0]).height();
            
            var maxHeight = dom(window).height();
            var maxWidth = dom(window).width();
            dom(this.dom.find('.win-body')[0]).css({
                "max-height": (maxHeight - headHeight - bottomheight) + "px"
            });
            this.dom.css({
                "max-height": maxHeight + "px"
            });
            dom(this.dom.find('.win-body')[0]).css({
                "max-width": maxWidth + "px"
            });
            this.dom.css({
                "max-width": maxWidth + "px"
            });
        }

        open(tag) {

            let bd = document.getElementById('SDWinLayer');
            if(!bd){
                bd = utils.createDomWithStr('<div id="SDWinLayer"></div>');
                document.body.appendChild(bd);
            }
            if(tag && tag !== 'center') {
                this.dom.removeClass('center');
                this.dom.addClass(tag);
            }
        
            bd.appendChild(this._mask);
            bd.appendChild(this.dom[0]);
            
            let domMask = dom(".win-mask").toArray();
            if(domMask.length){
                domMask.forEach((item,index)=>{
                    item.style.display = "none"
                    if(index === domMask.length-1) item.style.display = "block"
                })
            }

            dom("#"+this.onlyID).show(250);

            if(!dom(bd).hasClass('win-mask-show')) {
                dom(bd).addClass('win-mask-show');
            }
            window.onresize =  this.resetSize;
            this.resetSize();
            if(this.autoHideTime > 0) {
                setTimeout(() =>{
                    this.close();
                }, this.autoHideTime);
            }
        }
        
        close=()=>{

            let  d = dom("#" + this.onlyID)[0];
            dom("#" + this.onlyID).hide(250,() => {
                
                this.winHeadClose.removeEventListener("click",this.close);
                this._mask.removeEventListener("click",this.close);
                this.winCancle.removeEventListener("click",this.cancle);
                this.winOk.removeEventListener("click",this.ok);

                let maskDom = dom("#mask" + this.onlyID)[0];
                maskDom.parentNode.removeChild(maskDom);
                d.parentNode.removeChild(d);
                
                dom(".win-mask").last().show();
               
                if(dom('.win-mask').length == 0) {
                    var bd = dom("#SDWinLayer");
                    if(bd.hasClass('win-mask-show')) {
                        bd.removeClass('win-mask-show');
                    }
                }
            });
            window.onresize = null;
            if(this.closeHandle) this.closeHandle(this);
        }

        get winId(){
            return this.onlyID;
        }


     }


     let alertList = [];
     export function alert(tilte="提示信息", content, callback, width, height, autoHideTime) {
            var alertWin = new Win(width||300, height||100, tilte, content, function(win) {
                if(callback) callback(win);
                return true;
            }, null, null, null, function(t) {
                for(var i = 0; i <  alertList.length; i++) {
                    if( alertList[i].onlyID == t.onlyID) {
                         alertList.splice(i, 1);
                        break;
                    }
                }
            }, autoHideTime);
            alertWin.open();
             alertList.push(alertWin);
            if( alertList.length > 3) {
                 alertList[0].close();
            }
    };

    /**
     * 覆盖系统的confirm弹出框
     * 
     * @param {String} tilte 标题
     * @param {String} content 内容 
     * @param {Function} okCallback 确认按钮回调方法
     * @param {Function} cancelCallback 取消按钮回调方法
     * @param {Number} width 宽
     * @param {Number} height 高
     * @param {Number} autoHideTime自动隐藏时间
     */
    let confirmList = [];
    export function confirm(tilte= '提示信息', content, okCallback, cancelCallback, width, height, autoHideTime) {
         
            var confirmWin = new Win(width||300, height||100, tilte, content, function(win) {
                if(okCallback) okCallback(win);
                return true;
            }, function() {
                if(cancelCallback) cancelCallback(win);
                return true;
            }, null, null, function(t) {
                if(cancelCallback) cancelCallback(win);
                for(var i = 0; i <  confirmList.length; i++) {
                    if( confirmList[i].onlyID == t.onlyID) {
                         confirmList.splice(i, 1);
                        break;
                    }
                }
            }, autoHideTime);
            confirmWin.open();
             confirmList.push(confirmWin);
            if( confirmList.length > 3) {
                 confirmList[0].close();
            }

    }
