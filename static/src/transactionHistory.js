import React from "react";
import Card from "@mui/material/Card";
import { CardActionArea, List, ListItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import "./App.scss";

export const TransactionHistory = (props) => {
  return (
    <>
      {props.isLoading && <>Loading...</>}
      {!props.isLoading && (
        <>
          <Card style={{ height: "680px", backgroundColor: "white" }}>
            <Typography variant="body2" color="text.secondary">
              <h4
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                Transaction History
              </h4>
              <h5
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Top 5
              </h5>
            </Typography>
            {props?.resData?.length > 0 ? (
              <>
                {props?.resData?.map((ins) => {
                  return (
                    // <div >
                    //   <h5>{ins?.expense_type?.name}
                    //   <span style={{float:'right'}}>{`$ ${ins?.amount}`}</span></h5>
                    //   <hr />
                    // </div>
                    <List>
                      <ListItem className="nav-bar">
                        {ins?.expense_type?.name}
                        <span>{`$ ${ins?.amount}`}</span>
                      </ListItem>
                    </List>
                  );
                })}
              </>
            ) : (
              <>Else block</>
            )}
          </Card>
        </>
      )}
    </>
  );
};
