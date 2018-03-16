<template>
    <div class="pay-goods">
        <div class="fl" style="height: 100%;width: 65%;line-height: 1.5;" v-if="goods.isAttr && goods.attrInfo != ''">
            <div class="pay-name fl" style="height: 50%;width: 100%;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                {{goods.goodsName}}
            </div>
            <div class="pay-name fl" style="height: 50%;width: 100%;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;color: #777;">
                <template v-for="attr in goods.attr">
                    <template v-for="options in attr.options">
                        <template v-if="options.attrStatu">
                            ({{options.name}}:￥{{options.price}})
                        </template>
                    </template>
                </template>

            </div>
        </div>
        <div class="pay-name fl" v-else>
            {{goods.goodsName}}
            <template v-for="attr in goods.attr">
                <template v-for="options in attr.options">
                    <template v-if="options.attrStatu">
                        ({{options.name}})
                    </template>
                </template>
            </template>
        </div>
        <div class="pay-num fl">×{{goods.num}}</div>
        <div class="pay-sum fl">
            <div class="initialPrice" :class="isMember && goods.isVip != '0' ? 'goodsDiscount' : ''">￥{{goods.price}}</div>
            <div class="vipPrice" v-if="isMember && goods.isVip == '1'">￥{{goods.vipPrice}}</div>
            <div class="vipPrice" v-if="isMember && goods.isVip == '2'">￥{{getVipDiscount(goods.price)}}</div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {

            }
        },
        methods : {
            getVipDiscount : function(price){
                return ((Number(this.memberDiscount) / 100) * price ).toFixed(2);
            }
        },
        props: {
            goods: {
                type: Object,
            },
            isMember : Boolean,
            memberDiscount : [String,Number]
        }
    }
</script>
<style lang="less" scoped>
  .pay-list {
    width: calc(100%);
    height: 1.25333rem;
    line-height: 1.25333rem;
    color: #666; }
    .pay-list .pay-name {
      font-size: 0.37333rem;
      color: #333333;
      width: 65%;
      height: 1.25333rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden; }
    .pay-list .pay-num {
      font-size: 0.37333rem;
      color: #bbbbbb;
      width: 15%;
      height: 1.25333rem;
      text-align: center; }
    .pay-list .pay-sum {
      font-size: 0.37333rem;
      color: #333333;
      width: 20%;
      height: 1.25333rem;
      padding-right: 0.4rem;
      box-sizing: border-box;
      text-align: right; 
      display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-align: start;
    word-break: break-all;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
      }
    .vipPrice,.initialPrice{
        height: 50%;
        width:100%;
        line-height : 0.6266666666666667rem;
        text-align : center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .pay-list .pay-package {
      width: 100%;
      height: auto;
      line-height: 0.6rem;
      background-color: #efefef;
      text-indent: 0.4rem;
      overflow: hidden; }
    .pay-list .pay-package .package-goods {
        width: 100%;
        height: auto;
        background-color: #efefef; }
        .pay-list .pay-package .package-goods .pay-goodsName {
          color: #333333;
          font-size: 0.34667rem;
          width: 80%;
          height: 0.6rem; }
        .pay-list .pay-package .package-goods .pay-goodsNum {
          color: #333333;
          font-size: 0.34667rem;
          text-align: right;
          padding-right: 0.4rem;
          box-sizing: border-box;
          width: 20%;
          height: 0.6rem; }
    .pay-list .pay-integral {
      width: 85%;
      height: 1.25333rem;
      color: #333333;
      font-size: 0.37333rem;
      text-indent: 0.13333rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden; }
    .pay-list .integral-explain {
      display: block;
      width: auto;
      height: 100%;
      font-size: 0.32rem;
      color: #999999; }
    .pay-list .integral-tip {
      display: block;
      margin-left: 0.06667rem;
      width: 0.66667rem;
      height: 100%;
      background: url(../../../res/images/integral-tip.png) center center no-repeat;
      background-size: 0.53333rem 0.53333rem; }
    .pay-list .integral-icon {
      display: block;
      width: 0.42667rem;
      height: 100%;
      background: url(../../../res/images/integral-icon.png) center center no-repeat;
      background-size: 0.42667rem 0.42667rem; }
    .pay-list .integral-off {
      display: block;
      width: 1.02667rem;
      height: 0.52rem;
      cursor: pointer;
      margin-top: 0.36rem;
      margin-left: 0.13333rem;
      background: url(../../../res/images/on-off.png) no-repeat;
      background-position: 0 0;
      background-size: 2.06667rem, 0.77333rem;
      -webkit-transition: background-position 0.25s ease-in;
      transition: background-position 0.25s ease-in;
      overflow: hidden; }
    .pay-list .integral-on {
      display: block;
      width: 1.02667rem;
      height: 0.52rem;
      cursor: pointer;
      margin-top: 0.36rem;
      margin-left: 0.13333rem;
      background: url(../../../res/images/on-off.png) no-repeat;
      background-size: 2.06667rem, 0.77333rem;
      -webkit-transition: background-position 0.25s ease-in;
      transition: background-position 0.25s ease-in;
      background-position: -1.04rem 0;
      overflow: hidden; }
    .pay-list .using-integral {
      width: calc(100% - 0.93333rem);
      height: 1.25333rem;
      margin-left: 0.93333rem;
      color: #333333;
      font-size: 0.37333rem;
      overflow: hidden; }
    .pay-list .using-integral input {
        border: 1px solid #e5e5e5;
        width: 2rem;
        height: 0.93333rem;
        background-color: #f7f7f7;
        margin-top: 0.16rem;
        margin-left: 0.26667rem;
        margin-right: 0.26667rem;
        padding-left: 0.26667rem; }

.pay-goods {
  width: calc(100% - 0.4rem);
  height: 1.25333rem;
  margin-left: 0.4rem;
  border-bottom: 1px solid #DDDDDD; }

.pay-list:last-child .pay-goods {
  border-bottom: none; }
.goodsDiscount{
    text-decoration: line-through;
    font-style: italic;
    color : #aba6a6;
}
</style>