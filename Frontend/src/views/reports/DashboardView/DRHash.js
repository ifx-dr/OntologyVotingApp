import React, { Component } from 'react';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';

/**
 * Class retrieving and displaying the onGoing proposal repository link
 */
  
class DRHash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Hash: '',
      OngoingDR: ''
    };
  }

  componentDidMount() {
    this.getOngoingDR()
  }

  /**
   * GET request retriving the hash of the ongoing update proposal
   * If success, returns a JSON with the key-value success and object onGoingDR
   */
  getOngoingDR = async () => {
    try{
      const OngoingDR = await fetch('http://localhost:3001/OngoingDR').then((response) => response.json());
      if(!OngoingDR.error){
        this.setState({
          OngoingDR: OngoingDR.success,
        }, console.log(OngoingDR));
      }
      else{
        alert(OngoingDR.error);
      }
    }
    catch (error) {
      // alert(error);
    }
  };
  handleClose = async() => {
    this.setState({
      open: false
    })
  };

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
                {/* Here you can download the DR:
                <button><a href={this.state.Hash} style={{"text-decoration":"none"}} target="_blank" rel={"noopener noreferrer"}>download DR</a></button> */}
                Here is the DR in the ongoing proposal: <button><a href={this.state.OngoingDR} style={{"textDecoration":"none"}} target="_blank" rel={"noopener noreferrer"}>check</a></button>
              </Typography>
              <Typography
                color="textPrimary"
                variant="h6"
              >
                {this.state.OngoingDR}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
export default DRHash;
