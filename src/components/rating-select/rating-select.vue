<template>
	<div class='rating-select'>
		<div class='rating-tabs'>
			<span 
				class='tab-item' 
				@click='selectType(2, $event)' 
				:class='{active: settings.rateType=== 2}'
			>
				{{settings.allRatingText + typeCount.allRatingCount}}
			</span>
			<span 
				class='tab-item' 
				@click='selectType(0, $event)' 
				:class='{active: settings.rateType=== 0}'
			>
				{{settings.goodRatingText + typeCount.goodRatingCount}}
			</span>
			<span 
				class='tab-item' 
				@click='selectType(1, $event)' 
				:class='{active: settings.rateType=== 1}'
			>
				{{settings.badRatingText + typeCount.badRatingCount}}
			</span>			
		</div>
		<div class='only-content' @click='toggleOnlyContent($event)'>
			<span class='icon-check_circle' :class='{active: settings.onlyContent}'></span><span class='text'>只看有评价的内容</span>
		</div>		
	</div>
</template>

<script>
	const GOOD_RATING = 0
	const BAD_RATING = 1
	const ALL_RATING = 2
	export default {
		props: {
			settings: {
				type: Object,
				default () {
					return {
						rateType: ALL_RATING,
						onlyContent: false,
						goodRatingText: '满意',
						badRatingText: '不满意',
						allRatingText: '全部'
					}
				}
			},
			ratings: {
				type: Array,
				default () {
					return []
				}
			}
		},
		computed: {
			typeCount () {
				let obj = {
					goodRatingCount: 0,
					badRatingCount: 0,
					allRatingCount: 0
				}
				let ratings = this.ratings
				if (ratings) {
					ratings.forEach((rating) => {
						if (rating.rateType === GOOD_RATING) {
							obj.goodRatingCount++
						} else if (rating.rateType === BAD_RATING) {
							obj.badRatingCount++
						}
					})
					obj.allRatingCount = obj.goodRatingCount + obj.badRatingCount
				}
				return obj
			}
		},
		methods: {
			selectType (type, event) {
				if (!event._constructed) {
					return
				} else {
					this.settings.rateType = type
					this.$parent.$emit('scrollRefresh')
				}
			},
			toggleOnlyContent (event) {
				if (!event._constructed) {
					return
				} else {
					this.settings.onlyContent = !this.settings.onlyContent
					this.$parent.$emit('scrollRefresh')
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../common/scss/mixin.scss';
	.rating-select {
		font-size: 0;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		.rating-tabs {
			padding: 18px 0;
			@include border-bottom-1px(rgba(7, 17, 27, 0.1));
			.tab-item {
				display: inline-block;
				padding: 8px 16px;
				margin-right: 8px;
				border-radius: 2px;
				font-size: 12px;
				color: rgb(77, 85, 93);
				background: rgba(77, 85, 93, 0.1);
				&.active {
					color: #fff;
					background: rgb(0, 160, 220);					
				}
			}
		}
		.only-content {
			padding: 12px 0;
			.icon-check_circle {
				margin-right: 4px;
				font-size: 24px;
				color: rgb(147, 153, 159);
				line-height: 24px;
				&.active {
					color: #00b43c;		
				}
			}
			.text {
				vertical-align: top;
				font-size: 12px;
				color: rgb(147, 153, 159);
				line-height: 24px;				
			}
		}
	}
</style>