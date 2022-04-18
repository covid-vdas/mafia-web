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

  let result_data;

  $: search_key = "";

  result_data = data.filter((d) => {
    return d.username != user_object.username;
  });

  const handleSearch = () => {
      let search_key_value = removeAccents(search_key).toLowerCase();
      if(search_key_value){
        result_data = data.filter((d) => {
        return (removeAccents(d.username).toLowerCase().includes(search_key_value) || removeAccents(d.fullname).toLowerCase().includes(search_key_value)) && d.username != user_object.username;
      })
      } else {
        result_data = data.filter((d) => {
          return d.username != user_object.username;
        });
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
    result_data = data.filter((d) => {
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
    {#if result_data.length == 0 || result_data == null}
      <div class="items-center text-center w-full bg-transparent border-collapse py-10">
        <div class="py-10 flex-col justify-center">
            <img class="mx-auto animate-bounce object-contain h-64 w-64 mb-3" src="/static/data-not-found.svg" alt="data-not-found"/>
            <h1 class="text-3xl font-semibold text-zinc-700">There Is No Data Available</h1>
          </div>
      </div>
    {:else}
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
          {#each result_data as d, i}
              <tr>
                <td class="border-t-0 text-center px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span class="{color === 'light' ? 'text-blueGray-600' : 'text-white'}">
                    {i + 1}
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
