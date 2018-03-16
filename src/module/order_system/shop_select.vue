<template>
  <div id="select-shop">
	<div class="shop-show">
		<div class="s-title">
			<div class="left">
				<div class="img"><img src="../../res/images/icon-shop.png" /></div>
				<div class="text">选择店铺</div>
			</div>
			<div class="right" @click="openMyOrder">
				<!--<div class="right">-->我的订单 </div>
		</div>
		<div class="show-list">
			<template v-for="(shop,index) in shopList">
				<div class="shop" @click="shopClick(shop)" :key="index">
					<div class="img">
						<div class="hide-img"></div>
						<img :src="shop.logoImage" alt="商品图片"/>
					</div>
					<div>{{shop.name}}</div>
					<div class="s-measking" v-if="shop.payType == '' || !checkBusiness(shop)">
						<div style="line-height: 2.1rem;" v-if="shop.payType == ''">敬请期待 </div>
						<div style="font-size: 0.4rem;" v-if="shop.payType != '' && !checkBusiness(shop)"><span>友情提示 </span><span>营业时间为 </span><span>{{getStartTime(shop)}}-{{getEndTime(shop)}}</span></div>
					</div>
				</div>
			</template>
		</div>
	</div>

	<div id="alert-window" v-if="!hasPayUrl">
		<div class="atext">敬请期待 </div>
		<div class="abtn" @click="closePay">确定 </div>
	</div>
</div>
</template>

<script>
    
    import utils from "src/verdor/utils";
    import storage from "src/verdor/storage";
    
    import http from "src/manager/http";
    import global from "src/manager/global";
	import store from './details_store';

    var code = utils.getQueryString('code')||"test";
	var shopId = utils.getQueryString('shopId')||61;
	var merchId = utils.getQueryString('merchId')||29;
	var tableId = utils.getQueryString('tableId');
    var payId = utils.getQueryString('payId');
    
    if (payId) {
		var obj = {
			"payId":payId,
			"shopId":shopId
		}
		storage.session('payInfo',obj);
    }
    
    export default{
        data(){
            return {
                shopList: [],
                sessionInfo: {},
                hasPayUrl: true,
                payUrl: "",
                shopId: "",
                time: null,
                type: '',
                token : '',
                goodsUrlMiddle:""
            }
		},
		store,
        methods:{
            getStartTime: function(shop) {
				var s = (shop.openTime - 0);
				var start = Math.floor(s / 60);
				var start1 = this.tranformDate(s - (start * 60));
				return start + ":" + start1;
			},
			getEndTime: function(shop) {
				var e = (shop.closeTime - 0);
				var end = Math.floor(e / 60);
				var end1 = this.tranformDate(e - (end * 60));

				if(end > 24) {
					end -= 24;
				}
				if(end == 24) {
					end == "00";
				}

				return end + ":" + end1;
			},
			tranformDate: function(t) {
				t -= 0;
				if(t < 10) {
					return("0" + t);
				} else {
					return(t + "");
				}
			},
			checkBusiness: function(shop) { //是否在营业时间
				var n = new Date().getHours() * 60 + new Date().getMinutes();
				var s = shop.openTime - 0;
				var e = shop.closeTime - 0;
				if(s == 0 && e == 0) {
					return true;
				} else if(s == "" && e == "") {
					return true;
				}
				if(s != 0 && (e == 0 || e == "")) {
					return true;
				}
				if(s == "" || s == 0) {
					s = 0;
				}

				if(n > s && n < e) {
					return true;
				} else {
					return false;
				}

            },
            setImg(arr){
                for(var i = 0; i < arr.length; i++){
						arr[i].logoImage = global.getImgUrl({type:"2",url:arr[i].logoImage})
				}
            },
			async getShopList() {
				var shopData = storage.session("select-shop");
				if(shopData) {
					
					var arr = utils.deepCopy(shopData.shopList);
					this.setImg(arr);
					this.shopList = arr;

				} else {

                    let json = await http.choiceShop({
                        data:{
                            shopId: shopId ? shopId : null,
                            merchId: merchId
                        }
                    },false,true)
                    var arr = utils.deepCopy(json.data.shopList);
                    this.setImg(arr);
                    this.shopList = arr;
                    this.sessionInfo.time = json.time;
                    this.time = json.time;
                    storage.session("time", this.time);
                    var obj = json.data;
                    obj.merchId = merchId;
                    obj.tableId = tableId;
                    obj.accessToken = this.token;
                    obj.goodsUrlMiddle = this.goodsUrlMiddle;
                    storage.session("select-shop", obj);
                            
				
				}
			},
			async shopClick(shop) {
				var bol = this.checkBusiness(shop);
				
				if(shop.payType != "" && bol) {
					var shopData = storage.session("select-shop");
					shopData.id = shop.id;
					shopData.shopName = shop.name;
					shopData.closeTime = shop.closeTime;
					storage.session("select-shop", shopData);

					let data = await this.SquareConfig();
                    if(this.type=='0'){
                        this.$store.commit("setWin",{content:"商家尚未营业"})
                        return;
					}
					this.$store.commit("resetShopCar");
					this.$router.push("/order");
					
				}
			},
			openMyOrder: function() {
				var obj = storage.session('select-shop');
				obj.id = (obj.id == undefined) ? obj.shopList[0].id : obj.id;
				storage.session('select-shop', obj);
                this.$router.push("/memberCenterOrderData");
			},
		    async SquareConfig() {
                let data = await http.getSelfHelpConfig({
                    data:{
                        shopId: storage.session('select-shop').id ? storage.session('select-shop').id : storage.session('select-shop').shopId
                    }
                });
				this.type = data.status;
				
				storage.session('SelfHelpConfig', data);
				if(this.type=='0'){
					this.$store.commit("setWin",{content:"商家尚未营业"})
					return false;
                }
				return true;
			},
			reflowShop: function(data) {
				storage.session("select-shop", data);
				this.$router.push("/order");
			}
        },
        async mounted(){

            this.getShopList();
			storage.session('squarePattern', true);
			var rshop = storage.session("order-reflow");
			if(rshop && rshop != '2') {
				this.reflowShop(rshop.shop);
			}

			utils.setTitle("选择店铺");

        }
    }
