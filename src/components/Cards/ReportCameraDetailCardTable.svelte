<script>
  // core components
  import {API_URL} from "utils/constant.js";
  import { token } from "../../stores.js";
  import { toast } from '@zerodevx/svelte-toast';
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
  
  
  let index = 0;
  const increment = () => index += 1;


  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function reloadData(){
    await invalidate(API_URL+"area/");
  }

  function userAction(action, d) {
      switch (action) {
        case "detail":
          goto("/management/report/r_" + d.id );
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
    </div>
  </div>
  <div class="block w-full overflow-x-auto">
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
        {#each data as d}
            <tr>
              <td class="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                <span class="{color === 'light' ? 'btext-blueGray-600' : 'text-white'}">
                  {increment()}
                </span>
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
              >
                <!-- {d.type_id} --> Facemask
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
              >
                <!-- {d.camera_id} --> Huyberkiss
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
              >
                <!-- {d.class_id} --> Mask
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
              >
                {d.distance}
              </td>
              <td
                class="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
              >
                {new Date(d.created_at).toLocaleString("vi-VN")}
              </td>
              <td
                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
              >
                {#each action_list as action}
                  {#if user_object.role_id.name != "admin" && (action.name != "delete" && action.name != "edit" && action.name != "view")}
                    <button on:click={userAction(action.name, d)} class="btn text-2xl m-0.1 {action.color}">
                      <icon class={action.icon}></icon>
                    </button>
                  {:else if user_object.role_id.name == "admin" }
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
  </div>
</div>
