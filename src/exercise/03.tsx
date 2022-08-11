// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

// 🐨 create your CountContext here with React.createContext

// 🐨 create a CountProvider component here that does this:
//   🐨 get the count state and setCount updater with React.useState
//   🐨 create a `value` array with count and setCount
//   🐨 return your context provider with the value assigned to that array and forward all the other props
//   💰 more specifically, we need the children prop forwarded to the context provider

const CountContext = React.createContext<[number,React.Dispatch<React.SetStateAction<number>>]>([0,()=>{}]);

function CountDisplay() {
  // 🐨 get the count from useContext with the CountContext
    const [count] = React.useContext(CountContext);
  // const count = 0
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  // 🐨 get the setCount from useContext with the CountContext
    const [,setCount] = React.useContext(CountContext);
  // const setCount = (cb:(count:number)=>number  ) => {}
    const increment = () => setCount((prevCount) => prevCount + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {

    const countUseState = React.useState<number>(0)

  return (
      <div>
          <CountContext.Provider value={countUseState}>
              {/*
        🐨 wrap these two components in the CountProvider so they can access
        the CountContext value
      */}
              <CountDisplay/>
              <Counter/>
          </CountContext.Provider>
      </div>
  )
}

export default App
