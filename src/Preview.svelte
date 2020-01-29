<script>
    import markedex from "./marked-extended"
    export let content


</script>
<section id="html">
    <link href="/reset.css" rel="stylesheet">
    <header>
        <svg viewBox="0 0 560 118" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h560v94.913C456 74.575 360.667 69.49 274 79.66 144 94.913 62 123 0 116.947" fill="#16264D" fill-rule="evenodd"/></svg>
    </header>
    <main>
        {@html markedex(content)}
    </main>
</section>
<style>
    #html {
        position: relative;
        flex: 1 1 auto;
        overflow-y: scroll;
        text-align: left;
        -webkit-text-size-adjust: 100%;
        line-height: 1.75rem;
        font-size: 1rem;
        min-height: 64vh;
    }
    main {
        padding: 0 3rem;
        min-height: 65vh;
    }
</style>