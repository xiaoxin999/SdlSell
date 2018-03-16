<template>
    <div class="container">
        <div class="comments_header">
            <span class="on">全部点评</span>
            <span>我的点评</span>
        </div>
        <div class="comment_on_content">
            <div class="white_box"></div>
            <div>
                <div class="user_img fl">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341915189,686089607&fm=111&gp=0.jpg" alt="">
                </div>
                <div class="user_comment_content fl">
                    <div class="user_names">周星星</div>
                    <div class="comment_content">我嘻嘻哈哈哈娃娃</div>
                    <div class="comment_time">2018-03-08 16:00:55</div>
                </div>
            </div>
            <div>
                <div class="user_img fl">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341915189,686089607&fm=111&gp=0.jpg" alt="">
                </div>
                <div class="user_comment_content fl">
                    <div class="user_names">周星星</div>
                    <div class="comment_content">我嘻嘻哈哈哈娃娃</div>
                    <div class="comment_time">2018-03-08 16:00:55</div>
                </div>
            </div>
            <div>
                <div class="user_img fl">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341915189,686089607&fm=111&gp=0.jpg" alt="">
                </div>
                <div class="user_comment_content fl">
                    <div class="user_names">周星星</div>
                    <div class="comment_content">我嘻嘻哈哈哈娃娃</div>
                    <div class="comment_time">2018-03-08 16:00:55</div>
                </div>
            </div>
            <div>
                <div class="user_img fl">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341915189,686089607&fm=111&gp=0.jpg" alt="">
                </div>
                <div class="user_comment_content fl">
                    <div class="user_names">周星星</div>
                    <div class="comment_content">我嘻嘻哈哈哈娃娃</div>
                    <div class="comment_time">2018-03-08 16:00:55</div>
                </div>
            </div>
            <div>
                <div class="user_img fl">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341915189,686089607&fm=111&gp=0.jpg" alt="">
                </div>
                <div class="user_comment_content fl">
                    <div class="user_names">周星星</div>
                    <div class="comment_content">我嘻嘻哈哈哈娃娃</div>
                    <div class="comment_time">2018-03-08 16:00:55</div>
                </div>
            </div>
            <div>
                <div class="user_img fl">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341915189,686089607&fm=111&gp=0.jpg" alt="">
                </div>
                <div class="user_comment_content fl">
                    <div class="user_names">周星星</div>
                    <div class="comment_content">我嘻嘻哈哈哈娃娃</div>
                    <div class="comment_time">2018-03-08 16:00:55</div>
                </div>
            </div>
            <div>
                <div class="user_img fl">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341915189,686089607&fm=111&gp=0.jpg" alt="">
                </div>
                <div class="user_comment_content fl">
                    <div class="user_names">周星星</div>
                    <div class="comment_content">我嘻嘻哈哈哈娃娃</div>
                    <div class="comment_time">2018-03-08 16:00:55</div>
                </div>
            </div>
            <div>
                <div class="user_img fl">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341915189,686089607&fm=111&gp=0.jpg" alt="">
                </div>
                <div class="user_comment_content fl">
                    <div class="user_names">周星星</div>
                    <div class="comment_content">我嘻嘻哈哈哈娃娃</div>
                    <div class="comment_time">2018-03-08 16:00:55</div>
                </div>
            </div>
            <div>
                <div class="user_img fl">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341915189,686089607&fm=111&gp=0.jpg" alt="">
                </div>
                <div class="user_comment_content fl">
                    <div class="user_names">周星星</div>
                    <div class="comment_content">我嘻嘻哈哈哈娃娃</div>
                    <div class="comment_time">2018-03-08 16:00:55</div>
                </div>
            </div>
            <div>
                <div class="user_img fl">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341915189,686089607&fm=111&gp=0.jpg" alt="">
                </div>
                <div class="user_comment_content fl">
                    <div class="user_names">周星星</div>
                    <div class="comment_content">我嘻嘻哈哈哈娃娃</div>
                    <div class="comment_time">2018-03-08 16:00:55</div>
                </div>
            </div>
        </div>
        <div class="release_comments">
            <a class="comments_btn" href="javascript:viod(0)">发布点评</a>
        </div>
    </div>
</template>
<script>
import utils from 'src/verdor/utils';
import http from "src/manager/http";
export default {
    data(){
        return {
            list : []
        }
    },
    methods: {
        async getCommentList(){
            // let = await http.getCommentList({
            //     page : '',
            //     num : '',
            //     staffFansId : '',
            //     myComment : 0
            // });
        }
    },
    mounted(){
        utils.setTitle('点评列表');
    }
}
</script>
<style lang="less" scoped>
@import '../../../res/css/base.less';
.container{
    .setBox(100%,auto);
    min-height: 100%;
    background-color: #F8F8F8;
    overflow: hidden;
    .comments_header{
        background: url(../../../res/images/header_bg.jpg);
        .setBox(100%,2rem);
        line-height: 2rem;
        font-size: 0;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 99;
        >span{
            display: inline-block;
            .setBox(50%,100%);
            color: #ffffff;
            font-size: .4rem;
            text-align: center;
            position: relative;
        }
        .on:before{
            content: '';
            .setBox(2rem,.0533rem);
            display: block;
            background-color: #ffffff;
            position: absolute;
            left: 50%;
            top: 70%;
            transform: translate(-50%,-70%);
        }
    }
    .comment_on_content{
        .setBox(100%,auto);
        margin-top: 2rem;
        >div{
            .setBox(100%,2rem); 
            border-bottom: .0667rem solid #ffffff;
            overflow: hidden;  
            &:last-child{
                border-bottom: none;
            }
            .user_img{
                .setBox(1.8933rem,2rem);
                position: relative;
                overflow: hidden;
                img{
                    .setBox(1.1733rem,1.1733rem);
                    border-radius: 50%;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                }
            }
            .user_comment_content{
                .setBox(8.1067rem,2rem);
                overflow: hidden;
                .user_names{
                    .setBox(100%,.8rem);
                    line-height: .8rem;
                    color: #030303;
                    font-size: .3467rem;
                }
                .comment_content{
                    .setBox(100%,.56rem);
                    line-height: .56rem;
                    color: #999999;
                    font-size: .2933rem;
                    .text-overflow;
                }
                .comment_time{
                    .setBox(100%,.5333rem);
                    line-height: .5333rem;
                    color: #999999;
                    font-size: .2933rem;
                }
            }
        }
        .white_box{
            .setBox(100%,.4rem);
            background-color: #ffffff;
        }
    }
    .release_comments{
        position: fixed;
        left: 50%;
        bottom: 8%;
        .comments_btn{
            background-color: #EAC048;
            display: block;
            .setBox(4.5067rem,.8667rem);
            line-height: .8667rem;
            text-align: center;
            color: #ffffff;
            font-size: .3733rem;
            border-radius: 1.3333rem;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
    }
}
</style>
