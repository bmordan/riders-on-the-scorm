<script>
    import Navpages from '../../src/Navpages.svelte'
    import Preview from '../../src/Preview.svelte'

    const { SCORM } = pipwerks
    SCORM.init()
    SCORM.set('cmi.core.score.min', 0)
    SCORM.set('cmi.core.score.max', 100)
    window.onbeforeunload = () => SCORM.quit()

    $: pages = [""]
    $: page = Number(localStorage.getItem('uk.co.whitehat.applied.scorm.page')) || 0

    const setPage = number => {
        page = Math.min(pages.length, Math.max(0, number))
        localStorage.setItem('uk.co.whitehat.applied.scorm.page', page)
    }

    fetch('pages.json')
        .then(res => res.json())
        .then(_pages => pages = _pages)
        .catch(console.error)
</script>
<Navpages setPage={setPage} pages={pages} page={page} >
    <Preview content={pages[page]} />
</Navpages>