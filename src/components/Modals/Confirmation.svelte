<script>
    export let message = 'Default message';
    export let title;
    export let handleClick;
    export let btn_title;
    export let closeModal;
  </script>
  
<div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
  <div class="relative w-full lg:w-3/12 my-6 mx-auto max-w-3xl">
    <!--content-->
    <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
      <!--header-->
      <div class="flex items-start justify-between pl-5 py-3  border-b border-solid border-blueGray-200 rounded-t">
        <h3 class="text-3xl font-semibold">
          {title}
        </h3>
        <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
          <span class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
            ×
          </span>
        </button>
      </div>
      <!--body-->
      <div class="relative p-6 flex-auto">
        <p class="my-4 text-blueGray-500 text-lg leading-relaxed">
          {message}
        </p>
      </div>
      <!--footer-->
      <div class="flex items-center justify-end px-6 py-3 border-t border-solid border-blueGray-200 rounded-b">
        <button on:click={closeModal} class="text-rose-500 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" >
          Close
        </button>
        <button on:click={handleClick} class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-4 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
          {btn_title}
        </button>
      </div>
    </div>
  </div>
</div>
<div class="opacity-25 fixed inset-0 z-40 bg-black"></div>