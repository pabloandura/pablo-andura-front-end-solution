<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import BackButton from '$lib/components/BackButton.svelte';

	interface Todo {
		id: number;
		text: string;
		completed: boolean;
	}

	let todos: Todo[] = [
		{ id: 1, text: 'Buy new sweatshirt', completed: true },
		{ id: 2, text: 'Read an article', completed: true },
		{ id: 3, text: 'Write blog post', completed: false },
		{ id: 4, text: 'Watch "Mr Robot"', completed: false },
		{ id: 5, text: 'Run', completed: false }
	];

	let newTodoText = '';
	let nextId = 6;

	$: canAdd = newTodoText.trim().length > 0;

	function addTodo() {
		if (!canAdd) return;
		
		todos = [
			...todos,
			{
				id: nextId++,
				text: newTodoText.trim(),
				completed: false
			}
		];
		
		newTodoText = '';
		saveTodos();
	}

	function toggleTodo(id: number) {
		todos = todos.map(todo => 
			todo.id === id 
				? { ...todo, completed: !todo.completed }
				: todo
		);
		saveTodos();
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addTodo();
		}
	}

	function saveTodos() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('svelte-todos', JSON.stringify(todos));
		}
	}

	function loadTodos() {
		if (typeof localStorage !== 'undefined') {
			const saved = localStorage.getItem('svelte-todos');
			if (saved) {
				try {
					todos = JSON.parse(saved);
					nextId = Math.max(...todos.map(t => t.id)) + 1;
				} catch (error) {
					console.warn('Failed to load todos:', error);
				}
			}
		}
	}

	onMount(() => {
		loadTodos();
	});

	// Get current date
	const now = new Date();
	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	const dayNames = [
		'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
	];
	
	const currentMonth = monthNames[now.getMonth()];
	const currentDay = dayNames[now.getDay()];
	const currentDate = now.getDate();
</script>

<BackButton />

<div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
	<div class="w-full max-w-md" in:fade={{ duration: 500 }}>
		<div 
			class="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300"
			in:scale={{ duration: 600, delay: 200 }}
		>
			<!-- Header -->
			<header class="text-center mb-10">
				<h1 class="text-3xl font-semibold text-gray-700 mb-2 font-inter tracking-tight">
					{currentMonth}
				</h1>
				<p class="text-gray-500 font-light">
					{currentDay}, {currentMonth} {currentDate}
				</p>
			</header>

			<!-- Todo List -->
			<div class="space-y-4 mb-8 min-h-[300px]">
				{#each todos as todo, index}
					<div 
						class="flex items-center justify-between py-3 px-1 border-b border-gray-100 hover:bg-gray-50/50 rounded-lg transition-all duration-200 group cursor-pointer"
						in:fly={{ x: -20, delay: index * 100 }}
						onclick={() => toggleTodo(todo.id)}
					>
						<span 
							class="flex-1 text-gray-700 transition-all duration-300 {todo.completed ? 'text-green-600 line-through' : ''}"
						>
							{todo.text}
						</span>
						<button 
							class="w-8 h-8 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 {todo.completed ? 'bg-green-100' : 'bg-orange-100'}"
							onclick={(e) => { e.stopPropagation(); toggleTodo(todo.id); }}
						>
							{todo.completed ? '😊' : '😕'}
						</button>
					</div>
				{/each}
			</div>

			<!-- Add Todo -->
			<div class="flex gap-3">
				<input
					bind:value={newTodoText}
					onkeypress={handleKeyPress}
					placeholder="Add Task"
					class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all duration-200 bg-gray-50/50"
					maxlength="50"
				/>
				<button
					onclick={addTodo}
					disabled={!canAdd}
					class="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 {canAdd ? 'shadow-lg hover:shadow-xl' : ''}"
				>
					Add
				</button>
			</div>
		</div>
	</div>

	<!-- Info Panel -->
	<div class="fixed bottom-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-4 border border-gray-200 max-w-sm">
		<h3 class="text-gray-800 font-semibold mb-2">Todo Application</h3>
		<p class="text-gray-600 text-sm">
			Interactive task manager with emoji status indicators, local storage persistence, and smooth animations.
		</p>
	</div>
</div>