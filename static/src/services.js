import axios from "axios";

// export const getExpensesList = async () => {
//   await axios
//     .get("127.0.0.1:8801/get")
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       return error;
//     });
// };

export const getTransactionHistory = async () => {
  try {
    const response = await axios({
      method: "get",
      url: "http://localhost:8000/get-history/",
    });
    return response?.data;
  } catch (err) {
    return err;
  }
};

export const getExpensesList = async (
  filterCategory,
  filterSubCat,
  filterPayment
) => {
  try {
    const response = await axios({
      method: "get",
      url: `http://localhost:8000/get-transactions/?categoryId=${filterCategory}&paymentId=${filterPayment}&subCatId=${filterSubCat}`,
    });
    return response?.data;
  } catch (err) {
    return err;
  }
};

// export const addNewtransaction = async (payload) => {
//     try {
//       const response = await axios({
//         method: "post",
//         url: "http://localhost:8000/add-new-transaction/",
//         POST: payload
//       });
//       return response?.data;
//     } catch (err) {
//       return err;
//     }
//   };

export const addNewtransaction = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/add-new-transaction/",
      payload
    );
    //   return response?.data;
  } catch (err) {
    //   return err;
  }
};

export const getFilterSelection = async () => {
  try {
    const response = await axios.get("http://localhost:8000/get-filters/");
    return response?.data;
  } catch (err) {
    return err;
  }
};

export const getDestructeredExpenseList = (expenseList) => {
  return expenseList?.map((expense) => {
    const {
      id,
      payment_type,
      expense_type: { master_type, name },
      flag,
      amount,
      created_at,
    } = expense;
    return {
      id: id || "-",
      paymentName: payment_type?.payment_name || "-",
      expenseCategory: name || "-",
      masterCategory: master_type?.type_name || "-",
      amount: amount.toFixed(2),
      transactionType: flag,
      transactionDate: created_at,
    };
  });
};

export const getReports = async (value, id) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/get-reports/?value=${value}&id=${id}`
    );
    return response?.request;
  } catch (err) {
    //   return err;
  }
};

export const getCreditDebit = async (value, id) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/get-transation-type-data/`
    );
    return response?.data;
  } catch (err) {
    //   return err;
  }
};
