import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyFees } from '../../api/authApi';
import Spinner from '../../components/ui/Spinner';

const StudentFeesPage = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await getMyFees();
        setFees(res.data);
      } catch (error) {
        toast.error('Failed to load fees');
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">My Fee Records</h2>
      <p className="text-slate-500 text-sm mb-6">Your tuition and lab fee status</p>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Type</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {fees.map((f) => (
              <tr key={f.fee_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-800">{f.fee_type}</td>
                <td className="py-4 px-6 text-sm font-semibold text-slate-800">${f.amount}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{new Date(f.due_date).toLocaleDateString()}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    f.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                    f.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{f.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {fees.length === 0 && <p className="p-6 text-center text-slate-400 text-sm">No fee records found.</p>}
      </div>
    </div>
  );
};

export default StudentFeesPage;