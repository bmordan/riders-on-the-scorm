<script>
    export let showModal = false
    export let onDismiss = false

    function dismissModel(evt) {
		evt.stopPropagation()
        onDismiss(evt.target.id !== "model")
	}
</script>
{#if showModal}
    <section id="model" on:click={dismissModel}>
        <main>
            <slot></slot>
        </main>
    </section>
{/if}
<style>
    #model {
		background-color: rgba(0,0,0,0.7);
		position: fixed;
		top: -12rem;
		bottom: -12rem;
		right: 0;
		left: 0;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#model main {
		width: 370px;
		height: 320px;
		border-radius: 12px;
		border: solid 1px var(--wh-b--gray-light);
		overflow-y: scroll;
		background-color: white;
		z-index: 2;
	}
</style>