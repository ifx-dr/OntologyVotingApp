import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Tokens from './Tokens';
import LatestDR from './LatestDR';
import TotalMembers from './TotalMembers';
import DRHash from './DRHash';
import BlockInfo from './BlockInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));


const Dashboard = () => {
  const classes = useStyles();
  
  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={2}
            sm={6}
            xl={2}
            xs={12}
          >
            <Tokens />
          </Grid>
          <Grid
            item
            lg={2}
            sm={6}
            xl={2}
            xs={12}
          >
            <TotalMembers />
          </Grid>
          <Grid
            item
            lg={5}
            sm={12}
            xl={5}
            xs={12}
          >
            <DRHash />
          </Grid>
          <Grid
            item
            lg={9}
            sm={12}
            xl={9}
            xs={12}
          >
            <LatestDR />
          </Grid>
          <Grid
            item
            lg={9}
            sm={12}
            xl={9}
            xs={12}>
              <BlockInfo/>
          </Grid>
          {/* <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <UploadDR />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;

