<template>
	<div>
		<appInfoBarComp :info="pageInfo[taskLevelCounter]" />
		<div class="mt-12">
			<transition mode="out-in" enter-active-class="animated flipInY">
				<!-- set props Task1: For Eng word->russia options and Task 2 Sound->English options  -->
				<component :is="taskName[taskLevelCounter]" @onNext="nextQue()" @onCheck="checked($event)" :imgUrl="imageUrl" :sound="question" :que="question" :ans="question" :successRate="rate" :queCounter="taskQuestionCounter+1" :numQueLeft="numQueLeft"></component>
			</transition>
		</div>
		<div class="mt-12">
			<v-btn block :disabled="disable" @click="nextTask()" color="purple darken-4 white--text" x-large>Continue</v-btn>
		</div>
	</div>

</template>
<script>
	import appInfoBarComp from "@/components/InfoBar";
	import SoundSpeechTab from "@/components/SoundSpeech";
	import WordSpeechTab from "@/components/WordSpeech";
	import PicSpeechTab from "@/components/PicSpeech";

	export default {
		components: {
			appInfoBarComp,
			SoundSpeechTab,
			WordSpeechTab,
			PicSpeechTab
		},
		data: () => ({
			disable: true,
			pageInfo: [
				"Part 3.1: Play and Speak",
				"Part 3.2: Read and Speak",
				"Part 3.3: See and Speak"
			],
			taskName: ["sound-speech-tab", "word-speech-tab", "pic-speech-tab"],
			wrongQueAnsNum: [],
			originWordsDetails: [],
			randomWords: [],
			taskWordsPicUrls: [],
			taskWordsRu: [],
			taskWordsEng: [],
			taskOrder: [],
			taskQuestionCounter: 0,
			taskLevelCounter: 0,
			levelErrorCounter: [],
			levelSuccessCounter: [],
			taskErrorCounter: 0,
			taskSuccessCounter: 0
		}),
		methods: {
			//check for correct or wrong answer
			checked(value) {
				//on wrong answer
				if (!value) {
					this.wrongQueAnsNum.push(this.taskOrder[this.taskQuestionCounter]);
					this.taskErrorCounter++;
				} else {
					//on right answer
					this.taskSuccessCounter++;
				}
			},
			nextQue() {
				//if there is task do task
				if (this.taskQuestionCounter < this.taskOrder.length - 1) {
					this.taskQuestionCounter++;
				} //if there is no task but there is error set new task
				else if (this.wrongQueAnsNum.length > 0) {
					this.taskOrder = this.taskOrder.concat(this.wrongQueAnsNum);
					this.wrongQueAnsNum = [];
					this.taskQuestionCounter++;
				} //if no task and no errors go to next level and init all values
				else {
					this.disable = false;
				}
			},
			nextTask() {
				//reset data and go to next task section
				//save mistakes
				if (this.taskLevelCounter < 2) {
					this.taskLevelCounter++;
					this.levelErrorCounter.push(this.taskErrorCounter);
					this.levelSuccessCounter.push(this.taskSuccessCounter);
					this.taskErrorCounter = 0;
					this.taskSuccessCounter = 0;
					this.taskQuestionCounter = 0;
					this.e1++;
					this.taskOrder = this.generateTaskOrder(this.taskWordsEng);
					this.disable = true;
				} else {
					this.levelErrorCounter.push(this.taskErrorCounter);
					this.levelSuccessCounter.push(this.taskSuccessCounter);

					//recored result
					this.$store.dispatch("setUserResult", {
						wrong: this.levelErrorCounter,
						correct: this.levelSuccessCounter,
						part: 3
					});
					//go to next level
					this.$router.push("/results");
				}
			},
			//To randomize the task
			shuffle(array) {
				array.sort(() => Math.random() - 0.5);
				return array;
			},
			//word is correct option, size is number of options
			createOptions(word, inputList, randList) {
				//join all words to create options
				const allwords = inputList.concat(randList);
				//shuffle the words
				const allOptions = this.shuffle(allwords);
				const options = [];
				options.push(word);
				//push alternative option
				for (var i = 0; i < allOptions.length; i++) {
					if (allOptions[i] === options[0]) {
						i++;
					} else {
						options.push(allOptions[i]);
						break;
					}
				}
				const generatedOptions = this.shuffle(options);
				return generatedOptions[0];
			},
			generateTaskOrder(list) {
				const order = [];
				for (var i = 0; i < list.length; i++) {
					order.push(i);
				}
				return this.shuffle(order);
			}
		},
		computed: {
			//get current question
			question() {
				const question = this.taskWordsEng[
					this.taskOrder[this.taskQuestionCounter]
				];
				return question;
			},
			//get answer for current question
			answer() {
				const answer = this.taskWordsRu[this.taskOrder[this.taskQuestionCounter]];
				return answer;
			},
			//get image for current question
			imageUrl() {
				const url = this.taskWordsPicUrls[
					this.taskOrder[this.taskQuestionCounter]
				];
				return url;
			},
			//success rate progress bar
			rate() {
				return (this.taskSuccessCounter / this.taskWordsEng.length) * 100;
			},
			//number of task left
			numQueLeft() {
				return this.taskWordsEng.length - this.taskSuccessCounter;
			}
		},
		created() {
			//set voice
			window.speechSynthesis.getVoices();
			new window.SpeechSynthesisUtterance();

			//get data for task
			this.taskWordsEng = this.$store.getters.getWords;
			this.originWordsDetails = this.$store.getters.getExactWordsDetails;
			this.randomWords = this.$store.getters.getRandomWords;

			//Get pics for task
			this.taskWordsPicUrls = this.$store.getters.getWordsPicUrls;

			//extract russian words
			this.originWordsDetails.forEach(obj => {
				if (obj.translation) {
					this.taskWordsRu.push(obj.translation);
				}
			});
			//shuffle and set task order
			this.taskOrder = this.generateTaskOrder(this.taskWordsEng);
		}
	};
</script>