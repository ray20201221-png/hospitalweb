const donateForm = document.getElementById("donateForm");

donateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = document.getElementById("amount").value;

  if (amount < 10) {
    alert("最低捐款金額為 NT$10");
    return;
  }

  // 呼叫後端 API 建立支付 session
  const res = await fetch("/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  const data = await res.json();
  const stripe = Stripe("你的 Stripe 公鑰 (Publishable Key)");

  stripe.redirectToCheckout({ sessionId: data.id });
});