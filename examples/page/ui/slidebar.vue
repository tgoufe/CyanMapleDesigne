<template>
	<div>
		<p class="title paddingv15 paddingh30">默认的滑动，当前值为{{value1}}</p>
		<div class="paddingh30 paddingt20 paddingb10">
			<cmui-slidebar v-model="value1" class="marginb20"></cmui-slidebar>
		</div>
		<p class="title paddingv15 paddingh30">设置步长为10滑动，当前值为{{value2}}</p>
		<div class="paddingh30 paddingt20 paddingb10">
			<cmui-slidebar v-model="value2" :step="10" class="marginb20"></cmui-slidebar>
		</div>
		<p class="title paddingv15 paddingh30">设置步长为1即可实现整数取值，下面的案例绑定了change事件，当前值为{{value3}}</p>
		<div class="paddingh30 paddingt20 paddingb10">
			<cmui-slidebar v-model="value3" :step="1" class="marginb20" @change="changeHandle"></cmui-slidebar>
		</div>
		<p class="title paddingv15 paddingh30">通过设置range属性模拟一个颜色框</p>
		<div class="paddingh30">
			<div class="paddingv20">
				<cmui-slidebar v-model="rgb.r" :step="1" :range="255"></cmui-slidebar>
			</div>
			<div class="paddingv20">
				<cmui-slidebar v-model="rgb.g" :step="1" :range="255" :value="100"></cmui-slidebar>
			</div>
			<div class="paddingv20">
				<cmui-slidebar v-model="rgb.b" :step="1" :range="255" :value="100"></cmui-slidebar>
			</div>
		</div>
		<div style="width:100px" class="ratio-container" :style="color"></div>
	</div>
</template>
<script>
	export default{
		data:function(){
			return {
				value1:50,
				value2:50,
				value3:50,
				rgb:{
					r:10,
					g:0,
					b:0
				}
			}
		},
		computed:{
			color(){
				return{
					backgroundColor:`rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b},1)`
				}
			}
		},
		methods:{
			changeHandle(value){
				maple.alert(value)
			}
		}
	}
</script>