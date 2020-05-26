<template>
	<div class="mt-10">
		<transition mode="out-in" enter-active-class="animated flipInY">
			<component @switch="canLogin = $event" @login="onLogin($event)" @signup="onSignup($event)" :is="loginOrSignup"></component>
		</transition>
	</div>
</template>

<script>
	import appLoginComp from "@/components/LoginComp";
	import appSignupComp from "@/components/SignupComp";

	export default {
		components: {
			appLoginComp,
			appSignupComp
		},
		data: () => ({
			canLogin: true
		}),
		computed: {
			loginOrSignup() {
				if (this.$route.path === "/login") {
					return "appLoginComp";
				} else {
					return "appSignupComp";
				}
			}
		},
		methods: {
			// onLogin(form) {
			// 	this.$store.dispatch('login', form)
			// },
			// onSignup(form) {
			// 	this.$store.dispatch('signup', form)
			// }
		}
	};
</script>