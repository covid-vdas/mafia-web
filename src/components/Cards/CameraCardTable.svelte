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


  const { open, close } = getContext('simple-modal');

  let token_value;
  token.subscribe((t) => (token_value = t));

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function reloadData(){
    await invalidate(API_URL+"camera/");
  }

  function userAction(action, d) {
      switch (action) {
        case 'view':
          goto("/management/camera/" + d.id + "_a_v");
          break;
        case 'edit':
          goto("/management/camera/" + d.id + "_a_e");
          break;
        case 'delete':
        open(Confirmation, {
            message: "Do you want to delete this Area.",
            title: "Confirmation",
            btn_title: "Yes",
            handleClick: () => {
              fetch(API_URL + "camera/" + d.id + "/", {
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
                    toast.push("Delete Area Successful", {
                      theme: {
                        '--toastBackground': 'white',
                        '--toastBarBackground': 'green',
                        '--toastColor': 'black',
                        '--toastBoxShadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      }
                    });
                  } else {
                    console.log(response);
                    toast.push("Delete Area Unsuccessful", {
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
                toast.push("Delete Area Unsuccessful", {
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
        <h3
          class="font-bold text-lg {color === 'light' ? 'text-blueGray-700' : 'text-white'}"
        >
          {table_title}s
        </h3>
      </div>
    </div>
  </div>
  <div class="block w-full overflow-x-auto">
    <div class="grid grid-cols-4 gap-4 p-3 text-center text-slate-700 font-bold">
      {#each data as d}
      <div class="bg-blue-200 rounded-lg p-4 cursor-pointer " on:click={handleClick(d)}>{d.name}</div>
      {/each}
    </div>
    <!-- Projects table -->

  </div>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <a href="/management/camera/create" class="btn bg-emerald-600 text-white">Create New {table_title}</a>
      </div>
    </div>
  </div>
</div>
