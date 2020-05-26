<template>
	<div>
		<appInfoBarComp :info="pageInfo[taskLevelCounter]" />

		<v-stepper v-model="e1">
			<v-stepper-header>
				<v-stepper-step color="purple darken-1" :complete="e1 > 1" step="1">Word to Sound</v-stepper-step>

				<v-divider></v-divider>

				<v-stepper-step color="purple darken-1" :complete="e1 > 2" step="2">Word to Translate</v-stepper-step>

				<v-divider></v-divider>

				<v-stepper-step color="purple darken-1" step="3">Word to Picture</v-stepper-step>
			</v-stepper-header>

			<v-stepper-items>
				<v-stepper-content step="1" style="padding-bottom: 10px;">
					<word-sound-task v-if="e1 == 1" :sound="optionListEng" :que="question" :ans="question" :queCounter="taskQuestionCounter+1" :numQueLeft="numQueLeft" :successRate="rate" @onCheck="checked($event)" @onNext="nextQue()" />
				</v-stepper-content>

				<v-stepper-content step="2" style="padding-bottom: 10px;">
					<word-trans-task v-if="e1 == 2" :trans="optionListRu" :que="question" :ans="answer" :queCounter="taskQuestionCounter+1" :numQueLeft="numQueLeft" :successRate="rate" @onCheck="checked($event)" @onNext="nextQue()" />
				</v-stepper-content>

				<v-stepper-content step="3" style="padding-bottom: 10px;">
					<word-pic-task v-if="e1 == 3" :imageUrl="optionListImgUrl" :que="question" :ans="imageUrl" :queCounter="taskQuestionCounter+1" :numQueLeft="numQueLeft" :successRate="rate" @onCheck="checked($event)" @onNext="nextQue()" />
				</v-stepper-content>
			</v-stepper-items>
		</v-stepper>
		<div class="mt-12">
			<v-btn block :disabled="disable" @click="nextTask()" color="purple darken-4 white--text" x-large>Continue</v-btn>
		</div>
	</div>
</template>
<script>
	import appInfoBarComp from "@/components/InfoBar";
	import WordSoundTask from "@/components/WordSoundToF";
	import WordTransTask from "@/components/WordTransToF";
	import WordPicTask from "@/components/WordPicToF";

	export default {
		components: {
			appInfoBarComp,
			WordSoundTask,
			WordTransTask,
			WordPicTask
		},
		data: () => ({
			e1: 1,
			pageInfo: [
				"Part 2.1: is it a match?",
				"Part 2.2: is it a match?",
				"Part 2.3: is it a match?"
			],
			disable: true,
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
			},

			//check for correct or wrong answer
			checked(isCorrect) {
				//on wrong answer
				if (!isCorrect) {
					// console.log("wrong answer")
					this.wrongQueAnsNum.push(this.taskOrder[this.taskQuestionCounter]);
					this.taskErrorCounter++;
				} else {
					// console.log("correct answer")
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
						part: 2
					});
					//go to next level
					this.$router.push("/results");
				}
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
			//create russian options
			optionListRu() {
				const option = this.createOptions(
					this.taskWordsRu[this.taskOrder[this.taskQuestionCounter]],
					this.taskWordsRu,
					this.randomWords.ru
				);
				// console.log(this.taskWordsRu);
				// console.log("opt-ru: " + option);
				return option;
			},
			//create english options
			optionListEng() {
				const option = this.createOptions(
					this.taskWordsEng[this.taskOrder[this.taskQuestionCounter]],
					this.taskWordsEng,
					this.randomWords.eng
				);
				// console.log("opt-eng: " + option);
				return option;
			},
			optionListImgUrl() {
				const option = this.createOptions(
					this.taskWordsPicUrls[this.taskOrder[this.taskQuestionCounter]],
					this.taskWordsPicUrls,
					this.randomWords.img
				);
				// console.log("opt-eng: " + option);
				return option;
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