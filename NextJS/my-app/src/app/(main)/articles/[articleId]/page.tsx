"use client"
import Link from "next/link"
import {use} from 'react';
// if params and search params are needed in client component then we need to use the use hook 
// export default async function NewsArticle({params , searchParams}:
export default function NewsArticle({params , searchParams}:
    {
        
        params : Promise<{articleId: string}>;

        searchParams:Promise<{lang?:'en'| 'np'| 'hi'}>;


    }
){
    const {articleId} = use(params);
    const {lang= "en"} = use(searchParams);

    return(
        <>
        <h1>New article {articleId}</h1>
        <p>
            Reading in {lang}
        </p>
        <div>
            <Link href={`/articles/${articleId}?lang=np`}>Nepali</Link>
            <Link href={`/articles/${articleId}?lang=en`}>English</Link>
            <Link href={`/articles/${articleId}?lang=hi`}>Hindi</Link>
        </div>
        </>
    )
}