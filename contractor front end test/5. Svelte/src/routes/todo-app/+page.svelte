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
	let inputElement: HTMLInputElement;
	let isLoading = false;
	let validationMessage = '';

	$: canAdd = newTodoText.trim().length > 0;
	$: characterCount = newTodoText.length;
	$: isNearLimit = characterCount > 40;
	$: validationMessage = newTodoText.trim().length === 0 && newTodoText.length > 0 ? 'Task cannot be empty' : characterCount > 50 ? 'Task is too long' : '';

	function addTodo() {
		if (!canAdd) return;
		
		const trimmed = newTodoText.trim();
		if (trimmed.length === 0 || trimmed.length > 50) {
			return;
		}
		
		todos = [
			...todos,
			{
				id: nextId++,
				text: trimmed,
				completed: false
			}
		];
		
		newTodoText = '';
		saveTodos();
		
		// Return focus to input
		setTimeout(() => {
			if (inputElement) {
				inputElement.focus();
			}
		}, 100);
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
		} else if (event.key === 'Escape') {
			newTodoText = '';
			validationMessage = '';
		}
	}

	function handleTodoKeyPress(event: KeyboardEvent, todoId: number) {
		if (event.key === 'Delete' || event.key === 'Backspace') {
			removeTodo(todoId);
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleTodo(todoId);
		}
	}

	function removeTodo(id: number) {
		todos = todos.filter(todo => todo.id !== id);
		saveTodos();
	}

	async function saveTodos() {
		if (typeof localStorage !== 'undefined') {
			try {
				isLoading = true;
				localStorage.setItem('svelte-todos', JSON.stringify(todos));
				// Simulate brief loading for visual feedback
				await new Promise(resolve => setTimeout(resolve, 100));
			} catch (error) {
				console.error('Failed to save todos:', error);
			} finally {
				isLoading = false;
			}
		}
	}

	async function loadTodos() {
		if (typeof localStorage !== 'undefined') {
			try {
				isLoading = true;
				const saved = localStorage.getItem('svelte-todos');
				if (saved) {
					todos = JSON.parse(saved);
					nextId = Math.max(...todos.map(t => t.id)) + 1;
				}
				// Simulate brief loading for visual feedback
				await new Promise(resolve => setTimeout(resolve, 200));
			} catch (error) {
				console.error('Failed to load todos:', error);
			} finally {
				isLoading = false;
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

<svelte:head>
	<title>Todo Application - {currentMonth} {currentDate}</title>
</svelte:head>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>

<BackButton />

<div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
	<div class="w-full max-w-md" in:fade={{ duration: 500 }}>
		<div 
			class="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300"
			in:scale={{ duration: 600, delay: 200 }}
		>
			<!-- Header -->
			<header class="text-center mb-10">
				<h1 class="text-3xl font-semibold text-gray-700 mb-2 font-inter tracking-tight" id="app-title">
					{currentMonth}
				</h1>
				<p class="text-gray-500 font-light" aria-label="Current date">
					{currentDay}, {currentMonth} {currentDate}
				</p>
			</header>

			<!-- Todo List -->
			<section aria-labelledby="todo-heading" class="mb-8">
				<h2 id="todo-heading" class="sr-only">Your Tasks</h2>
				<div class="space-y-4 min-h-[300px]" aria-live="polite" aria-label="Task list">
					{#if isLoading}
						<div class="flex items-center justify-center py-8" aria-live="polite">
							<div class="animate-pulse text-gray-500">Loading tasks...</div>
						</div>
					{:else}
						{#each todos as todo, index}
							<div 
								class="flex items-center justify-between py-3 px-1 border-b border-gray-100 hover:bg-gray-50/50 rounded-lg transition-all duration-200 group focus-within:ring-2 focus-within:ring-green-400 focus-within:ring-opacity-50"
								in:fly={{ x: -20, delay: index * 100 }}
								role="listitem"
							>
								<button 
									class="flex-1 text-left px-2 py-1 rounded-md transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 {todo.completed ? 'text-green-600 line-through' : 'text-gray-700'}"
									onclick={() => toggleTodo(todo.id)}
									onkeydown={(e) => handleTodoKeyPress(e, todo.id)}
									aria-describedby="todo-{todo.id}-status"
									aria-label="Task: {todo.text}. {todo.completed ? 'Currently completed' : 'Currently incomplete'}. Click to toggle or press Delete to remove."
								>
									{todo.text}
								</button>
								<button 
									class="w-8 h-8 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-green-400 focus:outline-none {todo.completed ? 'bg-green-100' : 'bg-orange-100'}"
									onclick={() => toggleTodo(todo.id)}
									aria-label="{todo.completed ? 'Mark task as incomplete' : 'Mark task as complete'}: {todo.text}"
									title="{todo.completed ? 'Mark as incomplete' : 'Mark as complete'}"
								>
									{todo.completed ? '😊' : '😕'}
								</button>
								<span id="todo-{todo.id}-status" class="sr-only">
									{todo.completed ? 'Completed task' : 'Incomplete task'}. Press Delete to remove.
								</span>
							</div>
						{/each}
					{/if}
				</div>
			</section>

			<!-- Add Todo -->
			<section aria-labelledby="add-todo-heading">
				<h2 id="add-todo-heading" class="sr-only">Add New Task</h2>
				<div class="flex flex-col gap-3">
					<div class="flex gap-3">
						<div class="flex-1">
							<label for="todoInput" class="sr-only">New task description</label>
							<input
								id="todoInput"
								bind:this={inputElement}
								bind:value={newTodoText}
								onkeydown={handleKeyPress}
								placeholder="Add Task"
								class="w-full px-4 py-3 border-2 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50/50 {validationMessage ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : isNearLimit ? 'border-yellow-400 focus:border-yellow-400 focus:ring-yellow-100' : 'border-gray-200 focus:border-green-400 focus:ring-green-100'}"
								maxlength="50"
								aria-describedby="input-help character-count {validationMessage ? 'validation-message' : ''}"
								aria-invalid={validationMessage ? 'true' : 'false'}
							/>
						</div>
						<button
							onclick={addTodo}
							disabled={!canAdd || !!validationMessage || isLoading}
							class="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-green-400 {canAdd && !validationMessage ? 'shadow-lg hover:shadow-xl' : ''}"
							aria-describedby="add-help"
							aria-label="Add new task"
						>
							{isLoading ? 'Adding...' : 'Add'}
						</button>
					</div>
					
					<!-- Help Text and Validation -->
					<div class="text-sm space-y-1">
						<div id="input-help" class="text-gray-500">
							Enter a task description. Press Enter to add, Escape to clear.
						</div>
						<div class="flex justify-between items-center">
							<div id="character-count" class="{isNearLimit ? 'text-yellow-600 font-medium' : 'text-gray-400'}">
								{characterCount}/50 characters
							</div>
							{#if validationMessage}
								<div id="validation-message" class="text-red-500 font-medium" role="alert">
									{validationMessage}
								</div>
							{/if}
						</div>
						<div id="add-help" class="text-gray-400 text-xs">
							Keyboard shortcuts: Delete key removes tasks, Enter adds tasks
						</div>
					</div>
				</div>
			</section>
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