<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import BackButton from '$lib/components/BackButton.svelte';
</script>

<BackButton />

<div class="min-h-screen bg-gradient-to-br from-cyan-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
	<div class="flex flex-col items-center" in:fade={{ duration: 500 }}>
		<div 
			class="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 hover:scale-105 transition-all duration-300 hover:shadow-3xl"
			in:scale={{ duration: 600, delay: 200 }}
		>
			<div class="flex flex-col items-center gap-4">
				<!-- Bing Logo SVG -->
				<div class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-xl">
					<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 8L20 16L28 8H24L20 12L16 8H12Z" fill="#4a5568"/>
						<path d="M28 24L20 16L12 24H16L20 20L24 24H28Z" fill="#4a5568"/>
						<path d="M20 32L12 24L20 16L28 24L20 32Z" fill="#4a5568" fill-opacity="0.6"/>
					</svg>
				</div>
				<span class="text-2xl font-medium text-gray-700 tracking-wide">Bing</span>
			</div>
		</div>
	</div>

	<!-- Info Panel -->
	<div class="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 max-w-sm">
		<h3 class="text-gray-800 font-semibold mb-2">Gradient Background Logo</h3>
		<p class="text-gray-700 text-sm">
			Beautiful gradient background with a glassmorphism logo card featuring hover animations and backdrop blur effects.
		</p>
	</div>
</div>