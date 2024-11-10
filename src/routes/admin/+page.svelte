<!-- src/routes/admin.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/auth';
	import { Navbar, NavBrand, Alert } from 'flowbite-svelte';

	let todaysTasks = [];
	let errorMsg = '';

	async function fetchTodaysTasks() {
		try {
			const today = new Date().toISOString().split('T')[0];

			const { data, error, status } = await supabase
				.from('calendar_days')
				.select('events')
				// .eq('date', today)
				.limit(1) // Limit to one row
				.single(); // Try to fetch a single row

			if (error && status !== 406) {
				errorMsg = 'Error fetching today’s tasks. Please try again later.';
				console.error("Error fetching today's tasks:", error.message);
			} else if (data) {
				todaysTasks = data.events;
			} else {
				todaysTasks = [];
			}
		} catch (error) {
			errorMsg = 'An unexpected error occurred.';
			console.error('Unexpected error:', error);
		}
	}

	

	async function completeTask(taskId) {
		try {
			const today = new Date().toISOString().split('T')[0];

			// Update the specific task in Supabase
			const { data, error } = await supabase
				.from('calendar_days')
				.update({
					events: todaysTasks.map((task) =>
						task.id === taskId ? { ...task, confirmed: true } : task
					)
				})
				.eq('date', today);

			if (error) {
				console.error('Error completing the task:', error.message);
				errorMsg = 'Error completing the task. Please try again.';
			} else {
				// Reflect the change in the local UI
				todaysTasks = todaysTasks.map((task) =>
					task.id === taskId ? { ...task, confirmed: true } : task
				);
			}
		} catch (error) {
			console.error('Unexpected error:', error);
			errorMsg = 'An unexpected error occurred while completing the task.';
		}
	}

	onMount(fetchTodaysTasks);
</script>

<Navbar class="border-b px-4 py-2 shadow-sm">
	<NavBrand href="/" class="text-xl font-semibold dark:text-blue-500">
		Concierge Admin Dashboard
	</NavBrand>
</Navbar>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-semibold mb-4">Today's Tasks</h1>

	{#if errorMsg}
		<Alert color="red" class="mb-4">
			<span class="font-medium">{errorMsg}</span>
		</Alert>
	{/if}

	{#if todaysTasks.length > 0}
		<ul class="space-y-4">
			{#each todaysTasks as task (task.id)}
				<li class="task-item bg-white p-4 shadow-sm rounded-lg">
					<p><strong>Guest:</strong> {task.guestName || 'Anonymous'}</p>
					<p><strong>Task:</strong> {task.summary}</p>
					<p>
						<strong>Time:</strong>
						{task.startDate
							? new Date(task.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
							: 'N/A'}
						-
						{task.endDate
							? new Date(task.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
							: 'N/A'}
					</p>
					<button
						class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
						on:click={() => completeTask(task.id)}
						disabled={task.confirmed}
					>
						{task.confirmed ? 'Completed' : 'Complete Task'}
					</button>
				</li>
			{/each}
		</ul>
	{:else if !errorMsg}
		<p>No tasks for today.</p>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
	}
	.task-item {
		border: 1px solid #e5e7eb;
	}
</style>