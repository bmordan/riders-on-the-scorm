import showdown from "showdown"
showdown.extension('multi-choice-questions', function() {
    return {
        type: 'lang',
        filter: function (text, converter, options) {
            const tokenised = text.split("???")
            const lensMap = tokenised
                .map(token => token.match(/\[q\]/))
                .map((token, index) => token ? index : null)
                .filter(index => index)

            const markdown = lensMap
                .map(lensIndex => tokenised[lensIndex])
                .map(block => block.split(/\n/))
                .map(arr => arr.slice(1, arr.length - 1))

            console.log(markdown)
            return text
        }
    }
})
const converter = new showdown.Converter({extensions: ['multi-choice-questions']})
converter.setFlavor('github')

export default function (md) {
    return converter.makeHtml(md)
}