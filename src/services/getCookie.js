export default function getCookie(nomeCookie) {
  const nomeCookieEQ = nomeCookie + "="; // Nome do cookie + "="
  const cookies = document.cookie.split(';'); // Divide a string de cookies em um array

  // Percorre todos os cookies para encontrar o desejado
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nomeCookieEQ) === 0) {
      return cookie.substring(nomeCookieEQ.length, cookie.length);
    }
  }
  return null; // Retorna nulo se o cookie não for encontrado
}