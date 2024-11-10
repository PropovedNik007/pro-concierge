<script lang="ts">
	import { fetchCalendarData } from '$lib/calendar';
	import ICAL from 'ical.js';
	import { onMount } from 'svelte';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		ImagePlaceholder,
		Skeleton,
		TextPlaceholder
	} from 'flowbite-svelte';

	import { supabase } from '$lib/auth';

	interface CalendarEvent {
		id: string;
		summary: string | null;
		startDate: Date | null;
		endDate: Date | null;
		isSuggested?: boolean;
		confirmed?: boolean;
		isInitial?: boolean;
	}

	interface Day {
		date: string;
		events: CalendarEvent[];
	}

	let events: CalendarEvent[] = [];
	let calendarUrl: string = '';
	let days: Day[] = [];

	onMount(() => {
		const savedCalendar = localStorage.getItem('calendarDays');
		if (savedCalendar) {
			const parsedDays: Day[] = JSON.parse(savedCalendar).map((day) => ({
				...day,
				events: day.events.map((event) => ({
					...event,
					startDate: event.startDate ? new Date(event.startDate) : null,
					endDate: event.endDate ? new Date(event.endDate) : null
				}))
			}));

			days = [...parsedDays]; // Ensure Svelte reactivity with a new reference
		}
	});

	interface Category {
		name: string;
		color: string;
	}

	const categories: Category[] = [
		{ name: 'Eating', color: '#FFCC00' },
		{ name: 'Meeting', color: '#0078D4' },
		{ name: 'Moving', color: '#FF5733' },
		{ name: 'Cleaning', color: '#33FFCC' },
		{ name: 'Cross-Selling', color: '#D700FF' },
		{ name: 'Business Task', color: '#1ABC9C' }
	];

	function getEventColor(summary: string | null): string {
		if (!summary) return '#cccccc';
		const category = categories.find((cat) =>
			summary.toLowerCase().includes(cat.name.toLowerCase())
		);
		return category ? category.color : '#cccccc';
	}


	function suggestTasks(days: Day[]) {
	days.forEach((day) => {
		if (day.events.length === 0) return;

		// Sort events by start time to determine the first and last tasks of the day
		day.events.sort((a, b) => (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0));

		const firstTask = day.events[0];
		const lastTask = day.events[day.events.length - 1];

		// Suggest Wake-Up one hour before the first task of the day if the first task is after 8 AM
		if (firstTask.startDate && firstTask.startDate.getHours() >= 8) {
			const wakeUpTime = new Date(firstTask.startDate);
			wakeUpTime.setHours(wakeUpTime.getHours() - 1);
			if (wakeUpTime.getHours() < 23 && wakeUpTime.getDate() === firstTask.startDate.getDate()) {
				day.events.push({
					id: `wake-up-${firstTask.id}`,
					summary: 'Wake-Up',
					startDate: wakeUpTime,
					endDate: new Date(wakeUpTime.getTime() + 30 * 60000),
					isSuggested: true
				});
			}
		}

		// Suggest Lunch at 12 PM, or earlier if it overlaps with the transfer
		let lunchStart = new Date(firstTask.startDate);
		lunchStart.setHours(12, 0, 0, 0);

		const afternoonTask = day.events.find((e) => e.startDate && e.startDate.getHours() >= 13);
		if (afternoonTask) {
			// If there's an afternoon task, place lunch 1 hour before it
			lunchStart = new Date(afternoonTask.startDate.getTime() - 60 * 60000);
		}

		const lunchEnd = new Date(lunchStart.getTime() + 60 * 60000);

		// Check for overlap with transfer
		if (afternoonTask && lunchEnd > new Date(afternoonTask.startDate.getTime() - 30 * 60000)) {
			// Place lunch 1.5 hours before the afternoon task to avoid overlap with transfer
			lunchStart = new Date(afternoonTask.startDate.getTime() - 90 * 60000);
			lunchEnd.setTime(lunchStart.getTime() + 60 * 60000);
		}

		if (lunchStart.getHours() < 23 && lunchStart.getDate() === firstTask.startDate.getDate()) {
			day.events.push({
				id: `lunch-${firstTask.id}`,
				summary: 'Lunch',
				startDate: lunchStart,
				endDate: lunchEnd,
				isSuggested: true
			});
		}

		// Suggest Transfer for events titled "meeting" or "conference," scheduled 30 minutes before start
		day.events.forEach((event) => {
			if (
				(event.summary?.toLowerCase().includes('meeting') ||
					event.summary?.toLowerCase().includes('conference')) &&
				event.startDate
			) {
				const transferTime = new Date(event.startDate);
				transferTime.setMinutes(transferTime.getMinutes() - 30);
				if (
					transferTime.getHours() < 23 &&
					transferTime.getDate() === event.startDate.getDate()
				) {
					day.events.push({
						id: `transfer-${event.id}`,
						summary: 'Transfer to Event Location',
						startDate: transferTime,
						endDate: new Date(transferTime.getTime() + 30 * 60000),
						isSuggested: true
					});
				}
			}
		});

		// Suggest cross-sell items after the last task of the day if before 11:00 PM
		if (lastTask.endDate || lastTask.startDate) {
			const crossSellStart = new Date(lastTask.endDate || lastTask.startDate!);
			crossSellStart.setMinutes(crossSellStart.getMinutes() + 30); // 30 mins after the last task

			// Relaxing Spa Session suggestion only if it ends before 11:00 PM
			const spaEnd = new Date(crossSellStart.getTime() + 60 * 60000); // 1-hour spa
			if (crossSellStart.getHours() < 23 && spaEnd.getHours() < 23 && spaEnd.getDate() === crossSellStart.getDate()) {
				day.events.push({
					id: `spa-${lastTask.id}`,
					summary: 'Relaxing Spa Session',
					startDate: crossSellStart,
					endDate: spaEnd,
					isSuggested: true
				});
			}

			// Dinner suggestion only if it starts and ends before 11:00 PM
			const dinnerStart = new Date(crossSellStart.getTime() + 90 * 60000); // 1.5 hours after spa start
			const dinnerEnd = new Date(dinnerStart.getTime() + 120 * 60000); // 2-hour dinner
			if (
				dinnerStart.getHours() < 23 &&
				dinnerEnd.getHours() < 23 &&
				dinnerStart.getDate() === lastTask.startDate?.getDate()
			) {
				day.events.push({
					id: `dinner-${lastTask.id}`,
					summary: 'Dinner Reservation',
					startDate: dinnerStart,
					endDate: dinnerEnd,
					isSuggested: true
				});
			}
		}
	});
}


	function calculateGridRowStart(event: CalendarEvent): number {
		if (!event.startDate) return 1;
		const startHour = event.startDate.getHours();
		const startMinute = event.startDate.getMinutes();
		const rowStart = Math.floor((startHour - 6) * 2 + startMinute / 30);
		return rowStart >= 1 && rowStart <= 34 ? rowStart : -1; // Return -1 if out of bounds
	}

	function calculateGridRowEnd(event: CalendarEvent): number {
		if (!event.startDate || !event.endDate) return 1;
		const durationHours = event.endDate.getHours() - event.startDate.getHours();
		const durationMinutes = event.endDate.getMinutes() - event.startDate.getMinutes();
		const span = Math.max(Math.ceil(durationHours * 2 + durationMinutes / 30), 1);
		return span;
	}

	function adjustEventTime(event: CalendarEvent, direction: number, day: Day) {
		if (!event.isSuggested) return;

		const newStartDate = new Date(event.startDate!);
		const newEndDate = new Date(event.endDate!);

		// Adjust start and end times
		newStartDate.setMinutes(newStartDate.getMinutes() + direction * 30);
		newEndDate.setMinutes(newEndDate.getMinutes() + direction * 30);

		// Update only the target event in the day
		day.events = day.events.map((e) =>
			e.id === event.id ? { ...e, startDate: newStartDate, endDate: newEndDate } : e
		);

		// Trigger reactivity by reassigning the `days` array
		days = [...days];
		console.log('adjustEventTime:', day.events);
		saveCalendarToLocalStorage();
	}

	function confirmEvent(event: CalendarEvent, day: Day) {
		day.events = day.events.map((e) => (e.id === event.id ? { ...e, confirmed: true } : e));

		days = [...days];

		const button = document.querySelector(`#confirm-btn-${event.id}`);
		if (button) {
			button.classList.add('ok-button-animated');
			setTimeout(() => {
				button.textContent = '✔'; // Replace with tick after animation
			}, 500);
		}

		console.log('confirmEvent:', day.events);
		pushDataToSupabase();
	}

	function cancelEvent(event: CalendarEvent, day: Day) {
		day.events = day.events.filter((e) => e.id !== event.id);

		days = [...days];
		console.log('cancelEvent:', day.events);
	}

	async function handleFetchCalendar() {
		if (calendarUrl) {
			try {
				const rawEvents = await fetchCalendarData(calendarUrl);
				const parsedEvents = rawEvents.map((event, index) => ({
					id: `url-event-${index}`,
					summary: typeof event.summary === 'string' ? event.summary : null,
					startDate:
						typeof event.startDate === 'string' || event.startDate instanceof Date
							? new Date(event.startDate)
							: null,
					endDate:
						typeof event.endDate === 'string' || event.endDate instanceof Date
							? new Date(event.endDate)
							: null,
					isInitial: true
				}));
				parseEvents(parsedEvents);
			} catch (error) {
				console.error('Failed to fetch calendar data:', error);
			}
		}
	}

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			const text = await file.text();
			parseICalData(text);
		}
	}

	function parseICalData(data: string) {
		const jcalData = ICAL.parse(data);
		const comp = new ICAL.Component(jcalData);
		const vevents = comp.getAllSubcomponents('vevent');

		const parsedEvents = vevents.map((vevent, index) => {
			const event = new ICAL.Event(vevent);
			return {
				id: `file-event-${index}`,
				summary: event.summary || 'No Title',
				startDate: event.startDate ? event.startDate.toJSDate() : null,
				endDate: event.endDate ? event.endDate.toJSDate() : null
			};
		});

		parseEvents(parsedEvents);
	}

	function parseEvents(rawEvents: CalendarEvent[]) {
		events = rawEvents;
		groupEventsByDay();
		suggestTasks(days);

		saveCalendarToLocalStorage();
	}

	function groupEventsByDay() {
		const eventsByDay: { [key: string]: CalendarEvent[] } = {};
		events.forEach((event) => {
			const date = event.startDate ? event.startDate.toDateString() : 'Unknown Date';
			if (!eventsByDay[date]) {
				eventsByDay[date] = [];
			}
			eventsByDay[date].push(event);
		});

		// Create a fresh reference to trigger reactivity
		days = Object.entries(eventsByDay).map(([date, events]) => ({ date, events }));
		saveCalendarToLocalStorage();
	}

	function saveCalendarToLocalStorage() {
		localStorage.setItem('calendarDays', JSON.stringify(days));
	}

	async function pushDataToSupabase() {
		const storedDays = localStorage.getItem('calendarDays');
		if (!storedDays) {
			console.log('No data in local storage to push.');
			return;
		}

		const daysData = JSON.parse(storedDays);

		try {
			const { data, error } = await supabase
				.from('calendar_days') // Ensure this table exists in Supabase
				.insert(daysData);

			if (error) {
				console.error('Error pushing data to Supabase:', error);
			} else {
				console.log('Data pushed to Supabase successfully:', data);
			}
		} catch (err) {
			console.error('Unexpected error:', err);
		}
	}
