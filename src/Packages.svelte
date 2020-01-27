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

	const formatDate = ISOstring => {
		const date = new Date(ISOstring)
		const wday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
		const day = date.getDate()
		const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
		const year = date.getFullYear()
		return [wday, day, month, year].join(' ')
	}

</script>
<section class="packages-wrapper">
	<section class="packages">
		{#each packages as {uid, title, createdAt, pages}}
			<Link to={`/users/${user.uid}/packages/${uid}/editor`}>
				<article>
					<header>
						<small>{formatDate(createdAt)}</small>
					</header>
					<main>
						<img class="icon" src="/icons/opened_folder.svg" alt="scorm package logo"/>				
						<h2>{title}</h2>
					</main>
					<footer>
						<button value={uid} on:click={deletePackage} class="wh-bg-red" disabled={downloading && downloading === uid}>Delete</button>
						<button value={uid} on:click={downloadPackage} class="wh-bg-green" disabled={downloading && downloading === uid}>Download</button>
					</footer>
				</article>
			</Link>
		{/each}
		<article class="create-package" on:click={e => showModel = true}>
			<main>
				<h1><img class="icon" src="/icons/folder.svg" alt="scorm package logo"/></h1>
				<h2>New package</h2>
			</main>
		</article>
	</section>
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
	.icon {
		width: 32px;
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
		grid-gap: .5rem;
	}
    .packages article {
		border: solid 1px var(--wh-gray-light);
		border-radius: 12px;
		height: 13rem;
		display: flex;
		flex-direction: column;
		background-color: white;
	}
	.packages article header {
		height: 42%;
		background-color: gray;
		background-image: url(/icons/package-header.svg);
		background-size: cover;
		width: 100%;
		border-radius: 12px 12px 0px 0px;
		border-bottom: solid 1px var(--wh-gray-light);
		position: relative;
	}
	.packages article header small {
		position: absolute;
		bottom: 0.25rem;
		right: 1.5rem;
		font-size: 0.25rem;
		color: var(--wh-gray);
	}
	.packages article main {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 1rem;
		flex: 1 1 auto;
	}
	.packages article main img {
		margin-right: 1rem;
		flex: none;
	}
	.packages article main h2 {
		font-size: 1rem;
		flex: 1 1 auto;
		min-width: 0; min-height: 0;
		color: var(--wh-gray);
	}
	.packages article footer {
		border-top: solid 1px var(--wh-gray-light);
		display: flex;
		color: white;
	}
	.packages article footer button {
		border: solid 0px transparent;
		box-shadow: 0px 0px 0px 0px transparent;
		border-radius: 0;
		width: 50%;
		height: 100%;
		padding: 1rem 0;
	}
	.packages article footer button:first-child {
		border-radius: 0 0 0 12px;
	}
	.packages article footer button:last-child {
		border-radius: 0 0 12px 0;
	}
    article.create-package {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		background-color: rgba(255, 255, 255, 0.3);
		border-style: dashed;
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