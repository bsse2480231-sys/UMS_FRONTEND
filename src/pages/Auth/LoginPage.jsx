import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/ui/InputField';
import { loginSchema } from '../../validation/authSchema';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data.email, data.password);
      
      // SweetAlert for Success
      Swal.fire({
        icon: 'success',
        title: `Welcome back!`,
        text: `Logged in as ${res.role}`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect based on role
      if (res.role === 'Admin') navigate('/dashboard');
      else if (res.role === 'Instructor') navigate('/dashboard');
      else navigate('/dashboard');
      
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message); // Toast for Errors
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineLockClosed className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">University Login</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to your portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Email Address"
            icon={HiOutlineMail}
            placeholder="you@university.edu"
            register={register('email')}
            error={errors.email}
          />

          <InputField
            label="Password"
            type="password"
            icon={HiOutlineLockClosed}
            placeholder="••••••••"
            register={register('password')}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 mt-2 flex justify-center items-center"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;