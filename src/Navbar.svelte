<script>
    import Avatar from "./Avatar.svelte"
    import {link} from "svelte-routing"
    export let user;

    const signout = evt => {
        evt.preventDefault()
        gapi.load('auth2', () => {
            const client_id = document.querySelector('meta[name="google-signin-client_id"]').content
            gapi.auth2.init({client_id})
                .then(googleUser => {
                    googleUser.signOut().then(() => window.location.assign("/logout"))
                })
        })
    }
    const isHelpPage = window.location.pathname === "/help"
</script>
<nav>
    <Avatar user={user}></Avatar>
    <hgroup>    
        {#if isHelpPage}
            <a href={`/users/${user.uid}`} use:link>Back</a>
        {:else}
            <a href="/help" use:link>Help</a>
        {/if}
        <button on:click={signout}>Sign out</button>
    </hgroup>
</nav>
<style>
    nav {
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-items: flex-end;
        border-bottom: 1px solid #e4e4e4;
    }
    hgroup {
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    hgroup a {
        color: var(--wh-gray);
    }
    nav button {
        font-size: .75rem !important;
        padding: 0.5rem .75rem;
        border-radius: 3px;
        background-color: var(--wh-dark-green);
        color: var(--wh-near-white);
        outline: var(--wh-green);
        border-color: transparent;
        font-size: .75rem;
        margin-left: 1rem;
    }
</style>