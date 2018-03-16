/*
 *   旧版积分商城
 */
const Detail = (resolve) =>
    import ( /* webpackChunkName: "detail" */ 'src/module/integral_mall/detail');
const intergralMall = (resolve) =>
    import ( /* webpackChunkName: "intergral_mall" */ 'src/module/integral_mall/intergral_mall');
const Recond = (resolve) =>
    import ( /* webpackChunkName: "record" */ 'src/module/integral_mall/record');
const Exchange = (resolve) =>
    import ( /* webpackChunkName: "exchange" */ 'src/module/integral_mall/exchange');

/* 点单 */
const tableSelect = (resolve) =>
    import ( /* webpackChunkName: "table_select" */ 'src/module/order_system/table_select');
const Order = (resolve) =>
    import ( /* webpackChunkName: "order" */ 'src/module/order_system/order');
const Search = (resolve) =>
    import ( /* webpackChunkName: "search" */ 'src/module/order_system/search');
const ShopSelect = (resolve) =>
    import ( /* webpackChunkName: "shop_select" */ 'src/module/order_system/shop_select');    
const addAddress = (resolve) =>
    import ( /* webpackChunkName: "add_address" */ 'src/module/order_system/add_address');   
const choseAddress = (resolve) =>
    import ( /* webpackChunkName: "chose_address" */ 'src/module/order_system/chose_address');
const addBill = (resolve) =>
    import ( /* webpackChunkName: "add_bill" */ 'src/module/order_system/add_bill');
const choseBill = (resolve) =>
    import ( /* webpackChunkName: "chose_bill" */ 'src/module/order_system/chose_bill');
const chooseCoupon = (resolve) => 
    import ( /* webpackChunkName: "choose_coupon" */ 'src/module/order_system/choose_coupon');
const orderPackage = (resolve) =>
    import ( /* webpackChunkName: "orderPackage" */ 'src/module/order_system/package');    
const oSuccess = (resolve) => 
    import ( /* webpackChunkName: "osuccess" */ 'src/module/order_system/osuccess')
const selfPayDetail = (resolve) => 
    import ( /* webpackChunkName: "self_pay_detail" */ 'src/module/order_system/self_pay_detail')


/* 优惠券 */
const Coupon = (resolve) =>
    import ( /* webpackChunkName: "coupon" */ 'src/module/coupon/coupon');
const CouponDetail = (resolve) =>
    import ( /* webpackChunkName: "coupon_detail" */ 'src/module/coupon/coupon_detail');
const GetCoupon = (resolve) =>
    import ( /* webpackChunkName: "get_coupon" */ 'src/module/coupon/get_coupon');  


/* 微店首页 */
const WechatIndex = (resolve) =>
    import ( /* webpackChunkName: "wechat_index" */ 'src/module/wechat_index/wechat_index');

/* 会员模块 */
const MemberRegister = (resolve) =>
    import ( /* webpackChunkName: "member_register" */ 'src/module/member/member_register');
const MembershipJoin = (resolve) =>
    import ( /* webpackChunkName: "membership_join" */ 'src/module/member/membership_join');
const MembershipInfo = (resolve) =>
    import ( /* webpackChunkName: "membership_info" */ 'src/module/member/membership_info');
const MemberIntegral = (resolve) =>
    import ( /* webpackChunkName: "member_integral" */ 'src/module/member/member_integral');
const memberCards = (resolve) =>
    import ( /* webpackChunkName: "member_cards" */ 'src/module/member/member_cards')
const personalInfo = (resolve) => 
    import ( /* webpackChunkName: "personal_info" */ 'src/module/member/personal_info');

/* 会员权益 */
const Recharge = (resolve) =>


    import ( /* webpackChunkName: "recharge" */ 'src/module/recharge/recharge');
const RechargeDetail = (resolve) =>
    import ( /* webpackChunkName: "recharge_detail" */ 'src/module/recharge/recharge_detail');



