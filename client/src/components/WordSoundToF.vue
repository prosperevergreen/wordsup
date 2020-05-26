<template>
	<div>
		<!-- body of task -->
		<v-card outlined class="mb-2">
			<!-- progress bar -->
			<v-progress-linear v-model="successRate" :color="percentageColor"></v-progress-linear>
			<v-card-text>
				<div class="font-weight-light d-flex justify-end mb-4">Question {{queCounter}}</div>
				<!-- form field for displaying question -->
				<v-text-field readonly :error-messages="onErrorMsgEng" label="Word" :success-messages="onCorrectMsgEng" v-model="que" outlined rounded :class="textColor" class="centered-input errorMsgEng"></v-text-field>
				<!-- Button for playing audio -->
				<div v-ripple class="pa-4" @click="playSound(sound)">
					<div class="d-flex justify-center">
						<v-btn :color="btnColor" class="mx-2" fab dark large>
							<v-icon x-large dark>mdi-play</v-icon>
						</v-btn>
					</div>
				</div>
			</v-card-text>
			<v-divider></v-divider>
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
			<v-btn color="purple" large text @click="next()" :disabled="preventNext">Next</v-btn>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			sound: String,
			que: String,
			ans: String,
			successRate: Number,
			numQueLeft: Number,
			queCounter: Number
		},
		data: () => ({
			colorTrue: "",
			colorFalse: "",
			textColor: "",
			btnColor: "cyan",
			preventClick: false,
			preventNext: true,
			onErrorMsgEng: "",
			onCorrectMsgEng: "",
			synth: window.speechSynthesis,
			voiceList: [],
			textSpeech: new window.SpeechSynthesisUtterance()
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
				if (this.sound.toLowerCase() == this.ans.toLowerCase()) {
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
				//send error feedback message
				if (isCorrect) {
					this.onCorrectMsgEng = "Correct";
					this.textColor = "centered-input-correct";
					this.btnColor = "success";
					//test for final question
					if (this.numQueLeft == 1) {
						this.$emit("onNext");
						this.preventNext = true;
					}
				} else {
					this.onErrorMsgEng = "wrong";
					this.textColor = "centered-input-error";
					this.btnColor = "error";
				}
			},
			next() {
				this.$emit("onNext");
				this.reset();
			},
			reset() {
				this.textColor = "";
				this.btnColor = "cyan";
				this.onErrorMsgEng = "";
				this.onCorrectMsgEng = "";
				this.colorTrue = "";
				this.colorFalse = "";
				this.preventClick = false;
				this.preventNext = true;
			},
			playSound(sound) {
				//set statement
				this.textSpeech.text = sound;
				//play statement
				this.synth.speak(this.textSpeech);
			}
		},
		computed: {
			percentageColor() {
				// console.log(this.successRate)
				return this.successRate < 25
					? "error"
					: this.successRate < 50
					? "yellow"
					: this.successRate < 75
					? "blue"
					: "success";
			}
		},
		async created() {
			//get voice
			this.voiceList = this.synth.getVoices();

			//select voice
			let index = this.voiceList.findIndex(
				item => item.name === "Google UK English Male"
			);
			//set voice or alternative voice
			if (!index) {
				this.textSpeech.voice = this.voiceList[0];
			} else {
				this.textSpeech.voice = this.voiceList[index];
			}

			// console.log(index);
		}
	};
</script>
<style scoped>
	.centered-input >>> input {
		text-align: center;
		font-weight: bold;
		font-size: 1.25rem;
		font-family: "Roboto", sans-serif !important;
	}
	.centered-input-error >>> input {
		color: #ff5252;
	}
	.centered-input-correct >>> input {
		color: #4caf50;
	}
	.avoid-clicks {
		pointer-events: none;
	}
	.errorMsgEng >>> .v-messages__message {
		font-size: 15px;
	}
</style>