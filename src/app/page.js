'use client'
import { useState } from "react";
import api from "@/services/api";
import { useRouter } from 'next/navigation';
import Alert from "@/components/Alert";
import isValidResponse from "@/services/validateResponse";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  function handleRepositoryCreation(e) {
    e.preventDefault();
    setLoading(true);

    const addPasswordCheckbox = document.querySelector('#addPassword');
    const shouldAddPassword = addPasswordCheckbox.checked;
    const password = shouldAddPassword ? document.querySelector('#password').value : null;

    api.post("/repositories", {password}).then((response) => {
      setLoading(false);

      if (isValidResponse(response)) {
        push(`/repo?id=${response.data.id}`);
      } else {
        setShowAlert(true);
      }
    });
  }
  function handleAddPasswordChange() {
        const addPasswordCheckbox = document.querySelector('#addPassword');
        const passwordInput = document.querySelector('#password');

        if (addPasswordCheckbox.checked) {
            passwordInput.removeAttribute('disabled');
        } else {
            passwordInput.setAttribute('disabled', 'true');
        }
  }

  return (
    <main className="bg-gray-100 flex justify-center items-center h-screen">
      {loading && <LoadingSpinner />}
      <Alert showAlert={showAlert} setShowAlert={setShowAlert} type="error" message="Ops, algo deu errado! " />
      <div className="w-full sm:w-1/2 md:w-1/3 bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4 text-center fun-font text-gray-900">Dump.it</h1>

          <form method="GET" action="/repo" className="mb-4">
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">Número do Repositório:</label>
              <input type="text" id="id" name="id" className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black" />
              <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Acessar Repositório</button>
          </form>

          <p className="text-center text-gray-900">ou</p>

          <a onClick={handleRepositoryCreation} href="#" className="block mt-2 w-full text-center text-blue-500 hover:underline">Criar Novo Repositório</a>
          <label htmlFor="addPassword" className="block text-sm font-medium text-gray-700">Habilitar senha no repositório <input type="checkbox" id="addPassword" name="addPassword" className="mt-1" onChange={handleAddPasswordChange} /></label>

          <input type="password" id="password" placeholder={"Senha"} name="password" className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black" disabled/>
      </div>
    </main>
  )
}
