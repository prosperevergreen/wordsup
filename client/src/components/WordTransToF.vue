<template>
	<div>
		<v-card outlined class="mb-2">
			<v-progress-linear v-model="successRate" :color="percentageColor"></v-progress-linear>
			<v-card-text>
				<div class="font-weight-light d-flex justify-end mb-4">Question {{queCounter}}</div>
				<v-text-field readonly :error-messages="onErrorMsgEng" label="Word" :success-messages="onCorrectMsgEng" v-model="que" outlined rounded :class="textColor" class="centered-input-trans"></v-text-field>
				<v-text-field readonly :error-messages="onErrorMsgRu" label="Translate" :success-messages="onCorrectMsgRu" v-model="trans" outlined rounded :class="textColor" class="centered-input-trans errorMsg"></v-text-field>
			</v-card-text>
			<v-divider></v-divider>
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
			<!-- <v-btn v-if="!checked" color="purple" large text @click="check()" :disabled="choice == 0 || preventNext">Check</v-btn> -->
			<!-- <v-btn color="purple" large text @click="next()" :disabled="preventNext">Next</v-btn> -->
			<v-btn color="#673ab7" class="white--text" large @click="next()" :disabled="preventNext" v-if="!goToNextSection">Next</v-btn>
			<v-btn color="#673ab7" class="white--text" large @click="$emit('goToNextSection')" v-else>Next</v-btn>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			que: String,
			ans: String,
			trans: String,
			successRate: Number,
			numQueLeft: Number,
			queCounter: Number
		},
		data: () => ({
			colorTrue: "",
			colorFalse: "",
			textColor: "centered-input-default",
			preventClick: false,
			preventNext: true,
			goToNextSection: false,
			onCorrectMsgEng: "",
			onCorrectMsgRu: "",
			onErrorMsgEng: "",
			onErrorMsgRu: ""
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
				if (this.trans.toLowerCase() == this.ans.toLowerCase()) {
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

				//send checked result
				this.$emit("onCheck", isCorrect);
				this.preventNext = false;

				//show correct answer feedback message
				if (isCorrect) {
					this.onCorrectMsgEng = " ";
					this.onCorrectMsgRu = "Correct";
					this.textColor = "centered-input-correct";
					//test for final question
					if (this.numQueLeft == 1) {
						this.$emit("onNext");
						this.preventNext = true;
						this.goToNextSection = true
					}
				} else {
					//show wrong answer feedback message
					this.onErrorMsgEng = " ";
					this.onErrorMsgRu = this.que + " - " + this.ans;
					this.textColor = "centered-input-error";
				}
			},
			next() {
				//go to next
				this.$emit("onNext");
				this.reset();
			},
			reset() {
				this.textColor = "centered-input-default";
				this.onCorrectMsgEng = "";
				this.onCorrectMsgRu = "";
				this.onErrorMsgEng = "";
				this.onErrorMsgRu = "";
				this.colorTrue = "";
				this.colorFalse = "";
				this.preventClick = false;
				this.preventNext = true;
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
	.centered-input-trans >>> input {
		text-align: center;
		font-size: 1.25rem;
		/* font-weight: bold; */
	}
	.centered-input-error >>> input {
		color: #ff5252;
	}
	.centered-input-correct >>> input {
		color: #4caf50;
	}
	.errorMsg >>> .v-messages__message {
		font-size: 15px;
	}
	.avoid-clicks {
		pointer-events: none;
		color: rgba(0,0,0,0.4) !important;
	}
</style>