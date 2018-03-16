<template>
  <div class="quick_reply">
        <div class="reply_title">选择话术 </div>
        <div class="reply_subhead">
            <span class="on">哈哈哈哈</span>
            <span>哈哈哈哈</span>
            <span>哈哈哈哈</span>
            <span>哈哈哈哈</span>
            <span>哈哈哈哈</span>
            <span>哈哈哈哈</span>
            <span>哈哈哈哈</span>
            <span>哈哈哈哈</span>
            <span>哈哈哈哈</span>
            <span>哈哈哈哈</span>    
        </div>
        <ul class="reply_list">
            <li class="on">莫慌，问题不大！</li>
            <li>莫慌，问题不大！</li>
            <li>莫慌，问题不大！</li>
            <li>莫慌，问题不大！</li>
            <li>莫慌，问题不大！</li>
            <li>莫慌，问题不大！</li>
            <li>莫慌，问题不大！</li>
            <li>莫慌，问题不大！</li>
            <li>莫慌，问题不大！</li>
            <li>莫慌，问题不大！</li>
        </ul>
        <a href="javascript:void(0)" class="reply_btn">确定</a>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
@import '../../../res/css/base.less';
.quick_reply{
    position: fixed;
    left: 0;
    bottom: 0;
    .setBox(100%,12rem);
    border-radius: .2667rem .2667rem 0 0;
    background-color: #ffffff;
    .reply_title{
        .setBox(100%,1.2533rem);
        line-height: 1.2533rem;
        font-family: PingFang-SC-Medium;
        font-size: .48rem;
        color: #303030;
        text-align: center;
        border-bottom: .1333rem solid #F8F8F8;
    }
    .reply_subhead{
        .setBox(100%,auto);
        line-height: 1.0933rem;
        padding: 0 .8933rem;
        font-family: PingFang-SC-Semibold;
        font-size: 0;
        color: #303030;
        border-bottom: .1333rem solid #F8F8F8;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        span{
            display: inline-block;
            .setBox(auto,100%);
            min-width: 1.1333rem;
            padding: 0 .2rem;
            font-size: .4rem;
            position: relative;
        }
        span.on:before{
            content: '';
            .setBox(1.0667rem,.0533rem);
            background-color: #303030;
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translate(-50%,0);
        }
    }
    .reply_list{
        .setBox(100%,5.6rem);
        padding-left: .9333rem;
        box-sizing: border-box;
        line-height: 1.0667rem;
        overflow-y: scroll;
        overflow-x: hidden;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        li{
            border-bottom: 5px solid #F8F8F8;
            font-size: .4rem;
            white-space: normal;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .on{
            color: #EAC048;
        }
    }
    .reply_btn{
        position: fixed;
        left: 50%;
        bottom: .7067rem;
        transform: translate(-50%,0);
        display: block;
        background: #EAC048;
        border-radius: 1.3333rem;
        .setBox(4.5067rem,.84rem);
        line-height: .84rem;
        font-family: PingFang-SC-Medium;
        font-size: .3467rem;
        color: #FFFFFF;
    }
}
</style>

