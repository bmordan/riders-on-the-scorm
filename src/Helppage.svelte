<script>
import md from "../markdown"
const intro = `
# How to create a SCORM package

SCORM is an acronym for Sharable Content Object Reference Model. A scorm package can be uploaded onto a compatable managed learning platform like [Moodle](https://moodle.org/). The advantage of a SCORM package is it enables you to interact with the learning platform, and they are easy to share and maintain. This tool lets you create SCORM packages using markdown.

To create a new package click on "New package" on your home screen. Click on the package to open the editor. In the editor you need to create your content using markdown:

## What is markdown?

Markdown is a lightweight markup language with plain-text-formatting syntax. Its design allows it to be converted to many output formats. Why markdown? It makes a real difference to compose written content when you don't need to worry about formatting and spacing. Have you ever created content in a word processor like Google docs or Word, only to have all your formatting go skewiff when it's shared or opened on someone elses computer? It's also really hard to get consistancy over lots of different documents created over a longer time period.

> Markdown has you just focus on written amazing content. You can format your work without leaving the keyboard. Below is a short primer to have you armed with the basics of markdown.`

const outro = `
## Appli.ed the Learning Platform

The multiple quiz questions will add a score to a student's profile on applied. To see their score click on the SCORM package on applied and goto the "Report" tab.

![report tab](https://user-images.githubusercontent.com/4499581/75030569-49528e80-549c-11ea-91ac-307b18513f27.jpg)

You can see when they open the package, and any score they may have achieved.

Go build a SCORM package. Share it with other WhiteHatters using the Share button on the Edit page. For people to appear on the dropdown for the share, they must have logged into [scorm.whitehatcoaches.org.uk](https://scorm.whitehatcoaches.org.uk/). When you are ready download the package, you'll then have a .zip file on your computer.

![select scorm](https://user-images.githubusercontent.com/4499581/80705847-1f8e9700-8adf-11ea-9296-afd2c26f24b8.jpg)

On applied when you add a new resource select the SCORM package option. Then complete the create form by adding a name for your package, select the .zip you just downloaded finally set the Grade. Use the max grade on the SCORM package shield and set the _maximum grade_ value on applied to be the same.

![settings for a SCORM package on applied](https://user-images.githubusercontent.com/4499581/80705853-20bfc400-8adf-11ea-805a-bc61e49da24f.jpg)

In the example above you should set the _maximum grade_ to 14. Save. You are good to go SCORM author.
`

const headings = `# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading
`

const horizontalrules = `___

---

***
`

const emphasis = `**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~
`

const blockquotes = `> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.
`

const lists = `Unordered

+ Create a list by starting a line with "+", "-", or "*"
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as "1."

Start numbering with offset:

57. foo
1. bar
`

const links = `[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)`

const images = `![placholder image alt tag](https://picsum.photos/400/200)

Like links, Images also have a footnote style syntax

![alt text in here][id]

With a reference later in the document defining the URL location:

[id]: https://picsum.photos/400/200  "Some label"
`

const emojies = `
Classic markup: :wink: :necktie: :cry: :laughing: :yum:

Shortcuts (emoticons): :-) :-( 8-) ;)

see [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.
`

const tables = `
| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |
`

const mcqs = `???
[q] You question goes here, got that?
[ ] first anwser this is not correct
[#] mark the correct anwser like this with a hash
[ ] test them with slightly incorrect answers
???

???
[q] Which method do you call on an instance of a WebWorker to pass a message from the main thread to the worker thread?
[ ] worker.send(msg)
[ ] worker.post(msg)
[#] worker.postMessage(msg)
???
`

const feature_links = `
Draw attention to a link that will open in a new tab by wrapping a normal link in 3 square braces <pre>[[[ _markdown link goes here_ ]]]</pre>

[[[[UML assignment](https://applied.whitehat.org.uk/mod/assign/view.php?id=7120&action=editsubmission)]]]
`

const sections = [
    ["Headings", headings],
    ["Horizontal Rules", horizontalrules],
    ["Emphasis", emphasis],
    ["Blockquotes", blockquotes],
    ["Lists", lists],
    ["Links", links],
    ["Images", images],
    ["Emojies", emojies],
    ["Tables", tables],
    ["Multiple Choice Questions", mcqs],
    ["Featured Links", feature_links]
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
    {@html md(outro)}
</section>
<style>
section {
    min-height: 33vh;
    max-width: 52rem;
    margin: 0 auto 3rem;
    line-height: 1.5rem;
}
textarea {
    padding: 2rem;
    width: calc(100% - 2rem);
    background-color: white;
    border: solid 1px transparent;
    resize: none;
    box-shadow: inset -1px 1px 5px -1px var(--wh-gray);
    font-family: 'Courier New', Courier, monospace;
    font-size: 1rem;
    line-height: 1.25rem;
    overflow: hidden;
}
p {
    background-color: white;
    padding: 1rem;
    width: 100%;
    margin: .25rem 0;
    box-shadow:  1px 1px 5px -3px var(--wh-gray);
}
</style>
