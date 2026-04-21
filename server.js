const express = require("express");
const bodyParser = require("body-parser");
const ecpay = require("ecpay_aio_nodejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(".")); // 提供前端檔案

// 測試用商店參數 (正式上線要換掉)
const options = {
  OperationMode: "Test", // Test or Production
  MercProfile: {
    MerchantID: "2000132",
    HashKey: "5294y06JbISpM5x9",
    HashIV: "v77hoKGq4kWxNNIS",
  },
  IgnorePayment: [],
  IsProjectContractor: false,
};

const ecpayPayment = new ecpay(options);

app.post("/donate", (req, res) => {
  const { name, amount } = req.body;

  const tradeNo = "DONATE" + Date.now(); // 訂單編號
  const tradeDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  const base_param = {
    MerchantTradeNo: tradeNo,
    MerchantTradeDate: tradeDate,
    TotalAmount: amount,
    TradeDesc: "醫院愛心捐款",
    ItemName: "愛心捐款",
    ReturnURL: "http://localhost:3000/return",
    ClientBackURL: "http://localhost:3000/thankyou.html",
  };

  const html = ecpayPayment.payment_client.aio_check_out_all(base_param);
  res.send(html);
});

// 付款完成回傳 (供 ECPay 呼叫)
app.post("/return", (req, res) => {
  console.log("付款結果：", req.body);
  res.send("1|OK"); // 固定回覆
});

app.listen(3000, () => {
  console.log("伺服器運行於 http://localhost:3000");
});