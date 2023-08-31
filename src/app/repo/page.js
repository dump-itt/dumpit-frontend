import FileCard from '../../components/FileCard';
import { faFileAudio, faFileVideo, faFileImage, faFileText } from '@fortawesome/free-solid-svg-icons'

export default function Repo() {
  return (
    <main className="bg-gray-100 flex flex-col items-center h-screen p-4">
      <div className="w-full h-48 md:h-28 bg-white p-8 rounded-lg shadow-md flex items-center mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <h1 className="text-2xl font-semibold fun-font basis-1/4">Dump.it</h1>
          
          <h1 className="text-2xl font-semibold fun-font basis-1/4">#12345</h1>

          <form className="flex ml-8 basis-1/2 items-center space-x-4 w-full md:w-auto">
              <input type="file" id="newFile" name="newFile" className="p-2 border border-gray-300 rounded-md w-full" />
              
              <button type="button" className="w-full ml-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Adicionar Arquivo</button>
          </form>
      </div>
      <div className="mt-4 flex flex-col lg:flex-row space-y-4 lg:space-x-4 lg:space-y-0 lg:w-full">
        <FileCard icon={faFileAudio} title="Shake it off - Taylor Swift.mp3" />
        <FileCard icon={faFileVideo} title="Vingadores - Dublado.mp4" />
        <FileCard icon={faFileImage} title="Pôr do sol.jpeg" />
        <FileCard icon={faFileText} title="Documento.txt" />
      </div>
    </main>
  )
}