<script>
    export let user
</script>
<article>
    {#if user}
        <div id={user.uid}>{user.name}</div>
        <img src={user.picture} alt="user avatar" />
    {:else}
        ••• ••••••••••••
    {/if}
</article>
<style>
article {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
article img {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    margin-left: .75rem;
}
</style>