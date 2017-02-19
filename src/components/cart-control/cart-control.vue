<template>
  <div class='cart-control'>
  	<div class='decrease icon-remove_circle_outline' v-show='food.count>0' @click='decrease'></div>
  	<div class='count' v-show='food.count>0'>{{food.count}}</div>
  	<div class='add icon-add_circle' @click='add'></div>
  </div>
</template>

<script>
	import Vue from 'vue'
	export default {
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			decrease (event) {
				if (!event._constructed) {
					return
				}
				if (this.food.count > 0) {
					this.food.count--
				}
			},
			add (event) {
				if (!event._constructed) {
					return
				}
				if (this.food.count) {
					this.food.count++
				} else {
					Vue.set(this.food, 'count', 1)
				}
				this.$parent.$emit('cartAdd', event.target)
			}
		}
	}
</script>

<style lang='scss' scoped>
	.cart-control {
		font-size: 0;
		.decrease, .count, .add {
			display: inline-block;
		}
		.decrease, .add {
			padding: 6px;
			font-size: 24px;
			color: rgb(0, 160, 220);
			line-height: 24px;
		}
		.count {
			vertical-align: top;
			padding-top: 6px;
			width: 12px;
			font-size: 10px;
			line-height: 24px;
			text-align: center;
			color: rgb(147, 153, 159);
		}
	}
</style>