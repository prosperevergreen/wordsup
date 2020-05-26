<template>
	<div>
		<v-card>
			<v-progress-linear v-model="successRate" :color="percentageColor"></v-progress-linear>
			<v-list-item>
				<v-list-item-content>
					<div class="font-weight-light d-inline">Question {{task}}</div>
					<v-list-item-title class="headline mb-1 text-uppercase text-center">{{question}}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-divider class="mx-4 my-3"></v-divider>
			<v-card-text>
				<v-item-group v-model="selected">
					<v-container>
						<v-row>
							<v-col v-for="(word,index) in options" :key="word + index" cols="6">
								<v-item>
									<v-card :class="index == selected ? activeClass : index == colorCorrectAns ? correctClass : inactiveClass" class="px-1 py-4" style="border-radius: 16px;" @click="check(index)" :disabled="checked">
										<v-scroll-y-transition>
											<div class="body-1 font-weight-regular text-center ">
												{{word}}
											</div>
										</v-scroll-y-transition>
									</v-card>
								</v-item>
							</v-col>
						</v-row>
					</v-container>
				</v-item-group>
			</v-card-text>

			<v-card-actions class="justify-end mr-4">
				<v-btn color="purple" large text @click="next()" :disabled="noClick">Next</v-btn>
			</v-card-actions>
		</v-card>
	</div>

</template>
<script>
	export default {
		props: {
			options: Array,
			question: String,
			ans: String,
			task: Number,
			successRate: Number,
			numQueLeft: Number
		},
		data: () => ({
			activeClass: "deep-purple accent-4 white--text",
			inactiveClass: "grey lighten-2 black--text",
			correctClass: "green lighten-2 black--text",
			wrongClass: "red darken-1 white--text",
			selected: null,
			checked: false,
			noClick: true,
			colorCorrectAns: null
		}),
		methods: {
			check(value) {
				this.selected = value;
				this.noClick = false;
				//set class for correct and incorrect answer
				const rightAns = this.options[this.selected].toLowerCase() == this.ans.toLowerCase();
				if (rightAns) {
					this.activeClass = this.correctClass;
				} else {
					this.colorCorrectAns = this.options.indexOf(this.ans.toLowerCase());
					this.activeClass = this.wrongClass;
				}
				this.$emit("checked", rightAns);
				this.checked = true;
				//check for continue
				if (this.numQueLeft == 1 && rightAns) {
					this.$emit("goToNext");
					this.noClick = true;
				}
			},
			next() {
				//reset quiz
				this.activeClass = "deep-purple accent-4 white--text";
				this.inactiveClass = "grey lighten-2 black--text";
				this.selected = null;
				this.checked = false;
				this.firstClick = true;
				this.noClick = true;
				this.colorCorrectAns = null;
				this.$emit("goToNext");
			},
		},
		computed: {
			percentageColor() {
				return this.successRate < 25
					? "error"
					: this.successRate < 50
					? "yellow"
					: this.successRate < 75
					? "blue"
					: "success";
			}
		}
	};
</script>
<style scoped>
</style>