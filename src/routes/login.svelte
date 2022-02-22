<script>

</script>

<section>
    <div class="container mx-auto px-4 h-full">
        <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-8/12 px-4">
                <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                    <div class="rounded-t mb-0 px-6 py-6">
                        <div class="text-blueGray-400 text-3xl text-center mb-3 font-bold">
                            <small>Login</small>
                        </div>
                        <form>
                            <div class="relative w-full mb-3">
                                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    for="grid-email">
                                    Email
                                </label>
                                <input id="grid-email" type="email"
                                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder="Email" />
                            </div>

                            <div class="relative w-full mb-3">
                                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    for="grid-password">
                                    Password
                                </label>
                                <input id="grid-password" type="password"
                                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder="Password" />
                            </div>
                            <div>
                                <label class="inline-flex items-center cursor-pointer">
                                    <input id="customCheckLogin" type="checkbox"
                                        class="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150" />
                                    <span class="ml-2 text-sm font-semibold text-blueGray-600">
                                        Remember me
                                    </span>
                                </label>
                            </div>

                            <div class="text-center mt-6">
                                <button
                                    class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                    type="button">
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="flex flex-wrap mt-6 relative">
                    <div class="w-1/2">
                        <a href="#pablo" on:click={(e)=> e.preventDefault()} class="text-blueGray-200">
                            <small>Forgot password?</small>
                        </a>
                    </div>
                    <div class="w-1/2 text-right">
                        <a use:link href="/auth/register" class="text-blueGray-200">
                            <small>Create new account</small>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</section>