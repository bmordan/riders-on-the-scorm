<script>
    import { Router, Route, Link } from "svelte-routing"
    import Packages from "./Packages.svelte"
    import Editor from "./Editor.svelte"

    const [uid] = location.pathname.split("/").slice(-1)
</script>
<section>
    <Router>
        <Route path="/users/:uid" let:params>
            <Packages uid={params.uid} />
        </Route>
        <Route path="/users/:user_uid/packages/:package_uid/editor" let:params>
            <Editor user_uid={params.user_uid} package_uid={params.package_uid} /> 
        </Route>
    </Router>
</section>