<script>
    import Navpages from '../../src/Navpages.svelte'
    import Preview from '../../src/Preview.svelte'

    const { SCORM } = pipwerks
    SCORM.init("")
    SCORM.set('cmi.core.score.min', "0")
    SCORM.set('cmi.core.score.max', "100")
    window.onbeforeunload = () => SCORM.quit("")

    $: pages = [""]
    $: page = Number(localStorage.getItem('uk.co.whitehat.applied.scorm.page')) || 0

    const setPage = number => {
        page = Math.min((pages.length - 1), Math.max(0, number))
        localStorage.setItem('uk.co.whitehat.applied.scorm.page', page)
        window.SCORMrender()
        document.getElementById('package').scrollIntoView()
    }
    
    fetch('pages.json')
        .then(res => res.json())
        .then(_pages => {
            pages = _pages
        })
        .catch(console.error)
</script>
<Navpages setPage={setPage} pages={pages.map( (_, page) => ({page}) )} page={page} onSave={function () {}}>
    <script>
        const { SCORM } = pipwerks
        SCORM.init("")
        
        const onAnswer = evt => {
            const [question, answer, correct_answer] = eval(atob(evt))()

            let score = Number(SCORM.get('cmi.core.score.raw'))
            score += answer === correct_answer ? 1 : 0
            SCORM.set('cmi.core.score.raw', String(score))
            
            saveQuestion(question, answer, correct_answer)
            window.SCORMrender()
        }
        const getQuestions = () => {
            const questions = localStorage.getItem('uk.co.whitehat.applied.scorm.questions')
            return questions ? JSON.parse(questions) : {}
        }
        const saveQuestion = (question, answer, correct_answer) => {
            const questions = getQuestions()
            questions[btoa(question)] = [btoa(answer), btoa(correct_answer)].join("|")
            localStorage.setItem('uk.co.whitehat.applied.scorm.questions', JSON.stringify(questions))
        }
        const onSaveComment = idx => {
            const {value} = document.getElementById(`comment-${idx}`)
            const index = SCORM.get('cmi.interactions._count')
            const page = Number(localStorage.getItem('uk.co.whitehat.applied.scorm.page')) || 0
            SCORM.set(`cmi.interactions.${index}.id`, `page-${page + 1}-comment-${idx}`)
            SCORM.set(`cmi.interactions.${index}.time`, new Date().toISOString().substring(11,19) + ".00")
            SCORM.set(`cmi.interactions.${index}.student_response`, value)
            return true
        }
        window.SCORMrender = function () {
            setTimeout(function () {
                Object.entries(getQuestions()).forEach(([question, answer_correctanswer]) => {
                    const [answer, correct_answer] = answer_correctanswer.split('|')
                    const question_element = document.getElementById(String(question))
                    const isCorrect = answer === correct_answer
                    if (question_element) {
                        question_element.classList.add(isCorrect ? 'correct' : 'incorrect')
                        question_element.querySelectorAll('.scorm-quiz-answer')
                        .forEach(ans => ans.removeAttribute('onclick'))
                    }
                })
            }, 400)
        }
        window.onload = SCORMrender
    </script>
    <Preview content={pages[page]} />
</Navpages>
