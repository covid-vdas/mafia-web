<script>
    import { onMount } from 'svelte'

    /** @type {HTMLInputElement} */
    let fileInput

    let processing = false
    let images = []
    let uploaded = false

    let elModal, modal
    let results = []

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
        modal.hide()
    }

    const upload = () => {
        processing = true

        let done = 0
        images.forEach((v, i) => {
            const data = new FormData()
            data.append('image', v.file)

            fetch('http://127.0.0.1:8000/api/image/', {
                method: 'POST',
                body: data,
            })
                .then(resp => resp.json())
                .then(json => {
                    results = [...results, 'data:image/jpeg;base64,' + json.data]
                    if (++done >= images.length) {
                        modal.show()
                        processing = false
                    }
                })
                .catch(err => {
                    console.log(err)
                    processing = false
                    alert('Failed to upload images.')
                })
        })
    }
</script>

<!-- svelte-ignore a11y-missing-attribute -->

<section>
    <h1 class="fs-1 fw-bold text-bold mb-4">
		Image detector
	</h1>
    <a href="/">Back to home</a>
    
    <p class="mt-4"></p>

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
        <a class="link link-danger mt-2" on:click={cancel}>Cancel</a>
    {/if}
{:else}
    <button class="btn btn-success" on:click={() => fileInput.click()}>
        Select images
    </button>
{/if}

    <input
        bind:this={fileInput}
        on:change={onFileChange}
        hidden type="file" multiple
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
                <div class="container">
                {#each results as r}
                    <img src={r} />
                {/each}
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" on:click={cancel}>Close</button>
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