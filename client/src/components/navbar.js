import React from "react";
import Typography from '@material-ui/core/Typography';
import './navbar.css';

export default function Navbar() {
  return (
    <div>
      <div className="title">
        <Typography variant="h2" component="h2" gutterBottom >
            Task Board
          </Typography>
      </div>
      <p className="subtitle">@Kaili's Interview</p>
    </div>
  );
}
