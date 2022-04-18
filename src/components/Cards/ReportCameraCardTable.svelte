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

  let result_data;

  $: search_key = "";

  result_data = data;

  const handleSearch = () => {
      let search_key_value = removeAccents(search_key).toLowerCase();
      if(search_key_value){
        result_data = data.filter((d) => {
        return removeAccents(d.name).toLowerCase().includes(search_key_value);
      })
      } else {
        result_data = data;
      }
      
    }

  
  function removeAccents(str) {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

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
        <a sveltekit:prefetch href={"/management/report/list"} class="mr-3 text-xl"><i class="fa-solid fa-angle-left"></i></a>
        <h3
          class="font-bold inline-block text-lg {color === 'light' ? 'text-blueGray-700' : 'text-white'}"
        >
          {table_title}s
        </h3>
      </div>
      <div class="inline-flex flex-row-reverse px-4 ">
        <div class="relative flex w-full flex-wrap items-stretch">
          <span class="px-2 py-2 leading-snug font-normal absolute text-center text-zinc-300 bg-transparent rounded items-center justify-center text-lg">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
          <input class="pl-9 bg-white placeholder-zinc-300 rounded-md text-sm w-full ease-linear
          transition-all duration-150 focus:outline-none" type="text" bind:value={search_key} on:change={() => handleSearch()}/>
        </div>
      </div>
    </div>
  </div>
  <div class="block w-full overflow-x-auto">
    {#if result_data.length == 0 || result_data == null}
      <div class="items-center text-center w-full bg-transparent border-collapse py-10">
        <div class="py-10 flex-col justify-center">
            <img class="mx-auto animate-bounce object-contain h-64 w-64 mb-3" src="/static/data-not-found.svg" alt="data-not-found"/>
            <h1 class="text-3xl font-semibold text-zinc-700">There Is No Data Available</h1>
          </div>
      </div>
    {:else}
      <div class="grid grid-cols-4 gap-4 px-5 text-center text-slate-700 font-bold">
        {#each result_data as d}
        <div class="bg-white rounded-lg p-3 cursor-pointer shadow-md rouded border-2 grid grid-rows-1" on:click={handleClick(d)}>
          <div class="row-span-1 mb-3">
            <img src={d.url}
            on:error={(e) =>{
              let source = e.target;
              source.setAttribute("src", "/static/error_placeholder.png");
            }}
            alt="camera stream" class="object-cover object-center w-full h-full"/>
          </div>
          <div class="row-span-1 text-center items-center">{d.name}</div>
        </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
  </div>
</div>

<style>
  img { 
    object-fit: contain!important;;
  }
</style>
