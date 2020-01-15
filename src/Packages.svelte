<script>
    import {Link} from "svelte-routing"
    export let uid
</script>
<section>
    <h1>all the packages for {uid}</h1>
    <ul>
        <li>
            <Link to={`/users/${uid}/packages/0xpack/editor`}>Open 0xpack</Link>
        </li>
        <li>
            <Link to={`/users/${uid}/packages/0xkcap/editor`}>Open 0xkcap</Link>
        </li>
    </ul>
</section>