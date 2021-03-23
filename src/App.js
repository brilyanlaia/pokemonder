import './App.css';
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from} from '@apollo/client';
import {onError} from "@apollo/client/link/error";
import logo from './pokemon-logo.png'
import ListPokemon from "./Components/ListPokemon";
import Detail from "./Components/DetailPokemon";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MyPokemon from './Components/MyPokemon';

const errorLink = onError(({ graphqlErrors, networkError}) =>{
  if (graphqlErrors){
    graphqlErrors.map(({message,location, path}) => {
      alert(`Graphql Erorr ${message}`)
    });
  }
})

const link = from([
  errorLink,
  new HttpLink({
    uri: "https://graphql-pokeapi.vercel.app/api/graphql"}),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
})


function App() {
  return <ApolloProvider client={client}>
    <Router>
     <div className="container">
       <div className="row">
         <div className="col-12 text-center mt-2">
           <img alt="logo" src={logo} className="mx-auto" width="200px"/>
         </div>
       </div>
       <div className="row justify-content-center mt-5">


           <Route exact path="/" component={ListPokemon} />
           <Route exact path="/pokemon/:name" component={Detail} />
           <Route exact path="/my-pokemon" component={MyPokemon} />

       </div>
     </div>
    </Router>
  </ApolloProvider>
}

export default App;
