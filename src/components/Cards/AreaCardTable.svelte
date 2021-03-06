<script>
  // core components
  import {API_URL, PAGE_SIZE} from "utils/constant.js";
  import { token } from "../../stores.js";
  import { toast } from '@zerodevx/svelte-toast';
  import { goto, invalidate } from '$app/navigation';
  import { getContext } from 'svelte';
  import Confirmation from 'components/Modals/Confirmation.svelte';
  import paginate from 'components/Paginator/paginate.js';
  import PaginationNav from 'components/Paginator/PaginationNav.svelte';


  // can be one of light or dark
  export let color = "light";
  export let table_title;
  export let table_properties;
  export let data;
  export let action_list;
  export let user_object;


  const { open, close } = getContext('simple-modal');

  let token_value;
  token.subscribe((t) => (token_value = t));

  $: search_key = "";


  $: items = data;
  let currentPage = 1
  let pageSize = PAGE_SIZE
  $: paginatedItems = paginate({ items, pageSize, currentPage })

  
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
    await invalidate(API_URL+"area/");
    result_data = data;
  }

  function userAction(action, d) {
      switch (action) {
        case 'view':
          goto("/management/area/" + d.id + "_a_v");
          break;
        case 'edit':
          goto("/management/area/" + d.id + "_a_e");
          break;
        case 'delete':
        open(Confirmation, {
            message: "Do you want to delete this Area.",
            title: "Confirmation",
            btn_title: "Yes",
            handleClick: () => {
              fetch(API_URL + "area/" + d.id + "/", {
                method: "DELETE",
                headers: {
                  "Content-type": "application/json",
                  "Authorization": "Bearer " + token_value,
                },
              }).then(
                response => {
                  close(Confirmation);
                  if (response.status == 200 || response.status == 201) {
                    reloadData()
                    toast.push("Deleted area successfully", {
                      theme: {
                        '--toastBackground': 'white',
                        '--toastBarBackground': 'green',
                        '--toastColor': 'black',
                        '--toastBoxShadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      }
                    });
                  } else {
                    console.log(response);
                    toast.push("An error occurred while deleting area", {
                      theme: {
                        '--toastBackground':'white',
                        '--toastBarBackground': 'red',
                        '--toastColor': 'black',
                        '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      }
                    });
                  }
                }).catch(error => {
                close(Confirmation);
                toast.push("An error occurred while deleting area", {
                  theme: {
                    '--toastBackground': 'white',
                    '--toastBarBackground': 'red',
                    '--toastColor': 'black',
                    '--toastBoxShadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',

                  }
                });
                console.log(error);
              });
            },
            closeModal: () => {
              close(Confirmation);
            }
          });
          break;
        case "detail":
          goto("/management/camera/list_" + d.id );
          break;
        default:
      }
    }

    const sort_col_type = {
      "name": 0
    }

    const sort_table = (col) => {
      if(col == "name" && sort_col_type.name <= 0 ){
        items = items.sort((a,b)=>{
          return removeAccents(a.name).toLowerCase().localeCompare(removeAccents(b.name).toLowerCase());
        })
        sort_col_type.name = 1;
      } else if (col == "name" && sort_col_type.name > 0) {
        items = items.sort((a,b)=>{
          return -1 * removeAccents(a.name).toLowerCase().localeCompare(removeAccents(b.name).toLowerCase());
        })
        sort_col_type.name = -1;
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
          class="font-semibold text-lg {color === 'light' ? 'text-blueGray-700' : 'text-white'}"
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
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead class="bg bg-blue-700">
          <tr>
          {#each table_properties as prop}
          <th
            class="px-6 align-middle text-center text-white border border-solid py-3 font-bold text-xs uppercase border-l-1 border-r-1 whitespace-nowrap "
            on:click={() => {
              sort_table(prop.toLowerCase());
            }}
          >
            {prop}
          </th>
          {/each}
          </tr>
        </thead>
        <tbody>
          {#each paginatedItems as d, i}
              <tr class="{i % 2 != 0? 'bg bg-slate-100': ''}">
                <td class="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span class="{color === 'light' ? 'btext-blueGray-600' : 'text-white'}">
                    { (currentPage - 1) * pageSize +  i + 1}
                  </span>
                </td>
                <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
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
                    {#if user_object.role_id.name == "staff" && action.name == "detail"}
                      <button on:click={userAction(action.name, d)} class="btn text-2xl m-0.1 {action.color}">
                        <icon class={action.icon}></icon>
                      </button>
                    {:else if user_object.role_id.name != "staff" }
                      <button on:click={userAction(action.name, d)} class="btn text-2xl m-0.1 {action.color}">
                        <icon class={action.icon}></icon>
                      </button>
                    {/if} 
                  {/each}
                </td>
              </tr>   
          {/each}   
        </tbody>
      </table>
      <PaginationNav
      totalItems="{items.length}"
      pageSize="{pageSize}"
      currentPage="{currentPage}"
      limit="{1}"
      showStepOptions="{true}"
      on:setPage="{(e) => currentPage = e.detail.page}"
      />
    {/if}
  </div>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        {#if user_object.role_id.name != "staff"}<a href="/management/area/create" class="btn bg-emerald-600 text-white">Create New {table_title}</a>{/if}
      </div>
    </div>
  </div>
</div>
