<template>
    <section class='sellerIndex'>
        <header>
            <div>
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        <img v-if='bannerList.length' v-for="(item,i) in bannerList" class="swiper-slide" :key = 'i' :src="getUrl(item.iamge)" alt="">
                        <img v-if='showBan' src="../../res/images/sell_assis/banner.jpg" alt="">
                    </div>
                </div>
            </div>
        </header>
        <section class ='nav'>
            <ul>
                <li @click="toRouter('1')">
                    <img src="../../res/images/sell_assis/crazy_buy.png" alt="">
                    <div >疯抢</div>
                </li>
                <li @click="toRouter('2')">
                    <img src="../../res/images/sell_assis/point_mall.png" alt="">
                    <div>积分商城</div>
                </li>
                <li @click="toRouter('3')">
                    <img src="../../res/images/sell_assis/my_guide.png" alt="">
                    <div>专属导购</div>
                </li>
                <li @click="toRouter('4')">
                    <img src="../../res/images/sell_assis/user_center.png" alt="">
                    <div>用户中心</div>
                </li>
            </ul>
        </section>
        <section class='bottom'>
            <section class ='guide_card'>
                <span class='title stor'>我的专属导购</span>
                <div class='content'>
                    <img :src="userData.imageUrl" alt="">
                    <div class='right'>
                        <div class='n'>
                            <span class='name'>{{userData.name||'暂无'}}</span>
                            <span class='tag'> {{staffData.position=='1'?"店长":"店员"}}</span>
                            <div style='margin-top:0.2rem;' class='star'>
                                <img src="../../res/images/sell_assis/star.png" alt="" v-for='i in level' :key='i'>
                            </div>
                        </div>
                        <div class='callCard' @click='showDetail'>
                            查看名片
                        </div>
                        <div style='transform: scale(0.9);transform-origin: 0 0;white-space: nowrap;margin-top:0.3rem;font-size:0.2667rem;color: #999999;transform:scale(0.8)'>您可以直接在"公众号界面"输入内容,与TA直接沟通</div>
                    </div>
                </div>
            </section>
            <section class='mall'>
                <span class='title stor' >积分商城</span>
                <span class='goHome' @click="toRouter('2')">去首页>></span>
            </section>
            <section class='swip_con'>
                <div class="mall-swiper-container">
                    <div class="swiper-wrapper" style='text-align:center'>
                        <div v-for="(item,i) in goodLists" class="swiper-slide" :key="'-' + i">
                            <img :src="getUrl(item.imageName)" alt="">
                            <span>{{item.name}}</span>
                        </div>

                        
                    </div>
                </div>
            </section>
            <section class='time'>
                <span>倒计时还有{{countdownTime}}</span>
            </section>
            <section class ='buy'>
                <span class='title stor' style='margin:0.3rem'>疯抢</span>
                <span class='goHome' @click="toCrazyRobbey()">查看更多>></span>
                <div class='clear'></div>
                <ul>
                    <li v-for = "(item,index) in showGoogsList" :key='index' @click="toChooseShop()">
                        <img :src="getUrl(item.showImage)" alt="">
                        <div class='name'>{{item.name}}</div>
                        <div>
                            <span class='price'>¥{{item.price}}</span><br>
                            <span class='lastprice'>¥{{item.originalPrice}}</span>
                        </div>
                    </li>
                </ul>
            </section>
            <div class='button' @click='clickTip' :class='{no:isBuying,yes:!isBuying}'>
                <span v-if='isBuying'>✔&nbsp;已开启</span>
                <span v-if='!isBuying'>开启疯抢提醒</span>
            </div>
        </section>
    </section>
</template>


