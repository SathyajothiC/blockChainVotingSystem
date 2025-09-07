import React from 'react';
import { Button, Icon, Grid, Header, Segment, Container } from 'semantic-ui-react';
import { Link } from '../routes';

const LandingPage = () => {
    const features = [
        {
            title: "End-to-End Security",
            icon: "shield alternate",
            highlights: [
                "SHA-256 cryptographic hashing",
                "Multi-signature authorization",
                "DDoS protection"
            ],
            description: `Our blockchain infrastructure utilizes military-grade encryption protocols that make votes 
    cryptographically sealed the moment they're cast. Each transaction undergoes multiple verification 
    checkpoints across decentralized nodes, ensuring no single point of failure can compromise the election. 
    Smart contracts automatically enforce voting rules, eliminating human error in the tallying process.`,
            benefit: "Election administrators can sleep soundly knowing votes are protected by the same security standards as global financial systems."
        },
        {
            title: "Radical Transparency",
            icon: "search",
            highlights: [
                "Public audit trails",
                "Real-time verification",
                "Immutable timestamps"
            ],
            description: `Every cast vote generates a permanent, timestamped record on the blockchain that's visible 
    to all participants while keeping voter identities confidential. This allows any stakeholder to verify: 
    - That votes were counted correctly\n- That no votes were altered\n- That all votes came from registered voters\n
    without revealing how any individual voted.`,
            benefit: "Increases public trust in election results while maintaining complete voter privacy."
        },
        // ... (additional features below)
        {
            title: "Unbreakable Anonymity",
            icon: "user secret",
            highlights: [
                "Zero-knowledge proofs",
                "Ring signatures",
                "Decentralized IDs"
            ],
            description: `We implement advanced cryptographic techniques like zk-SNARKs that allow the system to verify: 
    - A voter is eligible\n- Their vote is properly formatted\n- They haven't voted already\n
    without ever revealing their identity or voting selection to anyone, including election administrators.`,
            benefit: "Voters gain absolute confidence that their choices can never be traced back to them."
        },
        {
            title: "Instant Results",
            icon: "bolt",
            highlights: [
                "Parallel processing",
                "On-chain tallying",
                "Real-time dashboards"
            ],
            description: `Traditional voting systems require days or weeks to manually verify and count ballots. 
    Our decentralized network counts votes as they're cast, with final tallies available within minutes 
    of polls closing. Election officials and the public can watch verified results accumulate in real-time 
    through our transparent dashboard.`,
            benefit: "Eliminates the anxiety of prolonged vote counting and accelerates democratic decision-making."
        },

    ];

    return (
        <div style={{ overflowX: 'hidden' }}>
            {/* --- Hero Section --- */}
            <div style={{
                backgroundImage: "url('/static/block.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                margin: '0 auto',
            }}>
                <h1 style={{
                    fontSize: '4rem',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    marginBottom: '1rem',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '20px 40px',
                    borderRadius: '10px'
                }}>
                    BLOCKCHAIN VOTING SYSTEM
                </h1>

                <div style={{
                    maxWidth: '800px',
                    fontSize: '1.5rem',
                    lineHeight: '1.6',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    padding: '2rem',
                    borderRadius: '10px',
                    margin: '0 2rem'
                }}>
                    <p>A secure, transparent and tamper-proof voting solution powered by blockchain technology.</p>
                    <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                        Every vote counts. Every vote is verifiable. Every vote is immutable.
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    marginTop: '2rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}>
                    <Link route="/voter_login">
                        <Button primary style={{
                            color: 'white',
                            backgroundColor: '#273082',
                            minWidth: '200px',
                            padding: '1.5rem',
                            borderRadius: '10px',
                            fontSize: '1.5rem',
                            fontFamily: 'Times New Roman, serif'
                        }}>
                            Voters
                            <Icon name="right arrow" />
                        </Button>
                    </Link>

                    <Link route="/company_login">
                        <Button primary style={{
                            color: 'white',
                            backgroundColor: '#273082',
                            minWidth: '200px',
                            padding: '1.5rem',
                            borderRadius: '10px',
                            fontSize: '1.5rem',
                            fontFamily: 'Times New Roman, serif'
                        }}>
                            <Icon name="left arrow" />
                            Company
                        </Button>
                    </Link>
                </div>      </div>

            {/* --- Features Section (Simplified with map) --- */}
            <div style={{
                padding: '5rem 1rem',
                backgroundColor: '#F1EEDC',
                fontFamily: 'Georgia, serif'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    borderTop: '3px solid #273082',
                    borderBottom: '3px solid #273082',
                    padding: '3rem 2rem'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                        color: '#273082',
                        fontWeight: 'normal',
                        fontStyle: 'italic',
                        marginBottom: '3rem',
                        letterSpacing: '-1px',
                        lineHeight: '1.1',
                        textAlign: 'center'
                    }}>
                        The Blockchain Voting <span style={{ fontWeight: 'bold' }}>Advantage</span>
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2rem',
                        '@media (max-width: 1200px)': {
                            gridTemplateColumns: 'repeat(2, 1fr)'
                        },
                        '@media (max-width: 768px)': {
                            gridTemplateColumns: '1fr'
                        }
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                borderLeft: '4px solid #273082',
                                paddingLeft: '1.5rem',
                                minWidth: '0' // Prevents text overflow
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <span style={{
                                        fontSize: '2rem',
                                        color: '#273082',
                                        fontWeight: 'bold',
                                        lineHeight: '1',
                                        flexShrink: 0
                                    }}>{index + 1}</span>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '1.3rem',
                                        color: '#273082',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        wordBreak: 'break-word'
                                    }}>{feature.title}</h3>
                                </div>
                                <p style={{
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    color: '#333',
                                    marginBottom: '1rem'
                                }}>{feature.description}</p>
                                <p style={{
                                    fontStyle: 'italic',
                                    fontWeight: 'bold',
                                    color: '#273082',
                                    fontSize: '0.9rem'
                                }}>→ {feature.stat}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{
                padding: '6rem 2rem',
                backgroundColor: '#F1EEDC',
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    marginBottom: '3rem',
                    color: '#273082',
                    fontWeight: '600'
                }}>
                    How It Works
                </h2>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Step 1 */}
                    <div style={{
                        flex: '1',
                        minWidth: '280px',
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#273082',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            1
                        </div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            color: '#273082',
                            marginBottom: '1rem'
                        }}>
                            Register
                        </h3>
                        <p style={{
                            color: '#555',
                            lineHeight: '1.6',
                            fontSize: '1.1rem'
                        }}>
                            Voters and companies create secure digital identities verified on the blockchain.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div style={{
                        flex: '1',
                        minWidth: '280px',
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#273082',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            2
                        </div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            color: '#273082',
                            marginBottom: '1rem'
                        }}>
                            Vote
                        </h3>
                        <p style={{
                            color: '#555',
                            lineHeight: '1.6',
                            fontSize: '1.1rem'
                        }}>
                            Cast encrypted votes that remain anonymous but verifiable on the blockchain.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div style={{
                        flex: '1',
                        minWidth: '280px',
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#273082',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            3
                        </div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            color: '#273082',
                            marginBottom: '1rem'
                        }}>
                            Results
                        </h3>
                        <p style={{
                            color: '#555',
                            lineHeight: '1.6',
                            fontSize: '1.1rem'
                        }}>
                            Get instant, tamper-proof results with full transparency and auditability.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Footer --- */}
            <div style={{
                backgroundColor: '#273082',
                color: 'white',
                padding: '3rem 1rem',
                textAlign: 'center',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '500' }}>
                        Blockchain Voting System
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>About</a>
                        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Features</a>
                        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
                        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Privacy</a>
                    </div>
                    <div style={{
                        marginTop: '1rem',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem'
                    }}>
                        © {new Date().getFullYear()} Blockchain Voting System. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;