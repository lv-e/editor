
import * as React from "react";
import { useState, useEffect } from "react";
import { ipc } from "[comps]/electron/ipcRenderer";
import { News } from "[root]/main/main-welcome/message-handlers/news"
import "./start-options.less"

export function News (props) {

    let [news, setNews] = useState<News[]|null>(null)
    
    useEffect(() => {
        if (news == null) 
            ipc.welcome.fetch("news", ns => setNews(ns))
    })

    return <div className="news">
        ✦ The News Console
        <div className="log">
            { news != null ? 
                news.map( (newsItem, i) => {
                    return <section key={`${i}`}>
                        <h3># {newsItem.date}</h3>
                        <p>{newsItem.content}</p>
                    </section>
                })
            : null }
        </div>
    </div>
}