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

function useAsync<D>(initialState:{
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

  const useSafeDispatch = (dispatch:React.Dispatch<tAction>) =>{

    const mountedRef = React.useRef(false)

    React.useEffect(()=>{
      mountedRef.current = true;
      return () => {
        mountedRef.current = false
      }
    }, [])

    return React.useCallback((args:tAction):void => {

      return (mountedRef.current) ? dispatch(args) : void 0;

    },[dispatch])

  }

  // 🐨 this is going to be our generic asyncReducer
  const asyncReducer = (state:tState, action:tAction):tState => {
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

  const [state, unsafeDispatch] = React.useReducer<React.Reducer<tState,tAction>>(asyncReducer, initialState)

  const {status, data, error} = state

  const dispatch = useSafeDispatch(unsafeDispatch);

  const run = React.useCallback((promiseCallback:Promise<any>) => {

        dispatch({type: 'pending'})
        promiseCallback.then(
            data => {
              dispatch({type: 'resolved', data })
            },
            error => {
              dispatch({type: 'rejected', error})
            },
        )

      },
[])

  return {status, data, error, run};

}

function PokemonInfo({pokemonName}:{pokemonName:string}) {
  // 🐨 move all the code between the lines into a new useAsync function.
  // 💰 look below to see how the useAsync hook is supposed to be called
  // 💰 If you want some help, here's the function signature (or delete this
  // comment really quick if you don't want the spoiler)!
  // function useAsync(asyncCallback, dependencies) {/* code in here */}

  const {status, data, error, run} = useAsync<tPokemon>(
      {
        status: pokemonName ? "pending" : "idle",
        data: null,
        error: null
      }
  )

  React.useEffect(() => {

    if(!pokemonName){
      return;
    }
    run(fetchPokemon(pokemonName))

  }, [pokemonName,run])


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
