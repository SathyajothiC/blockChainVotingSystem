import React, { Component } from 'react';
import { Grid, Button, Form, Header, Icon, Menu, Sidebar, Container, Card, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../Ethereum/web3';
import Cookies from 'js-cookie';
import { Link, Router } from '../../routes';
import Election from '../../Ethereum/election';
import { Helmet } from 'react-helmet';
import { addCandidateToSharedData, getSharedElectionData } from '../../components/sharedElectionData ';

class VotingList extends Component {
    state = {
        election_address: Cookies.get('address') || getSharedElectionData().address,
        election_name: getSharedElectionData().name,
        election_description: getSharedElectionData().description,
        candidates: getSharedElectionData().candidateData,
        cand_name: '',
        cand_desc: '',
        cand_email: '',
        loading: false,
        useSampleData: true,
        item: [],
        error: null,
        success: null
    }

    async componentDidMount() {
        // Set cookies with sample data
        if (!Cookies.get('address')) {
            Cookies.set('address', getSharedElectionData().address);
        }

        try {
            // Try to get real data first
            const add = Cookies.get('address');
            const election = Election(add);
            const summary = await election.methods.getElectionDetails().call();

            this.setState({
                election_name: summary[0],
                election_description: summary[1],
                useSampleData: false
            });

            const c = await election.methods.getNumOfCandidates().call();

            if (c == 0) {
                console.log("No candidates found in blockchain, using sample data");
                this.setSampleCandidates();
                return;
            }

            let candidates = [];
            for (let i = 0; i < c; i++) {
                const candidate = await election.methods.getCandidate(i).call();
                candidates.push(candidate);
            }

            let i = -1;
            const items = candidates.map(candidate => {
                i++;
                return {
                    header: candidate[0],
                    description: candidate[1],
                    meta: candidate[2] || 'No description available',
                    extra: (
                        <div>
                            <Icon name='pie graph' />
                            {candidate[3] ? candidate[3].toString() : '0'} votes
                        </div>
                    )
                };
            });

            this.setState({
                item: items,
                useSampleData: false
            });
        } catch (err) {
            console.log("Using sample data due to error:", err.message);
            this.setSampleCandidates();
        }
    }

    setSampleCandidates = () => {
        const electionData = getSharedElectionData();
        let i = -1;
        const items = electionData.candidateData.map(candidate => {
            i++;
            return {
                header: candidate.name,
                description: candidate.position,
                meta: candidate.bio,
                extra: (
                    <div>
                        <Icon name='pie graph' />
                        {candidate.votes.toString()} votes
                    </div>
                )
            };
        });
        this.setState({
            item: items,
            useSampleData: true,
            election_name: electionData.name,
            election_description: electionData.description
        });
    }

    getElectionDetails = () => {
        const { election_name, election_description } = this.state;

        return (
            <div style={{ textAlign: 'center', marginBottom: '2%', marginTop: '2%' }}>
                <Header as="h2">
                    <Icon name="address card" />
                    <Header.Content>
                        {election_name}
                        <Header.Subheader>{election_description}</Header.Subheader>
                    </Header.Content>
                </Header>
            </div>
        );
    }

    renderTable = () => {
        const { item, useSampleData } = this.state;

        if (item.length === 0) {
            return (
                <Message info>
                    <Icon name="info circle" />
                    No candidates found. Add candidates using the form on the right.
                </Message>
            );
        }

        return (
            <div>
                {useSampleData && (
                    <Message warning>
                        <Icon name="warning sign" />
                        Using sample data for demonstration purposes
                    </Message>
                )}
                <Card.Group items={item} />
            </div>
        );
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, error: null, success: null });

        const { cand_name, cand_desc, cand_email, useSampleData } = this.state;

        if (!cand_name || !cand_desc || !cand_email) {
            this.setState({
                error: "Please fill in all fields",
                loading: false
            });
            return;
        }

        if (useSampleData) {
            // For sample data - add to shared data
            setTimeout(() => {
                const newCandidate = {
                    name: cand_name,
                    position: cand_desc,
                    email: cand_email,
                    votes: 0,
                    bio: "New candidate"
                };

                // Add to shared data
                addCandidateToSharedData(newCandidate);

                // Update the UI with the new candidate
                const newItem = {
                    header: newCandidate.name,
                    description: newCandidate.position,
                    meta: newCandidate.bio,
                    extra: (
                        <div>
                            <Icon name='pie graph' />
                            {newCandidate.votes.toString()} votes
                        </div>
                    )
                };

                this.setState(prevState => ({
                    item: [...prevState.item, newItem],
                    loading: false,
                    success: "Candidate added to sample data! Refresh dashboard to see updates.",
                    cand_name: '',
                    cand_desc: '',
                    cand_email: ''
                }));
            }, 1000);
            return;
        }

        // Real blockchain operation
        try {
            const accounts = await web3.eth.getAccounts();
            const add = Cookies.get('address');
            const election = Election(add);

            // Use a default IPFS hash (empty or placeholder)
            const defaultIpfsHash = 'QmWvP2y5IqW7W7Z7W7Z7W7Z7W7Z7W7Z7W7Z7W7Z7W7Z7W7Z';

            // Add candidate to blockchain
            await election.methods.addCandidate(
                cand_name,
                cand_desc,
                defaultIpfsHash,
                cand_email
            ).send({
                from: accounts[0],
                gas: 300000
            });

            // Register candidate in backend
            try {
                const response = await fetch('/candidate/registerCandidate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `email=${encodeURIComponent(cand_email)}&election_name=${encodeURIComponent(this.state.election_name)}`
                });

                const responseData = await response.json();

                if (responseData.status === "success") {
                    this.setState({
                        success: "Candidate added successfully to blockchain and database!",
                        loading: false,
                        cand_name: '',
                        cand_desc: '',
                        cand_email: ''
                    });

                    // Reload candidates
                    this.componentDidMount();
                } else {
                    throw new Error(responseData.message || "Failed to register candidate in database");
                }
            } catch (dbError) {
                console.error("Database error:", dbError);
                this.setState({
                    error: "Candidate added to blockchain but failed to register in database: " + dbError.message,
                    loading: false
                });
            }

        } catch (err) {
            console.error("Error adding candidate:", err);
            this.setState({
                error: "Failed to add candidate: " + err.message,
                loading: false
            });
        }
    };

    SidebarExampleVisible = () => (
        <Sidebar.Pushable>
            <Sidebar as={Menu} animation='overlay' icon='labeled' inverted vertical visible width='thin' style={{ backgroundColor: 'white', borderWidth: "10px" }}>
                <Menu.Item as='a' style={{ color: 'grey' }} >
                    <h2>MENU</h2><hr />
                </Menu.Item>
                <Link route={`/election/${Cookies.get('address')}/company_dashboard`}>
                    <a>
                        <Menu.Item style={{ color: 'grey' }}>
                            <Icon name='dashboard' />
                            Dashboard
                        </Menu.Item>
                    </a>
                </Link>
                <Link route={`/election/${Cookies.get('address')}/candidate_list`}>
                    <a>
                        <Menu.Item as='a' style={{ color: 'grey' }}>
                            <Icon name='user outline' />
                            Candidate List
                        </Menu.Item>
                    </a>
                </Link>
                <Link route={`/election/${Cookies.get('address')}/voting_list`}>
                    <a>
                        <Menu.Item as='a' style={{ color: 'grey' }}>
                            <Icon name='list' />
                            Voter List
                        </Menu.Item>
                    </a>
                </Link>
                <hr />
                <Button onClick={this.signOut} style={{ backgroundColor: 'white' }}>
                    <Menu.Item as='a' style={{ color: 'grey' }}>
                        <Icon name='sign out' />
                        Sign Out
                    </Menu.Item>
                </Button>
            </Sidebar>
        </Sidebar.Pushable>
    )

    signOut = () => {
        Cookies.remove('address');
        Cookies.remove('company_email');
        Cookies.remove('company_id');
        alert("Logging out.");
        Router.pushRoute('/homepage');
    }

    render() {
        const { loading, error, success, cand_name, cand_desc, cand_email, useSampleData } = this.state;

        return (
            <div>
                <Helmet>
                    <title>Candidate list!</title>
                    <link rel="shortcut icon" type="image/x-icon" href="../../static/logo-Block.png" />
                </Helmet>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            {this.SidebarExampleVisible()}
                        </Grid.Column>
                        <Grid.Column width={14}>
                            <Layout>
                                {this.getElectionDetails()}
                                <br />
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={10}>
                                            <Header as='h2' color='black'>
                                                Candidate List
                                            </Header>
                                            <Container>
                                                {this.renderTable()}
                                            </Container>
                                        </Grid.Column>
                                        <Grid.Column width={6}>
                                            <Header as='h2' color='black' textAlign='center'>
                                                Add Candidate
                                            </Header>
                                            <Card fluid>
                                                <Card.Content>
                                                    {error && (
                                                        <Message negative>
                                                            <Icon name='exclamation circle' />
                                                            {error}
                                                        </Message>
                                                    )}
                                                    {success && (
                                                        <Message positive>
                                                            <Icon name='check circle' />
                                                            {success}
                                                        </Message>
                                                    )}
                                                    <Form onSubmit={this.onSubmit}>
                                                        <Form.Input
                                                            fluid
                                                            label='Name'
                                                            placeholder='Enter candidate name'
                                                            value={cand_name}
                                                            onChange={event => this.setState({ cand_name: event.target.value })}
                                                            required
                                                        />
                                                        <Form.TextArea
                                                            label='Description'
                                                            placeholder='Describe the candidate here...'
                                                            value={cand_desc}
                                                            onChange={event => this.setState({ cand_desc: event.target.value })}
                                                            required
                                                        />
                                                        <Form.Input
                                                            fluid
                                                            label='Email'
                                                            type='email'
                                                            placeholder='Enter candidate email'
                                                            value={cand_email}
                                                            onChange={event => this.setState({ cand_email: event.target.value })}
                                                            required
                                                        />
                                                        <Button
                                                            primary
                                                            fluid
                                                            loading={loading}
                                                            disabled={loading}
                                                            style={{ marginTop: '15px' }}
                                                        >
                                                            {useSampleData ? 'Add to Sample Data' : 'Register Candidate'}
                                                        </Button>
                                                        {useSampleData && (
                                                            <Message info size='small' style={{ marginTop: '10px' }}>
                                                                <Icon name='info circle' />
                                                                This is a demonstration with sample data
                                                            </Message>
                                                        )}
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