/* 会员中心 */
const memberCenter = (resolve) =>
    import ( /* webpackChunkName: "member_center" */ 'src/module/member_center/member_center');
const memberCenterOrderData = (resolve) =>
    import ( /* webpackChunkName: "member_center_orderlist" */ 'src/module/member_center/member_center_orderlist');
const memberCenterOrderSince = (resolve) =>
    import ( /* webpackChunkName: "member_center_order_since" */ 'src/module/member_center/member_center_order_since');
const memberCenterOrderDetail = (resolve) =>
    import ( /* webpackChunkName: "member_center_order_detail" */ 'src/module/member_center/member_center_order_detail');
const memberCenterOrderCancel = (resolve) =>
    import ( /* webpackChunkName: "member_center_order_cancel" */ 'src/module/member_center/member_center_order_cancel');


/* 预约 */

const Bespeak = (resolve) =>
    import ( /* webpackChunkName: "bespeak" */ 'src/module/bespeak_system/bespeak');
const BespeakList = (resolve) =>
    import ( /* webpackChunkName: "bespeak_list" */ 'src/module/bespeak_system/bespeak_list');
const BespeakDetail = (resolve) =>
    import ( /* webpackChunkName: "bespeak_detail" */ 'src/module/bespeak_system/bespeak_detail');


/* 新版积分商城 */
 

const NewIntegralMall = (resolve) =>
    import ( /* webpackChunkName: "new_integral_mall" */ 'src/module/new_integral/new_integral_mall');
const exchangeRecord = (resolve) =>
    import ( /* webpackChunkName: "exchange_record" */ 'src/module/new_integral/exchange_record');
const exchangeCode = (resolve) =>
    import ( /* webpackChunkName: "exchange_code" */ 'src/module/new_integral/exchange_code');
const mallGoodsDetail = (resolve) =>
    import ( /* webpackChunkName: "mall_goods_detail" */ 'src/module/new_integral/mall_goods_detail')
const mallRegister = (resolve) =>
    import ( /* webpackChunkName: "mall_register" */ 'src/module/new_integral/mall_register')
const exchangeSuccess = (resolve) =>
    import ( /* webpackChunkName: "exchange_success" */ 'src/module/new_integral/exchange_success')

/* 闪店微信错误监控系统 */
const testError = (resolve) =>
    import ( /* webpackChunkName: "test_error_index" */ 'src/module/test_error/test_error_index');

/* 品牌 */
const brandList = (resolve) =>
    import ( /* webpackChunkName: "brand_list" */ 'src/module/brand/brand_list' );
const brandDetail = (resolve) =>
    import ( /* webpackChunkName: "brand_detail" */ 'src/module/brand/brand_detail' );

let orderView = { template: "<div style='height:100%'><router-view name='header'></router-view><router-view name='default'></router-view><router-view name='footer'></router-view></div>" }

/* 支付系统 */
const Pay = (resolve) => 
    import ( /* webpackChunkName: "pay" */ 'src/module/pay/pay' )
const wechatPay = (resolve) => 
    import ( /* webpackChunkName: "wechat_pay" */ 'src/module/pay/wechat_pay')
const payDetails = (resolve) =>
    import ( /* webpackChunkName: "pay_details" */ 'src/module/pay/pay_details');

    /* 绑定兑换权限 */
const staff = (resolve) =>
        import ( /* webpackChunkName: "staff" */ 'src/module/staff/staff');
/* 闪店卖手 */
const sellerIndex = (resolve) =>
    import( /* webpackChunkName: "seller_index" */ 'src/module/seller_assis/seller_index');
const interCard = (resolve) =>
    import( /* webpackChunkName: "inter_card" */ 'src/module/seller_assis/inter_card/inter_card'); 
const interCardDetail = (resolve) =>
    import( /* webpackChunkName: "inter_detail" */ 'src/module/seller_assis/inter_card/inter_detail'); 
