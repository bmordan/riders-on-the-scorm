const express = require('express')
const session = require('express-session')
const app = express()
const fetch = require('node-fetch')
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NODE_ENV = 'development' } = process.env
const {OAuth2Client} = require('google-auth-library')
const gapi = new OAuth2Client(GOOGLE_CLIENT_ID)
const dgraph = require('./dgraph')
const scormify = require('./scorm')
const fs = require('fs')
const path = require('path')

const publicRoot = file => `${__dirname}/public/${file}.html`
const session_settings = {
    secret: GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true
}

/*
    process.env.NODE_ENV === 'production' ? { cookie: { secure: true } } : {}

    Note be careful when setting this to true, as compliant clients will not send the cookie back to the server in the future if the browser does not have an HTTPS connection.

    Please note that secure: true is a recommended option. However, it requires an https-enabled website, i.e., HTTPS is necessary for secure cookies. If secure is set, and you access your site over HTTP, the cookie will not be set. If you have your node.js behind a proxy and are using secure: true, you need to set "trust proxy" in express
*/

app.set('trust proxy', 1)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public', {index: "index.html"}))
app.use(session(session_settings))

async function getGoogleUser(token) {
    let payload
    if (NODE_ENV === "development") {
        const ticket = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
            .then(res => res.json())
            .then(payload => payload)
            .catch(console.err)
        payload = ticket
    } else {
        const ticket = await gapi.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        })
        payload = ticket.getPayload()
    }

    const { error, iss, aud, exp, hd } = payload
    return !error
        && (iss === "https://accounts.google.com" || iss === "accounts.google.com")
        && aud === GOOGLE_CLIENT_ID
        && Number(exp) > Math.floor(new Date().getTime()/1000)
        && hd === "whitehat.org.uk"
        && payload
}

function protect (req, res, next) {
    !req.session.uid ? res.sendFile(publicRoot("index")) : next()
}

app.get("/", (req, res) => {
    res.sendFile(publicRoot("index"))
})
app.post("/login", (req, res) => {
    
    const { tokenid } = req.body
    
    getGoogleUser(tokenid)
        .then(googleUser => dgraph.getOrCreateUser(googleUser))
        .then(user => {
            const [{uid}] = user
            req.session.uid = uid
            res.send({status: true, uid})
        })
        .catch(err => {
            console.error(err)
            res.send({status: false})
        })
})
app.get("/users", protect, (req, res) => {
    dgraph.getUsers()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
app.get("/users/:uid", protect, (req, res) => {
    return (req.session.uid === req.params.uid)
        ? res.sendFile(publicRoot("users"))
        : res.sendFile(publicRoot("index"))
})
app.get("/users/:uid/packages", protect, (req, res) => {
    dgraph.getUser(req.params.uid)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
app.post("/users/:uid/packages", protect, (req, res) => {
    dgraph.createPackage(req.session.uid, req.body)
        .then(_package => {
            res.send(_package)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
app.get("/users/:uid/packages/:pid/delete", (req, res) => {
    dgraph.deletePackageForUser(req.params.uid, req.params.pid)
        .then(packages => {
            res.send(packages)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
app.get("/users/:uid/packages/:pid/share/:sid", protect, (req, res) => {
    const {uid, pid, sid} = req.params
    dgraph.sharedwith(uid, pid, sid)
        .then(_package => {
            res.send(_package)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
app.get("/users/:uid/packages/:pid/download", (req, res) => {
    let user

    dgraph.getUser(req.params.uid)
        .then(_user => {
            user = _user
            return dgraph.getPackageByUid(req.params.pid)
        })
        .then(_package => scormify(_package, user))
        .then(zip => {
            res.setHeader(zip.split("/").pop(), 'x-scorm-download')
            res.sendFile(zip)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
app.get("/users/:uid/packages/:pid/download/:filename/remove", (req, res) => {
    fs.unlink(path.join(__dirname, 'public', 'packages', req.params.filename), err => {
        return res.send(err || {removed: req.params.filename})
    })
})
app.get("/users/:uid/packages/:pid", (req, res) => {
    dgraph.getPackageByUid(req.params.pid)
        .then(_package => {
            res.send(_package)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
app.get("/users/:uid/packages/:pid/pages/:page/new", (req, res) => {
    const {pid, page} = req.params
    dgraph.createPage(pid, page)
        .then(pid => dgraph.getPackageByUid(pid))
        .then(_package => res.send(_package))
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
app.post("/users/:uid/packages/:pid/pages/update", (req, res) => {
    dgraph.updatePages(req.params.pid, req.body)
        .then(pid => dgraph.getPackageByUid(pid))
        .then(_package => {
            res.send(_package)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
app.get("/users/:uid/packages/:pid/pages/:pgid/delete", (req, res) => {
    const {pid, pgid} = req.params
    const noPages = _package => !_package.pages || !_package.pages.length
    dgraph.deletePageForUser(pid, pgid)
        .then(_package => {
            if (noPages(_package)) {
                return dgraph.createPage(pid, 0).then(pid => dgraph.getPackageByUid(pid))
            } else {
                return _package
            }
        })
        .then(_package => {
            return res.send(_package)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
app.get("/logout", (req, res) => {
    delete req.session.uid
    res.sendFile(publicRoot("index"))
})
app.listen(process.env.PORT, () => console.log(`
                                                          #####   #####  ####### ######  #     # 
 #    #   ##   #####  #    # #####   ####  #    # #    # #     # #     # #     # #     # ##   ## 
 ##  ##  #  #  #    # #   #  #    # #    # #    # ##   # #       #       #     # #     # # # # # 
 # ## # #    # #    # ####   #    # #    # #    # # #  #  #####  #       #     # ######  #  #  # 
 #    # ###### #####  #  #   #    # #    # # ## # #  # #       # #       #     # #   #   #     # 
 #    # #    # #   #  #   #  #    # #    # ##  ## #   ## #     # #     # #     # #    #  #     # 
 #    # #    # #    # #    # #####   ####  #    # #    #  #####   #####  ####### #     # #     # 
port ${process.env.PORT}`))
