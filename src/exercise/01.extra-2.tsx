// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import logger from "./../helpers/logger";

type tState = {
    count: number
}

function countReducer(prevState:number,action:number){
    const lg = new logger();
    lg.v('prevState',prevState);
    lg.s('action',action);
    return prevState + action
}

function countReducer2(prevState:tState,currState:tState):tState {

    return {...prevState,...currState};

}

function Counter({initialCount = {count:0}, step = 1}:{initialCount?:tState,step?:number}) {
    // 🐨 replace React.useState with React.useReducer.
    // 💰 React.useReducer(countReducer, initialCount)
    // const [count, setCount] = React.useState(initialCount)

    // const [count, setCount] = React.useReducer<React.Reducer<number, number>>(countReducer,initialCount)

    const [state, setState] = React.useReducer<React.Reducer<tState,tState>>(countReducer2,initialCount)


    // 💰 you can write the countReducer function so you don't have to make any
    // changes to the next two lines of code! Remember:
    // The 1st argument is called "state" - the current value of count
    // The 2nd argument is called "newState" - the value passed to setCount
    const {count} = state;
    const increment = () => setState({ count: count + 1 })
    return <button onClick={increment}>{count}</button>
}

function App() {
    return <Counter />
}

export default App
