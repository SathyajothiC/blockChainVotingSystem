import React, { Component } from 'react';
import { Grid, Header, Button, Form, Input, Icon, Menu, Modal, Sidebar, Container, Card, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Cookies from 'js-cookie';
import { Link, Router } from '../../routes';
import Election from '../../Ethereum/election';
import { Helmet } from 'react-helmet';

class VotingList extends Component {
    state = {
        election_address: Cookies.get('address'),
        election_name: '',
        election_description: '',
        voters: [], // Will store voter objects from database
        loading: false,
        emailError: '',
        editingVoterId: null,
        registerEmail: ''
    }

    async componentDidMount() {
        await this.loadElectionDetails();
        await this.loadVoters();
    }

    loadElectionDetails = async () => {
        try {
            const election = Election(this.state.election_address);
            const summary = await election.methods.getElectionDetails().call();
            this.setState({
                election_name: summary[0],
                election_description: summary[1]
            });
        } catch (err) {
            console.log("Error loading election details:", err.message);
        }
    }

    loadVoters = async () => {
        this.setState({ loading: true });

        try {
            const response = await fetch('/voter/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `election_address=${this.state.election_address}`
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === "success" && data.data && data.data.voters) {
                    this.setState({ voters: data.data.voters });
                } else {
                    this.setState({ voters: [] });
                }
            } else {
                console.error('Failed to load voters');
                this.setState({ voters: [] });
            }
        } catch (error) {
            console.error('Error loading voters:', error);
            this.setState({ voters: [] });
        } finally {
            this.setState({ loading: false });
        }
    }

    validateEmail = (email, excludeVoterId = null) => {
        if (!email.includes('@')) {
            return 'Please enter a valid email address.';
        }

        const emailExists = this.state.voters.some(voter => {
            if (excludeVoterId && voter.id == excludeVoterId) return false;
            return voter.email === email;
        });

        if (emailExists) {
            return 'This email is already registered to another voter.';
        }

        return '';
    }

    handleRegisterInputChange = (e) => {
        this.setState({ registerEmail: e.target.value });
    }

    openEditModal = (voter) => {
        this.setState({
            editingVoterId: voter.id,
            editEmail: voter.email,
            emailError: ''
        });
    }

    handleEditInputChange = (e) => {
        const newEmail = e.target.value;
        const error = this.validateEmail(newEmail, this.state.editingVoterId);
        this.setState({
            editEmail: newEmail,
            emailError: error
        });
    }

    registerVoter = async () => {
        const { registerEmail } = this.state;
        const email = registerEmail.trim();

        if (!email) {
            alert("Please enter an email address");
            return;
        }

        const error = this.validateEmail(email);
        if (error) {
            alert(error);
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await fetch('/voter/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${encodeURIComponent(email)}&election_address=${encodeURIComponent(this.state.election_address)}&election_name=${encodeURIComponent(this.state.election_name)}&election_description=${encodeURIComponent(this.state.election_description)}`
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                // Clear input immediately
                this.setState({ registerEmail: '' });

                // Add the new voter to the local state immediately (before reloading)
                const newVoter = {
                    id: data.data.voter_id || Date.now(), // Use the ID from response or temporary ID
                    email: email,
                    // Add other properties if needed
                };

                this.setState(prevState => ({
                    voters: [...prevState.voters, newVoter]
                }));

                alert("Voter registered successfully!");

                // Also reload from server to ensure we have the latest data
                await this.loadVoters();

            } else {
                console.log("Registration failed:", data);
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            alert("Network error. Please try again.");
            console.error('Registration error:', error);
        } finally {
            this.setState({ loading: false });
            this.setState({ registerEmail: "" })
        }
    }

    updateVoter = async () => {
        const { editingVoterId, editEmail } = this.state;

        if (!editingVoterId || !editEmail) return;

        const error = this.validateEmail(editEmail, editingVoterId);
        if (error) {
            console.log("Validation error:", error);
            alert(error);
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await fetch(`/voter/${editingVoterId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${encodeURIComponent(editEmail)}&election_name=${encodeURIComponent(this.state.election_name)}&election_description=${encodeURIComponent(this.state.election_description)}`
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                // Update the voter in local state immediately
                this.setState(prevState => ({
                    voters: prevState.voters.map(voter =>
                        voter.id === editingVoterId ? { ...voter, email: editEmail } : voter
                    )
                }));

                alert("Voter updated successfully!");

                // Also reload from server to ensure consistency
                await this.loadVoters();

            } else {
                alert(data.message || "Update failed");
            }
        } catch (error) {
            alert("Network error. Please try again.");
            console.error('Update error:', error);
        } finally {
            this.setState({ loading: false, editingVoterId: null, emailError: '' });
        }
    }

    deleteVoter = async (voterId) => {
        if (!window.confirm("Are you sure you want to delete this voter?")) {
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await fetch(`/voter/${voterId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                // Remove the voter from local state immediately
                this.setState(prevState => ({
                    voters: prevState.voters.filter(voter => voter.id !== voterId)
                }));

                alert("Voter deleted successfully!");

                // Also reload from server to ensure consistency
                await this.loadVoters();

            } else {
                alert(data.message || "Delete failed");
            }
        } catch (error) {
            alert("Network error. Please try again.");
            console.error('Delete error:', error);
        } finally {
            this.setState({ loading: false });
        }
    }

    renderVoterList = () => {
        const { voters, loading } = this.state;

        if (loading && voters.length === 0) {
            return (
                <Message info>
                    <Icon name="circle notched" loading />
                    Loading voters...
                </Message>
            );
        }

        if (voters.length === 0) {
            return (
                <Message info>
                    <Icon name="info circle" />
                    No voters registered yet. Add voters using the form on the right.
                </Message>
            );
        }

        return (
            <Card.Group>
                {voters.map((voter) => (
                    <Card key={voter.id}>
                        <Card.Content>
                            <Card.Header>{voter.email}</Card.Header>
                            <Card.Description>
                                <div style={{ marginTop: '10px' }}>
                                    <Button
                                        basic
                                        color="green"
                                        onClick={() => this.openEditModal(voter)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        negative
                                        basic
                                        style={{ marginLeft: '10px' }}
                                        onClick={() => this.deleteVoter(voter.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                ))}
            </Card.Group>
        );
    }

    SidebarExampleVisible = () => (
        <Sidebar.Pushable>
            <Sidebar as={Menu} animation='overlay' icon='labeled' inverted vertical visible width='thin' style={{ backgroundColor: 'white' }}>
                <Menu.Item style={{ color: 'grey' }}>
                    <h2>MENU</h2>
                    <hr />
                </Menu.Item>
                <Link route={`/election/${this.state.election_address}/company_dashboard`}>
                    <Menu.Item style={{ color: 'grey' }}>
                        <Icon name='dashboard' />
                        Dashboard
                    </Menu.Item>
                </Link>
                <Link route={`/election/${this.state.election_address}/candidate_list`}>
                    <Menu.Item style={{ color: 'grey' }}>
                        <Icon name='user outline' />
                        Candidate List
                    </Menu.Item>
                </Link>
                <Link route={`/election/${this.state.election_address}/voting_list`}>
                    <Menu.Item style={{ color: 'grey' }}>
                        <Icon name='list' />
                        Voter List
                    </Menu.Item>
                </Link>
                <hr />
                <Menu.Item style={{ color: 'grey' }} onClick={this.signOut}>
                    <Icon name='sign out' />
                    Sign Out
                </Menu.Item>
            </Sidebar>
        </Sidebar.Pushable>
    )

    signOut = () => {
        Cookies.remove('address');
        Cookies.remove('company_email');
        Cookies.remove('company_id');
        Router.pushRoute('/homepage');
    }

    render() {
        const { election_name, election_description, registerEmail, loading, editEmail, emailError, editingVoterId } = this.state;

        return (
            <div>
                <Helmet>
                    <title>Voter List</title>
                    <link rel="shortcut icon" type="image/x-icon" href="../../static/logo-Block.png" />
                </Helmet>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            {this.SidebarExampleVisible()}
                        </Grid.Column>

                        <Grid.Column width={13}>
                            <Layout>
                                {/* Header */}
                                <Header as="h2" textAlign="center" style={{ marginBottom: '2rem' }}>
                                    <Icon name="address card" />
                                    <Header.Content>
                                        {election_name}
                                        <Header.Subheader>{election_description}</Header.Subheader>
                                    </Header.Content>
                                </Header>

                                {/* Edit Modal */}
                                <Modal
                                    open={!!editingVoterId}
                                    onClose={() => this.setState({ editingVoterId: null, emailError: '' })}
                                    size='small'
                                >
                                    <Modal.Header>Edit Voter Email</Modal.Header>
                                    <Modal.Content>
                                        <Form>
                                            <Form.Field>
                                                <label>Email Address:</label>
                                                <Input
                                                    value={editEmail || ''}
                                                    placeholder='Enter new email'
                                                    onChange={this.handleEditInputChange}
                                                    error={!!emailError}
                                                />
                                                {emailError && (
                                                    <Message negative size='small'>{emailError}</Message>
                                                )}
                                            </Form.Field>
                                        </Form>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button onClick={() => this.setState({ editingVoterId: null, emailError: '' })}>
                                            Cancel
                                        </Button>
                                        <Button
                                            positive
                                            onClick={this.updateVoter}
                                            disabled={!!emailError}
                                        >
                                            Update
                                        </Button>
                                    </Modal.Actions>
                                </Modal>

                                <Grid>
                                    <Grid.Row>
                                        {/* Voter List */}
                                        <Grid.Column width={10}>
                                            <Header as='h3' color='black'>
                                                Registered Voters
                                            </Header>
                                            {this.renderVoterList()}
                                        </Grid.Column>

                                        {/* Registration Form */}
                                        <Grid.Column width={6}>
                                            <Header as='h3' color='black'>
                                                Register New Voter
                                            </Header>
                                            <Card fluid>
                                                <Card.Content>
                                                    <Form>
                                                        <Form.Field>
                                                            <label>Email Address:</label>
                                                            <Input
                                                                fluid
                                                                value={registerEmail}
                                                                placeholder='Enter voter email'
                                                                onChange={this.handleRegisterInputChange}
                                                                disabled={loading}
                                                            />
                                                        </Form.Field>
                                                        <Button
                                                            primary
                                                            fluid
                                                            onClick={this.registerVoter}
                                                            loading={loading}
                                                            disabled={loading || !registerEmail}
                                                        >
                                                            Register Voter
                                                        </Button>
                                                    </Form>
                                                </Card.Content>
                                            </Card>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Layout>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default VotingList;