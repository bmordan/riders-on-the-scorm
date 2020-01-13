const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub("localhost:9080", grpc.credentials.createInsecure())
const dgraphClient = new dgraph.DgraphClient(clientStub)

async function setSchema() {
    const schema = `
        gid: string @index(exact) .
        title: string @index(exact) .
        packages: [uid] .
    `
    const op = new dgraph.Operation()
    op.setSchema(schema)
    await dgraphClient.alter(op)
}

const queries = {
    getUserByGid: `query user($gid: string) {
        user(func: eq(gid, $gid)) {
            uid
            name
            picture
            packages {
                uid
                title
                sharedwith {
                    uid
                    name
                    picture
                }
            }
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
                download
                sharedwith {
                    uid
                    name
                    picture
                }
            }
        }
    }`
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
        let result = await txn.queryWithVars(queries.getUserByUid, {$uid: uid})
        let {user} = result.getJson()
        await txn.discard()
        return user[0]
    },
    createPackage: (uid, package) => {
        return {}
    },
    getPackage: pid => {
        return {}
    },
    updatePackage: update => {
        return {}
    },
    removePackage: pid => {
        return true
    }
}

setSchema()