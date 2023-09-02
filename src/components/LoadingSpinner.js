const LoadingSpinner = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-slate-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
    );
};

export default LoadingSpinner;