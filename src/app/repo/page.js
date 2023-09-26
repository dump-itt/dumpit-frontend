'use client'
import FileCard from '../../components/FileCard';
import Alert from '@/components/Alert';
import { faFileAudio, faFileVideo, faFileImage, faFileText } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import isValidResponse from '@/services/validateResponse';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Repo() {
  const { push } = useRouter();
  const [firstLoad, setFirstLoad] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [logged, setLogged] = useState(true);
  const [editable, setEditable] = useState(true);
  const [loggedToEdit, setLoggedToEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const searchParams = useSearchParams();
  const repoID = searchParams.get("id");

  useEffect(() => {
    if (repoID == null || repoID == "") {
      push("/");
    }

    if (firstLoad) {
      getRepositoryContent();
      setFirstLoad(false);
    }
    
    const interval = setInterval(() => {
      if (logged)
        getRepositoryContent();
    }, 10000);

    // Retorne uma função de limpeza para parar o intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  });

  function getRepositoryContent() {
    api.get(`/repositories/${repoID}`).then((response) => {
      if (isValidResponse(response)) {
        setFiles(response.data.files);

        if (response.data.editPassword == null || loggedToEdit) {
          setEditable(true);
        } else {
          setEditable(false);
        }
      } else {
        setShowAlert(true);
      }
    }).catch((e) => {
      if (e.response.status === 401) {
        setLogged(false);
      }
    });
  }

  function handleFileUpload() {
    setLoading(true);
    let formData = new FormData();
    let newFileInput = document.querySelector('#newFile');
    formData.append("file", newFileInput.files[0]);
    
    api.post(`/repositories/${repoID}/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(function (response) {
      if (isValidResponse(response)) {
        getRepositoryContent();
        
        // Limpar o campo de arquivo
        newFileInput.value = ''; // Isso limpará o valor do campo de arquivo
        setLoading(false);
      } else {
        setShowAlert(true);
      }
    });
  }  

  function handleSaveText() {
    setLoading(true);
    const newText = document.querySelector('#newText').value.trim();

    if (newText === "") {
      // O campo de texto está vazio, não há nada para salvar
      return;
    }

    const blob = new Blob([newText], { type: 'text/plain' });
    const file = new File([blob], 'text.txt', { type: 'text/plain' });

    const formData = new FormData();
    formData.append("file", file);

    api.post(`/repositories/${repoID}/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(function (response) {
          if (isValidResponse(response)) {
            getRepositoryContent();
            document.querySelector('#newText').value = "";
            setLoading(false);
          } else {
            setShowAlert(true);
          }
        });
  }

  async function handleRepoLogin() {
    const password = document.querySelector('#accessPassword').value;
    setLoading(true);
    await api.post("/authenticate-access", {id: repoID, password}).then((response) => {
      // Define a data de expiração do cookie (opcional, pode ser omitida se desejar um cookie de sessão)
      const dataExpiracao = new Date();
      dataExpiracao.setDate(dataExpiracao.getDate() + 2); // Expirará em 7 dias a partir de hoje

      // Converta a data de expiração em uma string no formato UTC
      const dataExpiracaoUTC = dataExpiracao.toUTCString();

      document.cookie = `jwtToken=${response.data.token}; secure=HttpOnly; expires=${dataExpiracaoUTC}; SameSite=Strict; path=/;`;
      getRepositoryContent();
      setLogged(true);
    }).catch((e) => {
        setShowAlert(true);
    });
    setLoading(false);
  }

  async function handleEditAccesss() {
    const editPassword = document.querySelector('#editPassword').value;
    setLoading(true);
    await api.post("/authenticate-edit", {id: repoID, password: editPassword}).then((response) => {
      // Define a data de expiração do cookie (opcional, pode ser omitida se desejar um cookie de sessão)
      const dataExpiracao = new Date();
      dataExpiracao.setDate(dataExpiracao.getDate() + 2); // Expirará em 7 dias a partir de hoje

      // Converta a data de expiração em uma string no formato UTC
      const dataExpiracaoUTC = dataExpiracao.toUTCString();

      document.cookie = `jwtToken=${response.data.token}; secure=HttpOnly; expires=${dataExpiracaoUTC}; SameSite=Strict; path=/;`;
      setEditable(true);
      setLoggedToEdit(true);
      document.querySelector('#editPassword').value = '';
    }).catch((e) => {
        setShowAlert(true);
    });
    setLoading(false);
  }

  return (
    <main className="bg-gray-100 flex flex-col items-center h-screen p-4">
      <Alert showAlert={showAlert} setShowAlert={setShowAlert} type="error" message="Ops, algo deu errado! " />
      {loading && <LoadingSpinner />}
      {
        logged ?
          <>
            <div className="w-full h-56 md:h-28 bg-white p-8 rounded-lg shadow-md flex items-center mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-15">
                <a href='/' className="text-2xl font-semibold fun-font basis-1/4 text-gray-900">Dump.it</a>

                <h1 className="text-2xl font-semibold fun-font basis-1/4 text-gray-900">#{repoID}</h1>
                <form className="flex basis-1/2 items-center space-x-4 w-full md:w-auto">
                {editable ? 
                  <>
                    <input type="file" id="newFile" name="newFile" className="p-3.5 border border-gray-300 rounded-md" />
                    <button onClick={handleFileUpload} type="button" className="bg-blue-500 font-semibold text-white p-3.5 rounded-md hover:bg-blue-600">Adicionar Arquivo</button>
                  </>
                  :
                  <>
                    <label htmlFor="editPassword" className="block text-large font-semibold text-gray-700">Senha para Desbloquear Edição:</label>
                    <div className="flex">
                      <input type="password" id="editPassword" name="editPassword" className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black" />
                      <button type="button" onClick={handleEditAccesss}  className="ml-4 bg-blue-500 font-semibold text-white p-3.5 rounded-md hover:bg-blue-600">Desbloquear</button>
                    </div>
                  </>
                }
                </form>
            </div>
            {editable ? 
              <div className="mt-4 flex flex-col lg:flex-row lg:flex-wrap w-full">
                <label htmlFor="newText" className="block text-xl font-bold text-gray-700">Adicionar Texto</label>
                <textarea
                    id="newText"
                    name="newText"
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full h-24 text-black"
                    placeholder="Digite seu texto aqui..."
                ></textarea>
                <button onClick={handleSaveText} className="mt-4 bg-green-500 text-white text-xl font-semibold p-2 rounded-md hover:bg-green-600">
                  <span className="mr-2">+</span> Salvar Texto
                </button>
              </div>
              :
              ''
            }
            <div className="mt-4 flex flex-col lg:flex-row lg:flex-wrap lg:w-full justify-center lg:justify-start">
              {
                files.map((file) => {
                  let icon = faFileText;

                  if (file.mimetype.includes("audio")) {
                    icon = faFileAudio;
                  } else if (file.mimetype.includes("video")) {
                    icon = faFileVideo;
                  } else if (file.mimetype.includes("image")) {
                    icon = faFileImage
                  }

                  return (<FileCard editable={editable} key={file.id} icon={icon} id={file.id} title={file.name} updateParent={getRepositoryContent} />);
                })
              }
            </div>
          </>
          :
          <div className="m-auto w-full sm:w-1/2 md:w-1/3 bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4 text-center fun-font text-gray-900">Acesso a #{repoID}</h1>

            <div className="mb-4">
                <label htmlFor="id" className="block text-sm font-medium text-gray-700">Senha de Acesso:</label>
                <input type="password" id="accessPassword" name="accessPassword" className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black" />
                <button type="button" onClick={handleRepoLogin} className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Acessar Repositório</button>
            </div>
          </div>
      }
    </main>
  )
}