<template>
	<transition>
	  <div class='food-info' v-show='showFlag'>
	 		<div class='back' @click='hidden'>
	 			<span class='icon-arrow_lift'></span>
	 		</div>
	  	<div class='scroll-wrapper' ref='scrollWrapper'>
		  	<div class='scroll'>
			  	<div class='food-img'>
			  		<img :src='food.image'>
			  	</div>
			  	<div class='content'>
						<h2 class='name'>{{food.name}}</h2>
						<p class='extra'>
							<span class='sell-count'>月售{{food.sellCount}}份</span><span class='rating'>好评率{{food.rating}}%</span>
						</p>
						<p class='price'>
							<span class='now-price'>￥{{food.price}}</span><span class='old-price' v-show='food.oldPrice'>￥{{food.oldPrice}}</span>
						</p>
						<div class='cart-control-wrapper'>
							<cart-control :food='food'></cart-control>
						</div>
			  	</div>
			  	<spilt v-show='food.info'></spilt>
			  	<div class='description' v-show='food.info'>
			  		<h1 class='title'>商品介绍</h1>
			  		<p class='content'>{{food.info}}</p>
			  	</div>   	
			  	<spilt></spilt>
			  	<div class='ratings'>
			  		<h1 class='title'>商品评价</h1>
			  		<rating-select :settings='settings' :ratings='food.ratings'></rating-select>
		  			<ul v-show='food.ratings && food.ratings.length'>
		  				<li class='rating' v-for='rating in food.ratings' v-show='ratingShow(rating)'>
		  					<div class='time'>{{rating.rateTime | formatDate}}</div>
		  					<div class='des'>
		  						<span :class='iconClass(rating.rateType)'></span><span class='text'>{{rating.text}}</span>
		  					</div>
		  					<div class='user'>
		  						<span class='name'>{{rating.username}}</span>
		  						<img class='avatar' :src='rating.avatar' widht='12px' height='12px'>
		  					</div>
		  				</li>
		  			</ul>
		  			<div class='no-rating' v-show='!food.ratings || !food.ratings.length'>暂时没有评论</div>
			  	</div>	  		
	  		</div>	     	  	 		
	  	</div>
	  </div>	
	</transition>
</template>

<script>
	import spilt from 'components/spilt/spilt.vue'
	import BScroll from 'better-scroll'
	import cartControl from 'components/cart-control/cart-control.vue'
	import ratingSelect from 'components/rating-select/rating-select.vue'
	import {formatDate} from 'common/js/date.js'
	const GOOD_RATING = 0
	const BAD_RATING = 1
	const ALL_RATING = 2
	export default {
		props: {
			food: {
				type: Object
			}
		},
		data () {
			return {
				showFlag: false,
				settings: {
					rateType: ALL_RATING,
					onlyContent: false,
					goodRatingText: '推荐',
					badRatingText: '吐槽',
					allRatingText: '全部'
				}
			}
		},
		methods: {
			show () {
				this.showFlag = true
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.scrollWrapper, {
							click: true
						})
					} else {
						this.scroll.refresh()
					}
				})
			},
			hidden () {
				this.showFlag = false
			},
			iconClass (rateType) {
				if (rateType === GOOD_RATING) {
					return 'icon-thumb_up'
				} else if (rateType === BAD_RATING) {
					return 'icon-thumb_down'
				}
			},
			ratingShow (rating) {
				let settings = this.settings
				if (settings.onlyContent === true && rating.text === '') {
					return false
				} else if (settings.rateType !== ALL_RATING && settings.rateType !== rating.rateType) {
					return false
				} else {
					return true
				}
			}
		},
		filters: {
			formatDate (time) {
				let date = new Date(time)
				return formatDate(date, 'yyyy-MM-dd hh:mm')
			}
		},
		components: {
			spilt,
			cartControl,
			ratingSelect
		},
		created () {
			this.$on('cartAdd', (target) => {
				this.$parent.$emit('cartAdd', target)
			})
			this.$on('scrollRefresh', () => {
				if (this.scroll) {
					this.$nextTick(() => {
						this.scroll.refresh()
					})
				}
			})
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../common/scss/mixin.scss';
	.food-info {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 30;
		width: 100%;
		bottom: 48px;
		background: #fff;
		transition: all 0.5s;
		transform: translate3d(0, 0, 0);
		&.v-enter, &.v-leave-active {
			transform: translate3d(100%, 0, 0);
		}
		.back {
			position: absolute;
			left: 18px;
			top: 18px;
			z-index: 1;
			font-size: 0;
			.icon-arrow_lift {
				display: inline-block;
				width: 30px;
				height: 30px;
				border-radius: 50%;
				text-align: center;
				line-height: 30px;
				font-size: 10px;
				color: #fff;
				background: rgba(0, 0, 0, 0.8);				
			}
		}
		.scroll-wrapper {
			width: 100%;
			height: 100%;
		}
		.food-img {
			position: relative;
			width: 100%;
			height: 0;
			padding-top: 100%;
			img {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
		}
		.content {
			padding: 18px;
			position: relative;
			.name {
				font-size: 14px;
				font-weight: 700;
				color: rgb(7, 17, 27);
			}
			.extra {
				margin-top: 8px;
				font-size: 10px;
				color: rgb(147, 153, 159);
				.sell-count {
					margin-right: 12px;
				}
			}
			.price {
				margin-top: 18px;
				.now-price {
					margin-right: 12px;
					font-size: 14px;
					font-weight: 700;
					color: rgb(240, 20, 20);
					line-height: 24px;
				}
				.old-price {
					font-size: 10px;
					font-weight: 700;
					color: rgb(147, 153, 159);
					line-height: 24px;
				}
			}
			.cart-control-wrapper {
				position: absolute;
				right: 18px;
				bottom: 18px;
			}
		}
		.description {
			padding: 18px;
			.title {
				font-size: 14px;
				color: rgb(7, 17, 27);
			}
			.content {
				padding: 6px 8px;
				font-size: 12px;
				font-weight: 200;
				color: rgb(77, 85, 93);
				line-height: 24px;
			}
		}
		.ratings {
			padding: 18px;
			.title {
				font-size: 14px;
				font-weight: 200;
				color: rgb(7, 17, 27);
			}
			.rating {
				padding: 16px 0;
				@include border-bottom-1px(rgba(7, 17, 27, 0.1));
				&:last-child {
					@include border-1px-none();
				}				
				.time {
					font-size: 10px;
					color: rgb(147, 153, 159);
				}
				.des {
					margin-top: 6px;
					font-size: 12px;
					.icon-thumb_up{
						color: rgb(0, 160, 220);
						line-height: 16px;
						margin-right: 4px;
					}
					.icon-thumb_down {
						color: rgb(147, 153, 159);
						line-height: 16px;
						margin-right: 4px;
					}
					.text {
						color: rgb(7, 17, 27);
						line-height: 16px;
						vertical-align: top;
					}
				}
				.user {
					position: absolute;
					right: 0;
					top: 16px;
					font-size: 0;
					.name {
						margin-right: 6px;
						font-size: 10px;
						color: rgb(147, 153, 159);
						line-height: 12px;
					}
					.avatar {
						border-radius: 50%;
						vertical-align: top;
					}
				}
			}
			.no-rating {
				padding: 16px 0;
				font-size: 12px;
				color: rgb(7, 17, 27);
			}
		}
	}
</style>