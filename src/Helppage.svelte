<script>
import md from "../markdown"
const intro = `
# How to create a SCORM package

SCORM is an acronym for Sharable Content Object Reference Model. A scorm package can be uploaded onto a compatable managed learning platform like [Moodle](https://moodle.org/). The advantage of a SCORM package is it enables you to interact with the learning platform, and they are easy to share and maintain. This tool lets you create SCORM packages using markdown.

To create a new package click on "New package" on your home screen:
![new package](https://user-images.githubusercontent.com/4499581/74726224-00e66700-5237-11ea-864f-b8bd833950b3.png)

## What is markdown?

Markdown is a lightweight markup language with plain-text-formatting syntax. Its design allows it to be converted to many output formats. Why markdown? It makes a real difference to compose written content when you don't need to worry about formatting and spacing. Have you ever created content in a word processor like Google docs or Word, only to have all your formatting go skewiff when it's shared or opened on someone elses computer? It's also really hard to get consistancy over lots of different documents created over a longer time period.

![john gruber and aaron swartz](https://pic3.zhimg.com/80/v2-6e4e7562bd6b61e6611654b6b2c3c3aa_hd.jpg)
_[John Gruber](https://daringfireball.net/) created the Markdown language in 2004 in collaboration with [Aaron Swartz](https://en.wikipedia.org/wiki/Aaron_Swartz)._

Markdown has you just focus on written amazing content. You can format your work without leaving the keyboard. Below is a short primer to have you armed with the basics of markdown.`

const headings = `# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading
`

const horizontalrules = `
___

---

***
`

const emphasis = `
**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~
`

const sections = [
    ["Headings", headings],
    ["Horizontal Rules", horizontalrules],
    ["Emphasis", emphasis]
]

</script>
<section>
    {@html md(intro)}
    {#each sections as [title, example], i}
    <article>
        <h2>{title}</h2>
        <textarea bind:value={sections[i][1]} rows={String(example.match(/\n/g).length)}></textarea>
        <p>{@html md(example)}</p>
    </article>
    {/each}
</section>
<style>
section {
    min-height: 33vh;
    max-width: 52rem;
    margin: auto;
}
p, textarea {
    padding: 1rem;
    width: 100%;
    background-color: white;
}
textarea {
    border: solid 1px transparent;
    resize: none;
    box-shadow: inset -1px 1px 5px -1px var(--wh-gray);
}
p {
    margin: .25rem 0;
    box-shadow:  1px 1px 5px -3px var(--wh-gray);
}
</style>
