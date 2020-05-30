<template>
	<div>
		<v-card outlined class="mb-2">
			<v-progress-linear v-model="successRate" :color="percentageColor"></v-progress-linear>
			<v-card-text class="text-above-image">
				<div class="font-weight-light mb-4 text-end">Question {{queCounter}}</div>
				<v-text-field readonly :error-messages="onErrorMsgEng" label="Word" :success-messages="onCorrectMsgEng" v-model="que" outlined :class="textColor" class="centered-input-pic errorMsgEng"></v-text-field>
				
			</v-card-text>
			<v-img :src="imageUrl" height="194"></v-img>
			<v-divider class="mt-2"></v-divider>
			<!-- True or false buttons for decision maker -->
			<v-card-actions class="d-flex mx-2 mb-2">
				<v-btn large :class="preventClick ? 'avoid-clicks' : ''" @click="check(1)" :color="colorTrue">
					TRUE
				</v-btn>
				<v-spacer></v-spacer>
				<v-btn large :class="preventClick ? 'avoid-clicks' : ''" @click="check(2)" :color="colorFalse">
					FALSE
				</v-btn>
			</v-card-actions>
		</v-card>
		<div class="d-flex justify-end">
			<!-- prevent checking when nothing is clicked or last qyestion in task -->
			<!-- <v-btn color="purple" large text @click="next()" :disabled="preventNext">Next</v-btn> -->
			<v-btn color="#673ab7" class="white--text" large @click="next()" :disabled="preventNext" v-if="!goToNextSection">Next</v-btn>
			<v-btn color="#673ab7" class="white--text" large @click="$emit('goToNextSection')" v-else>Next</v-btn>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			imageUrl: String,
			que: String,
			ans: String,
			successRate: Number,
			numQueLeft: Number,
			queCounter: Number
		},
		data: () => ({
			colorTrue: "",
			colorFalse: "",
			textColor: "centered-input-default",
			btnColor: "purple",
			goToNextSection: false,
			preventClick: false,
			preventNext: true,
			onErrorMsgEng: "",
			onCorrectMsgEng: ""
		}),
		methods: {
			check(choice) {
				let isCorrect = false;
				//prevent clicking of options
				this.preventClick = true;

				//color chosen btn
				if (choice == 1) {
					this.colorTrue = "success";
				} else {
					this.colorFalse = "error";
				}

				//check for correct answer
				if (this.imageUrl.toLowerCase() == this.ans.toLowerCase()) {
					if (choice == 1) {
						isCorrect = true;
					} else {
						isCorrect = false;
					}
				} else {
					if (choice == 2) {
						isCorrect = true;
					} else {
						isCorrect = false;
					}
				}

				//send check result
				this.$emit("onCheck", isCorrect);
				this.preventNext = false;

				//send feedback message for correct answer
				if (isCorrect) {
					this.onCorrectMsgEng = "Correct";
					this.textColor = "centered-input-correct";
					this.btnColor = "success";
					//test for final question
					if (this.numQueLeft == 1) {
						this.$emit("onNext");
						this.preventNext = true;
						this.goToNextSection = true
					}
				} else {
					//send feedback message for wrong answer
					this.onErrorMsgEng = "Wrong";
					this.textColor = "centered-input-error";
					this.btnColor = "error";
				}
			},
			next() {
				//going to next
				this.$emit("onNext");
				this.reset();
			},
			reset() {
				this.preventNext = true;
				this.preventClick = false;
				this.checked = false;
				this.textColor = "centered-input-default";
				this.btnColor = "purple";
				this.choice = 0;
				this.onErrorMsgEng = "";
				this.onCorrectMsgEng = "";
				this.colorTrue = "";
				this.colorFalse = "";
			}
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
	.centered-input-pic >>> input {
		text-align: center;
		font-weight: bold;
		font-size: 1.25rem;
	}
	.centered-input-default >>> input {
		color: #9c27b0;
	}
	.centered-input-error >>> input {
		color: #ff5252;
	}
	.centered-input-correct >>> input {
		color: #4caf50;
	}
	.errorMsgEng >>> .v-messages__message {
		font-size: 15px;
	}
	.avoid-clicks {
		pointer-events: none;
		color: rgba(0,0,0,0.4) !important;
	}
	.text-above-image.v-card__text {
		padding-bottom: 0px;
	}
</style>