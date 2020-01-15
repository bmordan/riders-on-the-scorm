<script>
    import { Link } from "svelte-routing"
    export let user_uid
    export let package_uid
</script>
<section>
    <h1>Look at this nice hu?</h1>
</section>
<style>
    section {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        background-color: white;
        background-color: rgba(0,0,0,0.2);
        transform: rotateY(180deg);
    }
</style>