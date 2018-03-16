<template>
    <div id="newOrder">

	<!--点单页面-->
	<div class="order" id="order" v-cloak>
		<goodsClassify :navsList="headerList" @navs="getGoods"></goodsClassify>
		<div class="goodsShow" ref="goodsShow">
			<div class="goods-c1">
				<template v-for="(g,index) in firstGoods">
					<div class="c1" :key="index">

						<div class="ban-goods" v-if="banGoods(g)">
              
							<div class="ban-line" style="left: 0;">
							</div>
							<div class="ban-text ban-center">
								售完
							</div>
							<div class="ban-line" style="right: 0;">
							</div>
						</div>
						<div class="c1-c">
							<div class="img" @click="showGoodsDetail(g,index)">
                <div class="hide-img"></div>
								<img  :src="getImgUrl(g.imageName)" alt="" />
							</div>
							<div class="name" v-if="g.goodsName">{{g.goodsName}}</div>
							<div class="name" v-else>{{g.packageName}}</div>
							<div class="price" style="color: #FF463B;">
								<span :class="g.isVip != '0'? 'fl' : '' ">¥{{getMinPrice(g)}}</span>
								<span v-if="g.isVip != '0'" class="vipPrice fl" style="margin-left: 0.29333rem;">会员价&nbsp;¥{{getMinPrice(g,'type')}}</span>
							</div>
							<img src="../../res/images/msg-bg-number.png" class="triangle" v-if="$store.state.shopCarObj[g.id] && $store.state.shopCarObj[g.id].num > 0" />
							<div class="num" v-if="$store.state.shopCarObj[g.id] && $store.state.shopCarObj[g.id].num > 0">{{$store.state.shopCarObj[g.id].num}}</div>
              
						</div>
						<div class="plohder">
							<img src="../../res/images/msg-label-taocan.png" v-if="g.packageName" />
							<img src="../../res/images/msg-label-jinliang.png" v-if="!g.packageName && g.type == 1" />
							<img src="../../res/images/msg-label-taste.png" v-if="!g.packageName &&  g.isAttr" />
						</div>
						<div class="hot-goods" style="bottom: 0;" v-if="g.isRecommend == 1">
							<img style="bottom: -0.2rem;width:1.2rem" src="../../res/images/hot-goods.png" />
						</div>
					</div>
				</template>
			</div>
      
			<div class="goods-c2">
				<template v-for="(g,index) in secondGoods" >
					<div class="c2" :key ="index">

						<div class="img" @click="showGoodsDetail(g,index)">
							<div class="ban-goods" v-if="banGoods(g)">
								<div class="ban-line" style="left: 0;">
								</div>
								<div class="ban-text ban-center" style="font-size: 0.4rem;">
									售完
								</div>
								<div class="ban-line" style="right: 0;">
								</div>
							</div>
							<img  :src="getImgUrl(g.imageName)" alt="" />

						</div>
						<div class="con">
							<div class="con-name" v-if="g.goodsName">
								{{g.goodsName}}
							</div>
							<div class="con-name" v-else>
								{{g.packageName}}
							</div>
							<div class="con-explain">
								<div class="kind" v-if="!g.packageName && g.isAttr">口味</div>
								<div class="kind" style="background-color: #5A80CD;" v-if="g.packageName">套餐</div>
								<div class="kind" style="background-color: #C68850;" v-if="!g.packageName && g.type == 1">斤两菜</div>
							</div>
							<div class="con-operation">
								<div class="price" style="width: 65%;">
									<span>¥{{getMinPrice(g)}}</span>
									<span v-if="g.isVip != '0'" class="vipPrice">会员价&nbsp;¥{{getMinPrice(g,'type')}}</span>
								</div>
								<div class="num" style="width: 35%;">
									<div class="number">
										<span v-if="$store.state.shopCarObj[g.id] && $store.state.shopCarObj[g.id].num > 0">{{$store.state.shopCarObj[g.id].num}}</span>
										<div class="btn" style="left: 0;" v-if="$store.state.shopCarObj[g.id] && $store.state.shopCarObj[g.id].num > 0" @click="goodsNumDown(g,index)"> <img src="../../res/images/btn-jian.png" /></div>
										<div class="btn" style="right: 0;" @click="goodsNumUp($event,g,index)"><img src="../../res/images/btn-jia.png" /></div>
									</div>
								</div>
							</div>
						</div>
						<div class="hot-goods" style="top: 0;" v-if="g.isRecommend == 1">
							<img style="top: -0.2rem;" src="../../res/images/hot-goods.png" />
						</div>
					</div>
				</template>
        <div ref='lazyloadDiv' class='lazyloadDiv'></div>
			</div>
		</div>
    <shopCar></shopCar>
    <transition name='fade'>
		  <component :is="currentView" v-if="show" @close="closeWin"></component>
    </transition>
    <section v-if="isShowOutline" id="outline">
        <header class="outline-header">
			<ul>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</header>
		<section class="outline-content">
			<ul>
				<li>
					<div></div>
					<p></p>
					<p></p>
				</li>
				<li>
					<div></div>
					<p></p>
					<p></p>
				</li>
				<li>
					<div></div>
					<p></p>
					<p></p>
				</li>
				<li>
					<div></div>
					<p></p>
					<p></p>
				</li>
			</ul>
		</section>
		<section class="outline-list">
			<div class="goods-list">
				<div class="goods-left"></div>
				<div class="goods-right">
					<p></p>
					<p></p>
					<p>
						<span></span>
						<span></span>
					</p>
				</div>
			</div>
			<div class="goods-list">
				<div class="goods-left"></div>
				<div class="goods-right">
					<p></p>
					<p></p>
					<p>
						<span></span>
						<span></span>						
					</p>
				</div>
			</div>
		</section>
		<footer class="footer">
			<p></p>
			<p></p>
		</footer>
	</section>
	</div>
	<span class="smallBoll" ref="smallBoll"></span>
	
