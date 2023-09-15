'use client'
import FileCard from '../../components/FileCard';
import Alert from '@/components/Alert';
import { faFileAudio, faFileVideo, faFileImage, faFileText } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import isValidResponse from '@/services/validateResponse';

export default function Repo() {
  const { push } = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [files, setFiles] = useState([]);
  const searchParams = useSearchParams();
  const repoID = searchParams.get("id");

  useEffect(() => {
    if (repoID == null || repoID == "") {
      push("/");
    }
    
    const interval = setInterval(() => {
      getRepositoryContent();
    }, 7000); // 5000 milissegundos = 5 segundos

    // Retorne uma função de limpeza para parar o intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  });

  function getRepositoryContent() {
    api.get(`/repositories/${repoID}`).then((response) => {
      if (isValidResponse(response)) {
        setFiles(response.data.files);
      } else {
        setShowAlert(true);
      }
    });
  }

  function handleFileUpload() {
    let formData = new FormData();
    let newFile = document.querySelector('#newFile');
    formData.append("file", newFile.files[0]);
    api.post(`/repositories/${repoID}/add`,
      formData
    , {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(function (response) {
      if (isValidResponse(response)) {
        getRepositoryContent();
        const emptyFile = document.createElement('input');
        newFile.files = emptyFile.files;
      } else {
        setShowAlert(true);
      }
    });
  }

  function handleSaveText() {
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
          } else {
            setShowAlert(true);
          }
        });
  }

  function handleSetEditPassword() {
    const editPassword = document.querySelector('#editPassword').value;

    console.log(editPassword)
    document.querySelector('#editPassword').value = '';

    /*
    TODO: ADICIONAR ENDOPOINT PARA SALVAR SENHA DE EDIÇÃO
    api.post(`/`, { editPassword }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(function (response) {
          if (isValidResponse(response)) {
            TODO: Travar botões de edição

          } else {
            setShowAlert(true);
          }
        });*/
  }

  return (
    <main className="bg-gray-100 flex flex-col items-center h-screen p-4">
      <Alert showAlert={showAlert} setShowAlert={setShowAlert} type="error" message="Ops, algo deu errado! " />
      <div className="w-full h-48 md:h-28 bg-white p-8 rounded-lg shadow-md flex items-center mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-15">
          <a href='/' className="text-2xl font-semibold fun-font basis-1/4 text-gray-900">Dump.it</a>

          <h1 className="text-2xl font-semibold fun-font basis-1/4 text-gray-900">#{repoID}</h1>

          <form className="flex basis-1/2 items-center space-x-4 w-full md:w-auto">
            <label htmlFor="editPassword" className="block text-large font-semibold text-gray-700">Senha para Proteger a Edição:</label>
            <div className="flex">
              <input type="password" id="editPassword" name="editPassword" className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black" />
              <button type="button" onClick={handleSetEditPassword} className="ml-2 bg-blue-500 text-white p-1 font-semibold rounded-md hover:bg-blue-600">Definir Senha</button>
            </div>

            <input type="file" id="newFile" name="newFile" className="p-3.5 border border-gray-300 rounded-md" />

            <button onClick={handleFileUpload} type="button" className="bg-blue-500 font-semibold text-white p-3.5 rounded-md hover:bg-blue-600">Adicionar Arquivo</button>
          </form>
      </div>
      <div className="mt-4 flex flex-col lg:flex-row lg:flex-wrap lg:w-full">
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
      <div className="mt-4 flex flex-col lg:flex-row lg:flex-wrap lg:w-full">
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

            return (<FileCard key={file.id} icon={icon} id={file.id} title={file.name} updateParent={getRepositoryContent} />);
          })
        }
      </div>
    </main>
  )
}