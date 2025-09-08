<script lang="ts">
	import { fade } from 'svelte/transition';
	import BackButton from '$lib/components/BackButton.svelte';

	const navItems = [
		{ label: 'Animation', active: false },
		{ label: 'Branding', active: true },
		{ label: 'Illustration', active: false }
	];
</script>

<BackButton />

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
	<nav class="w-full max-w-4xl" in:fade={{ duration: 500 }}>
		<ul class="flex justify-center items-center gap-16 md:gap-20 flex-wrap">
			{#each navItems as item}
				<li class="relative group">
					<a 
						href="#" 
						class="block text-white/60 hover:text-white text-2xl md:text-3xl lg:text-4xl font-light tracking-wide transition-all duration-300 py-3 relative
						{item.active ? 'text-white' : ''}"
					>
						{item.label}
						<span 
							class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-white transition-all duration-300 ease-out
							{item.active ? 'w-20' : 'w-0 group-hover:w-full'}"
						></span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Info Panel -->
	<div class="fixed bottom-6 right-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 max-w-sm">
		<h3 class="text-white font-semibold mb-2">Navigation Hover</h3>
		<p class="text-white/70 text-sm">
			Hover over the navigation items to see smooth animations with color transitions and underline effects.
		</p>
	</div>
</div>