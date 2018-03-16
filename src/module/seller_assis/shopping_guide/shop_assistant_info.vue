<template>
    <div class="container">
        <div class="header">
            <div class="header_top">
                <div class="num">200</div>
                <div class="box"></div>
                <div class="num">200</div>      
            </div>
            <div class="header_bottom">
                <div class="num bottom_num">当前金币</div>
                <div class="box bottom_num"></div>
                <div class="num bottom_num" style="text-indent: .8rem;">客户</div>
                <div class="content_center">
                    <div class="name">小小店小二</div>
                    <div class="label">店员</div>
                    <div class="grade">⭐⭐⭐⭐⭐</div>
                </div>
            </div>
            <div class="head_sculpture"></div>
        </div>
        <div class="user_label">
            <span class="label_red">超级傻</span>
            <span class="label_blue">超级傻</span>
            <span class="label_green">超级傻</span>
            <span class="label_orange">超级傻</span>
            <span>超级傻</span>     
        </div>
        <div class="user_operate">
            <a href="javascript:void(0)" class="btns">查看客户沟通记录</a>
        </div>
    </div>
</template>
<script>
import utils from 'src/verdor/utils';
export default {
    data(){
        return{

        }
    },
    methods:{

    },
    mounted(){
        utils.setTitle('店员信息');
    }
}
</script>
<style lang="less" scoped>
@import '../../../res/css/base.less';
.container{
    .setBox(100%,100%);
    background-color: #ffffff ;
    overflow: hidden;
    .header{
        .setBox(100%,5.6rem);
        background-color: #ffffff;
        margin-bottom: .2667rem;
        position: relative;
        overflow: hidden;
        .header_top{
            .setBox(100%,2rem);
            background-color: black;
            font-size: 0;
        }
        .header_bottom{
            .content_center{
                display: table-cell;
                text-align: center;
                vertical-align: middle;
                .setBox(10rem,2rem);
                .name{
                    font-size: .3733rem;
                    text-align: center;
                    font-weight: bold;
                    .setBox(100%,.5333rem);
                    line-height: .5333rem;
                    margin-bottom: .0667rem;
                    .text-overflow;
                }
                .label{
                    color: #D0021B;
                    border: 1px solid #D0021B;
                    .setBox(1.0667rem,.4667rem);
                    line-height: .4667rem;
                    display: inline-block;
                    margin-bottom: .0667rem;
                    border-radius: 4px;
                }
                .grade{
                    .setBox(100%,.5333rem);
                    line-height: .5333rem;
                    color: #EAC048;
                    font-size: .56rem;
                    display: inline-block;
                }
            }
        }
        .head_sculpture{
            .setBox(2.24rem,2.24rem);
            border-radius: 50%;
            border: .0667rem solid #fff;
            position: absolute;
            left: 50%;
            top: 20%;
            transform: translate(-50%,0);
            background-color: black;
        }
        .box,.num{
            float: left;
            margin-top: 1.0667rem;
        }
        .num{
            font-size : .4rem;
            color: #ffffff;
            .setBox(4rem,.56rem);
            line-height: .56rem;
            font-weight: bold;
        }
        .box{
            .setBox(2rem,.56rem);
        }
        .num:last-child{
            text-indent: .8rem;
        }
        .num:first-child{
            text-indent: 2.4rem;
        }
        .bottom_num{
            font-size: .3467rem;
            color: #303030;
            margin-top: 0;
            height: 1.6rem;
            line-height: 1rem;
        }
    }
    .user_label{
        .setBox(100%,3.3333rem);
        background-color: #ffffff;
        padding: .4rem;
        box-sizing: border-box;
        font-size: 0;
        margin-bottom: .2667rem;
        overflow: hidden;
        >span{
          display: inline-block;
          border-radius: 1.3333rem;
          .setBox(auto,.8667rem);
          line-height: .8667rem;
          padding: 0 .6rem;  
          color: #ffffff;
          font-size: .3467rem;
          background-color: #CDCDCD;
          margin: 0 .4rem .4rem 0;
        }
        .label_red{
            background-color: #FF6F49;
        }
        .label_blue{
            background-color: #FCA73E;
        }
        .label_green{
            background-color: #0AC687;
        }
        .label_orange{
            background-color: #FCA73E;
        }
    }
    .comment_on_header{
        background-color: #ffffff;
        .setBox(100%,1.2533rem);
        line-height: 1.2533rem; 
        .comment_on_title{
            color: #030303;
            font-size : .3467rem;
            text-indent: .7333rem;
            font-weight: 600;
            position: relative;
            &:before{
                content: '';
                position: absolute;
                left: .4rem;
                top: 50%;
                transform: translate(0,-50%);
                .setBox(.16rem,.16rem);
                background-color: #EAC048;
                border-radius: 50%;
            }
        }
        .comment_more{
            .setBox(2rem,100%);
            font-size : .3467rem;
            font-weight: 600;
            color: #999999;
            margin-right: .2667rem;
        }
    }
    .btns{
        position: fixed;
        left: 50%;
        bottom: .8rem;
        transform: translate(-50%,0);
        display: block;
        .setBox(5.1733rem,.84rem);
        line-height: .84rem;
        font-family: PingFang-SC-Medium;
        font-size: .3467rem;
        color: #FFFFFF;
        border-radius: 1.3333rem;
        background-color: #EAC048;
    }
}
</style>

