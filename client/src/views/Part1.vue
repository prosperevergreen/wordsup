<template>
	<div>
		<appInfoBarComp :info="pageInfo[taskLevelCounter]" />
		<div class="mt-12">
			<transition mode="out-in" enter-active-class="animated flipInY">
				<!-- set props Task1: For Eng word->russia options and Task 2 Sound->English options  -->
				<component :is="taskName[taskLevelCounter]" :numQueLeft="numQueLeft" :url="imageUrl" :successRate="rate" :options="taskLevelCounter == 0 ? optionListRu : optionListEng" :task="taskQuestion+1" :ans="taskLevelCounter == 0 ? answer : question" :question="question" @checked="onChecked($event)" @goToNext="onNext()" @goToNextSection="nextTask()" ></component>
			</transition>
		</div>
		<!-- <div class="mt-12">
			<v-btn block :disabled="disable" @click="nextTask()" color="purple darken-4 white--text" x-large>Continue</v-btn>
		</div> -->
	</div>

</template>
<script>
	import appInfoBarComp from "@/components/InfoBar";
	import TransWordsTab from "@/components/WordsTransOptions";
	import SoundWordsTab from "@/components/SoundWordsOption";
	import PicWordsTab from "@/components/PicWordsOption";

	export default {
		components: {
			appInfoBarComp,
			TransWordsTab,
			SoundWordsTab,
			PicWordsTab
		},
		data: () => ({
			pageInfo: [
				"Part 1.1: Find the Translation",
				"Part 1.2: Listen and Match the Sound",
				"Part 1.3: Match the Picture"
			],
			taskName: ["trans-words-tab", "sound-words-tab", "pic-words-tab"],
			wordsPicUrls: [],
			taskLevelCounter: 0,
			taskQuestion: 0,
			optionSize: 4,
			taskOrder: [],
			levelError: [],
			levelSucess: [],
			taskError: 0,
			taskSuccess: 0,
			taskWordsEng: [],
			taskWordsRu: [],
			wordsDetails: [],
			randomWords: { ru: [], eng: [] },
			disable: true,
			wrongQueAnsNum: []
		}),
		methods: {
			//To randomize the task
			shuffle(array) {
				array.sort(() => Math.random() - 0.5);
				return array;
			},
			//word is correct option, size is number of options
			createOptions(word, size, inputList, randList) {
				//join all words to create options
				const allwords = inputList.concat(randList);

				//shuffle the words
				const allOptions = this.shuffle(allwords);
				const options = [];
				options.push(word);
				for (var i = 0; options.length < size; i++) {
					if (allOptions[i] === options[0]) {
						i++;
					} else {
						options.push(allOptions[i]);
					}
				}
				const generatedOptions = this.shuffle(options);
				return generatedOptions;
			},
			//check for correct or wrong answer
			onChecked(value) {
				//on wrong answer
				if (!value) {
					this.wrongQueAnsNum.push(this.taskOrder[this.taskQuestion]);
					this.taskError++;
				} else {
					//on right answer
					this.taskSuccess++;
				}
			},
			onNext() {
				//if there is task do task
				if (this.taskQuestion < this.taskOrder.length - 1) {
					this.taskQuestion++;
				} //if there is no task but there is error set new task
				else if (this.wrongQueAnsNum.length) {
					this.taskOrder = this.taskOrder.concat(this.wrongQueAnsNum);
					this.wrongQueAnsNum = [];
					this.taskQuestion++;
				} //if no task and no errors go to next level and init all values
				else {
					//enable continue button to go to next task section
					this.disable = false;
				}
			},
			nextTask() {
				//save errors and success, reset data, generate new task order and go to next task
				if (this.taskLevelCounter < 2) {
					this.taskLevelCounter++;
					this.levelError.push(this.taskError);
					this.levelSucess.push(this.taskSuccess);
					this.taskError = 0;
					this.taskSuccess = 0;
					this.taskQuestion = 0;
					this.taskOrder = this.generateTaskOrder(this.taskWordsEng);
					//disable continue button
					this.disable = true;
				} else {
					this.levelError.push(this.taskError);
					this.levelSucess.push(this.taskSuccess);

					//recored result
					this.$store.dispatch("setUserResult", {
						wrong: this.levelError,
						correct: this.levelSucess,
						part: 1
					});
					//go to next level
					this.$router.push("/results");
				}
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
				const question = this.taskWordsEng[this.taskOrder[this.taskQuestion]];
				return question;
			},
			//get answer for current question
			answer() {
				const answer = this.taskWordsRu[this.taskOrder[this.taskQuestion]];
				return answer;
			},
			//get image for current question
			imageUrl() {
				const url = this.wordsPicUrls[this.taskOrder[this.taskQuestion]];
				return url;
			},
			//create russian options
			optionListRu() {
				const option = this.createOptions(
					this.taskWordsRu[this.taskOrder[this.taskQuestion]],
					this.optionSize,
					this.taskWordsRu,
					this.randomWords.ru
				);
				return option;
			},
			//create english options
			optionListEng() {
				const option = this.createOptions(
					this.taskWordsEng[this.taskOrder[this.taskQuestion]],
					this.optionSize,
					this.taskWordsEng,
					this.randomWords.eng
				);
				return option;
			},
			//success rate progress bar
			rate() {
				return (this.taskSuccess / this.taskWordsEng.length) * 100;
			},
			//number of task left
			numQueLeft() {
				return this.taskWordsEng.length - this.taskSuccess;
			}
		},
		created() {
			//set voice
			window.speechSynthesis.getVoices();
			new window.SpeechSynthesisUtterance();

			//get data for task
			this.taskWordsEng = this.$store.getters.getWords;
			this.taskWordsDetails = this.$store.getters.getExactWordsDetails;
			this.randomWords = this.$store.getters.getRandomWords;
			this.wordsPicUrls = this.$store.getters.getWordsPicUrls;

			this.taskWordsDetails.forEach(obj => {
				if (obj.translation) {
					this.taskWordsRu.push(obj.translation);
				}
			});
			this.taskOrder = this.generateTaskOrder(this.taskWordsEng);
		}
	};
</script>
<style scoped>
</style>