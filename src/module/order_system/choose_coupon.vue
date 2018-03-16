<template>
    <div id="choose-coupon">
        <div class="nonuse" :class="isChoose ? 'active' : ''" @click="choose">不使用优惠券</div>
        <div class="couponList">
            <div class="eachCoupon">
                <div class="couponCenter" :class="saveCode == item.code ? 'chooseActive' : ''" @click="chooseCoupons(item)" v-for="(item,index) in coupons" :key="index" v-if="item.isUsed">
                    <p class="couponTitle" :class="item.type | getClass">{{item.type | getText}}</p>
                    <ul class="couponDetail">
                        <li>{{shopName}}</li>
                        <li>{{item.couponName}}</li>
                        <li>有效期 {{ item.startTime | transformTime }} 至  {{ item.endTime | transformTime}}</li>
                    </ul>
                </div>
                <div class="couponCenter" v-for="(item,index) in coupons" :key="index + item.code" id="no-coupon" v-if="!item.isUsed">
                    <p class="couponTitle">{{item.type | getText}}</p>
                    <ul class="couponDetail">
                        <li id="disable">{{shopName}}</li>
                        <li id="disable">{{item.couponName}}</li>
                        
                        <span class="hint">
                            <template v-if="item.cause">
                                有效期外
                            </template>
                            <template v-else-if="goodsDetail.goods.gid != item.gids || goodsDetail.goods.pid != item.pids">
                                请先在购物车内添加该商品
                            </template>
                            <template v-else-if="goodsDetail.totalPrice < item.lowestConsume">
                                满{{item.lowestConsume}}元可用
                            </template>
                        </span>
                        <li>有效期 {{ item.startTime | transformTime}} 至  {{ item.endTime | transformTime}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';
    export default {
        name: 'chooseCoupon',
        data(){
            return {
                isChoose: false,//是否选择此优惠券,默认否
                coupons: [],//优惠券列表
                shopName: '',//店铺名称
                saveCode: '',//存储每个优惠券的code,用于判断是否选取该优惠券
                goodsDetail: ''
            }
        },
        methods: {
            //是否选择优惠券
            choose(){
                this.isChoose = false;
                this.saveCode = '';
                for(var i = 0; i < this.coupons.length; i++){
                    this.coupons[i].status = 0;
                }
                sessionStorage.removeItem('couponOn');
    			storage.session('cleanCoupon',true);
    			if(storage.session('wechatShop')){
                    this.$router.push('/wechatPay');
                }else{
                    this.$router.push('/pay');
                }
            },
            //选择哪张优惠券
            chooseCoupons(item){
                if(storage.session('couponOn')){
                    //判断选取的哪张优惠券
    				if(this.saveCode || this.saveCode != item.code){
				     	this.saveCode = item.code;
				    }else{
				     	this.saveCode = '';
				    }
    				this.isCoupons(item);
                }else{
                    //判断选取的哪张优惠券
    				if(this.saveCode == '' || this.saveCode != item.code){
				     	this.saveCode = item.code;
				    }else{
				     	this.saveCode = '';
				    }
    				this.isCoupons(item);
	    			this.isChoose = true;
                }
            },
            isCoupons(item){
                //一次只能选取一张优惠券,切换UI状态的同时还要将选取的优惠券标记为已选取
			    for(var i = 0; i < this.coupons.length; i++){
         			this.coupons[i].status =  (this.coupons[i].code == this.saveCode)  ? 2 : 0;
        		}
                storage.session('couponOn',item);
                
                if(storage.session('wechatShop')){
                    this.$router.push('/wechatPay');
                }else{
                    this.$router.push('/pay');
                }
            }
        },
        filters: {
            transformTime(time) {
				return utils.format(new Date(Number(time) * 1000),'yyyy-MM-dd hh:mm');
			},
            getText(type) {
				if(type == 1 || type == 2) {
					return '减';
				} else if(type == 3 || type == 4) {
					return "折"
				} else {
					return "赠"
				}
			},
            getClass(type){
                if(type == 1 || type == 2) {
					return 'subtract';
				} else if(type == 3 || type == 4) {
					return "discount"
				} else {
					return "present"
				}
            }
        },
        mounted(){
            let couponList = storage.session('couponList') || [];
            this.coupons = couponList;          
            this.shopName = storage.session('wechatShop') ? storage.session('wechatShop').shopName : storage.session('memberInfo').shopName;
            this.goodsDetail = storage.session('orderInfo');
            let couponOn = storage.session('couponOn');
	    	if(couponOn){
                if(this.saveCode != couponOn.code){
	    			this.saveCode = couponOn.code;
	    		}else{
			     	this.saveCode = '';
			    }
	    		for(var i = 0; i < this.coupons.length; i++){
         			this.coupons[i].status =  (this.coupons[i].code == this.saveCode) ? 2 : 0;
        		}
	    		this.isChoose = true;
            }
            utils.setTitle("选择优惠券");
        }
    }
</script>

<style lang="less" scoped>

#choose-coupon {
	width: 100%;
	height: 100%;
    background: #efeff4;
    .nonuse {
        width: 100%;
        height: 1.53333rem;
        background: url(../../res/images/choose.png) #fff 95% no-repeat;
        background-size: 0.68rem 0.68rem;
        font-size: 0.42667rem;
        line-height: 1.53333rem;
        padding-left: 0.77333rem;
        box-sizing: border-box;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
    }
    .active {
        background: url(../../res/images/no-choose.png) #fff 95% no-repeat;
        background-size: 0.68rem 0.68rem;
    }
    .couponList {
        width: 100%;
        height: calc(100% - 1.53333rem);
        background: #efeff4;
        padding: 0.28rem 0.33333rem;
        margin-top: 1.53333rem;
        box-sizing: border-box;
        .eachCoupon{
            #no-coupon {
                background: #fff;
            }
            .couponCenter {
                width: 9.30667rem;
                height: auto;
                border: 1px #D8D8D8 solid;
                border-radius: 0.06667rem;
                background: url(../../res/images/no-choose.png) #fff 95% no-repeat;
                background-size: 0.68rem 0.68rem;
                margin: 0 auto;
                margin-bottom: 0.28rem;
                padding: 0.4rem 0rem 0.4rem 0.24rem;
                box-sizing: border-box;
                display: flex;
                position: relative;
                .couponTitle {
                    width: 0.77333rem;
                    height: 0.77333rem;
                    border-radius: 50%;
                    background: #C0C0C0;
                    line-height: 0.77333rem;
                    text-align: center;
                    color: #fff;
                    font-size: 0.37333rem;
                    margin-right: 0.13333rem;
                }
                .couponDetail {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    li:nth-of-type(1) {
                        color: #797979;
                        font-size: 0.33333rem;
                    }
                    li:nth-of-type(2) {
                        color: #000;
                        font-size: 0.41333rem;
                    }
                    li:nth-of-type(3) {
                        color: #767676;
                        font-size: 0.26667rem;
                        list-style-type: disc;
                        list-style-position: inside;
                    }
                    .hint {
                        background: url(../../res/images/disabled.png) left no-repeat;
                        background-size: 0.26667rem 0.26667rem;
                        color: #DB7C63;
                        padding-left: 0.4rem;
                    }
                    #disable {
                        color: #C0C0C0;
                    }
                }
            }
            .subtract {
                background: #00A0EA;
            }
            .discount {
                background: #7DB343;
            }
            .present {
                background: #da4438;
            }
            .chooseActive {
                background: url(../../res/images/choose.png) #fff 95% no-repeat;
                background-size: 0.68rem 0.68rem;
            }
        }
    }
}
</style>
