import { net } from "electron";

export type News = {
    date:string
    content:string
}

export function fetchNews(callback:(newsData:Array<News>) => void){
    net.request({
        method: 'GET',
        url: 'https://api.github.com/gists/0efc3197b5020adce9be0cf9adb14eab'
    })
    .on('response', (response) => {
        var body = '';
        response.on('data', c =>  body += c)
        response.on('end', function () {
            try {
                let rawReply:{files:{data:{content:string}}} = JSON.parse(body)
                let reply:Array<News> = JSON.parse(rawReply.files.data.content)
                if (reply != null) callback(reply)
                else throw new Error("Null response while getting the news")
            } catch (e) {
                console.error(e)
            }
        })
    })
    .end()
}