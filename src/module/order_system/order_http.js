
import http from "src/manager/http";
import utils from "src/verdor/utils";
import eventUtils from "src/verdor/event-utils";
import {store} from "src/manager/store";
import orderStore from "./details_store";
import storage from "src/verdor/storage";
import global from "src/manager/global";

    let orderHttp = {};
    // 检查是否第一次初始化
    orderHttp.firstInit = false;
    // getGoodsList是否处理完毕
    orderHttp.goodsconfigLoaded = false;
    // getOtherList是否处理完毕
    orderHttp.otherconfigLoaded = false;
    // 数据有更新
    orderHttp.changed = false;

    var fid = null;

    let code = utils.getQueryString('code') || '61';

    //获取店铺的基本信息
    orderHttp.getOpenId = async function () {

            var userDate = storage.session("wechatShop");
            if(userDate){
                return userDate;
            }
            try{
                
                let userData = await http.getUserInfo({
                    data:{
                        shopId: global.getShopId(),
                        type : 1,
                        from: 0
                    }
                });

                var users = utils.deepCopy(storage.session("login"));
                for(var key in users){
                    userData[key] = users[key];
                }
                let obj = utils.deepCopy(userData);
                storage.session("wechatShop", obj);
                fid = obj.mid;
                return obj;
            }
            catch(e){
                
            } 
    }
    

 /**
     * 获取商品库存
     * 
     * @param {Function} callback
     * @param {v} failback
     */
    orderHttp.getInventoryList = async function() {
        let data = await http.getInventory({
            data: {
                shopId: global.getShopId(),
                code: code
            }
        });
        storage.localData('inventoryList_'+global.getShopId(),data);

        return { type:"parserInventory",data}

        
    }
    /**
     * 分页获取店铺的商品列表
     */
    orderHttp.getGoodsList = async function() {
        // 分页获取商品信息缓存
        orderHttp.goods = [];
        // 获取商品信息分页缓存
        var total = 1;
        let data = await http.getGoodsList({
            data:{
                page: 1,
                shopId: global.getShopId(),
                code: code
            }
        });
        if(data.list.length > 0){
            orderHttp.goods = data.list;
            total = (data.total == undefined || data.total == 0) ? total : data.total;
            let load = [];
            for(let i = 1;i<total;i++){
                let obj = {};
                obj.httpId = 'getGoodsList';
                obj.data = {
                    page:i+1,
                    shopId: global.getShopId()
                }
                load.push(obj);
            }
            
            let dataAll = await http.All(load);
            dataAll.forEach((item)=>{ orderHttp.goods = orderHttp.goods.concat(item.data.list)});

            return {type:"parserGood",data:orderHttp.goods}
            
        }
    };

    // 获取店铺的所有信息(区域、桌台、分类、套餐、口味、退菜原因、支付方式、活动(暂无数据))
    orderHttp.getOtherList = async function() {
        let data = await http.getOtherList({ 
            data:{
                shopId: global.getShopId(),
                code: code
            }
        });
        // storage.localData('otherList_'+global.getShopId(),data);

        return {type:"parserOther",data}

    };
    
    /**
     * 加菜
     * 
     * @param {Number} oid 订单oid
     * @param {String} fid 微信会员id
     * @param {String} detail  提交的数据格式
     * @param {Function} callback
     * @param {Function} failback
     * string $_POST['oid'] //
     */
    orderHttp.newWechatOrder = async function(sendInfo, callback=()=>{}, failback=()=>{}) {

        try{
            let data = await http.newWechatOrder({
                data:sendInfo,
                shopId: global.getShopId(),
                code: code
            },true,true);
            callback(data);
        }
        catch(e){
            console.log(e);
            if(e.status == 200){
                store.commit("setWin",{title:"订单提交返回数据异常:",content:e.message});
            }else{
                store.commit("setWin",{title:"操作超时，请联系服务员，防止多次下单！",content:e.message});
            }   
            failback(e);
        }

        
    };
 /**
     * 点菜
     * 
     * @param {Number} tableId 桌台id
     * @param {String} person 人数
     * @param {String} detail  提交的数据格式
     * @param {Function} callback
     * @param {Function} failback
     * 暂时废弃
     */
    orderHttp.wechatOrder = async function(sendInfo, callback=()=>{}, failback=()=>{}) {
            
        try{
            let data = await http.wechatOrder({data:{
                shopId: global.getShopId(),
                tableId:sendInfo.tableId,
                person:sendInfo.person,
				tableName:sendInfo.Tname,
                fid:fid,
                data: sendInfo.detail,
                code: code
            }},true);
            callback(data);
        }
        catch(e){
            if(e.status == 200){
                store.commit("setWin",{title:"订单提交返回数据异常:",content:e.message});
            }else{
                store.commit("setWin",{title:"操作超时，请联系服务员，防止多次下单！",content:e.message});
            }   
            failback(e);
        }
        
        
    };
    /*
     * @param {Function} callback
     * @param {Function} failback
     */
    orderHttp.getVerCode =  async function () {

        try{
            let data = await http.getVerCode({data:{
                shopId: global.getShopId()
            }})
            return data;
        }
        catch(e){
            return Promise.reject(e);
        }   
          
    }

export default orderHttp;