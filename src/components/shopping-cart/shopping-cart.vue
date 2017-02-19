<template>
 	<div class='shopping-cart'>
 		<div class='content'>
 			<div class='content-left' @click='toggleCartDetail'>
 				<div class='logo-wrapper' :class='{"high-light":totalCount > 0}'>
 					<div class='logo'>
 						<span class='icon-shopping_cart'></span>
 					</div>
 					<div class='total-count' v-show='totalCount > 0'>{{totalCount}}</div>
 				</div>
 				<div class='total-price' :class='{"high-light":totalPrice > 0}'>￥{{totalPrice}}</div>
 				<div class='delivery-price'>另需配送费￥{{deliveryPrice}}元</div>
 			</div>
 			<div class='content-right' :class='payClass' @click='pay'>{{payDescription}}</div>
 		</div>
		<div class='ball-container'>
	 		<transition-group
			  @before-enter='beforeEnter'
			  @enter='enter'
			  @after-enter='afterEnter'
	 		>
				<div class='y-move' v-for='(ball,index) in balls' v-show='ball.show' :key='index' :data-index='index'>
					<div class='x-move'></div>
				</div>
			</transition-group>
		</div>
		<transition name='fade'>
			<div class='cart-detail' v-show='isCartDetailShow'>
				<div class='header'>
					<span class='title'>购物车</span>
					<span class='empty' @click='empty'>清空</span>
				</div>
				<div class='food-list' ref='foodList'>
					<ul>
						<li class='food' v-for='food in selectFoods'>
							<span class='name'>{{food.name}}</span>
							<span class='total-price'>￥{{food.count*food.price}}</span>
							<div class='cart-control-wrapper'>
								<cart-control :food='food'></cart-control>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name='fade'>
			<div class='mask' v-show='isCartDetailShow' @click='toggleCartDetail'></div>
		</transition>
 	</div>
</template>

