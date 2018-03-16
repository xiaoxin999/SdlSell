<template>
  <div class="my-orders" id="my-orders">
	<div class="title">
		<div class="order-type" @click="changeTitle('0')">
			<span :class="{'by':showTitle && showTitleIndex == 0}">
				{{returnText('type')}}
		 			<img src="../../res/icon/open.png" v-if="showTitle && showTitleIndex == 0" />
		 			<img src="../../res/icon/close.png" v-else />
		 	</span>
		</div>
		<div class="title-line">
		</div>
		<div class="order-status" @click="changeTitle('1')">
			<span :class="{'by':showTitle && showTitleIndex == 1}">
				{{returnText('status')}}
		 		<img src="../../res/icon/open.png" v-if="showTitle && showTitleIndex == 1" />
		 		<img src="../../res/icon/close.png" v-else />
		 	</span>
		</div>
		<div class="title-content" v-if="showTitle">
			
				<template v-for="(item,index) in showTitleList">
					<div class="li" @click="changeIndex(index)" :class="{'by':addClassName(index)}" :key='index'>{{item.name }}</div>
				</template>
		
			
		</div>
	</div>
	<div class="orders">
		<div class="no-order" v-if="orderList.length == 0 && show">
			<div class="img">
			</div>
			<div class="text">
				暂无订单数据...
			</div>
		</div>
		<template v-for="(os,index) in orderList">
			<div class="orders-show" @click="getOrderDetail(os)" :key='index'>
				<div class="shop-name">
					<div class="name fl">{{shopList[os.shopId].name}}</div>
					<div class="type fl" :class="{'ored':os.type == 1,'oyellow':os.type == 2,'ogreen':os.type == 3,'oblue':os.type == 4}">{{getTypeName(os)}}</div>
					<div class="time fl" style="width: 100%;color: #888;">{{getTime(os.createTime)}}</div>
				</div>
				<div class="status fl" style="color: #333333;" :class="{'fontgray':os.status == -2,'fontRed':(os.status == 9 || os.status == 1|| os.status == 9)}" >
					{{getStatus(os)}}
					<div class="img">
						<img src="../../res/icon/on.png" style="height:0.347rem;width:0.213rem ;" />
					</div>
				</div>
				<div class="order-content">
					<div class="left">
						<img :src="uploadUrl + shopList[os.shopId].logoImage" />
					</div>
					<div class="right">
						<div class="price" style="width: 1.8rem;">
							实付金额
						</div>
						<div class="num" style="width: 5rem;text-align: right;">
							¥{{os.price}}
						</div>
						<div class="price" style="width: 1.8rem;">
							订单编号
						</div>
						<div class="num" style="width: 5rem;text-align: right;">
							{{os.oid}}
						</div>
					</div>
				</div>
			</div>
		</template>

	</div>
</div>
</template>

