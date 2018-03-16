<template>
    <div id="mall-goods-detail">
        <div class="im-title">
            <div @click="pointDetail()">积分：{{redeemPoint}}</div><span></span>
            <div @click="toIntegralMall">兑换记录</div>
        </div>
        <div class="bgc">
            
            <!--<img :src="res/icon/get-vip.jpg"/>-->
            <template v-if="reqSuccess">
                <img :src="imgUrl + goodsDetail.bigImage" v-if="goodsDetail.bigImage" />
                <img src="../../res/icon/goods.jpg" v-else/>
            </template>
            <!--<img :src="imgUrl + goodsDetail.bigImage"  onerror=" this.onerror=null; this.src=sd.froot+'res/icon/goods.jpg'" />-->
            <div class="grayy graypos"></div>
        </div>
        <div class="content">
            <div class="name">
                {{goodsDetail.name}}
                <div class="point">
                <span v-if="goodsDetail.price != 0">{{goodsDetail.price}}</span>
                <span v-else>无需积分</span>
                <br />
                商品描述：<br />
            </div>
            </div>
            <div v-html="goodsDetail.description" class="describe" v-if="goodsDetail.description != ''">
            </div>
            <div class="num">
                剩余{{goodsDetail.inventory}}
            </div>
        </div>
        <div class="btn" @click="redeemNow" v-if="!isDetail">
            立即兑换
        </div>
    </div>
</template>

<script>
    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';
    export default {
        name: 'mallGoodsDetail',
        data(){
            return {
                goodsDetail: {
					"name": "",
					"price": "",
					"description": "",
					"inventory": "",
					"bigImage":""
				},
				redeem: false,
				reqSuccess:false,
				imgUrl: null,
				isDetail: false,
				redeemPoint: storage.session("userInfo").point,
                exchangeGoodsPoint : '',
                goods: [],
                shopId: null,
                gid: null,
                fid: null,
                token: null,
                info: []
            }
        },
        computed: {
            sure(){
                return {
                    style: {

                    },
                    content: '是'
                }
            },
            cancel(){
                return {
                    style: {

                    },
                    content: '否'
                }
            }
        },
        methods: {
            pointDetail(){
                let info = storage.session("userInfo");
                storage.session('membership', info);
                storage.session('type', 1);
                this.$router.push("/memberIntegral");
            },
            toIntegralMall(){
                this.$router.push('/exchangeRecord')
            },
            redeemNow(){
                let that = this;
                this.$store.commit('setWin',{
                    content: `您需要消耗${this.goods.price}积分<br/>是否要兑换该商品?`,
                    type: 'confirm',
                    ok: {
                        content: '是'
                    },
                    cancel: {
                        content: '否'
                    },
                    callBack(val){
                        if(val == 'ok'){
                            that.enterChange()
                        }
                    }
                })
            },
            async enterChange(){
                let res = await http.addExchange({
                    data: {
                        shopId: this.shopId,
						gid: this.goods.id,
                    }
                })
                this.info.point = res.point;
                storage.session("userInfo", this.info);
                this.$router.push("/exchangeSuccess");
            },
            async getGoodsDetail(){
                let gid;
                let infoVal = storage.session("isCode");
                if(infoVal == 1) {
                    gid = this.goods.gid;
                    this.isDetail = true;
                    storage.session("isCode", 0);
                } else {
                    gid = this.goods.id;
                }
                let res = await http.getDetail({
                    data: {
                        shopId: this.shopId,
						id: gid,
						mid: this.info.fid
                    }
                })
                this.goodsDetail = res;
                this.goodsDetail.description = utils.htmlspecialchars_decode(res.description)
				this.reqSuccess = true;
            }
        },
        mounted(){
            this.info = storage.session('userInfo');
            utils.setTitle('商品详情');
            this.token = storage.session('token');
            this.shopId = utils.getQueryString('shopId') || 61;
            this.goods = storage.session('goodsInfo');
            this.getGoodsDetail();
			this.imgUrl = global.getImgUrl();
        }
    }
</script>

<style lang="less" scoped>
	#mall-goods-detail{
		width: 10rem;
        height: 100%;
        .im-title {
            width: 10rem;
            height: 1.15rem;
            background-color: #fff;
            color: #000000;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 66;
            div {
                width: 50%;
                height: 100%;
                float: left;
                text-align: center;
                line-height: 1.15rem;
            }
            span {
                width: 1px;
                height: 1.15rem;
                background-color: #666;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translate(-50, 0%);
                -webkit-transform: translate(-50, 0%);
            }
        }
        .bgc{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            img{
                width: 100%;
                height: 100%;
            }
            .graypos{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: rgba(0,0,0,0.4);
            }
        }
        .content{
            width: 10rem;
            height: 100%;
            /*background-color:rgba(0,0,0,0.5);*/
            position: absolute;
            top: 0%;
            left: 0%;
            color: #FFF;
            text-align: center;
            transform: translate(0,-0%);
            -webkit-transform: translate(0,-0%);
            overflow: scroll;
            .name{
                width: 100%;
                height: 5rem;
                line-height: 3rem;
                font-size: 0.5rem;
                margin-top: 3rem;
                position: relative;
                .point{
                    width: 100%;
                    height: 1rem;
                    font-size: 0.4rem;
                    line-height: 1rem;
                    position: absolute;
                    bottom: 2rem;
                    left: 0;
                }
            }
            .describe{
                width: 85%;
                margin: 0 auto;
                line-height: 1rem;
                font-size: 0.4rem;
                max-height: 5rem;
                overflow: scroll;
                margin-top: -1rem;
            }
            .num{
                width: 100%;
                height: 1rem;
                font-size: 0.3rem;
                position: absolute;
                bottom: 3rem;
                left: 50%;
                transform: translate(-50%,0);
                font-size: 0.4rem;
            }
        }
        .btn{
            width: 10rem;
            height: 1.2rem;
            line-height: 1.2rem;
            text-align: center;
            font-size: 0.4rem;
            color: #FFF;
            background-color:black;
            position: fixed;
            bottom: 0;
            left: 0;
        }
	}
</style>

