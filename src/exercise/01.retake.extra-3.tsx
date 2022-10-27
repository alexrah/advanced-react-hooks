// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import logger from "../helpers/logger";

type tState = {
  count: number
}

const countReducer = (prevState:tState,newState:tState|((prevState:tState)=>tState)) => {
  if (typeof newState === 'function'){
    return newState(prevState);
  } else {
    return newState;
  }
}

function Counter({initialCount = 0, step = 1}) {
  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  // const [count, setCount] = React.useState(initialCount)

  const [state, setState] = React.useReducer<React.Reducer<tState,tState|((prevState:tState)=>tState)>>(countReducer,{ count: initialCount})

  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "newState" - the value passed to setCount
  // const increment = () => setState( (currentState) => ({"count": currentState.count + step}) )
  const increment = () => setState( {"count": state.count + step} )
  return <button onClick={increment}>{state.count}</button>
}

function App() {
  return <Counter />
}

export default App
