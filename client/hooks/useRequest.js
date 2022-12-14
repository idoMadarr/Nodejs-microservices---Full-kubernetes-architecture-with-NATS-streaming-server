import { useState, Fragment } from 'react';
import axios from 'axios';

const useRequest = ({ method, url, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const sendRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });
      onSuccess && onSuccess(response.data);
      return response.data;
    } catch (error) {
      const errors = error.response.data.errors;
      console.log(error.response.data);
      setErrors(
        <Fragment>
          <h4 className={'white-color'}>Ooops...</h4>
          <ul>
            {errors.map(error => (
              <li key={error.message}>
                <small className={'warning-color'}>{error.message}</small>
              </li>
            ))}
          </ul>
        </Fragment>
      );
    }
  };

  return [errors, sendRequest];
};

export default useRequest;
