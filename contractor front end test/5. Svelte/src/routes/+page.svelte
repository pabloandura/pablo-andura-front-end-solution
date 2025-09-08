<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	const challenges = [
		{
			id: 'navigation',
			title: 'Navigation Hover',
			description: 'Interactive navigation with smooth hover animations and color transitions.',
			color: 'from-purple-600 to-blue-600',
		},
		{
			id: 'gradient-logo',
			title: 'Gradient Background Logo',
			description: 'Beautiful gradient background with glassmorphism logo card.',
			color: 'from-pink-500 to-violet-500',
		},
		{
			id: 'website-header',
			title: 'Website Header',
			description: 'Sophisticated fashion website with responsive gallery layout.',
			color: 'from-amber-500 to-orange-600',
		},
		{
			id: 'todo-app',
			title: 'Todo Application',
			description: 'Interactive task management with local storage and animations.',
			color: 'from-emerald-500 to-teal-600',
		},
	];

	function navigateToChallenge(challengeId: string) {
		goto(`/${challengeId}`);
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
	<!-- Header -->
	<header class="relative overflow-hidden bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-sm">
		<div class="absolute inset-0 bg-black/20"></div>
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
			<div class="text-center">
				<h1 class="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
					<span class="block text-white/90 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mt-1 sm:mt-2">
						Frontend Challenge
					</span>
				</h1>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
			{#each challenges as challenge, index}
				<div 
					class="group cursor-pointer"
					in:fly={{ y: 50, delay: index * 100 }}
					onclick={() => navigateToChallenge(challenge.id)}
					onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? navigateToChallenge(challenge.id) : null}
					role="button"
					tabindex="0"
				>
					<div class="relative overflow-hidden rounded-xl bg-gradient-to-br {challenge.color} p-4 sm:p-6 md:p-8 h-48 sm:h-56 md:h-64 transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-xl">
						<div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
						<div class="relative h-full flex flex-col justify-between">
							<div>
								<h3 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
									{challenge.title}
								</h3>
								<p class="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed">
									{challenge.description}
								</p>
							</div>
							<div class="flex items-center text-white/80 group-hover:text-white transition-colors duration-300 mt-4">
								<span class="text-xs sm:text-sm font-medium">View Demo</span>
								<svg class="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Additional Info -->
		<div class="mt-16 text-center">
			<div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
				<h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
					Technologies Used
				</h2>
				<div class="flex flex-wrap justify-center gap-4 text-white/70">
					<span class="px-4 py-2 bg-white/10 rounded-full text-sm font-medium">Svelte 5</span>
					<span class="px-4 py-2 bg-white/10 rounded-full text-sm font-medium">SvelteKit</span>
					<span class="px-4 py-2 bg-white/10 rounded-full text-sm font-medium">Tailwind CSS</span>
					<span class="px-4 py-2 bg-white/10 rounded-full text-sm font-medium">TypeScript</span>
					<span class="px-4 py-2 bg-white/10 rounded-full text-sm font-medium">Vite</span>
				</div>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-white/10 bg-black/20 backdrop-blur-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="text-center">
				<p class="text-white/60 text-sm">
					Built with ❤️ using Svelte + Tailwind • Responsive & Mobile-First Design
				</p>
			</div>
		</div>
	</footer>
</div>
