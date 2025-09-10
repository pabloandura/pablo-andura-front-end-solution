<script lang="ts">
  import BackButton from "$lib/components/BackButton.svelte";
</script>

<BackButton />

<main
  class="w-screen h-screen flex items-center justify-center bg-[linear-gradient(135deg,_#a8e6cf_0%,_#dda0dd_50%,_#c8a2c8_100%)]"
>
  <a
    href="https://www.bing.com/"
    class="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border border-white/30 flex flex-col items-center gap-2 md:gap-3 p-7 md:p-9 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 transition-all duration-300 outline-offset-2 focus:outline focus:outline-blue-600 hover:-translate-y-1 hover:shadow-2xl text-inherit no-underline cursor-pointer"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Visit Bing - Because Google wasn't feeling lucky today"
  >
    <div
      class="flex items-center justify-center rounded-lg md:rounded-xl bg-gray-100 w-10 h-10 md:w-12 md:h-12 lg:w-20 lg:h-20"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="w-10 h-10 md:w-12 md:h-12 lg:w-20 lg:h-20"
      >
        <path
          fill="rgb(70,70,70)"
          d="M20 11.5 10 8l1.5 5 3.5 1.5 -6.5 4V3L4 1v20l4.5 2L20 17v-5.5Z"
          stroke-width="1"
        ></path>
      </svg>
    </div>
    <span
      class="font-medium text-gray-700 tracking-tight text-base md:text-lg lg:text-xl mb-0.5"
      >Bing</span
    >
  </a>
  <div
    class="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 max-w-sm"
  >
    <h3 class="text-gray-800 font-semibold mb-2">Gradient Background Logo</h3>
    <p class="text-gray-700 text-sm">
      Beautiful gradient background with a glassmorphism logo card featuring
      hover animations and backdrop blur effects.
    </p>
  </div>
</main>
