<script>
    import { Link } from "svelte-routing"
    import Preview from "./Preview.svelte"
    import Navpages from "./Navpages.svelte"
    import Modal from "./Modal.svelte"
    import Avatar from "./Avatar.svelte"
    
    export let uid
    export let pid

    $: promise = getPackage(pid)
    $: _package = {pages: [{markdown: "", page: 0}]}
    $: page = 0
    $: showPreview = false
    $: current = _package.pages[page]
    $: html = showPreview ? _package.pages[page].markdown : ""
    $: saving = false
    $: users = []
    $: showShareModal = false

    const togglePreview = () => (showPreview = !showPreview)

    async function getPackage (pid) {
        return _package = await fetch(`/users/${uid}/packages/${pid}`)
            .then(res => res.json())
            .catch(console.error)
    }

    function onSave (pages = _package.pages) {
        saving = true

        const payload = {
			method: 'post',
			headers: new Headers({'content-type': 'application/json'}),
			body: JSON.stringify(pages)
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
        saving = false
    }

    function addPage () {
        saving = true

        fetch(`/users/${uid}/packages/${pid}/pages/${_package.pages.length}/new`)
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
                current = _package.pages[page]
            })
            .catch(err => {
                saving = false
                console.error(err)
            })
    }

    const setPage = number => {
        page = Math.min(_package.pages.length, Math.max(0, number))
    }

    const shareWith = shareWithId => {
        showShareModal = false
        fetch(`/users/${uid}/packages/${pid}/share/${shareWithId}`)
            .then(res => res.json())
            .then(result => {
                console.log(result)
            })
            .catch(console.error)
    }

    fetch('/users')
        .then(res => res.json())
        .then(_users => (users = _users.filter(u => u.uid !== uid)))
        .catch(console.error)
</script>
<section class="editor">
    <nav>
        <Link to={`/users/${uid}`} ><button class="noselect">Exit</button></Link>
        <button disabled={saving} on:click={e => onSave()}>Save{saving ? "ing..." : ""}</button>
        <button on:click={togglePreview}>{showPreview ? 'Editor' : 'Preview'}</button>
        <button disabled={saving} on:click={addPage}>Add Page</button>
        <button disabled={saving} on:click={removePage}>Delete Page</button>
        <button on:click={e => (showShareModal = true)}>Share</button>
    </nav>
    <section class="editor-flip-frame" style="transform: rotateY({showPreview ? "180" : "0"}deg);">
        {#await promise}
            <article class="edit">
                <p>... fetching package {pid}</p>
            </article>
        {:then}
            <article class="edit">
                <Navpages 
                    setPage={setPage}
                    pages={_package.pages}
                    page={page}
                    onSave={onSave}
                    mode={!showPreview}>
                    <div id="markdown">
                        <textarea name="markdown" focus=true bind:value={current.markdown} rows="25"></textarea>
                    </div>
                </Navpages>
            </article>
            <article class="preview">
                <Navpages
                    setPage={setPage}
                    pages={_package.pages}
                    page={page}
                    onSave={onSave}>
                    <Preview content={html} />
                </Navpages>
            </article>
        {/await}
    </section>
    <Modal showModal={showShareModal} onDismiss={evt => showShareModal = evt}>
        <form>
            {#each users as user}
                <article class="select-user" on:click={e => shareWith(user.uid)}>
                    <Avatar user={user}></Avatar>
                </article>
            {/each}
        </form>
    </Modal>
</section>
<style>
    .editor {
        margin: auto;
        background-color: var(--wh-bg-gray-light);
        width: 100vw;
        height: 87.5vh;
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
    button {
        color: var(--wh-gray);
        text-decoration: none;
        display: inline-block;
        cursor: pointer;
        padding: .75rem;
        background-color: transparent;
        border: solid 0px transparent;
        box-shadow: 0 0 0 0 transparent;
        outline: none;
    }
    button:hover {
        background-color: rgba(200, 200, 200, 0.1);
    }
    button:disabled {
        opacity: 0.4;
    }
    .select-user {
        padding: 1rem;
        margin: .25rem;
        border-radius: 12px;
    }
    .select-user:hover {
        background-color: var(--wh-green);
    }
</style>