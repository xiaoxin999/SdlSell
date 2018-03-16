import global from "src/manager/global";

let host = global.host;

try{
    //php环境中
    host = httpDomain.host;
}
catch(e){}


let httpConfig = {
    'getUserInfo': {
        url: host + 'Shop/getUserInfo'
    },
    'getListByWeixin': {
        url: host + 'Activity/getListByWeixin'
    },
    'getListByMid': {
        url: host + 'Activity/getListByMid'
    },
    'getDetail': {
        url: host + 'Activity/getDetail'
    },
    'getExchange': {
        url: host +'Activity/getExchange'
    },
    'saveStatusByScan': {
        url: host + 'Status/saveStatusByScan',
        methods: 'post'
    },
    'goodsExchange': {
        url: host + 'Activity/goodsExchange'
    },
    'getListByWeixin': {
        url: host + 'Activity/getListByWeixin'
    },
    'getListByMid': {
        url: host + 'activity/getListByMid'
    },
    'addExchange': {
        url: host + 'Activity/addExchange',
        methods: 'post'
    },
    'getExchangeQR': {
        url: host + 'Activity/getExchangeQR'
    },
    "Login": {
        url: host + "weixin/loginWechat"
    },
    "getInventory": {
        url: host + "GoodsConfig/getInventory",
        method: "post"
    },
    "getGoodsList": {
        url: host + "GoodsConfig/getGoodsList"
    },
    "getOtherList": {
        url: host + "GoodsConfig/getOtherList"
    },
    "newWechatOrder": {
        url: host + "order/newWechatOrder",
        method: "post"
    },
    "wechatOrder": {
        url: host + "order/wechatOrder",
        method: "post"
    },
    "getVerCode": {
        url: host + "GoodsConfig/getVerCode"
    },
    "checkTable": {
        url: host + "Order/checkTable",
        method: "post"
    },
    "areaAndTableList": {
        url: host + "Order/areaAndTableList"
    },
    "getHomePageConfig": {
        url: host + "HomePage/getHomePageConfig"
    },
    "getReserveList": {
        url: host + "Reserve/getReserveList"
    },
    "ValidPayUrl": {
        url: host + "shop/payUrl"
    },
    "sendSMS": {
        url: host + "member/sendSMS"
    },
    "registerMember": {
        url: host + "member/registerMember"
    },
    "getMemberQrCode": {
        url: host + "Member/getMemberQrCode"
    },
    "getConsumeList": {
        url: host + "Member/getConsumeList"
    },
    "getRechargeConfig": {
        url: host + "Recharge/getRechargeConfig"
    },
    "wechatRecharge": {
        url: host + "Recharge/wechatRecharge",
        methods: 'post'
    },
    "payUrl": {
        url: host + "Shop/payUrl"
    },
    "getCouponByIds": {
        url: host + "Coupon/getCouponByIds"
    },
    "getWechatOrderList": {
        url: host + "Order/getWechatOrderList"
    },
    'showOrderDetail': {
        url: host + "Order/showOrderDetail"
    },
    'showOrderDetailPost': {
        url: host + "Order/showOrderDetail",
        method: "post"
    },
    "cancelUnpaidOrder": {
        url: host + "Order/cancelUnpaidOrder",
        method: "post"
    },
    "payUrl": {
        url: host + "shop/payUrl"
    },
    "wechatFastPay": {
        url: host + "Order/wechatFastPay",
        method: 'post'
    },
    "getOpenId": {
        url: host + "Weixin/getOpenId"
    },
    "getPointConfig": {
        url: host + "order/getPointConfig"
    },
    "getSelfHelpConfig": {
        url: host + "SelfHelpConfig/getSelfHelpConfig"
    },
    "getCouponList": { //获取优惠券列表
        url: host + "Coupon/getCouponList"
    },
    "getStatus": {
        url: host + 'Status/getStatus',
        methods: 'post'
    },
    "deleteStatus": {
        url: host + "Status/deleteStatus",
        methods: 'post'
    },
    "getReserveConf": {
        url: host + 'Reserve/getReserveConf'
    },
    "getReserveDetail": {
        url: host + 'Reserve/getReserveDetail',
        methods: 'post'
    },
    "getGoodsInfoByCouponId":{
        url: host + "GoodsConfig/getGoodsInfoByCouponId"
    },
    "getActivityCouponList":{
        url: host + "Coupon/getActivityCouponList"
    },
    "getCoupon":{
        url: host + "Coupon/getCoupon"
    },
    "choiceShop":{
        url:host+"Shop/choiceShop"
    },
    "addInvoice": {
        url: host + 'Invoice/addInvoice',
        methods: 'post'
    },
    "deleteInvoice": {
        url: host + 'Invoice/deleteInvoice',
        methods: 'post'
    },
    "validationRandKey": {
        url: host + 'order/validationRandKey'
    },
    "log":{
        url:host+'Weixin/printLog'
    },
    "addAddress": {
        url: host + 'Address/addAddress',
        methods: 'post'
    },
    "editAddress": {
        url: host + 'Address/editAddress',
        methods: 'post'
    },
    "get": {
        url: host + 'Activitybrand/get',
        methods: 'post'
    },
    "brandDetail": {
        url: host + 'Activitybrand/brandDetail'
    },
    "deleteReserve": {
        url: host + 'Reserve/deleteReserve'
    },
    "createOrderReserve": {
        url: host + 'Reserve/createOrderReserve',
        methods: 'post'
    },
    "orderDetailPay":{
        url: host + 'Order/orderDetailPay'
    },
    "preComputing":{
        url:host+'order/preComputing'
    },
    'weChatOnlinePay':{
        url:host+'order/weChatOnlinePay',
        method:"post"
    },
    "getAreaAndTableList": {
        url: host + 'Selfhelpconfig/getAreaAndTableList'
    },
    "getUserGoodsInfo": {
        url: host + 'GoodsConfig/getUserInfo'
    },
    "getAddressList": {
        url: host + 'Address/getAddressList'
    },
    "getInvoiceList": {
        url: host + 'Invoice/getInvoiceList',
        methods: 'post'
    },
    "Order/wechatFastPay": {
        url: host + 'Order/wechatFastPay',
        methods: 'post'
    },
    "setAddressDefault": {
        url: host + 'Address/setAddressDefault'
    },
    "getAddressDetail": {
        url: host + 'Address/getAddressDetail'
    },
    "getMemberCardAndCouponList": {
        url: host + 'Coupon/getMemberCardAndCouponList'
    },
    "updateMemberInfo": {
        url: host + 'Member/updateMemberInfo',
        methods: 'post'
    },
    'getTableDetail':{
        url:host + 'Order/getTableDetail'
    },
    "deleteAddress": {
        url: host + 'Address/deleteAddress',
        methods: 'post'
    },
    "cancelReserve": {
        url: host + 'Reserve/cancelReserve'
    },
    'addStaffInfo':{
        url:host+'Activity/addStaffInfo'
    },
    'budgetPrice' : {
        url: host + 'order/budgetPrice',
        method: "post"
    },
    "getActivityShopGoodsList":{
        url: host + 'Assistant/getActivityShopGoodsList',
    },
    "myGuide":{
        url:host+"Assistant/myGuide"
    },
    "getActivityShopList":{
        url: host + 'Assistant/getActivityShopList',
    },
    "getSlideShowList":{
        url:host+'weixin/getSlideShowList'
    },
    "myPointCardList":{
        url:host+'Assistant/myPointCardList'
    },
    "getCommentList" : {
        url: host + 'Assistant/getCommentList',
    },
    "myStaffList" : {
        url: host + 'Assistant/myStaffList',
    },
    "myGuide" : {
        url: host + 'Assistant/myGuide',
    }
}

export default httpConfig;


