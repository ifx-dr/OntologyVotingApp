const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const jwt = require('jsonwebtoken');
const router = express.Router();

//Access information stored in YAML file
const userDataPath = 'ledger_DR.yaml';
const userData = fs.readFileSync(userDataPath, 'utf8');
const usersData = yaml.load(userData);
const usersInfoData = usersData['UserInfo'];
const onGoingDRData = usersData['OngoingProposalInfo'];
const ontologyInfo = usersData['OntologyInfo'];
const latestDRURI = usersData['LatestDR'];
const latestDRHash = usersData['FileHash'];
const newBlockRequest = usersData['NewBlockRequest'];
const historic = usersData['ClosedProposalInfo'];


//boolean to check status of the update
let NewProposalLock = true;
var VaidateProposalLock = true;

//constants for the voting time
const DAY = 24 * 60 * 60 * 1000;
const MIN = 60 * 1000;
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

//signal controller
class signalController {
    controller = null;
    constructor() {
        this.resetController();
    }
    resetController() {
        if (this.controller)
            delete this.controller
        console.log('signalController: reset');
        this.controller = new AbortController();
        signal = this.controller.signal;
    }
    triggerSignal() {
        if (this.controller) {
            console.log('signalController: triggered');
            this.controller.abort();
            this.resetController();
        }
    }
}
var sc = new signalController();
var signal = sc.controller.signal;
var proposalID = '';

/**
 * Retrieve the count of members registered in the voting app 
*/
router.get('/allMembers', async (req, res) => {
    let result;
    try {
        let countMembers = usersInfoData.length;
        result = { "success": JSON.parse(countMembers) };
    } catch (error) {
        result = { "error": error.toString() };
    }
    res.json(result);
});

/**
 * Retrieve the URI of the ongoing proposal commit.
*/
router.get("/OngoingDR", async (req, res) => {
    let result;
    try {
        let ongoingDR = onGoingDRData[0];
        if (ongoingDR.URI.length > 0) {
            result = { "success": ongoingDR.URI };
        } else {
            result = [];
        }

    } catch (error) {
        result = { "error": error.toString() };
    }
    res.json(result);
});

/**
 * Retrieve the number of tokens of the user.
 * If the user has been identified, sends as a response the user's tokens
*/
router.get('/tokens', async (req, res) => {
    let result;
    const token = req.headers.authorization.split(' ')[1]; //retrieve the token from the header
    try {
        const decoded = jwt.verify(token, 'secretKey'); //decrypt the token to have its data
        const user = usersInfoData.find(user => user.ID == decoded.data.ID); //find the user with the corresponding ID
        let countToken = user.Tokens;
        result = { "success": JSON.parse(countToken) };
    } catch (error) {
        result = { "error": error.toString() };
    }

    res.json(result);
});

/**
 * Retrieve information about the ontology repository
 * The object response has the following properties: Platform, RepoName, DefaultBrach, AccessToken
 */
//utility ?
router.get("/Repo", async (req, res) => {
    let result = {
        "success": {
            Platform: ontologyInfo['Platform'],
            RepoName: ontologyInfo['Repo'],
            DefaultBranch: ontologyInfo['Default'],
            AccessToken: ontologyInfo['AccessToken']
        }
    };
    res.json(result);
});

/**
 * Retrieve the URI of the last update commit
*/
router.get("/DR", async (req, res) => {
    let result;
    try {
        result = { "success": latestDRURI };
    } catch (error) {
        result = { "error": error.toString() };
    }
    console.log(result);
    res.json(result);
});

//Get the Hash value of the latest update
router.get("/DRHash", async (req, res) => {

    let result;
    try {
        result = { "success": latestDRHash };
    } catch (error) {
        result = { "error": error.toString() };
    }

    res.json(result);
});

/**
 * Check if there is a new block to be generated.
 * newBlockRequest has the following properties: newBlockWaiting:boolean, porposalId, author, lobeOwner, supervisor
*/
router.get("/checkNewBlockRequest", async (req, res) => {
    let result;
    try {
        result = { "success": newBlockRequest };

    } catch (error) {
        result = { "error": error.toString() };
    }

    res.json(result);
});

//retrieves the information of the latest block
router.get("/checkLatestBlock", async (req, res) => {
    let result;
    try {
        const latestBlock = historic[historic.length - 1];
        result = { "success": latestBlock }
    } catch (error) {
        result = { "error": error.toString() };
    }

    res.json(result);
});

/**
 * GET request to retrieves all the domains of the ontology.
 */
router.get("/loadDomainsInFrontend", async (req, res) => {
    res.json(JSON.stringify(ontologyInfo['Domains']));
});

// For submitTransaction, the transaction will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
// to the orderer to be committed by each of the peer's to the channel ledger.
/**
 * POST request handling the creation of an update proposal.
 */
router.post("/createProposal", async (req, res) => {
    if (!NewProposalLock) {
        res.json({ "success": `please wait` });
    }
    else {
        NewProposalLock = !NewProposalLock;
        console.log('\n--> Submit Transaction: CreatedProposal');
        console.log(req.body);
        console.log(onGoingDRData);
        let result;
        try {
            //the penalization system may not be needed anymore
            /* let penalization = 0;
            if (penalization != 0) {
                message = 'Penalization for inactivity: ' + penalization.toString() + ' tokens removed.\n';
                console.log(message);
            } */
            //only one update at a time
            if (onGoingDRData.length >= 1) {
                result = { "success": 'Cannot create new proposal: a proposal is ongoing' };
            }
            //modify data about onGoingProposal
            usersData['OngoingProposalInfo'].push(req.body);
            const updatedData = yaml.dump(usersData);
            fs.writeFileSync('ledger_DR.yaml', updatedData, 'utf8');
            result = { "success": "successfully created the proposal" };
            console.log(result);
            // start timer
            setTimeoutPromise(DAY, null, { signal })
                .then(() => {
                    console.log(`INFO app createdProposal: no lobe owner voting in 1 min, expert voting available within 1 min`);
                    // chaincode checks the time interval
                    // start expert voting timer: 48 h
                    setTimeoutPromise(DAY * 2, null, { signal })
                        .then(() => {
                            // time out: proposal closed
                            //return contract.submitTransaction('ProposalVoteResult', proposalID, 'true');
                            //should just delete the proposal ?
                        })
                })
                .catch((err) => {
                    if (err.name === 'AbortError')
                        console.log(`INFO app createdProposal: proposal finished before time up`);
                    else
                        console.log(`ERROR unexpected error: ${err}`);
                });

        } catch (error) {
            result = { "error": error.toString() };
        }
        NewProposalLock = !NewProposalLock;
        res.json(result);
    }
});

/**
 * GET request to retrieve the ongoing proposal.
 */
router.get("/ongoingProp", async (req, res) => {
    let result;
    try {
        let res = onGoingDRData[0];
        console.log(`SUCCESS app ongoingProp: ${res}`);
        result = { "success": res };
    } catch (error) {
        result = { "error": error.toString() };
    }

    res.json(result);
});
/**
 * GET request to retrieve the updates history.
 */
router.get("/checkBlockchain", async (req, res) => {
    let result;
    try {
        let res = historic;
        console.log(res);
        console.log(`SUCCESS app checkBlockchain: ${res}`);
        result = { "success": res };

    } catch (error) {
        result = { "error": error.toString() };
    }
    res.json(result);
});

module.exports = router;