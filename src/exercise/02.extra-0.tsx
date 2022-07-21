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

type tState = {
  status: 'pending'|'idle'|'resolved'|'rejected',
  data: null|tPokemon,
  error: null|string|undefined
}


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

/**
 * @param {Function} cb async function returns a Promise and it's called inside useEffect hook
 * @param {Array} deps array of params passed to the cb() function
 * */
function useAsync<Data>(
    asyncCallback: () => Promise<Data> | undefined,
    deps: any[],
    initialState: {
      status: 'pending' | 'idle' | 'resolved' | 'rejected',
      data: null | Data,
      error: null | string | undefined
    }) {

  type tAction = {
    type: 'pending'|'resolved'|'rejected',
    data?: null|Data
    error?: null|string,
  }

  type tState = typeof initialState

// 🐨 this is going to be our generic asyncReducer
  const asyncReducer = (state:tState, action:tAction):tState => {
    switch (action.type) {
      case 'pending': {
        // 🐨 replace "pokemon" with "data"
        return {status: 'pending', data: null, error: null}
      }
      case 'resolved': {
        // 🐨 replace "pokemon" with "data" (in the action too!)
        return {status: 'resolved', data: (action.data as Data), error: null}
      }
      case 'rejected': {
        // 🐨 replace "pokemon" with "data"
        return {status: 'rejected', data: null, error: action.error}
      }
      default: {
        throw new Error(`Unhandled action type: ${action.type}`)
      }
    }
  }

  const [state, dispatch] = React.useReducer<React.Reducer<tState,tAction>>(asyncReducer, initialState)

  React.useEffect(() => {
    // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
    const promise = asyncCallback()
    if (!promise) {
      return
    }
    // then you can dispatch and handle the promise etc...
    dispatch({type:"pending"})
    promise.then(
        data => {
          dispatch({type: 'resolved', data})
        },
        error => {
          dispatch({type: 'rejected', error})
        },
    )
    // 🐨 you'll accept dependencies as an array and pass that here.
    // 🐨 because of limitations with ESLint, you'll need to ignore
    // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
  }, deps)

  return state;

}



function PokemonInfo({pokemonName}:{pokemonName:string}) {
  // 🐨 move all the code between the lines into a new useAsync function.
  // 💰 look below to see how the useAsync hook is supposed to be called
  // 💰 If you want some help, here's the function signature (or delete this
  // comment really quick if you don't want the spoiler)!

  // 🐨 here's how you'll use the new useAsync hook you're writing:
  // const state = useAsync(() => {
  //   if (!pokemonName) {
  //     return
  //   }
  //   return fetchPokemon(pokemonName)
  // }, [pokemonName])
  // 🐨 this will change from "pokemon" to "data"

  const state = useAsync<tPokemon>(() => {
        if (!pokemonName) {
          return
        }
        return fetchPokemon(pokemonName)
      },
      [pokemonName],
      {
        status: pokemonName ? 'pending' : 'idle',
        data: null,
        error: null
      })

  const {data, status, error} = state

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
