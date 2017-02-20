<template>
	<div class='ratings'>
		<div class='scroll-wrapper' ref='scrollWrapper'>
			<div class='scroll'>
				<div class='score'>
					<div class='left'>
						<div class='overall-score'>{{seller.score}}</div>
						<div class='title'>综合评分</div>
						<div class='rank-rate'>高于周边商家{{seller.rankRate}}%</div>
					</div>
					<div class='right'>
						<div class='service-score'>
							<span class='title'>服务态度</span>
							<star class='star' :size='36' :score='seller.serviceScore'></star>
							<span class='number'>{{seller.serviceScore}}</span>
						</div>
						<div class='food-score'>
							<span class='title'>商品评分</span>
							<star class='star' :size='36' :score='seller.foodScore'></star>
							<span class='number'>{{seller.foodScore}}</span>
						</div>	
						<div class='delivery-time'>
							<span class='title'>送达时间</span>
							<span class='time'>{{seller.deliveryTime}}分钟</span>
						</div>											
					</div>
				</div>
				<spilt></spilt>
				<rating-select class='rating-select' :settings='settings' :ratings='ratings'></rating-select>
				<div class='content'>
					<ul>
						<li class='rating' v-for='rating in ratings' v-show='ratingShow(rating)'>  
							<div class='avatar'>
								<img :src='rating.avatar' width='28px' height='28px'>
							</div>
							<div class='wrapper'>
								<div class='user-name'>{{rating.username}}</div>
								<div class='user-score'>
									<star class='star' :size='24' :score='rating.score'></star>
									<span class='deliveryTime' v-show='rating.deliveryTime'>{{rating.deliveryTime}}分钟送达</span>
								</div>
								<div class='text'>{{rating.text}}</div>
								<div class='recommend' v-show='rating.recommend.length'>
									<span class='icon-thumb_up'></span>
									<span class='item' v-for='food in rating.recommend'>{{food}}</span>
								</div>
								<div class='rate-time'>{{rating.rateTime | formatDate}}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import star from 'components/star/star.vue'
	import spilt from 'components/spilt/spilt.vue'
	import ratingSelect from 'components/rating-select/rating-select.vue'
	import BScroll from 'better-scroll'
	import {formatDate} from 'common/js/date.js'
//	const GOOD_RATING = 0
//	const BAD_RATING = 1
	const ALL_RATING = 2
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		components: {
			star,
			spilt,
			ratingSelect
		},
		data () {
			return {
				settings: {
					rateType: ALL_RATING,
					onlyContent: true,
					goodRatingText: '满意',
					badRatingText: '不满意',
					allRatingText: '全部'
				},
				ratings: []
			}
		},
		created () {
			this.$http.get('/api/ratings').then((res) => {
				this.ratings = res.body.data
				this.$nextTick(() => {
					this.scroll = new BScroll(this.$refs.scrollWrapper, {
						click: true
					})
				})
			})
			this.$on('scrollRefresh', () => {
				if (this.scroll) {
					this.$nextTick(() => {
						this.scroll.refresh()
					})
				}
			})
		},
		filters: {
			formatDate (time) {
				let date = new Date(time)
				return formatDate(date, 'yyyy-MM-dd hh:mm')
			}
		},
		methods: {
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
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../common/scss/mixin.scss';
	.ratings {
		position: absolute;
		top: 174px;
		bottom: 0;
		width: 100%;
		overflow: hidden;
		.scroll-wrapper {
			width: 100%;
			height: 100%;
		}
	}
	.scroll {
		.score {
			display: flex;
			padding: 18px 0;
			font-size: 0;
			.left {
				flex: 0 0 137px;
				padding: 6px 0;
				width: 137px;
				text-align: center;
				border-right: solid 1px rgba(7, 17, 27, 0.1);
				@media only screen and (max-width: 366px) {
					flex: 0 0 120px;
					width: 120px;
				}
				.overall-score {
					font-size: 24px;
					color: rgb(255, 153, 0);
				}
				.title {
					margin-top: 6px;
					font-size: 12px;
					color: rgb(7, 17, 27);
				}
				.rank-rate {
					margin-top: 8px;
					font-size: 10px;
					color: rgb(147, 153, 159);
				}
			}
			.right {
				padding: 0 24px;
				@media only screen and (max-width: 366px) {
					padding: 0 6px;
				}
				.service-score, .food-score, .delivery-time{
					line-height: 18px;
					.title {
						margin-right: 6px;
						font-size: 12px;
						color: rgb(7, 17, 27);
					}
				}
				.service-score, .food-score {
					.star {
						margin-right: 6px;
						vertical-align: top;
					}		
					.number {
						font-size: 12px;
						color: rgb(255, 153, 0);
					}
				}
				.delivery-time {
					.time {
						font-size: 12px;
						color: rgb(147, 153, 159);
					}
				}
			}
		}
		.rating-select {
			padding: 18px;
		}
		.content {
			padding: 0 18px;
			font-size: 0;
			.rating {
				display: flex;
				padding: 18px 0;
				@include border-bottom-1px(rgba(7, 17, 27, 0.2));
				&:last-child {
					@include border-1px-none();
				}
				.avatar {
					flex: 0 0 28px;
					margin-right: 12px;
					width: 28px;
					img {
						border-radius: 50%;
					}
				}
				.wrapper {		
					flex: 1;
					position: relative;			
					.user-name {
						padding-left: 1px;
						font-size: 10px;
						color: rgb(7, 17, 27);
					}
					.user-score {
						margin-top: 4px;
						.star {
							vertical-align: top;
							margin-right: 6px;
						}
						.deliveryTime {
							font-size: 10px;
							font-weight: 200;
							color: rgb(147, 153, 159);
						}
					}
					.text {
						margin-top: 6px;
						font-size: 12px;
						line-height: 18px;
						color: rgb(7, 17, 27); 
					}
					.recommend {
						margin-top: 6px;
						.icon-thumb_up {
							margin-right: 8px;
							font-size: 12px;
							color: rgb(0, 160, 220);
						}
						.item {
							display: inline-block;
							margin-right: 8px;
							margin-top: 2px;
							padding: 6px;
							border: solid 1px rgba(7, 17, 27, 0.1);
							font-size: 9px;
							color: rgb(147, 153, 159);
						}
					}
					.rate-time {
						position: absolute;
						right: 0;
						top: 0;
						font-size: 10px;
						font-weight: 200;
						color: rgb(147, 153, 159);
					}
				}
			}
		}
	}
</style>