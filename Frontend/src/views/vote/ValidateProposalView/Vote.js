import React, { Component } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  TextField, Input, Button
} from '@material-ui/core';
import { Navigate } from 'react-router';
const jwt=require('jsonwebtoken');

export default class Vote extends Component {
  constructor() {
    super();
    this.state = {
      prop: '',
      prop_ID: '',
      vote: '',
      author_ID: '',
      messages: '',
      Redirect: ''
    };
  }
  componentDidMount() {
    this.getOnGoingProp();
    this.loadData()
    let intervalId = setInterval(this.loadData, 3001)
    this.setState({ intervalId: intervalId })
  }
  loadData() {
    //alert("Every 30 seconds!");
  }
  getOnGoingProp = async () => {
    try{
      const data = await fetch('http://localhost:3001/ongoingProp').then((response) => response.json());
      if(data.error){
        alert(data.error);
        this.setState({
          Redirect:'Dashboard'
        })
      }
      else{
        if(!data.success.error){
          this.setState({
            prop: data.success,
            prop_ID: data.success.ID,
            // eslint-disable-next-line react/destructuring-assignment
          });
          console.log(this.state.prop + this.state.prop_ID);
        }
        else{
          alert('No ongoing proposal now!');
          this.setState({
            Redirect:'Dashboard'
          })
        }
      }
    }
    catch{}
  };

  handleChangeV = async (event) => {
    let value = Array.from(event.target.selectedOptions, option => option.value)
    this.setState({
      vote: value,
    });
  };
  handleChangeM = async (event) => {
    let value = event.target.value
    this.setState({
      messages: value,
    });
  }
  handleSubmit = async(event) => {
    let token = sessionStorage.getItem('token');
    if(token==null){
      this.setState({
        Redirect:'Login'
      })
      alert('Please login in!');
      return;
    }
    token=jwt.verify(token,'secretKey');

    event.preventDefault();
    clearInterval(this.state.intervalId);
    const data = {
      prop_ID: this.state.prop_ID,
      vote: this.state.vote,
      author_ID: token.ID,
      messages: this.state.messages,
    }
    if(data.vote.length===0){
      alert('Please vote!');
      return;
    }
    console.log('Submit*******'+ JSON.stringify(data));
    try{
      await fetch('http://localhost:3001/validateProposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(function(response){
        return response.json();
      }).then((body)=>{
        // body = JSON.parse(body.success)
        // alert(JSON.stringify(body));
        if(body.error){
          alert(body.error);
          return;
        }
        else{
          if(body.success==='please wait')
            alert(body.success)
          else{
            alert(body.success.Message);
            console.log(body);
            this.setState({
              Redirect:'Dashboard'
            })
          }
        }
      });
    }
    catch(error){alert(error)}
  }
  render()
  {
    if(this.state.Redirect==='Login'){
      return <Navigate to='/app/login' state={this.state}></Navigate>
    }
    else if(this.state.Redirect==='Dashboard'){
      return <Navigate to='/app/dashboard' state={this.state}></Navigate>
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <Card>
          <CardHeader
          subheader="Current Ongoing Proposal:"
          title="Ongoing Proposal"
          />
          <CardContent>
            <Grid
              container
              spacing={10}
              wrap="wrap"
            >
              <Grid
                item
                md={9}
                sm={9}
                xs={12}
              >
                <p>
                  Domain: {this.state.prop.Domain}
                </p>
                <p>
                  AuthorID: {this.state.prop.Author}
                </p>
                <p>
                  ProposalType: {this.state.prop.Type}
                </p>
                <p>
                  AcceptedVotes: {this.state.prop.NumAcceptedVotes}
                </p>
                <p>
                  RejectedVotes: {this.state.prop.NumRejectedVotes}
                </p>
              {/* </Grid>

              <Grid
                item
                md={4}
                sm={8}
                xs={12}> */}
                <p>
                Proposal ID: {this.state.prop.ID}
                </p>
                <p>
                Proposal_Message: {this.state.prop.Message}
                </p>

                <p>
                Creation_Date: {this.state.prop.Creation_Date}
                </p>
                <p>
                  URI: {this.state.prop.URI} <button><a href={this.state.prop.URI} style={{"text-decoration":"none"}} target="_blank" rel={"noopener noreferrer"}>check</a></button>
                </p>
                <p>
                LobeOwner: {this.state.prop.LobeOwner}
                </p>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
        </Card>
        <Card>
          <CardHeader
            subheader="Review the on going proposal and validate it via voting"
            title="Vote"
          />
          <CardContent>
            <Grid
              container
              spacing={10}
              wrap="wrap"
            >
              <Grid
                item
                md={4}
                sm={8}
                xs={12}
              >
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="h6"
                >
                  Your Vote
                </Typography>
                <select value={this.state.vote} onChange={this.handleChangeV}>
                  <option></option>
                  <option value='accept'>Accept</option>
                  <option value='reject'>Reject</option>
                </select>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              onChange={this.handleChangeM}
              label="Messages"
              margin="normal"
              name="Messages"
              type="Messages"
              value={this.state.messages}
              variant="outlined"
            />

          </CardContent>
          <Divider />
          <Button variant="contained" color="primary">
            <Input style={{color: "white"}} type="submit" value="Submit"/>
          </Button>
        </Card>
      </form>

    );
  }
}
