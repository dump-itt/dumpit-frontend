export default function Home() {
  return (
    <main className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-full sm:w-1/2 md:w-1/3 bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4 text-center fun-font">Dump.it</h1>
          
          <form className="mb-4">
              <label htmlFor="repoNumber" className="block text-sm font-medium text-gray-700">Número do Repositório:</label>
              <input type="text" id="repoNumber" name="repoNumber" className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
              
              <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Acessar Repositório</button>
          </form>
          
          <p className="text-center">ou</p>
          
          <a href="#" className="block mt-2 w-full text-center text-blue-500 hover:underline">Criar Novo Repositório</a>
      </div>
    </main>
  )
}
