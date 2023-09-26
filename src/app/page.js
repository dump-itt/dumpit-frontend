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
    const accessPassword = shouldAddPassword ? document.querySelector('#password').value : null;

    const addEditPasswordCheckbox = document.querySelector('#addEditPassword');
    const shouldAddEditPassword = addEditPasswordCheckbox.checked;
    const editPassword = shouldAddEditPassword ? document.querySelector('#editPassword').value : null;
    

    api.post("/repositories", {accessPassword, editPassword}).then((response) => {
      if (isValidResponse(response)) {
        push(`/repo?id=${response.data.id}`);
      } else {
        setLoading(false);
        setShowAlert(true);
      }
    });
  }

  function handleAddPasswordChange(isEditPassword) {
        const addPasswordCheckbox = document.querySelector(isEditPassword ? '#addEditPassword' : '#addPassword');
        const passwordInput = document.querySelector(isEditPassword ? '#editPassword' : '#password');

        if (addPasswordCheckbox.checked) {
            passwordInput.style = 'display: block;';
        } else {
            passwordInput.style = 'display: none;';
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
          <label htmlFor="addPassword" className="flex items-center justify-center text-sm font-medium text-gray-700 mt-2">
            <input type="checkbox" id="addPassword" name="addPassword" className="mr-2" onChange={() => handleAddPasswordChange(false)} />
            Habilitar senha de acesso no repositório 
          </label>
          <input type="password" id="password" placeholder={"Senha de Acesso"} name="password" className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black hidden"/>

          <label htmlFor="addEditPassword" className="flex items-center justify-center text-sm font-medium text-gray-700 mt-2">
            <input type="checkbox" id="addEditPassword" name="addEditPassword" className="mr-2" onChange={() => handleAddPasswordChange(true)} />
            Habilitar senha para edição no repositório 
          </label>
          <input type="password" id="editPassword" placeholder={"Senha de Edição"} name="editPassword" className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black hidden"/>
      </div>
    </main>
  )
}
