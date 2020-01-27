<script>
	import download from "downloadjs"
	import {Link} from "svelte-routing"

    export let user;

    $: showModel = false
	$: packages = user.packages || []
	$: downloading = false
	$: selected = ""

    function dismissModel(evt) {
		evt.stopPropagation()
		showModel = evt.target.id !== "model"
	}

	async function createPackage(evt) {
		evt.preventDefault()
		
		const data = new FormData(evt.target)
		
		showModel = false
		
		const payload = {
			method: 'post',
			headers: new Headers({'content-type': 'application/json'}),
			body: JSON.stringify({title: data.get('title')})
		}
		
		fetch(`/users/${user.uid}/packages`, payload)
			.then(res => res.json())
			.then(_package_ => (packages = [...packages, _package_]))
			.catch(console.error)
	}
	
	function deletePackage (evt) {
		evt.preventDefault()

		return fetch(`/users/${user.uid}/packages/${this.value}/delete`)
			.then(res => res.json())
			.then(_packages => (packages = _packages))
			.catch(console.error)
	}

	function downloadPackage (evt) {
		evt.preventDefault()
		const pid = this.value
		
		downloading = pid

		let filename = `package-${pid}`

		fetch(`/users/${user.uid}/packages/${pid}/download`)
			.then(res => {
				res.headers.forEach((key, value) => (
					filename = key === 'x-scorm-download' ? value : filename
				))
				return res.blob()
			})
			.then(blob => {
				download(blob, filename, 'application/zip')
				setTimeout(() => {
					// there is no other way to know that the file has been downloaded
					fetch(`/users/${user.uid}/packages/${pid}/download/${filename}/remove`)
					downloading = false
				}, 9000)
			})
			.catch(console.error)
	}

</script>
<section class="packages-wrapper">
	<center class="packages">
		{#each packages as {uid, title, createdAt, pages}}
			<Link to={`/users/${user.uid}/packages/${uid}/editor`}>
				<article>
					<h2>{title}</h2>
					<small>{createdAt}</small>
					<button value={uid} on:click={deletePackage} disabled={downloading && downloading === uid}>Delete</button>
					<button value={uid} on:click={downloadPackage} disabled={downloading && downloading === uid}>Download</button>
				</article>
			</Link>
		{/each}
		<article class="create-package" on:click={e => showModel = true}>
			<h2>new</h2>
		</article>
	</center>
    {#if showModel}
		<section id="model" on:click={dismissModel}>
			<form on:submit={createPackage}>
				<h1>Create a new SCORM package</h1>
				<article>
					<input name="title" placeholder="Title" required />
				</article>
				<button>Create</button>
			</form>
		</section>
	{/if}
</section>
<style>
	section.packages-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 33vh;
	}
    h1 {
        display: flex;
        align-items: center;
    }
	.packages {
		margin: auto;
		width: auto;
		display: grid;
		grid-template-columns: 13rem 13rem 13rem 13rem;
		grid-gap: .25rem;
	}
    .packages article {
		border: solid 1px var(--wh-gray-light);
	}
    article.create-package {

    }
    #model {
		background-color: rgba(0,0,0,0.7);
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#model form {
		width: 65vw;
		height: 50vh;
		border-radius: 3px;
		border: solid 2px black;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: end;
		background-color: white;
		z-index: 2;
	}
	#model form article {
		width: auto;
		flex: 1 1 auto;
		min-width: 0;
		min-height: 0;
	}
	#model form > article input {
		width: calc(100% - 2rem);
		padding: 1rem;
		font-size: 2rem;
		border: solid 0px transparent;
		border-bottom: solid 2px black;
	}
</style>