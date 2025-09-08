<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import BackButton from '$lib/components/BackButton.svelte';

	const productImages = [
		'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300',
		'https://images.pexels.com/photos/1895943/pexels-photo-1895943.jpeg?auto=compress&cs=tinysrgb&w=300'
	];

	const heroImage = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1200';
</script>

<BackButton />

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<nav class="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-8 md:p-10">
		<button class="flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
			<div class="flex flex-col gap-1">
				<div class="w-5 h-0.5 bg-white"></div>
				<div class="w-5 h-0.5 bg-white"></div>
				<div class="w-5 h-0.5 bg-white"></div>
			</div>
			<span class="text-sm font-light tracking-wider">Menu</span>
		</button>
		<span class="text-white text-sm font-light tracking-wider">ENG</span>
	</nav>

	<div class="flex flex-col lg:flex-row min-h-screen">
		<!-- Hero Section -->
		<div class="flex-1 relative overflow-hidden">
			<img 
				src={heroImage} 
				alt="Summer 2020 Collection"
				class="w-full h-full object-cover"
				in:fade={{ duration: 1000 }}
			/>
			
			<!-- Hero Text -->
			<div class="absolute bottom-20 left-10 md:left-16 text-white" in:fly={{ x: -50, delay: 500 }}>
				<h1 class="font-playfair text-6xl md:text-8xl lg:text-9xl font-light leading-none">
					Summer
				</h1>
				<h2 class="font-playfair text-6xl md:text-8xl lg:text-9xl font-light leading-none">
					2020
				</h2>
			</div>

			<!-- Collection Info -->
			<div class="absolute bottom-20 left-4 text-white text-xs tracking-widest transform -rotate-90 origin-left hidden md:block">
				<div class="flex flex-col gap-2">
					<span>Summer</span>
					<span>Collection</span>
					<span>2020</span>
				</div>
			</div>

			<!-- Navigation Controls -->
			<div class="absolute bottom-10 right-10 md:right-16 flex gap-8 text-white text-sm" in:fly={{ x: 50, delay: 700 }}>
				<button class="hover:opacity-75 transition-opacity border-b border-white/30 hover:border-white pb-1">
					Next
				</button>
				<button class="hover:opacity-75 transition-opacity border-b border-white/30 hover:border-white pb-1">
					Previous
				</button>
			</div>
		</div>

		<!-- Sidebar -->
		<div class="w-full lg:w-96 bg-gray-100 p-8 md:p-10 flex flex-col justify-between relative">
			<!-- Product Gallery -->
			<div class="flex flex-col gap-6 mt-16" in:fly={{ y: 30, delay: 600 }}>
				{#each productImages as image, index}
					<div class="aspect-[3/4] rounded-sm overflow-hidden group cursor-pointer" in:fade={{ delay: 800 + (index * 200) }}>
						<img 
							src={image} 
							alt="Product {index + 1}"
							class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					</div>
				{/each}
			</div>

			<!-- Shop Button -->
			<div class="mt-8" in:fade={{ delay: 1200 }}>
				<button class="border-2 border-gray-800 px-8 py-4 text-gray-800 text-xs tracking-widest hover:bg-gray-800 hover:text-white transition-all duration-300">
					SHOP NOW
				</button>
			</div>

			<!-- Year Indicator -->
			<div class="absolute right-8 top-1/2 transform translate-x-1/2 rotate-90 text-gray-500 text-xs tracking-widest origin-center">
				Fall 2020/2021
			</div>

			<!-- Social Links -->
			<div class="flex gap-6 text-gray-500 text-xs tracking-wider mt-8" in:fade={{ delay: 1000 }}>
				<a href="#" class="hover:text-gray-800 transition-colors">FB</a>
				<a href="#" class="hover:text-gray-800 transition-colors">PIN</a>
				<a href="#" class="hover:text-gray-800 transition-colors">IG</a>
			</div>
		</div>
	</div>

	<!-- Info Panel -->
	<div class="fixed bottom-6 left-6 bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/20 max-w-sm text-white lg:block hidden">
		<h3 class="font-semibold mb-2">Website Header</h3>
		<p class="text-white/70 text-sm">
			Fashion website layout with split-screen design, responsive gallery, and elegant typography using Playfair Display font.
		</p>
	</div>
</div>