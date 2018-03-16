<template>
    <section class='goodsDetail'>
        <header>
            <div>
                <span class='left' @click="goBack()"><img src="../../../res/images/nav-icon-return.jpg" alt=""></span>
                商品详情
            </div>
        </header>
        <section class="goodsImg">
            <img :src="detail.showImage" alt="">
            <div class="retime">距离疯抢开始还有{{countdownTime}}</div>
            <ul>
                <li>{{detail.name}} <span>仅剩{{detail.spareStock}}件</span></li>
                <li>原价：￥{{detail.originalPrice}} <span>限时价 <b>￥{{detail.price}}</b></span></li>
            </ul>
            <div class="buyexplain">
                <p> <b>·</b>抢购说明</p>
                <p> <b>·</b>每人最多可抢购1次哦~</p>

            </div>
        </section>
        <section class="bthBuy">
            <button type="button" class="btnBuy_btn" @click="checkShop()">立即抢购</button>
        </section>
    </section>
</template>


<script>
    import utils from 'src/verdor/utils';
    import storage from 'src/verdor/storage';
    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import timer from 'src/verdor/timer';

    export default{
        data(){
            return{
                detail:{},
                currentTime:0,
                countdownTime:0,
                timeStr:""
            }
        },
        methods:{
            goBack(){
              this.$router.go(-1);
            },
            checkShop(){
                this.$router.push("/chooseShop");
            },
            async getGoodsList(){
                let data = await http.getActivityShopGoodsList({
                        data:{
                            subShopId:global.getShopId(),
                            shopId:global.getShopId()
                        }
                    },false,true
                )
                this.currentTime = data.time;
                data = data.data;
                console.log(data,'detail');
                let {buyConfig,goodsList,stockList,imageList,orderList} = data;
                this.goodsList = goodsList;
                this.changeCountTime(buyConfig);
            },
            changeCountTime(obj){
                let start = Number(obj.startTime);
                this.timeStr = timer.add(()=>{
                    let t = --start;
                    if(t<=0){
                        timer.clear(this.timeStr);
                    }
                    this.countdownTime = this.getTime(t - this.currentTime);
                },1000,0,true)
            },
            getTime( second_time ){
                var time = parseInt(second_time) + "秒";
                var second = parseInt(second_time) % 60;
                var min = parseInt(second_time / 60) % 60;
                var hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                time = ("00" + day).substr(-2) + "天" + ("00" + hour).substr(-2)  + "小时" + ("00" + min).substr(-2)  + "分" + ("00" + second).substr(-2)  + "秒";
                return time;
            }
        },
        beforDestory(){
            timer.clear(this.timeStr);
        },
        mounted(){
            this.detail = storage.session("toGoodsDetail");
            utils.setTitle("商品详情");
            this.getGoodsList();
        }
    }
</script>

<style lang='less' scoped>

    .goodsDetail{
        height:100%;
        header{
            height:1.2rem;
            width: 100%;
            &>div{
                width: 100%;
                margin: 0 auto;
                height: 1.2rem;
                font-size: 0.4rem;
                color: #303030;
                line-height: 1.2rem;
                background:#fff;
                text-align: center;
                span{
                    display: inline-block;
                    position: absolute;
                    left: 0;
                    img{
                        height:0.44rem;
                        vertical-align: middle;
                        margin-left: 0.1rem;
                    }
                }
            }
        }
        section.goodsImg{
            width: 10rem;
            height: 10rem;
            img{
                width: 100%;
                height: 10rem;
            }
            .retime{
                width: 100%;
                height: 0.6rem;
                background:linear-gradient(-90deg,  #1D1D1D,#5E5E63);
                text-align: center;
                color: #fff;
                line-height: 0.6rem;
                margin-top: -0.08rem;
            }
            ul{
                height: 2rem;
                background: #fff;
                width: 100%;
                li:nth-child(1){
                    font-size: 0.44rem;
                    color: #303030;
                    font-weight: 600;
                    height: 1rem;
                    line-height: 1rem;
                    width: 90%;
                    margin: 0 auto;
                    span{
                        float: right;
                        font-size: 0.36rem;
                        color: #EAC048;
                        font-weight: 500;
                    }
                }
                li:nth-child(2){
                    font-size: 0.38rem;
                    color: #999;
                    height: 1rem;
                    line-height: 1rem;
                    width: 90%;
                    margin: 0 auto;
                    text-decoration: line-through ;
                    span{
                        float: right;
                        font-size: 0.36rem;
                        color: #303030;
                        font-weight: 600;
                        b{
                            color: #D0021B;
                        }
                    }
                }
            }
            .buyexplain{
                background: #fff;
                margin-top: 0.24rem;
               p{
                   color: #303030;
                   font-size: 0.4rem;
                   font-weight: 600;
                   height: 0.8rem;
                   line-height: 0.8rem;

                   b{
                       color: #EAC048;
                       display: inline-block;
                       padding: 0 0.4rem;
                   }
               }
                p:nth-child(2){
                    color: #999;
                    font-weight: 500;
                    font-size: 0.36rem;
                    height: 0.8rem;
                    line-height: 0.8rem;
                    b{
                        color: #fff;
                        display: inline-block;
                        padding: 0 0.4rem;
                    }
                }
            }

        }

        .bottom{
            padding-top: 0.5rem;
            background-color: white;
        }
    }
    section.bthBuy {
        position: fixed;
        width: 100%;
        bottom: 4%;
        text-align: center;
    }
   section .btnBuy_btn{
            width: 4.6rem;
            height: 1rem;
            background: #EAC048;
            color: #fff;
            border-radius: 100px;
            border: none;
        }
</style>