const distriCard = (resolve) =>
    import( /* webpackChunkName: "distri_card" */ 'src/module/seller_assis/inter_card/distri_card'); 

/* 用户中心 */
const userCenter = (resolve) =>
    import( /* webpackChunkName: "inter_card" */ 'src/module/seller_assis/user_center/user_center'); 
const assCenter = (resolve) =>
    import( /* webpackChunkName: "inter_card" */ 'src/module/seller_assis/user_center/ass_center'); 

/* 我的专属导购 */
const shoppingGuide = (resolve) =>
    import( /* webpackChunkName："shoppingGuide" */ 'src/module/seller_assis/shopping_guide/shopping_guide')
/* 我的点评 */
const myComments = (resolve) =>
    import( /* webpackChunkName："myComments" */ 'src/module/seller_assis/shopping_guide/my_comments')
const rankList = (resolve) =>
    import( /* webpackChunkName："ass_rank_list" */ 'src/module/seller_assis/user_center/ass_rank_list')
/* 没有专属客服 */
const notHaveShoppingGuide = (resolve) =>
    import( /* webpackChunkName："notHaveShoppingGuide" */ 'src/module/seller_assis/shopping_guide/not_have_shopping_guide')
/* 店员信息 */
const shopAssistantInfo = (resolve) =>
    import( /* webpackChunkName："shopAssistantInfo" */ 'src/module/seller_assis/shopping_guide/shop_assistant_info')
const myConsumer = (resolve) =>
    import( /* webpackChunkName："shopAssistantInfo" */ 'src/module/seller_assis/shopping_guide/my_consumer')
/* 聊天页面 */
const chatPage = (resolve) =>
    import( /* webpackChunkName："chatPage" */ 'src/module/seller_assis/chat/chat_page')
/* 疯抢专栏 */
const crazyRobbery = (resolve) =>
    import( /* webpackChunkName："crazyRobbery" */ 'src/module/seller_assis/crazy_robbery/crazy_robbery')

/* 客户列表 */
const customerList = (resolve) =>
    import( /* webpackChunkName："customer_list" */ 'src/module/seller_assis/customer/customer_list')
/* 选择门店 */
const chooseShop = (resolve) =>
    import( /* webpackChunkName："chooseShop" */ 'src/module/seller_assis/choose_shop/chooseshop')
/* 商品详情 */
const goodsDetail = (resolve) =>
    import( /* webpackChunkName："goodsDetail" */ 'src/module/seller_assis/goods_detail/goodsDetail')


