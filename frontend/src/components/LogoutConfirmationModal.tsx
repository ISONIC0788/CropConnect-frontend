import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import { authService } from '../api/authService';

const LogoutConfirmationModal = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  const handleConfirm = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4" onClick={handleCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        aria-describedby="logout-description"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-br from-primary to-[#14532D] px-6 py-6 text-white">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 id="logout-title" className="text-2xl font-bold tracking-tight">
            Are you sure you want to log out?
          </h2>
          <p id="logout-description" className="mt-2 text-sm text-green-50/90">
            You will need to sign in again to continue using CropConnect.
          </p>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-gray-600">
            If you click Yes, your session will end immediately. If you click No, you will stay signed in.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
              No, stay logged in
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-800"
            >
              Yes, log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;