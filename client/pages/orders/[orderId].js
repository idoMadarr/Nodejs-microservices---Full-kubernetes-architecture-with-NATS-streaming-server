import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import axiosClient from '../../utils/axiosClient';
import * as Stripe from '../../fixtures/stripe-checkout.json';
import useRequest from '../../hooks/useRequest';

const CreateOrder = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  const [errors, sendRequest] = useRequest({
    method: 'post',
    url: '/api/payments/charge',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders/user'),
  });

  const isExpired = timeLeft >= 0;
  const usdAmount = order.ticket.price * 100;

  useEffect(() => {
    const clacTime = () => {
      setTimeLeft(prevState => prevState - 1);
    };

    const timer = setInterval(clacTime, 1000);

    return () => clearInterval(timer);
  }, [order]);

  return (
    <div>
      <div
        style={{
          padding: 10,
          background: '#a4f77ec4',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        <h2>Hurry up!</h2>
        {isExpired ? (
          <div>
            <p>{timeLeft} Seconds until order expires</p>
          </div>
        ) : (
          <p>Order expired</p>
        )}
      </div>
      {isExpired && (
        <StripeCheckout
          token={token => sendRequest({ token: token.id })}
          stripeKey={Stripe.publisherKey}
          amount={usdAmount}
          email={currentUser.email}
        />
      )}
      {errors}
    </div>
  );
};

export default CreateOrder;

CreateOrder.getInitialProps = async context => {
  const { orderId } = context.query;
  console.log(orderId, 'orderID');
  let data2 = {};
  try {
    const { data } = await axiosClient(context).get(`/api/orders/${orderId}`);
    data2 = data;
    console.log((data, '?ASD?AS?'));
  } catch (error) {
    console.log((error, '?asdasdas?AS?'));
  }
  return { order: data2 };
};
