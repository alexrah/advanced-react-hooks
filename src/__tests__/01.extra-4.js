import * as React from 'react'
import {alfredTip} from '@kentcdodds/react-workshop-app/test-utils'
import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import App from '../final/01'
import App from '../exercise/01.extra-4'

test('clicking the button increments the count with useReducer', async () => {
    const {container} = render(<App />)
    // const button = container.querySelector('button')
    const label = screen.getByRole('alert');
    const increment = screen.getByText('increment');
    await userEvent.click(increment)
    expect(label).toHaveTextContent('1')
    await userEvent.click(increment)
    expect(label).toHaveTextContent('2')

    const decrement = screen.getByText('decrement');
    await userEvent.click(decrement)
    expect(label).toHaveTextContent('1')

})
