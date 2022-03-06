<script>
	import 'normalize.css/normalize.css'
	import 'bootstrap/dist/css/bootstrap.css'
	import 'bootstrap-icons/font/bootstrap-icons.css'
    import 'nprogress/nprogress.css'
	import '../app.css';
    import { user, token } from '../stores'
    import AdminNavbar from "components/Navbars/AdminNavbar.svelte";
    import Sidebar from "components/Sidebar/Sidebar.svelte";
	import FooterAdmin from'components/Footers/FooterAdmin.svelte'
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
    <Sidebar />
    <div class="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <div class="px-4 md:px-10 mx-auto w-full -m-24">
            <slot />
        </div>
        <FooterAdmin />
    </div>
</main>