export default [ 
    /*
    *   旧版积分商城
    */
    {
        path: '/detail',
        component: Detail
    },
    {
        path: '/intergralMall',
        component:intergralMall
        
    }, {
        path: '/record',
        component:Recond
    }, , {
        path: '/exchange',
        component:Exchange
    },
    /* 点单 */
    {
        path: '/tableSelect',
        component:tableSelect
    },
    {
        path: '/order',
        component:Order,
        meta:{
            keepAlive: false 
        }
    },
    {
        path: "/search",
        component: Search
    },
    {
        path: '/shopSelect',
        component:ShopSelect
    }, { 
        path: '/addAddress',
        component:addAddress
    },{
        path: '/choseAddress',
        component:choseAddress
    },{
        path: '/addBill',
        component:addBill
    },{
        path: '/choseBill',
        component:choseBill
    },{
        path: '/chooseCoupon',
        component:chooseCoupon
    },

    {
        path: '/package',
        component: orderPackage
    },{
        path: '/oSuccess',
        component:oSuccess
        
    },{
        path:'/wechatPay',
        component:wechatPay
    },
    {
        path:'/selfPayDetail',
        component:selfPayDetail
    },
    /* 优惠券 */
    {
        path: "/coupon",
        component:Coupon
    },
    {
        path: "/couponDetail",
        component:CouponDetail
    },
     {
        path: "/getCoupon",
        component:GetCoupon
    },
    /* 微店首页 */
    {
        path: "/wechatIndex",
        component:WechatIndex
    },
    /* 会员模块 */
    {
        path: "/memberRegister",
        component:MemberRegister
    }, {
        path: "/memberShipJoin",
        component:MembershipJoin
    }, {
        path: "/memberShipInfo",
        component:MembershipInfo
    }, {
        path: "/memberIntegral",
        component: MemberIntegral
    },{
        path: '/memberCards',
        component: memberCards
    },{
        path: '/personalInfo',
        component: personalInfo
    },
    /* 会员权益 */
    {
        path: "/recharge",
        component: Recharge
    }, {
        path: "/RechargeDetail",
        component: RechargeDetail
    },
    /* 会员中心 */
    {
        path: "/memberCenter",
        component: memberCenter
    },
    {
        path: "/memberCenterOrderData",
        component: memberCenterOrderData
    },
    {
        path: "/memberCenterOrderSince",
        component: memberCenterOrderSince
    },
    {
        path: "/memberCenterOrderDetail",
        component: memberCenterOrderDetail
    },
    {
        path: "/memberCenterOrderCancel",
        component: memberCenterOrderCancel
    },
    /* 预约 */
    {
        path: '/bespeak',
        component: Bespeak
    },
    {
        path: '/bespeakList',
        component: BespeakList
    }, {
        path: '/bespeakDetail',
        component: BespeakDetail
    },
    /* 新版积分商城 */
    {
        path: '/newIntegralMall',
        component: NewIntegralMall
    }, {
        path: '/exchangeRecord',
        component: exchangeRecord
    }, {
        path: '/exchangeCode',
        component: exchangeCode
    }, {
        path: '/mallGoodsDetail',
        component: mallGoodsDetail
    }, {
        path: '/mallRegister',
        component: mallRegister
    }, {
        path: '/exchangeSuccess',
        component: exchangeSuccess
    },{
        path: '/testError',
        component: testError
    },{
        path: '/brandList',
        component: brandList
    },{
        path: '/brandDetail',
        component: brandDetail
    },{
        path: '/Pay',
        component: Pay
    },
    {
        path: "/payDetails",
        component: payDetails
    },
    {
        path: "/staff",
        component: staff
    },
/**
 * 以下为老版本路由跳转
 * 
*/
    {
        path: '/integral-mall',
        component: intergralMall
    },{
        path: '/membership-join',
        component: MembershipJoin
    },
    {
        path: '/choiceTable',
        component: tableSelect
    },{
        path: '/choiceShop',
        component: ShopSelect
    },{
        path: '/orderList',
        component: memberCenterOrderData
    },{
        path: '/user-center',
        component: memberCenter
    },{
        path: '/wechat-index',
        component: WechatIndex
    },{
        path: '/brand-list',
        component: brandList
    },
/**
 * 闪店卖手
 */
    {
        path: '/userCenter',
        component: userCenter
    },{
        path: '/shoppingGuide',
        component: shoppingGuide
    },
    {
        path: "/sellerIndex",
        component: sellerIndex
    },
    {
        path: "/interCard",
        component: interCard
    },
    {


        
        path: "/interCardDetail",
        component: interCardDetail
    },
    {
        path: "/customerList",
        component: customerList
    }, {
        path: "/myComments",
        component: myComments
    }, {
        path: "/assCenter",
        component: assCenter
    }, {
        path: "/rankList",
        component: rankList
    },{
        path: "/notHaveShoppingGuide",
        component: notHaveShoppingGuide
    },{
        path: "/shopAssistantInfo",
        component: shopAssistantInfo
    },{
        path: "/myConsumer",
        component: myConsumer
    }
    ,{
        path: "/distriCard",
        component: distriCard
    },{
        path: "/chatPage",
        component: chatPage
    },{
        path: "/chooseShop",
        component: chooseShop
    },{
        path: "/goodsDetail",
        component: goodsDetail
    },{
        path: "/crazyRobbery",
        component: crazyRobbery
    }
]