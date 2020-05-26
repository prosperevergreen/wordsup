<template>
	<div>
		<appInfoBarComp :info="englishLvlInfo" />
		<div class="mt-12">
			<v-row>
				<v-col cols="12" align="center" v-for="(lvl,index) in level" :key="index">
					<div class="my-2">
						<v-btn block color="purple darken-4" dark x-large @click="clicked(lvl)">{{lvl}}</v-btn>
					</div>
				</v-col>
				<v-col cols="12" align="center">
					<div class="mt-12">
						<v-btn block outlined color="purple darken-4" dark x-large @click="$router.go(-1)">Back</v-btn>
					</div>
				</v-col>
			</v-row>
		</div>
	</div>
</template>

<script>
	import appInfoBarComp from "@/components/InfoBar";

	export default {
		components: {
			appInfoBarComp
		},
		data: () => ({
			englishLvl: "",
			level: ["Beginner", "Intermediate", "Advanced"],
			englishLvlInfo: "Please select your English level"
		}),
		methods: {
			clicked(value) {
				this.englishLvl = value;
				this.$store.commit("setLevel", value );
				this.$router.push("/memory-level");
			}
		}
	};
</script>