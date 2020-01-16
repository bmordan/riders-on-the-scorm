<script>
    import { Router, Route, Link } from "svelte-routing"
    import Packages from "./Packages.svelte"
    import Editor from "./Editor.svelte"

    const [uid] = location.pathname.split("/").slice(-1)

    $: user = null

    async function getUser(uid) {
		const $user = await fetch(`/users/${uid}/packages`)
        user = await $user.json()
		return user
	}
</script>
<section>
    <Router>
        <Route path="/users/:uid" let:params>
            {#await getUser(uid)}
                <p>...fetching packages</p>
            {:then user}
                <Packages user={user} />
            {/await}
        </Route>
        <Route path="/users/:user_uid/packages/:package_uid/editor" let:params>
            <Editor user={user} user_uid={params.user_uid} package_uid={params.package_uid} /> 
        </Route>
    </Router>
</section>