</script>

<style lang="less" scoped>

    #select-shop {
		width: 100%;
		/*height: 100%;
				overflow: hidden;*/
		/*background-color: #fff;*/
	}
	
	#select-shop .shop-show {
		width: 10rem;
		/*height: 100%;*/
		margin: 0 auto;
		overflow: auto;
	}
	
	#select-shop .s-title {
		width: 10rem;
		height: 1.3rem;
		line-height: 1.3rem;
		font-size: 0.45rem;
		color: #FFFFFF;
		position: fixed;
		top: 0;
		left: 50%;
		z-index: 666;
		transform: translate(-50%, 0);
		-webkit-transform: translate(-50%, 0);
		background-color: #F8931F;
	}
	
	#select-shop .s-title div {
		width: 4.75rem;
		float: left;
		vertical-align: middle;
	}
	
	#select-shop .s-title div.left {
		padding-left: 0.25rem;
	}
	
	#select-shop .s-title div.left div {
		float: left;
	}
	
	#select-shop .s-title div.left div.img {
		width: 0.6rem;
		height: 1.3rem;
	}
	
	#select-shop .s-title div.left div.img img {
		width: 0.6rem;
		height: 0.6rem;
		float: left;
		margin-top: 0.3rem;
	}
	
	#select-shop .s-title div.left div.text {
		width: 3.6rem;
		margin-left: 0.2rem;
	}
	
	#select-shop .s-title div.right {
		padding-right: 0.25rem;
		text-align: right;
	}
	
	#select-shop .shop-show .show-list {
		width: 8.4rem;
		height: 15rem;
		position: absolute;
		top: 1.7rem;
		left: 0.8rem;
		overflow: scroll;
		-webkit-overflow-scrolling: touch
		/*margin: 0 auto;*/
		/*overflow: scroll;
		margin-top: 1.7rem;*/
	}
	
	#select-shop .shop-show .show-list .shop {
		float: left;
		width: 4rem;
		height: 5rem;
		position: relative;
		/*background-color: #fff;*/
	}
	
	#select-shop .shop-show .show-list .shop div {
		text-align: center;
		width: 4rem;
		height: 1rem;
		line-height: 1rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	#select-shop .shop-show .show-list .shop .s-measking {
		width: 100%;
		height: 4rem;
		background-color: rgba(0, 0, 0, 0.4);
		position: absolute;
		top: 0;
		left: 0;
		color: #FFFFFF;
		border-radius: 0.2rem;
		overflow: hidden;
		z-index: 5;
		/*line-height: 4rem;*/
	}
	
	#select-shop .shop-show .show-list .shop .s-measking div {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
		font-size: 0.8rem;
		height: 2.1rem;
	}
	
	#select-shop .shop-show .show-list .shop .s-measking div span {
		float: left;
		display: block;
		width: 100%;
		height: 0.7rem;
	}
	
	#select-shop .shop-show .show-list .shop:nth-child(2n) {
		margin-left: 0.4rem;
	}
	
	#select-shop .shop-show .show-list .shop div.img {
		position: relative;
		width: 4rem;
		height: 4rem;
		background-color: #FFFFFF;
		border-radius: 0.2rem;
		overflow: hidden;
		.hide-img{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 1;
		}
	}
	
	#select-shop .shop-show .show-list .shop div.img img {
		width: 100%;
		height: 100%;
	}


</style>
