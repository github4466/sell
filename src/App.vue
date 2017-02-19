<template>
  <div id='app'>
  	<v-header :seller='seller'></v-header>
  	<div class='tab'>
  		<router-link class='tab-item' to='/goods'>商品</router-link>
  		<router-link class='tab-item' to='/ratings'>评价</router-link>
  		<router-link class='tab-item' to='/seller'>商家</router-link>
  	</div>
  	<keep-alive>
  		<router-view :seller='seller'></router-view>
  	</keep-alive>
  </div>
</template>

<script>
	import header from 'components/header/header'
	import {urlParse} from 'common/js/util.js'
	export default {
		data () {
			return {
				seller: {
					id: (() => {
						let queryParam = urlParse()
						if (queryParam.id) {
							return queryParam.id
						} else {
							return ''
						}
					})()
				}
			}
		},
		components: {
      'v-header': header
		},
		created () {
			this.$http.get('/api/seller?id' + this.seller.id).then((res) => {
				this.seller = Object.assign({}, this.seller, res.body.data)
			})
		}
	}
</script>

<style lang='scss' scoped>
	 @import './common/scss/mixin.scss';
	.tab {
		display: flex;
		width: 100%;
		height: 40px;
		@include border-bottom-1px( rgba(7, 17, 27, 0.1) );
		.tab-item {
			flex: 1;
			display: inline-block;
			font-size: 14px;
			line-height: 40px;
			text-align: center;
			color: rgb(77, 85, 93);
			&.router-link-active {
				color: rgb(240, 20, 20);
			}
		}
	}
</style>
