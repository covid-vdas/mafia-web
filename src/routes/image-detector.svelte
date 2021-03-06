<script>
    import { onMount } from 'svelte'
    import { API_DETECT_URL, MEDIA_DETECT_URL } from 'utils/constant.js'

    /** @type {HTMLInputElement} */
    let fileInput

    let processing = false
    let images = []
    let uploaded = false
    let ratio;

    let elModal, modal
    let results = []

    let ratio_valid = true;

    $: ratio_message = "";
    

    onMount(() => {
        import('bootstrap/dist/js/bootstrap').then(bootstrap => {
            modal = new bootstrap.Modal(elModal, { keyboard: false, backdrop: false })
        })
    })

    const fileToUrl = (file) => new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(URL.createObjectURL(file))
        reader.readAsDataURL(file)
    })

    const onFileChange = async (e) => {
        const files = fileInput.files
        const imgs = [...files]
            .filter(f => f.size !== 0)
            .map(async f => ({
                file: f,
                name: f.name,
                size: f.size,
                type: f.type,
                src: await fileToUrl(f)
            }))

        images = await Promise.all(imgs)
        uploaded = true
    }

    const cancel = () => {
        images = []
        results = []
        uploaded = false
        processing = false
        ratio = 1
        ratio_valid = true
        fileInput.value = ''
        modal.hide()
    }

    const upload = () => {
        processing = true
        let done = 0
        ratio_valid = true;
        if(ratio <= 0 || !ratio){
            ratio_valid = false;
            ratio_message = "Ratio must be greater than zero";
            processing = false
        }

        if(ratio_valid){
            images.forEach((v, i) => {
            processing = true;
            const data = new FormData()
            data.append('img', v.file)
            data.append('ratio', ratio)
            fetch(API_DETECT_URL+'detector/', {
                method: 'POST',
                body: data,
            })
                .then(resp => {
                    if(resp.status == 200){
                        let detected_url = `${MEDIA_DETECT_URL}${encodeURIComponent(v.name)}`
                        results = [...results, detected_url];
                        if (++done >= images.length) {

                            modal.show()
                            processing = false
                        }
                    }
                }
                ).catch(err => {
                    console.log(err)
                    processing = false
                    alert('Failed to upload images.')
                })
        })
        }
    }
</script>

<!-- svelte-ignore a11y-missing-attribute -->

<section class="relative w-full h-full py-40 min-h-screen">
    <h1 class="fs-1 fw-bold text-bold mb-4">
		Image detector
	</h1>
    <a href="/">Back to home</a>
    
    <p class="mt-4"></p>

    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-cam-ratio">
        Ratio
    </label>
    <input type="number" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-2/12 ease-linear
    transition-all duration-150 focus:outline-none" id="create-cam-ratio" step="any" bind:value={ratio} required/>
    {#if !ratio_valid}
        <p class="text-rose-600 text-left text-md font-semibold mb-3">{ratio_message}</p>
    {/if}

{#if uploaded}
    {#if processing}
        <div class="spinner-border text-primary" role="status">
        </div>
        <p class="mt-2">Processing...</p>
    {:else}
        <p>
            {images.length} images selected
        </p>
        <div>
            {#each images as img}
                <img src={img.src} class="m-2" style="height: 200px" />
            {/each}
        </div>
        <button class="btn btn-primary mt-2" on:click={upload}>
            <i class="bi bi-lightning-charge-fill" /> Detect now
        </button>
        <a class="link link-danger mt-2 hover:cursor-pointer" on:click={cancel}>Cancel</a>
    {/if}
{:else}
    <button class="btn btn-success" on:click={() => fileInput.click()}>
        Select images
    </button> 
{/if}

    <input
        bind:this={fileInput}
        on:change={onFileChange}
        hidden type="file"
        accept="image/png, image/gif, image/jpeg"
    />
</section>

<div bind:this={elModal} class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Result</h5>
            </div>
            <div class="modal-body">
                <div class="container flex justify-center">
                {#each results as r}
                    <img src={r} alt="detected Image"/>
                {/each}
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn bg-emerald-600 text-white" on:click|preventDefault={async ()=> {
                    const image = await fetch(results[0])
                    const imageBlog = await image.blob()
                    const imageURL = URL.createObjectURL(imageBlog)
                    const link = document.createElement('a')
                    link.href = imageURL
                    link.download = images[0].name;
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }}> Download Image </button>
                <button type="button" class="btn bg-slate-200" on:click={cancel}>Close</button>
            </div>
        </div>
    </div>
</div>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>