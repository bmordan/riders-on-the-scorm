<script>
	const [uid] = location.pathname.split("/").slice(-1)

	$: user = {}

	async function getUser(uid) {
		const user = await fetch(`/users/${uid}/packages`)
		return user.json()
	}

	getUser(uid).then(_user => (user = _user))
</script>

<main>
	<h1>collect dgraph for {uid}'s new app</h1>
	<section>{user.name || "...getting your packages"}</section>
	<img src={user.picture || ''} alt="avatar" />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>