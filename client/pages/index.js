import React from 'react';
import axiosClient from '../utils/axiosClient';
import Ticket from '../components/Ticket/Ticket';
import styles from '../styles/Tickets.module.css';

const IndexScreen = ({ tickets }) => {
  return (
    <div className={'wrapper-conainer'}>
      <div className={styles['ticket-container']}>
        <h1>Available Tickets:</h1>
        {tickets.map(({ id, title, price, createdAt }) => (
          <Ticket
            key={id}
            title={title}
            price={price}
            createdAt={createdAt}
            ticketId={id}
          />
        ))}
      </div>
    </div>
  );
};

export default IndexScreen;

IndexScreen.getInitialProps = async context => {
  const { data } = await axiosClient(context).get('/api/tickets/');

  return { tickets: data };
};
