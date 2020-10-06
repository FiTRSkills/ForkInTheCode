import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { changeCurrentPage } from '../../redux/Actions'
import {Container, Box, Button, Grid, Typography, TextField} from '@material-ui/core';
import './SignUp.css';

function SignUp(props) {
    useEffect(() => {
        if (props.user !== undefined && Object.keys(props.user).length > 0) {
            props.history.push('/Home')
        }
        props.changeCurrentPage("Sign Up")
    });

    return (
        <Container>
            <Box className={'signUpContainer'}>
                <Typography className={'formRow'} align={'center'} variant={'h6'}>Sign Up</Typography>
                <Grid container justify={'center'} alignItems={'center'}>
                    <Grid className={'formRow'} container justify={'center'} alignItems={'center'} spacing={3}>
                        <Grid item>
                            <Typography variant={'body1'}>Username: </Typography>
                        </Grid>
                        <Grid item>
                            <TextField name={'username'} id={'username'} />
                        </Grid>
                    </Grid>
                    <Grid className={'formRow'} container justify={'center'} alignItems={'center'} spacing={3}>
                        <Grid item>
                            <Typography variant={'body1'}>Password: </Typography>
                        </Grid>
                        <Grid item>
                            <TextField name={'password'} id={'password'} />
                        </Grid>
                    </Grid>
                    <Grid className={'formRow'} item justify={'center'}>
                        <Button color={'primary'} variant={'contained'}>Sign Up</Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default connect(
    state => ({ user: state.authentication }),
    { changeCurrentPage }
)(SignUp);
