import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons'

const FileCard = ({ title, icon }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
            <div className="w-10 h-10 text-black text-2xl flex items-center justify-center">
              <FontAwesomeIcon icon={icon} />
            </div>
            <div className="flex-grow">
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <div className="flex space-x-2">
                <button className="text-blue-400 hover:text-blue-600" title="Baixar">
                  <FontAwesomeIcon icon={faDownload} />
                </button>
                <button className="text-red-400 hover:text-red-600" title="Deletar">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
};

export default FileCard;