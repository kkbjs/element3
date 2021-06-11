export function parseLayout(layout: string): string[] {
  const recursion = (arr: string[], index: number): string[] => {
    const result = []
    for (let i = index; i < arr.length; i++) {
      const item = arr[i]
      if (item === '->') {
        result.push(recursion(arr, i + 1))
        break
      }
      result.push(item)
    }
    return result
  }
  return recursion(
    layout.split(',').map((item) => item.trim()),
    0
  )
}
