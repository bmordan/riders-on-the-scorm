<script>
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
</script>
<nav>
    {#if user}
        <img src={user.picture} alt="user avatar" />
        <div>{user.name}</div>
        <button onclick={signout}>Sign out</button>
    {:else}
        ...
    {/if}
</nav>
<style>
    nav {
        padding: 1rem;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e4e4e4;
    }
    nav img {
        height: 23px;
        width: 23px;
        border-radius: 50%;
        margin-right: 1rem;
    }
    nav div {
        flex: 1 1 auto;
    }
</style>