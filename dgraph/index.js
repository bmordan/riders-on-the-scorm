const dgraph = require('dgraph-js')
const grpc = require('grpc')
const queries = require('./queries')

const clientStub = new dgraph.DgraphClientStub("localhost:9080", grpc.credentials.createInsecure())
const dgraphClient = new dgraph.DgraphClient(clientStub)
const toSlug = str => str.split(" ").join("-").toLowerCase()

async function setSchema() {
    const schema = `
        gid: string @index(exact) .
        title: string @index(exact) .
    `
    const op = new dgraph.Operation()
    op.setSchema(schema)
    await dgraphClient.alter(op)
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

const createPackage = async (uid, package) => {
    let packages = []
    const txn = dgraphClient.newTxn()
    try {
        const packageData = {
            uid: uid,
            packages: [
                {
                    title: package.title,
                    createdAt: new Date().toISOString(),
                    pages: [
                        {
                            markdown: "IyBOZXcgUGFnZQ==",
                            createdAt: new Date().toISOString()
                        }
                    ]
                }
            ]
        }
        const node = new dgraph.Mutation()
        node.setSetJson(packageData)
        await txn.mutate(node)
        const newPackageResult = await txn.queryWithVars(queries.getPackageByTitle, {$uid:uid, $title: package.title})
        const {user} = await newPackageResult.getJson()
        packages = user[0].packages
        await txn.commit()
    } finally {
        await txn.discard()
    }
    return packages
}

const getPackageByUid = async pid => {
    let currentPackage
    const txn = dgraphClient.newTxn()
    try {
        const result = await txn.queryWithVars(queries.getPackageByUid, {$uid: pid})
        const { _package } = await result.getJson()
        currentPackage = _package
    } finally {
        await txn.discard()
    }
    console.log("getPackageByUid", currentPackage[0])
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
                    markdown: "IyBOZXcgUGFnZQ==",
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

const insertDefaultPage = async (pid) => {
    let updatedPackage
    const txn = dgraphClient.newTxn()
    try {
        const mu = new dgraph.Mutation()
        mu.setSetJson({
            uid: pid,
            pages: [
                {
                    markdown: "IyBOZXcgUGFnZQ==",
                    createdAt: new Date().toISOString()
                }
            ]
        })
        await txn.mutate(mu)
        await txn.commit()
        updatedPackage = await getPackageByUid(pid)
    } finally {
        await txn.discard()
    }
    return updatedPackage
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
    deletePackageForUser,
    insertDefaultPage
}
