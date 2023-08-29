import React, { Component } from 'react';
import { Avatar, Card, CardContent, Grid, Typography } from '@material-ui/core';
import AccountBalance from '@material-ui/icons/AccountBalance';

class Tokens extends Component {
  constructor(props) {
    super(props);
    this.state = { tokens: null };
  }

  componentDidMount() {
    this.getTokens();
  }

  getTokens = async () => {
    const data = {
      id: 'visitor'
    }
    let token = 0;
    const jwt=require('jsonwebtoken');
    let session_token = sessionStorage.getItem('token');
    const secretKey='secretKey';
    
    //identify the user
    if(session_token!==null){
      let decoded=jwt.verify(session_token,secretKey);
      data.id = decoded.data.ID;
    }
    
    //display only if the user is connected
    if(session_token){
      console.log("before calling the tokens");
      try{
        await fetch('http://localhost:3001/tokens', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session_token}`,
          }
        }).then(function(response){
          return response.json();
        }).then(function(body){
          if(!body.error){
            token=body.success;
          }
          else{
            alert(body.error)
          }
        });
        this.setState({
          tokens: token
        });
        console.log('***********Succesfully invoke func '+this.state.tokens);
      }
      catch (error) {
        alert(error);
      }
    };
  }
    

  render() {

    return (
      <Card>
        <CardContent>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="h6"
              >
                Your Tokens:
              </Typography>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                {this.state.tokens}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar>
                <AccountBalance />
              </Avatar>
            </Grid>
          </Grid>

        </CardContent>
      </Card>
    );
  }
}
export default Tokens;
