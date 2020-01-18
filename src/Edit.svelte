<script>
    import { Link } from "svelte-routing"
    import marked from "marked"
    
    export let uid
    export let pid

    $: _package = getPackage(pid)
    $: page = 1
    $: pages = [""]
    $: html = marked(pages[page - 1])
    $: showPreview = false
    $: saving = false

    const togglePreview = () => (showPreview = !showPreview)

    async function getPackage (pid) {
        const [result] = await fetch(`/users/${uid}/packages/${pid}`)
            .then(res => res.json())
            .catch(console.error)
        _package = result
        pages = _package.pages.map(({markdown}) => atob(markdown))
        return result
    }

    function onSave (_package, markdown) {
        saving = true

        const body = {..._package.pages[page - 1], markdown: btoa(pages[page - 1])}

        const payload = {
			method: 'post',
			headers: new Headers({'content-type': 'application/json'}),
			body: JSON.stringify(body)
        }

        fetch(`/users/${uid}/packages/${pid}/pages/${body.uid}`, payload)
            .then(() => (saving = false))
            .catch(console.error)
    }

    function addPage () {
        saving = true

        fetch(`/users/${uid}/packages/${pid}/pages/new`)
            .then(res => res.json())
            .then(page => {
                pages.push(page)
                page = pages.length + 1
                saving = false
            })
            .catch(console.error)
    }

    const nextPage = () => page + 1 > pages.length ? page : page += 1
    const prevPage = () => page - 1 === 0 ? 1 : page -= 1
</script>
<section class="editor">
    <nav>
        <Link to={`/users/${uid}`}>Exit</Link>
    </nav>
    <section class="editor-flip-frame" style="transform: rotateY({showPreview ? "180" : "0"}deg);">
        {#await _package}
            <article class="edit">
                <p>... fetching package {pid}</p>
            </article>
        {:then _package}
            <article class="edit">
                <h1>{_package.title} {page} of {pages.length}</h1>
                <textarea id="markdown" name="markdown" focus=true bind:value={pages[page - 1]}></textarea>
                <nav>
                    <button disabled={saving} on:click={e => onSave(_package, pages[page - 1])}>Save{saving ? "ing..." : ""}</button>
                    <button on:click={togglePreview}>Preview</button>
                    <button disabled={page === 1} on:click={prevPage}>prev</button>
                    <button disabled={page === pages.length} on:click={nextPage}>next</button>
                    <button disabled={saving} on:click={addPage}>+</button>
                </nav>
            </article>
            <article class="preview">
                <article id="html">{@html html}</article>
                <nav>
                    <button on:click={togglePreview}>Exit Preview</button>
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