<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import BackButton from "$lib/components/BackButton.svelte";
</script>

<BackButton />

<div
  class="min-h-screen bg-gradient-to-br from-cyan-200 via-purple-200 to-pink-200 flex items-center justify-center p-4"
>
  <div class="flex flex-col items-center" in:fade={{ duration: 500 }}>
    <div
      class="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 hover:scale-105 transition-all duration-300 hover:shadow-3xl"
      in:scale={{ duration: 600, delay: 200 }}
    >
      <div class="flex flex-col items-center gap-4">
        <!-- Bing Logo SVG -->
        <div
          class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
          >
            <path
              fill="rgb(70,70,70)"
              d="M20 11.5 10 8l1.5 5 3.5 1.5 -6.5 4V3L4 1v20l4.5 2L20 17v-5.5Z"
              stroke-width="1"
            ></path>
          </svg>
        </div>
        <span class="text-2xl font-medium text-gray-700 tracking-wide"
          >Bing</span
        >
      </div>
    </div>
  </div>

  <!-- Info Panel -->
  <div
    class="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 max-w-sm"
  >
    <h3 class="text-gray-800 font-semibold mb-2">Gradient Background Logo</h3>
    <p class="text-gray-700 text-sm">
      Beautiful gradient background with a glassmorphism logo card featuring
      hover animations and backdrop blur effects.
    </p>
  </div>
</div>