<script>
    
    import utils from "src/verdor/utils";
    import storage from "src/verdor/storage";
    import http from "src/manager/http";
    import global from "src/manager/global";

	let code = utils.getQueryString('code');
	
    export default{
        data(){
            return {
                showTitle: false, //是否展示标题
				showTitleIndex: 0, //点击的下标
				lastShowInfo: {},
				showTitleList: [],
				indexType: 0,
				typeName: "",
				indexStatus: 0,
				statusName: "",
				orderList: [],
				shopList: {},
				uploadUrl: "",
				sendInfo: "",
				token:"",
				show:false,
				shopId: ''
            }
        },
        methods:{
            changeTitle: function(type) {

					if(this.showTitleIndex == type && this.showTitle) {
						this.showTitleIndex = 0 ? type == 1 : 1;
						this.showTitle = false;
					} else {
						this.showTitleIndex = type;
						this.showTitle = true;
					}
					if(this.showTitle) {
						if(this.showTitleIndex == 0) {
							this.showTitleList = [{
									name: "全部类型",
									id: "-1"
								},
								{
									name: "在线点餐",
									id: "0"
								},
								{
									name: "自助",
									id: "1"
								},
								{
									name: "外卖",
									id: "2"
								}, {
									name: "自取",
									id: "3"
								}, {
									name: "快递",
									id: "4"
								}
							];
						} else {
							this.showTitleList = [{
									name: "全部状态",
									id: "0"
								},
								{
									name: "待确认",
									id: "1"
								},
								{
									name: "已确认",
									id: "2"
								}, {
									name: "已结账",
									id: "4"
								}, {
									name: "待付款",
									id: "9"
								}, {
									name: "已取消",
									id: "-2"
								}
							];
						}
					}

				},
				changeIndex: function(index) {
					this.lastShowInfo.t = utils.deepCopy(this.indexType);
					this.lastShowInfo.s = utils.deepCopy(this.indexStatus);
					var bol = false;
					if(this.showTitleIndex == 0) {
						this.indexType = index;
						this.typeName = this.showTitleList[index].name;
						if(this.lastShowInfo.t != index) {
							bol = true;
							this.sendInfo.type = this.showTitleList[index].id;
						}
					} else {
						this.indexStatus = index;
						this.statusName = this.showTitleList[index].name;
						if(this.lastShowInfo.s != index) {
							bol = true;
							this.sendInfo.status = this.showTitleList[index].id;
						}
					}
					this.showTitle = false;
					if(bol) {
						this.getOrderList();
					}
				},
				addClassName: function(index) {
					var i = this.showTitleIndex == 0 ? this.indexType : this.indexStatus;
					if(index == i) {
						return true;
					}
					return false;
				},
				returnText: function(type) {
					if(type == "type") {
						if(this.indexType != 0) {
							return this.typeName;
						} else {
							return "订单类型";
						}
					} else {
						if(this.indexStatus != 0) {
							return this.statusName;
						} else {
							return "支付状态";
						}
					}
				},
				getTypeName: function(o) {
					if(o.type == 1) {
						return "自助";
					} else if(o.type == 2) {
						return "外卖";
					} else if(o.type == 3) {
						return "自提";
					} else if(o.type == 4) {
						return "快递";
					}
				},
				getStatus: function(s) {
					if(s.status == -2) {
						return "已取消";
					} else if(s.status == 4) {
						return "已结账";
					} else if(s.status == 9) {
						return "待支付";
					} else if(s.status == 1 || s.status == 3) {
						return "待确认";
					} else if(s.status == 2) {
						return "已确认";
					}
				},
				changeShopList: function() {
					this.uploadUrl = global.getImgUrl();
					var list = storage.session("select-shop").shopList;
					var obj = {},
						i = 0;
					for(; i < list.length; i++) {
						obj[list[i].id] = list[i];
					}
					this.shopList = obj;
				},
				getTime: function(time) {
					return utils.format(new Date(Number(time) * 1000),'yyyy-MM-dd hh:mm');
				},
				async init() {
					var info = storage.session("select-shop");
					var obj = {};
					obj.page = 1;
					obj.num = 1000;
					obj.type = -1;
					obj.status = 0;
					if(info) {
						obj.shopId = info.shopId?info.shopId:info.id;
						if(info.merchId) {
							obj.merchId = info.merchId;
						}
						this.sendInfo = obj;
					} else {
		
						let data = await http.getUserInfo({data:{
                            shopId: this.shopId,
                            code: code,
                            type: 3
                        }})
                        obj.shopId = this.shopId;
                        obj.merchId = data.merchId;
                        obj.accessToken = this.token;
                        obj.shopList = data.shopList;
                                
                        Object.assign(obj,storage.session("login"));
						storage.session("select-shop", obj);
						storage.session("memberInfo", data);
                        this.sendInfo = obj;
					}
                    this.changeShopList();
                    this.getOrderList();
				},
				async getOrderList() {

                    let data = await http.getWechatOrderList({data:this.sendInfo});
                    this.orderList = data;
                    this.show = true;

				},
				async getOrderDetail(o) {
					storage.session("oids", o.oid);
					if(o.type == 3 && o.status == 4) {
                        
                        let data = await http.showOrderDetail({
                            data:{
								shopId: this.shopId,
                                oid: o.oid,
						    }
                        })
                        storage.session("dx-sineDetail", data);
						this.$router.push("/memberCenterOrderSince");
					
					} else if(o.type == '0') {
						if(o.status != '-1' && o.status != '-2') {
							this.$router.push("/memberCenterOrderDetail");
							storage.session("orderListInfo", o);
						}
					} else {
						storage.session('payOrder', o);
						if(o.status == 9) {
							this.$router.push("/memberCenterOrderCancel");
						} else {
							this.$router.push("/payDetails");
						}

					}

				}
        },
        mounted(){
			this.shopId = utils.getQueryString('shopId') || 61;
            utils.setTitle("我的订单");
            this.init();
        }
    }
</script>

