import { Row, Col } from "reactstrap";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getCreditDebit, getTransactionHistory } from "./services";
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
  const [credit, setCredit] = useState(0)
  const [debit, setDebit] = useState(0)

  useEffect(() => {
    fetchData();
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
        setExpenseList(destructeredList);
        setLoading(true);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
      await getCreditDebit().then((res)=>{
        console.log('resres',res)
        setCredit(res?.Incoming)
        setDebit(res?.Outgoing)
      })
  };

  return (
    <>
      <Row>
        <Col md={8}>
            <Row>
          <Card sx={{ maxWidth: 345, height: 150, marginLeft: '10px' }}>
            <Typography gutterBottom variant="h5" component="div">
              Incoming
            </Typography>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {credit[0]?.totalAmount}
              </Typography>
            </CardContent>
            {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
          </Card>
          <Card sx={{ maxWidth: 345, height: 150, marginLeft:'25px' }}>
            <Typography gutterBottom variant="h5" component="div">
              Outgoing
            </Typography>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
              {debit[0]?.totalAmount}
              </Typography>
            </CardContent>
            {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
          </Card>
          </Row>
          {/* </Col> */}
          {/* </Row> */}
          {/* <Row style={{ marginTop: "20px" }}> */}
          {/* <Col md={8}> */}
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
              <XAxis dataKey="expenseCategory" />
              <YAxis type='number' domain={[0, 2000]} allowDataOverflow={true}/>
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                fill="#8884d8"
              />
              {/* <Area
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                fill="#8884d8"
              /> */}
            </AreaChart>
          </Card>
        </Col>
        <Col sm={4} style={{ marginTop: "" }}>
          <TransactionHistory resData={historyData} isLoading={loading} />
        </Col>
      </Row>
    </>
  );
};
