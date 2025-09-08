<script lang="ts">
	import { fade, fly, scale, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut, backOut } from 'svelte/easing';
	import BackButton from '$lib/components/BackButton.svelte';
	import { todos, todoActions, isLoading, justToggled, type Todo } from '$lib/stores/todos';

	let newTodoText = '';
	let inputElement: HTMLInputElement;
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
		
		todoActions.add(trimmed);
		newTodoText = '';
		
		// Return focus to input
		setTimeout(() => {
			if (inputElement) {
				inputElement.focus();
			}
		}, 100);
	}

	function toggleTodo(id: number) {
		todoActions.toggle(id);
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
			todoActions.remove(todoId);
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleTodo(todoId);
		}
	}


	// Custom animation functions
	function flyBounce(node: Element, { delay = 0, duration = 400, x = 0, y = 0 }) {
		return {
			delay,
			duration,
			css: (t: number, u: number) => {
				const eased = backOut(t);
				return `
					transform: translate(${u * x}px, ${u * y}px) scale(${0.8 + (eased * 0.2)});
					opacity: ${t};
				`;
			}
		};
	}

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

	@keyframes bounce-once {
		0%, 20%, 53%, 80%, 100% {
			transform: scale(1);
		}
		40%, 43% {
			transform: scale(1.15);
		}
		70% {
			transform: scale(1.05);
		}
	}

	@keyframes pulse-once {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.animate-bounce-once {
		animation: bounce-once 0.6s ease-in-out;
	}

	.animate-pulse-once {
		animation: pulse-once 0.6s ease-in-out;
	}
</style>

<BackButton />

<div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-3 sm:p-4 md:p-6">
	<div class="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl" in:fade={{ duration: 500 }}>
		<div 
			class="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl border border-white/50 hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-300"
			in:scale={{ duration: 600, delay: 200 }}
		>
			<!-- Header -->
			<header class="text-center mb-6 sm:mb-8 md:mb-10">
				<h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-700 mb-2 font-inter tracking-tight" id="app-title">
					{currentMonth}
				</h1>
				<p class="text-sm sm:text-base text-gray-500 font-light" aria-label="Current date">
					{currentDay}, {currentMonth} {currentDate}
				</p>
			</header>

			<!-- Todo List -->
			<section aria-labelledby="todo-heading" class="mb-6 sm:mb-8">
				<h2 id="todo-heading" class="sr-only">Your Tasks</h2>
				<div class="space-y-3 sm:space-y-4" style="min-height: {$todos.length > 0 ? 'auto' : '40vh'}; max-height: 60vh; overflow-y: auto;" aria-live="polite" aria-label="Task list">
					{#if $isLoading}
						<div class="flex items-center justify-center" style="height: 40vh;" aria-live="polite">
							<div class="animate-pulse text-gray-500 text-sm sm:text-base">Loading tasks...</div>
						</div>
					{:else}
						{#each $todos as todo, index (todo.id)}
							<div 
								class="flex items-center justify-between py-2 sm:py-3 px-1 sm:px-2 border-b border-gray-100 hover:bg-gray-50/50 rounded-lg transition-all duration-200 group focus-within:ring-2 focus-within:ring-green-400 focus-within:ring-opacity-50"
								in:flyBounce={{ x: -30, delay: index * 50 }}
								out:slide={{ duration: 300, easing: quintOut }}
								animate:flip={{ duration: 300, easing: quintOut }}
								role="listitem"
							>
								<button 
									class="flex-1 text-left px-1 sm:px-2 py-1 rounded-md transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 {todo.completed ? 'text-green-600 line-through' : 'text-gray-700'} text-sm sm:text-base"
									onclick={() => toggleTodo(todo.id)}
									onkeydown={(e) => handleTodoKeyPress(e, todo.id)}
									aria-describedby="todo-{todo.id}-status"
									aria-label="Task: {todo.text}. {todo.completed ? 'Currently completed' : 'Currently incomplete'}. Click to toggle or press Delete to remove."
								>
									{todo.text}
								</button>
								<button 
									class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-lg sm:text-2xl transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-green-400 focus:outline-none {todo.completed ? 'bg-green-100' : 'bg-orange-100'} {$justToggled.has(todo.id) ? 'animate-bounce-once' : ''}"
									onclick={() => toggleTodo(todo.id)}
									aria-label="{todo.completed ? 'Mark task as incomplete' : 'Mark task as complete'}: {todo.text}"
									title="{todo.completed ? 'Mark as incomplete' : 'Mark as complete'}"
									style="transform-origin: center; flex-shrink: 0;"
								>
									<span class="{$justToggled.has(todo.id) ? 'animate-pulse' : ''}">
										{todo.completed ? '😊' : '😕'}
									</span>
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
				<div class="flex flex-col gap-2 sm:gap-3">
					<div class="flex gap-2 sm:gap-3">
						<div class="flex-1">
							<label for="todoInput" class="sr-only">New task description</label>
							<input
								id="todoInput"
								bind:this={inputElement}
								bind:value={newTodoText}
								onkeydown={handleKeyPress}
								placeholder="Add Task"
								class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50/50 {validationMessage ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : isNearLimit ? 'border-yellow-400 focus:border-yellow-400 focus:ring-yellow-100' : 'border-gray-200 focus:border-green-400 focus:ring-green-100'}"
								maxlength="50"
								aria-describedby="input-help character-count {validationMessage ? 'validation-message' : ''}"
								aria-invalid={validationMessage ? 'true' : 'false'}
							/>
						</div>
						<button
							onclick={addTodo}
							disabled={!canAdd || !!validationMessage || $isLoading}
							class="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg sm:rounded-xl font-medium text-sm sm:text-base hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-green-400 {canAdd && !validationMessage ? 'shadow-lg hover:shadow-xl' : ''}"
							aria-describedby="add-help"
							aria-label="Add new task"
						>
							{$isLoading ? 'Adding...' : 'Add'}
						</button>
					</div>
					
					<!-- Help Text and Validation -->
					<div class="text-xs sm:text-sm space-y-1">
						<div id="input-help" class="text-gray-500 hidden sm:block">
							Enter a task description. Press Enter to add, Escape to clear.
						</div>
						<div class="flex justify-between items-center">
							<div id="character-count" class="{isNearLimit ? 'text-yellow-600 font-medium' : 'text-gray-400'}">
								{characterCount}/50
							</div>
							{#if validationMessage}
								<div id="validation-message" class="text-red-500 font-medium" role="alert">
									{validationMessage}
								</div>
							{/if}
						</div>
						<div id="add-help" class="text-gray-400 text-xs hidden sm:block">
							Keyboard shortcuts: Delete key removes tasks, Enter adds tasks
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>

	<!-- Info Panel - Hidden on mobile -->
	<div class="fixed bottom-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-gray-200 max-w-xs sm:max-w-sm hidden md:block">
		<h3 class="text-gray-800 font-semibold mb-2 text-sm sm:text-base">Todo Application</h3>
		<p class="text-gray-600 text-xs sm:text-sm">
			Interactive task manager with emoji status indicators, local storage persistence, and smooth animations.
		</p>
	</div>
</div>