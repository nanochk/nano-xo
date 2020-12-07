import { checkWin } from './checkWin.js'

test('No win with less than 3 moves', () => {
  expect(checkWin([1, 2])).toBe(false)
})

test('No win on 1, 2, 3', () => {
  expect(checkWin([1, 2, 3])).toBe(false)
})

test('Win! on 3, 4, 5', () => {
  expect(checkWin([3, 4, 5])).not.toBe(false)
})

test('Win! on 0, 3, 6, 7, 8', () => {
  expect(checkWin([0, 3, 6, 7, 8])).toEqual([6, 7, 8])
})
