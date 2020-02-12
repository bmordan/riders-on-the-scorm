<script>
    import {Link} from "svelte-routing"
    import download from "downloadjs"

    export let user
    export let pack
    export let deletePackage

    const {uid, title, score, createdAt, sharedwith} = pack

    $: downloading = false

	const formatDate = ISOstring => {
		const date = new Date(ISOstring)
		const wday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
		const day = date.getDate()
		const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
		const year = date.getFullYear()
		return [wday, day, month, year].join(' ')
    }

	function downloadPackage (evt) {
		evt.preventDefault()
		const pid = this.value
		
		downloading = pid

		let filename = `package-${pid}`

		fetch(`/users/${user.uid}/packages/${pid}/download`)
			.then(res => {
				res.headers.forEach((key, value) => (
					filename = key === 'x-scorm-download' ? value : filename
				))
				return res.blob()
			})
			.then(blob => {
				download(blob, filename, 'application/zip')
				downloading = false
				setTimeout(() => {
					// there is no other way to know that the file has been downloaded
					return fetch(`/users/${user.uid}/packages/${pid}/download/${filename}/remove`)
						.then(res => res.json())
						.then(console.log)
				}, 6000)
			})
			.catch(console.error)
	}
</script>
<Link to={`/users/${user.uid}/packages/${uid}/editor`}>
    <article>
        <button value={uid} on:click={deletePackage} disabled={downloading && downloading === uid}>
            <svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle fill="#FFF" cx="33.5" cy="33.5" r="33.5"/><path d="M33.5 0C52.002 0 67 14.998 67 33.5 67 52.002 52.002 67 33.5 67 14.998 67 0 52.002 0 33.5 0 14.998 14.998 0 33.5 0zm9.217 17.968l-9.262 9.261-9.216-9.216-6.278 6.277 9.217 9.217-9.21 9.21 6.264 6.264 9.21-9.21 9.268 9.268 6.277-6.278-9.268-9.267 9.262-9.262-6.264-6.264z" fill="#E23030"/></g></svg>
        </button>
        <header>
            <small>{formatDate(createdAt)}</small>
            {#if score > 0}
                <div>							
                    <svg viewBox="0 0 190 263" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M11.015 54h166.824c17.694 100.5-10.11 167.5-83.412 201C23.653 221.5-4.151 154.5 11.015 54z" stroke="#16264D" stroke-width="13" fill="#FFF"/><path d="M29.555 37.531c2.5 0 4.937-.449 7.312-1.347 2.375-.899 4.68-2.239 6.914-4.02h0v-12.75l-14.554.023v4.032h10.101v6.398c-.969.86-2.39 1.668-4.266 2.426a15.256 15.256 0 01-5.765 1.137c-2.266 0-4.406-.5-6.422-1.5s-3.55-2.532-4.605-4.594c-1.055-2.063-1.582-4.625-1.582-7.688 0-2.484.437-4.789 1.312-6.914a11.903 11.903 0 012.168-3.398c.93-1.031 2.152-1.863 3.668-2.496s3.312-.95 5.39-.95c1.735 0 3.313.301 4.735.903 1.422.602 2.516 1.402 3.281 2.402.766 1 1.406 2.375 1.922 4.125h0l4.102-1.125c-.594-2.312-1.461-4.187-2.602-5.625-1.14-1.437-2.715-2.558-4.723-3.363C33.934 2.402 31.688 2 29.203 2c-3.422 0-6.445.703-9.07 2.11-2.625 1.406-4.637 3.558-6.035 6.456C12.699 13.465 12 16.586 12 19.93c0 3.375.703 6.43 2.11 9.164 1.406 2.734 3.488 4.824 6.245 6.27 2.758 1.445 5.825 2.167 9.2 2.167zm25.547-.586V21.687h5.273c1.172 0 2.016.055 2.531.165a6.824 6.824 0 012.074.914c.68.437 1.45 1.203 2.31 2.297.858 1.093 1.952 2.671 3.28 4.734h0l4.547 7.148h5.719l-5.977-9.351c-1.187-1.828-2.445-3.352-3.773-4.57-.625-.563-1.54-1.133-2.742-1.712 3.297-.453 5.734-1.515 7.312-3.187 1.578-1.672 2.367-3.727 2.367-6.164 0-1.89-.476-3.617-1.43-5.18-.952-1.562-2.226-2.652-3.82-3.27-1.593-.616-3.921-.925-6.984-.925h0-15.234v34.36h4.547zm9.773-19.195h-9.773V6.383h10.875c2.546 0 4.41.523 5.59 1.57 1.18 1.047 1.769 2.383 1.769 4.008 0 1.11-.305 2.137-.914 3.082-.61.945-1.5 1.633-2.672 2.062-1.172.43-2.797.645-4.875.645h0zm21.328 19.195l3.774-10.406h14.367l4.008 10.406h5.18L99.468 2.585H94.57l-13.195 34.36h4.828zm16.734-14.11H91.29l3.773-10.077a43.8 43.8 0 001.852-6.563c.531 1.86 1.344 4.235 2.438 7.125h0l3.585 9.516zm26.626 14.11c2.078 0 3.917-.195 5.519-.586 1.602-.39 2.969-.964 4.102-1.722 1.132-.758 2.175-1.797 3.129-3.117.953-1.32 1.734-2.989 2.343-5.004.61-2.016.914-4.328.914-6.938 0-3.062-.449-5.785-1.347-8.168-.899-2.383-2.254-4.34-4.067-5.87-1.39-1.188-3.07-2.009-5.039-2.462-1.406-.328-3.445-.492-6.117-.492h0-11.836v34.36h12.398zm-.516-4.054h-7.336V6.64h7.219c2.703 0 4.664.234 5.882.703 1.688.656 3.122 1.949 4.301 3.879 1.18 1.93 1.77 4.691 1.77 8.285 0 2.594-.301 4.8-.903 6.62-.601 1.821-1.44 3.27-2.52 4.349-.765.765-1.792 1.359-3.081 1.78-1.29.423-3.066.634-5.332.634h0zm48.516 4.054v-4.054h-21.094V21.195h19.008v-4.03h-19.008V6.64h20.297V2.586h-24.844v34.36h25.64z" stroke="#16264D" stroke-width="3" fill="#16264D" fill-rule="nonzero" stroke-linejoin="bevel"/></g></svg>
                    <samp>{score}</samp>
                </div>
            {/if}
            {#if sharedwith}
                <ul>
                {#each sharedwith as {picture, name}}
                    <img src={picture} alt={name} />
                {/each}
                </ul>
            {/if}
        </header>
        <main>
            <img class="icon" src="/icons/opened_folder.svg" alt="scorm package logo"/>				
            <h2>{title}</h2>
        </main>
        <footer>
            <button value={uid} on:click={downloadPackage} class="wh-bg-purple" disabled={downloading && downloading === uid}>
                {#if downloading && downloading === uid}
                    <div class="throbber-loader">Working...</div>
                {:else}
                    <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16" height="16"><g fill="currentColor"><path d="M24 37.1L13 24h22zM20 4h8v4h-8zm0 6h8v4h-8z"/><path d="M20 16h8v11h-8zM6 40h36v4H6z"/></g></svg>
                    <span>&nbsp;Download</span>
                {/if}
            </button>
        </footer>
    </article>
</Link>
<style>
.icon {
    width: 32px;
}
article > button {
    cursor: pointer;
    position: absolute;
    top: 1rem;
    right: 1.25rem;
    border: solid 1px transparent;
    background-color: transparent;
    width: 2rem;
    height: 2rem;
    z-index: 1;
}
article > button svg {
    width: 2rem;
    height: 2rem;
}
article header {
    height: 42%;
    background-color: gray;
    background-image: url(/icons/package-header.svg);
    background-size: cover;
    width: 100%;
    border-radius: 12px 12px 0px 0px;
    border-bottom: solid 1px var(--wh-gray-light);
    position: relative;
}
article header small {
    position: absolute;
    bottom: 0.25rem;
    right: 2.25rem;
    font-size: 0.25rem;
    color: var(--wh-gray);
}
article header div {
    position: absolute;
    top: .7rem;
    left: .3rem;
    width: 48px;
    height: 48px;
}
article header div svg {
    width: 48px;
    height: 48px;
}
article header div samp {
    position: absolute;
    color: var(--wh-navy);
    top:0;
    left: 0;
    width: 100%;
    display:flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    height: 48px;
}
article footer {
    border-top: solid 1px var(--wh-gray-light);
    display: flex;
    color: white;
    align-items: center;
}
article {
    position: relative;
    border: solid 1px var(--wh-gray-light);
    border-radius: 12px;
    height: 13rem;
    display: flex;
    flex-direction: column;
    background-color: white;
}
article main {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    flex: 1 1 auto;
}
article main img {
    margin-right: 1rem;
    flex: none;
}
article main h2 {
    font-size: .75rem;
    flex: 1 1 auto;
    min-width: 0; min-height: 0;
    color: var(--wh-gray);
}
article footer button {
    border: solid 0px transparent;
    box-shadow: 0px 0px 0px 0px transparent;
    border-radius: 0;
    width: 100%;
    height: 100%;
    padding: 1rem 0;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 12px 12px;
}
ul {
    margin-block-start: 0;
    margin-block-end: 0;
    padding: 0;
    position: absolute;
    top: 4.5rem;
    left: 1rem;
}
ul img {
    height: 32px;
    width: 32px;
    border-radius: 50%;
}
ul img:not(:first-child) {
    margin-left: -.75rem;
}
@-moz-keyframes throbber-loader {
    0% {
        background: #A18DEE;
    }
    10% {
        background: #5D44BE;
    }
    40% {
        background: #BEAEFE;
    }
}
@-webkit-keyframes throbber-loader {
    0% {
        background: #A18DEE;
    }
    10% {
        background: #5D44BE;
    }
    40% {
        background: #BEAEFE;
    }
}
@keyframes throbber-loader {
    0% {
        background: #A18DEE;
    }
    10% {
        background: #5D44BE;
    }
    40% {
        background: #BEAEFE;
    }
}
/* :not(:required) hides these rules from IE9 and below */
.throbber-loader:not(:required) {
    -moz-animation: throbber-loader 2000ms 300ms infinite ease-out;
    -webkit-animation: throbber-loader 2000ms 300ms infinite ease-out;
    animation: throbber-loader 2000ms 300ms infinite ease-out;
    background: #dde2e7;
    display: inline-block;
    position: relative;
    text-indent: -9999px;
    width: 0.9em;
    height: 1.5em;
    margin: 0 1.6em;
}
.throbber-loader:not(:required):before, .throbber-loader:not(:required):after {
    background: #dde2e7;
    content: '\x200B';
    display: inline-block;
    width: 0.9em;
    height: 1.5em;
    position: absolute;
    top: 0;
}
.throbber-loader:not(:required):before {
    -moz-animation: throbber-loader 2000ms 150ms infinite ease-out;
    -webkit-animation: throbber-loader 2000ms 150ms infinite ease-out;
    animation: throbber-loader 2000ms 150ms infinite ease-out;
    left: -1.6em;
}
.throbber-loader:not(:required):after {
    -moz-animation: throbber-loader 2000ms 450ms infinite ease-out;
    -webkit-animation: throbber-loader 2000ms 450ms infinite ease-out;
    animation: throbber-loader 2000ms 450ms infinite ease-out;
    right: -1.6em;
}
</style>