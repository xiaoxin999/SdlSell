<template>
    <div class="container">
        <div class="header">
            <span class="return_page fl">&lt;</span>
            <span class="title">sky</span>
        </div>
        <div class="content">
            <div class="chat_time">
                <span>10:13</span>
            </div>
            <div class="chat_content">
                <div class="fl chat_box" v-for="item in messageList" v-bind:key="item.message">
                    <div class="another_person" v-show="item.type == '2'">
                        <div class="head_sculpture fl">
                        <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=929853647,293915704&fm=111&gp=0.jpg" alt="">
                        </div>
                        <div class="user_info fl">
                            <div class="user_name">sky</div>
                            <div class="user_msg">{{item.message}}</div>
                        </div>
                    </div>
                    <div class="oneself" v-show="item.type == '1'">
                        <div class="head_sculpture fr">
                            <img class="fr" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3833507463,3516507632&fm=111&gp=0.jpg" alt="head_sculpture">
                        </div>
                        <div class="user_info fr">
                            <div class="user_msg">{{item.message}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="operate_icon fl">
                <span class="select_pictures">
                    <input type=file accept="image/*">
                </span>
                <span class="give_present"></span>
                <span class="quick_reply"></span>
            </div>
            <div class="import_box fl">
                <input type="text" class="fl" v-model="message">
                <span class="commit fl" @click="sendMessage"></span>
            </div>
        </div>
    </div>
</template>
<script>
import utils from 'src/verdor/utils';
export default {
    data(){
        return{
            message : "", // 发送的消息
            socket : "", // webSocket
            messageList : [] //消息列表
        }
    },
    methods:{
        sendMessage(){ 
            // 发送消息
            let obj = JSON.stringify({"toFansId":"111","msg":this.message});
            this.socket.send(obj);
            this.messageList.push({"message":this.message,"type":1}); // type：1为自己发送消息
            this.message = "";
        }
    },
    mounted(){
        this.socket = new WebSocket("ws:192.168.31.231:8086?fansId=110");

        this.socket.addEventListener('message', (event)=> {
            console.log('Message from server', event.data);
            this.messageList.push({"message":event.data,"type":2}); // type：1为他人发送消息
        });
        utils.setTitle('我的客户');
    }
}
</script>
<style lang="less" scoped>
@import '../../../res/css/base.less';
.container{
    .setBox(100%,100%);
    overflow: hidden;
}
.header{
    background: #FFFFFF;
    text-align: center;
    font-family: PingFang-SC-Medium;
    font-size: .48rem;
    color: #303030;
    .setBox(100%,1.1733rem);
    line-height: 1.1733rem;
    .return_page{
        display: block;
        .setBox(1.0667rem,100%);
    }
    .title{
        margin-left: -1.0667rem;
    }
}
.content{
    @diff : 2.6667rem;
    .setBox(100%,calc(~"100% - @{diff}"));
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .chat_time{
        .setBox(10rem,.9333rem);
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        overflow: hidden;
        span{
            background: #D8D8D8;
            border-radius: 8px;
            font-family: PingFang-SC-Medium;
            font-size: .32rem;
            color: #FFFFFF;
            padding: 0.05rem 0.3rem;
        }
    }
    .chat_content{
        padding: 0 .2933rem;
        .another_person,.oneself{
            .setBox(100%,auto);
            min-height: 1.12rem;
            overflow: hidden;
        }
        .head_sculpture{
            .setBox(1.36rem,1.6rem);
            img{
                .setBox(1.0933rem,1.0933rem);
                border-radius: 50%;
            }
        }
        .oneself > .head_sculpture{
            height: 100%;
        }
        .user_info{
            @diff : 1.36rem;
            max-width: calc(~"100% - @{diff}");
            .setBox(auto,auto);
        }
        .user_name{
            font-family: PingFang-SC-Medium;
            font-size: .32rem;
            color: #999999;
            .setBox(auto,.6667rem);
            line-height: .6667rem;
            .text-overflow;
        }
        .user_msg{
            background: #FFFFFF;
            border: 1px solid #999999;
            border-radius: 4px;
            .setBox(auto,auto);
            max-width: 6.4rem;
            line-height: .6667rem;
            padding: 0 .2rem;
            position: relative;
        }
        .chat_box{
            .setBox(100%,auto);
            margin-bottom: .4rem;
            overflow: hidden;
        }
    }
}
.footer{
    position: fixed;
    left: 0;
    bottom: 0;
    .setBox(100%,1.32rem);
    line-height: 1.32rem;
    background: #F8F8F8;
    border-top: 1px solid #999999;
    box-sizing: border-box;
    .operate_icon{
        .setBox(3.8667rem,100%);
        padding-left: .1333rem;
        box-sizing: border-box;
        font-size: 0;
        span{
            .setBox(33.3%,100%);
            display: inline-block;
        }
        .select_pictures{
            background: url(../../../res/images/sell_assis/select_pictures.png) center center no-repeat;
            background-size: .72rem .5733rem;
            position: relative;
            >input{
                opacity: 0;
                position: absolute;
                left: 0;
                z-index: 5;
                .setBox(100%,100%);
            }
        }
        .give_present{
            background: url(../../../res/images/sell_assis/give_present.png) center center no-repeat;
            background-size: .6667rem .56rem;
        }
        .quick_reply{
            background: url(../../../res/images/sell_assis/quick_reply.png) center center no-repeat;
            background-size: .6rem .6rem;
        }
    }
    .import_box{
        .setBox(6.1333rem,100%);
        input{
            background: #FFFFFF;
            border: 1px solid #979797;
            border-radius: .1067rem;
            .setBox(5.0533rem,.9733rem);
            margin-top: .1467rem;
            text-indent: .2667rem;
        }
        span.commit{
            display: block;
            .setBox(1.08rem,100%);
            background: url(../../../res/images/sell_assis/send_message.png) center center no-repeat;
            background-size : .6rem .36rem;
        }
    }
}

</style>