</div>
</template>
<script>
import storage from "src/verdor/storage";
import orderHttp from "./order_http";
import utils from "src/verdor/utils";
import goodsClassify from "./goods_classify";
import global from "src/manager/global";
import store from "./details_store";
import http from "src/manager/http";
//供懒加载使用
let lastSecondDom = null;
let timer = "";
const hh = utils.getWindowWH().h;
const isPhone = utils.isPhone();
let scrollTop = 0;
let shopId = utils.getQueryString("shopId") || 61;
let orderData = null;
let isInitAagin = false;//是否数据解析失败重新加载了

export default {
  data() {
    return {
      c1: [], //方块样式的列表（固定4个）
      c2: [], //列表样式的列表

      carNumGL: [], //购物车商品 整合
      carNumPL: [], //购物车套餐整合
      oTotalNum: 0, //购物车的总数量
      oTotalPrice: 0, //购物车的总价
      gray: false,
      selectWay: false, //选择方式
      bespeakdetail: "", //预约详情地址
      SelfHelpConfig: "", //自助模式的配置
      selectPayWay: "", //选择的支付方式
      isShowVipPrice: storage.session("isShowVipPrice"),
      groupGoodsObj: null,
      currentView: "",
      show: false, //是否展示商品详情和购物车内容
      headerList: [], //导航列表
      goodsList: [], // 显示的商品列表
      menuInfo: { id: "-1", pid: "-1" }, // 选中的分类信息
      secondGoods: [], //第二部分数据列表显示
      isShowOutline: true,
      memberInfo : null, // 自助模式取memberInfo，微信点餐取wechatShop  
      discount : null // 获取会员等级折扣 
    };
  },
  watch: {
    selectWay: "chengeHB"
  },
  store,
  methods: {
    getGoods(navInfo) {
      //搜索

      this.menuInfo = navInfo;
      if (navInfo.name == "search") {
        this.$router.push("/search");
      } else {
        let padding = "2.51rem";
        let classNames =
          navInfo.type == "2" || navInfo.child.length > 1
            ? "childShow"
            : "goodsShow";
        this.$refs.goodsShow.setAttribute("class", classNames);
        document.documentElement.scrollTop = 0;
        if (navInfo.child) {
          //一级
          this.getGoodsList(navInfo);

          if (navInfo.child.length == 0) {
            padding = "1.25333rem";
          }
        } else {
          //二级
          this.getGoodsList(navInfo, "second");
        }

        this.$refs.goodsShow.style["padding-top"] = padding;

        clearTimeout(timer);
        timer = "";
        scrollTop = 0;
      }
    },
    closeWin() {
      //放入宏任务里执行
      setTimeout(() => {
        this.$store.commit("setOverHide", false);
        this.show = false;
      });
    },
    init() {
      
      this.groupGoodsObj = storage.session("groupGoodsObj");
      this.getNavList();
      
      var rshop = storage.session("order-reflow");
      if (rshop && rshop != 2) {
        this.dataReflow(rshop.data);
        storage.session("order-reflow", "2");
      }

      var shopData = storage.session("select-shop");
      var wechatShop = storage.session("wechatShop");
      var loginData = storage.session("loginData");

      // 初始化懒加载配置

      var shopName = storage.session("select-shop")
        ? storage.session("select-shop").shopName
        : storage.session("wechatShop").shopName;

      utils.setTitle(shopName);
    },
    getImgUrl: function(urls) {
      return global.getImgUrl({ type: "2", url: urls });
    },
    getNavList: function() {
      let data = null;

      data = orderData.getCategory(0);

      for (let item of data) {
        item.child = utils.deepCopy(orderData.getCategory(item.id));
      }
      this.headerList = data;
      
    },
    getTastePrice : function(g,price){
        /**
         * @param {Object} g // 商品数据
         * @param {String} price // 会员价或普通价格
         */

        // 获取口味价格
        var TastePrice = 0; // 口味价格
        var bol = false; // 是否开启区间
        var taste = g.isAttr ? g.attr : [];

        if(taste.length === 0) return price;
        for(var i = 0 ;i < taste.length; i++){
          if(taste[i].attrObj.type != 0){
              // 开启口味区间则口味最小价格累加
              TastePrice += Number(taste[i].attrObj.minPrice);
              bol = true;
          }
        }
        
        var str = Number(TastePrice) + Number(price);
            str = bol ? str += '起' : str;
        return str;
    },
    getMinPrice: function(g, type) { 
      /**
       * @param {Object} g // 商品数据
       * @param {String} type // 存在则为会员价
       */
      var groupObj = this.groupGoodsObj[g.id]; // 多规格数据

      if(groupObj && groupObj.length > 0){
          // 处理多规格价格
          var price = groupObj[0].price;
          var vipPrice = (groupObj[0].isVip == "2" && this.memberInfo && this.memberInfo.member) ? (groupObj[0].price * this.discount).toFixed(2) : groupObj[0].vipPrice;

          for(var i = 0; i < groupObj.length; i++){
              var goods = groupObj[i];
              if(goods.price - price < 0){
                  price = this.getTastePrice(goods,goods.price);
              }
              if(goods.vipPrice - vipPrice < 0){
                  vipPrice = goods.vipPrice;
              }
          }

          if(type){
            return vipPrice;
          }else{
            return price;
          }
      }else{
          var vipPrice = (g.isVip == "2" && this.memberInfo && this.memberInfo.member) ? (g.price * this.discount).toFixed(2) : g.vipPrice;
          return type ? vipPrice : this.getTastePrice(g,g.price);
      }
    },

    getGoodsList: function(nav, type) {
      //得到商品列表
      var goods = orderData.getGoodsByCategory(nav.id, nav.pid);

      this.goodsList = goods;
      this.secondGoods = goods.slice(4, 20);
      this.$nextTick().then(()=>{
          this.isShowOutline = false
      })
    },
    openPackage: function(packages) {
      //进入套餐页面
      packages = orderData.getPackage(packages);
      storage.session("searchPackage", packages);
      
      this.$router.push("/package");
    },
    checkGoods(goods) {
      if (!goods.goodsName) return false;
      if (goods.status == 1) return true;
      if (goods.isStock != 1) return false;
      if (goods.goodsNum == 0) return true;
      var num = this.getCarNum(goods);
      if (num >= goods.goodsNum) return true;
      return false;
    },
    banGoods: function(g) {
      if (g.packageName && g.status == 1) return true;
      var groupList = this.groupGoodsObj[g.id] ? this.groupGoodsObj[g.id] : [];
      if (groupList && groupList.length > 0) {
        var obl = 0;
        for (var i = 0; i < groupList.length; i++) {
          if (this.checkGoods(groupList[i])) {
            obl++;
          }
        }
        if (obl == groupList.length) {
          return true;
        }
        return false;
      } else {
        return this.checkGoods(g);
      }
    },
    getCarNum: function(g) {
      var arr = [];
      if (g.packageName) {
        arr = orderData.oPackageList;
      } else {
        arr = orderData.oGoodsList;
      }
      var num = 0;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == g.id) {
          if (g.goodsName) {
            num += arr[i].num - 0;
          }
        }
      }
      return num;
    },
    showGoodsDetail(g, index) {
      //展示商品详情
      if (!this.banGoods(g)) {
        
        if (!g.packageName) {
          g.isGroupGoods = Boolean(this.groupGoodsObj[g.id]);
          orderData.oGood = g;
          this.show = true;

          this.$store.commit("setOverHide", true);

          this.currentView = "goodsdetail";
        } else {
          this.openPackage(g);
        }
      }
    },
    getPackageByID: function(id) {
      var p = utils.deepCopy(orderData.oPackageList);
      var info,
        num = 0;
      for (var i = 0; i < p.length; i++) {
        if (p[i].id == id) {
          num++;
          info = p[i];
        }
      }
      if (num > 1) {
        this.$store.commit("setWin", { content: "请改数量只能在购物车" });
        return false;
      } else if (num == 1) {
        return info;
      }
    },
    getCargroupGoods: function(id) {
      var arr = this.carGoodsList;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].groupId == id) {
          return arr[i];
        }
      }
      return {};
    },
    getIsGood : function(id){
        // 是否有包含口味的菜品在购物车中
        var goods = this.$store.state.carGoodsList;
        for(var i = 0 ; i < goods.length; i++){
            if(goods[i].id == id && goods[i].attrInfo != ""){
              return true;
            }
        }
        return false;
    },
    goodsNumDown: function(g, index) {
      //商品的数量减
      if (this.groupGoodsObj[g.id]) {
        this.$store.commit("setWin", {
          content: "规格商品更改数量只能在购物车"
        });
        return false;
      }
      

      if(g.type == "1"){
        this.$store.commit("setWin", {
          content: "斤两菜请在购物车中修改"
        });
        return false;
      }

      if(g.isAttr && this.getIsGood(g.id)){
        this.$store.commit("setWin", {
          content: "请在购物车中修改数量"
        });
        return false;
      }
      
      g.num = this.$store.state.shopCarObj[g.id].num - 1;
      g.attrInfo = "";
          
      let goods = {
          'data' : utils.deepCopy(g),
          'operateType' : 'splice',
          'operateObj' : 'carGoodsList',
          'type' : 'subtract'
      }
      this.$store.commit("setCarList",goods);

      // this.goodsList.splice(orderData.showGoodsIndex[g.id], 1, g);
    },
    goodsNumUp: function(e,g, index) {
		//商品的数量加
		if (this.banGoods(g)) return false; // 是否估清或售完
		if (this.groupGoodsObj[g.id]) {
			// 是否为规格菜
			g.isGroupGoods = true;
			this.showGoodsDetail(g);
		} else if (g.isAttr || g.goodsName && g.type == '1') {
			// 是否有口味
			this.showGoodsDetail(g);
		} else if (g.packageName) {
			// 套餐
			this.openPackage(g);
		} else {
			this.goodsList.splice(orderData.showGoodsIndex[g.id], 1, g);
			g.num = 1;
			// 将商品信息写入store中,加减组件每次只会添加一次
			let goods = {
				'data' : utils.deepCopy(g), // 商品数据
				'operateType' : 'push', // 操作类型
				'operateObj' : 'carGoodsList' // 操作对象
			};
			this.$store.commit("setCarList",goods);
		}
    },
    loadDom() {
      let domToClientTop = utils.getDOMPosition(lastSecondDom).y;
      if (
        domToClientTop - hh - 300 < hh &&
        this.secondGoods.length <= this.goodsList.length
      ) {
        var data = this.goodsList.slice(
          this.secondGoods.length + 4,
          this.secondGoods.length + 24
        );
        this.secondGoods.push(...data);
      }
    },
    //滑动加载
    srollLoad() {
      if (utils.getScroll().top > scrollTop) {
        if (isPhone && !timer) {
          timer = setTimeout(() => {
            this.loadDom();
            timer = "";
          }, 50);
        } else {
          this.loadDom();
        }
      }
      scrollTop = utils.getScroll().top;
    },
    async getUserInfo(){
      // 自助模式获取会员信息

      let selectShop = storage.session("select-shop");
      let memberInfo = storage.session("memberInfo");
      if(selectShop && !memberInfo){
        let userData = await http.getUserInfo({
            data:{
                shopId: global.getShopId(),
                type : 1,
                from: 0
            }
        });
        
        let login = storage.session("login");
        for(var key in login){
            userData[key] = login[key];
        }
        storage.session("memberInfo",userData);
      }

      this.memberInfo = storage.session("select-shop") ? storage.session("memberInfo") : storage.session("wechatShop");
      this.discount = this.memberInfo.member.level ? this.memberInfo.member.level.discount / 100 : 1;
      this.$store.commit("setMemberInfo",{"isMember":Boolean(this.memberInfo),"memberDiscount":this.discount});
    },
    getVipPrice (goods){
      // 获取会员价格

      if(goods.isVip === "1" && this.memberInfo.member){
        return (goods.price * this.discount).toFixed(2); // 计算出会员折扣价
      }else{
        return goods.vipPrice;
      }
    }
  },
  components: {
    goodsdetail: () =>
      import(/* webpackChunkName: "goods_detail" */ "./goodsdetail"),
    shopCar: () => import(/* webpackChunkName: "shop_car" */ "./shop_car"),
    addSubtract: () =>
      import(/* webpackChunkName: "addSubtract" */ "../../components/add_subtract"),
    goodsClassify
  },
  computed: {
    parseOk() {
      return this.$store.state.global.parseOk;
    },
    firstGoods() {
      // 分割出第一个商品展示模块
      return this.goodsList.slice(0, 4);
    }
  },
  watch: {
    parseOk(newV, oldV) {
      if(newV) {
        //防止在用户很久没使用时,我们修改本地存储的数据结构，但是商户数据没修改导致读取数据结构与我们当前的数据不一致，导致解析失败
        try{
          this.init();
        }
        catch(e){
          if(!isInitAagin){
            //尝试在次加载的新的数据
            let needClear = ['vercode','inventoryList','otherList','goodsList'];
            let content = storage.session('content');
            //清除应该的版本信息
            for(let item of needClear){
              let key = item+'_'+global.getShopId();
              localStorage.removeItem(key);
              let index = content.indexOf(key);
              if(index>-1){
                content.splice(index,1);
              }
            }
            storage.session('content',content);
            isInitAagin = true;
            orderData.init();

          }else{
            this.$store.emit('setWin',{content:'出现异常,请上报给开发人员'});
          }
        }

      }
    },
    // $route(newV,oldV){
    //   if(oldV.path ==='/shopSelect'){
    //     orderData.init();
    //   }
    // }
  },
  updated() {},
  beforeDestroy() {
    document.removeEventListener("scroll", this.srollLoad);
    lastSecondDom = null;
    timer = "";
    scrollTop = 0;
  },
  async mounted() {
    orderData = await import(/* webpackChunkName:'order_data' */ "./order_data.js");
    orderData = orderData.default;

    lastSecondDom = this.$refs.lazyloadDiv;

    document.addEventListener("scroll", this.srollLoad);
    this.getUserInfo();
    var refreshInfo = storage.session("refresh");
    this.$store.commit("setOverHide", false);
    if (!refreshInfo) {
      var num = 1;
      storage.session("refresh", num);
    } else {
      var num = storage.session("refresh");
      num += 1;
      storage.session("refresh", num);
    }

    orderData.init();
    
  },
  created() {}
};
</script>
<style lang = 'less' scoped>
@import "../../res/css/base.less";
/** rem转px公式为：rem * 75 = px;  */
.order {
  
  width: 10rem;
  .title{
    width:10rem;
    height:1.25333rem;
    background-color: #f7f7f7;
    border-bottom: 1px solid #dddddd;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 6;
  }
  .lazyloadDiv{
    .px2rem(width, 750);
    .px2rem(height, 100);
  }
  .goodsShow{
    padding: 1.25333rem 0;
  }
  .goods-c1{
    width:9.86667rem;
    height:10rem;
    padding: 0 0.06667rem;
    .c1{

      width:4.53333rem;
      height:4.53333rem;
      background-color: #fff;
      float: left;
      margin: 0.26667rem 0 0 0.26667rem;
      border-radius: 0.10667rem;
      position: relative;
      .img{
        position:relative;
        width:100%;
        height:3.3333333rem;
        img{
          width:100%;
          height:100%;
        }
        .hide-img{
            position:absolute;
            top: 0;
            left:0;
            width:100%;
            height: 100%;
            z-index:2;
            opacity: 0;
            /* background: red; */
        }
      }
      .price,.name{
        text-align: center;
        width: 100%;
        height: 0.73333rem;
        font-size: 0.42667rem;
        line-height: 0.73333rem;
        font-weight: 300;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-top: 0.02667rem;
      }
      .price{
        font-size: 0.37333rem;
        height: 0.46667rem;
        line-height: 0.46667rem;
        font-weight: 600;
        margin-top: -0.13333rem;
      }
      .plohder{
            position: absolute;
            left: -0.08rem;
            top: 0.53333rem;
            width: 0.93333rem;
			height: auto;
			img{
				float: left;
				width: 100%;
				margin-top: 0.13333rem;
			}
	  }
	  .triangle{
		  	position: absolute;
			top: 0;
			right: 0;
			width: 0.8rem;
			height: 0.8rem;
			
	  }
	  .num{
		  	position: absolute;
			top: 0;
			right: 0;
			width: 0.42667rem;
			height: 0.53333rem;
			line-height: 0.53333rem;
			font-size: 0.29333rem;
			color: #ffffff;
			text-align: center;
			overflow: hidden;
	  }
    }
    .c1-c{
      overflow: hidden;
      border-radius: 0.10667rem;
    
    }
  }
  .goods-c2{
	  .c2{
		  	height: 2.4rem;
			background-color: #fff;
			position: relative;
			border-bottom: 1px solid #dddddd;
			.img{
				position: absolute;
				top: 0.05333rem;
				left: 0.05333rem;
				width: 3.06667rem;
				height: 2.29333rem;
			}
			img{
        width:100%;
        height:100%;
			}
			.con{
        width:6.4rem;
        height:100%;
				padding-left: 3.33333rem;
				padding-right: 0.26667rem;
				.con-name{
					font-size: 0.37333rem;
					padding-top: 0.13333rem;
					width: 6.4rem;
					color: #000000;
					height: 0.96rem;
					max-height: 0.96rem;
					line-height: 0.4rem;
					vertical-align: middle;
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-pack: center;
					-webkit-box-align: start;
					word-break: break-all;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					text-overflow: ellipsis;
					font-weight: 300;
				}
			}
			.con-explain{
				width: 6.4rem;
				height: 0.5rem;
				padding: 0.02667rem 0;
				.kind{
					width: 0.93333rem;
					height: 0.4rem;
					background-color: #ff463b;
					color: #ffffff;
					font-size: 0.29333rem;
					line-height: 0.4rem;
					text-align: center;
					border-radius: 0.13333rem;
					float: left;
					margin-right: 0.26667rem;
				}
			}
			
			.con-operation{
				width: 6.4rem;
				height: 0.66667rem;
				font-size: 0.37333rem;
				padding-bottom: 0.21333rem;
				.price,.num{
					width: 50%;
					height: 0.66667rem;
					line-height: 0.66667rem;
					color: #ff463b;
					float: left;
				}
				.price{
					font-weight: 600;
				}
				.num{
					.number{
						float: right;
						position: relative;
						width: 100%;
						padding: 0 0.66667rem;
						max-width: 2.17333rem;
						text-align: center;
						color: #000000;
					}
					.btn{
						width: 0.66667rem;
						height: 0.66667rem;
						position: absolute;
						top: 0;
						img{
							width: 100%;
							height: 100%;
						}
					}
				}
			}
	  }
  }
  .ban-goods{
	  	width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
  }
  .ban-center{
	    position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
  }
  .ban-line {
		position: absolute;
		top: 50%;
		width: 30%;
		height: 0;
		-webkit-transform: translate(0%, -50%);
		transform: translate(0%, -50%);
		border-bottom: 0.05rem solid #fff;
	}
	.ban-text{
		width: 40%;
		height: 1rem;
		text-align: center;
		line-height: 1rem;
		color: #ffffff;
		font-size: 0.6rem;
	}
	.vipPrice{
		background-color: #ffeceb;
		color: #fb5046;
		font-size: 0.29333rem;
	}
	.bbtg{
	  	background-color: rgba(0, 0, 0, 0.8) !important;
  		color: #ffffff;	
	}
  .hot-goods{
    width: 1.1rem;
    height: 1.1rem;
    overflow: hidden;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  #outline{
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0px;
	left: 0px;
	z-index: 100;
	background: #fff;
	.outline-header{
		width: 100%;
		height: auto;
		ul{
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-wrap: nowrap;
			justify-content: space-around;
			padding: .3rem 0;
			li{
				width: 12%;
				background: rgb(244,244,244);
				height: .7rem;
				border-radius: 2px;
			}
      li:nth-child(5){
        width:1rem;
        height: 1rem;
        border-radius: 50%;
        background:rgb(244,244,244);
      }
		}
		
	}
	.outline-content{
		width: inherit;
		height: auto;
		ul{
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
			justify-content: space-around;
			li{
				width: 4.53333rem;
				height: 4.53333rem;		
				margin: .2rem auto;
				div{
					width: 100%;
					height: 3.33333rem;
					width: 100%;
				  border-radius: 2px;          
					background: rgb(244,244,244);					
				}
        p{
					width: 3rem;
					height: .4rem;
					background: rgb(244,244,244);					
					margin: .1rem .2rem;
			   	border-radius: 1px;
				}
			}
		}
	}
	.outline-list{
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-wrap: wrap;
		.goods-list{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 95%;
			height: 2.4rem;
			margin-bottom: .08rem;
			.goods-left{
				width: 4rem;
				height: 2.29333rem;
				background: rgb(244,244,244);			
				border-radius: 2px;        	
			}
			.goods-right{
				width: 100%;
				height: .4rem;
				padding: .18rem;
				p:nth-child(1){
					width: 50%;
					height: .4rem;
					background: rgb(244,244,244);				
			  	border-radius: 2px;          	
					margin: .2rem 0;
				}
				p:nth-child(2){
					width: 35%;
					height: .4rem;
					margin: .2rem 0;
					background: rgb(244,244,244);
		  		border-radius: 2px;          
				}
				p:nth-child(3){
					display: flex;
					justify-content: space-between;
					span:nth-child(1){
						width: 35%;
						height: .4rem;
			    	background: rgb(244,244,244);
			    	border-radius: 2px;            
					}
					span:nth-child(2){
						width: .7rem;
						height: .7rem;
		    		background: rgb(244,244,244);
						border-radius: 50%;
					}
				}
			}
		}
	}
	.footer{
		width: 100%;
		height: 1.33333rem;
		position: fixed;
		// background: rgb(244,244,244);
		bottom: 0;
		display: flex;
		justify-content: space-between;
		padding: 0 .3rem;
        p:nth-child(1){
			width: 1.2rem;
			height: 1.2rem;
			border-radius: 50%;
			background: rgb(244,244,244);
		}
		p:nth-child(2){
			width: 3rem;
			height: 1.2rem;
			background: rgb(244,244,244);
		}
	}
}
.smallBoll{
	position: relative;
	/* display: none; */
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background: red;

}

}


</style>
