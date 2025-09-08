import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Todo {
	id: number;
	text: string;
	completed: boolean;
}

// Initial default todos
const defaultTodos: Todo[] = [
	{ id: 1, text: 'Buy new sweatshirt', completed: true },
	{ id: 2, text: 'Read an article', completed: true },
	{ id: 3, text: 'Write blog post', completed: false },
	{ id: 4, text: 'Watch "Mr Robot"', completed: false },
	{ id: 5, text: 'Run', completed: false }
];

// Load initial todos from localStorage or use defaults
function loadTodos(): Todo[] {
	if (!browser) return defaultTodos;
	
	try {
		const saved = localStorage.getItem('svelte-todos');
		if (saved) {
			return JSON.parse(saved);
		}
	} catch (error) {
		console.warn('Failed to load todos from localStorage:', error);
	}
	
	return defaultTodos;
}

// Create the main todos store
export const todos = writable<Todo[]>(loadTodos());

// Create a store for the next ID
function createNextIdStore() {
	const initialTodos = loadTodos();
	const initialNextId = initialTodos.length > 0 
		? Math.max(...initialTodos.map(t => t.id)) + 1 
		: 1;
	
	return writable<number>(initialNextId);
}

export const nextId = createNextIdStore();

// Loading state store
export const isLoading = writable<boolean>(false);

// Recently toggled todos for animations
export const justToggled = writable<Set<number>>(new Set());

// Auto-save to localStorage whenever todos change
if (browser) {
	todos.subscribe(value => {
		try {
			localStorage.setItem('svelte-todos', JSON.stringify(value));
		} catch (error) {
			console.error('Failed to save todos to localStorage:', error);
		}
	});
}

// Todo actions
export const todoActions = {
	// Add a new todo
	add: (text: string) => {
		if (!text.trim()) return;
		
		nextId.update(id => {
			todos.update(currentTodos => [
				...currentTodos,
				{
					id: id,
					text: text.trim(),
					completed: false
				}
			]);
			return id + 1;
		});
	},

	// Toggle todo completion status
	toggle: (id: number) => {
		// Add to animation tracking
		justToggled.update(set => {
			set.add(id);
			return set;
		});
		
		todos.update(currentTodos => 
			currentTodos.map(todo => 
				todo.id === id 
					? { ...todo, completed: !todo.completed }
					: todo
			)
		);
		
		// Remove from animation tracking after animation completes
		setTimeout(() => {
			justToggled.update(set => {
				set.delete(id);
				return set;
			});
		}, 600);
	},

	// Remove a todo
	remove: (id: number) => {
		todos.update(currentTodos => 
			currentTodos.filter(todo => todo.id !== id)
		);
	},

	// Clear all completed todos
	clearCompleted: () => {
		todos.update(currentTodos => 
			currentTodos.filter(todo => !todo.completed)
		);
	},

	// Mark all todos as completed
	completeAll: () => {
		todos.update(currentTodos => 
			currentTodos.map(todo => ({ ...todo, completed: true }))
		);
	},

	// Reset to default todos
	reset: () => {
		todos.set(defaultTodos);
		nextId.set(Math.max(...defaultTodos.map(t => t.id)) + 1);
	}
};

// Derived stores for computed values
import { derived } from 'svelte/store';

export const completedCount = derived(
	todos,
	$todos => $todos.filter(todo => todo.completed).length
);

export const remainingCount = derived(
	todos,
	$todos => $todos.filter(todo => !todo.completed).length
);

export const allCompleted = derived(
	[todos, remainingCount],
	([$todos, $remainingCount]) => $todos.length > 0 && $remainingCount === 0
);