<template>
    <div class="my-orders" id="my-resever">
        <div class="orders">
            <div class="no-order" v-if="orderList.length == 0">
                <div class="img">
                </div>
                <div class="text">
                    暂无订单数据...
                </div>
            </div>
            <template v-for="(os,i) in orderList">
                <div class="orders-show" @click="getReserveDetail(os)" :key="i">
                    <div class="shop-name" style="font-size: 0.3rem;">
                        <div class="name fl">{{os.shopName}}</div>
                        <div class="type fl oyellow" >预约</div>
                        <div class="time fl" style="width: 100%;color: #888;">{{os.reserveTime}}</div>
                    </div>
                    <div class="status fl" style="color: #333333;font-weight: 300;" :class="{'fontgray':os.status == -2,'fontRed':(os.status == 9 || os.status == 1|| os.status == 9)}" >
                        {{ os | getStatus}}
                        <div class="img">
                            <img src="../../res/images/more.png" style="height: 0.25rem;width: 0.25rem;" />
                        </div>
                    </div>
                    <div class="order-content">
                        <div class="left">
                            <img :src="imgUrl + os.logoImage" />
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
                                {{os.roid}}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>

    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';

    export default {
        name: 'baspeakList',
        data(){
            return {
                accessToken: '',
                orderList: [],
                shopName: '',
                date: '',
                bespeakdetail: '',
                shopList: [],
                time: '', //当前时间
                noList: false,
                imgUrl: ""
            }
        },
        methods: {
            getReserveDetail(info){
                
                // window.location.href= this.bespeakdetail;
                if(!process.env.ASSET_PATH){
                    // 存在则为开发坏境
                    window.location.href= this.bespeakdetail;
                    storage.session('roid',info.roid)
                }else{
                    this.$router.push({path:'/bespeakDetail',query:{'roid': info.roid}})
                }
            },
            async getUserData(shopId,login){
                let res = await http.getUserInfo({
                	data: {
                		shopId: shopId,
	                    type: 3,
	                    from: 0
                	}
                })
                // for(let key in login){
                //     res[key] = login[key]
                // }
                Object.assign(res,login)
                storage.session("select-shop",res);
                this.shopList = res.shopList;
                this.showOrderList()
            },
            async showOrderList(){
                let res = await http.getReserveList({
                    data:{
                        shopId: this.shopId
                    }
                },false,true)
                console.log(res.data)
                var orderList = utils.sortByAll(res.data,"reserveTime",false);
                for(let i = 0;i < orderList.length; i++){
                    if (orderList[i].status == '4' && Number(orderList[i].reserveTime) < Number(this.time)) {
                        orderList[i].status = '-3';
                    }
                    orderList[i].createTime = utils.format(new Date(Number(orderList[i].createTime) * 1000),'yyyy-MM-dd hh:mm');
                    orderList[i].reserveTime = utils.format(new Date(Number(orderList[i].reserveTime) * 1000),'yyyy-MM-dd hh:mm');
                    for (var j = 0; j < this.shopList.length; j++) {
                        if (orderList[i].shopId == this.shopList[j].id) {
                            orderList[i].shopName = this.shopList[j].name;
                            orderList[i].logoImage = this.shopList[j].logoImage;
                        } 
                    }
                }
				this.orderList = orderList;
            },
            async payUrlFun(){
                let res = await http.ValidPayUrl({
                    data: {
                        shopId: this.shopId,
                        type: 0
                    }
                })
                if (res.bespeakdetail == '') {
                    this.$store.commit('setWin',{
                        content: '该商家尚未开通支付'
                    })
                }else {
                    this.bespeakdetail = res.bespeakdetail;
                }
            }
        },
        filters: {
            getStatus(val){
			    let obj = {
					'1':"未确认",
					'-2':"已取消",
					'2':"已确认",
					'3': "已到店",
					'-3': "已过期",
					'4': "待付款",
					'5': "已支付",
					'6': "已完成",
					'7': "退款中",
                    '8': "已退款"
				};
				return obj[val.status];
            }
        },
        // beforeRouteLeave: (to, from, next) => {
        //     debugger
        //     console.log(to,from)
        //     if(to.path == '/bespeakList'){
                
        //         next( vm => vm.$router.go(-2));
        //         return false;
        //     }
        //     next()
        // },
        mounted(){
			utils.setTitle("预约列表");
            var login = storage.session('login');
            var userDate = storage.session('select-shop');
            this.Token = storage.session("token");
            this.imgUrl = global.get;
            this.shopId = utils.getQueryString('shopId')||61;
            if (userDate) {
                this.shopList = userDate.shopList;
                this.showOrderList();
                this.payUrlFun();
            } else {
                this.getUserData(this.shopId,login);
                this.payUrlFun()
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../../res/css/base.less';
.my-orders .orders {
	width: 10rem;
	/*padding-top: 1.4rem;*/
	height: 100%;
	.no-order {
		width: 60%;
		height: 50%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
		.img {
			height: 44%;
			width: 100%;
			background: url(../../res/images/user-noorder.png) center center no-repeat;
			background-size: 40%;
		}
		.text {
			text-align: center;
			width: 100%;
			height: 0.6rem;
			line-height: 0.6rem;
		}
	}
	.orders-show {
		/*height: 3.36rem;*/
		/*width: 9.2rem;*/
		padding: 0.3rem 0.4rem;
		background-color: #fff;
		margin-bottom: 0.2rem;
		overflow: hidden;
		.shop-name {
			width: 7rem;
			height: 1.4rem;
			float: left;
			.name {
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
			.type {
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
			.oyellow{
				background-color: #eeb33f;
			}
		}
		.status {
			width: 1.8rem;
			height: 1rem;
			line-height: 1rem;
			float: right;
			font-size: 0.4rem;
			text-align: left;
			color: #BD0015;
			position: relative;
		}
		.img img {
			position: absolute;
			top: 52%;
			right: 0%;
			transform: translate(0, -50%);
			-webkit-transform: translate(0, -50%);
		}
		.order-content {
			width: 100%;
			/*height: 1.6rem;*/
			padding: 0.1rem;
			background-color: #f4f5f6;
			float: left;
			.left {
				width: 1.6rem;
				height: 1.6rem;
				float: left;
				background-color: #fff;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.right {
				width: 6.8rem;
				height: 1.2rem;
				float: left;
				padding: 0.2rem 0;
				margin-left: 0.5rem;
				/*background-color:blue;*/
				div {
					height: 0.6rem;
					line-height: 0.6rem;
					float: left;
					font-size: 0.4rem;
				}
			}
		}
		.fontRed{
			color:#D0021B!important;
		}
		.fontgray{
			color:#999!important;
		}
	}
}
</style>


