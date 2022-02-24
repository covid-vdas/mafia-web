<script>
	import 'normalize.css/normalize.css'
	import 'bootstrap/dist/css/bootstrap.css'
	import 'bootstrap-icons/font/bootstrap-icons.css'
    import 'nprogress/nprogress.css'
	import '../app.css';
	import FooterAdmin from'../components/Footers/FooterAdmin.svelte'
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
	<slot/>
</main>

<FooterAdmin/>

