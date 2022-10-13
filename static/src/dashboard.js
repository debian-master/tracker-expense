import { Row, Col } from "reactstrap";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { Container } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getCreditDebit, getTransactionHistory, dashboardChartApi } from "./services";
import { TransactionHistory } from "./transactionHistory";

import {
  addNewtransaction,
  getExpensesList,
  getDestructeredExpenseList,
} from "./services";

export const Dashboard = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expenseList, setExpenseList] = useState([]);
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);

  useEffect(() => {
    fetchData();
    console.log('all effect')
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await getTransactionHistory()
      .then((res) => {
        setHistoryData(res);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
    await getExpensesList(0, 0, 0)
      .then((res) => {
        const destructeredList = getDestructeredExpenseList(res);
        setLoading(true);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
    await getCreditDebit().then((res) => {
      setCredit(res?.Incoming);
      setDebit(res?.Outgoing);
    });
    await dashboardChartApi().then((res)=>{
      setExpenseList(res)
    })
  };

  return (
      <Row style={{marginTop:40}}>
        <Col md={8}>
          <Row>
          <Col md={6}>
            <Card
              sx={{
                // maxWidth: 385,
                // height: 150,
                // marginLeft: "10px",
              }}
            >
              <Typography gutterBottom variant="h4" component="div">
                Credit
              </Typography>
                <Typography variant="h4" color="#006400"
                style={{display: "flex",
                justifyContent: "center",
                alignItems: "center",}}>
                  {`+ $ ${credit[0]?.totalAmount}`}
                </Typography>
            </Card>
            </Col>
            <Col md={6}>
            <Card
              sx={{
                // maxWidth: 385,
                // height: 150,
                // padding: "20px",
                // marginLeft:"12px"
              }}
            >
              <Typography gutterBottom variant="h4" component="div">
                Debit
              </Typography>
                <Typography variant="h4" color="#C32148"
                style={{display: "flex",
                justifyContent: "center",
                alignItems: "center",}}>
                  {`- $ ${debit[0]?.totalAmount}`}
                </Typography>
            </Card>
            </Col>
          </Row>
          <Card style={{ marginTop: "20px" }}>
            <AreaChart
              width={700}
              height={510}
              data={expenseList}
              margin={{
                top: 30,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid />
              <XAxis dataKey="expense_name" />
              <YAxis
                type="number"
                domain={[0, 2000]}
                allowDataOverflow={true}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="credit"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="debit"
                stroke="#C32148"
                fill="#C32148"
              />
            </AreaChart>
          </Card>
        </Col>
        <Col sm={4} style={{ marginTop: "" }}>
          <TransactionHistory resData={historyData} isLoading={loading} />
        </Col>
      </Row>
      // </Container>
  );
};
