const scopackager = require('simple-scorm-packager')
const fs = require('fs')
const path = require('path')
const { exec, execSync } = require('child_process')
const markdown = require('../markdown')

const scormify = (_package, user) => {
    return new Promise((resolve, reject) => {
        
        const title = _package.title.split(" ").join("").toLowerCase()
        const package_dir = path.join(__dirname, 'builds', title)
        const output_dir = path.join(__dirname, '..', 'public', 'packages')
        
        try {
            execSync(`rm -fr ${package_dir}`)
            fs.mkdirSync(package_dir)
        } catch(err) {
            console.error(err)
            return reject(err)
        }
    
        const pages = _package.pages.map(page => markdown(page.markdown))
    
        fs.writeFile(path.join(package_dir, 'pages.json'), JSON.stringify(pages), 'utf8', err => {
            if (err) return reject(err)
            exec(`${process.cwd()}/node_modules/rollup/dist/bin/rollup --config ./scorm/scormify.config.js --name="${title}"`, (err, stdout, stderr) => {
                if (err) return reject(err)
                
                scopackager({
                    version: '1.2',
                    organization: 'WhiteHat',
                    title: title,
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
                    const package_name = `${title}_v1.0.0_${new Date().toISOString().substring(0,10)}`
                    
                    let limit = 0
                    
                    const poll = () => {
                        fs.readdir(output_dir, (err, files) => {
                            if (limit > 1000) {
                                return reject(new Error(`cant find file that includes ${package_name}`))
                            }
                            const [file] = files.filter(f => f.toLowerCase().includes(package_name))
                            limit += 1
                            return file ? resolve(path.join(output_dir, file)) : poll()
                        })
                    }
                    
                    poll()
                })
            })   

        })
    })
}

module.exports = scormify