import React, { Component } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography
} from '@material-ui/core';

class Blockchain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Blockchain: [],
    }
  }
  componentDidMount(){
    this.getBlockchain();
  }
  getBlockchain = async () => {
    try{
      let blockchain = await fetch('http://localhost:3001/checkBlockchain').then((response) => response.json());
      if(!blockchain.error){
        // a list of blocks
        blockchain = blockchain.success;
        this.setState({
          Blockchain: blockchain,
        });
        console.log(this.state.Blockchain);
      }
      else{
        alert(blockchain.error)
      }
    }
    catch{}
  };
  render(){
    return (
      <Card>
        <CardHeader
          title="View Blockchain"
          subheader="View the manual blockchain for previous versions"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={10}
            wrap="wrap"
          >
            <Grid
              item
              md={10}
              sm={10}
              xs={12}
            >
              <Typography
                color="textPrimary"
                gutterBottom
                variant="h6"
              >
                {
                  this.state.Blockchain.reverse().map((value, index) => {
                    return(
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="h6"
                  >
                    <p>
                      index: {index+1}
                    </p>
                      <p>{value?(
                        (!(value))?
                        (value):
                        (
                          Object.keys(value).map((keyName, i) => (
                            <p key={i}>
                              {keyName}: {value[keyName]}
                            </p>
                        ))
                        )
                      ):'n/a'}</p>
                    <Divider />
                    </Typography>
                    )
                  })
                }
                </Typography>
              <Divider />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
export default Blockchain;
