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

module.exports = function (md) {
    md.renderer.rules.scorm_quiz = function (tokens, idx, options, env, self) {
        const answers = tokens[idx].children
        const question = answers.shift()
        const [correct_answer] = answers.filter(answer => answer.substring(0, 3) === '[#]')  
        return `
            <section id="${btoa(question)}" class="scorm-quiz">
                <article class="scorm-quiz-question noselect">${question.substring(4)}</article>
                ${answers.map((answer) => {
                    const score = answer.substring(0, 3) === '[#]' ? 1 : 0
                    const answer_string = answer.substring(4)
                    return `
                        <article class="scorm-quiz-answer noselect" onclick="app.run('updateScore', ${score}, '${btoa(question)}', '${btoa(correct_answer)}')">${answer_string}</article>
                    `
                }).join('')}
            </section>
        `
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