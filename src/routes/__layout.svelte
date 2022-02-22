<script>
	import 'normalize.css/normalize.css'
	import 'bootstrap/dist/css/bootstrap.css'
	import 'bootstrap-icons/font/bootstrap-icons.css'
    import 'nprogress/nprogress.css'
	import '../app.css';

	import NProgress from 'nprogress'

	NProgress.configure({
        minimum: 0.1,
        showSpinner: false,
    })
</script>

<svelte:window
    on:sveltekit:navigation-start={() => {
        NProgress.start()
    }}
    on:sveltekit:navigation-end={() => {
        NProgress.done()
    }}
/>

<svelte:head>
	<title>COVID-19 VDAS</title>
	<script src="https://kit.fontawesome.com/3c27956f64.js" crossorigin="anonymous"></script>
</svelte:head>

<main>
	<slot />
</main>

<footer>
	<p>{new Date().getFullYear()} &copy; Mafia Team</p>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	:global(i.bi) {
		font-size: 90%;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
