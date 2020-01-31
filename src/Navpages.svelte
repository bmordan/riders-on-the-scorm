<script>
    export let setPage
    export let pages
    export let page
    export let mode = false
</script>
<slot></slot>
<footer class={mode ? "editmode" : ""}>
    <nav>
        {#each pages as _, i}
            <article class={page === i ? "active" : ""} on:click={e => setPage(i)}>page {i + 1}</article>
        {/each}
    </nav>
    <small>created with care and attention by the coaches and curriculum team at <a href="https://whitehat.org.uk" target="_blank">
    <svg width="20" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M19.33 6.095h-1.702c-.264 0-.28-.233-.372-.613-.22-.894-.753-1.898-1.396-2.745C15.217 1.89 13.036 0 10.213 0 7.389 0 5.53 1.453 4.536 2.57c-.994 1.118-1.469 2.525-1.57 3.045-.104.533-.375.48-.444.48H.162c-.185 0-.161.06-.161.284v1.355c0 .278.004.266.213.266h7.294c.292 0 .256-.18.256-.276v-1.35c0-.318-.112-.28-.332-.28H5.207c-.509 0-.347-.3-.088-.918.447-1.14 2.117-3.235 4.988-3.235 2.87 0 4.314 1.969 4.804 2.832.49.862.62 1.73.62 1.906v1.03c0 .299.027.29.223.29h3.986c.275 0 .221-.227.202-.303-.019-.077-.27-1.121-.323-1.365-.053-.243-.168-.236-.289-.236z" fill="currentColor" fill-rule="evenodd"/></svg> WhiteHat</a> © 2020</small>
</footer>
<style>
nav {
    display: flex;
    justify-content: center;
    align-items: flex-end;
}
article {
    padding: 0.25rem 1rem;
    margin: 0 .125rem -0.1rem;
    height: .5rem;
    border: solid 1px var(--wh-gray-light);
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.25rem;
    cursor: pointer;
    box-shadow: 1px 1px 1px -1px gray;
    transition: height .5s ease-out;
}
article.active {
    height: 1rem;
}
footer {
    backface-visibility: hidden;
}
footer a {
    color: var(--wh-gray);
    text-decoration: none;
    cursor: pointer;
}
footer small {
    box-shadow: 0px -1px 4px -3px gray;
    border-top: solid 1px var(--wh-gray-light);
    background-color: white;
    position: relative;
    z-index: 2;
    text-align: center;
    width: 100%;
    padding: 1rem 0;
    display: block;
    font-size: 8px;
    color: var(--wh-gray);
}
.editmode nav {
    border-bottom: solid 1px black;
    margin-top: .1rem;
}
.editmode article {
    font-family: 'Courier New', Courier, monospace;
    box-shadow: 0px 0px 0px 0px transparent;
    border: solid 1px black;
}
.editmode small {
    visibility: hidden;
}
</style>