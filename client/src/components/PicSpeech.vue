<template>
	<div>
		<v-card>
			<v-progress-linear v-model="successRate" :color="percentageColor"></v-progress-linear>
			<v-img class="white--text align-end" height="200px" :src="imgUrl">
			</v-img>
			<v-card-text class="pt-2">
				<div class="font-weight-light mb-4 text-end">Question {{queCounter}}</div>

				<div class="overline mb-4">Speech to text</div>
				<v-alert color="black" :class="feedbackColor+'--text'" outlined dark icon="mdi-text-to-speech" border="left" prominent>
					{{displayMsg}}
				</v-alert>
				<div class="d-flex justify-center py-4">
					<v-btn class="mx-2 white--text " v-if="canSpeak" :class="disableSpeech ? 'avoid-clicks' : ''" @click="startSpeech()" fab large :color="feedbackColor">
						<v-icon x-large dark>mdi-microphone</v-icon>
					</v-btn>
					<v-btn class="mx-2 white--text avoid-clicks" v-else fab large color="purple">
						<v-icon x-large dark>mdi-pause</v-icon>
					</v-btn>
				</div>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions class="d-flex justify-end">
				<!-- <v-btn @click="check()" class="mx-2" v-if="!checked" :disabled="preventCheck" text large color="purple">Check</v-btn> -->
				<v-btn @click="next()" class="mx-2" :disabled="preventCheck" text large color="purple">Next</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
	export default {
		props: {
			imgUrl: String,
			ans: String,
			numQueLeft: Number,
			queCounter: Number,
			successRate: Number
		},
		data: () => ({
			recognition: null,
			feedbackColor: "purple",
			checked: false,
			preventCheck: true,
			userInput: "",
			canSpeak: true,
			disableSpeech: false,
			displayMsg: "Click the microphone to record"
		}),
		methods: {
			check() {
				//display user input
				this.displayMsg = "Speech: " + this.userInput;

				//prevent user to record
				this.disableSpeech = true;

				//set correct answered else wrong answer
				let isCorrect = this.userInput == this.ans.toLowerCase();

				//send checked result
				this.$emit("onCheck", isCorrect);

				if (isCorrect) {
					//correctly answered design
					this.feedbackColor = "success";
					//And last question enable go to next
					if (this.numQueLeft == 1) {
						this.$emit("onNext");
						this.preventCheck = true;
					}
				} else {
					//wrongly answered
					this.feedbackColor = "error";
				}
			},
			next() {
				this.$emit("onNext");
				this.disableSpeech = false;
				this.preventCheck = true;
				this.feedbackColor = "purple";
				this.displayMsg = "Click the microphone to record";
			},
			startSpeech() {
				this.canSpeak = false;
				this.preventCheck = true;

				/* eslint-disable no-use-before-define */
				/* eslint-disable no-undef */

				// check for Recognition functionality
				let SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
				let SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
				let SpeechRecognitionEvent =
					SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

				if (SpeechRecognition) {
					this.feedbackColor = "purple"
					// create instance for speech
					let recognition = new SpeechRecognition();
					let speechRecognitionList = new SpeechGrammarList();

					// set the configurations for received speech
					recognition.grammars = speechRecognitionList;

					//set language
					recognition.lang = "en-US";

					//prevent interim result
					recognition.interimResults = false;

					//set alternative
					recognition.maxAlternatives = 1;

					//prevent interuption
					let that = this;
					this.displayMsg = "Recognition started....";

					//start listening
					recognition.start();

					//on speech ended
					recognition.onspeechend = function(event) {
						setTimeout(function() {
							if ((that.userInput == "")) {
								that.displayMsg = "No result found try again....";
							}
						}, 4000);
						recognition.stop();
						that.canSpeak = true;
					};

					//get result
					recognition.onresult = function(event) {
						let speechResult = event.results[0][0].transcript.toLowerCase(); //get speech text
						that.userInput = speechResult; //save text
						that.canSpeak = true;
						that.preventCheck = false;
						that.check();
					};

					//No match
					recognition.onnomatch = function(event) {
						that.displayMsg = "No result found try again....";
						recognition.stop();
						that.canSpeak = true;
					};

					//on speech error
					recognition.onerror = function(event) {
						that.displayMsg = "Something went wrong try again....";
						that.feedbackColor = "error";
						recognition.stop();
						that.canSpeak = true;
						// console.log(event.error);
						alert("Something went wrong");
					};
				} else {
					this.$router.push("/users-words");
					alert("Please use a chrome or firefox browser");
				}
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
