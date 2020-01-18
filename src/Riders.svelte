<script>
    import { Router, Route, Link } from "svelte-routing"
    import Packages from "./Packages.svelte"
    import Edit from "./Edit.svelte"

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
        <Route path="/users/:uid/packages/:pid/editor" let:params>
            <Edit uid={params.uid} pid={params.pid} /> 
        </Route>
    </Router>
</section>
<style>
* {
    padding: 0;
    margin: 0;
}
</style>