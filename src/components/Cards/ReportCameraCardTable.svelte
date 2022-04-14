<script>
  // core components
  import {API_URL} from "utils/constant.js";
  import { token } from "../../stores.js";
  import { toast } from '@zerodevx/svelte-toast';
  import TableDropdown from "components/Dropdowns/TableDropdown.svelte";
  import { page } from "$app/stores"
  import { goto, invalidate } from '$app/navigation';
  import { getContext } from 'svelte';
  import Confirmation from 'components/Modals/Confirmation.svelte';
  

  // can be one of light or dark
  export let color = "light";
  export let table_title;
  export let table_properties;
  export let data;
  export let action_list;
  export let user_object;
  export let area_id;

  const { open, close } = getContext('simple-modal');

  let token_value;
  token.subscribe((t) => (token_value = t));

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function reloadData(){
    await invalidate(API_URL+"camera/");
  }

    const handleClick = (d) => {
      goto("/management/report/camera_" + d.id);
    }

</script>

<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {color === 'light' ? 'bg-white' : 'bg-red-800 text-white'}"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3
          class="font-bold text-lg {color === 'light' ? 'text-blueGray-700' : 'text-white'}"
        >
          {table_title}s
        </h3>
      </div>
    </div>
  </div>
  <div class="block w-full overflow-x-auto">
    <div class="grid grid-cols-4 gap-4 px-5 text-center text-slate-700 font-bold">
      {#each data as d}
      <div class="bg-white rounded-lg p-3 cursor-pointer shadow-md rouded border-2" on:click={handleClick(d)}>
        <div>
          <img src={d.url} class="mb-3"/>
        </div>
        <div>{d.name}</div>
      </div>
      {/each}
    </div>
    <!-- Projects table -->

  </div>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
  </div>
</div>
