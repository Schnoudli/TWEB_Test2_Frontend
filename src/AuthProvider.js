import React, { Component } from 'react';
import axios from 'axios';

// Pour avoir un composant global et pour pouvoir passer des informations aux composants plus bas
const {
  Provider: AuthContextProvider,
  Consumer: AuthContext,
} = React.createContext();

class AuthProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      error: null,
      signIn: this.signIn,
      signOut: this.signOut,
    }
  }

  // Réutiliser le token du local storage lorsqu'on recharge la page
  componentDidMount() {
    const token = window.localStorage.getItem('token');
    if (token) {
      // Pour renvoyer le token dans les headers
      axios.get('/api/me', {
        headers: {
          Authorization: `bearer ${token}`,
        }
      })
        // Dans la response, on récupère le user
        .then(response => {
          const { user } = response.data;
          this.setState({ user });
        })
        // Si y'a une erreur, le otken est pas valide alors on l'enlève
        .catch(err => {
          console.error(err);
          localStorage.removeItem('token');
        })
    }
  }

  // Pour pouvoir se connecter
  signIn = ({ username, password }) => {
    // Implement me !
    axios.post('/auth/login', { username, password })
      .then(response => {
        const { user, token } = response.data;
        window.localStorage.setItem('token', token);
        this.setState({ user });
      })
      .catch(error => {
        console.error(error);
        this.setState({ error: 'Invalid username or password' });
      })
  }

  // Pour pouvoir se déconnecter (no shit Sherlock)
  signOut = () => {
    // Implement me !
    localStorage.removeItem('token');
    window.location.reload();
  }

  render() {
    const { children } = this.props
    return (
      <AuthContextProvider value={this.state}>
        {children}
      </AuthContextProvider>
    )
  }
}

export { AuthContext };
export default AuthProvider;
