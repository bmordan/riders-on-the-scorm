const Markdown = require('markdown-it')
const emoji = require('markdown-it-emoji')
const highlightjs = require('markdown-it-highlightjs')
const scorm_quiz = require('./markdown-it-scorm-quiz')
const md = new Markdown({
    html: true, 
    breaks: true, 
    linkify: true
})
.use(emoji)
.use(highlightjs)
.use(scorm_quiz)

module.exports = markdown => md.render(markdown)