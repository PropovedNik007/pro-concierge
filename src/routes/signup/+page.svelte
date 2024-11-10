<!-- src/routes/signup.svelte -->
<script>
    import { signUp } from '$lib/auth';  // Use signUp instead of login
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let role = 'client'; // Default role for signups

    async function handleSignUp() {
        try {
            await signUp(email, password, role);
            alert('Signup successful! Check your email to confirm.');
            goto('/'); // Redirect to login page after signup
        } catch (error) {
            alert('Signup failed');
            console.error(error);
        }
    }
</script>

<h1>Sign Up</h1>
<input type="email" bind:value={email} placeholder="Email" />
<input type="password" bind:value={password} placeholder="Password" />
<select bind:value={role}>
    <option value="client">Client</option>
    <option value="admin">Admin</option>
</select>
<button on:click={handleSignUp}>Sign Up</button>
