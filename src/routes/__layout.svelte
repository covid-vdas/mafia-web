<script context="module">
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({session}){
        
        if(!session.user){
            return{
                status: 302,
                redirect: '/auth/login'
            }
        }

        return{
        };
    }
</script>

<script>
	import 'normalize.css/normalize.css';
	import 'bootstrap/dist/css/bootstrap.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
    import 'nprogress/nprogress.css';
	import '../app.css';
    import { browser } from '$app/env';
    import Modal from 'svelte-simple-modal'; 
    import { SvelteToast } from '@zerodevx/svelte-toast';
    import AdminNavbar from "components/Navbars/AdminNavbar.svelte";
    import Sidebar from "components/Sidebar/Sidebar.svelte";
	import FooterAdmin from'components/Footers/FooterAdmin.svelte';
	import NProgress from 'nprogress';

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


{#if browser}
    <SvelteToast options={{ reversed: true, intro: { y: 192 } }} />
    <Modal unstyled={true} closeButton={false}
    classBg="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
    classWindowWrap=""
    classWindow=""
    classContent="">
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
    </Modal>
{/if}

<style>
    :root {
      --toastContainerTop: auto;
      --toastContainerRight: auto;
      --toastContainerBottom: 8rem;
      --toastContainerLeft: calc(90vw - 8rem);
      --toastBorderRadius: 0.25rem;
    }
  </style>

