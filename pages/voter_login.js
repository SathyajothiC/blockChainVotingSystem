import React, { Component } from 'react';
import { Button, Form, Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import { Router } from '../routes';
import { Helmet } from 'react-helmet';

class LoginForm extends Component {
    state = {
        email: '',
        password: '',
        loading: false,
        error: null,
        showPassword: false
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true, error: null });

        const { email, password } = this.state;
        const http = new XMLHttpRequest();
        const url = 'voter/authenticate';
        const params = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = () => {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    const responseObj = JSON.parse(http.responseText);
                    if (responseObj.status === 'success') {
                        console.log("Login successful:", responseObj);
                        Cookies.set('voter_email', email);
                        Cookies.set('address', responseObj.data.election_address);
                        Router.pushRoute(`/election/${responseObj.data.election_address}/vote`);
                    } else {
                        this.setState({ error: responseObj.message, loading: false });
                    }
                } else {
                    this.setState({ error: 'Network error. Please try again.', loading: false });
                }
            }
        };
        http.send(params);
    };

    togglePasswordVisibility = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }));
    };

    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    render() {
        const { email, password, loading, error, showPassword } = this.state;

        return (
            <div style={styles.container}>
                <Helmet>
                    <title>Voter login</title>
                    <link rel="shortcut icon" type="image/x-icon" href="../../static/logo-Block.png" />
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
                </Helmet>

                <div style={styles.overlay}></div>
                <div style={styles.background}></div>

                <Grid textAlign="center" verticalAlign="middle" style={styles.grid}>
                    <Grid.Column style={styles.column}>
                        <Header as="h2" style={styles.header}>
                            Voter Login
                        </Header>

                        <Form size="large" onSubmit={this.handleSubmit}>
                            <Segment stacked style={styles.segment}>
                                {error && <Message negative content={error} style={styles.message} />}

                                <Form.Input
                                    fluid
                                    id="email"
                                    icon="user"
                                    iconPosition="left"
                                    placeholder="Email"
                                    value={email}
                                    onChange={this.handleChange}
                                    required
                                />

                                <Form.Input
                                    fluid
                                    id="password"
                                    icon={<Icon name='lock' />}
                                    iconPosition="left"
                                    placeholder="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={this.handleChange}
                                    required
                                    action={{
                                        icon: showPassword ? 'eye slash' : 'eye',
                                        onClick: this.togglePasswordVisibility,
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
                                    Login
                                </Button>
                            </Segment>
                        </Form>
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
        width: '100%'
    },
    background: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'url(/static/voters-login.png) no-repeat center center',
        backgroundSize: 'cover',
        zIndex: -2
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
        marginBottom: '30px',
        fontSize: '2rem',
        textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
    },
    segment: {
        border: 'none',
        boxShadow: '0 5px 25px rgba(0,0,0,0.3)',
        padding: '30px',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '8px'
    },
    button: {
        marginTop: '20px',
        borderRadius: '4px'
    },
    message: {
        textAlign: 'left'
    },
    eyeAction: {
        cursor: 'pointer',
        backgroundColor: 'transparent !important',
        boxShadow: 'none !important'
    }
};

export default LoginForm;