<script>
  // core components
  import {API_URL, PAGE_SIZE} from "utils/constant.js";
  import { token } from "../../stores.js";
  import { toast } from '@zerodevx/svelte-toast';
  import TableDropdown from "components/Dropdowns/TableDropdown.svelte";
  import { page } from "$app/stores"
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

  let items;

  $: search_key = "";

  $:  items = data.filter((d) => {
        return d.username != user_object.username;
      });
  let currentPage = 1
  let pageSize = PAGE_SIZE
  $: paginatedItems = paginate({ items, pageSize, currentPage })


  const handleSearch = () => {
      let search_key_value = removeAccents(search_key).toLowerCase();
      if(search_key_value){
        items = data.filter((d) => {
          return (removeAccents(d.username).toLowerCase().includes(search_key_value) || removeAccents(d.fullname).toLowerCase().includes(search_key_value)) && d.username != user_object.username;
        })
        currentPage = 1;
      } else {
        items = data.filter((d) => {
          return d.username != user_object.username;
        });
        currentPage = 1;
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
    await invalidate(API_URL+"user/");
    items = data.filter((d) => {
      return d.username != user_object.username;
    });
  }

  function userAction(action, user) {
      switch (action) {
        case 'enable':
          open(Confirmation, {
            message: "Do you want to enable this user.",
            title: "Confirmation",
            btn_title: "Yes",
            handleClick: () => {
              fetch(API_URL + "user/" + user.id + "/", {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json",
                  "Authorization": "Bearer " + token_value,
                },
                body: JSON.stringify({
                  "is_active": true,
                }),
              }).then(
                response => {
                  close(Confirmation)
                  if (response.status == 200 || response.status == 201) {
                    reloadData();
                    console.log("success");
                    toast.push("Enable user successfully", {
                      theme: {
                        '--toastBackground': 'white',
                        '--toastBarBackground': 'green',
                        '--toastColor': 'black',
                        '--toastBoxShadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      }
                    });
                  } else {
                    console.log(response);
                    toast.push("An error occurred while enabling user", {
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
                toast.push("An error occurred while enabling user", {
                  theme: {
                    '--toastBackground':'white',
                    '--toastBarBackground': 'red',
                    '--toastColor': 'black',
                    '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
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
        case 'disable':
          open(Confirmation, {
            message: "Do you want to disable this user.",
            title: "Confirmation",
            btn_title: "Yes",
            handleClick: () => {
              fetch(API_URL + "user/" + user.id + "/", {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json",
                  "Authorization": "Bearer " + token_value,
                },
                body: JSON.stringify({
                  "is_active": false,
                }),
              }).then(
                response => {
                  close(Confirmation);
                  if (response.status == 200 || response.status == 201) {
                    reloadData()
                    toast.push("Disable user successfully", {
                      theme: {
                        '--toastBackground': 'white',
                        '--toastBarBackground': 'green',
                        '--toastColor': 'black',
                        '--toastBoxShadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      }
                    });
                  } else {
                    console.log(response);
                    toast.push("An error occurred while disabling user", {
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
                toast.push("An error occurred while disabling user", {
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
        case 'view':
          goto("/management/user/" + user.id + "_a_v");
          break;
        case 'edit':
          goto("/management/user/" + user.id + "_a_e");
          break;
        case 'delete':
        open(Confirmation, {
            message: "Do you want to delete this user.",
            title: "Confirmation",
            btn_title: "Yes",
            handleClick: () => {
              fetch(API_URL + "user/" + user.id + "/", {
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
                    toast.push("Delete user successfully", {
                      theme: {
                        '--toastBackground': 'white',
                        '--toastBarBackground': 'green',
                        '--toastColor': 'black',
                        '--toastBoxShadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      }
                    });
                  } else {
                    console.log(response);
                    toast.push("An error occurred deleting user", {
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
                toast.push("An error occurred deleting user", {
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
        default:
      }
    }


    const sort_col_type = {
      "fullname": 0,
      "username": 0,
      "email": 0,
      "role" : 0,
      "status" : 0,
    }

    const sort_table = (col) => {
      if(col == "username" && sort_col_type.username <= 0 ){
        items = items.sort((a,b)=>{
          return removeAccents(a.username).toLowerCase().localeCompare(removeAccents(b.username).toLowerCase());
        })
        sort_col_type.username = 1;
      } else if (col == "username" && sort_col_type.username > 0) {
        items = items.sort((a,b)=>{
          return -1 * removeAccents(a.username).toLowerCase().localeCompare(removeAccents(b.username).toLowerCase());
        })
        sort_col_type.username = -1;
      }

      if(col == "full name" && sort_col_type.fullname <=0){
        items = items.sort((a,b)=>{
          return removeAccents(a.fullname).toLowerCase().localeCompare(removeAccents(b.fullname).toLowerCase());
        })
        sort_col_type.fullname = 1;
      } else if( col == "full name" && sort_col_type.fullname > 0 ){
        items = items.sort((a,b)=>{
          return -1 * removeAccents(a.fullname).toLowerCase().localeCompare(removeAccents(b.fullname).toLowerCase());
        })
        sort_col_type.fullname = -1;
      }

      if(col == "email" && sort_col_type.email <=0){
        items = items.sort((a,b)=>{
          return removeAccents(a.email).toLowerCase().localeCompare(removeAccents(b.email).toLowerCase());
        })
        sort_col_type.email = 1;
      } else if( col == "email" && sort_col_type.email > 0 ){
        items = items.sort((a,b)=>{
          return -1 * removeAccents(a.email).toLowerCase().localeCompare(removeAccents(b.email).toLowerCase());
        })
        sort_col_type.email = -1;
      }

      if(col == "role" && sort_col_type.role <=0){
        items = items.sort((a,b)=>{
          return removeAccents(a.role_id.name).toLowerCase().localeCompare(removeAccents(b.role_id.name).toLowerCase());
        })
        sort_col_type.role = 1;
      } else if( col == "role" && sort_col_type.role > 0 ){
        items = items.sort((a,b)=>{
          return -1 * removeAccents(a.role_id.name).toLowerCase().localeCompare(removeAccents(b.role_id.name).toLowerCase());
        })
        sort_col_type.role = -1;
      }

      if(col == "status" && sort_col_type.status <=0){
        items = items.sort((a,b)=>{
          return a.is_active && !b.is_active ? 1 : -1
        })
        sort_col_type.status = 1;
      } else if( col == "status" && sort_col_type.status > 0 ){
        items = items.sort((a,b)=>{
          return -1 * (a.is_active && !b.is_active ? 1 : -1);
        })
        sort_col_type.status = -1;
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
              class="px-6 cursor-pointer align-middle text-center text-white border border-solid py-3 font-bold text-xs uppercase border-l-1 border-r-1 whitespace-nowrap "
              on:click={() => {
                sort_table(prop);
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
                <td class="border-t-0 text-center px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span class="{color === 'light' ? 'text-blueGray-600' : 'text-white'}">
                    { (currentPage - 1) * pageSize +  i + 1}
                  </span>
                </td>
                <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {d.username}
                </td>
                <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {d.fullname}
                </td>
                <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {d.email}
                </td>
                <td
                  class="border-t-0 text-center px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {d.phone}
                </td>
                <td
                  class="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {new Date(d.birthdate).toLocaleDateString("vi-VN")}
                </td>
                <td
                  class="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {capitalizeFirstLetter(d.role_id.name)}
                </td>
                <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  {#if d.is_active}
                    <div> <i class="fas fa-circle text-emerald-500 mr-2"></i>Active</div>
                  {:else}
                    <div> <i class="fas fa-circle text-rose-500 mr-2"></i>Inactive</div>
                  {/if}
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
                    {#if (action.name == "enable"  || action.name == "delete") && !d.is_active}
                      <button on:click={userAction(action.name, d)} class="btn text-2xl m-0.1 {action.color}}">
                        <icon class={action.icon}></icon>
                      </button>
                    {:else if action.name == "disable" && d.is_active}
                      <button on:click={userAction(action.name, d)} class="btn text-2xl m-0.1 {action.color}">
                        <icon class={action.icon}></icon>
                      </button>
                    {:else if action.name != "disable" && action.name != "enable" && action.name != "delete"}
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
        <a href="/management/user/create" class="btn bg-emerald-600 text-white">Create New {table_title}</a>
      </div>
    </div>
  </div>
</div>
