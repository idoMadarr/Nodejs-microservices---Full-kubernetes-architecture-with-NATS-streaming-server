import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import InputElement from '../../components/UIElements/InputElement/InputElement';
import ButtonElement from '../../components/UIElements/ButtonElement/ButtonElement';
import useRequest from '../../hooks/useRequest';
import styles from '../../styles/Forms.module.css';

const defaultState = {
  email: '',
  password: '',
};

const SignupScreen = () => {
  const [formState, setFormState] = useState(defaultState);
  const [errors, sendRequest] = useRequest({
    method: 'post',
    url: '/api/users/signup',
    body: formState,
    onSuccess: () => Router.push('/'),
  });

  const updateState = (type, input) => {
    setFormState(prevState => ({ ...prevState, [type]: input.target.value }));
  };

  const onSubmit = () => {
    sendRequest();
  };

  return (
    <div className={styles['form-container']}>
      <h3>Sign Up</h3>
      <InputElement
        inputType={'text'}
        value={formState.email}
        insertFunc={updateState.bind(this, 'email')}
        name={'email'}
        placeholder={'Email Address'}
      />
      <InputElement
        inputType={'password'}
        value={formState.password}
        insertFunc={updateState.bind(this, 'password')}
        name={'password'}
        placeholder={'Your Password'}
      />
      {errors}
      <ButtonElement title={'Submit'} onClick={onSubmit} />
      <p>
        Already have account? <Link href={'/auth/signin'}>Sign in</Link>
      </p>
    </div>
  );
};

export default SignupScreen;
