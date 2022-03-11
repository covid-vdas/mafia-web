<script>
  import { page } from "$app/stores"

  // core component
  import UserDropdown from "components/Dropdowns/UserDropdown.svelte";

  let collapseShow = "hidden";

  function toggleCollapseShow(classes) {
    collapseShow = classes;
  }

</script>
<nav
  class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
  <div
    class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
    <!-- Toggler -->
    <button
      class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded"
      type="button" on:click={()=> toggleCollapseShow('bg-white m-2 py-3 px-6')}
      >
      <i class="fas fa-bars"></i>
    </button>
    <!-- Brand -->
    <a class="md:block text-center md:pb-2 inline-block text-5xl font-alata"
      href="/">
      V D A S
    </a>
    <!-- User -->
    <ul class="md:hidden items-center flex flex-wrap list-none">
      <li class="inline-block relative">
        <UserDropdown />
      </li>
    </ul>
    <!-- Collapse -->
    <div
      class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:shadow-none absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded {collapseShow}">
      <!-- Collapse header -->
      <div class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
        <div class="flex flex-wrap">
          <div class="w-6/12">
            <a class="md:block text-center md:pb-2 text-blueGray-600 mr-0 text-xl font-alata inline-block whitespace-nowrap uppercase font-bold p-4 px-0"
              href="/">
              V D A S
            </a>
          </div>
          <div class="w-6/12 flex justify-end">
            <button type="button"
              class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded"
              on:click={()=> toggleCollapseShow('hidden')}
              >
              <i class="fas fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <hr class="my-4 md:min-w-full" />
      <!-- Navigation -->

      <ul class="md:flex-col md:min-w-full flex flex-col list-none">
        <li class="items-center">
          <a href="/" class="text-sm uppercase py-3 font-bold block {$page.url.pathname=='/'? 'text-blue-700':''}">
            <i class="fas fa-tv mr-2 text-sm"></i>
            Dashboard
          </a>
        </li>

        <li class="items-center">
          <a href="/management/user/list" class="text-sm uppercase py-3 font-bold block {/^(\/management\/user\/)/.test($page.url.pathname) ? 'text-blue-700':''}">
            <i class="fas fa-users mr-2 text-sm"></i>
            User Management
          </a>
        </li>

        <li class="items-center">
          <a href="/management/role/list" class="text-sm uppercase py-3 font-bold block {/^(\/management\/role\/)/.test($page.url.pathname) ? 'text-blue-700':''}">
            <i class="fas fa-user-gear mr-2 text-sm"></i>
            Role Management
          </a>
        </li>

        <li class="items-center">
          <a href="/management/report/list" class="text-sm uppercase py-3 font-bold block {/^(\/management\/report\/)/.test($page.url.pathname) ? 'text-blue-700':''}">
            <i class="fa-solid fa-square-poll-horizontal mr-3 text-sm"></i>
            Reports
          </a>
        </li>

        <li class="items-center">
          <a href="/management/area/list" class="text-sm uppercase py-3 font-bold block {/^(\/management\/area\/)/.test($page.url.pathname) ? 'text-blue-700':''}">
            <i class="fas fa-map-marked mr-2 text-sm"></i>
            Area Management
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>
