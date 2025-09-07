import React, { Component } from 'react';
import { Button, Form, Grid, Header, Segment, Icon, Message } from 'semantic-ui-react';
import web3 from '../../Ethereum/web3';
import Election_Factory from '../../Ethereum/election_factory';
import { Router } from '../../routes';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';

class LoginForm extends Component {
    state = {
        election_name: '',
        election_description: '',
        loading: false,
        errorMess: '',
    };

    signin = async event => {
        event.preventDefault();
        this.setState({ loading: true, errorMess: '' });
        try {
            const email = Cookies.get('company_email');
            const accounts = await web3.eth.getAccounts();

            const bool = await Election_Factory.methods
                .createElection(
                    email, // authority (use account address instead of email)
                    this.state.election_name,
                    this.state.election_description
                )
                .send({
                    from: accounts[0],
                    gas: 2000000 // Increased gas limit
                });

            if (bool) {
                const summary = await Election_Factory.methods.getDeployedElection('xyz').call();
                this.setState({ loading: false });
                Cookies.set('address', summary[0]);
                Router.pushRoute(`/election/${summary[0]}/company_dashboard`);
            }
        } catch (err) {
            console.error("Full error:", err);
            let errorMsg = err.message;

            // Simplify complex error messages
            if (err.message.includes("Internal JSON-RPC")) {
                errorMsg = "Transaction failed. Please check your connection and try again.";
            }

            this.setState({
                errorMess: errorMsg,
                loading: false
            });
        }
    }

    render() {
        return (
            <div style={styles.container}>
                <Helmet>
                    <title>Create Election</title>
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
                </Helmet>

                <div style={styles.background}></div>
                <div style={styles.overlay}></div>

                <Grid textAlign="center" verticalAlign="middle" style={styles.grid}>
                    <Grid.Column style={styles.column}>
                        <Header as="h2" style={styles.header}>
                            Create New Election
                        </Header>

                        <Segment stacked style={styles.segment}>
                            {this.state.errorMess && (
                                <Message negative style={styles.message}>
                                    {this.state.errorMess}
                                </Message>
                            )}

                            <Form size="large" onSubmit={this.signin}>
                                <Form.Input
                                    fluid
                                    icon="address card outline"
                                    iconPosition="left"
                                    placeholder="Election Name"
                                    value={this.state.election_name}
                                    onChange={event => this.setState({ election_name: event.target.value })}
                                    required={true}
                                    style={styles.input}
                                />
                                <Form.TextArea
                                    placeholder="Election Description"
                                    value={this.state.election_description}
                                    onChange={event => this.setState({ election_description: event.target.value })}
                                    required={true}
                                    style={styles.textArea}
                                />

                                <Button
                                    color="blue"
                                    fluid
                                    size="large"
                                    loading={this.state.loading}
                                    disabled={this.state.loading}
                                    style={styles.button}
                                >
                                    Create Election
                                </Button>

                                <Message icon info style={styles.infoMessage}>
                                    <Icon name="exclamation circle" />
                                    <Message.Content>
                                        <Message.Header>Note:</Message.Header>
                                        Election creation will take several minutes.
                                    </Message.Content>
                                </Message>
                            </Form>
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
        background: 'url(/static/block.png) no-repeat center center',
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
        marginBottom: '2rem',
        fontSize: '2.5rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
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
    textArea: {
        marginBottom: '1.5rem',
        minHeight: '100px'
    },
    infoMessage: {
        textAlign: 'left',
        marginTop: '1.5rem'
    }
};

export default LoginForm;