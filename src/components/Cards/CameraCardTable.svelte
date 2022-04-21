<script>
  // core components
  import {API_URL, CAMERA_PAGE_SIZE} from "utils/constant.js";
  import { token } from "../../stores.js";
  import { toast } from '@zerodevx/svelte-toast';
  import TableDropdown from "components/Dropdowns/TableDropdown.svelte";
  import { page } from "$app/stores"
  import { goto, invalidate } from '$app/navigation';
  import { getContext } from 'svelte';
  import Confirmation from 'components/Modals/Confirmation.svelte';
  import PaginationNav from 'components/Paginator/PaginationNav.svelte';
  import paginate from 'components/Paginator/paginate.js';

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

  $: search_key = "";

  $: items = data;
  let currentPage = 1
  let pageSize = CAMERA_PAGE_SIZE
  $: paginatedItems = paginate({ items, pageSize, currentPage })

  items = data;

  const handleSearch = () => {
      let search_key_value = removeAccents(search_key).toLowerCase();
      if(search_key_value){
        items = data.filter((d) => {
        return removeAccents(d.name).toLowerCase().includes(search_key_value);
                });
        currentPage = 1;
      } else {
        items = data;
        currentPage = 1;
      }
      
    }

  
  function removeAccents(str) {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }


  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function reloadData(){
    await invalidate(API_URL+"camera/");
  }

    const handleClick = (d) => {
      goto("/management/camera/" + d.id + "_a_v");
    }

</script>

<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {color === 'light' ? 'bg-white' : 'bg-red-800 text-white'}"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <a sveltekit:prefetch href={"/management/area/list"} class="mr-3 text-xl"><i class="fa-solid fa-angle-left"></i></a>
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
    {#if items.length == 0 || items == null}
      <div class="items-center text-center w-full bg-transparent border-collapse py-10">
        <div class="py-10 flex-col justify-center">
            <img class="mx-auto animate-bounce object-contain h-64 w-64 mb-3" src="/static/data-not-found.svg" alt="data-not-found"/>
            <h1 class="text-3xl font-semibold text-zinc-700">There Is No Data Available</h1>
          </div>
      </div>
    {:else}
      <div class="grid grid-cols-4 gap-4 px-5 text-center text-slate-700 font-bold">
        {#each paginatedItems as d,i}
        <div class="bg-white rounded-lg p-3 cursor-pointer shadow-md rouded border-2 grid grid-rows-1" on:click={handleClick(d)}>
          <div class="row-span-1">
            <img id={"camera_"+i} src={d.url} on:error={(e) =>{
              let source = e.target;
              source.setAttribute("src", "/static/error_placeholder.png");
            }}  alt="camera stream" class="object-cover object-center w-full h-60"/>
          </div>
          <div class="row-span-1 text-center items-center mt-3">{d.name}</div>
        </div>
        {/each}
      </div>
      <PaginationNav
      totalItems="{items.length}"
      pageSize="{pageSize}"
      currentPage="{currentPage}"
      limit="{1}"
      showStepOptions="{true}"
      on:setPage="{(e) => currentPage = e.detail.page}"
      />
    <!-- Projects table -->
    {/if}
  </div>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        {#if user_object.role_id.name != "staff"}<a href={"/management/camera/create_"+area_id} class="btn bg-emerald-600 text-white">Create New {table_title}</a>{/if}
      </div>
    </div>
  </div>
</div>
