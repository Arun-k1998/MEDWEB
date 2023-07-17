import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getCookies from '../../helper/getCookie';
import { adminApi } from '../../helper/axios/adminAxios';

function AdminVerification({ children, accessBy }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const verifyToken = async () => {
      const cookie = getCookies();
      if (accessBy === 'Authorized') {
        if (!cookie['adminToken']) {
          window.location.href = '/admin/login';
        } else {
          try {
            const response = await adminApi.get('/token_v');
            if (response.data.status) {
              console.log(response.data);
              setLoading(false); // Set loading state to false
            } else {
              navigate('/admin/login');
            }
          } catch (error) {
            console.log('err', error);
            setLoading(false); // Set loading state to false
          }
        }
      } else if (accessBy === 'non-Authorized') {
        if (cookie['adminToken']) {
          window.location.href = '/admin/dashboard';
        } else {
          setLoading(false); // Set loading state to false
        }
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return null; // or a loading indicator if desired
  }

  return children;
}
export default AdminVerification