import axiosClient from '../../utils/axiosClient';
import styles from '../../styles/Orders.module.css';

const OrderScreen = ({ orders }) => {
  return (
    <div className={'wrapper-conainer'}>
      <ul className={styles['order-container']}>
        <h1>Orders</h1>
        {orders.map(({ status, id, ticket }) => (
          <li key={id} className={styles['order']}>
            <p>{status}</p>
            <small>{ticket.title}</small>
            <small>{ticket.price} $</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderScreen;

OrderScreen.getInitialProps = async context => {
  const { data } = await axiosClient(context).get('/api/orders/');

  return { orders: data };
};
