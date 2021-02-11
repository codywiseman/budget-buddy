export default function toDollar(value) {
  const parsed = parseInt(value)
  return '$' + parsed.toFixed(2)
}
