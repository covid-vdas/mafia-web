<script context="module">

    import {protectedRedirect} from "utils/constant.js";

    /** @type {import('@sveltejs/kit').Load} */
    export async function load({session}){
        return protectedRedirect(session,{});
    }
</script>

<script>
</script>

<section class="relative w-full h-full py-40 min-h-screen">
	<div class="text-white px-6 py-4 border-0 rounded relative mb-4 bg-teal-500">
		<span class="text-xl inline-block mr-5 align-middle">
		<i class="fas fa-bell"></i>
		</span>
		<span class="inline-block align-middle mr-8">
		<b class="capitalize">orange!</b> This is a orange alert - check it out!
		</span>
		<button class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
		<span>×</span>
		</button>
	</div>
	<h1 class="fs-1 fw-bold text-bold mb-4">
		Welcome to VDAS
	</h1>
	<p class="fs-4 mb-5">
		COVID-19 Violation Detection Assistance System
	</p>
	<span>
		<a href="/image-detector" class="me-1">
			<button class="btn btn-primary btn-lg">
				<i class="bi bi-images" /> Detect images
			</button>
		</a>
		<a href="/video-detector" class="ms-1">
			<button class="btn btn-dark btn-lg">
				<i class="bi bi-play-btn" /> Detect video
			</button>
		</a>
	</span>
</section>
