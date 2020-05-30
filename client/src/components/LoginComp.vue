<template>
	<div>
		<v-card>
			<v-card-title class="justify-center">
				Login
			</v-card-title>
			<v-card-text>
				<v-form ref="form" v-model="valid" @submit.prevent="onSubmit()">
					<v-alert dense outlined class="white" type="error" v-if="!isCorrect">
						Incorrect <strong>username</strong> or <strong>password</strong>.
					</v-alert>
					<v-text-field v-model="username" :rules="[rules.required, rules.min, match]" label="Username" required @focus="isCorrect = true"></v-text-field>
					<v-text-field v-model="password" :rules="[rules.required,rules.min,match]" @focus="isCorrect = true" label="Password" :append-icon="visible ? 'mdi-eye' : 'mdi-eye-off'" @click:append="visible = !visible" required :type="visible ? 'text' : 'password'"></v-text-field>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-btn :disabled="!valid" @click="onSubmit()" color="success">Submit</v-btn>
				<v-spacer></v-spacer>
				<v-btn text color="grey" replace to="/signup" @click="$emit('switch', false)">signUp</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
	export default {
		data: () => ({
			username: "",
			valid: false,
			visible: false,
			password: "",
			isCorrect: true,
			rules: {
				required: value => !!value || "Required.",
				min: v => v.length >= 5 || "Min 5 characters",
				emailMatch: () => "The email and password you entered don't match"
			}
		}),
		methods: {
			async onSubmit() {
				const formData = {
					user: this.username,
					pass: this.password
				};
				const result = await this.login(formData);
				this.isCorrect = result;
				if (result) {
					this.$router.push("/users-words");
				}
			},
			resetChecker() {
				this.isCorrect = true;
			},
			login(formData) {
				return this.$http
					.post("api/user/login", formData)
					.then(res => {
						// console.log(res.data);
						if (res.status == 200) {
							this.$store.commit("authUser", {
								userID: res.data.user,
								canLogin: res.data.isMatch
							});
						} else {
							this.$store.commit("authUser", { userID: "", canLogin: false });
						}
						return res.data.isMatch;
					})
					.catch(err => console.log(err));
			}
		},
		computed: {
			match() {
				return this.isCorrect || "";
			}
		}
	};
</script>
