<script>
    import { onMount } from 'svelte'

    let IP = '14.161.73.85:81'
    let valid = false
    let processing = false
    let ivSteam

    let elModal
    let modal

    let elImg
    let lastImgUrl = ''

    $: {
        valid = /^\d{1,3}(\.\d{1,3}){3}(\:\d+)?$/.test(IP)
    }

    onMount(() => {
        import('bootstrap/dist/js/bootstrap').then(bootstrap => {
            modal = new bootstrap.Modal(elModal, { keyboard: false, backdrop: true })
        })
    })

    const blobToBase64 = blob => {
        const reader = new FileReader()
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result)
            }
        })
    }

    const process = () => {
        processing = true

        fetch(`/api/forward?ip=${IP}`)
            .then(resp => resp.json())
            .then(json => {
                if (!json.ok) throw null
                lastImgUrl = 'data:image/jpeg;base64,' + json.data
                elImg.src = lastImgUrl
                modal.show()
                stream()
            })
            .catch(err => {
                processing = false
                alert('Failed to fetch camera\'s image streaming.')
            })
    }

    const stream = () => {
        ivSteam = setInterval(() => {
            fetch(`/api/forward?ip=${IP}`)
            .then(resp => resp.json())
            .then(json => {
                lastImgUrl = 'data:image/jpeg;base64,' + json.data
                elImg.src = lastImgUrl
            })
        }, 100)
    }

    const close = () => {
        clearInterval(ivSteam)
        processing = false
        elImg.src = ''
        modal.hide()
    }
</script>

<section>
    <h1 class="fs-1 fw-bold text-bold mb-4">
		Video dectector
	</h1>
    <div class="mb-3">
        <a href="/">Back to home</a>
    </div>

    <div class="input-group mb-3 mt-4" style="max-width: 300px;">
        <span class="input-group-text"><i class="bi bi-camera-video" /></span>
        <input bind:value={IP} disabled={processing} type="text" class="form-control" placeholder="Enter a camera IP address" />
    </div>

    <button class="btn btn-primary" on:click={process} disabled={!valid || processing}>
    {#if processing}
        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        Processing...
    {:else}
        <i class="bi bi-lightning-charge-fill" /> Detect now
    {/if}
    </button>
</section>

<div bind:this={elModal} class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{IP}</h5>
            </div>
            <div class="modal-body">
                <img bind:this={elImg} alt="" />
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