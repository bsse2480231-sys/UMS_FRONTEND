import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyLibrary } from '../../api/authApi';
import Spinner from '../../components/ui/Spinner';

const StudentLibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyLibrary();
        setBooks(res.data);
      } catch (error) {
        toast.error('Failed to load library records');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">My Borrowed Books</h2>
      <p className="text-slate-500 text-sm mb-6">Track your issued library books and due dates</p>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Title</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Author</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Issue Date</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {books.map((b) => (
              <tr key={b.issue_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-800">{b.title}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{b.author}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{new Date(b.issue_date).toLocaleDateString()}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{new Date(b.due_date).toLocaleDateString()}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    b.status === 'Returned' ? 'bg-green-100 text-green-700' : 
                    b.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {books.length === 0 && <p className="p-6 text-center text-slate-400 text-sm">You haven't borrowed any books yet.</p>}
      </div>
    </div>
  );
};

export default StudentLibraryPage;