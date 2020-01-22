import Markdown from 'markdown-it'
import emoji from 'markdown-it-emoji'
import highlightjs from 'markdown-it-highlightjs'
import scorm_quiz from './markdown-it-scorm-quiz'
const md = new Markdown({
    html: true, 
    breaks: true, 
    linkify: true
})
.use(emoji)
.use(highlightjs)
.use(scorm_quiz)

export default function (markdown) {
    return md.render(markdown)
}