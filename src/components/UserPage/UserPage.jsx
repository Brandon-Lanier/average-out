import React from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { Typography, Button, Fade, Paper } from '@mui/material';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useHistory } from 'react-router-dom';

import Ticker from 'react-ticker'
import './UserPage.css'


function UserPage() {

  const user = useSelector((store) => store.user);
  const global = useSelector(store => store.global);
  const assets = useSelector(store => store.assets);
  const market = useSelector(store => store.market);
  const [coinTicker, setCoinTicker] = useState([])
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'FETCH_GLOBAL' })
    dispatch({ type: 'GET_ASSETS' })
    dispatch({ type: 'FETCH_MARKET' })
    }, [dispatch]);


  const totalMarket = () => {
    let values = Object.values(global?.total_market_cap);
    let sum = values.reduce((a, b) => a + b)
    sum = sum.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    return sum;
  }

  const totalVolume = () => {
    let values = Object.values(global?.total_volume)
    let sum = values.reduce((a, b) => a + b);
    sum = sum.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    return sum;
  }

  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };


  let totalValue = [];
  // Displays the users total portfolio value upon login
  const getSum = () => {
    let runningTotal = 0
    for (let coin of assets) {
      runningTotal = coin.quantity * coin.current_price;
      totalValue.push(runningTotal)
    }
    totalValue = totalValue.reduce((a, b) => a + b, 0);
    return totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  const testData = [125, 123, 3545634, 234, 234, 56345]


  console.log('coin ticker', coinTicker);
  return (

    <>
      {global.length === 0 || assets.length === 0 || market.length === 0 ?
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        :
        <div id="user-container">
          <Fade in={open}>
            <Paper elevation={4} sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center', p: 2 }}>
              <Typography variant="h5">
                Welcome, {user.firstname}!
              </Typography>
              <br></br>
              <Typography variant="h5">
                Current Market Data
              </Typography>
              <br></br>
              <Typography variant="h5">
                Your Portfolio Total: ${getSum()}
              </Typography>
              <br></br>
              <Typography variant="h5">
                Total Market 24 Hour Change:{global?.market_cap_change_percentage_24h_usd > 0 ? <ArrowDropUpRoundedIcon color="success" /> : <ArrowDropDownRoundedIcon color="error" />}
                {global?.market_cap_change_percentage_24h_usd.toFixed(2)}
              </Typography>
              <br></br>
              <Button variant="contained" onClick={() => history.push('/portfolio')}>Go To Portfolio</Button>
              {/* <LogOutButton className="btn" /> */}
              <div className="ticker-container">
                <div className="ticker-wrapper">
                  <div className="ticker-transition">
                    {market.map((coin) => (
                      <div className="ticker-item">{coin.symbol.toUpperCase()} ${coin.current_price.toFixed(2)}</div>
                    ))}
                  </div>
                </div>
              </div>
            </Paper>
          </Fade>
        </div>
      }
    </>

  );
}

// this allows us to use <App /> in index.js
export default UserPage;
