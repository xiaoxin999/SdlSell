<template>
    <div class="container">
        <div class="header">您还没有选择专属导购...</div>
        <div class="content">
            <div class="box" v-for="item in list" v-bind:key="item.index">
                <div class="user_img fl">
                    <img :src="item.imageUrl" alt="头像">
                </div>
                <div class="user_info fl">
                    <div class="user_name">
                        <span class="fl">{{item.staffName}}</span>
                        <span class="user_label fl" v-if="item.permissions == '1'">店长</span>
                        <span class="user_label fl" v-if="item.permissions == '2'">店员</span>
                    </div>
                    <div class="user_score">⭐⭐⭐⭐⭐</div>
                    <div class="user_shop">门店：上海杨浦第一店</div>
                </div>
                <div class="fl user_operation">
                    <span>就选Ta了</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import utils from 'src/verdor/utils';
import http from "src/manager/http";
import global from "src/manager/global";

export default {
    data(){
        return {
            list : [],
            imgUrl : ''
        }
    },
    methods: {
        async myStaffList(){
            let data = await http.myStaffList({data : {shopId : '61'}});
            this.list = data.staffList;
        },
        getImg(img){
            console.log(img);
            // global.getImgUrl('1',img);
        }
    },
    mounted(){
        this.imgUrl = global.getImgUrl();
        console.log(this.imgUrl);
        this.myStaffList();

        utils.setTitle('我的专属导购');
    }
}
</script>
<style lang="less" scoped>
@import '../../../res/css/base.less';
.container{
    .setBox(100%,auto);
    min-height: 100%;
    background-color: #ffffff;
    .header{
        .setBox(100%,2rem);
        line-height: 2rem;
        background: url(../../../res/images/header_bg.jpg);
        font-size: .4rem;
        color: #ffffff;
        text-align: center;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 99;
    }
    .content{
        padding-top: 2.4rem;
        .setBox(100%,auto);
        overflow: hidden;
        .box{
            border: 1px solid #999999;
            border-radius: .1333rem;
            margin: 0 .36rem .2933rem .36rem;
            .setBox(9.28rem,3rem);
            .user_img{
                .setBox(2.6667rem,100%);
                position: relative;
                overflow: hidden;
                img{
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                    .setBox(1.7067rem,1.7067rem);
                    border-radius: 50%;
                }
            }
            .user_info{
                .setBox(3.8133rem,100%);
                padding: .6rem 0;
                box-sizing: border-box;
                overflow: hidden;
                .user_name,.user_shop{
                    .setBox(100%,.6667rem);
                    line-height: .6667rem;
                    color: #303030;
                    font-size: .3467rem;
                    font-weight: 600;
                    .text-overflow;
                    .user_label{
                        .setBox(auto,.4667rem);
                        max-width: 1.3333rem;
                        line-height: .4667rem;
                        color: #D0021B;
                        border: 1px solid #D0021B;
                        padding: 0 .2rem;
                        border-radius: .0533rem;
                        margin: .0667rem  0 0 .2667rem;
                        font-size: .24rem;
                        .text-overflow;
                    }
                }
                .user_score{
                    .setBox(100%,.4667rem);
                    line-height: 50%;
                    color: #EAC048;
                    font-size: .56rem;
                }
                .user_shop{
                    .setBox(100%,.6667rem);
                    color: #999999;
                    font-size: .2667rem;
                }
            }
            .user_operation{
                .setBox(2.7rem,100%);
                padding: .6rem 0;
                box-sizing: border-box;
                overflow: hidden;
                span{
                    display: block;
                    background: rgba(234,192,72,1);
                    .setBox(2.1867rem,.84rem);
                    line-height: .84rem;
                    text-align: center;
                    color: #ffffff;
                    font-size: .3467rem;
                    border-radius: 1.3333rem;
                }
            }
        }
    }
}
</style>

