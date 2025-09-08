<script lang="ts">
	import { fade, fly, scale, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut, backOut } from 'svelte/easing';
	import BackButton from '$lib/components/BackButton.svelte';
	import { todos, todoActions, isLoading, justToggled, type Todo } from '$lib/stores/todos';

	let newTodoText = '';
	let inputElement: HTMLInputElement;
	let validationMessage = '';
	let focusedTodoIndex = -1;
	let todoElements: HTMLElement[] = [];

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
		} else if (event.key === 'ArrowDown' && $todos.length > 0) {
			// Navigate from input to first todo
			event.preventDefault();
			navigateToTodo(0);
		}
	}

	function handleTodoKeyPress(event: KeyboardEvent, todoId: number, index: number) {
		switch (event.key) {
			case 'Delete':
			case 'Backspace':
				event.preventDefault();
				todoActions.remove(todoId);
				// Focus next item or previous if we deleted the last one
				setTimeout(() => {
					const newIndex = index >= $todos.length ? $todos.length - 1 : index;
					if (newIndex >= 0 && todoElements[newIndex]) {
						todoElements[newIndex].focus();
						focusedTodoIndex = newIndex;
					} else {
						// No todos left, focus input
						if (inputElement) inputElement.focus();
					}
				}, 50);
				break;
				
			case 'Enter':
			case ' ':
				event.preventDefault();
				toggleTodo(todoId);
				break;
				
			case 'ArrowDown':
				event.preventDefault();
				navigateToTodo(index + 1);
				break;
				
			case 'ArrowUp':
				event.preventDefault();
				navigateToTodo(index - 1);
				break;
				
			case 'Home':
				event.preventDefault();
				navigateToTodo(0);
				break;
				
			case 'End':
				event.preventDefault();
				navigateToTodo($todos.length - 1);
				break;
		}
	}

	function navigateToTodo(targetIndex: number) {
		if (targetIndex < 0 || targetIndex >= $todos.length) {
			return;
		}
		
		if (todoElements[targetIndex]) {
			todoElements[targetIndex].focus();
			focusedTodoIndex = targetIndex;
		}
	}

	function handleTodoFocus(index: number) {
		focusedTodoIndex = index;
	}

	function handleTodoBlur() {
		// Small delay to allow focus to move to another todo
		setTimeout(() => {
			if (!todoElements.includes(document.activeElement as HTMLElement)) {
				focusedTodoIndex = -1;
			}
		}, 10);
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

<div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-start justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
	<div class="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col" style="height: calc(100vh - 4rem); max-height: calc(100vh - 4rem);" in:fade={{ duration: 500 }}>
		<div 
			class="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/50 hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-300 flex flex-col h-full overflow-hidden"
			in:scale={{ duration: 600, delay: 200 }}
		>
			<!-- Header -->
			<header class="flex-shrink-0 text-center p-4 sm:p-6 md:p-8 pb-2 sm:pb-4">
				<h1 class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mb-1 sm:mb-2 font-inter tracking-tight" id="app-title">
					{currentMonth}
				</h1>
				<p class="text-xs sm:text-sm text-gray-500 font-light" aria-label="Current date">
					{currentDay}, {currentMonth} {currentDate}
				</p>
			</header>

			<!-- Todo List -->
			<section aria-labelledby="todo-heading" class="flex-1 flex flex-col overflow-hidden px-4 sm:px-6 md:px-8">
				<h2 id="todo-heading" class="sr-only">Your Tasks</h2>
				<div class="flex-1 overflow-y-auto space-y-2 sm:space-y-3 pr-1" style="min-height: 0;" aria-live="polite" aria-label="Task list">
					{#if $isLoading}
						<div class="flex items-center justify-center h-32" aria-live="polite">
							<div class="animate-pulse text-gray-500 text-sm">Loading tasks...</div>
						</div>
					{:else if $todos.length === 0}
						<div class="flex items-center justify-center h-32 text-gray-400">
							<div class="text-center">
								<p class="text-sm mb-1">No tasks yet</p>
								<p class="text-xs">Add your first task below</p>
							</div>
						</div>
					{:else}
						{#each $todos as todo, index (todo.id)}
							<div 
								class="flex items-center justify-between ml-1 py-2 px-2 border-b border-gray-100 hover:bg-gray-50/50 rounded-lg transition-all duration-200 group focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-opacity-50 {focusedTodoIndex === index ? 'bg-blue-50 ring-2 ring-blue-400 ring-opacity-50' : ''} flex-shrink-0"
								in:flyBounce={{ x: -30, delay: Math.min(index * 30, 300) }}
								out:slide={{ duration: 200, easing: quintOut }}
								animate:flip={{ duration: 200, easing: quintOut }}
								role="listitem"
							>
								<button 
									bind:this={todoElements[index]}
									class="flex-1 text-left px-2 py-1 rounded-md transition-all duration-300 hover:bg-gray-50 focus:outline-none {todo.completed ? 'text-green-600 line-through' : 'text-gray-700'} text-sm min-w-0 truncate"
									onclick={() => toggleTodo(todo.id)}
									onkeydown={(e) => handleTodoKeyPress(e, todo.id, index)}
									onfocus={() => handleTodoFocus(index)}
									onblur={handleTodoBlur}
									aria-describedby="todo-{todo.id}-status todo-navigation-help"
									aria-label="Task {index + 1} of {$todos.length}: {todo.text}. {todo.completed ? 'Completed' : 'Incomplete'}. Use arrow keys to navigate, Enter or Space to toggle, Delete to remove."
									tabindex="{focusedTodoIndex === index || (focusedTodoIndex === -1 && index === 0) ? '0' : '-1'}"
									title="{todo.text}"
								>
									{todo.text}
								</button>
								<button 
									class="w-6 h-6 rounded-full flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-blue-400 focus:outline-none {todo.completed ? 'bg-green-100' : 'bg-orange-100'} {$justToggled.has(todo.id) ? 'animate-bounce-once' : ''} flex-shrink-0 ml-2"
									onclick={() => toggleTodo(todo.id)}
									aria-label="{todo.completed ? 'Mark task as incomplete' : 'Mark task as complete'}: {todo.text}"
									title="{todo.completed ? 'Mark as incomplete' : 'Mark as complete'}"
								>
									<span class="{$justToggled.has(todo.id) ? 'animate-pulse' : ''} text-sm">
										{todo.completed ? '😊' : '😕'}
									</span>
								</button>
								<span id="todo-{todo.id}-status" class="sr-only">
									{todo.completed ? 'Completed' : 'Incomplete'}
								</span>
							</div>
						{/each}
					{/if}
				</div>
				
				<!-- Navigation Help -->
				<div id="todo-navigation-help" class="sr-only">
					Keyboard navigation: Arrow keys to move between tasks, Enter or Space to toggle completion, Delete to remove task, Home/End to jump to first/last task.
				</div>
				
				<!-- Todo Count -->
				{#if $todos.length > 0}
					<div class="flex-shrink-0 px-2 py-1 text-center border-t border-gray-100">
						<p class="text-xs text-gray-500">
							{$todos.filter(t => !t.completed).length} of {$todos.length} tasks remaining
						</p>
					</div>
				{/if}
			</section>

			<!-- Add Todo -->
			<section aria-labelledby="add-todo-heading" class="flex-shrink-0 border-t border-gray-200 p-4 sm:p-6 md:p-8 pt-3 sm:pt-4">
				<h2 id="add-todo-heading" class="sr-only">Add New Task</h2>
				<div class="flex gap-2">
					<input
						id="todoInput"
						bind:this={inputElement}
						bind:value={newTodoText}
						onkeydown={handleKeyPress}
						placeholder="Add task..."
						class="flex-1 px-3 py-2 border rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 {validationMessage ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : isNearLimit ? 'border-yellow-400 focus:border-yellow-400 focus:ring-yellow-100' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'}"
						maxlength="50"
						aria-describedby="character-count {validationMessage ? 'validation-message' : ''}"
						aria-invalid={validationMessage ? 'true' : 'false'}
					/>
					<button
						onclick={addTodo}
						disabled={!canAdd || !!validationMessage || $isLoading}
						class="px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
						aria-label="Add new task"
					>
						{$isLoading ? '...' : 'Add'}
					</button>
				</div>
				
				<!-- Validation and Character Count -->
				<div class="flex justify-between items-center mt-2 text-xs">
					<div id="character-count" class="{isNearLimit ? 'text-yellow-600 font-medium' : 'text-gray-400'}">
						{characterCount}/50
					</div>
					{#if validationMessage}
						<div id="validation-message" class="text-red-500 font-medium" role="alert">
							{validationMessage}
						</div>
					{/if}
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