import { Metadata } from "next"
import { resolve } from "path"
export const metadata: Metadata = {
  title: {
    default:"basic next js app",

    absolute:"Blog", //if set to the child it will overwrite the parent layout 

  },
}

export default async function Blog(){
  await new Promise(resolve =>{
    setTimeout(() => {
      resolve("Intentional Delay ")
    }, 3000);
  })
    return <h1>Blog Page !</h1>
}