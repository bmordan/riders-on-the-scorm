<script>
	const [uid] = location.pathname.split("/").slice(-1)

	$: user = null
	$: showModel = false

	async function getUser(uid) {
		const $user = await fetch(`/users/${uid}/packages`)
		user = await $user.json()
		return user
	}

	async function createPackage(evt) {
		evt.preventDefault()
		const data = new FormData(evt.target)
		showModel = false
		await fetch(`/users/${user.uid}/packages`, {
			method: 'post',
			headers: new Headers({'content-type': 'application/json'}),
			body: JSON.stringify({title: data.get('title')})
		})
		return await getUser(uid)
	}

	function dismissModel(evt) {
		evt.stopPropagation()
		showModel = evt.target.id !== "model"
	}

	getUser(uid)

</script>

<main>
	{#if user}
		<section class="avatar">
			<img src={user.picture} alt="avatar" />
			{user.name}
		</section>
		<center class="packages">
			{#if user.packages}
				{#each user.packages as {uid, title, createdAt}}
					<a href={`/users/${uid}/packages/${uid}`}>
						<article class="package">
							<h2>{title}</h2>
							<small>{createdAt}</small>
						</article>
					</a>
				{/each}
			{/if}
			<article class="package new-package" on:click={e => showModel = !showModel}>+</article>
		</center>
	{:else}
		<section>...getting your SCORM packages</section>
	{/if}
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
</main>

<style>
	.avatar {
		margin: 1rem;
		display: flex;
		align-items: center;
	}
	.avatar img {
		border-radius: 50%;
		width: 2rem;
		height: 2rem;
		border: solid 2px black;
		margin-right: 1rem;
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
		flex: 1 1 auto;
		min-width: 0;
		min-height: 0;
	}
	#model form article input {
		width: calc(100% - 2rem);
		padding: 1rem;
		font-size: 2rem;
		border: solid 0px transparent;
		border-bottom: solid 2px black;
	}
	#model form button {
		font-size: 1.25rem;
		padding: 1rem 2rem;
		border-color: transparent;
		box-shadow: 1px 1px 2px 2px;
		color: white;
		background-color: darkorange;
	}
	.packages {
		width: 90vw;
		display: flex;
		flex-wrap: wrap;
	}
	.package {
		margin: 1rem;
		width: 12rem;
		height: 16rem;
		border-radius: 3px;
		border: solid 2px black;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: end;		
	}
	.new-package {
		cursor: pointer;
		border-style: dashed;
		align-items: center;
		justify-content: center;
	}
</style>