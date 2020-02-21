<script>
    import { Router, Route, Link } from "svelte-routing"
    import Packages from "./Packages.svelte"
    import Navbar from "./Navbar.svelte"
    import Edit from "./Edit.svelte"
    import Helppage from "./Helppage.svelte"

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
        	<Navbar user={user}></Navbar>
            {#await getUser(uid)}
                <p style="padding:1rem;">...fetching packages</p>
            {:then user}
                <Packages user={user} />
            {/await}
        </Route>
        <Route path="/users/:uid/packages/:pid/editor" let:params>
        	<Navbar user={user}></Navbar>
            <Edit uid={params.uid} pid={params.pid} /> 
        </Route>
        <Route path="/help">
            <Navbar user={user}></Navbar>
            <Helppage></Helppage>
        </Route>
    </Router>
</section>