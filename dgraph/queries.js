module.exports = {
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
                createdAt
                sharedwith {
                    uid
                    name
                    picture
                }
            }
        }
    }`,
    getPackageByTitle: `query getPackage($uid: string, $title: string) {
        user(func: uid($uid)) {
            packages @filter(eq(title, $title)) {
                uid
                title
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