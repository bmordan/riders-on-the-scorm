/*******************************************************************************
** LMS **
doInitialize()
doGetValue(name)
doSetValue(name)
*******************************************************************************/

doInitialize("")
doSetValue('cmi.score.min', 0)
doSetValue('cmi.score.max', 100)

const initialGetPageNumber = () => Number(localStorage.getItem('uk.co.whitehat.applied.swe.mod2.page')) || 0
const savePage = page => localStorage.setItem('uk.co.whitehat.applied.swe.mod2.page', page)
const getQuestions = () => {
    const questions = localStorage.getItem('uk.co.whitehat.applied.swe.mod2.questions')
    return questions ? JSON.parse(questions) : {}
}
const saveQuestion = (question, score, correctAnswer) => {
    const questions = getQuestions()
    questions[question] = [score, correctAnswer].join("|")
    localStorage.setItem('uk.co.whitehat.applied.swe.mod2.questions', JSON.stringify(questions))
}

const state = {
    page: initialGetPageNumber(),
    pages: []
}

function _scroll() { document.getElementById('page').scrollIntoView() }

const view = state => `
    <section class="wh-bg-near-white pa4 w-100 center relative overflow-hidden overflow-scroll">
        <section id="page" class="bg-near-white pa4 center mw7 lh-copy">${state.pages[state.page]}</section>
    </section>
    <section class="wh-bg-green pv2 flex items-start justify-center">
        ${state.pages.map((p, i) => {
            return `<div class="pointer ba wh-b--dark-green ${i === state.page ? "bw2 o-100" : "bw1 o-40"} br2 b--dashed h3 w2 ma1 flex items-center justify-center wh-dark-green" onclick="app.run('setPage', ${i})">${i+1}</div>`
        }).join("")}
    </section>
    <nav class="wh-bg-purple pv2 ph4 flex items-center justify-center absolute bottom-0 left-0 right-0 shadow-2">
        <button onclick="app.run('prev')" class="b--transparent wh-bg-light-purple wh-purple br2 pv2 ph4 mr2">Prev</button>
        <button onclick="app.run('next')" class="b--transparent wh-bg-light-purple wh-purple br2 pv2 ph4">Next</button>
    </nav>
`

const update = {
    next: state => {
        const page = (state.page + 1) === state.pages.length ? state.pages.length - 1 : state.page + 1
        _scroll()
        savePage(page)
        return {...state, page}
    },
    prev: state => {
        const page = (state.page - 1) < 0 ? 0 : state.page - 1
        _scroll()
        savePage(page)
        return {...state, page}
    },
    setPage: (state, page) => {
        _scroll()
        savePage(page)
        return {...state, page}   
    },
    setPages: (state, json) => {
        return {...state, pages: json}
    },
    updateScore: (state, score, question, correctAnswer) => {
        const current_score = Number(doGetValue('cmi.score.raw'))
        const questions = getQuestions()
        if (!Object.keys(questions).includes(question)) {
            doSetValue('cmi.score.raw', current_score + Number(score))
            saveQuestion(question, score, correctAnswer)
        }
        return state
    }
}

const rendered = state => {
    const questions = getQuestions()
    Object.keys(questions).forEach(question => {
        if (document.getElementById(question)) {
            const questionEl = Array.from(document.getElementById(question).getElementsByTagName("article"))
            const [score, correctAnswer] = questions[question].split('|')
            const bg     = score === "1" ? "wh-bg-dark-green" : "wh-bg-dark-red"
            const border = score === "1" ? "wh-b--dark-green" : "wh-b--dark-red"
            questionEl[0].classList.add("white", bg)
            questionEl.slice(1).forEach(answer => {
                if(answer.innerHTML === atob(correctAnswer).substring(4)) {
                    answer.classList.add("ba", "bw2", border, score === "1" ? "correct" : "incorrect")
                }
            })
        }
    })
    return state
}

app.start('module', state, view, update, {rendered})

fetch('pages.json')
    .then(res => res.json())
    .then(json => app.run('setPages', json))
    .catch(console.error)
