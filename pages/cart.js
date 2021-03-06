import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../store/auth/auth.context";
import { useCart } from "../store/cart/cart.context";
import cookie from "js-cookie";
import StripeCheckout from "react-stripe-checkout";
import CartList from "../components/Cart/CartList";
import CartSubTotal from "../components/Cart/CartSubTotal";
import calculateCartTotal from "../utils/calculateCartTotal";
import Link from "next/link";
import axios from "axios";
import baseURL from "../utils/baseURL";
import Spinner from "../components/Shared/Spinner";
import Router from "next/router";

const Cart = () => {
  const { currentUser } = useAuth();
  const { carts, removeCart, clearCart } = useCart();
  const { cartTotal, stripeTotal } = calculateCartTotal(carts);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // clear cart on mount, if checkout successfully
    return () => {
      if (success) {
        clearCart();
      }
    };
  }, [success]);

  const handleCheckout = async paymentData => {
    try {
      setSubmitting(true);
      const token = cookie.get("token");
      const payload = { paymentData };
      const headers = { headers: { Authorization: token } };
      await axios.post(`${baseURL}/api/checkout`, payload, headers);
      setSuccess(true);
      setSubmitting(false);
      Router.push("/account");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container">
        {currentUser ? (
          <div>
            <h1 className="page-title">Your Cart</h1>
            {carts.length > 0 ? (
              <>
                <CartList carts={carts} removeCart={removeCart} />
                <CartSubTotal total={cartTotal} />
                <StripeCheckout
                  name="Dress Shop"
                  amount={stripeTotal}
                  currency="PHP"
                  shippingAddress={true}
                  billingAddress={true}
                  zipCode={true}
                  stripeKey="pk_test_hsm6fyMNxWvCWNRY58tIAXAw006jqf8Kzt"
                  token={handleCheckout}
                  triggerEvent="onClick"
                >
                  <div className="checkout-btn-wrapper">
                    <button className="checkout-btn" disabled={submitting}>
                      {" "}
                      {submitting ? (
                        <Spinner color="#fff" width={40} height={40} />
                      ) : (
                        "CHECK OUT"
                      )}{" "}
                    </button>
                  </div>
                </StripeCheckout>
              </>
            ) : (
              <div className="msg-container">
                <div className="msg"> Your cart is empty :( </div>
                <Link href="/">
                  <a className="btn"> Go Shop Now </a>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="msg-container">
            <h1 className="page-title"> Please login to see your cart </h1>
            <Link href="/login">
              <a className="btn"> Login </a>
            </Link>
          </div>
        )}
      </div>
      <style jsx>
        {`
          .container {
            max-width: 1200px;
            margin: 2rem auto;
          }

          .page-title {
            font-size: 3rem;
          }

          .checkout-btn-wrapper {
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }

          .checkout-btn,
          .btn {
            width: 20rem;
            color: #fff;
            background-color: var(--color-dark);
            border: 1px solid var(--color-dark);
            height: 6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            cursor: pointer;
          }

          .btn {
            margin: 5rem 0;
          }

          .msg {
            font-size: 2.2rem;
          }

          .msg-container {
            padding: 2rem 0;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </Layout>
  );
};

export default Cart;
