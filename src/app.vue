<template>
  <div id="app">
	<keep-alive>
		<router-view v-if="$route.meta.keepAlive">
			
		</router-view>
	</keep-alive>

	<router-view v-if="!$route.meta.keepAlive">
		
	</router-view>

	<broadcast></broadcast>
	<globalLoad v-if='$store.state.loadShow'></globalLoad>	

  </div>
</template>

<style lang="less">

#app{
	height:100%
}

</style>

<script>

	import broadcast from  'src/components/global_broadcast'; //全局提示框
	import globalLoad from  'src/components/phone/global_load'; //全局加载条
	let b = document.body;
	let h = document.documentElement;
	let top = 0;
	export default {
		data(){
			return{
				
			}
		},
		computed:{
			hide(){
				return this.$store.state.overHide||this.$store.state.loadShow;
			}
		},
		watch:{
			hide(newV,oldV){
				
				if(newV == true){
					top = document.documentElement.scrollTop || document.body.scrollTop;
				}
				
				if(newV){
					b.className+=" overHiden";
					h.className+=" overHiden";
				}
				else{
					b.className = b.className.replace("overHiden","");
					h.className = h.className.replace("overHiden","");
				}
				b.scrollTop = h.scrollTop = top;

				
			}
		},
		components:{broadcast,globalLoad}
	}

</script>
