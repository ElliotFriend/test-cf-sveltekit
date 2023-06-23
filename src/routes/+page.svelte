<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	import { Keypair, Server } from 'stellar-sdk'
	let kp = Keypair.random()

	let server = new Server('https://horizon.stellar.org')
	let feeStats = server.feeStats()

	let sep6info = fetch('https://testanchor.stellar.org/sep6/info')
	.then(res => res.json())
	.then(json => json)
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<Counter />

	<p>{kp.publicKey()}</p>

	{#await sep6info}
		<p>loading sep6 info...</p>
	{:then info}
		<pre><code>{JSON.stringify(info, null, 4)}</code></pre>
	{/await}

	{#await feeStats}
		<p>loading fee stats...</p>
	{:then stats}
		<pre><code>{JSON.stringify(stats, null, 4)}</code></pre>
	{/await}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
