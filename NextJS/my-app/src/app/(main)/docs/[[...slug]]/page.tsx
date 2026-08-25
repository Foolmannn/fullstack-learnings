// CATCH ALL SEGMENTS 

export default async function Docs(
    
    {params,} : {
    params: Promise<{ slug: string[] }>;
}){

    const {slug} = await params;

    if (slug?.length === 2){
        return (<h1>
            Viewing docs for feature {slug[0]} and concept {slug[1]}
            </h1>
        )
    }else if (slug?.length === 1){
        return (
            <h1> Viewing docs for feature {slug[0]}</h1>
        )
    }
    return <h1>Docs page</h1>  // This will be triggered on the /docs 


}

// if we again wraps the folder name with the square brackets then it became the optional catch all segments 

// we can use the optional catch all routes if we have different UI based on the url. 