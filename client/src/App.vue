<template>
	<v-app fixed>
		<nav-bar/>
		<v-main class="deep-purple lighten-5">
			<v-container>
				<v-row class="justify-center">
					<v-col sm="8">
						<transition mode="out-in" enter-active-class="animated slideInRight">
							<router-view></router-view>
						</transition>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
	import NavBar from "./components/NavBar";

	export default {
		name: "App",
		components: {
			NavBar
		},
		data: () => ({
			//
		})
	};
</script>
