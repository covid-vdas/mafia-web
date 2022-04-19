<script>
  // library for creating dropdown menu appear on click
  import { goto } from '$app/navigation';
  import {session} from '$app/stores';
  import { createPopper } from "@popperjs/core";
  import {user, token} from "../../stores.js"

  let user_value;
  let user_object;
  user.subscribe((u) => (user_value = u));
  if(user_value){
    user_object = JSON.parse(user_value);
  }
  
  // core components

  let dropdownPopoverShow = false;

  let btnDropdownRef;
  let popoverDropdownRef;

  const toggleDropdown = (event) => {
    event.preventDefault();
    if (dropdownPopoverShow) {
      dropdownPopoverShow = false;
    } else {
      dropdownPopoverShow = true;
      createPopper(btnDropdownRef, popoverDropdownRef, {
        placement: "bottom-start",
      });
    }
  };

  const logout = async (event) => {
    event.preventDefault();
    const response = fetch('/auth/api/logout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then(response =>{
      user.update((u) => u = "");
      token.update((t) => t = "");
      $session.user = false;
      goto("/auth/login");
      return response;
    })
  }
</script>

<div>
  <a
    class="text-blueGray-500 block"
    href="#pablo"
    bind:this="{btnDropdownRef}"
    on:click="{toggleDropdown}"
  >
    <div class="items-center flex">
      <span
        class="w-30 h-12 text-md text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full"
      >
        Welcome, {#if user_object}{user_object.username}{/if}! <i class="pl-3 fa-solid fa-angle-down"></i>
      </span>
    </div>
  </a>
  <div
    bind:this="{popoverDropdownRef}"
    class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 {dropdownPopoverShow ? 'block':'hidden'}"
  >
    <a sveltekit:prefetch
      href="/user/profile"
      class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
    >
      <i class="fa-solid fa-user mr-4"></i> User Profile
    </a>
    <div class="h-0 my-2 border border-solid border-blueGray-100" />
    <a
      href="#pablo" on:click={logout}
      class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
    >
    <i class="fa-solid fa-arrow-right-from-bracket mr-4"></i> Sign Out 
    </a>
  </div>
</div>