<script>
    
    import global from 'src/manager/global';
    import utils from 'src/verdor/utils';
    import http from 'src/manager/http';
    import timer from 'src/verdor/timer';
    import storage from "src/verdor/storage";

    export default{
        data(){
            return{
                isBuying:false,
                currentTime:0,
                countdownTime:0,
                timeStr:"",
                goodsList:[],
                showGoogsList:[],
                guideData:{},
                userData:{},
                staffData:{},
                coinsTotal:0,//累计金币
                level:0,
                goodLists:[],
                bannerList:[],
                showBan:false
                
            }
        },
        methods:{
            getUrl(url){
                return global.getImgUrl() +url;
            },
            showDetail(){
                storage.session("guide_detail",this.guideData);
                this.$router.push("/shoppingGuide");

            },
            toCrazyRobbey(){
                this.$router.push('/crazyRobbery')
            },
            clickTip(e){
                this.isBuying = !this.isBuying;
            },
            toRouter(id){
                switch(id){
                    case "2":
                        this.$router.push("/intergralMall");
                        break;
                    default:
                        break;
                }
            },
            toChooseShop(){
                this.$router.push("/goodsDetail");
            },
            //导购的数据
            async myGuide(){
                let data = await http.myGuide({
                    data:{
                        shopId:global.getShopId(),
                        staffFansId:storage.session("login").staffFansId
                    }
                })
                this.guideData = data;
                this.userData = data.userData;
                let level = this.guideData.levelConfig = utils.sortByAll(this.guideData.levelConfig,'totalGold',true);
                
                let index = 0;
                for(var i=0;i<level.length;i++){
                    if(Number(level[i])>this.coinsTotal){
                        index = i;
                        break;
                    }
                }
                this.level = index + 1;

            },
            //疯抢的数据
            async berserkData(){
                let data = await http.getActivityShopGoodsList({
                        data:{
                            subShopId:global.getShopId(),
                            shopId:global.getShopId()
                        }
                    },false,true
                ) 
                this.currentTime = data.time;
                data = data.data;

                let {buyConfig,goodsList,stockList,imageList} = data;
                this.goodsList = goodsList;
                this.showGoogsList = utils.deepCopy(this.goodsList).slice(0,3);//首页展示的列表
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
            } ,
            async getList(){
                let data = await http.getListByWeixin
				({
					data:{
						shopId: global.getShopId(),
                        page: 1,
                        num: 20
					}
				})
                this.goodLists = data.list.slice(0,3);
                this.$nextTick(()=>{

                    var swiper = new Swiper('.mall-swiper-container', {
                            slidesPerView: 2,
                            spaceBetween: 30,
                            centeredSlides: true,
                            pagination: {
                                el: '.swiper-pagination',
                                clickable: true,
                            },
                    });

                })
            },
            async getBannerList(){
                let data = await http.getSlideShowList({
                    data:{
                        type:3,
                        shopId:global.getShopId()
                    }
                })
                this.bannerList = Object.values(data);
                if(this.bannerList.length==0) this.showBan = true;
                this.$nextTick(function(){
                new this.Swiper('.swiper-container', {
                        pagination: '.swiper-pagination'
                    });
                })

            }
        },
        beforDestory(){
            timer.clear(this.timeStr);
        },
        async mounted(){
            this.Swiper = await import (/* webpackChunkName: "swiper" */'src/verdor/swiper.min.js');
            this.css = await import (/* webpackChunkName: "swiper" */'../../res/css/swiper.min.css');
            global.replaceCssIntoStylePro(this.css[0][1]);

        
            this.berserkData();
            this.myGuide();
            this.getList();
            this.getBannerList();
            utils.setTitle('闪店卖手');

        }
    }
    
</script>

