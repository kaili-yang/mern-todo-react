import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import TaskBoard from "./components/taskBoard";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

const App = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <div className="wrapper">
        <Container maxWidth="lg" component="div">
          <Navbar/>
          <Routes>
            <Route exact path="/" element={<TaskBoard />} />
          </Routes>
        </Container>
      </div>
    </React.Fragment>
    );
};

export default App;
