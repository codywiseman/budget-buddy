export default function getAccessToken(user) {
  fetch('/api/budgetbuddy/get_access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: user })
  })
    .then(response => response.json())
    .then(accessToken => window.localStorage.setItem('accessToken', accessToken[0].accessToken))
    .catch(err => console.log('ERROR'))
}
