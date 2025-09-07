import React, { Component } from 'react';
import { Button, Form, Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { Router } from '../routes';
import web3 from "../Ethereum/web3";
import Election_Factory from "../Ethereum/election_factory";
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';
import { SAMPLE_ELECTION } from './election/sampleElectionData';

// Add this helper function in your component
const manualGetDeployedElection = async (email, fromAddress) => {
  try {

    // 1. check if email exists in contract storage
    const electionData = await Election_Factory.methods.getDeployedElection(email).call({ from: fromAddress, gas: 500000 });
    console.log("Election Data:", electionData)
    // 2. If no election exists (admin = 0x0)
    if (electionData.admin === '0x0000000000000000000000000000000000000000') {
      return [null, "", "No election found"];
    }

    // 3. If exists, return the data
    return [
      electionData.electionAddress,
      electionData.name,
      electionData.description
    ];

  } catch (err) {
    console.error("Manual lookup failed:", err);
    return [null, "", "Error checking election"];
  }
};

class CompanyLogin extends Component {
  state = {
    showSignIn: true,
    email: '',
    loading: false,
    error: null,
    showPassword: {
      signIn: false,
      signUp: false,
      repeatPassword: false
    }
  };


  togglePasswordVisibility = (e, field) => {
    e.preventDefault();
    this.setState(prevState => ({
      showPassword: {
        ...prevState.showPassword,
        [field]: !prevState.showPassword[field]
      }
    }));
  };



  signup = async (event) => {
    event.preventDefault();
    const email = document.getElementById('signup_email').value;
    const password = document.getElementById('signup_password').value;
    const repeat_password = document.getElementById('signup_repeat_password').value;

    if (password !== repeat_password) {
      this.setState({ error: "Passwords do not match" });
      return;
    }

    try {
      const http = new XMLHttpRequest();
      const url = 'company/register';
      const params = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

      http.open('POST', url, true);
      http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      http.onreadystatechange = () => {
        if (http.readyState === 4 && http.status === 200) {
          const responseObj = JSON.parse(http.responseText);
          if (responseObj.status === "success") {
            Cookies.set('company_email', encodeURI(responseObj.data.email));
            Router.pushRoute('/company_login');
          } else {
            this.setState({ error: responseObj.message });
          }
        }
      };
      http.send(params);
    } catch (err) {
      this.setState({ error: "Registration failed. Please try again." });
    }
  };


  signin = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, error: null });

    try {
      const email = document.getElementById('signin_email').value.trim();
      const password = document.getElementById("signin_password").value;

      // 1. Validate inputs
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        this.setState({ error: "Please enter a valid email address", loading: false });
        return;
      }
      if (!password) {
        this.setState({ error: "Password is required", loading: false });
        return;
      }

      // 2. Authenticate with backend
      const authSuccess = await new Promise((resolve) => {
        const http = new XMLHttpRequest();
        http.open("POST", "company/authenticate", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = () => {
          if (http.readyState === 4) {
            if (http.status === 200) {
              try {
                const response = JSON.parse(http.responseText);
                if (response.status === "success") {
                  Cookies.set('company_id', encodeURIComponent(response.data.id));
                  Cookies.set('company_email', encodeURIComponent(response.data.email));
                  resolve(true);
                } else {
                  this.setState({ error: response.message || "Authentication failed", loading: false });
                  resolve(false);
                }
              } catch (e) {
                this.setState({ error: "Invalid server response", loading: false });
                resolve(false);
              }
            } else {
              this.setState({ error: "Server connection failed", loading: false });
              resolve(false);
            }
          }
        };
        http.send(`email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      });

      if (!authSuccess) return;

      // 3. Blockchain interaction
      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error("No Ethereum accounts found");
      }

      console.log("Checking election for:", email);

      try {
        // First try manual check if available
        let summary;
        if (typeof manualGetDeployedElection === 'function') {
          summary = await manualGetDeployedElection(email, accounts[0]);
        } else {
          // Fallback to direct contract call
          summary = await Election_Factory.methods
            .getDeployedElection(email)
            .call({
              from: accounts[0],
              gas: 500000
            });
        }


        if (!summary || !summary[0]) { // No election found

          console.log("SAMPLE_ELECTION", SAMPLE_ELECTION);
          // ALWAYS redirect to the sample election dashboard
          Cookies.set('address', SAMPLE_ELECTION.address);
          Cookies.set('election_name', SAMPLE_ELECTION.name);
          Router.pushRoute(`/election/${SAMPLE_ELECTION.address}/company_dashboard`);


          // Router.pushRoute('/election/create_election');
        } else if (summary[2] === "Create an election.") {
          Router.pushRoute('/election/create_election');
        } else {
          Cookies.set('address', summary[0]);
          Router.pushRoute(`/election/${summary[0]}/company_dashboard`);
        }

      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);

        let errorMessage = "Election lookup failed";
        if (blockchainError.message.includes("revert")) {
          errorMessage = "No election found for this company";
        } else if (blockchainError.message.includes("gas")) {
          errorMessage = "Network busy, please try again";
        }

        this.setState({
          error: errorMessage,
          loading: false
        });
      }

    } catch (err) {
      console.error("Login error:", err);
      this.setState({
        error: err.message || "An unexpected error occurred",
        loading: false
      });
    }
  };
  render() {
    const { showSignIn, loading, error, showPassword } = this.state;

    return (
      <div style={styles.container}>
        <Helmet>
          <title>Company Login</title>
          <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
          <link rel="shortcut icon" type="image/x-icon" href="../../static/logo-Block.png" />
        </Helmet>

        <div style={styles.background}></div>
        <div style={styles.overlay}></div>

        <Grid textAlign="center" verticalAlign="middle" style={styles.grid}>
          <Grid.Column style={styles.column}>
            <Header as="h2" style={styles.header}>
              Company Portal
            </Header>

            <div style={styles.toggleContainer}>
              <Button.Group fluid>
                <Button
                  style={showSignIn ? styles.activeTab : styles.inactiveTab}
                  onClick={() => this.setState({ showSignIn: true, error: null })}
                >
                  Sign In
                </Button>
                <Button
                  style={!showSignIn ? styles.activeTab : styles.inactiveTab}
                  onClick={() => this.setState({ showSignIn: false, error: null })}
                >
                  Sign Up
                </Button>
              </Button.Group>
            </div>

            <Segment stacked style={styles.segment}>
              {error && (
                <Message negative style={styles.message}>
                  {error}
                </Message>
              )}

              {/* Sign In Form */}
              <div style={{ display: showSignIn ? 'block' : 'none' }}>
                <Form size="large" onSubmit={this.signin}>
                  <Form.Input
                    fluid
                    id="signin_email"
                    icon="user"
                    iconPosition="left"
                    placeholder="Email"
                    required
                    style={styles.input}
                  />
                  <Form.Input
                    fluid
                    id="signin_password"
                    icon={<Icon name='lock' />}
                    iconPosition="left"
                    placeholder="Password"
                    type={showPassword.signIn ? 'text' : 'password'}
                    required
                    style={styles.input}
                    action={{
                      icon: showPassword.signIn ? 'eye slash' : 'eye',
                      onClick: (e) => this.togglePasswordVisibility(e, 'signIn'),
                      style: styles.eyeAction
                    }}
                  />
                  <Button
                    color="blue"
                    fluid
                    size="large"
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                  >
                    Sign In
                  </Button>
                </Form>
              </div>

              {/* Sign Up Form */}
              <div style={{ display: showSignIn ? 'none' : 'block' }}>
                <Form size="large" onSubmit={this.signup}>
                  <Form.Input
                    fluid
                    id="signup_email"
                    icon="user"
                    iconPosition="left"
                    placeholder="Email"
                    required
                    style={styles.input}
                  />
                  <Form.Input
                    fluid
                    id="signup_password"
                    icon={<Icon name='lock' />}
                    iconPosition="left"
                    placeholder="Password"
                    type={showPassword.signUp ? 'text' : 'password'}
                    required
                    style={styles.input}
                    action={{
                      icon: showPassword.signUp ? 'eye slash' : 'eye',
                      onClick: (e) => this.togglePasswordVisibility(e, 'signUp'),
                      style: styles.eyeAction
                    }}
                  />
                  <Form.Input
                    fluid
                    id="signup_repeat_password"
                    icon={<Icon name='lock' />}
                    iconPosition="left"
                    placeholder="Repeat Password"
                    type={showPassword.repeatPassword ? 'text' : 'password'}
                    required
                    style={styles.input}
                    action={{
                      icon: showPassword.repeatPassword ? 'eye slash' : 'eye',
                      onClick: (e) => this.togglePasswordVisibility(e, 'repeatPassword'),
                      style: styles.eyeAction
                    }}
                  />
                  <Button
                    color="blue"
                    fluid
                    size="large"
                    style={styles.button}
                  >
                    Sign Up
                  </Button>
                </Form>
              </div>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden'
  },
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'url(/static/voters-login.png) no-repeat center center',
    backgroundSize: 'cover',
    zIndex: -2,
    opacity: 0.7
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: -1
  },
  grid: {
    height: '100vh',
    margin: 0
  },
  column: {
    maxWidth: 450,
    padding: '0 20px'
  },
  header: {
    color: 'white',
    marginBottom: '2rem',
    fontSize: '2.5rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
  },
  toggleContainer: {
    marginBottom: '2rem'
  },
  activeTab: {
    backgroundColor: '#2185d0',
    color: 'white',
    border: '1px solid #2185d0',
    fontSize: '1.1rem',
    padding: '1rem',
  },
  inactiveTab: {
    backgroundColor: 'white',
    color: 'rgba(0,0,0,.6)',
    border: '1px solid rgba(34,36,38,.15)',
    fontSize: '1.1rem',
    padding: '1rem',
  },
  segment: {
    border: 'none',
    boxShadow: '0 5px 25px rgba(0,0,0,0.3)',
    padding: '2rem',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  button: {
    marginTop: '1.5rem',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    padding: '1rem',
    backgroundColor: '#273082',
    color: 'white'
  },
  message: {
    textAlign: 'left',
    marginBottom: '1.5rem'
  },
  input: {
    marginBottom: '1.5rem'
  },
  eyeAction: {
    cursor: 'pointer',
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
    color: '#666'
  }
};

export default CompanyLogin;