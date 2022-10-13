import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Dashboard } from "./dashboard";
import { AddNewtransaction } from "./expenses";
import { Reports } from "./expenseReports";
import Card from "@mui/material/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { ListItem } from "@mui/material";
{
  /* <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/recharts/umd/Recharts.min.js"></script> */
}

const drawerWidth = 240;

export const App = () => {
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Expense Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        <Router>
          <div style={{ display: "flex", width: "2000px" }}>
            <div
              style={{
                padding: "10px",
                width: "200px",
                height: "710px",
                background: "#f0f0f0",
                marginTop: "50px",
              }}
            >
              <Card style={{ marginTop: "10px", height: "100%" }}>
                    <Link
                      to="/"
                      className="nav-bar"
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ListItem>Dashboard</ListItem>
                    </Link>
                    <Link
                      to="/expense"
                      className="nav-bar"
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ListItem>Expenses</ListItem>
                    </Link>
                    <Link
                      to="/reports"
                      className="nav-bar"
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ListItem>Reports</ListItem>
                    </Link>
              </Card>
            </div>

            <div style={{ flex: 1, padding: "20px", marginTop: "20px" }}>
              <Switch>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    children={<route.main />}
                  />
                ))}
              </Switch>
            </div>
          </div>
        </Router>
      </Box>
    </div>
  );
};

const routes = [
  {
    path: "/",
    exact: true,
    main: () => <Dashboard />,
  },
  {
    path: "/expense",
    main: () => <AddNewtransaction />,
  },
  {
    path: "/reports",
    main: () => <Reports />,
  },
];
