<template>
	<div>
		<appInfoBarComp :info="pageInfo" />
		<div v-for="completed in userResult" :key="completed.part">
			<result-detail-comp :completed="completedTest" :part="completed.part" :correct="completed.correct" :wrong="completed.wrong" />
		</div>
		<div v-if="completedTest == 3">
			<v-btn block dark color="purple darken-4" x-large @click="$router.push('/users-words')">New Words</v-btn>
		</div>

	</div>
</template>
<script>
	import appInfoBarComp from "@/components/InfoBar";
	import resultDetailComp from "@/components/ResultDetail";

	export default {
		components: {
			appInfoBarComp,
			resultDetailComp
		},
		data: () => ({
			pageInfo: "Learning Result",
			userResult:[],
			completedTest: false
		}),
		created() {
			let result = this.$store.getters.getUserResult;
			this.userResult = result.slice().reverse();
			this.completedTest = this.userResult.length
		}
	};
</script>