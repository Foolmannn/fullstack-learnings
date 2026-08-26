import { title } from "process"

/*
We can export the metadata from both the page and layout file. Page metadata is given priority when overlap occurs . 

Priority is given to the deeper components metadata 
*/

// static metadata
export const metadata = {
    title: "About Page "
}
export default function About(){
    return <h1>About Page</h1>
}