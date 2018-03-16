import utils from "./utils";
import timer from "./timer";
import dom from "./dom";
import global from "src/manager/global";
import storage from "src/verdor/storage";

/**
 * @description 异步上传文件专用
 * @namespace upload
 */
let uploadfile = {

    /**
     * @description 获取url
     * @function getUrl
     * @param {String} url 字符串
     * @returns {String} 字符串
     * @memberof upload
     */
    getUrl: function (url, format, urlParams) {
        var sendParams = '';

        if (urlParams) {
            for (var key in urlParams) {
                sendParams += '&' + key + '=' + urlParams[key];
            }
        }
        var rurl = (url.indexOf('http') === 0) ? url : ((utils.type(url) == "object"?global.host[url.type]:global.host.shop) + url);

        if (rurl.indexOf('?') > 0) {
            rurl = rurl.substring(0, rurl.indexOf('?') + 1) + sendParams + '&' + rurl.substring(rurl.indexOf('?') + 1);
        } else {
            rurl += sendParams;
        }

        return rurl;
    },
    onlyid: 0,
    Queue: {},
    /**
     * @description 跨域上传文件
     * @function ajax
     * @param {Object} obj 一个对象
     * @param {String} obj.url 请求地址
     * @param {String} obj.formIdOrJson 表单id
     * @param {Function} obj.callback 请求成功时的回调
     * @param {Function} obj.failback 请求失败时的回调
     * @param {String} obj.urlparams 参数
     * @memberof upload
     */
    crosrouteroMain({
        url,
        formId,
        callback = () => {},
        failback = () => {},
        urlparams
    }) {


        return new Promise((resolve, reject) => {

            let formid;
            let oid = "upload_" + this.onlyid++;
            if (typeof (formId) == "string") {
                formid = formId;
                if (dom('#' + formid)[0].tagName != 'FORM') {
                    throw new Error('id等于' + formIdOrJson + "的form表单不存在");
                }
            }

            urlparams = Object.assign(urlparams, {
                oid: oid,
                format: "script",
                token: storage.session("token")
            });

            let obj = {
                url:this.getUrl(url),
                formId,
                callback,
                urlparams,
                oid,
                resolve,
                reject,
                timerStr: ""
            }
            this.Queue[oid] = obj;
            timer.init();
            if (!this.onlyid) {
                window.addEventListener('message', function () {
                    accData(event, data);
                }, false);
            }

            var accData = (e, data) => {
                if (!(Object.keys(this.Queue) + "")) window.removeEventListener('message', accData);
                var str = e.data.data;
                var strArr = str.split("&").slice(1);
                var obj = {};
                for (var i = 0; i < strArr.length; i++) {
                    var item = strArr[i];
                    var itemArr = item.split("=");
                    obj[itemArr[0]] = itemArr[1];
                }
                if (obj && obj.oid && this.Queue[obj.oid]) {

                    timer.clear(this.Queue[obj.oid].timerStr)
                    var backStr = decodeURIComponent(obj.encode);

                    try {
                        var jsondata = JSON.parse(backStr);
                        this.Queue[obj.oid].resolve(jsondata);
                    } catch (e) {
                        this.Queue[obj.oid].resolve({
                            error: {
                                code: 1000,
                                message: "encode数据格式错误或成功的回调函数有问题"
                            }
                        });
                    }
                    delete this.Queue[obj.oid];

                    if (data.iframe) data.iframe.remove();

                }



            }

            var postHandle = function (data) {

                data.timerStr = timer.add(function () {

                }, 10000, 1, false, function () {
                    if (data.iframe) data.iframe.remove();
                    delete this.Queue[data.oid];
                    if (!(Object.keys(this.Queue) + "")) {
                        window.removeEventListener('message', accData);
                    }
                });

            };

            var load = function () {

                var ifname = obj.formid + oid;
                obj.iframe = dom(`<iframe id=${ifname} name=${ifname} style="display:none"></iframe>`)[0]
                document.body.appendChild(obj.iframe);

                var mform = dom('#' + obj.formid)[0];
                mform.setAttribute("action", obj.url);
                mform.setAttribute('target', ifname);
                mform.setAttribute('method', 'post');
                mform.submit();

                postHandle(obj);

            };


            load();

        })

    }
}

export default uploadfile;