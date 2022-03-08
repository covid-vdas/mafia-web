<script>
  // core components
  import TableDropdown from "components/Dropdowns/TableDropdown.svelte";
  import { goto } from '$app/navigation';

  // can be one of light or dark
  export let color = "light";
  export let table_title;
  export let table_properties;
  export let data;
  export let action_list;

  function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function userAction(action, user) {
  switch (action) {
    case 'enable':
      break;
    case 'disable':
      break;
    case 'view':
      goto("/management/user/"+user.id+"_a_v");
      break;  
    case 'edit':
      break;
    case 'delete':
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
          {table_title}
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
        {#each data as d, i}
        <tr>
          <td class="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            <span class="ml-3 {color === 'light' ? 'btext-blueGray-600' : 'text-white'}">
              {i+1}
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
            {new Date(d.birthdate).toLocaleDateString()}
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
              <div> <i class="fas fa-circle text-emerald-500 mr-2"></i>Actived</div>
            {:else}
              <div> <i class="fas fa-circle text-rose-500 mr-2"></i>Deactived</div>
            {/if}
          </td>
          <td
            class="border-t-0 px-6 text-center align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
          >
            {new Date(d.updated_at).toLocaleString()}
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
          >
            {#each action_list as action}
              {#if action.name == "delete" && !d.is_active}
                <button on:click={userAction(action.name, d)} class="btn text-2xl m-0.1 text-rose-600 hover:text-rose-400">
                  <icon class={action.icon}></icon>
                </button>
              {:else if action.name == "enable" && !d.is_active}
                <button on:click={userAction(action.name, d)} class="btn text-2xl m-0.1 text-emerald-600 hover:text-emerald-400">
                  <icon class={action.icon}></icon>
                </button>
              {:else if action.name == "disable" && d.is_active}
                <button on:click={userAction(action.name, d)} class="btn text-2xl m-0.1 text-rose-600 hover:text-rose-400">
                  <icon class={action.icon}></icon>
                </button>
              {:else if action.name != "disable" && action.name != "enable" && action.name != "delete"}
                <button on:click={userAction(action.name, d)} class="btn text-2xl m-0.1 text-blue-800 hover:text-blue-400">
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
