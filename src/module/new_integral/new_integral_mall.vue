<template>
     <div id="integral-mall">
        <div class="im-title">
            <div @click="pointDetail()">积分：{{userPoint}}</div><span></span>
            <div @click="toIntegralMall">兑换记录</div>
        </div>
        <div class="im-goods" >
            <div v-for="(g,index) in list" :key="index">
                <div class="goods">
                    <img :src="imgUrl + g.imageName"/>
                    <div class="mesking" @click="openGoodsDetail(g)">
                        <div class="name name_w">
                            {{g.name}}
                        </div>
                        <div class="cost cost-b" v-if="g.price != 0">
                            {{g.price}}积分
                        </div>
                        <div class="cost cost-b" v-else>
                            无需积分
                        </div>
                        <div class="num" >
                            剩余：{{g.inventory}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="no-goods" v-if="list.length == 0">
                <div class="img">
                    <img src='../../res/icon/small-grass.png'/>
                </div>
                <div class="text text_w">
                    没有更多商品,敬请期待哦~
                </div>
            </div>
            <div class="no-goods goods_h" v-if="list.length > 0">
                没有更多商品,敬请期待哦~
            </div>
        </div>
        <!-- <div class="alert" v-if="redeem"> 
            <div style="line-height: 1.1rem;height:1.1rem;margin-top: 0.4rem;">您需要消耗{{redeemPoint}}积分</div>
            <div style="line-height: 1rem;height:1.1rem ;margin-top: -0.2rem;margin-bottom: 0.2rem;">是否要兑换该商品？</div>
            <div style="border-top: 1px solid #000000;position: relative;height: 1.2rem;">
                <div style="width: 50%" @click="escBtn">否</div>
                <div class="line" style="width: 1px;background-color: #000;height: 1.2rem;position: absolute;top: 0;left: 50%;"></div>
                <div style="width: 50%;" @click="entBtn" >是</div>
            </div>
        </div> -->
    </div>
</template>

<script>
    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';
    export default {
        name: 'newIntegralMall',
        data() {
            return {
                userInfo: null,
				token: null,
				list:[],
				imgUrl:null,
				openList:false,
				userPoint:null,
				redeem:false,
				redeemPoint:null,
                selectGood:null,
                shopId: 0,
                code : ''
            }
        },
        methods: {
            pointDetail(){
                let info = storage.session("userInfo");
                storage.session('membership',info);
                storage.session('type',1);
                this.$router.push('/memberIntegral')
            },
            toIntegralMall() {
                this.$router.push("/exchangeRecord");
            },
            openGoodsDetail(g) {
                storage.session("goodsInfo",g);
				this.$router.push("/mallGoodsDetail");
            }, 
            escBtn() {
                this.redeem = false;
            },
            entBtn(){
                this.redeem = false;
                var info = storage.session("userInfo");
                storage.session("goodsInfo",this.selectGood);
            },
            async getGoodsList(){
                let res = await http.getListByWeixin({
                    data: {
                        shopId: this.shopId,
						page: 1,
						num: 20,
                    }
                })
                this.list = res.list
            },
            async getUserInfo(loginInfo){
                let res = await http.getUserInfo({
                    data: {
                        shopId: this.shopId,
                        type: 1,
                        from: 0
                    }
                })
                Object.assign(res,loginInfo)
                this.userPoint = res.point
                this.imgUrl = global.getImgUrl();
                storage.session('userInfo',res);
                this.getGoodsList()
            }
        },
        mounted() {
            this.shopId = utils.getQueryString('shopId') || 61;
            this.code = utils.getQueryString('code') || 'test';
            let userData = storage.session('userInfo')
            let login = storage.session('login');
            this.token = storage.session('token')
            if(userData){
                this.userPoint = userData.point
                this.imgUrl = global.getImgUrl();
                this.getGoodsList();
            }else{
                this.getUserInfo(login);
            }
            utils.setTitle("积分商城")
        }
    }
</script>

<style lang="less" scoped>
    @import '../../res/css/reset.css';
	#integral-mall {
		width: 10rem;
        height: 100%;
        .alert{
            width: 7rem;
            height: 3.8rem;
            background-color: #fff;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
            border: 1px solid #000;
            div{
                float: left;
                width: 100%;
                height: 1.2rem;
                line-height: 1.2rem;
                font-size: 0.35rem;
                text-align: center;
            }
        }
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
        .im-goods {
            padding-top: 1.15rem;
            .no-goods{
                width: 10rem;
                height: 5rem;
                position: relative;
                color: #FFF;
                font-size: 0.4rem;
                text-align: center;
                color: #666;
                div{
                    margin: 0 auto;
                    width: 2rem;
                    height: 2rem;
                    img{
                        width: 100%;
                        height: 100%;
                        margin-top: 0.4rem;
                    }
                }
                .text_w{
                    width: 10rem;
                    height: 2rem;
                    line-height: 2rem;
                }
            }
            .goods_h{
                line-height: 5rem;
            }
            .goods {
                width: 10rem;
                height: 5rem;
                position: relative;
                color: #FFF;
                font-size: 0.4rem;
                img {
                    width: 100%;
                    height: 100%;
                }
                .mesking {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    background-color: rgba(0, 0, 0, 0.2);
                    .num{
                        width: 4rem;
                        height: 1rem;
                        text-align: center;
                        line-height: 1rem;
                        position: absolute;
                        bottom: 0.2rem;
                        right: 0;
                    }
                    .name,.cost{
                        height: 1rem;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        position: absolute;
                        bottom: 1rem;
                        left: 0.5rem;
                        line-height: 1rem;
                    }
                    .cost-b{
                        bottom: 0.2rem;
                        width: 3rem;
                    }
                    .name_w{
                        width: 6rem;
                    }
                }
            }
        }
	}
</style>

