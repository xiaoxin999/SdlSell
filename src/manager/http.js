import Ajax from "src/verdor/ajax";
import config from 'configs'
import storage from "src/verdor/storage";
import utils from "src/verdor/utils";
import httpConfig from "src/config/http_config";
import {store} from "src/manager/store";

//let model = {};

let http = {};

export let globalData = { format: "json" };

// if (Proxy != null) {          
//     http = new Proxy({}, {
//         get(target, key, receiver) {

//             let obj = httpConfig[key];
//             if (obj) {
//                 //单条请求
//                 return getOne(key, obj);
//             } else if (key === "All") {
//                 //多条请求同时进行时
//                 // http.All([{httpId:"",data:{data:{ name:"123",phone:"2222" }}}])
//                 return getAll();
//             }
//             return Reflect.get(target, propKey, receiver);
//         }
//     })
// } else {
for (let str in httpConfig) {
    let obj = httpConfig[str];
    http[str] = getOne(str);
}
http.All = getAll();

// }

function getOne(key, obj = null) {

    var obj = obj || httpConfig[key];
    //第一参数是请求的参数
    //第二参数是请求者是否自己提供处理错误的方式
    return function(dataObj ={},hasError = false,full=false) {
        // store.commit("setLoad",true);
    	globalData.token =storage.session("token") || "token";
		
        Object.assign(obj, dataObj,{globalData} );
        //将资源缓存，需要配合后台一起做
        //              if(model[key]){
        //                  return Promise.resolve(model[key]);
        //              }
        return new Promise((resolve, reject) => {
            
            
            Ajax(obj).then(json => {
                if (json.data!==undefined) {
                    resolve(full?json:json.data);
                    //                          model[key] = json.data;
                }
                if (json.error) {
                    !hasError&&store.commit("setWin",{content:json.error.message});
                    reject({status:200,error:json.error});
                    console.log(json.error.message + " *** fail url in:" + obj.url);
                }
                // store.commit("setLoad",false);
            }).catch(error => {
                reject({status:500,error});
                !hasError&&store.commit("setWin",{content:error.message});
                console.log(error + " *** fail url in:" + obj.url);
                // store.commit("setLoad",false);
            })
        })
    }

}

function getAll() {

    return function(dataObj) {
        
        let queue = [];
        // globalData.token=storage.session("token") || "token";
        dataObj.forEach(function(item) {
            let sourceObj = httpConfig[item.httpId];
            if (!sourceObj) throw new Error("httpId: " + item.httpId + ",没有配置,请查看配置");
            Object.assign(sourceObj,{globalData},{data:item.data} );
            queue.push(Ajax(sourceObj));
        });
        return new Promise((resolve, reject) => {
            Promise.all(queue).then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            })
        })

    }

}

export default http;