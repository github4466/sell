<template>
	<div class='seller' ref='seller'>
		<div class='scroll'>
			<div class='overview'>
				<div class='seller-name'>{{seller.name}}</div>
				<div class='description'>
					<star class='star' :size='36' :score='seller.score'></star>
					<span class='rating-count'>({{seller.ratingCount}})</span>
					<span class='sell-count'>月售{{seller.sellCount}}单</span>
				</div>
				<ul class='remark'>
					<li class='block'>
						<div class='title'>起送价</div>
						<div class='content'>
							<span class='stress'>{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class='block'>
						<div class='title'>商家配送</div>
						<div class='content'>
							<span class='stress'>{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class='block'>
						<div class='title'>平均配送时间</div>
						<div class='content'>
							<span class='stress'>{{seller.deliveryTime}}</span>元
						</div>
					</li>										
				</ul>
				<div class='favorite' @click='toggleFavorite'>
					<span class='icon-favorite' :class='{active: this.favorite}'></span>
					<div class='text'>{{favoriteText}}</div>
				</div>
			</div>
			<spilt></spilt>
			<div class='bulletin'>
				<h1 class='title'>公告与活动</h1>
				<p class='text'>{{seller.bulletin}}</p>
			</div>
			<ul class='supports'>
				<li class='support' v-for='support in seller.supports'>
					<span class='icon' :class='classMap[support.type]'></span>
					<span class='text'>{{support.description}}</span>
				</li>
			</ul>
			<spilt></spilt>
			<div class='pics'>
				<h1 class='title'>商家实景</h1>
				<div class='pics-scroll-wrapper' ref='picsScrollWrapper'>
					<ul class='pics-scroll' ref='picsScroll'>
						<li class='pic' v-for='pic in seller.pics'>
							<img :src='pic' width='120px' height='90px'>
						</li>
					</ul>
				</div>
			</div>
			<spilt></spilt>
			<div class='infos'>
				<ul>
					<li class='info' v-for='info in seller.infos'>{{info}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import star from 'components/star/star.vue'
	import spilt from 'components/spilt/spilt.vue'
	import {saveToLocal, loadFromLocal} from 'common/js/store.js'
	import BScroll from 'better-scroll'
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data () {
			return {
				favorite: (() => {
					return loadFromLocal(this.seller.id, 'favorite', false)
				})(),
			//	favorite: false,
				classMap: ['decrease', 'discount', 'guarantee', 'invoice', 'special']
			}
		},
		computed: {
			favoriteText () {
				return this.favorite ? '已收藏' : '收藏'
			}
		},
		components: {
			star,
			spilt
		},
		watch: {
			seller () {
				this._initScroll()
				this._initPicsScroll()
			}
		},
		mounted () {
			this._initScroll()
			this._initPicsScroll()
		},
		methods: {
			toggleFavorite (event) {
				if (!event._constructed) {
					return
				}
				this.favorite = !this.favorite
				saveToLocal(this.seller.id, 'favorite', this.favorite)
			},
			_initScroll () {
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.seller, {
							click: true
						})
					} else {
						this.scroll.refresh()
					}
				})
			},
			_initPicsScroll () {
				if (this.seller.pics) {
					let picWidth = 120
					let margin = 6
					let width = (picWidth + margin) * this.seller.pics.length - margin
					this.$refs.picsScroll.style.width = width + 'px'
				}
				this.$nextTick(() => {
					if (!this.picsScroll) {
						this.picsScroll = new BScroll(this.$refs.picsScrollWrapper, {
							scrollX: true,
						//	scrollY: false,
							eventPassthrough: 'vertical'
						})
					} else {
						this.picsScroll.refresh()
					}
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../common/scss/mixin.scss';
	.seller {
		position: absolute;
		top: 174px;
		bottom: 0;
		width: 100%;
		overflow: hidden;
		.overview {
			position: relative;
			padding: 18px;
			font-size: 0;
			.seller-name {
				font-size: 14px;
				color: rgb(7, 17, 27);
				font-weight: 600;
			}
			.description {
				margin-top: 8px;
				padding-bottom: 18px;
				@include border-bottom-1px(rgba(7, 17, 27, 0.1))
				.star {
					vertical-align: top;
					margin-right: 8px;
				}
				.rating-count, .sell-count {
					font-size: 10px;
					color: rgb(77, 85, 93);
					line-height: 18px;
				}
				.rating-count {
					margin-right: 12px;
				}
			}
			.remark {
				display: flex;
				padding: 18px 0;
				.block {
					flex: 1;
					text-align: center;
					border-right: solid 1px rgba(7, 17, 27, 0.1);
					&:last-child {
						border-right: none;
					}
					.title {
						font-size: 10px;
						color: rgb(147, 153, 159);
					}
					.content {
						margin-top: 4px;
						font-size: 10px;
						color: rgb(7, 17, 27);
						.stress {
							font-size: 24px;
							font-weight: 200;
							color: rgb(7, 17, 27);
						}
					}
				}
			}
			.favorite {
				position: absolute;
				top: 18px;
				right: 18px;
				width: 40px;
				font-size: 0;
				text-align: center;
				.icon-favorite {
					font-size: 24px;
					color: #d4d6d7;
					&.active {
						color: rgb(240, 20, 20);
					}
				}
				.text {
					font-size: 10px;
					color: rgb(77, 85, 93);
				}
			}
		}
		.bulletin {
			padding: 18px 18px 0 18px;
			font-size: 0;
			.title {
				font-size: 14px;
				color: rgb(7, 17, 27);
				font-weight: 600;
			}
			.text {
				padding: 8px 12px 16px 12px;
				font-size: 12px;
				font-weight: 200;
				color: rgb(240, 20, 20);
				line-height: 24px;
				@include border-bottom-1px(rgba(7, 17, 27, 0.1));
			}
		}
		.supports {
			padding:  0 18px;
			font-size: 0;
			.support {
				padding: 16px 12px;
				@include border-bottom-1px(rgba(7, 17, 27, 0.1));
				&:last-child {
					@include border-1px-none();
				}
				.icon {
					display: inline-block;
					margin-right: 6px;
					width: 16px;
					height: 16px;
					background-size: 16px 16px;
					background-repeat: no-repeat;
					&.decrease {
						@include bg-img ('./decrease_4');
					}
					&.discount {
						@include bg-img ('./discount_4');
					}
					&.guarantee {
						@include bg-img ('./guarantee_4');
					}
					&.invoice {
						@include bg-img ('./invoice_4');
					}
					&.special {
						@include bg-img ('./special_4');
					}															
				}
				.text {
					vertical-align: top;
					line-height: 16px;
					font-size: 12px;
					font-weight: 200;
					color: rgb(7, 17, 27);
				}
			}
		}
		.pics {
			padding: 18px;
			font-size: 0;
			.title {
				font-size: 14px;
				color: rgb(7, 17, 27);
				font-weight: 600;				
			}
			.pics-scroll-wrapper {
				margin-top: 12px;
				overflow: hidden;
				.pics-scroll {
					white-space: nowrap;
					.pic {
						margin-right: 6px;
						display: inline-block;
						width: 120px;
						height: 90px;
						&:last-child {
							margin-right: 0;
						}
					}
				}
			}
		}
		.infos {
			font-size: 0;
			padding: 0 18px;
			.info {
				padding: 16px 12px;
				font-size: 12px;
				font-weight: 200;
				color: rgb(7, 17, 27);
				@include border-bottom-1px(rgba(7, 17, 27, 0.1));
				&:last-child {
					@include border-1px-none();
				}
			}
		}
	}
</style>