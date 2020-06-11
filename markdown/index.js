const Markdown = require('markdown-it')
const emoji = require('markdown-it-emoji')
const highlightjs = require('markdown-it-highlightjs')
const btoa = require('btoa')

const tokeniseChildren = (tokens) => {
    const tokenised = []
    let question_opened = false
    const forAnswer = new RegExp(/\[[#|\s]\]/)
    
    tokens.forEach((token, i) => {
        const substr = token.content.substring(0,3)

        if (substr === "[q]") {
            tokenised.push(token.content)
            question_opened = true
        } else if (question_opened && substr.match(forAnswer)) {
            tokenised.push(token.content)
            question_opened = false
        } else if (!question_opened && substr.match(forAnswer)) {
            tokenised.push(token.content)
        } else if (question_opened && token.content.length) {
            tokenised[tokenised.length - 1] += "<br />" + token.content
        }
    })
    return tokenised
}

function scorm_quiz (md) {
    md.renderer.rules.scorm_quiz = function (tokens, idx, options, env, self) {
        const answers = tokens[idx].children
        const question = answers.shift()
        const [correct_answer] = answers.filter(answer => answer.substring(0, 3) === '[#]')  
        return `
            <section id="${btoa(question)}" class="scorm-quiz">
                <article class="scorm-quiz-question noselect">${question.substring(4)}</article>
                ${answers.map((answer) => {
                    
                    const onAnswerHandler = `() => {return ['${question}', '${answer}', '${correct_answer}']}`
                    
                    return `<article class="scorm-quiz-answer noselect" id="${btoa(answer)}" onclick="onAnswer('${btoa(onAnswerHandler)}')">${answer.substring(4)}</article>`
                }).join('').trim()}
            </section>
        `.trim()
    }
    
    md.core.ruler.push('scorm_quiz', state => {
        state.tokens.forEach((token, i) => {
            if (token.type === 'inline'
            && token.children 
            && token.children.length
            && token.children[0].content === '???'
            && token.children[token.children.length - 1].content === '???') {
                state.tokens[i] = new state.Token('scorm_quiz', 'section', 0)
                state.tokens[i].children = tokeniseChildren(token.children.slice(1,-1))
                state.tokens[i].block = true
            }
        })
    })
}

function scorm_comment (md) {
    md.renderer.rules.scorm_comment = function (tokens, idx, options, env, self) {
        return `
            <textarea id="comment-${idx}" class="scorm-comment" name="comment-${idx}" rows="6"></textarea>
            <button onclick="onSaveComment(${idx})">Submit</button>
        `.trim()
    }
    md.core.ruler.push('scorm_comment', state => {
        state.tokens.forEach((token, i) => {
            if (token.type === 'inline'
            && token.content === "(((comment)))") {
                state.tokens[i] = new state.Token('scorm_comment', 'p', 0)
            }
        })
    })
}

function scorm_assignment_button (md) {
    md.renderer.rules.scorm_assignment_button = function (tokens, idx, options, env, self) {
        const {content, attrs} = tokens[idx]
        const astyle = "display:flex;align-items:center;justify-content:center;padding:2rem;background-color:rgba(37,221,156,0.1);cursor:default;text-decoration:none;"
        const bstyle = "border-width:0;padding:.5rem 1rem;background-color:var(--wh-green);color:white;border-radius:3px;box-shadow:1px 1px 3px -2px black;cursor:pointer;"
        return `<a href="${attrs}" target="_Blank" style="${astyle}"><button style="${bstyle}" type="button">${content}</button></a>`.trim()
    }
    md.core.ruler.push('scorm_assignment_button', state => {
        const pattern = new RegExp(/^\[{4}.*\]{3}$/gm)
        state.tokens.forEach((token, i) => {
            if (token.type === 'inline' && token.content.match(pattern)) {
                console.log(token.content)
                const [content = "assignment", href] = token.content.substring(4, token.content.length - 4).split('](')
                const assignment_button = new state.Token('scorm_assignment_button', 'a', 0)
                assignment_button.attrs = href
                assignment_button.content = content
                state.tokens[i] = assignment_button
            }
        })
    })
}

const md = new Markdown({
    html: true, 
    breaks: true, 
    linkify: true,
    typographer: true
})
.use(emoji)
.use(highlightjs)
.use(scorm_quiz)
.use(scorm_assignment_button)
.use(scorm_comment)

module.exports = markdown => md.render(markdown)
