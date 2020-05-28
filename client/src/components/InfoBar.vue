<template>
	<v-alert class="purple--text text--accent-4 body-1" color="rgba(255, 255, 255, 0.7)" elevation="1">
		<div class="text-center text-uppercase error--text"  style="overflow-wrap: break-word;">{{ info }}</div>
	</v-alert>
</template>
<script>
	export default {
		props: {
			info: {
				type: String,
				required: true
			}
		}
	};
</script>
 