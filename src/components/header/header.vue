<template>
	<div class='header'>
		<div class='content-wrapper'>
			<img class='avatar' :src='seller.avatar'></img>
			<div class='content'>
				<div class='title'>
					<span class='brand'></span>
					<span class='name'>{{seller.name}}</span>
				</div>
				<div class='description'>
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<div v-if='seller.supports' class='supports'>
					<span class='icon' :class='classMap[seller.supports[0].type]'></span>
					<span class='text'>{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div class='support-count' v-if='seller.supports' @click='showDetail'>
				<span class='count'>{{seller.supports.length}}个</span>
				<span class='icon-keyboard_arrow_right'></span>
			</div>
		</div>
		<div class='bulletin v-middle' @click='showDetail'>
			<span class="bulletin-icon"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<span class='icon-keyboard_arrow_right'></span>
		</div>
		<div class='background'>
			<img :src='seller.avatar' width='100%' height='100%'>
		</div>	
		<transition name='fade'>
			<div class='detail' v-if='isShowDetail'>
				<div class='detail-wrapper'>
					<div class='detail-main'>
						<h1 class='name'>{{seller.name}}</h1>
						<div class='star-wrapper'>
							<star :size='48' :score='seller.score'></star>
						</div>			
						<div class='title'>
							<div class='line'></div>
							<div class='text'>优惠信息</div>
							<div class='line'></div>
						</div>
						<ul class='supports' v-if='seller.supports'>
							<li class='support-item' v-for='support in seller.supports'>
								<span class='icon' :class='classMap[support.type]'></span>
								<span class='text'>{{support.description}}</span>
							</li>
						</ul>	
						<div class='title'>
							<div class='line'></div>
							<div class='text'>商家公告</div>
							<div class='line'></div>
						</div>	
						<div class='detail-bulletin'>
							<p class='content'>{{seller.bulletin}}</p>
						</div>															
					</div>
				</div>
				<div class='detail-close' @click='closeDetail'>
					<span class='icon-close'></span>
				</div>
			</div>	
		</transition>
	</div>
</template>

<script>
	import star from '../star/star.vue'
	export default {
		data () {
			return {
				classMap: ['decrease', 'discount', 'guarantee', 'invoice', 'special'],
				isShowDetail: false
			}
		},
		props: {
			seller: {
				type: Object
			}
		},
		methods: {
			showDetail () {
				this.isShowDetail = true
			},
			closeDetail () {
				this.isShowDetail = false
			}
		},
		components: {
			star
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../common/scss/mixin.scss';
	.header {
		background: rgba(7, 17, 27, 0.5);
		position: relative;
		overflow: hidden;
	}
	.content-wrapper {
		position: relative;
		padding: 24px 12px 18px 24px;
		color: #fff;
		font-size: 0;
		.avatar {
			width: 64px;
			height: 64px;
			border-radius: 2px;
		}
		.content {
			display: inline-block;
			vertical-align: top;
			margin-left: 16px;
			.title {
				margin-top: 2px;
				.brand {
					display: inline-block;
					margin-right: 6px;
					width: 30px;
					height: 18px;
					@include bg-img ('./brand');
					background-size: 30px 18px;
					background-repeat: no-repeat;
				}
				.name {
					vertical-align: top;
					font-size: 16px;
					font-weight: bold;
					line-height: 18px;
				}
			}
			.description {
				margin-top: 8px;
				font-size: 12px;
				font-weight: 200;
			}
			.supports {
				margin-top: 10px;
				.icon {
					display: inline-block;
					margin-right: 4px;
					width: 12px;
					height: 12px;
					background-size: 12px 12px;
					background-repeat: no-repeat;
					&.decrease {
						@include bg-img ('./decrease_1');
					}
					&.discount {
						@include bg-img ('./discount_1');
					}
					&.guarantee {
						@include bg-img ('./guarantee_1');
					}
					&.invoice {
						@include bg-img ('./invoice_1');
					}
					&.special {
						@include bg-img ('./special_1');
					}															
				}
				.text {
					vertical-align: top;
					font-size: 10px;
					font-weight: 200;					
				}
			}
		}
		.support-count {
			position: absolute;
			padding: 7px 8px;
			right: 12px;
			bottom: 18px;
			height: 24px;
			line-height: 24px;
			background: rgba(7, 17, 27, 0.2);
			font-size: 10px;
			font-weight: 200;
			border-radius: 18px;
			.icon-keyboard_arrow_right {
				margin-left: 2px;
			}			
		}
	}
	.bulletin {
		height: 28px;
		padding: 0 22px 0 12px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;	
		color: #fff;		
		background: rgba(7, 17, 27, 0.2);
		.bulletin-icon {
			display: inline-block;
			vertical-align: middle;
			width: 22px;
			height: 12px;
			background-size: 22px 12px;
			background-repeat: no-repeat;
			@include bg-img ('./bulletin');
		}
		.bulletin-text {
			font-size: 10px;
			padding: 0 4px;
		}
		.icon-keyboard_arrow_right {
			position: absolute;
			right: 12px;
			font-size: 10px; 
			line-height: 28px;
		}
	}
	.background {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: -1;
		filter: blur(10px);
	}
	.detail {
		position: fixed;
		z-index: 100;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background: rgba(7, 17, 27, 0.8);
		&.fade-enter-active, &.fade-leave-active {
			transition: all 0.5s;
		}
		&.fade-enter, &.fade-leave-active {
			opacity: 0;
			background: rgba(7, 17, 27, 0);
		}		
		.detail-wrapper {
			min-height: 100%;
			.detail-main {
				padding-top: 64px;
				padding-bottom: 64px;
				color: #fff;
				.name {
					text-align: center;
					font-size: 16px;
					font-weight: 700;
				}
				.star-wrapper {
					margin-top: 16px;
					text-align: center;
				}
				.title {
					display: flex;
					width: 80%;
					margin: 28px auto 0 auto;
					.line {
						flex: 1;
						height: 0;
						align-self: center;
						border-bottom: 1px solid rgba(255, 255, 255, 0.2);

					}
					.text {
						padding: 0 12px;
						font-size: 14px;
						font-weight: 700;
						line-height: 14px;
					}
				}
				.supports {
					width: 80%;
					margin: 24px auto 0 auto;
					font-size: 0;
					.support-item {
						padding: 0 12px;
						margin-bottom: 12px;
						&:last-child {
							margin-bottom: 0;
						}
						.icon {
							display: inline-block;
							margin-right: 6px;
							width: 16px;
							height: 16px;
							background-size: 16px 16px;
							background-repeat: no-repeat; 
							&.decrease {
								@include bg-img ('./decrease_2');
							}
							&.discount {
								@include bg-img ('./discount_2');
							}
							&.guarantee {
								@include bg-img ('./guarantee_2');
							}
							&.invoice {
								@include bg-img ('./invoice_2');
							}
							&.special {
								@include bg-img ('./special_2');
							}				
						}
						.text {
							font-size: 12px;
							font-weight: 200;
							line-height: 16px;
							vertical-align: top;
						}
					}
				}
				.detail-bulletin {
					width: 80%;
					margin: 24px auto 0 auto;
					.content {
						padding: 0 12px;
						font-size: 12px;
						font-weight: 200;
						line-height: 24px;
					}
				}
			}
		}
		.detail-close {
			width: 32px;
			height: 32px;
			margin: -64px auto 0 auto;
			font-size: 32px;
			color: #fff;
		}
	}
</style>