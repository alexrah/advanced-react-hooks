// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import logger from "./../helpers/logger";

type tState = {
    count: number
}

type tAction = {
    value: 'INCREMENT'|'DECREMENT',
    step: number
}

function countReducer(prevState:tState,action:tAction):tState {
    switch (action.value){
        case 'INCREMENT':
            return {count: prevState.count + action.step}
        case 'DECREMENT':
            return {count: prevState.count - action.step}
    }
}


function Counter({initialCount = {count:0}, step = 1}:{initialCount?:tState,step?:number}) {
    // 🐨 replace React.useState with React.useReducer.
    // 💰 React.useReducer(countReducer, initialCount)
    // const [count, setCount] = React.useState(initialCount)

    // const [count, setCount] = React.useReducer<React.Reducer<number, number>>(countReducer,initialCount)

    const [state, dispatch] = React.useReducer<React.Reducer<tState,tAction>>(countReducer,initialCount)


    // 💰 you can write the countReducer function so you don't have to make any
    // changes to the next two lines of code! Remember:
    // The 1st argument is called "state" - the current value of count
    // The 2nd argument is called "newState" - the value passed to setCount

    const increment = () => dispatch({value: "INCREMENT",step})
    const decrement = () => dispatch({value: "DECREMENT",step})
    const {count} = state
    return (
        <div>
            <button data-testid='incrementObj' onClick={increment}>increment</button>
            <button data-testid='incrementFunc' onClick={decrement}>decrement</button>
            <p role='alert'>{count}</p>
        </div>
        )

}

function App() {
    return <Counter />
}

export default App
