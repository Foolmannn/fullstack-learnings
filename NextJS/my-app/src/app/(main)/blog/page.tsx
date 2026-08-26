import { Metadata } from "next"
export const metadata: Metadata = {
  title: {
    default:"basic next js app",

    absolute:"Blog", //if set to the child it will overwrite the parent layout 

  },
}

export default function Blog(){
    return <h1>Blog Page !</h1>
}