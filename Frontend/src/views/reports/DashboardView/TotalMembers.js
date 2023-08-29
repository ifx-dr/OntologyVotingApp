import React, { Component } from 'react';
import { Avatar, Card, CardContent, Grid, Typography } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';


export default class TotalMembers extends Component{
  constructor() {
    super();
    this.state = {members: []};
  };
  componentDidMount() {
    this.getMembers();
  };

  /**
   * GET request to retrive the number of members of the voting app
   * If success, returns a JSON with the key-value success and object the members count
   */
  getMembers = async () => {
    try{
      let data = await fetch('http://localhost:3001/allMembers').then((response) =>response.json());
      if(!data.error){
        this.setState({
          members: data.success
        })
      }
      else{
        alert(data.error);
      }
    }
    catch (error){
      // alert(error);
    }
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
                Total Members
              </Typography>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                {this.state.members}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar>
                <PeopleIcon />
              </Avatar>
            </Grid>
          </Grid>

        </CardContent>
      </Card>
    )
  }
}
