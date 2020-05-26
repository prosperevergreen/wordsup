<template>
	<div>
		<appInfoBarComp :info="memLvlInfo"/>
		<div class="mt-12">
			<v-row>
				<v-col class="my-2" cols="12" align="center" v-for="(lvl,index) in level" :key="index">
					<div >
						<v-btn block color="purple darken-4" dark x-large @click="clicked(lvl)">{{lvl}}</v-btn>
					</div>
				</v-col>
				<v-col class="mt-12" cols="12" align="center">
					<div >
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
			memLvl: "",
			level: ["Good", "Bad"],
			memLvlInfo: "Please select your memory level",
			engOrMem: true
		}),
		methods: {
			clicked(value) {
				this.memLvl = value;
				this.$store.commit("setMemory", value);
				this.$router.push("/users-words")
			}
		}
	};
</script>