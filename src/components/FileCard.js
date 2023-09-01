import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons'
import baseURL from '@/services/baseUrl';
import isValidResponse from '@/services/validateResponse';
import api from '@/services/api';

const FileCard = ({ title, icon, id, updateParent }) => {

    function handleFileDeletion(e) {
      e.preventDefault();

      api.delete(`/files/${id}`).then((response) => {
        if (isValidResponse(response)) {
          updateParent();
        }
      })
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
            <div className="w-10 h-10 text-black text-2xl flex items-center justify-center">
              <FontAwesomeIcon icon={icon} />
            </div>
            <div className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <div className="flex space-x-2">
                <a href={baseURL + "/files/" + id} download className="text-blue-400 hover:text-blue-600" title="Baixar">
                  <FontAwesomeIcon icon={faDownload} />
                </a>
                <a onClick={handleFileDeletion} className="text-red-400 hover:text-red-600" title="Deletar">
                  <FontAwesomeIcon icon={faTrash} />
                </a>
            </div>
        </div>
    );
};

export default FileCard;