<template>
    <section class='choose_shop'>
        <header>
            <div>
                请选择你要线下领取的门店~
            </div>
        </header>
        <section class="chooseList"  v-for="(item, index) in shopList" @click="checkShop()" :key="index">
            <div>
                <img :src="item.logoImage" alt="">
            </div>
            <ul>
                <li>{{item.shopName}}</li>
                <li>营业时间：{{item.openTime1}} - {{item.openTime2}}</li>
                <li>{{item.address}}</li>
            </ul>
        </section>
    </section>
</template>


<script>
    import utils from 'src/verdor/utils';
    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import timer from 'src/verdor/timer';

    export default{
        data(){
            return{
                shopName:"",
                logoImage: "",
                openTime:"",
                address:"",
                shopId:global.getShopId(),
                shopList : []
            }
        },
        methods:{
            checkShop(){
                // this.$router.push('/crazyRobbery')
            },
            async getShopList(){
                this.shopList = await http.getActivityShopList({
                    data: {
                        shopName: this.shopName,
                        logoImage: this.logoImage,
                        openTime: this.openTime,
                        address:this.address,
                        shopId:global.getShopId()
                    }
                })
               let shopList = this.shopList;
               for (var i = 0; i <shopList.length; i++) {
                    var openTimeArray = shopList[i].openTime.split(",");
                    var time1 = this.getTime(openTimeArray[0]);
                    var time2 = this.getTime(openTimeArray[1]);
                    shopList[i].openTime1 = time1;
                    shopList[i].openTime2 = time2;
                }
            },
            getTime( second_time ){
                var time = parseInt(second_time) + "秒";
                var second = parseInt(second_time) % 60;
                var min = parseInt(second_time / 60) % 60;
                var hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                time = ("00" + hour).substr(-2)+":"+("00" + min).substr(-2);
                return time;

            }
        },
        async mounted(){
            this.getShopList();
            utils.setTitle("请选择你要线下领取的门店~")
            this.getTime();

        }
    }
</script>

<style lang='less' scoped>
    .choose_shop{
        height: 100%;
        background: #fff;
        header{
            height:2rem;
            background-color: rgb(24,24,24);
            &>div {
                width: 90%;
                margin: 0 auto;
                height: 2rem;
                font-size: 0.4rem;
                color: #FFFFFF;
                line-height: 2rem;
                text-align: center;
            }
        }
        .chooseList{
            width: 93%;
            border: 1px solid #ddd;
            height: 14.1%;
            margin: 0 auto;
            margin-top: 0.28rem;
            background:#f8f8f8;
            &>div img{
                width: 2rem;
                height: 2rem;
                border-radius: 100%;
                float: left;
                line-height: 2rem;
                text-align: center;
                border: 1px solid #ddd;
                margin: 0.22rem;
            }
            ul{
                height: 2rem;
                li{
                    line-height: 0.66rem;
                }
                li:nth-child(1){
                    font-size: 0.4rem;
                    color: #303030;
                    font-weight: 600;
                    margin-top: 0.22rem;
                }
                li:nth-child(2),li:nth-child(3){
                    color: #999;
                    font-size: 0.3rem;
                }
            }

        }
    }

</style>