<style scoped>
    .my-orders .title {
		width: 10rem;
		min-height: 1.26rem;
		background-color: #fff;
		line-height: 1.26rem;
		text-align: center;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 6;
		font-size: 0.3.7rem;
	}
	
	.my-orders .title .order-type,
	.my-orders .title .order-status {
		width: 5rem;
		height: 1.26rem;
		float: left;
		border-bottom: 1px solid #D4D5D6;
	}
	
	.my-orders .title .title-line {
		position: absolute;
		top: 0.4rem;
		left: 50%;
		-webkit-transform: translateX(-50%);
		transform: translateX(-50%);
		width: 1px;
		height: 0.5rem;
		border-left: 2px solid #DDD;
	}
	
	.my-orders .title span {
		display: block;
		height: 1.26rem;
		position: relative;
	}
	
	.my-orders .title img{
		width: 0.187rem;
		height: 0.134rem;
		position: absolute;
		top: 0.58rem;
		right: 1.58rem;
	}
	
	.my-orders .by {
		border-color: #EDB43E!important;
		color: #EDB43E;
	}
	
	.my-orders .title .title-content {
		width: 10rem;
		background-color: #fff;
		float: left;
		margin-bottom: 0.22rem;
	}
	
	.my-orders .title .title-content div.li {
		width: 4.2rem;
		height: 0.95rem;
		border: 0.013rem solid #d0d1d1;
		float: left;
		line-height: 0.95rem;
		margin: 0.22rem 0.35rem;
	}
	
	.my-orders .orders {
		width: 10rem;
		padding-top: 1.4rem;
		height: 100%;

		
	}
	
	.my-orders .orders .no-order {
		width: 60%;
		height: 50%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
	}
	
	.my-orders .orders .no-order .img {
		height: 44%;
		width: 100%;
		background: url(../../res/images/user-noorder.png) center center no-repeat;
		background-size: 40%;
	}
	
	.my-orders .orders .no-order .text {
		text-align: center;
		width: 100%;
		height: 0.6rem;
		line-height: 0.6rem;
	}
	
	.my-orders .orders .orders-show {
		/*height: 3.36rem;*/
		/*width: 9.2rem;*/
		overflow: hidden;
		padding: 0.3rem 0.4rem;
		background-color: #fff;
		margin-bottom: 0.2rem;
	}
	
	.my-orders .orders .orders-show .shop-name {
		width: 7rem;
		height: 1.4rem;
		float: left;
	}
	
	.my-orders .orders .orders-show .shop-name .name {
		padding: 0 0.2rem 0 0;
		max-width: 5.6rem;
		height: 0.8rem;
		line-height: 0.8rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 0.45rem;
		font-weight: 300;
		color: #333;
	}
	
	.my-orders .orders .orders-show .shop-name .type {
		width: 0.8rem;
		height: 0.4rem;
		border-radius: 0.1rem;
		border-top-right-radius: 0;
		border-bottom-left-radius: 0;
		text-align: center;
		line-height: 0.4rem;
		color: #fff;
		float: left;
		margin-top: 0.2rem;
	}
	.my-orders .orders .orders-show .shop-name .oyellow{
		background-color: #eeb33f;
	}
	.my-orders .orders .orders-show .shop-name .oblue{
		background-color: #4869C3;
	}
	.my-orders .orders .orders-show .shop-name .ored{
		background-color: #e5593d;	
	}
	.my-orders .orders .orders-show .shop-name .ogreen{
		background-color: #19988B;
	}
	.my-orders .orders .orders-show .status {
		width: 1.8rem;
		height: 1.4rem;
		line-height: 1.4rem;
		float: right;
		font-size: 0.4rem;
		text-align: left;
		color: #BD0015;
		position: relative;
	}
	
	.my-orders .orders .orders-show .img img {
		position: absolute;
		top: 52%;
		right: 0%;
		transform: translate(0, -50%);
		-webkit-transform: translate(0, -50%);
	}
	
	.my-orders .orders .orders-show .order-content {
		width: 9.2rem;
		/*height: 1.73rem;*/
		padding: 0.1rem;
		background-color: #f4f5f6;

		float: left;
	}
	
	.my-orders .orders .orders-show .order-content .left {
		width: 1.6rem;
		height: 1.73rem;
		float: left;
		background-color: #fff;
	}
	
	.my-orders .orders .orders-show .order-content .left img {
		width: 100%;
		height: 100%;
	}
	
	.my-orders .orders .orders-show .order-content .right {
		width: 6.8rem;
		height: 1.33rem;
		float: left;
		padding: 0.2rem 0;
		margin-left: 0.5rem;
		color: #353535;
		font-weight: 300;
		/*background-color:blue;*/
	}
	
	.my-orders .orders .orders-show .order-content .right div {
		height: 0.6515rem;
		line-height: 0.6515rem;
		float: left;
		font-size: 0.4rem;
	}
	.my-orders .orders .orders-show .fontRed{
		color:#D0021B!important;
	}
	.my-orders .orders .orders-show .fontgray{
		color:#999!important;
	}

</style>
