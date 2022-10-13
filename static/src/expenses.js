// const addNewtransaction = async ()=>{
// }
import { Row, Col } from "reactstrap";
import { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Category, GridViewRounded } from "@mui/icons-material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {
  addNewtransaction,
  getExpensesList,
  getDestructeredExpenseList,
  getFilterSelection,
} from "./services";

export const AddNewtransaction = () => {
  const [openModal, setOpenModal] = useState(false);
  const [expenseList, setExpenseList] = useState();
  const [filteredExpenseList, setFilteredExpenseList] = useState();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState();
  const [paymentTypes, setPaymentTypes] = useState();
  const [selectedPayment, setSelectedPayment] = useState();
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedTransaction, setSelectedTransaction] = useState(0);
  const [expenseCategory, setExpenseCategory] = useState();
  const [filterSubCategory, setFilterSubCategory] = useState(0);
  const [filterCategory, setFilterCategory] = useState(0);
  const [filterPayment, setFilterPayment] = useState(0);

  useEffect(() => {
    fetchData();
    fetchFilters();
  }, [filterCategory, filterPayment, filterSubCategory, openModal]);

  const fetchData = async () => {
    await getExpensesList(filterCategory, filterSubCategory, filterPayment)
      .then((res) => {
        const desctructeredList = getDestructeredExpenseList(res);
        setExpenseList(desctructeredList);
        setFilteredExpenseList(desctructeredList);
        setLoading(true);
      })
      .catch((err) => {})
      .finally((res) => {
        setLoading(false);
      });
  };

  const fetchFilters = async () => {
    const res = await getFilterSelection();
    setPaymentTypes(res?.payment_method);
    setCategories(res?.sub_catergories);
    setExpenseCategory(res?.expense_catergories);
  };

  const handleClose = () => {
    setOpenModal(false);
    setAmount();
    setSelectedPayment();
    setSelectedCategory();
  };
  const handleOpen = () => {
    setOpenModal(true);
    if (!openModal) {
      fetchFilters();
    }
  };
  const handleChange = (value) => {
    setAmount(value);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const handleSend = async () => {
    const payload = {
      amount: amount,
      paymentId: selectedPayment,
      subCategoryId: selectedCategory,
      transactionType: selectedTransaction,
    };
    setOpenModal(false);
    await addNewtransaction(payload);
  };

  const columnDef = [
    {
      field: "expenseCategory",
      headerName: "Category",
      width: 200,
      editable: true,
      renderCell: (value) => {
        return (
            <div>
              <GridViewRounded />
              {value?.value}
            </div>
        );
      },
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
    //   renderCell: (value)=>{
    //     let newDateObj = value?.value
    //     const newDate = getDate(newDateObj)
    //     const month = getMonth(newDateObj + 1)
    //     const year = getFullYear(newDateObj)
    //   },
      width: 200,
    },
    {
      field: "masterCategory",
      headerName: "Transaction Category",
      width: 200,
    },
    {
      field: "paymentName",
      headerName: "Payment Type",
      width: 200,
    },
    {
      field: "transactionType",
      headerName: "Transaction Type",
      renderCell: (value) => {
        let transactionType = 'Debit'
        let color = '#C32148'
        if (value?.value){
          transactionType = 'Credit'
          color = '#006400'
        }
        return (
          <div style={{color:`${color}`}}>
            {transactionType}
          </div>
        )
      },
      width: 150,
    },
    {
      field: "amount",
      headerName: "Expense",
      width: 150,
    },
  ];

  const handlePayment = (event, data) => {
    const { value } = data?.props;
    setSelectedPayment(value);
  };

  const handleCategory = (event, data) => {
    const { value } = data?.props;
    setSelectedCategory(value);
  };

  const handleFilterSubCategory = (event, data) => {
    const { value } = data?.props;
    setFilterSubCategory(value);
  };

  const handleFilterPayment = (event, data) => {
    const { value } = data?.props;
    const { children } = data?.props;
    setFilterPayment(value)
  };

  const handleFilterCategory = (event, data) => {
    const { value } = data?.props;
    const { children } = data?.props;
    setFilterCategory(value);
  };

  const handleTransactionMethod = (event, data) => {
    const { value } = data?.props;
    setSelectedTransaction(value);
  };

  const rows = [{ id: 1, lastName: "Snow", firstName: "Jon", age: 35 }];

  return (
    <>
      <div style={{ height: "100%", marginTop:40 }}>
        <Row>
          <Col md={10}>
            {/* <InputLabel id="demo-simple-select-standard-label">
              Payment Method
            </InputLabel> */}
            <span>Payment Method: </span><Select
              style={{ width: 150, height: 35, backgroundColor: "white" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterPayment}
              label="Payment Method"
              onChange={handleFilterPayment}
            >
                <MenuItem key={0} value={0}>
                    All
                  </MenuItem>
              {paymentTypes?.map((option) => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option?.payment_name}
                  </MenuItem>
                );
              })}
            </Select>
            {/* <InputLabel id="demo-simple-select-standard-label">
              Sub Category
            </InputLabel> */}
            <span style={{marginLeft:20}}>Expense Type: </span><Select
              style={{ width: 150, height: 35, backgroundColor: "white" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterCategory}
              label="Category"
              onChange={handleFilterCategory}
            >
                <MenuItem key={0} value={0}>
                    All
                  </MenuItem>
              {expenseCategory?.map((option) => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option?.type_name}
                  </MenuItem>
                );
              })}
            </Select>
            <span style={{marginLeft:20}}>Sub Category: </span><Select
              style={{ width: 150, height: 35, backgroundColor: "white" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterSubCategory}
              label="Payment"
              onChange={handleFilterSubCategory}
            >
                <MenuItem key={0} value={0}>
                    All
                  </MenuItem>
              {categories?.map((option) => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {option?.name}
                  </MenuItem>
                );
              })}
            </Select>
          </Col>
          <Col md={2}>
            <div style={{ textAlign: "right" }}>
              <Button onClick={handleOpen} color="primary" variant="contained">
                Add Transaction
              </Button>
            </div>
          </Col>
        </Row>
        {loading && <>loading...</>}
        {!loading && (
          <div style={{ marginTop: "10px" }}>
            {expenseList?.length > 0 ? (
              <div style={{ marginTop: "" }}>
                <Box sx={{ height: 600, backgroundColor: "white" }}>
                  <DataGrid rows={expenseList} columns={columnDef} />
                </Box>
              </div>
            ) : (
              <>No Data</>
            )}
          </div>
        )}
      </div>
      <div>
        {!paymentTypes && <>...</>}
        {paymentTypes && (
          <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style, width: 400 }}>
              <h2 id="parent-modal-title">Add Transaction</h2>
              <InputLabel id="demo-simple-select-standard-label">
                Amount
              </InputLabel>
              <TextField
                id="outlined-name"
                // label="Amount"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={amount}
                onChange={(event) => {
                  handleChange(event.target.value);
                }}
              />
              <InputLabel id="demo-simple-select-standard-label">
                Payment Method
              </InputLabel>
              <Select
                style={{ width: 200 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedPayment ? selectedPayment : "Payment Method"}
                label="Payment Method"
                onChange={handlePayment}
              >
                {paymentTypes?.map((option) => {
                  return (
                    <MenuItem key={option.id} value={option.id}>
                      {option?.payment_name}
                    </MenuItem>
                  );
                })}
              </Select>
              <InputLabel id="demo-simple-select-standard-label">
                Category
              </InputLabel>
              <Select
                style={{ width: 200 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCategory}
                label="Category"
                onChange={handleCategory}
              >
                {categories?.map((option) => {
                  return (
                    <MenuItem key={option.id} value={option.id}>
                      {option?.name}
                    </MenuItem>
                  );
                })}
              </Select>
              <InputLabel id="demo-simple-select-standard-label">
                Transaction Type
              </InputLabel>
              <Select
                style={{ width: 200 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedTransaction ? selectedTransaction : 0}
                label="Payment Method"
                onChange={handleTransactionMethod}
              >
                <MenuItem key={1} value={0}>
                  Debit
                </MenuItem>
                <MenuItem key={2} value={1}>
                  Credit
                </MenuItem>
              </Select>
              <div style={{ marginTop: 10, width: 20 }}>
                <Button
                  disabled={
                    !(amount > 0 && selectedCategory && selectedPayment)
                  }
                  size="large"
                  variant="contained"
                  onClick={handleSend}
                >
                  Save
                </Button>
              </div>
            </Box>
          </Modal>
        )}
      </div>
    </>
  );
};
