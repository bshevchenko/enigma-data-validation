// Imports - React
import React, { Component } from "react";
// Imports - Redux
import connect from "react-redux/es/connect/connect";
// Imports - Frameworks (Semantic-UI and Material-UI)
import { Container, Message } from "semantic-ui-react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core";
// Imports - Initialize Enigma
import getEnigmaInit from "../utils/getEnigmaInit.js";
// Imports - Components
import Header from "./Header";
import DataValidation from "./DataValidation";
import "../App.css";
// Imports - Actions (Redux)
import { initializeEnigma, initializeAccounts, deployDataValidation } from '../actions';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class App extends Component {
    async componentDidMount() {
        // Initialize enigma-js client library (including web3)
        const enigma = await getEnigmaInit();
        // Create redux action to initialize set state variable containing enigma-js client library
        this.props.initializeEnigma(enigma);
        // Initialize unlocked accounts
        const accounts = await enigma.web3.eth.getAccounts();
        // Create redux action to initialize set state variable containing unlocked accounts
        this.props.initializeAccounts(accounts);

        const secretContractCount = await enigma.enigmaContract.methods.countSecretContracts().call();

        const deployedDataValidationAddress = (await enigma.enigmaContract.methods
          .getSecretContractAddresses(secretContractCount - 1, secretContractCount).call())[0];
        // Create redux action to set state variable containing deployed millionaires' problem secret contract address
        this.props.deployDataValidation(deployedDataValidationAddress);
    }

    render() {
        if (!this.props.enigma) {
            return (
                <div className="App">
                    <Header/>
                    <Message color="red">Enigma setup still loading...</Message>
                </div>
            );
        }
        else {
            return (
                <div className="App">
                    <Header/>
                    <br />
                    <br />
                    <p>Secret Contract Address: <b>{this.props.deployedDataValidation}</b></p>
                    <Container>
                        <Paper style={{ padding: '30px' }}>
                            <DataValidation />
                        </Paper>
                    </Container>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        enigma: state.enigma,
        deployedDataValidation: state.deployedDataValidation,
    }
};

export default connect(
    mapStateToProps,
    { initializeEnigma, initializeAccounts, deployDataValidation }
)(withStyles(styles)(App));