</script>

<Navbar class="start-0 top-0 z-20 w-full justify-center space-x-4 border-b px-5 py-3.5 sm:px-4 flex flex-col">
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-blue-500"
			>Concierge</span
		>
	</NavBrand>

	<input type="text" bind:value={calendarUrl} placeholder="Enter iCal URL" />
	<button on:click={handleFetchCalendar}>Load Calendar from URL</button>
	OR
	<input type="file" accept=".ics" on:change={handleFileUpload} />
	<!-- </NavUl> -->
</Navbar>

<div class="calendar-container">
	<div class="calendar-scroll-wrapper">
		<!-- Time Column for Desktop -->
		<div class="time-column desktop-only">
			{#each Array.from({ length: 18 }, (_, i) => 6 + i) as hour}
				<div class="time-slot">{hour}:00</div>
			{/each}
		</div>

		<!-- Main Calendar Wrapper -->
		<div class="calendar-wrapper">
			{#each days as day}
				<div class="calendar-grid">
					<!-- Time Column for Mobile -->
					<div class="time-column mobile-only">
						{#each Array.from({ length: 18 }, (_, i) => 6 + i) as hour}
							<div class="time-slot">{hour}:00</div>
						{/each}
					</div>
					<!-- Day Column with Events -->
					<div class="day-column">
						<h3 class="day-header">
							{new Date(day.date).toLocaleDateString('default', { day: 'numeric', month: 'short' })}
						</h3>
						<div class="events-column">
							{#each day.events as event}
								<div
									class="event-item {event.confirmed
										? 'accepted'
										: event.isSuggested
											? 'suggested'
											: event.isInitial
												? 'initial'
												: ''}"
									style="
									grid-row-start: {calculateGridRowStart(event)};
									grid-row-end: span {calculateGridRowEnd(event)};
									"
								>
									<div class="top">
										<!-- Event Time Display -->
										<div class="event-time">
											{event.startDate
												? event.startDate.toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit'
													})
												: 'N/A'} -
											{event.endDate
												? event.endDate.toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit'
													})
												: 'N/A'}
										</div>
										{#if event.isSuggested}
											<!-- Arrows at the Top -->
											<div class="event-controls top-controls">
												<button on:click={() => adjustEventTime(event, -1, day)}>&uarr;</button>
												<button on:click={() => adjustEventTime(event, 1, day)}>&darr;</button>
											</div>
										{/if}
									</div>
									<!-- Event Summary -->
									<div class="event-summary">{event.summary}</div>

									{#if event.isSuggested}
										<!-- OK and Cancel Buttons at the Bottom -->
										<div class="event-controls bottom-controls">
											<button on:click={() => cancelEvent(event, day)}>Cancel</button>
											<!-- <button on:click={() => confirmEvent(event, day)}>OK</button> -->
											<button id="confirm-btn-{event.id}" on:click={() => confirmEvent(event, day)}
												>OK</button
											>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.event-item {
		/* background-color: #b8d3f2; */
		border-radius: 4px;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		display: inline-block;
	}
	.event-item.initial {
		background-color: #b8d3f2; /* Light teal background */
		/* border-left: 4px solid #00796b;  */
		/* color: #004d40;  */
	}
	.event-item.accepted {
		background-color: #b8d3f2; /* Light green for accepted tasks */
		border-left: 4px solid #4caf50; /* Highlighted border */
	}

	.event-item.suggested {
		background-color: #f6ae2d; /* Light purple for suggested tasks */
		/* border-left: 4px solid #9b59b6; */
	}
	.calendar-container {
		display: flex;
		padding: 0.5rem;
		padding-left: 0;
	}

	.calendar-scroll-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.calendar-wrapper {
		height: 187rem;
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

	.calendar-grid {
		height: 187rem;
	}

	.time-column {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
		padding-left: 2rem;
		padding-top: 3rem;
		min-width: 60px;
		height: 187rem;
	}

	.time-slot {
		height: 2rem;
		font-size: 0.85rem;
	}

	.desktop-only {
		position: sticky;
		left: 0;
		z-index: 10;
		align-items: stretch;
		padding-left: 0.5rem;
		/* height: 102rem; */
	}

	.day-column {
		flex: 1;
		border-radius: 5px;
		min-width: 320px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 187rem;
	}

	.day-header {
		/* background-color: #4b3c2b; */
		/* color: #f5f5f5; */
		text-align: center;
		padding: 0.5rem;
		font-size: 1rem;
		font-weight: bold;
	}

	.events-column {
		display: grid;
		grid-template-rows: repeat(34, 5.5rem);
		padding: 0.5rem;
		opacity: 0.9;
		padding-top: 4rem;
	}
	.event-time {
		color: #183059;
		font-weight: bold;
	}
	.top {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		position: relative;
		top: 0.1rem;
		align-items: center;
	}
	.event-controls {
		display: flex;
		gap: 0.25rem;
		justify-content: flex-end;
		position: relative;
		top: 0.1rem;
	}
	.top-controls button {
		padding: 0.2rem 0.5rem;
		font-size: 0.7rem;
		background-color: #183059; /* Arrow buttons are blue */
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
	}
	/* Bottom Controls for OK and Cancel */
	.bottom-controls {
		justify-content: flex-end;
		display: flex;
		flex-direction: row;
		position: relative;
		bottom: 0.1rem;
		right: 0.1rem;
		align-items: center;
	}
	.bottom-controls button {
		padding: 0.2rem 0.5rem;
		font-size: 0.8rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
	}

	/* Button Colors */
	.bottom-controls button:nth-child(1) {
		background-color: transparent !important;
		color: #183059;
		text-decoration: underline;
	}

	.bottom-controls button:nth-child(2) {
		background-color: rgb(41, 36, 116); /* OK button - Yellow */
		color: #fff;
	}

	/* Hover and Active Effects for All Buttons */
	.event-controls button:hover {
		transform: scale(1.05);
		opacity: 0.9;
	}

	.event-controls button:active {
		transform: scale(0.95);
	}

	.mobile-only {
		display: none;
	}

	/* CSS for button animation */
	.ok-button-animated {
		animation: okToTick 0.5s forwards;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	@keyframes okToTick {
		0% {
			background-color: rgb(41, 36, 116);
			color: #fff;
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
			background-color: rgb(41, 36, 116);
		}
		100% {
			background-color: #28a745;
			transform: scale(1);
			color: #fff;
			content: '✔';
		}
	}

	@media (max-width: 768px) {
		.mobile-only {
			display: flex;
		}

		.desktop-only {
			display: none;
		}

		.calendar-wrapper {
			flex-direction: column;
		}

		.calendar-grid {
			display: flex;
			flex-direction: row;
			gap: 1rem;
		}

		.day-column {
			width: 100%;
		}
	}
</style>
