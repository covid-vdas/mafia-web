<script>
  import { createEventDispatcher } from 'svelte'
  import generateNavigationOptions from './generateNavigationOptions'
  import {
    PREVIOUS_PAGE,
    NEXT_PAGE,
    ELLIPSIS
  } from 'components/Paginator/symbolTypes'

  const dispatch = createEventDispatcher()

  export let totalItems = 0
  export let pageSize = 1
  export let currentPage = 1
  export let limit = 0
  export let showStepOptions = false

  $: options = generateNavigationOptions({
    totalItems,
    pageSize,
    currentPage,
    limit,
    showStepOptions
  })

  $: totalPages = Math.ceil(totalItems / pageSize)

  function handleOptionClick (option) {
    dispatch('setPage', { page: option.value })
  }
</script>

<div class="pagination-nav flex">
  {#each options as option}
    <span
      class="option"
      class:number="{option.type === 'number'}"
      class:prev="{option.type === 'symbol' && option.symbol === PREVIOUS_PAGE}"
      class:next="{option.type === 'symbol' && option.symbol === NEXT_PAGE}"
      class:disabled="{
        (option.type === 'symbol' && option.symbol === NEXT_PAGE && currentPage >= totalPages) ||
        (option.type === 'symbol' && option.symbol === PREVIOUS_PAGE && currentPage <= 1)
      }"
      class:ellipsis="{option.type === 'symbol' && option.symbol === ELLIPSIS}"
      class:active="{option.type === 'number' && option.value === currentPage}"
      on:click="{() => handleOptionClick(option)}"
    >
      {#if option.type === 'number' && option.value !== currentPage}
        <div class="option number first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500">
          <slot name="number" value="{option.value}">
            <span>{option.value}</span>
          </slot>
        </div>
      {:else if option.type === 'symbol' && option.symbol === ELLIPSIS}
        <slot name="ellipsis">
          <span>...</span>
        </slot>
      {:else if option.type === 'symbol' && option.symbol === PREVIOUS_PAGE}
        <div class="option prev first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500">
          <slot name="prev">
            <i class="fa-solid fa-chevron-left"></i>
          </slot>
        </div>
      {:else if option.type === 'symbol' && option.symbol === NEXT_PAGE}
        <div class="option next first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500">
          <slot name="next ">
            <svg
              style="width:24px;height:24px"
              viewBox="0 0 24 24"
            >
              <path
                fill="#27272a"
                d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
              />
            </svg>
          </slot>
        </div>
        {:else if option.type === 'number' }
        <div class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 text-white bg-orange-500">
          <slot name="number" value="{option.value}">
            <span>{option.value}</span>
          </slot>
        </div>
      {/if}
    </span>
  {/each}
</div>