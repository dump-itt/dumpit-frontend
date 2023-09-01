'use client'
import FileCard from '../../components/FileCard';
import { faFileAudio, faFileVideo, faFileImage, faFileText } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import isValidResponse from '@/services/validateResponse';

export default function Repo() {
  const { push } = useRouter();
  const [files, setFiles] = useState([]);
  const searchParams = useSearchParams();
  const repoID = searchParams.get("id");

  useEffect(() => {
    if (repoID == null || repoID == "") {
      push("/");
    }

    getRepositoryContent();
  }, []);

  function getRepositoryContent() {
    api.get(`/repositories/${repoID}`).then((response) => {
      if (isValidResponse(response)) {
        setFiles(response.data.files);
      }
    });
  }

  function handleFileUpload() {
    var formData = new FormData();
    var newFile = document.querySelector('#newFile');
    formData.append("file", newFile.files[0]);
    api.post(`/repositories/${repoID}/add`, {
      formData
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(function () {
      getRepositoryContent();
    });
  } 

  return (
    <main className="bg-gray-100 flex flex-col items-center h-screen p-4">
      <div className="w-full h-48 md:h-28 bg-white p-8 rounded-lg shadow-md flex items-center mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <h1 className="text-2xl font-semibold fun-font basis-1/4 text-gray-900">Dump.it</h1>
          
          <h1 className="text-2xl font-semibold fun-font basis-1/4 text-gray-900">#{repoID}</h1>

          <form className="flex ml-8 basis-1/2 items-center space-x-4 w-full md:w-auto">
              <input type="file" id="newFile" name="newFile" className="p-2 border border-gray-300 rounded-md w-full" />
              
              <button onClick={handleFileUpload} type="button" className="w-full ml-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Adicionar Arquivo</button>
          </form>
      </div>
      <div className="mt-4 flex flex-col lg:flex-row space-y-4 lg:space-x-4 lg:space-y-0 lg:w-full">
        {
          files.map((file) => {
            console.log(file.mimetype);
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