<template>
	<div>
		<!-- <v-navigation-drawer v-model="drawer" color="purple darken-4" dark app temporary>
			<v-list nav>

				<v-list-item two-line>
					<v-list-item-avatar>
						<img :src="require('@/assets/' + icon)">
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="title">MemRa</v-list-item-title>
						<v-list-item-subtitle>Memory Ratio</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
				<v-divider></v-divider>
				<v-list-item-group>
					<v-list-item v-for="(menu,index) in  navMenu" :key="index" router :to="menu.link" @click="drawer = false">
						<v-list-item-icon>
							<v-icon>{{menu.icon}}</v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{menu.name}}</v-list-item-title>
					</v-list-item>

				</v-list-item-group>
			</v-list>

			<template v-slot:append>
				<div class="pa-2">
					<v-btn block>Logout</v-btn>
				</div>
			</template>

		</v-navigation-drawer> -->

		<v-app-bar fixed color="purple darken-4" dark app>
			<v-toolbar-title :to="'/'">
				<v-list-item two-line style="padding: 0">
					<v-list-item-avatar>
						<v-img :src="require('@/assets/' + icon)"></v-img>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title class="title" style="line-height: 1.2;">MemRa</v-list-item-title>
						<v-list-item-subtitle>Memory Ratio</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn text to="/login" v-if="($route.path=='/signup' || $route.path==='/')">
				LOGIN
				<v-icon right>mdi-login</v-icon>
			</v-btn>
			<v-btn text to="/signup" v-else-if="($route.path==='/login')">
				SIGN UP
				<v-icon right>mdi-login</v-icon>
			</v-btn>
			<v-btn text @click="onLogout()" v-else>
				EXIT
				<v-icon right>mdi-logout</v-icon>
			</v-btn>
		</v-app-bar>

	</div>
</template>
<script>
	export default {
		data: () => ({
			drawer: false,
			appName: "Memra",
			icon: "ram_icon.png",
			navMenu: [
				{ name: "Home", icon: "mdi-home", link: "/" },
				{ name: "Profile", icon: "mdi-account-box", link: "/profile" },
				{ name: "About", icon: "mdi-help", link: "/about" }
			]
		}),
		methods: {
			onLogout() {
				this.$store.commit("setMemory", false);
				this.$store.commit("setLevel", null);
				this.$store.commit("setWords", []);
				this.$store.commit("authUser", { userID: null, canLogin: false });
				this.$router.push("/");
			}
		}
	};
</script>

<style scoped>
</style>