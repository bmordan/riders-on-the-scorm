<script>
    export let user
</script>
<article>
    {#if user}
        <img src={user.picture} alt="user avatar" />
        <div id={user.uid}>{user.name}</div>
    {:else}
        ••• ••••••••••••
    {/if}
</article>
<style>
article {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
article img {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    margin-right: .75rem;
}
</style>