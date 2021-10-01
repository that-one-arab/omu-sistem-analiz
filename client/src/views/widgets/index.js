export function crntYear() {
    return new Date().getFullYear()
}

export function crntMonth() {
  const crntMonth = new Date().getMonth()+1
  if (crntMonth < 10)
    return '0' + crntMonth
  return crntMonth
}