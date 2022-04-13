<script context="module">
    /** @type {import('@sveltejs/kit').ErrorLoad} */
    export function load({ error, status }) {
        return {
            props: {
                title: `${status}: ${error.message}`
            }
        };
    }
</script>

<script>
    export let title;
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-col mt-7">
        <div class="text-9xl flex items-center justify-center mb-4 p-4 text-rose-500 ">
            <i class="fa-solid fa-bug fa-bounce"></i>
        </div>
        <div class="text-5xl flex items-center justify-center mb-3">
            Opps!! Something went wrong !!
        </div>
        <div class="w-full mb-12 mt-4 px-4 flex items-center justify-center text-rose-500 font-bold text-3xl">
            <h1>{title}</h1>
        </div>
    </div>
</section>
