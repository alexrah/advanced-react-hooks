// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import logger from "./../helpers/logger";

type tState = {
    count: number
}

function countReducer(prevState:tState,currState:tState|((currState:tState)=> tState)):tState {

    if(typeof currState === 'function'){
        return currState(prevState);
    }
    return {...prevState,...currState};

}


function Counter({initialCount = {count:0}, step = 1}:{initialCount?:tState,step?:number}) {
    // 🐨 replace React.useState with React.useReducer.
    // 💰 React.useReducer(countReducer, initialCount)
    // const [count, setCount] = React.useState(initialCount)

    // const [count, setCount] = React.useReducer<React.Reducer<number, number>>(countReducer,initialCount)

    const [state, setState] = React.useReducer<React.Reducer<tState,tState | ((currState:tState)=> tState) >>(countReducer,initialCount)


    // 💰 you can write the countReducer function so you don't have to make any
    // changes to the next two lines of code! Remember:
    // The 1st argument is called "state" - the current value of count
    // The 2nd argument is called "newState" - the value passed to setCount
    const {count} = state;
    const incrementObj = () => setState({ count: count + 1 })
    const incrementFunc = () => setState( (prevState) => ({count: prevState.count + step}) )
    return (
        <div>
            <button data-testid='incrementObj' onClick={incrementObj}>incrementObj</button>
            <button data-testid='incrementFunc' onClick={incrementFunc}>incrementFunc</button>
            <p role='alert'>{count}</p>
        </div>
        )

}

function App() {
    return <Counter />
}

export default App
