import http from 'http'
import { parse } from 'url'

const getBase64 = (uri) => {
    return new Promise(resolve => {
        http.get(parse(uri), resp => {
            const data = []
            resp.on('data', function(chunk) {
                data.push(chunk)
            }).on('end', function() {
                const buffer = Buffer.concat(data)
                resolve(buffer.toString('base64'))
            });
        })
    })
}

export const get = async ({ query }) => {
    const ip = query.get('ip')
    const uri = `http://${ip}/webcapture.jpg?command=snap&channel=1`
    const data = await getBase64(uri)

    return {
        status: 200,
        body: {
            ok: true,
            data
        }
    }
}