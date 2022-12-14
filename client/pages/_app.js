import Head from 'next/head';
import ApplicationLayout from '../components/ApplicationLayout/ApplicationLayout';
import axiosClient from '../utils/axiosClient';
import '../styles/styles.css';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <ApplicationLayout currentUser={currentUser}>
      <Head>
        <title>Microservices</title>
      </Head>
      <Head>
        <link
          href={
            'https://fonts.googleapis.com/css2?family=Quicksand&display=swap'
          }
          rel={'stylesheet'}
        ></link>
      </Head>
      <Component {...pageProps} currentUser={currentUser} />
    </ApplicationLayout>
  );
};

// getInitialProps is a special method that called when the server serve our html page. Therefor, this function will be executed ON the server.
// In this way, we can fetch data during the server side proccess (Absolute First Request).
// NOTICE: This function runs inside the container/pod. Therefor, we can't just send request just like we are in the broswer.
// To send http directly to ingress-nginx (Beacuse practicly, we are inside a pod!) we need to follow this:
// kubectl get namespace                    => Track the ingress-ngnix namespace.
// kubectl get services -n ingress-nginx    => Track the specific service of ingress-nginx
// http://NAMEOFSERVICE.NAMESPACE.srv.cluster.local
// http://ingress-nginx-controller.ingress-nginx.svc.cluster.local

// getInitialProps inside _app root component will disable all other getInitialProps over the app by default
// to allow others getInitialProps functions, we need to check ahead if a component hold getInitialProps function.

AppComponent.getInitialProps = async context => {
  const { data } = await axiosClient(context.ctx).get('/api/users/currentuser');

  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx);
  }

  return { pageProps, currentUser: data.currentUser };
};

export default AppComponent;
