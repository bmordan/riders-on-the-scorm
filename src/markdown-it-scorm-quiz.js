const btoa = require('btoa')

module.exports = function (md) {
    md.renderer.rules.scorm_quiz = function (tokens, idx, options, env, self) {
        const answers = tokens[idx].children
            .filter(token => token.type === 'text')
            .map(token => token.content)
        const question = answers.shift()
        
        return scorm_quiz_html(question, answers)
    }

    function scorm_quiz_html (question, answers) {    
        const [correct_answer] = answers.filter(answer => answer.substring(0, 4) === '[#] ')  
        return `
            <section id="${btoa(question)}" style="margin: .5rem 0;">
                <style>.scorm-quiz-answer:hover {background-color:purple !important;color:white !important;}</style>
                <article style="padding:1rem;background-color:purple;color:white;">${question.substring(4, question.length)}</article>
                ${answers.map((answer) => {
                    const score = answer.substring(0, 4) === '[#] ' ? 1 : 0
                    const answer_string = answer.substring(4, answer.length)
                    return `
                        <article class="scorm-quiz-answer" style="margin:0.25rem 0;padding:1rem;color:purple;background-color:white;border:solid 2px purple;" onclick="updateScore('updateScore', ${score}, '${btoa(question)}', '${btoa(correct_answer)}')">${answer_string}</article>`
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
                state.tokens[i].children = token.children.slice(1,-1)
                state.tokens[i].block = true
            }
        })
    })
}