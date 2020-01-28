
<script>
    const msg = "Hello World"

    $: pages = []

    fetch('pages.json')
    .then(res => res.json())
    .then(_pages => pages = _pages)
    .catch(console.error)
</script>
<h1>{msg.toUpperCase()}</h1>
<h2>its {new Date().toISOString()}</h2>
<h3>I have {pages.length} pages</h3>
<style>
    h1 {
        color: hotpink;
    }
</style>