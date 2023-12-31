import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getCookies from '../../helper/getCookie';
import { adminApi } from '../../helper/axios/adminAxios';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../../redux/adminSlice';

function AdminVerification({ children, accessBy }) {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state
  const {id} = useSelector(store => store.admin)

  useEffect(() => {
   
    const verifyToken = async () => {
      const cookie = getCookies();
      if (accessBy === 'Authorized') {
        if(id){
         
          setLoading(false)
        }
         else if (cookie && cookie['adminToken']) {
          try {
           
            const response = await adminApi.get('/token_v');
            if (response.data.status) {
              // console.log(response.data);
              dispatch(adminLogin(response.data.admin))
              setLoading(false); // Set loading state to false
            } else {
              navigate('/admin/login');
            }
          } catch (error) {
            console.log('err', error);
            setLoading(false); // Set loading state to false
          }
         
        }
         else {
          window.location.href = '/admin/login';
        }
      } else if (accessBy === 'non-Authorized') {
       
        if(id){
          
          setLoading(false)
        }
        else if (cookie['adminToken']) {
          
          const response = await adminApi.get('/token_v');
            if (response.data.status) {
              dispatch(adminLogin(response.data.admin))
              setLoading(false)
            }
          
        }
      }
    };

    verifyToken();
  }, [loading]);

  if( accessBy === 'Authorized' && !loading ) {
 
    return children; // or a loading indicator if desired
  }
  else if( accessBy === 'non-Authorized' && !loading ){
    return navigate('/admin/dashboard')
  } else if( accessBy === 'non-Authorized' && loading ){
    return children
  }
 
  return null ;
}

export default AdminVerification