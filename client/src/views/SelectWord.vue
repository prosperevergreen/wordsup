<template>
	<div>
		<appInfoBarComp :info="wordsInfo" />
		<div class="mt-10">
			<v-card>
				<v-card-title class="title font-weight-regular justify-space-between">
					<span class="headline text-uppercase">{{ header }}</span>
					<v-avatar color="#673ab7" class="subheading white--text" size="24" v-text="step"></v-avatar>
				</v-card-title>
				<v-divider></v-divider>

				<v-window v-model="step">
					<template v-for="(word, index) in wordDetails.slice(0, -1)">
						<v-window-item :value="word[word.length-1]" v-if="word.length > 1" :key="index">
							<v-card-text class="pa-1">
								<v-list>
									<v-list-item-group mandatory v-model="selected[index]" color="#673ab7">
										<v-list-item two-line v-for="(item, i) in word.slice(0, -1)" :key="i">
											<v-list-item-content>
												<v-list-item-title>As {{item.pos}} - {{item.text}}</v-list-item-title>
												<v-list-item-subtitle>{{item.translation}}</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-list-item-group>
								</v-list>
							</v-card-text>
						</v-window-item>
					</template>
				</v-window>

				<v-divider></v-divider>

				<v-card-actions>
					<v-btn :disabled="step === 1" text color="#673ab7" @click="step--">
						Back
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn v-if="!disableNext" class="white--text" color="#673ab7" @click="step++">Next</v-btn>
					<v-btn v-else class="white--text" color="#673ab7" @click="canGoNext()">Next</v-btn>
				</v-card-actions>
			</v-card>
		</div>
		<!-- <v-row class="mt-12">
			<v-col cols="12">
				<div>
					<v-btn block outlined color="purple darken-4" x-large @click="$router.go(-1)">Back</v-btn>
				</div>
			</v-col>
			<v-col cols="6">
				<div>
					<v-btn block :disabled="!disableNext" color="purple darken-4 white--text" x-large @click="canGoNext()">Next</v-btn>
				</div>
			</v-col>
		</v-row> -->
	</div>
</template>
<script>
	import appInfoBarComp from "@/components/InfoBar";

	export default {
		components: {
			appInfoBarComp
		},
		data: () => ({
			wordsInfo: "Do you mean?",
			index: "",
			multiOption: [],
			value: 1,
			step: 1,
			selected: [],
			wordInputs: [],
			wordDetails: []
		}),
		computed: {
			disableNext() {
				return this.step === this.wordDetails[this.wordDetails.length - 1].length;
			},
			input() {
				return this.$store.getters.getWordDetails;
			},
			header() {
				return this.wordInputs[
					this.wordDetails[this.wordDetails.length - 1][this.step - 1]
				];
			}
		},
		methods: {
			canGoNext() {
				var selectedList = this.wordDetails.slice(0);
				for (let i = 0; i < this.wordDetails.length; i++) {
					if (this.selected[i] != null) {
						selectedList[i] = this.wordDetails[i][this.selected[i]];
					}
				}
				this.$store.commit("setExactWordsDetails", selectedList);
				this.$router.push("/define-word");
			}
		},
		beforeMount() {
			this.wordDetails = this.$store.getters.getWordDetails;
			this.wordInputs = this.$store.getters.getWords;
			if (!this.wordInputs) {
				this.$router.go(-1);
			}
		},
		beforeUpdate() {
			this.wordDetails = this.$store.getters.getWordDetails;
			this.wordInputs = this.$store.getters.getWords;
			if (!this.wordInputs) {
				this.$router.go(-1);
			}
		},
		
	};
</script>