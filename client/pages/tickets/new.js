import { useState } from 'react';
import Router from 'next/router';
import InputElement from '../../components/UIElements/InputElement/InputElement';
import ButtonElement from '../../components/UIElements/ButtonElement/ButtonElement';
import useRequest from '../../hooks/useRequest';
import styles from '../../styles/Forms.module.css';

const defaultState = {
  title: '',
  price: '',
};

const NewTicketScreen = () => {
  const [formState, setFormState] = useState(defaultState);
  const [errors, sendRequest] = useRequest({
    method: 'post',
    url: '/api/tickets/create-ticket',
    body: formState,
    onSuccess: () => Router.push('/'),
  });

  const updateState = (type, input) => {
    setFormState(prevState => ({ ...prevState, [type]: input.target.value }));
  };

  const onSubmit = () => {
    sendRequest();
  };

  const onBlur = () => {
    const value = parseFloat(formState.price);

    if (isNaN(value)) return;

    setFormState(prevState => ({ ...prevState, price: value.toFixed(2) }));
  };

  return (
    <div className={styles['form-container']}>
      <h3>Create a ticket</h3>
      <InputElement
        inputType={'text'}
        value={formState.title}
        insertFunc={updateState.bind(this, 'title')}
        name={'title'}
        placeholder={'Title'}
      />
      <InputElement
        inputType={'text'}
        value={formState.price}
        insertFunc={updateState.bind(this, 'price')}
        onBlur={onBlur}
        name={'price'}
        placeholder={'Set a price'}
      />
      {errors}
      <ButtonElement title={'Send'} onClick={onSubmit} />
    </div>
  );
};

export default NewTicketScreen;
