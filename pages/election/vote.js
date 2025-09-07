import React, { Component } from 'react';
import { Grid, Button, Header, Icon, Menu, Sidebar, Container, Card, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Cookies from 'js-cookie';
import { Router } from '../../routes';
import { Helmet } from 'react-helmet';
import {
    getSharedElectionData,
    updateSharedElectionData
} from '../../components/sharedElectionData ';
class VotingList extends Component {
    state = {
        election_address: Cookies.get('address'),
        election_name: '',
        election_description: '',
        candidates: [],
        items: [],
        loading: false,
        error: null,
        hasVoted: false,
        electionData: null
    };

    componentDidMount() {
        this.initializeElection();
    }

    initializeElection = () => {
        try {
            const voterEmail = Cookies.get('voter_email');
            if (!voterEmail) {
                throw new Error('Voter email not found in cookies. Please login again.');
            }

            // Use the shared election data
            const electionData = getSharedElectionData();

            // Check if voter has already voted (you might need to implement this in your shared data)
            // For now, we'll use a simple approach with localStorage
            const hasVoted = localStorage.getItem(`voted_${voterEmail}_${electionData.address}`) === 'true';

            const items = electionData.candidateData.map((candidate, index) => {
                return {
                    header: candidate.name,
                    meta: candidate.position,
                    description: candidate.bio,
                    extra: (
                        <div>
                            <Icon name='pie graph' size='big' />
                            {candidate.votes} Votes
                            <Button
                                id={index}
                                style={{ float: 'right' }}
                                onClick={this.vote}
                                primary
                                disabled={hasVoted}
                            >
                                {hasVoted ? 'Already Voted' : 'Vote!'}
                            </Button>
                        </div>
                    )
                };
            });

            this.setState({
                electionData,
                election_name: electionData.name,
                election_description: electionData.description,
                items: items,
                candidates: electionData.candidateData,
                hasVoted,
                loading: false,
                error: null
            });
        } catch (err) {
            console.error("Error in initializeElection:", err.message);
            this.setState({
                error: err.message,
                loading: false
            });

            if (err.message.includes('login')) {
                alert("Session expired. Redirecting you to login page...");
                Router.pushRoute('/voter_login');
            }
        }
    }

    SidebarExampleVisible = () => (
        <Sidebar.Pushable>
            <Sidebar as={Menu} animation='overlay' icon='labeled' inverted vertical visible width='thin' style={{ backgroundColor: 'white', borderWidth: "10px" }}>
                <Menu.Item as='a' style={{ color: 'grey' }} >
                    <h2>MENU</h2><hr />
                </Menu.Item>
                <Menu.Item as='a' style={{ color: 'grey' }} >
                    <Icon name='dashboard' />
                    Dashboard
                </Menu.Item>
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
        Cookies.remove('voter_email');
        alert("Logging out.");
        Router.pushRoute('/homepage');
    }

    getElectionDetails = () => {
        const { election_name, election_description, hasVoted, electionData } = this.state;

        return (
            <div style={{ textAlign: 'center', marginBottom: '2%', marginTop: '2%' }}>
                <Header as="h2">
                    <Icon name="address card" />
                    <Header.Content>
                        {election_name}
                        <Header.Subheader>{election_description}</Header.Subheader>
                        {electionData && (
                            <Header.Subheader>
                                Total Votes: {electionData.totalVotes} | Registered Voters: {electionData.voters}
                            </Header.Subheader>
                        )}
                        {hasVoted && (
                            <Message positive style={{ marginTop: '1rem' }}>
                                <Icon name="check circle" />
                                You have already voted in this election.
                            </Message>
                        )}
                    </Header.Content>
                </Header>
            </div>
        );
    }

    renderTable = () => {
        const { items, loading, error } = this.state;

        if (error) {
            return (
                <Message negative>
                    <Message.Header>Error</Message.Header>
                    <p>{error}</p>
                    <Button primary onClick={this.initializeElection}>Retry</Button>
                    <Button secondary onClick={() => Router.pushRoute('/voter_login')}>Login Again</Button>
                </Message>
            );
        }

        if (loading) {
            return (
                <Message info>
                    <Icon name="circle notched" loading />
                    Loading candidates...
                </Message>
            );
        }

        if (items.length === 0) {
            return (
                <Message warning>
                    <Icon name="warning circle" />
                    No candidates available for this election.
                </Message>
            );
        }

        return <Card.Group items={items} itemsPerRow={2} />;
    }

    vote = (event) => {
        try {
            const candidateId = parseInt(event.currentTarget.id, 10);
            const voterEmail = Cookies.get('voter_email');

            if (!voterEmail) {
                throw new Error('Session expired. Please login again.');
            }

            // Get current shared data
            const currentData = getSharedElectionData();

            // Create updated candidate data
            const updatedCandidateData = [...currentData.candidateData];
            updatedCandidateData[candidateId] = {
                ...updatedCandidateData[candidateId],
                votes: updatedCandidateData[candidateId].votes + 1
            };

            // Update the shared election data
            const updatedElectionData = {
                ...currentData,
                candidateData: updatedCandidateData,
                totalVotes: currentData.totalVotes + 1
            };

            updateSharedElectionData(updatedElectionData);

            // Mark voter as having voted in localStorage
            localStorage.setItem(`voted_${voterEmail}_${currentData.address}`, 'true');

            // Update state to reflect changes
            this.setState({
                electionData: updatedElectionData,
                hasVoted: true,
                items: this.state.items.map((item, index) => {
                    return {
                        ...item,
                        extra: (
                            <div>
                                <Icon name='pie graph' size='big' />
                                {updatedElectionData.candidateData[index].votes} Votes
                                <Button
                                    id={index}
                                    style={{ float: 'right' }}
                                    primary
                                    disabled={true}
                                >
                                    Already Voted
                                </Button>
                            </div>
                        )
                    };
                })
            });

            alert("Voted successfully! The dashboard will reflect your vote.");
        } catch (err) {
            console.error("Error voting:", err.message);
            alert(`Voting failed: ${err.message}`);
        }
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>Vote</title>
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
                                <Container>
                                    {this.renderTable()}
                                </Container>
                            </Layout>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default VotingList;