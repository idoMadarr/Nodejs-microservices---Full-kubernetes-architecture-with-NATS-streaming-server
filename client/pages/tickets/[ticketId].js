import Router from 'next/router';
import axiosClient from '../../utils/axiosClient';
import useRequest from '../../hooks/useRequest';

const TicketScreen = ({ ticket }) => {
  const [errors, sendRequest] = useRequest({
    method: 'post',
    url: '/api/orders/create-order',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: order => {
      if (order) {
        Router.push('/orders/[orderId]', `/orders/${order.id}`);
      }
    },
  });

  const createOrder = async e => {
    await sendRequest();
  };

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button onClick={createOrder}>Purchase</button>
      {errors}
    </div>
  );
};

export default TicketScreen;

TicketScreen.getInitialProps = async context => {
  const { ticketId } = context.query;

  const { data } = await axiosClient(context).get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};
