<template>
   <section class='assCenter'>
      
            <div class='user_info'>

                    <div class='left'>
                        <span>15</span>
                        <div>转化</div>
                    </div>
                    
                    <div class='photo'>
                        <img src="../../../res/images/face.png" alt="">
                        <div class='name'>1111</div>
                    </div>
                    
                    <div class='left'>
                        <span>10</span>
                        <div>客户</div>
                    </div>
            </div>
            <div class='money'>
                <div>累计金币：2100</div>
                <div>当前金币：100</div>
            </div>
            <ul>
                <li>
                    <span>我的二维码</span>
                    <em>></em>
                </li>
                <li>
                    <span>店员排行</span>
                    <em>></em>
                </li>
                <li>
                    <span>店铺工具</span>
                    <em>></em>
                </li>
                <li>
                    <span>我的客户</span>
                    <em>></em>
                </li>
                <li>
                    <span>收益</span>
                    <em>></em>
                </li>
                <li>
                    <span>核销记录</span>
                    <em>></em>
                </li>
            </ul>
  </section>
</template>


<script>
    
</script>


<style lang='less' scoped>

    .assCenter{

            .user_info{
                height:4rem;
                width: 100%;
                background-color: rgb(20,20,20);
                display: table;
                vertical-align: middle;
                text-align: center;
                color:white;
                &>div{
                    display: table-cell;
                    vertical-align: middle;
                    text-align: center;
                    height:100%;
                }
                .left span,.right span{
                    font-size: 0.48rem;
                }
                .left div,.right div{
                    font-size: 0.4rem;
                }
                .left{
                    height:100%;
                }
                .right{
                    height:100%;
                }
                .photo{

                    img{
                        width:2.24rem;
                        height:2.24rem;
                    }
                    .name{
                        font-size: 0.37rem;
                        color: #FFFFFF;
                    }
                }
                
            
            }
            .money{
                height:1.47rem;
                text-align: center;
                font-size: 0.4rem;
                color: #303030;
                div{
                    display: inline-block;
                    width: 49%;
                    height:1.47rem;
                    line-height: 1.47rem;
                }
                &>div:nth-child(2){
                    border-left: 1px solid #979797;
                }
            }
            ul{
                li{
                    height:1.33rem;
                    line-height:1.33rem;
                    margin-bottom: 0.05rem;
                    background-color: white;
                    span{
                        display: inline-block;
                        width: 49%;
                        height: 100%;
                        text-indent: 0.5rem;
                        font-size: 0.35rem;
                        color: #303030;
                        font-weight: bold;
                    }
                    em{
                        display: inline-block;
                        height: 100%;
                        width: 49%;
                        text-align: right;
                        padding-right: 0.5rem;
                    }
                }
            }
    }
    


</style>
