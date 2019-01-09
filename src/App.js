import React, { useState } from 'react';

// Utile pour nos routes
import { Switch, Route, Redirect } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { Fetch } from 'react-data-fetching'

const baseUrl = 'http://localhost:4000/api';
function getUser(username) {
  return fetch(`${baseUrl}/users/${username}`)
    .then(res => res.json());
}

// Home page when logged
// To test : http//localhost:3000/user
const InfoUser = () => (
  <Fetch url="http://localhost:4000/api/users/amadeous">
  {({ data }) => (
   <div>
    <h1>Username</h1>
    <p>{data.login}</p>
   </div>
  )}
</Fetch>
);

// Home page when logged
const HomePage = () => (
  <AuthContext>
    {({ signOut }) => (
      <div>
        <h1>Welcome !</h1>
        <button onClick={signOut}>LOGOUT</button>
      </div>
    )}
  </AuthContext>
);

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthContext>
      {({ error, user, signIn }) => {

        // Si on a un user (donc on est loggé) => Redirige sur la page principale
        if (user) {
          return <Redirect to="/" />;
        }

        // Lorsqu'on clique sur submit => Appel de onSubmit, appel signIn. preventDefault annule le comportement par défaut (rechargement de la page)
        const onSubmit = (e) => {
          e.preventDefault();
          signIn({ username, password });
        };

        return (
          <div>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)} // Pour pouvoir modifier le champs
              />
              <br />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)} // Pour pouvoir modifier le champs
              />
              <br />
              <button type="submit">LOGIN</button>
              <p style={{ color: 'red' }}>{error}</p>
            </form>
          </div>
        )
      }}
    </AuthContext>
  )
}

// On crée un nouvel objet qui permet d'avoir chemin protégé par une authentification
// Si on a un user => On peut passer, sinon on va sur /login
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(params) => (
    <AuthContext>
      {({ user }) => user
        ? <Component {...params} />
        : <Redirect to="/login" />}
    </AuthContext>
  )}
  />
)

// Exact pour pas que les routes se chevauchent
// On a une route protégée et une que ne l'est pas pour se logger
export default () => (
  
  <Switch>
    <ProtectedRoute path="/" exact component={HomePage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/user" component={InfoUser} />
  </Switch>
);
