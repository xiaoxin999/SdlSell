
import Vue from 'vue';
import Vuex from 'vuex';
import routerConfig from './config/routes'
import App from './app';
import VueRouter from "vue-router";
import "src/res/css/reset.css";
import "src/res/css/layout.css";
import "src/res/css/base.less";
import global from "src/manager/global";
import {store} from "src/manager/store";
import flexible from "src/verdor/flexible";
import http from "src/manager/http";
import storage from "src/verdor/storage";
import utils from "src/verdor/utils";

const zhanUlr = require("../src/res/images/zhanweifu-m.jpg");

class Main{

    constructor(){

        var cdn = process.env.ASSET_PATH;

        try{
            //php环境中
            cdn = httpDomain.cdn+"static/";
            global.isPhpEnv = true;
            global.host = httpDomain.host;
        }
        catch(e){}

        __webpack_public_path__  =  cdn;
        // global.cdnUrl = cdn;
        let router = new VueRouter({
            routes: routerConfig
        })

        flexible();

        //全局捕捉图片报错事件,加上默认图片
        document.addEventListener("error", function(e){
            var elem = e.target;
            if(elem.tagName.toLowerCase() === 'img'){
                elem.src = zhanUlr;
            }
        }, true);

        
        //非开发的模式下上传错误日志
        if(!process.env.ASSET_PATH){
            window.onerror = function(msg,fileName,line,col,error){
                
                var i = fileName.lastIndexOf("/");
                var obj = {
                    msg,fileName:fileName.slice(i+1),line,col,error,
                    "user-agent":navigator.userAgent.toLowerCase(),
                    "user":storage.session("login")&&storage.session("login").name
                }
                http.log({data:{logData:JSON.stringify(obj)}});
                return true;
            }
        }
        
        //登录时请求token
        router.beforeEach((to, from, next) => {
            store.commit('setLoad',true);
            if(this.checkLogin(next)){
                store.commit("setWin",{show:false});
                next();
                
                store.commit('setLoad',false);
            } 
        })

        Vue.use(VueRouter);
        new Vue({ router, store,render: h => h(App) }).$mount('#app');
    }

    //读取token信息
    checkLogin(next){

        let userData = storage.session("token");
        if (userData) {
            return true;
        }
        http.Login({data:{
            shopId: utils.getQueryString('shopId')||61,
            from : 0,
            code: utils.getQueryString('code')||'test'
        }}).then((data)=>{
            storage.session("token",data.accessToken);
            storage.session("login",data);
            storage.session("uploadPic",data.uploadPic);
            next();
            store.commit('setLoad',false);
        })
        
    }


}

new Main();