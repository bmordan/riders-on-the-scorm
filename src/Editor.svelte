<script>
    import { Link } from "svelte-routing"
    import Edit from "./Edit.svelte"
    import Preview from "./Preview.svelte"

    export let user_uid
    export let package_uid

    $: showPreview = false
 
</script>
<section>
    <h1>
        The Editor
        <button on:click={e => showPreview = !showPreview}>{showPreview ? "edit" : "preview"}</button>
        <Link to={`/users/${user_uid}`}>back</Link>
    </h1>
    <main>
        <section style="transform: rotateY({showPreview ? "180" : "0"}deg);">
            <Edit user_uid={user_uid} package_uid={package_uid} />
            <Preview user_uid={user_uid} package_uid={package_uid} />
        </section>
    </main>
</section>
<style>
    button {
        background-color: green;
        border-color: transparent;
        color: white;
        border-radius: 2px;
        width: 4rem;
        outline-color: transparent;
    }
    main {
        margin: auto;
        background-color: transparent;
        width: 90vw;
        height: 80vh;
        perspective: 2000px;
    }
    main > section {
        position: relative;
        width: 100%;
        height: 100%;
        border: solid 2px black;
        text-align: center;
        transition: transform 0.6s cubic-bezier(0.13, 0.77, 0.81, 1.21);
        transform-style: preserve-3d;
    }
</style>