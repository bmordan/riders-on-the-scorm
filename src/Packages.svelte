<script>
	import Package from "./Package.svelte"
	import {Link} from "svelte-routing"
	import Modal from "./Modal.svelte"

	export let user;
	
	let title = ""

    $: showModel = false
	$: packages = user.packages || []
	$: sharedwithPackages = user['~sharedwith'] || []

	const setTitle = evt => (title = evt.target.value.match(/[A-Za-z0-9\s_]/g).join("").trim())

	async function createPackage(evt) {
		evt.preventDefault()
		
		const data = new FormData(evt.target)
		
		showModel = false
		title = ""
		
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
</script>
<section class="packages-wrapper">
	<section class="packages">
		{#each packages as _package}
			<Package user={user} pack={_package} deletePackage={deletePackage} />
		{/each}
		<article class="create-package" on:click={e => showModel = true}>
			<main>
				<h1><img class="icon" src="/icons/folder.svg" alt="scorm package logo"/></h1>
				<h2>New package</h2>
			</main>
		</article>
	</section>
</section>
{#if sharedwithPackages.length}
<h2 class="shared-bar"><mark>Shared with you</mark></h2>
{/if}
<section class="packages-wrapper">
	<section class="packages">
		{#each sharedwithPackages as sharedPackage}
			<Package user={user} pack={sharedPackage} deletePackage={deletePackage} />
		{/each}
	</section>
</section>
<Modal showModal={showModel} onDismiss={evt => (showModel = evt)}>
	<form class="package-modal" on:submit={createPackage}>
		<main>
			<h1><img class="icon" src="/icons/folder.svg" alt="scorm package logo"/></h1>
			<h2>New package</h2>
		</main>
		<article>
			<input name="title" on:change={setTitle} bind:value={title} placeholder="Title" required />
		</article>
		<footer>
			<button>Create</button>
		</footer>
	</form>
</Modal>
<style>
	section.packages-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 33vh;
	}
	.packages {
		margin: .5rem auto;
		width: auto;
		display: grid;
		grid-template-columns:  19.7rem 19.7rem 19.7rem;
		grid-gap: .5rem;
	}
    .create-package {
		position: relative;
		border: solid 1px var(--wh-gray-light);
		border-radius: 12px;
		height: 13rem;
		display: flex;
		flex-direction: column;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		background-color: rgba(255, 255, 255, 0.2) !important;
		border-style: dashed;
	}
	.create-package img {
		width: 32px;
	}
	.create-package h2 {
		color: var(--wh-gray);
		font-size: .75rem;
	}
	.shared-bar {
		text-align: center;
		border-bottom: solid 1px var(--wh-gray-light);
	}
	.shared-bar mark {
		position: relative;
		color: var(--wh-gray-light);
		background-color: var(--wh-near-white);
		padding: 1rem;
		top:.75rem;
	}
	form {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		width: 370px;
		height: 320px;
		border-radius: 12px;
		border: solid 1px var(--wh-b--gray-light);
		display: flex;
		flex-direction: column;
		justify-content: end;
		background-color: white;
		z-index: 2;
	}
	.package-modal button {
		font-size: .75rem !important;
        padding: 0.5rem .75rem;
        border-radius: 3px;
        background-color: var(--wh-dark-green);
        color: var(--wh-near-white);
        outline: var(--wh-green);
        border-color: transparent;
        font-size: .75rem;
	}
	form main {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}
	form main img {
		margin-right: 1rem;
	}
	form main h2 {
		font-size: .75rem;
		color: var(--wh-gray);
	}
	form article {
		padding: 2rem;
		width: auto;
		flex: 1 1 auto;
		min-width: 0;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	form > article input {
		width: calc(100% - 2rem);
		padding: 1rem;
		font-size: 1rem;
		border: solid 0px transparent;
		border-bottom: solid 1px var(--wh-gray-light);
	}
	form footer {
		padding: 2rem;
		flex: none;
		text-align: right;
	}
	.icon {
		width: 32px;
	}
	button:disabled {
		opacity: 0.4;
	}
</style>