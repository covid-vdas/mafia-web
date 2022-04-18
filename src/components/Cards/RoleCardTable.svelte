<script>
  // core components
  import {API_URL} from "utils/constant.js";
  import { token } from "../../stores.js";
  import { toast } from '@zerodevx/svelte-toast';
  import TableDropdown from "components/Dropdowns/TableDropdown.svelte";
  import CardLineChart from "components/Cards/CardLineChart.svelte";
  import { page } from "$app/stores"
  import { goto, invalidate } from '$app/navigation';
  import { getContext } from 'svelte';
  import Confirmation from 'components/Modals/Confirmation.svelte';
  import paginate from 'components/Paginator/paginate.js';
  import LightPaginationNav from 'components/Paginator/LightPaginationNav.svelte';



  // can be one of light or dark
  export let color = "light";
  export let table_title;
  export let table_properties;
  export let data;
  export let action_list;
  export let user_object;


  let result_data;
  let token_value;
  
  $: search_key = "";

  const { open, close } = getContext('simple-modal');
  
  token.subscribe((t) => (token_value = t));
  result_data = data;

  let items = result_data;
  let currentPage = 1
  let pageSize = 10
  $: paginatedItems = paginate({ items, pageSize, currentPage })

  const handleSearch = () => {
    console.log(search_key);
    if(search_key){
      result_data = data.filter((d) => {
      return d.name.includes(search_key);
    })
    } else {
      result_data = data;
    }
    
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function reloadData(){
    await invalidate(API_URL+"user/");
  }

  function userAction(action, role) {
      switch (action) {
        case 'view':
          goto("/management/role/" + role.id + "_a_v");
          break;
        case 'edit':
          goto("/management/role/" + role.id + "_a_e");
          break;
        default:
      }
    }
</script>

<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded {color === 'light' ? 'bg-white' : 'bg-red-800 text-white'}"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3
          class="font-semibold text-lg inline-block {color === 'light' ? 'text-blueGray-700' : 'text-white'}"
        >
          {table_title}
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
    <div class="flex-col">
    <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
          {#each table_properties as prop}
          <th
            class="px-6 align-middle text-center border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold {color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-red-700 text-red-200 border-red-600'}"
          >
            {prop}
          </th>
          {/each}
          </tr>
        </thead>
        <tbody>
          {#each paginatedItems as d,i}
              <tr>
                <td class="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span class="{color === 'light' ? 'btext-blueGray-600' : 'text-white'}">
                    { (currentPage - 1) * pageSize +  i + 1}
                  </span>
                </td>
                <td
                  class="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {capitalizeFirstLetter(d.name)}
                </td>
                <td
                  class="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {new Date(d.updated_at).toLocaleString("vi-VN")}
                </td>
                <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                >
                  {#each action_list as action}
                    <button on:click={userAction(action.name, d)} class="btn text-2xl m-0.1 {action.color}">
                      <icon class={action.icon}></icon>
                    </button>     
                  {/each}
                </td>
              </tr>   
          {/each}   
        </tbody>
      </table>
      <div class="mb-4">
        <LightPaginationNav
        totalItems="{items.length}"
        pageSize="{pageSize}"
        currentPage="{currentPage}"
        limit="{1}"
        showStepOptions="{true}"
        on:setPage="{(e) => currentPage = e.detail.page}"
      />
      </div>
    </div>
    {/if}
  </div>
</div>
