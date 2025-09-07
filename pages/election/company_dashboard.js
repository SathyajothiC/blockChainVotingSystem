import React, { Component } from 'react';
import { Grid, Step, Icon, Menu, Sidebar, Header, Button, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Bar, Pie } from 'react-chartjs-2';
import Cookies from 'js-cookie';
import { Link, Router } from '../../routes';
import { Helmet } from 'react-helmet';
import { getSharedElectionData } from '../../components/sharedElectionData ';

class CompanyDashboard extends Component {
    state = {
        electionData: getSharedElectionData(),
        loading: false,
        chartData: null,
        pieData: null
    };

    componentDidMount() {
        this.generateChartData();
        // Set the election address in cookies for other components
        Cookies.set('address', this.state.electionData.address);
        Cookies.set('election_name', this.state.electionData.name);
    }

    generateChartData = () => {
        const { electionData } = this.state;

        const backgroundColors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
            'rgba(83, 102, 255, 0.6)',
            'rgba(40, 159, 64, 0.6)',
            'rgba(210, 199, 199, 0.6)'
        ];

        const borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
            'rgba(40, 159, 64, 1)',
            'rgba(210, 199, 199, 1)'
        ];

        const chartData = {
            labels: electionData.candidateData.map(candidate => candidate.name),
            datasets: [{
                label: 'Vote Counts',
                backgroundColor: backgroundColors.slice(0, electionData.candidateData.length),
                borderColor: borderColors.slice(0, electionData.candidateData.length),
                borderWidth: 2,
                hoverBackgroundColor: backgroundColors.map(color => color.replace('0.6', '0.8')).slice(0, electionData.candidateData.length),
                hoverBorderColor: borderColors.slice(0, electionData.candidateData.length),
                data: electionData.candidateData.map(candidate => candidate.votes),
            }]
        };

        const pieData = {
            labels: electionData.candidateData.map(candidate => candidate.name),
            datasets: [{
                data: electionData.candidateData.map(candidate => candidate.votes),
                backgroundColor: backgroundColors.slice(0, electionData.candidateData.length),
                borderColor: borderColors.slice(0, electionData.candidateData.length),
                borderWidth: 2,
                hoverBackgroundColor: backgroundColors.map(color => color.replace('0.6', '0.8')).slice(0, electionData.candidateData.length),
                hoverBorderColor: borderColors.slice(0, electionData.candidateData.length),
            }]
        };

        this.setState({ chartData, pieData });
    }

    getElectionDetails = () => {
        const { electionData } = this.state;

        return (
            <div style={{ marginBottom: '2%', marginTop: '2%' }}>
                <Header as="h2">
                    <Icon name="address card" />
                    <Header.Content>
                        {electionData.name}
                        <Header.Subheader>
                            {electionData.description}
                            <div style={{ marginTop: '5px', fontSize: '0.8em', color: electionData.electionStatus === 'active' ? 'green' : 'gray' }}>
                                Status: {electionData.electionStatus.toUpperCase()}
                            </div>
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            </div>
        );
    };

    SidebarExampleVisible = () => (
        <Sidebar.Pushable>
            <Sidebar
                as={Menu}
                animation="overlay"
                icon="labeled"
                inverted
                vertical
                visible
                width="thin"
                style={{ backgroundColor: 'white', borderWidth: '10px' }}
            >
                <Menu.Item as="a" style={{ color: 'grey' }}>
                    <h2>MENU</h2>
                    <hr />
                </Menu.Item>
                <Link route={`/election/${this.state.electionData.address}/company_dashboard`}>
                    <a>
                        <Menu.Item style={{ color: 'grey', fontColor: 'grey' }}>
                            <Icon name="dashboard" />
                            Dashboard
                        </Menu.Item>
                    </a>
                </Link>
                <Link route={`/election/${this.state.electionData.address}/candidate_list`}>
                    <a>
                        <Menu.Item as="a" style={{ color: 'grey' }}>
                            <Icon name="user outline" />
                            Candidate List
                        </Menu.Item>
                    </a>
                </Link>
                <Link route={`/election/${this.state.electionData.address}/voting_list`}>
                    <a>
                        <Menu.Item as="a" style={{ color: 'grey' }}>
                            <Icon name="list" />
                            Voter List
                        </Menu.Item>
                    </a>
                </Link>
                <hr />
                <Button onClick={this.signOut} style={{ backgroundColor: 'white' }}>
                    <Menu.Item as="a" style={{ color: 'grey' }}>
                        <Icon name="sign out" />
                        Sign Out
                    </Menu.Item>
                </Button>
            </Sidebar>
        </Sidebar.Pushable>
    );

    signOut = () => {
        Cookies.remove('address');
        Cookies.remove('company_email');
        Cookies.remove('company_id');
        alert('Logging out.');
        Router.pushRoute('/homepage');
    };

    refreshData = () => {
        this.setState({
            electionData: getSharedElectionData()
        }, () => {
            this.generateChartData();
        });
    }

    endElection = () => {
        this.setState({ loading: true });

        // Simulate API call to end election
        setTimeout(() => {
            this.setState({
                loading: false,
                electionData: {
                    ...this.state.electionData,
                    electionStatus: 'completed'
                }
            });
            alert('Election has been ended successfully! Results have been sent to all participants.');
        }, 1500);
    };

    render() {
        const { electionData, chartData, pieData, loading } = this.state;

        if (!chartData || !pieData) {
            return <div>Loading...</div>;
        }

        const chartOptions = {
            maintainAspectRatio: true,
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 10
                    }
                }]
            },
            legend: {
                display: true,
                position: 'bottom'
            }
        };

        const pieOptions = {
            maintainAspectRatio: true,
            responsive: true,
            legend: {
                display: true,
                position: 'bottom'
            }
        };

        // Find the leading candidate
        const leadingCandidate = electionData.candidateData.length > 0
            ? electionData.candidateData.reduce((prev, current) =>
                (prev.votes > current.votes) ? prev : current)
            : null;

        return (
            <div>
                <Helmet>
                    <title>Dashboard - {electionData.name}</title>
                    <link rel="shortcut icon" type="image/x-icon" href="../../static/logo-Block.png" />
                </Helmet>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            {this.SidebarExampleVisible()}
                        </Grid.Column>

                        <Grid.Column width={14}>
                            <Layout>
                                <Message info>
                                    <Icon name="info circle" />
                                    This is a demonstration dashboard using sample election data.
                                </Message>

                                {this.getElectionDetails()}

                                <div style={{ float: 'right', marginTop: '2%' }}>
                                    {electionData.electionStatus === 'active' && (
                                        <Button
                                            negative
                                            style={{ marginRight: '10px' }}
                                            onClick={this.endElection}
                                            loading={loading}
                                        >
                                            End Election
                                        </Button>
                                    )}
                                    <Button
                                        primary
                                        onClick={this.refreshData}
                                    >
                                        <Icon name="refresh" />
                                        Refresh Data
                                    </Button>
                                </div>

                                <Step.Group style={{ minWidth: '100%', minHeight: 90 }}>
                                    <Step icon="users" title="Total Voters" description={electionData.voters} />
                                    <Step icon="user outline" title="Candidates" description={electionData.candidates} />
                                    <Step icon="check square" title="Votes Cast" description={electionData.totalVotes} />
                                    <Step
                                        icon="percent"
                                        title="Participation Rate"
                                        description={`${Math.round((electionData.totalVotes / electionData.voters) * 100)}%`}
                                    />
                                </Step.Group>

                                <Grid.Row>
                                    <Grid.Column width={8}>
                                        <Header as="h3" textAlign="center">
                                            <Icon name="bar chart" />
                                            Vote Distribution
                                        </Header>
                                        <div style={{ height: '400px', padding: '20px' }}>
                                            <Bar
                                                data={chartData}
                                                options={chartOptions}
                                                height={100}
                                            />
                                        </div>
                                    </Grid.Column>

                                    <Grid.Column width={8}>
                                        <Header as="h3" textAlign="center">
                                            <Icon name="pie chart" />
                                            Results Overview
                                        </Header>
                                        <div style={{ height: '400px', padding: '20px' }}>
                                            <Pie
                                                data={pieData}
                                                options={pieOptions}
                                                height={100}
                                            />
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Header as="h3">
                                            <Icon name="trophy" />
                                            Current Leader
                                        </Header>
                                        {leadingCandidate ? (
                                            <Message positive>
                                                <Message.Header>
                                                    {leadingCandidate.name} - {leadingCandidate.votes} votes
                                                </Message.Header>
                                                <p>{leadingCandidate.position} - {leadingCandidate.bio}</p>
                                            </Message>
                                        ) : (
                                            <Message warning>
                                                <Message.Header>
                                                    No candidates yet
                                                </Message.Header>
                                                <p>Add candidates to see election results</p>
                                            </Message>
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Layout>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default CompanyDashboard;