<script>
	import cartControl from 'components/cart-control/cart-control.vue'
	import BScroll from 'better-scroll'
	export default {
		props: {
			selectFoods: {
				type: Array,
				default () {
					return []
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data () {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				movingBalls: [],
				ballIndex: 0,
				toggleState: false
			}
		},
		computed: {
			totalPrice () {
				let total = 0
				this.selectFoods.forEach((food) => {
					total += food.price * food.count
				})
				return total
			},
			totalCount () {
				let count = 0
				this.selectFoods.forEach((food) => {
					count += food.count
				})
				return count
			},
			payDescription () {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`
				} else if (this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice
					return `还差￥${diff}起送`
				} else {
					return '去结算'
				}
			},
			payClass () {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough'
				} else {
					return 'enough'
				}
			},
			isCartDetailShow () {
				if (this.totalCount === 0) {
					this.toggleState = false
					return false
				}
				if (this.toggleState) {
					if (!this.scroll) {
						this.$nextTick(() => {
							this.scroll = new BScroll(this.$refs.foodList, {
								click: true
							})
						})
					} else {
						this.scroll.refresh()
					}
				}
				return this.toggleState
			}
		},
		components: {
			cartControl
		},
		methods: {
			dropBall (fromElement) {
				let ball = this.balls[this.ballIndex]
				ball.show = true
				ball.fromElement = fromElement
				this.movingBalls.push(ball)
				if (this.ballIndex === this.balls.length - 1) {
					this.ballIndex = 0
				} else {
					this.ballIndex ++
				}
			},
			beforeEnter (yElement) {
				let ball = this.balls[yElement.getAttribute('data-index')]
				let rect = ball.fromElement.getBoundingClientRect()
				let xDiff = rect.left - 20
				let yDiff = -(window.innerHeight - rect.top - 50)
				yElement.style.webkitTransform = `translate3d(0, ${yDiff}px, 0)`
				yElement.style.transform = `translate3d(0, ${yDiff}px, 0)`
				let xElement = yElement.getElementsByClassName('x-move')[0]
				xElement.style.webkitTransform = `translate3d(${xDiff}px, 0, 0)`
				xElement.style.transform = `translate3d(${xDiff}px, 0, 0)`
			},
			enter (yElement, done) {
				/* eslint-disable no-unused-vars */
				let rf = yElement.offsetHeight
				yElement.style.webkitTransform = 'translate3d(0, 0, 0)'
				yElement.style.transform = 'translate3d(0, 0, 0)'
				let xElement = yElement.getElementsByClassName('x-move')[0]
				xElement.style.webkitTransform = 'translate3d(0, 0, 0)'
				xElement.style.transform = 'translate3d(0, 0, 0)'
				done()
			},
			afterEnter (yElement) {
				let ball = this.balls[yElement.getAttribute('data-index')]
				if (ball) {
					ball.show = false
				}
			},
			toggleCartDetail () {
				if (!this.totalCount) {
					return
				}
				this.toggleState = !this.toggleState
			},
			empty () {
				this.selectFoods.forEach((food) => {
					food.count = 0
				})
			},
			pay () {
				if (this.totalPrice < this.minPrice) {
					return
				} else {
					window.alert(`支付${this.totalPrice}元`)
				}
			}
		},
		created () {
			this.$on('cartAdd', this.dropBall)
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../common/scss/mixin.scss';
	.shopping-cart {
		position: fixed;
		left: 0;
		bottom: 0;	
		width: 100%;
		height: 48px;		
		z-index: 50;
	}
	.content {
		display: flex;
		width: 100%;
		height: 100%;
		font-size: 0;
		.content-left {
			flex: 1;
			display: flex;
			align-items: center;
			background: #141d27;
			.logo-wrapper {
				position: relative;
				top: -8px;
				box-sizing: border-box;
				margin: 0 9px;
				padding: 6px;
				width: 50px;
				height: 50px;
				border-radius: 50%;
				background: #141d27; 
				.logo {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					background: #2b343d;
					font-size: 0;
					color: rgba(255, 255, 255, 0.4);
					text-align: center;
					.icon-shopping_cart {
						font-size: 24px;
						line-height: 38px;
					}
				}
				.total-count {
					position: absolute;
					top: 0;
					right: 0;
					width: 24px;
					height: 16px;
					line-height: 16px;
					background: rgb(240, 20, 20);
					border-radius: 6px;					
					font-size: 9px;
					font-weight: 700;
					color: #fff;
					text-align: center;
				}
				&.high-light {
					.logo {
						background: rgb(0, 160, 220);
						color: #fff;
					}
				}				
			}
			.total-price {
				padding: 8px 12px 8px 0;
				font-size: 16px;
				color: rgba(255, 255, 255, 0.4);
				font-weight: 700;
				border-right: 1px solid rgba(255, 255, 255, 0.1);
				&.high-light {
					color: #fff;
				}
			}
			.delivery-price {
				padding-left: 12px;
				font-size: 12px;
				font-weight: 700;
				color: rgba(255, 255, 255, 0.4);		
			}
		}
		.content-right {
			flex: 0 0 105px;
			padding: 0 8px;
			@media only screen and (max-width: 320px) {
				flex: 0 0 80px;
			}			
			font-size: 12px;
			text-align: center;
			line-height: 48px;
			font-weight: 700;
			&.not-enough {
				color: rgba(255, 255, 255, 0.4);
				background: #2b343b;
			}
			&.enough {
				color: #fff;
				background: #00b43c;
			}			
		}
	}
	.ball-container {
		position: fixed;
		left: 25px;
		bottom: 25px;
		z-index: 200;
		.y-move {
			transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
			.x-move {
				transition: all 0.4s linear;
				width: 18px;
				height: 18px;
				border-radius: 50%;
				background: rgb(0, 160, 220);		
			}			
		}
	}
	.cart-detail {
		position: absolute;
		left: 0;
		top: 0;		
		z-index: -1;
		width: 100%;
		transition: all 0.5s;
		transform: translate3d(0, -100%, 0);			
		&.fade-enter, &.fade-leave-active {
			transform: translate3d(0, 0, 0);
		}				
		.header {
			padding: 0 18px;
			height: 40px;
			background: #f3f5f7;
			border-bottom: 1px solid rgba(7, 17, 24, 0.1);
			.title {
				float: left;
				font-size: 14px;
				font-weight: 200;
				color: rgb(7, 17, 27);
				line-height: 40px;
			}
			.empty {
				float: right;
				font-size: 12px;
				color: rgb(0, 160, 220);
				line-height: 40px;
			}
		}
		.food-list {
			max-height: 265px;
			overflow: hidden;
			padding: 0 18px;
			background: #fff;
			font-size: 0;
			.food {
				position: relative;
				height: 48px;
				@include border-bottom-1px(rgba(7, 17, 27, 0.2));
				.name {
					display: inline-block;
					padding: 12px 0;
					font-size: 14px;
					color: rgb(7, 17, 27);
					line-height: 24px;
				}
				.total-price {
					position: absolute;
					height: 48px;
					right: 90px;
					top: 0;
					font-size: 14px;
					line-height: 48px;
					font-weight: 700;
					color: rgb(240, 20, 20);
				}
				.cart-control-wrapper {
					position: absolute;
					right: 0;
					bottom: 6px;
				}				
			}
		}
	}		
	.mask {
		position: fixed;
		z-index: -2;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		transition: all 0.5s;		
		background: rgba(7, 17, 27, 0.6);			
		&.fade-enter, &.fade-leave-active {
			background: transparent;	
		}		
	}	
</style>