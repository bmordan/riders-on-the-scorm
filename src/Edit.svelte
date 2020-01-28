<script>
    import { Link } from "svelte-routing"
    import Preview from "./Preview.svelte"
    
    export let uid
    export let pid

    $: promise = getPackage(pid)
    $: _package = {pages: [{markdown: ""}]}
    $: page = 0
    $: showPreview = false
    $: current = _package.pages[page]
    $: html = showPreview ? _package.pages[page].markdown : ""
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
        <Link to={`/users/${uid}`}><button>Exit</button></Link>
        <button disabled={saving} on:click={onSave}>Save{saving ? "ing..." : ""}</button>
        <button on:click={togglePreview}>{showPreview ? 'Editor' : 'Preview'}</button>
        <button disabled={page === 0 && !showPreview} on:click={prevPage}>Prev</button>
        <button disabled={page === _package.pages.length - 1 && !showPreview} on:click={nextPage}>Next</button>
        <button disabled={saving} on:click={addPage}>Add Page</button>
        <button disabled={saving} on:click={removePage}>Delete Page</button>
        <button>{_package.title} {page + 1} of {_package.pages.length}</button>
    </nav>
    <section class="editor-flip-frame" style="transform: rotateY({showPreview ? "180" : "0"}deg);">
        {#await promise}
            <article class="edit">
                <p>... fetching package {pid}</p>
            </article>
        {:then}
            <article class="edit">
                <div id="markdown">
                    <textarea name="markdown" focus=true bind:value={current.markdown} rows="25"></textarea>
                </div>
            </article>
            <article class="preview">
                <Preview content={html} />
            </article>
        {/await}
    </section>
</section>
<style>
    .editor {
        margin: auto;
        background-color: var(--wh-bg-gray-light);
        width: 100vw;
        height: 90vh;
        perspective: 2000px;
    }
    .editor-flip-frame {
        top: 1rem;
        position: relative;
        width: 90%;
        max-width: 52rem;
        margin: auto;
        height: 100%;
        border: solid 1px var(--wh-gray-light);
        box-sizing: border-box;
        transition: transform 0.3s cubic-bezier(0.13, 0.77, 0.81, 1.21);
        transform-style: preserve-3d;
        box-shadow: 1px 1px 6px -2px gray;
    }
    .edit, .preview {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        background-color: white;
        display: flex;
        flex-direction: column;
    }
    .preview {
        background-color: white;
        transform: rotateY(180deg);
    }
    #markdown {
        flex: 1 1 auto;
        overflow-y: scroll;
        text-align: left;
    }
    #markdown textarea {
        border-color: transparent;
        width: 90%;
        height: 100%;
        resize: none;
        background-color: white;
        padding: 2rem;
        font-family: 'courier new', 'Courier New', Courier, monospace;
        font-size: 1.25rem;
        line-height: 1.25rem;
        outline: none;
        white-space: pre-wrap;
    }
    .editor nav {
        font-size: .75rem;
        padding: .75rem 1.5rem;
        backface-visibility: hidden;
        background-color: white;
        display: flex;
        align-items: center;
        font-weight: 500;
        color: var(--wh-gray);
    }
    .editor nav button {
        color: var(--wh-gray);
        display: inline-block;
        cursor: pointer;
        padding: .75rem;
        background-color: transparent;
        border: solid 0px transparent;
        box-shadow: 0 0 0 0 transparent;
    }
    .editor nav button:hover {
        background-color: rgba(200, 200, 200, 0.1);
    }
    .editor nav button:last-child {
        text-align: right;
        flex: auto;
    }
    .editor nav button:last-child:hover {
        background-color: transparent;
    }
    button:disabled {
        opacity: 0.4;
    }
</style>