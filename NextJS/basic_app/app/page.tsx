import Hello from "../components/Hello"

const Home = () => {
  // By default the every components are the SERVER COMPONENTS
  console.log('What type of component I am ?')  // Although this is seen in the client side (browser ) but it is server components it is just the Modern next js will share the log to the client side as the Server at the beginning of the log indicates 
  return (
    <main>
      <div>Welcome to HomePage</div>
      <Hello/>  
      {/* The log of the client component is still in the server side and also in the client side. This is because of the Server Side Pre Rendering (SSPR).  */}
      {/* This is because server components are only rendered in the server side BUT the client components are pre - rendered on the server side to create a static shell and then hydrated on the client side   */}

      {/* This means that everything within the client component
        that doesn't require interactivity or isn't dependent on the browser is still rendered on the server. The code or
        parts that rely on the browser or require interactivity are left as placeholders during serverside pre-rendering. When they reach the
        client, the browser then renders the client components and fills in the placeholders left by the server */}
    </main>

  )
}

export default Home