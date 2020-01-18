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


module.exports = {
    getOrCreateUser: async googleUser => {
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
    },
    getUser: async uid => {
        const txn = dgraphClient.newTxn()
        const result = await txn.queryWithVars(queries.getUserByUid, {$uid: uid})
        const {user} = result.getJson()
        await txn.discard()
        return user[0]
    },
    createPackage: async (uid, package) => {
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
                                page: 1,
                                markdown: "IyBOZXcgUGFnZQ==",
                                html: ""
                            }
                        ]
                    }
                ]
            }
            const node = new dgraph.Mutation()
            node.setSetJson(packageData)
            await txn.mutate(node)
            // node.getUidsMap().get("title") {uid: "_:title"}
            const newPackageResult = await txn.queryWithVars(queries.getPackageByTitle, {$uid:uid, $title: package.title})
            const {user} = newPackageResult.getJson()
            packages = user[0].packages
            await txn.commit()
        } finally {
            await txn.discard()
        }
        return packages
    },
    getPackage: async pid => {
        let currentPackage = {}
        const txn = dgraphClient.newTxn()
        try {
            const result = await txn.queryWithVars(queries.getPackageByUid, {$uid: pid})
            const { _package } = result.getJson()
            currentPackage = _package
        } finally {
            await txn.discard()
        }
        return currentPackage
    },
    createPage: async (uid, pid, {page, markdown}) => {
        let pgid = null
        const txn = dgraphClient.newTxn()
        try {
            const mu = new dgraph.Mutation()
            mu.setSetJson({
                uid: uid,
                packages: [
                    {
                        uid: pid,
                        pages: [
                            {
                                uid: "_:newpage",
                                page: page,
                                markdown: markdown,
                                createdAt: new Date().toISOString()
                            }
                        ]
                    }
                ]
            })
            const mutation = await txn.mutate(mu)
            await txn.commit()
            pgid = mutation.getUidsMap().get("newpage")
        } finally {
            await txn.discard()
        }
        return pgid
    },
    updatePage: async (update) => {
        const txn = dgraphClient.newTxn()
        try {
            const mu = new dgraph.Mutation()
            mu.setSetJson({...update, updatedAt: new Date().toISOString()})
            await txn.mutate(mu)
            await txn.commit()
        } finally {
            await txn.discard()
        }
    },
    deletePackageForUser: async (uid, pid) => {
        let packages = []
        const txn = dgraphClient.newTxn()
        try {
            const mu = new dgraph.Mutation()
            mu.setDeleteJson({
                uid: uid,
                packages: [
                    {
                        uid: pid
                    }
                ]
            })
            await txn.mutate(mu)
            const result = await txn.queryWithVars(queries.getUserByUid, {$uid: uid})
            const {user} = result.getJson()
            packages = user[0].packages
            await txn.commit()
        } finally {
            txn.discard()
        }
        return packages
    }
}

setSchema()