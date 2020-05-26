<template>
	<div>
		<v-card class="mt-3">
			<v-card-title class="font-weight-normal text-uppercase">
				<div>
					<div class="headline">Part {{part}}</div>
					<div class="font-weight-light">Score: {{Math.ceil(totalRating*20)}}%</div>
					<div>
						<v-rating v-model="totalRating" half-increments readonly background-color="purple" color="purple"></v-rating>
					</div>
					<div class="overline">{{ 3 > totalRating ? 'Keep it up' : 'Excellent'}}</div>
				</div>
			</v-card-title>

			<v-card-actions>
				<div class="font-weight-light ml-3" color="purple">
					More details
				</div>

				<v-spacer></v-spacer>

				<v-btn icon @click="toggleData=!toggleData">
					<v-icon>{{ toggleData ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
				</v-btn>
			</v-card-actions>
			<v-expand-transition>
				<div v-show="toggleData">
					<v-divider></v-divider>
					<v-card-text>
						<div v-for="(rating,index) in subPartRating" :key="index" class="d-flex align-center justify-space-between overline">
							<div>Task {{index+1}}:</div>
							<v-rating v-model="subPartRating[index]" small half-increments readonly background-color="purple" color="purple"></v-rating>
						</div>
					</v-card-text>
					<v-divider></v-divider>
				</div>
			</v-expand-transition>

			<div class="mx-4 my-2">
				<v-btn v-if="part == completed && completed != 3" dark block color="purple darken-4" :to="'/part-'+(part+1)" x-large>Go to Part {{part+1}}</v-btn>
				<div class="mt-2 pl-3 d-flex align-center justify-space-between">
					<span>Repeat?</span>
					<v-btn text color="purple darken-4" :to="'/part-'+part" class="pl-1" x-large>part {{part}}</v-btn>
				</div>
			</div>
		</v-card>
	</div>
</template>
<script>
	export default {
		props: {
			part: Number,
			correct: Array,
            wrong: Array,
            completed:Number
		},
		data: () => ({
			toggleData: false
		}),
		methods: {

        },
		computed: {
			subPartRating() {
				let total = [];
				for (var i = 0; i < 3; i++) {
                    var lvlTotal = this.correct[i] / (this.correct[i] + this.wrong[i]);
                    var inStars = lvlTotal*5
					total.push(inStars);
				}
				return total;
			},
			totalRating() {
				let totalRating = 0;
				for (var i = 0; i < 3; i++) {
					totalRating += this.subPartRating[i];
				}
				return (totalRating / 3);
			}
		},
	};
</script>