const scopackager = require('simple-scorm-packager')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const dgraph = require('../dgraph')
const markdown = require('../src/marked-extended')

const scormify = (_package, user) => {
    return new Promise((resolve, reject) => {
        const package_dir = path.join(__dirname, encodeURIComponent(_package.title))
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
            }, function() {
                const package_name = `${_package.title.split(" ").join("")}_v0.1.0_${new Date().toISOString().substring(0,10)}_${Number(new Date().getTime().toString().substring(0,10))}`
                
                const poll = () => {
                    fs.readdir(output_dir, (err, files) => {
                        const [file] = files.filter(f => f.includes(package_name))
                        return file ? resolve(path.join(output_dir, file)) : poll()
                    })
                }
                
                poll()
            })
        })
    })
}

module.exports = scormify