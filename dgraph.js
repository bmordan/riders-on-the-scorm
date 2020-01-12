const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub("localhost:9080", grpc.credentials.createInsecure())
const dgraphClient = new dgraph.DgraphClient(clientStub)

const schema = `
    googleSub: string @index(exact) .
    packages: [uid] .
`
const op = new dgraph.Operation()
op.setSchema(schema)
await dgraphClient.alter(op)

module.exports = {
    getUser: uid => {
        return {
            id: uid,
            name: "",
            avatar: "",
            packages: []
        }
    },
    createPackage: meta => {
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