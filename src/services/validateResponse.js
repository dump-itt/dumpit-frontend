export default function isValidResponse(response) {
  return response.status >= 200 && response.status < 300;
}