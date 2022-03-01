<script>
    const handleClick = () =>{
        alert("Chao Nhung Em be hieu hoc");
    }
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <h1>Chao day la user</h1>
    <button class="btn bg-slate-400" on:click|preventDefault="{handleClick}">Click me</button>
</section>
