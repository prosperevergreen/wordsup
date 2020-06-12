<template>
	<div class="mt-12">
		<v-card class="pb-1">
			<v-img :src="require('@/assets/' + icon)" contain height="200px"></v-img>
			<v-card-title class="justify-center headline font-weight-light text--darken-4 purple--text">
				WELCOME TO MEMRA
			</v-card-title>
			<v-card-text class="text-center">
				Have Fun Learning Your Words
			</v-card-text>
			<div class="mx-4 my-2">
				<v-btn dark block color="purple darken-4" to="/signup" x-large>Sign up</v-btn>
				<div class="mt-2 pl-3 d-flex align-center justify-space-between">
					<span>Don't wish to sign up?</span>
					<v-btn text color="purple darken-4" class="pl-1" @click="onContinue()" x-large>Continue</v-btn>
				</div>
			</div>
		</v-card>
	</div>
</template>

<script>
	export default {
		data: () => ({
			icon: "ram_icon.png"
		}),
		methods: {
			onContinue() {
				this.$store.commit("authUser", { userID: "none", canLogin: true });
				this.$router.push("/users-words");
			}
		}
	};
</script>