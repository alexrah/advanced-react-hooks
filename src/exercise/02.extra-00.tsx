// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

type tPokemonAttackSpecial = {
  name: string,
  type: string,
  damage: number
}

type tPokemon = {
  attacks: {
    special: tPokemonAttackSpecial[]
  },
  fetchedAt: string,
  id: string,
  image: string,
  name: string,
  number: string
}

function useAsync<D>(asyncCallback:()=>Promise<D>|void,depsTriggeringUseEffect:any[],initialState:{
  status: 'pending'|'idle'|'resolved'|'rejected',
  data: null|D,
  error: null|string
}){

  type tState = typeof initialState

  type tAction = {
    type: 'pending'|'resolved'|'rejected',
    data?: null|D
    error?: null|string,

  }

  // 🐨 this is going to be our generic asyncReducer
  const pokemonInfoReducer = (state:tState, action:tAction):tState => {
    switch (action.type) {
      case 'pending': {
        // 🐨 replace "pokemon" with "data"
        return {status: 'pending', data: null, error: null}
      }
      case 'resolved': {
        // 🐨 replace "pokemon" with "data" (in the action too!)
        return {status: 'resolved', data: (action.data as D), error: null}
      }
      case 'rejected': {
        // 🐨 replace "pokemon" with "data"
        return {status: 'rejected', data: null, error: (action.error as string)}
      }
      default: {
        throw new Error(`Unhandled action type: ${action.type}`)
      }
    }
  }

  const [state, dispatch] = React.useReducer<React.Reducer<tState,tAction>>(pokemonInfoReducer, initialState)

  React.useEffect(() => {

    const promise = asyncCallback();
    if(!promise){
      return;
    }
    dispatch({type: 'pending'})
    promise.then(
        data => {
          dispatch({type: 'resolved', data })
        },
        error => {
          dispatch({type: 'rejected', error})
        },
    )
    // 🐨 you'll accept dependencies as an array and pass that here.
    // 🐨 because of limitations with ESLint, you'll need to ignore
    // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
  }, depsTriggeringUseEffect)

  return state;

}

function PokemonInfo({pokemonName}:{pokemonName:string}) {
  // 🐨 move all the code between the lines into a new useAsync function.
  // 💰 look below to see how the useAsync hook is supposed to be called
  // 💰 If you want some help, here's the function signature (or delete this
  // comment really quick if you don't want the spoiler)!
  // function useAsync(asyncCallback, dependencies) {/* code in here */}



  const {status, data, error} = useAsync<tPokemon>(
      () => {
        if(!pokemonName){
          return;
        }
        return fetchPokemon(pokemonName);
      },
      [pokemonName],
      {
        status: pokemonName ? "pending" : "idle",
        data: null,
        error: null
      }
  )

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={data} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName:string) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
