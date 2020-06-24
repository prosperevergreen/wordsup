<template>
	<div>
		<v-card>
			<v-progress-linear v-model="successRate" :color="percentageColor"></v-progress-linear>
			<div v-ripple @click="playSound(question)" class="pa-4">
				<div class="font-weight-light d-inline">Question {{task}}</div>
				<div class="d-flex justify-center">
					<v-btn class="mx-2" fab dark large color="cyan">
						<v-icon x-large dark>mdi-play</v-icon>
					</v-btn>
				</div>
			</div>
			<!-- <v-list-item ripple @click="playSound()">
				<v-list-item-content>
					<div class="font-weight-light d-inline">Question {{task}}</div>
					<v-list-item-title class="headline mb-1 text-uppercase text-center">
						<v-icon class="text-accent-4 deep-purple--text" style="font-size:60px" x-large>mdi-play-circle-outline</v-icon>
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item> -->
			<v-divider class="mx-4 mb-3"></v-divider>
			<v-card-text class="pb-1">
				<v-item-group v-model="selected">
					<v-container>
						<v-row>
							<v-col v-for="(word,index) in options" :key="word + index" cols="6">
								<v-item>
									<v-card :class="index == selected ? activeClass : index == colorCorrectAns ? correctClass : inactiveClass" class="px-1 py-4" style="border-radius: 16px;" @click="check(index)" :disabled="checked">
										<v-scroll-y-transition>
											<div class="body-1 font-weight-regular text-center">
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
			<v-divider class="mx-4"></v-divider>
			<v-card-actions class="justify-end mr-4">
				<v-btn color="#673ab7" class="white--text" large @click="next()" :disabled="noClick" v-if="!goToNextSection">Next</v-btn>
				<v-btn color="#673ab7" class="white--text" large @click="$emit('goToNextSection')" v-else>Next</v-btn>
			</v-card-actions>
		</v-card>
		<!-- <v-overlay absolute :value="overlay">
			<v-card color="purple" dark>
				<v-card-text>
					Setting up pronunciation
					<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-overlay> -->
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
			goToNextSection: false,
			selected: null,
			checked: false,
			noClick: true,
			colorCorrectAns: null,
			synth: window.speechSynthesis,
			voiceList: [],
			textSpeech: new window.SpeechSynthesisUtterance(),
			overlay: false
		}),
		methods: {
			check(value) {
				//set class for correct and incorrect answer
				this.selected = value;
				this.noClick = false;
				//set class for correct and incorrect answer
				const rightAns =
					this.options[this.selected].toLowerCase() == this.ans.toLowerCase();
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
					this.goToNextSection = true;
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
			playSound(sound) {
				//set statement
				this.textSpeech.text = sound;
				//play statement
				this.synth.speak(this.textSpeech);
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
		},
		mounted() {
			//get voice
			this.overlay = true
			this.voiceList = this.synth.getVoices();
			let voiceDaniel = "daniel";
			let voiceGUKM = "google uk english male";
			let voiceAlex = "alex";
			let voiceEUK = "english united kingdom";

			// console.log(this.voiceList.length);
			if (this.voiceList.length) {
				// console.log(this.voiceList.length);

				//select voice
				let index = this.voiceList.findIndex(
					item => item.name.toLowerCase() == voiceGUKM
				);

				//select voice
				if (index == -1) {
					index = this.voiceList.findIndex(
						item => item.name.toLowerCase() == voiceDaniel
					);
				}

				//select voice
				if (index == -1) {
					index = this.voiceList.findIndex(
						item => item.name.toLowerCase() == voiceEUK
					);
				}
				//select voice
				if (index == -1) {
					index = this.voiceList.findIndex(
						item => item.name.toLowerCase() == voiceAlex
					);
				}

				// console.log(index);
				//set voice or alternative voice
				if (index == -1) {
					this.textSpeech.voice = this.voiceList[this.voiceList];
				} else {
					this.textSpeech.voice = this.voiceList[index];
				}
				this.overlay = false
			}
		}
	};
</script>
<style scoped>
</style>