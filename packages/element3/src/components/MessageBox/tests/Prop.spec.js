import props from '../src/props.js'
describe('porps', () => {
  test('type', () => {
    expect(props.type.validator('success')).toBeTruthy()
    expect(props.type.validator()).toBeFalsy()
  })
  test('category', () => {
    expect(props.category.validator('alert')).toBeTruthy()
  })
})
