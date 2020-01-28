<script>
    import markedex from "./marked-extended"
    export let content
</script>
<section id="html">
    <link href="/reset.css" rel="stylesheet">
    <header>
        <img src="/icons/wh-blue-wave.svg" alt="whitehat wave logo" />
    </header>
    <main>
        {@html markedex(content)}
    </main>
    <footer>
        <small>created with care and attention by the coaches and curriculum team at <a href="https://whitehat.org.uk" target="_blank">
        <svg width="20" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M19.33 6.095h-1.702c-.264 0-.28-.233-.372-.613-.22-.894-.753-1.898-1.396-2.745C15.217 1.89 13.036 0 10.213 0 7.389 0 5.53 1.453 4.536 2.57c-.994 1.118-1.469 2.525-1.57 3.045-.104.533-.375.48-.444.48H.162c-.185 0-.161.06-.161.284v1.355c0 .278.004.266.213.266h7.294c.292 0 .256-.18.256-.276v-1.35c0-.318-.112-.28-.332-.28H5.207c-.509 0-.347-.3-.088-.918.447-1.14 2.117-3.235 4.988-3.235 2.87 0 4.314 1.969 4.804 2.832.49.862.62 1.73.62 1.906v1.03c0 .299.027.29.223.29h3.986c.275 0 .221-.227.202-.303-.019-.077-.27-1.121-.323-1.365-.053-.243-.168-.236-.289-.236z" fill="#797979" fill-rule="evenodd"/></svg> WhiteHat</a> © 2020</small>
    </footer>
</section>
<style>
    #html {
        position: relative;
        flex: 1 1 auto;
        overflow-y: scroll;
        text-align: left;
        -webkit-text-size-adjust: 100%;
        line-height: 1.75rem;
        font-size: 1rem;
    }
    header img {
        position: absolute;
        top: -5rem;
        left: 0;
        width: 100%;
    }
    main {
        padding: 7rem 3rem;
    }
    footer {
        padding: 2rem;
        text-align: center;
    }
    footer a {
        color: var(--wh-gray);
        text-decoration: none;
        cursor: pointer;
    }
    footer small {
        font-size: 8px;
        color: var(--wh-gray);
    }
</style>