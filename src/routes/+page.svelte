<!-- src/routes/login.svelte -->
<script>
	import { login } from '$lib/auth';
	import { goto } from '$app/navigation';
	// import { base } from '$app/paths';

	let email = '';
	let password = '';

	async function handleLogin() {
		try {
			const { user, role } = await login(email, password);
			if (role === 'admin') {
				console.log('role', role);
				goto(`/admin`);
			} else {
				console.log('role', role);
				goto(`/client`);
			}
		} catch (error) {
			alert('Login failed');
			console.error(error);
		}
	}
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

	// onMount(async () => {
	//     user = await getUser();
	//     if (!user || user.role !== 'admin') {
	//         goto('/'); // Redirect if not an admin
	//     }
	// });
</script>

<Navbar class="start-0 top-0 z-20 w-full justify-center border-b px-2 py-2.5 sm:px-4">
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-blue-500"
			>Concierge</span
		>
	</NavBrand>
	<!-- <NavHamburger /> -->
	<!-- <NavUl> -->
	<!-- <NavLi href="/admin">Hotels</NavLi>
	<NavLi href="/client">Customers</NavLi> -->

	<!-- </NavUl> -->
</Navbar>

<div class="container mx-auto">
	<div class="flex h-screen items-center justify-center">
		<div class="rounded bg-white p-8 shadow-md">
			<h1 class="mb-6 text-2xl font-semibold">Login</h1>
			<input type="email" bind:value={email} placeholder="Email" class="input" />
			<input type="password" bind:value={password} placeholder="Password" class="input" />
			<button on:click={handleLogin} class="btn">Login</button>
		</div>
	</div>
</div>
