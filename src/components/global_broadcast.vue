<template>
    
    <div id= "global_broadcast">
        <transition name="fade">
            <win v-if="show" @winEvent = "winEvent" :type="type" :ok="ok" :showBtn = "showBtn">
                <div slot="content" class="slotContent">
                    <div v-html="content">
                        <!-- <span>{{content}}</span> -->
                    </div>
                </div>
            </win>
        </transition>
    </div>
    
</template>
<script>
    
    import win from "./phone/win.vue";
    
    export default{
        props:{
            
        },
        data(){
            return {
                
            }
        },
        methods:{
            winEvent(str){
                let callback = this.$store.state.win.callBack||function(){};
                callback(str);
                this.$store.commit("setWin",{show:false})
            }
        },
        watch: {
            showBtn(val){
                if(val === false){
                    setTimeout(()=>{
                        this.$store.commit('setWin',{
                            show: false
                        })
                    },1000)
                }
            }
        },
        computed:{
            show(){
                return this.$store.state.win.show;
            },
            title(){
                return this.$store.state.win.title;
            },
            content(){
                return this.$store.state.win.content;
            },
            type(){
                return this.$store.state.win.type||'alert';
            },
            ok(){
                return this.$store.state.win.ok;
            },
            showBtn(){
                return this.$store.state.win.showBtn;
            }
        },
        components:{win}
    }

</script>
<style lang=  "less">
    #global_broadcast{
        position: fixed;
        z-index: 1000;
        div.slotContent{
            height:100%;
            display: table;
            width:100%;
            div{
                display: table-cell;
                text-align: center;
                vertical-align: middle;
                height: 100%;
               
            }
            
        }
        
    }
</style>

