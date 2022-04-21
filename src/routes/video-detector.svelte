<script>
    import { onMount } from 'svelte'
    import { MEDIA_DETECT_URL, API_DETECT_URL } from 'utils/constant.js'

   /** @type {HTMLInputElement} */
    let fileInput

    let processing = false
    let uploaded = false
    let ratio;

    let elModal, modal
    let elVideo
    let valid = false;
    $: detected_url = "";
    let ratio_valid = true;

    $: ratio_message = "";


    const cancel = () => {
        elVideo = []
        detected_url = []
        uploaded = false
        processing = false
        fileInput.value = '';
        modal.hide()
    }

    const upload = () => {
        processing = true
        const video_name = elVideo[0].name.split('.').slice(0, -1).join('.');
        console.log(elVideo[0])
        const data = new FormData()
        data.append('video', elVideo[0].file)
        data.append('ratio', ratio)
        
        ratio_valid = true;
        if(ratio <= 0 || !ratio){
            ratio_valid = false;
            ratio_message = "Ratio must be greater than zero";
            processing = false;
        }
        if(ratio_valid){
            fetch(API_DETECT_URL+'detector/', {
            method: 'POST',
            body: data,
        })
            .then(resp => {
                if(resp.status == 200){
                    detected_url = `${MEDIA_DETECT_URL}${encodeURIComponent(video_name)}.mp4`
                    console.log(detected_url);
                    modal.show()
                    processing = false
                }
            }
            ).catch(err => {
                console.log(err)
                processing = false
                alert('Failed to upload Video.')
            })
        }
        
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
        processing = false
        detected_url = ''
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
                {elVideo.length} Video selected
            </p>
            <div>
                {#each elVideo as vid}
                    <video src={vid.src} controls class="m-2" style="height: 400px">
                        <track kind="captions">
                    </video>
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
    <div class="modal-dialog modal-dialog-centered modal-lg relative w-full lg:w-3/12 my-6 mx-auto max-w-3xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Detect Result</h5>
            </div>
            <div class="modal-body flex justify-center text-center font-semibold text-xl">
                <h1> <p class="mb-2">Video Detected Successfully</p>
                    <p>Please click Download button to download the video!</p></h1>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn bg-emerald-600 text-white" on:click|preventDefault={async ()=> {
                    const image = await fetch(detected_url)
                    const imageBlog = await image.blob()
                    const imageURL = URL.createObjectURL(imageBlog)
                    const link = document.createElement('a')
                    link.href = imageURL
                    link.download = elVideo[0].name;
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }}> Download Video </button>
                <button type="button" class="btn bg-zinc-700 text-white" on:click={close}>Close</button>
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