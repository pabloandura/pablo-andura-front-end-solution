<script lang="ts">
	import { goto } from '$app/navigation';
	
	function goHome() {
		goto('/');
	}
</script>

<button 
	onclick={goHome}
	class="fixed top-6 left-6 z-50 group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
>
	<svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
	</svg>
	<span class="text-sm font-medium">Back</span>
</button>