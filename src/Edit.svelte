<script>
    import { Link } from "svelte-routing"
    import markedex from "./marked-extended"
    
    export let uid
    export let pid

    $: promise = getPackage(pid)
    $: _package = {pages: [{markdown: ""}]}
    $: page = 0
    $: showPreview = false
    $: current = _package.pages[page]
    $: html = showPreview ? markedex(_package.pages[page].markdown) : ""
    $: saving = false

    const togglePreview = () => (showPreview = !showPreview)

    async function getPackage (pid) {
        return _package = await fetch(`/users/${uid}/packages/${pid}`)
            .then(res => res.json())
            .catch(console.error)
    }

    function onSave () {
        saving = true

        const body = _package.pages

        const payload = {
			method: 'post',
			headers: new Headers({'content-type': 'application/json'}),
			body: JSON.stringify(body)
        }
        
        return fetch(`/users/${uid}/packages/${pid}/pages/update`, payload)
            .then(res => res.json())
            .then(updatedPackage => {
                saving = false
                _package = updatedPackage
            })
            .catch(err => {
                saving = false
                console.error(err)
            })
    }

    function addPage () {
        saving = true

        fetch(`/users/${uid}/packages/${pid}/pages/new`)
            .then(res => res.json())
            .then(updatedPackage => {
                saving = false
                _package = updatedPackage
                page = _package.pages.length - 1
                current = _package.pages[page]
            })
            .catch(err => {
                saving = false
                console.error(err)
            })
    }

    function removePage () {
        saving = true
        // many breaks here
        const pgid = _package.pages[page].uid

        fetch(`/users/${uid}/packages/${pid}/pages/${pgid}/delete`)
            .then(res => res.json())
            .then(updatedPackage => {
                saving = false
                _package = updatedPackage
                prevPage(page)
                current = _package.pages[page]
            })
            .catch(err => {
                saving = false
                console.error(err)
            })
    }

    const nextPage = () => {page + 1 > _package.pages.length - 1 ? page = page : page += 1}
    const prevPage = () => {page - 1 < 0 ? page = 0 : page -= 1}
</script>
<section class="editor">
    <nav>
        <Link to={`/users/${uid}`}>Exit</Link>
    </nav>
    <section class="editor-flip-frame" style="transform: rotateY({showPreview ? "180" : "0"}deg);">
        {#await promise}
            <article class="edit">
                <p>... fetching package {pid}</p>
            </article>
        {:then}
            <article class="edit">
                <h1>{_package.title} {page + 1} of {_package.pages.length}</h1>
                <div id="markdown">
                    <textarea name="markdown" focus=true bind:value={current.markdown} rows="25"></textarea>
                </div>
                <nav>
                    <button disabled={saving} on:click={onSave}>Save{saving ? "ing..." : ""}</button>
                    <button on:click={togglePreview}>Preview</button>
                    <button disabled={page === 0 && !showPreview} on:click={prevPage}>prev</button>
                    <button disabled={page === _package.pages.length - 1 && !showPreview} on:click={nextPage}>next</button>
                    <button disabled={saving} on:click={addPage}>+</button>
                    <button disabled={saving} on:click={removePage}>delete</button>
                </nav>
            </article>
            <article class="preview">
                <article id="html">{@html html}</article>
                <nav>
                    <button disabled={page === 0} on:click={prevPage}>prev</button>
                    <button on:click={togglePreview}>Exit Preview</button>
                    <button disabled={page === _package.pages.length - 1} on:click={nextPage}>next</button>
                </nav>
            </article>
        {/await}
    </section>
</section>
<style>
    .editor {
        margin: auto;
        background-color: transparent;
        width: 95vw;
        height: 90vh;
        perspective: 2000px;
    }
    .editor-flip-frame {
        position: relative;
        width: 100%;
        height: 100%;
        border: solid 2px black;
        box-sizing: border-box;
        text-align: center;
        transition: transform 0.6s cubic-bezier(0.13, 0.77, 0.81, 1.21);
        transform-style: preserve-3d;
    }
    .edit, .preview {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        background-color: hotpink;
        display: flex;
        flex-direction: column;
    }
    .edit h1 {
        padding: 0;
        margin: 0;
    }
    .preview {
        background-color: lime;
        transform: rotateY(180deg);
    }
    #markdown, #html {
        flex: 1 1 auto;
        overflow-y: scroll;
        text-align: left;
    }
    #markdown textarea {
        border-color: transparent;
        width: 100%;
        height: 100%;
        resize: none;
        background-color: salmon;
        padding: 1rem;
        font-family: 'courier new', 'Courier New', Courier, monospace;
        font-size: 1.25rem;
        line-height: 1.25rem;
    }
    #html {
        padding: 2rem;
    }
    nav {
        backface-visibility: hidden;
        background-color: blue;
    }
    nav > a {
        color: white !important;
    }
    button {
        width: 7rem;
        background-color: red;
        color: white;
        border-color: transparent;
        padding: 0.5rem;
        margin: 0.25rem;
        border-radius: 2px;
    }
    button:disabled {
        opacity: 0.4;
    }
</style>