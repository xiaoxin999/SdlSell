<template>
    <div class="container">
        <div class="header">
            <div class="header_top">
                <div class="num">{{staffData.customerTotal}}</div>
                <div class="box"></div>
                <div class="num">{{staffData.customerTotal}}</div>      
            </div>
            <div class="header_bottom">
                <div class="num bottom_num">粉丝</div>
                <div class="box bottom_num"></div>
                <div class="num bottom_num" style="text-indent: .8rem;">客户</div>
                <div class="content_center">
                    <div class="name">{{userData.name}}</div>
                    <div class="label" v-if="staffData.position == '1'">店长</div>
                    <div class="label" v-if="staffData.position == '2'">店员</div>
                    <div class="grade">⭐⭐⭐⭐⭐</div>
                </div>
            </div>
            <div class="head_sculpture">
                <img :src="userData.imageUrl" alt="头像">
            </div>
        </div>
        <div class="user_label">
            <!-- <span class="label_red">超级傻</span>
            <span class="label_blue">超级傻</span>
            <span class="label_green">超级傻</span>
            <span class="label_orange">超级傻</span> -->
            <span v-for="(item,index) in tagConfig" v-bind:key="item.name" v-if="item.type == '1'" :class="setTagClass(index)">{{item.name}}<i class="praise_icon"></i>{{item.clickCount}}</span>     
        </div>
        <div class="user_comment_on">
            <div class="comment_on_header">
                <div class="comment_on_title fl">点评</div>
                <div class="comment_more fr">查看更多》</div>
            </div>
            <div class="comment_on_content">
                <div>
                    <div class="user_img fl">
                        <img :src="userData.imageUrl" alt="">
                    </div>
                    <div class="user_comment_content fl">
                        <div class="user_names">{{comment.name}}</div>
                        <div class="comment_content">{{comment.content}}</div>
                        <div class="comment_time">{{transformTime(comment.createTime)}}</div>
                    </div>
                </div>
            </div>
            <div class="release_comments">
                <a class="comments_btn" href="javascript:viod(0)">发布点评</a>
            </div>
        </div>
    </div>
</template>
<script>
import utils from 'src/verdor/utils';
import http from "src/manager/http";
import storage from 'src/verdor/storage';
import global from 'src/manager/global';

export default{
    data(){
        return {
            userData : {}, // 用户信息
            staffData : {}, // 导购详细信息
            tagConfig : [], // 标签信息
            comment : {} // 评论信息
        }
    },
    methods : {
        async myGuide(){
            // 获取配置
            let data = await http.myGuide({data:{
                shopId : global.getShopId(),
                staffFansId : storage.session('guide_detail') ? storage.session('guide_detail').userData.staffFansId : ''
            }});
            this.userData = data.userData;
            this.staffData = data.staffData;
            this.tagConfig = this.getTagCount(data.tagConfig,data.tagClick);
            this.comment = data.comment;
        },
        getTagCount(arr1,arr2){
            // 获取标签被点击总数
            for(var i=0;i<arr1.length;i++){
                for(var j=0;j<arr2.length;j++){
                    if(arr1[i].id == arr2[j].tagId){
                        arr1[i].clickCount = arr2[j].clickCount;
                    }
                }
                if(arr1[i].type == '0'){
                    arr1.splice(i,1);
                    i--;
                }
            }

            let list = utils.sortByAll(arr1,"clickCount",false);
            return list;
        },
        transformTime(time){
            // 转换时间
            return utils.format(time,'yyyy/MM/dd hh:mm');
        },
        setTagClass(index){
            // 设置标签颜色
            /**
             * @augments{Number} 根据index赋值
             */

            switch(index){
                case 0:
                    return "label_red";
                    break;
                case 1:
                    return "label_orange";
                    break;
                case 2:
                    return "label_green";
                    break;
                case 3:
                    return "label_blue";
                    break;
                default:
                    
            }
        }
    },
    mounted(){
        this.myGuide();
        utils.setTitle('我的专属导购');
    }
}
</script>
<style lang="less" scoped>
@import '../../../res/css/base.less';
.container{
    .setBox(100%,auto);
    background-color: #F8F8F8 ;
    overflow: hidden;
    .header{
        .setBox(100%,5.6rem);
        background-color : #ffffff;
        margin-bottom: .2667rem;
        position: relative;
        overflow: hidden;
        .header_top{
            .setBox(100%,2rem);
            background: url(../../../res/images/header_bg.jpg);
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
            border: .1333rem solid #CDCDCD;
            position: absolute;
            left: 50%;
            top: 20%;
            transform: translate(-50%,0);
            background-color: black;
            box-sizing: border-box;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.23);
            img{
                height: 100%;
                width: 100%;
                border-radius: 50%;
                border: .1067rem solid #fff;
            }
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
          padding: 0 .4rem;  
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
    .comment_on_content{
        .setBox(100%,auto);
        >div{
            .setBox(100%,2rem); 
            overflow: hidden;  
            &:first-child{
                border-bottom: .0667rem solid #ffffff;
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
    }
    .release_comments{
        .setBox(100%,5.0667rem);
        background-color: #ffffff;
        position: relative;
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
            bottom: 20%;
            transform: translate(-50%,0);
        }
    }
    .praise_icon{
        display: inline-block;
        background: url(../../../res/images/sell_assis/praise_icon.png) center center;
        background-size: .4rem .4rem;
        .setBox(.4rem,.4rem);
        margin: 0 .1067rem;
    }
}
</style>

