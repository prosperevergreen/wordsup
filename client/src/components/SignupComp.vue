<template>
	<div>
		<v-card>
			<v-card-title class="justify-center">
				Sign Up
			</v-card-title>
			<v-card-text>
				<v-form ref="form" v-model="valid">
					<v-text-field v-model="username" :rules="[rules.required, rules.min, existsError]" label="Username" required @blur="setExist(username)" @focus="isExists = true"></v-text-field>
					<v-text-field v-model="$v.email.$model" type="email" :rules="[rules.required,isEmail]" label="Email" required @touch="isEmail()"></v-text-field>
					<v-text-field v-model="password1" :rules="[rules.required, rules.min]" label="Password" :append-icon="visible1 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="visible1 = !visible1" required :type="visible1 ? 'text' : 'password'"></v-text-field>
					<v-text-field v-model="password2" :rules="[rules.required, isMatch]" label="Confirm Password" :append-icon="visible2 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="visible2 = !visible2" required :type="visible2 ? 'text' : 'password'"></v-text-field>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-btn :disabled="!valid" @click="onSubmit()" color="success">Submit</v-btn>
				<v-spacer></v-spacer>
				<v-btn text color="grey" replace to="/login" @click="$emit('switch', true)">Login</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
	import { email, sameAs } from "vuelidate/lib/validators";
	export default {
		data: () => ({
			username: "",
			email: "",
			password1: "",
			password2: "",
			valid: false,
			visible1: false,
			visible2: false,
			isExists: true,
			rules: {
				required: value => !!value || "Required.",
				min: v => v.length >= 5 || "Min 5 characters"
			}
		}),
		validations: {
			email: {
				email
			},
			password2: {
				sameAs: sameAs("password1")
			}
		},
		computed: {
			isMatch() {
				return (
					this.$v.password2.sameAs || "The passwords you entered don't match"
				);
			},
			isEmail() {
				return this.$v.email.email || "Invalid Email";
			},
			existsError() {
				return this.isExists || "Username already exists";
			}
		},
		methods: {
			async onSubmit() {
				const formData = {
					username: this.username,
					email: this.email,
					password: this.password1
				};
				const result = await this.signup(formData);
				if (result) {
					this.$router.push("/users-words");
				}
			},
			signup(authData) {
				return this.$http
					.post("api/user", authData)
					.then(res => {
						// console.log(res);
						if (res.status == 201) {
							this.$store.commit("authUser", {
								userID: authData.username,
								canLogin: true
							});
							return true;
						} else {
							this.$store.commit("authUser", { userID: "", canLogin: false });
							return false;
						}
					})
					.catch(err => console.log(err));
			},
			canSignup(username) {
				return this.$http
					.post("api/user/exist", { user: username })
					.then(res => {
						// console.log(res.data);
						if (res.status == 200) {
							return res.data.exists;
						}
						return false;
					})
					.catch(err => console.log(err));
			},
			async setExist(user) {
				const value = await this.canSignup(user);
				this.isExists = !value;
			}
		}
	};
</script>

