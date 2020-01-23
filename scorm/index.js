const scopackager = require('simple-scorm-packager')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const dgraph = require('../dgraph')
const markdown = require('../src/marked-extended')

const scormify = (_package, user) => {
    return new Promise((resolve, reject) => {
        const package_dir = path.join(__dirname, 'builds', encodeURIComponent(_package.title).toLowerCase())
        const output_dir = path.join(__dirname, '..', 'public', 'packages')
        try {
            execSync(`rm -fr ${package_dir}`)
            fs.mkdirSync(package_dir)
        } catch(err) {
            return reject(err)
        }
    
        const pages = _package.pages.map(page => markdown(page.markdown))
    
        fs.writeFile(path.join(package_dir, 'pages.json'), JSON.stringify(pages), 'utf8', err => {
            if (err) return reject(err)
            
            execSync(`cp ${path.join(__dirname, 'templates', 'index.html')} ${package_dir}/index.html`)
            execSync(`cp ${path.join(__dirname, 'templates', 'main.js')} ${package_dir}/main.js`)
            execSync(`cp ${path.join(__dirname, 'templates', 'highlight.css')} ${package_dir}/highlight.css`)
            
            scopackager({
                version: '1.2',
                organization: 'WhiteHat',
                title: _package.title,
                language: 'en-EN',
                identifier: '00',
                masteryScore: 80,
                startingPage: 'index.html',
                source: package_dir,
                package: {
                    zip: true,
                    outputFolder: output_dir,
                    author: user.name
                }
            }, function(outputzip) {
                const poll = () => {
                    console.log(path.join(output_dir, outputzip))
                    console.log(fs.existsSync(path.join(output_dir, outputzip)))
                    if(fs.existsSync(path.join(output_dir, outputzip))) {
                        return resolve(outputzip)
                    } else {
                        return setTimeout(poll, 1000)
                    }
                }
                poll()
            })
        })
    })
}

module.exports = scormify