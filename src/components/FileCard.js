import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons'
import baseURL from '@/services/baseUrl';
import isValidResponse from '@/services/validateResponse';
import api from '@/services/api';
import tinify from '@/services/tinify';

const FileCard = ({ editable, title, icon, id, updateParent }) => {

    function handleFileDeletion(e) {
      e.preventDefault();

      const confirmation = confirm("Deseja deletar o arquivo?");

      if (confirmation) {
        api.delete(`/files/${id}`).then((response) => {
          if (isValidResponse(response)) {
            updateParent();
          }
        });
      }
    }

    function minifyPNGorJPEG(e) {
      e.preventDefault();

      tinify.post("/shrink", {
        source: {
          url: baseURL + "/files/" + id
        }
      }).then(response => {
        // Cria um elemento 'a' para o link de download
        const downloadLink = document.createElement('a');
        downloadLink.href = response.data.output.url;
        downloadLink.download = title; // Nome do arquivo de download

        // Simula um clique no link para iniciar o download
        downloadLink.click();
      })
    }

    return (
        <div style={{maxWidth: '100vw'}} className="m-2 bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
            <div className="w-10 h-10 text-black text-2xl flex items-center justify-center">
              <FontAwesomeIcon icon={icon} />
            </div>
            <div className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <div className="flex space-x-2">
                {
                  title.includes(".jpeg") || title.includes(".png") ? 
                  <a href='#' onClick={minifyPNGorJPEG} download className="text-blue-400 hover:text-blue-600" title="Baixar">
                    <FontAwesomeIcon icon={faDownload} />
                  </a> :
                  <a href={baseURL + "/files/" + id} download target='_blank' className="text-blue-400 hover:text-blue-600" title="Baixar">
                    <FontAwesomeIcon icon={faDownload} />
                  </a>
                }
                {
                  editable ? 
                  <a href='#' onClick={handleFileDeletion} className="text-red-400 hover:text-red-600" title="Deletar">
                    <FontAwesomeIcon icon={faTrash} />
                  </a>
                  :
                  ''
                }
            </div>
        </div>
    );
};

export default FileCard;