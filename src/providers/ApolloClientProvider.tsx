import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {PropsWithChildren} from 'react';

const client = new ApolloClient({
  uri: 'https://wanaque.stepzen.net/api/gangly-serval/__graphql',
  headers: {
    Authorization:
      'apikey wanaque::stepzen.io+1000::4e1720a07b7a61f9826fab6abd309a6e98f034058964d28c34c5cc8cc388a2e9',
  },
  cache: new InMemoryCache(),
});

const ApolloClientProvider = ({children}: PropsWithChildren) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default ApolloClientProvider;
