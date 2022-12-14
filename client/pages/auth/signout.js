import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const SignoutScreen = () => {
  const [_errors, sendRequest] = useRequest({
    method: 'post',
    url: '/api/users/signout',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    sendRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignoutScreen;
