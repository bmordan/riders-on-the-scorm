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
            console.log(lensMap)
            console.log(lensMap.map(i => tokenised[i]))
            return text
        }
    }
})
const converter = new showdown.Converter({extensions: ['multi-choice-questions']})
converter.setFlavor('github')

export default function (md) {
    return converter.makeHtml(md)
}