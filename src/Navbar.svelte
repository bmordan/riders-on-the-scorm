<script>
    import Avatar from "./Avatar.svelte"
    export let user;

    const signout = evt => {
        evt.preventDefault()
        console.log(gapi)
        gapi.load('auth2', () => {
            const client_id = document.querySelector('meta[name="google-signin-client_id"]').content
            gapi.auth2.init({client_id})
                .then(googleUser => {
                    googleUser.signOut().then(() => window.location.assign("/logout"))
                })
        })
    }
</script>
<nav>
    <Avatar user={user}></Avatar>
    <div><button on:click={signout}>Sign out</button></div>
</nav>
<style>
    nav {
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-items: end;
        border-bottom: 1px solid #e4e4e4;
    }
    nav div {
        flex: 1 1 auto;
        display: flex;
        justify-content: flex-end;
    }
    nav div button {
        font-size: .75rem !important;
        padding: 0.5rem .75rem;
        border-radius: 3px;
        background-color: var(--wh-dark-green);
        color: var(--wh-near-white);
        outline: var(--wh-green);
        border-color: transparent;
        font-size: .75rem;
    }
</style>