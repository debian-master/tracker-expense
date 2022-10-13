import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getFilterSelection } from "./services";
import InputLabel from "@mui/material/InputLabel";
import { Button } from "@mui/material";
import { getReports } from "./services";

export const Reports = () => {
  const [value, setValue] = useState("1");
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [subCategories, setSubCategories] = useState();
  const [selectedSubCategory, setSelectedSubCategory] = useState(0);
  const [paymentTypes, setPaymentTypes] = useState();
  const [selectedPaymentType, setSelectedPaymentType] = useState(0);

  console.log('asdasdasd', categories)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    const res = await getFilterSelection();
    setPaymentTypes(res?.payment_method);
    setSubCategories(res?.sub_catergories);
    setCategories(res?.expense_catergories);
  };

  const handleSubCategory = (event, data) => {
    const {value} = data?.props
    setSelectedSubCategory(value)
  };

  const handleCategory = (event, data) => {
    const {value} = data?.props
    setSelectedCategory(value)
  };

  const handlePayment = (event, data) => {
    const {value} = data?.props
    setSelectedPaymentType(value)
  };

  const fetchReports = async (id)=>{
    window.open(
        `http://localhost:8000/get-reports/?value=${value}&id=${id}`,
        "_blank"
      );
  }

  const handleSubCategoryReports = () =>{
    fetchReports(selectedSubCategory)
  }

  const handleCategoryReports = ()=>{
    fetchReports(selectedCategory)
  }

  const handlePaymentReport = ()=>{
    fetchReports(selectedPaymentType)
  }

  const subCategoryReports = () => {
    return (
      <div>
        <InputLabel id="demo-simple-select-standard-label">
          Select Sub Category
        </InputLabel>
        <Select
          style={{ width: 200, height: 40, backgroundColor: "white" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedSubCategory}
          label="Category"
          onChange={handleSubCategory}
        >
          <MenuItem key={0} value={0}>
            All
          </MenuItem>
          {subCategories?.map((option) => {
            return (
              <MenuItem key={option.id} value={option.id}>
                {option?.name}
              </MenuItem>
            );
          })}
        </Select>
        <Button size="large" variant="contained" 
        onClick={handleSubCategoryReports}
        >
          Export
        </Button>
      </div>
    );
  };

  const categoryReports = () => {
    return (
      <div>
        <InputLabel id="demo-simple-select-standard-label">
          Select Category
        </InputLabel>
        <Select
          style={{ width: 200, height: 40, backgroundColor: "white" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCategory}
          label="Category"
          onChange={handleCategory}
        >
          <MenuItem key={0} value={0}>
            All
          </MenuItem>
          {categories?.map((option) => {
            return (
              <MenuItem key={option.id} value={option.id}>
                {option?.type_name}
              </MenuItem>
            );
          })}
        </Select>
        <Button size="large" variant="contained" 
        onClick={handleCategoryReports}
        >
          Export
        </Button>
      </div>
    );
  };

  const paymentMethodReports = () => {
    return (
      <div>
        <InputLabel id="demo-simple-select-standard-label">
          Select Payment Method
        </InputLabel>
        <Select
          style={{
            width: 200,
            height: 40,
            backgroundColor:'white'
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedPaymentType}
          label="Category"
          onChange={handlePayment}
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
        <Button size="large" variant="contained" 
        onClick={handlePaymentReport}
        >
          Export
        </Button>
      </div>
    );
  };
  return (
    <Box sx={{ width: "100%", typography: "body1", marginTop:3 }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Sub Category" value="1" />
            <Tab label="Category" value="2" />
            <Tab label="Payment Method" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">{subCategoryReports()}</TabPanel>
        <TabPanel value="2">{categoryReports()}</TabPanel>
        <TabPanel value="3">{paymentMethodReports()}</TabPanel>
      </TabContext>
    </Box>
  );
};
