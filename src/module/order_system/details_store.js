import Vuex from 'vuex';
import s from "src/manager/store";
import utils from "src/verdor/utils";


let orderData = null;

function esGoods(state, obj){
    // 比较商品口味是否相同
    if (obj.data.length === 0) return false;
    var list = state[obj.operateObj];
    var index = null;

    for (var i = 0; i < list.length; i++) {
        let item = list[i];
        let goods = obj.data;
        if (item.goodsName === goods.goodsName && item.id === goods.id &&  item.attrInfo === goods.attrInfo && goods.type != "1"){
            // 口味相同合并
            item.num = (obj.operateType === "push") ? Number(item.num) + Number(goods.num) : goods.num;
            if (item.num == 0) list.splice(i,1);
            return list;
        } else if (item.goodsName === goods.goodsName && item.id === goods.id && goods.isAttr === false &&  goods.type != "1"){
             // 没有口味，id商品名相同合并
            item.num = (obj.operateType === "push") ? Number(item.num) + Number(goods.num) : goods.num;
            if (item.num == 0) list.splice(i, 1);                         
            return list;
        } else if (item.goodsName === goods.goodsName && item.id === goods.id &&  goods.type == "1" && obj.operateType == "splice"){
            // 处理斤两菜
            item.num = goods.num;
            if (item.num == 0) list.splice(i, 1);
            return list;
        } else if (item.packageName && item.id === goods.id && item.packageKey === goods.packageKey){
            // 合并套餐
            item.num = (obj.operateType === "push") ? Number(item.num) + Number(goods.num) : goods.num;
            if (item.num == 0) list.splice(i, 1);
            return list;
        }
    }
    list.push(obj.data);
    return list;
}


//创建Store实例
let store = new Vuex.Store({
    // 存储状态值
    state: {
        shopCarNum : 0, // 购物车总数量
        shopCarPrice : 0, // 购物车总价格
        carGoodsList: [], // 购物车商品列表
        carPackageList: [], // 购物车套餐列表
        maxNum : 0, // 商品在购物车中的总数量
        shopCarObj : {}, // 加入购物车的商品，id为键，总数量为key
        groupObj : {}, // 多规格数据
        isMember : false, // 是否为会员
        memberDiscount : 0 // 会员折扣率
    },
    // 状态值的改变方法,操作状态值
    // 提交mutations是更改Vuex状态的唯一方法
    mutations: {
        setCarList(state,obj){
            // 设置购物车列表

            /**
             * @param {Object} obj
             * @param {Object} obj.data // 操作数据
             * @param {String} obj.operateObj // 操作对象, carGoodsList或carPackageList
             * @param {String} obj.operateType // 操作类型, push或splice
             */

            let operateObj = obj.operateObj;
            let operateType = obj.operateType;
            let data = obj.data;
            state[operateObj] = esGoods(state,obj); // 处理商品加减
            

            // 获取总价格，总数量，下标
            this.commit("getCarMaxNum", obj);

            if(data.groupId > 0){
                // groupId为壳子菜id
                if (!state.groupObj[data.groupId]){
                    state.groupObj[data.groupId] = {
                        [data.id] : state.maxNum
                    }
                }else{
                    state.groupObj[data.groupId][data.id] = state.maxNum;
                }
            }

            var gid = (data.groupId > 0) ? data.groupId : data.id; // 该商品为规格菜则使用壳子菜id，否则使用商品id
            var groupArr = Object.values(state.groupObj[data.groupId] || []) || []; // 当前壳子菜包含总数量
            var doSums = (arr, currentValue) => arr + currentValue;
                state.maxNum = (data.groupId > 0) ? groupArr.reduce(doSums) : Number(state.maxNum)

            state.shopCarObj[gid] = {
                "num": state.maxNum
            }
            state.shopCarObj = utils.deepCopy(state.shopCarObj);
        },
        resetShopCar(state){
            /**
             * 重置购物车
             */

            state.shopCarObj = {};
            state.groupObj = {};
            state.shopCarPrice = 0;
            state.shopCarNum = 0;
            state.maxNum = 0;
            state.carGoodsList = [];
            state.carPackageList = [];            
        },
        setMemberInfo(state,obj){
            // 设置会员信息
            state.isMember = obj.isMember;
            state.memberDiscount = obj.memberDiscount;
        },
        getCarMaxNum(state,obj){
            // 获取购物车商品总数量
            /**
             * @param {Object} obj // 同setCarList
             */
            // debugger;
            var list = state.carGoodsList.concat(state.carPackageList); // 商品和套餐合并数据
            var id = obj.data.id; // 商品id或套餐id
            var maxNum = 0; // 该商品在购物车中的总数量
            var shopCarNum = 0; // 购物车商品总数量
            var shopCarPrice = 0; // 购物车商品总价

            for (var i = 0; i < list.length; i++) {
                var item = list[i];

                if (item.goodsName && item.id === id) {
                    maxNum += Number(item.num);
                } else if (item.packageName && item.id === id){
                    maxNum += item.num;
                }

                if (item.goodsName && item.type === '1') {
                    // 斤两菜默认为一份
                    shopCarNum += 1;
                } else if (item.goodsName){
                    shopCarNum += item.num;
                }

                if (item.goodsName){
                    // 商品价格计算公式为：商品价格 * 商品数量 + 商品口味总价格
                    // 会员价计算公式为：isVip为1，取vipPrice，isVip为2：price * memberDiscount
                    var attrPrice = item.attrPrice || 0;
                    var price = (state.isMember) ? (item.isVip == "0") ? item.price : (item.isVip == "1") ? item.vipPrice : (item.price * state.memberDiscount).toFixed(2) : item.price;
                    shopCarPrice += (Number(price) + Number(attrPrice)) * item.num;
                }

                if (item.packageName){
                    shopCarNum += item.num;
                    // 套餐价格计算公式为：套餐价格 + 套餐数量
                    var price = (state.isMember) ? (item.isVip == "0") ? item.price : (item.isVip == "1") ? item.vipPrice : (item.price * state.memberDiscount).toFixed(2) : item.price;
                    shopCarPrice += price * item.num;
                }
                
            }

            state.maxNum = maxNum;
            state.shopCarNum = shopCarNum;
            state.shopCarPrice = shopCarPrice.toFixed(2); // 价格保留2位小数
        }
    },
    // 在store中定义getters（可以认为是store的计算属性）。Getters接收state作为其第一个函数
    getters: {

    },
    // actions: {
    //     global ({ state, commit, rootState }) {
    //             // if ((state.count + rootState.count) % 2 === 1) {
    //             //     commit('increment')
    //             // }
    //             commit("setWin",{title:"sss",content:"sssss"});
    //     }
    // },
    modules:{
        global:s
    }
})

export default store;