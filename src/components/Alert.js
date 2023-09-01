'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

const Alert = ({ showAlert, setShowAlert, type, message }) => {
    const getAlertColor = () => {
        switch (type) {
            case 'info':
                return 'bg-blue-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-black';
            case 'error':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    return (
        showAlert && (
            <div
                className={`fixed flex w-38 top-1 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-md ${getAlertColor()} `}
            >
                <p>{message}</p>
                <button
                    onClick={handleCloseAlert}
                    className="ml-2 text-white text-sm font-semibold underline focus:outline-none"
                >
                    <FontAwesomeIcon icon={faClose} />
                </button>
            </div>
        )
    );
};

export default Alert;
