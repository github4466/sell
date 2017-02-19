<template>
 	<div class='star' :class='starType'>
 		<span class='star-item' :class='state' v-for='state in states'></span>
 	</div>
</template>

<script>
	const starNum = 5
	const	classOn = 'on'
	const	classOff = 'off'
	const	classHalf = 'half'

	export default {
		props: {
			size: {
				type: Number
			},
			score: {
				type: Number
			}
		},
		computed: {
			starType () {
				return 'star-' + this.size
			},
			states () {
				let result = []
				let score = Math.floor(this.score * 2) / 2
				let hasDecimal = (score % 1 !== 0)
				let inter = Math.floor(score)
				for (let i = 0; i < inter; i++) {
					result.push(classOn)
				}
				if (hasDecimal) {
					result.push(classHalf)
				}
				while (result.length < starNum) {
					result.push(classOff)
				}
				return result
			}
		}
	}
</script>

<style lang='scss' scoped>
	@import '../../common/scss/mixin.scss';
	.star {
		display: inline-block;
		font-size: 0;
		.star-item {
			display: inline-block;
			background-repeat: no-repeat;
		}
		&.star-48 .star-item{
			width: 20px;
			height: 20px;
			margin-right: 22px;
			background-size: 20px 20px;
			&:last-child {
				margin-right: 0;
			}
			&.on {
				@include bg-img('star48_on');
			}
			&.off {
				@include bg-img('star48_off');
			}
			&.half {
				@include bg-img('star48_half');
			}		
		}
		&.star-36 .star-item{
			width: 15px;
			height: 15px;
			margin-right: 6px;
			background-size: 15px 15px;
			&:last-child {
				margin-right: 0;
			}
			&.on {
				@include bg-img('star36_on');
			}
			&.off {
				@include bg-img('star36_off');
			}
			&.half {
				@include bg-img('star36_half');
			}		
		}		
		&.star-24 .star-item{
			width: 10px;
			height: 10px;
			margin-right: 3px;
			background-size: 10px 10px;
			&:last-child {
				margin-right: 0;
			}
			&.on {
				@include bg-img('star24_on');
			}
			&.off {
				@include bg-img('star24_off');
			}
			&.half {
				@include bg-img('star24_half');
			}		
		}		
	}
</style>