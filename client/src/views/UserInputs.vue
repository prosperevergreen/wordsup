<template>
	<div>
		<appInfoBarComp :info="wordsInfo" />

		<div class="mt-12">
			<v-form ref="form" v-on:submit.prevent="valid ? canGoNext() : ''" v-model="valid">
				<v-row>
					<v-col cols="12" align="center" v-for="(word,index) in words" :key=index>
						<div>
							<v-text-field color="purple" v-model="words[index]" required :rules="rulesArray[index]" @focus="resetExistsValid(index)" :label="'word: ' + (index+1)" clearable outlined :append-icon="canDelete()?'mdi-delete' : ''" @click:append="deleteInput(index)"></v-text-field>
						</div>
					</v-col>
					<v-col cols="12" class="d-flex justify-center" style="height: 30px; position: relative">
						<v-btn @click="addInput()" absolute dark fab top color="purple darken-4" v-show="canAdd()">
							<v-icon>mdi-plus</v-icon>
						</v-btn>
					</v-col>
					<v-col cols="12">
						<v-btn block :disabled="!valid" color="purple darken-4 white--text" x-large @click="canGoNext()">Next</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</div>

		<v-overlay absolute :value="overlay">
			<v-card color="purple" dark>
				<v-card-text>
					Validating words
					<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-overlay>
	</div>
</template>

<script>
	import appInfoBarComp from "@/components/InfoBar";

	export default {
		components: {
			appInfoBarComp
		},
		data: () => ({
			rulesArray: [[value => !!value || "Required."]],
			valid: false,
			words: [""],
			wordsInfo: "Enter the English words or phrases you'll like to learn.",
			overlay: false
		}),
		methods: {
			deleteInput(value) {
				if (this.canDelete()) {
					this.words.splice(value, 1);
					this.rulesArray.splice(value, 1);
				} else {
					this.words.splice(value, 1, "");
				}
			},
			addInput() {
				if (this.canAdd()) {
					this.words.push("");
					this.rulesArray.push([value => !!value || "Required."]);
				}
			},
			canAdd() {
				return this.words.length < 7;
			},
			canDelete() {
				return this.words.length > 1;
			},
			//for going to the next page
			async canGoNext() {
				if (this.$refs.form.validate()) {
					this.overlay = true;
					let existArr = await this.setExist();
					this.overlay = false;
					if (this.$refs.form.validate()) {
						let wordList = this.words.map(word => {
							return word.toLowerCase();
						});
						this.$store.commit("setWords", wordList);
						var count = 0;
						var hasMultiDef = false;
						var multiDefArrayIndex = [];
						const newDataSet = [];
						for (var i = 0; i < existArr.length; i++) {
							const filteredData = [];
							for (var x = 0; x < existArr[i].length; x++) {
								filteredData.push({
									text: existArr[i][x].text,
									pos: existArr[i][x].pos,
									transcript: existArr[i][x].ts,
									translation: existArr[i][x].tr[0].text,
									examples: existArr[i][x].tr[0].ex,
									forms: existArr[i][x].fl
								});
							}
							//Put the set of possible results into an array
							if (filteredData.length > 1) {
								newDataSet.push(filteredData);
								hasMultiDef = true;
								newDataSet[i].push(++count);
								multiDefArrayIndex.push(i);
							} else {
								newDataSet.push(filteredData[0]);
							}
						}
						if (hasMultiDef) {
							newDataSet.push(multiDefArrayIndex);
							this.$store.commit("setWordDetails", newDataSet);
							this.$router.push("/select-word");
						} else {
							this.$store.commit("setExactWordsDetails", newDataSet);
							this.$router.push("/define-word");
						}
					}
				}
			},
			//gets words from dictionary
			async getExist(word) {
				// return this.$http
				return this.$http
					.get("api//yandex-dic/en-ru/" + word)
					.then(res => {
						if (!res.data.error) {
							return {
								error: res.data.error,
								data: res.data.data
							};
						} else {
							return {
								error: res.data.error,
								data: "Network problem or word/phrase doesn't exist"
							};
						}
					})
					.catch(err => {
						return { error: true, data: "Network problem: cannot verify word" };
					});
			},
			//checks if input is a real word
			async setExist() {
				// let existsArr = [];
				// for (var i = 0, len = this.words.length; i < len; i++) {
				// 	let wordExists = await this.getExist(this.words[i]);
				// 	if (wordExists.error) {
				// 		this.rulesArray[i].push(wordExists.data);
				// 	}
				// 	existsArr.push(wordExists.data);
				// }

				let wordExists = [];
				for (var i = 0; i < this.words.length; i++) {
					wordExists.push(this.getExist(this.words[i]));
				}
				let existsArr = await Promise.all(wordExists)
				let resultData = []
				for (i = 0; i < existsArr.length; i++) {
					if (existsArr[i].error) {
						this.rulesArray[i].push(existsArr[i].data);
					}else{
						resultData.push(existsArr[i].data)
					}
				}
				// console.log(existsArr);
				return resultData;
			},
			resetExistsValid(index) {
				if (this.rulesArray[index].length > 1) {
					this.rulesArray[index].pop();
				}
			}
		}
	};
</script>