const dgraph = require('dgraph-js')
const grpc = require('grpc')
const url = process.env.NODE_ENV === 'development' ? 'localhost:9080' : 'alpha:9080'
const clientStub = new dgraph.DgraphClientStub(url, grpc.credentials.createInsecure())
const dgraphClient = new dgraph.DgraphClient(clientStub)

async function setSchema() {
    const schema = `
        gid: string @index(exact) .
        title: string @index(exact) .
    `
    const op = new dgraph.Operation()
    op.setSchema(schema)
    await dgraphClient.alter(op)
}

const queries = {
    getUserByGid: `query user($gid: string) {
        user(func: eq(gid, $gid)) {
            uid
            gid
        }
    }`,
    getUserByUid: `query user($uid: string) {
        user(func: uid($uid)) {
            uid
            name
            picture
            packages {
                uid
                title
                score
                createdAt
                sharedwith {
                    uid
                    name
                    picture
                }
            }
        }
    }`,
    getPackageByUid: `query getPackageByUid($uid: string) {
        _package(func: uid($uid)) {
            uid
            title
            score
            createdAt
            pages {
                uid
                markdown
                html
                createdAt
                updatedAt
            }
            sharedWith {
                uid
                name
                picture
            }
        }
    }`,
    getPageByUid: `query getPageByUid($uid: string) {
        page(func: uid($uid)) {
            uid
            markdown
            html
            createdAt
            updatedAt
        }
    }`
}

const getOrCreateUser = async googleUser => {
    const { sub: gid, email, name, picture } = googleUser
    const txn = dgraphClient.newTxn()
    let result = await txn.queryWithVars(queries.getUserByGid, {$gid: gid})
    let {user} = result.getJson()
    
    if (!user.length) {
        try {
            const mu = new dgraph.Mutation()
            mu.setSetJson({ gid, email, name, picture })
            await txn.mutate(mu)
            result = await txn.queryWithVars(queries.getUserByGid, {$gid: gid})
            user = result.getJson().user
            await txn.commit()
        } finally {
            await txn.discard()
        }
    }
    return user
}

const getUser = async uid => {
    const txn = dgraphClient.newTxn()
    const result = await txn.queryWithVars(queries.getUserByUid, {$uid: uid})
    const {user} = result.getJson()
    await txn.discard()
    return user[0]
}

const createPackage = async (uid, {title}) => {
    let _package = {}
    const txn = dgraphClient.newTxn()
    try {
        const packageData = {
            uid: uid,
            packages: [
                {
                    uid: '_:package',
                    title: title,
                    createdAt: new Date().toISOString(),
                    score: 0,
                    pages: [
                        {
                            markdown: `# ${title}\n`,
                            createdAt: new Date().toISOString()
                        }
                    ]
                }
            ]
        }
        const node = new dgraph.Mutation()
        node.setSetJson(packageData)
        const mut = await txn.mutate(node)
        await txn.commit()
        const pid = mut.getUidsMap().get('package')
        _package = await getPackageByUid(pid)
    } finally {
        await txn.discard()
    }
    return _package
}

const getPackageByUid = async pid => {
    let currentPackage
    const txn = dgraphClient.newTxn()
    try {
        const result = await txn.queryWithVars(queries.getPackageByUid, {$uid: pid})
        const { _package } = result.getJson()
        currentPackage = _package
    } finally {
        await txn.discard()
    }
    return currentPackage[0]
}

const createPage = async (pid) => {
    const txn = dgraphClient.newTxn()
    try {
        const mu = new dgraph.Mutation()
        mu.setSetJson({
            uid: pid,
            pages: [
                {
                    markdown: "# New Page",
                    createdAt: new Date().toISOString()
                }
            ]
        })
        await txn.mutate(mu)
        await txn.commit()
    } finally {
        await txn.discard()
    }
    return pid
}

const updatePages = async (pid, update) => {
    const updateTimestamped = {
        uid: pid,
        pages: update.map(page => ({...page, updatedAt: new Date().toISOString()}))
    }
    const topscore = updateTimestamped.pages.reduce((score, page) => {
        const matches = page.markdown.match(/\?{3}/g)
        score += matches ? matches.length : 0
        return score
    }, 0)
    updateTimestamped.score = topscore / 2
    const txn = dgraphClient.newTxn()
    try {
        const mu = new dgraph.Mutation()
        mu.setSetJson(updateTimestamped)
        await txn.mutate(mu)
        await txn.commit()
    } finally {
        await txn.discard()
    }
    return pid
}

const deletePageForUser = async (pid, pgid) => {
    let updatedPackage
    const txn = dgraphClient.newTxn()
    try {
        const mu = new dgraph.Mutation()
        mu.setDeleteJson([{
            uid: pid,
            pages: [
                {
                    uid: pgid
                }
            ]
        },
        {
            uid: pgid 
        }])
        
        await txn.mutate(mu)
        await txn.commit()
        updatedPackage = await getPackageByUid(pid)
    } catch (err) {
        console.error(err)
    } finally {
        await txn.discard()
    }
    return updatedPackage
}

const deletePackageForUser = async (uid, pid) => {
    let packages = []
    const txn = dgraphClient.newTxn()
    try {
        const mu = new dgraph.Mutation()
        mu.setDeleteJson([{
            uid: uid,
            packages: [
                {
                    uid: pid
                }
            ]
        }, {
            uid: pid
        }])
        await txn.mutate(mu)
        const result = await txn.queryWithVars(queries.getUserByUid, {$uid: uid})
        const {user} = result.getJson()
        packages = user[0].packages || []
        await txn.commit()
    } finally {
        await txn.discard()
    }
    return packages
}

setSchema()

module.exports = {
    getOrCreateUser,
    getUser,
    createPackage,
    getPackageByUid,
    createPage,
    updatePages,
    deletePageForUser,
    deletePackageForUser
}
