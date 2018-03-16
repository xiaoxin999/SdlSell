import storage from "../verdor/storage";
import utils from "../verdor/utils";
import { store } from "./store";

let global = {

    cdnUrl: "",
    isPhpEnv: false, //是否是php环境
    router: null,
    getShopId(){
        let shop = storage.session("select-shop");
        return (shop&&shop.id)||utils.getQueryString("shopId")||61;
    },
    /**
     * @description 判断对应数据是否符合条件
     * @function checkData
     * @param {Object} obj 需要判断的对象
     *  key = >{  需要判断的变量名
     *   cond:"$$<1",需要满足的条件,$代表需要判断的对象
     *   reg:/。。/需要满足的正则,此属性不能与cond同时出现，如果需要满足正则又需要满足条件，建议都写到满足条件中去
     *   pro:"*****",//不满足条件时给的提示
     * }
     * @param {Context} context 上下文环境
     * 
     * 注意事项：
     * 1.如果没有给出条件和正则,则判断该变量的值是否不等于该变量类型的原始值
        1):var a = 10,条件:a!=0;
        2)var b = "asd",条件:b!=""
       2.如果在对应的上下文环境中没有找到对应的数据,比如说局部变量变量
        此时应使用value键,把真实的值附上去
        1)  export default{
                data:function(){
                    return {b:1} 
                },
                motheds:{
                    check(){
                        let a = 10;
                        global.checkData({a:{cond:"$$>1",pro:"ssssss",value:a}},this) =====>注意:此时在对象环境变量上找不到this.a,可以在value上赋值
                    }
                }
            }
     */
    checkData(obj, context) {

        for (let key in obj) {

            let value = context[key] != undefined ? context[key] : obj[key].value;
            value = value ? value : "";
            let pro = obj[key].pro || "信息不符合要求";
            let cond = obj[key].cond;
            let reg = obj[key].reg;
            let type = utils.type(value);
            if (type === 'string') {
                value = value.trim();
            }

            if (cond && reg) throw new Erroe("reg与cond条件不能同时存在!")

            if (cond) {

                let fun = new Function('value', "if(" + cond.replace(/\$\$/g, "value") + "){return true;}return false;");
                if (!fun.call(context, value)) {
                    store.commit("setWin", {
                        title: "提示信息:",
                        content: pro
                    })
                    return false;
                }

            } else if (reg && !reg.test(value)) {
                //没有cond条件,有正则条件,并且校验结果为空时
                store.commit("setWin", {
                    title: "提示信息:",
                    content: pro
                })
                return false;
            } else {
                //没有判断条件,正则时执行
                if ((type === "string" && value === "") || (type === "boolean" && value === false) || (type === "number" && value === 0)) {
                    store.commit("setWin", {
                        title: "提示信息:",
                        content: obj[key] || "信息不符合要求"
                    })
                    return false;
                }
            }
        }

        return true;
    },
    //插入style样式的id
    id: 0,
    //管理id的对象
    idManager: {},
    //将加载css中的使用的资源路径替换，并且插进style
    replaceCssIntoStylePro(str) {

        let hash = utils.getHash(str.length > 30 ? str.slice(0, 30) : str);

        //如果是php环境，则将内部的资源路径替换
        if (this.isPhpEnv) {
            str = str.replace("needReplace/static/", this.cdnUrl)
        }

        if (!this.idManager[hash]) {
            let styleTag = document.createElement("style");
            styleTag.innerText = str;
            // styleTag.setAttribute("data-id",this.id++);
            document.head.appendChild(styleTag);
            this.idManager[hash] = hash;
        }
        // return new Promise((resolve,reject)=>{
        //     import(/* webpackChunkName:name*/"src/res/css/test.css").then((data)=>{
        //         console.log(data);
        //         resolve(data);
        //     },(error)=>{
        //         reject(error);
        //         console.log(error);
        //     })

        // require.ensure([url], function(){
        //     let dataStr = require(url);
        //     console.log(dataStr);
        // }, name); // 第三个参数设置打包名称

        // })
    },
    picObj:null,
    hashPic:{
        1:"pic",
        2:"picMiddle",
        3:"picSmall"
    },
    //type 1 是大图 2是中等图 3 是小图
    getImgUrl({type,url}={type:"1",url:""}){
        !this.picObj&&(this.picObj = storage.session("uploadPic"));
        return this.picObj[this.hashPic[type]].replace("{picName}",url);
    },

    //本地时的请求接口地址
    "host": 'http://zishi.ishandian.com.cn/weixin/',
    // "host": 'http://wx.qa.ishandian.com.cn/weixin/',
    

    // 把textarea换行显示
    line2br(text) {
        return text.split("\n").join("<br/>");
    }

}

export default global;