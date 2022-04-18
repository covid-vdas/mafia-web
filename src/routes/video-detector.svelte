<script>
    import { onMount } from 'svelte'

   
   /** @type {HTMLInputElement} */
   let fileInput

    let processing = false
    let uploaded = false
    let ratio;

    let elModal, modal
    let elVideo
    let valid = false;
    let detected_url = "";

    const cancel = () => {
        images = []
        results = []
        uploaded = false
        processing = false
        modal.hide()
    }

    const upload = () => {
        processing = true
        let done = 0
        
        const data = new FormData()
        data.append('video', elVideo.file)
        data.append('ratio', ratio)
        console.log(data)
        fetch(API_DETECT_URL+'detector/', {
            method: 'POST',
            body: data,
        })
            .then(resp => {
                if(resp.status == 200){

                }
            }
            ).catch(err => {
                console.log(err)
                processing = false
                alert('Failed to upload images.')
            })
       
    }

    onMount(() => {
        import('bootstrap/dist/js/bootstrap').then(bootstrap => {
            modal = new bootstrap.Modal(elModal, { keyboard: false, backdrop: true })
        })
    })

    const fileToUrl = (file) => new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(URL.createObjectURL(file))
        reader.readAsDataURL(file)
    })



    const onFileChange = async (e) => {
        const files = fileInput.files
        const vids = [...files]
            .filter(f => f.size !== 0)
            .map(async f => ({
                file: f,
                name: f.name,
                size: f.size,
                type: f.type,
                src: await fileToUrl(f)
            }))

        elVideo = await Promise.all(vids)
        uploaded = true
    }

    const close = () => {
        clearInterval(ivSteam)
        processing = false
        elImg.src = ''
        modal.hide()
    }
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <h1 class="fs-1 fw-bold text-bold mb-4">
		Video dectector
	</h1>
    <div class="mb-3">
        <a href="/">Back to home</a>
    </div>

    <input type="number" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-3/12 ease-linear
    transition-all duration-150 focus:outline-none" id="create-cam-ratio" step="any" bind:value={ratio} required/>

    {#if uploaded}
        {#if processing}
            <div class="spinner-border text-primary" role="status">
            </div>
            <p class="mt-2">Processing...</p>
        {:else}
            <p>
                {elVideo.length} Video selected
            </p>
            <div>
                {#each elVideo as vid}
                    <video src={vid.src} controls class="m-2" style="height: 400px" />
                {/each}
            </div>
            <button class="btn btn-primary mt-2" on:click={upload}>
                <i class="bi bi-lightning-charge-fill" /> Detect now
            </button>
            <a class="link link-danger mt-2" on:click={cancel}>Cancel</a>
        {/if}
    {:else}
        <button class="btn btn-success" on:click={() => fileInput.click()}>
            Select Video
        </button>
    {/if}

    <input
        bind:this={fileInput}
        on:change={onFileChange}
        hidden type="file"
        accept="video/mp4,video/x-m4v,video/*"
    />
</section>

<div bind:this={elModal} class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Detect Result</h5>
            </div>
            <div class="modal-body">
                <img bind:this={elVideo} alt="" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" on:click={close}>Close</button>
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