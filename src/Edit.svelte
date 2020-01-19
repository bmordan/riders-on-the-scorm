<script>
    import { Link } from "svelte-routing"
    import marked from "marked"
    
    export let uid
    export let pid

    $: promise = getPackage(pid)
    $: _package = {}
    $: page = 0
    $: pages = [""]
    $: html = marked(pages[page])
    $: showPreview = false
    $: saving = false

    const togglePreview = () => (showPreview = !showPreview)

    async function getPackage (pid) {
        const [result] = await fetch(`/users/${uid}/packages/${pid}`)
            .then(res => res.json())
            .catch(console.error)
        _package = result
        pages = _package.pages.map(p => atob(p.markdown))
        return _package
    }

    function onSave (_package, pages) {
        saving = true

        const body = _package.pages.map((packagePage, index) => {
            return {...packagePage, markdown: btoa(pages[index])}
        })

        const payload = {
			method: 'post',
			headers: new Headers({'content-type': 'application/json'}),
			body: JSON.stringify(body)
        }

        return fetch(`/users/${uid}/packages/${pid}/pages/update`, payload)
            .then(res => res.json())
            .then(([updatedPackage]) => {
                saving = false
                _package = updatedPackage
                pages = _package.pages.map(p => atob(p.markdown))
            })
            .catch(console.error)
    }

    function addPage () {
        saving = true

        fetch(`/users/${uid}/packages/${pid}/pages/new`)
            .then(res => res.json())
            .then(([updatedPackage]) => {
                saving = false
                _package = updatedPackage
                pages = _package.pages.map(p => atob(p.markdown))
                page = _package.pages.length - 1
            })
            .catch(console.error)
    }

    const nextPage = _package => page + 1 > pages.length - 1 ? page = page : page += 1
    const prevPage = () => page - 1 < 0 ? page = 0 : page -= 1
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
        {:then _package}
            <article class="edit">
                <h1>{_package.title} {page + 1} of {pages.length}</h1>
                <textarea id="markdown" name="markdown" focus=true bind:value={pages[page]}></textarea>
                <nav>
                    <button disabled={saving} on:click={e => onSave(_package, pages)}>Save{saving ? "ing..." : ""}</button>
                    <button on:click={togglePreview}>Preview</button>
                    <button disabled={page === 0 && !showPreview} on:click={prevPage}>prev</button>
                    <button disabled={page === pages.length - 1} on:click={e => nextPage(_package)}>next</button>
                    <button disabled={saving} on:click={addPage}>+</button>
                </nav>
            </article>
            <article class="preview">
                <article id="html">{@html html}</article>
                <nav>
                    <button disabled={page === 0} on:click={prevPage}>prev</button>
                    <button on:click={togglePreview}>Exit Preview</button>
                    <button disabled={page === pages.length - 1} on:click={e => nextPage(_package)}>next</button>
                </nav>
            </article>
        {/await}
    </section>
</section>
<style>
    .editor {
        margin: auto;
        background-color: transparent;
        width: 90vw;
        height: 80vh;
        perspective: 2000px;
    }
    .editor-flip-frame {
        position: relative;
        width: 100%;
        height: 100%;
        border: solid 2px black;
        text-align: center;
        transition: transform 0.6s cubic-bezier(0.13, 0.77, 0.81, 1.21);
        transform-style: preserve-3d;
    }
    .edit {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        background-color: hotpink;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
    }
    .preview {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        background-color: lime;
        transform: rotateY(180deg);
        display: flex;
        flex-direction: column;
    }
    #markdown, #html {
        border-color: transparent;
        resize: none;
        background-color: salmon;
        padding: 1rem;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        line-height: 1.25rem;
        flex: 1 1 auto;
        min-width: 0;
        min-height: 0;
        overflow-y: scroll;
        text-align: left;
    }
    nav {
        backface-visibility: hidden;
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