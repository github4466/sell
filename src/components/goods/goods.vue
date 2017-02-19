<template>
	<div class='goods'>
		<div class='menu-wrapper' ref='menuWrapper'>
			<ul>
				<li class='menu-item' v-for='(item, index) in goods' :class='{ current: currentIndex === index}' @click='selectMenuItem(index, $event)'>
					<div class='content-wrapper'>
					  <span class='icon' v-show='item.type > 0' :class='classMap[item.type]'></span>
						<span class='text'>{{item.name}}</span>						
					</div>
				</li>
			</ul>
		</div>
		<div class='foods-wrapper' ref='foodsWrapper'>
			<ul>
				<li class='food-type' v-for='foodType in goods'>
					<div class='title'>{{foodType.name}}</div>
					<ul>
						<li class='food' v-for='food in foodType.foods' @click='showFoodInfo(food,$event)'>
							<div class='icon'>
								<img :src='food.icon' width='57px' height='57px'>
							</div>
							<div class='content'>
								<h2 class='name'>{{food.name}}</h2>
								<p class='description' v-show='food.description'>{{food.description}}</p>
								<p class='extra'>
									<span class='sell-count'>月售{{food.sellCount}}份</span><span class='rating'>好评率{{food.rating}}%</span>
								</p>
								<p class='price'>
									<span class='now-price'>￥{{food.price}}</span><span class='old-price' v-show='food.oldPrice'>￥{{food.oldPrice}}</span>
								</p>
							</div>
							<div class='cart-control-wrapper' @click.stop>
								<cart-control :food='food'></cart-control>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	 	<shopping-cart :delivery-price='seller.deliveryPrice' :min-price='seller.minPrice' :select-foods='selectFoods' ref='shoppingCart'></shopping-cart>
	 	<food-info :food='selectFood' ref='foodInfo'></food-info>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import shoppingCart from 'components/shopping-cart/shopping-cart.vue'
	import cartControl from 'components/cart-control/cart-control.vue'
	import foodInfo from 'components/food-info/food-info.vue'

	export default {
		data () {
			return {
				classMap: ['decrease', 'discount', 'guarantee', 'invoice', 'special'],
				goods: [],
				foodTypeHeight: [],
				scrollY: 0,
				selectFood: {}
			}
		},
		props: {
			seller: {
				type: Object
			}
		},
		computed: {
			currentIndex () {
				for (let i = 0; i < this.foodTypeHeight.length; i++) {
					let height1 = this.foodTypeHeight[i]
					let height2 = this.foodTypeHeight[i + 1]
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i
					}
				}
				return 0
			},
			selectFoods () {
				let arr = []
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count > 0) {
							arr.push(food)
						}
					})
				})
				return arr
			}
		},
		components: {
			shoppingCart,
			cartControl,
			foodInfo
		},
		created () {
			this.$http.get('/api/goods').then((res) => {
				this.goods = res.body.data
				this.$nextTick(() => {
					this._initialScroll()
					this._calculateHeight()
				})
			})
			this.$on('cartAdd', this.onCartAdd)
		},
		methods: {
			_initialScroll () {
				this.menuScroll = new BScroll(this.$refs.menuWrapper, {
					click: true
				})
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
					probeType: 3,
					click: true
				})
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y))
				})
			},
			_calculateHeight () {
				let foodTypes = this.$refs.foodsWrapper.getElementsByClassName('food-type')
				let item
				let height = 0
				this.foodTypeHeight.push(height)
				for (let i = 0; i < foodTypes.length; i++) {
					item = foodTypes[i]
					height += item.clientHeight
					this.foodTypeHeight.push(height)
				}
			},
			selectMenuItem (index, event) {
				if (!event._constructed) {
					return
				}
				let el = this.$refs.foodsWrapper.getElementsByClassName('food-type')[index]
				this.foodsScroll.scrollToElement(el, 500)
			},
			onCartAdd (fromElement) {
				this.$refs.shoppingCart.dropBall(fromElement)
			},
			showFoodInfo (food, event) {
				if (!event._constructed) {
					return
				}
				this.selectFood = food
				this.$refs.foodInfo.show()
			}
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../common/scss/mixin.scss';
	.goods {
		display: flex;
		position: absolute;
		top: 174px;
		bottom: 46px;
		width: 100%;
		overflow: hidden; 
		.menu-wrapper {
			flex: 0 0 80px;
			width: 80px;
			background: #f3f5f7;
			.menu-item {
				padding: 0 12px;
				height: 54px;
				display: table;
				.content-wrapper {
					display: table-cell;
					width: 56px;
					vertical-align: middle;
					@include border-bottom-1px(rgba(7, 17, 27, 0.1));
				}
				&:last-child .content-wrapper {
					@include border-1px-none();
				}
				&.current {
					position: relative;
					z-index: 10;
					margin-top: -1px;
					background: #fff;
					font-weight: 700;
					.content-wrapper {
						@include border-1px-none();
					}
				}
				.icon {
					display: inline-block;
					margin-right: 2px;
					width: 12px;
					height: 12px;
					background-size: 12px 12px;
					background-repeat: no-repeat;
					&.decrease {
						@include bg-img('./decrease_3');
					}
					&.discount {
						@include bg-img ('./discount_3');
					}
					&.guarantee {
						@include bg-img ('./guarantee_3');
					}
					&.invoice {
						@include bg-img ('./invoice_3');
					}
					&.special {
						@include bg-img ('./special_3');
					}					
				}
				.text {
					vertical-align: top;
					font-size: 12px;
					font-weight: 200;
					line-height: 14px;
				}
			}
		}
		.foods-wrapper {
			flex: 1;
			.title {
				height: 26px;
				border-left: 2px solid #d9dde1;
				padding-left: 14px;
				background: #f3f5f7;
				font-size: 12px;
				color: rgb(147, 153, 159);
				line-height: 26px;
			}
			.food {
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				@include border-bottom-1px(rgba(7, 17, 27, 0.1));
				&:last-child {
					@include border-1px-none();
				}
				.icon {
					flex: 0 0 57px;
					margin-right: 10px;
				}
				.content {
					flex: 1;
					.name {
						font-size: 14px;
						color: rgb(7, 17, 27);
						padding-top: 2px;
					}
					.description, .extra {
						font-size: 10px;
						color: rgb(147, 153, 159);
						padding-top: 5px;
						line-height: 14px;
					}
					.extra {
						.sell-count {
							margin-right: 12px;
						}
					}
					.price {
						padding-top: 5px;
						.now-price {
							margin-right: 8px;
							font-size: 14px;
							font-weight: 700;
							color: red;
						}
						.old-price {
							vertical-align: middle;
							font-size: 10px;
							color: rgb(143, 157, 159);
						}				
					}
				}
				.cart-control-wrapper {
					position: absolute;
					right: 0;
					bottom: 4px;
				}
			}
		}
	}
</style>