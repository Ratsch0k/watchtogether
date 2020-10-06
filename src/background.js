import "crx-hotreload";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {WebSocketLink} from 'apollo-link-ws';
import gql from "graphql-tag";
import {SubscriptionClient} from 'subscriptions-transport-ws';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});

const wsClient = new SubscriptionClient('ws://localhost:8080/subscriptions', {
  reconnect: true,
});

const subscriptionClient = new ApolloClient({
  link: new WebSocketLink(wsClient),
  cache: new InMemoryCache(),
});

subscriptionClient.subscribe({
  query: gql`
    subscription{
      commentAdded {
        message
      }
    }
  `,
  variables: {},
}).subscribe({
  next(data) {
    console.error(JSON.stringify(data));
  },
})

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "video_control");

  port.onMessage.addListener(function(msg) {
    client.query({
      query: gql`
        query {
          hello {
            message
          }
        }
      `
    })
    .then((res) => console.warn(JSON.stringify(res)))
    .catch((err) => console.error(JSON.stringify(err)));
    port.postMessage(msg);
  });
});