<style lang = 'less' scoped>

    .stor{
        font-family: PingFang-SC-Medium;
        font-size: 0.32rem;
        color: #030303;
        font-weight: bold
    }
    .sellerIndex{

        header{
            position: relative;
            padding-top: 4rem;
            &>div{
                position: absolute;
                left:0;top:0;
                width: 100%;
            }
            
        }
        
        .nav{
            height:2.5rem;
            background-color: white;
            padding: 0 0.8rem;
            ul{
                height:100%;
                text-align: center;
                display: table;
                width: 100%;
                font-size: 0.32rem;
                font-family: PingFang-SC-Medium;
                color: #555555;
                li{
                    display: table-cell;
                    height:100%;
                    vertical-align: middle;
                    img{
                        width: 1.173rem;
                        height: 1.173rem;
                    }
                }
            }
        }
        .swiper-wrapper img{
            width:100%;
            height:4rem;
        }
        .bottom{
            margin-top: 0.3rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            background-color: white;

            .title{
                vertical-align: middle;
                padding-left:0.5rem;
                line-height: 0.8rem;
            }
            .title:before{
                content: ".";
                color:rgb(234,192,71);
                font-size:30px;
                position: absolute;
                margin-top: -0.28rem;
                margin-left: -0.3rem;
            }

            .guide_card{
                width: 9.28rem;
                height:3.2rem;
                margin: 0 auto;
                border-radius: 0.1rem;
                border:#ccc solid 1px;
                margin-bottom: 0.3rem;
                
                
                .content{
                    width:90%;
                    margin:0 auto;
                    height:70%;
                    margin-top: 0.25rem;
                    img{
                        width:1.7rem;
                        height:1.7rem;
                    }
                    div.right{
                        display: inline-block;
                        margin-left: 0.5rem;
                        height:1.7rem;
                        vertical-align: top;
                        width:71%;
                        div.n{
                            display: inline-block;
                            vertical-align: top;
                            span.name{
                                font-size: 0.4rem;
                            }
                            .star{
                                img{
                                    width: 0.32rem;
                                    height:0.32rem;
                                }
                            }
                            span.tag{
                                display: inline-block;
                                margin-left: 0.1rem;
                                width:0.82rem;
                                border: 1px solid #D0021B;
                                border-radius: 0.1rem;
                                text-align: center;
                            }
                        }
                        
                        .callCard{
                            width:2.18rem;
                            height:0.84rem;
                            background-color: rgb(234,192,71);
                            border-radius: 1.33rem;
                            margin-left: 1.2rem;
                            line-height: 0.8rem;
                            text-align: center;
                            float: right;
                        }


                    }
                }
            }

            .mall{
                margin-top:0.15rem;
                width:9.28rem;
                margin: 0 auto;
                
                .goHome{
                    line-height: 0.8rem;
                    float: right;
                    margin-top: 0.01rem;
                    color:#aaa;
                }
                .img{
                    border-radius: 0.2rem;
                }
            }

            .swip_con{
                overflow: hidden;
                width:100%;
            }
            .time{
                background: linear-gradient(to right,#5E5E63  , #1D1D1D); /* 标准的语法 */
                height:0.8rem;
                text-align: center;
                line-height: 0.8rem;
                font-size: 0.35rem;
                color:#FFFFFF;
                margin-top: 0.3rem;
            }
            .buy{
                background-color: white;
                margin-top: 0.3rem;
                position: relative;
                .goHome{
                    line-height: 0.8rem;
                    color:#aaa;
                    margin-right:10px;
                    position: absolute;
                    right:-0.1rem;
                }
                ul{
                    display: flex;
                    align-items:center;
                    width: 100%;
                    li{
                        flex:1;
                        vertical-align: middle;
                        text-align: center;
                        list-style: none;
                        height:100%;
                        padding-top:3.09rem;
                        position:relative;
                        .name{
                            position:absolute;
                            background:rgba(0,0,0,0.6);
                            height:0.8rem;
                            width:2.69rem;
                            left:0;
                            right:0;
                            bottom:0.81rem;
                            margin:0 auto;
                            color:white;
                            line-height: 0.8rem;
                        }
                        img{
                            position:absolute;
                            top:0;
                            left:0;
                            right:0;
                            bottom:0;
                            margin:0 auto;
                            width: 2.69rem;
                            height: 3.09rem;

                        }
                        .price{
                            font-size: 0.30rem;
                            color: #D0021B;
                        }
                        .lastprice{
                            font-size: 0.24rem;
                            color: #999999;
                            text-decoration: line-through;
                        }
                    }
                }
            }
            .button{
                width:2.69rem;
                height:0.84rem;
                border-radius: 1.25rem;
                font-size: 0.35rem;
                margin: 0 auto;
                margin-top: 0.5rem;
                line-height: 0.84rem;
                text-align: center;
            }
            .yes{
                background-color: #EAC048;
            }
            .no{
                background: #999999;
            }
        }
    }


</style>
