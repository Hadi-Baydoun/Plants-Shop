import { useContext } from "react";
import "./Cart.css";
import benefitsBig from "../../assets/benefitsBig.jpg";
export default function Cart() {
  // const {cartItems,removeFromCart} = useContext(StoreContext);
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        <div>
          <div className="cart-items-title cart-items-item">
            <img src={benefitsBig}/>
            <p>item 1</p>
            <p>$20</p>
            <p>3</p>
            <p>$80</p>
            <p className="cross">x</p>
          </div>
          <hr />
        </div>
        <div>
          <div className="cart-items-title cart-items-item">
            <img src={benefitsBig}/>
            <p>item 1</p>
            <p>$20</p>
            <p>3</p>
            <p>$80</p>
            <p className="cross">x</p>
          </div>
          <hr />
        </div>
        <div>
          <div className="cart-items-title cart-items-item">
            <img src={benefitsBig}/>
            <p>item 1</p>
            <p>$20</p>
            <p>3</p>
            <p>$80</p>
            <p className="cross">x</p>
          </div>
          <hr />
        </div>
        <div>
          <div className="cart-items-title cart-items-item">
            <img src={benefitsBig}/>
            <p>item 1</p>
            <p>$20</p>
            <p>3</p>
            <p>$80</p>
            <p className="cross">x</p>
          </div>
          <hr />
        </div>
        <div>
          <div className="cart-items-title cart-items-item">
            <img src={benefitsBig}/>
            <p>item 1</p>
            <p>$20</p>
            <p>3</p>
            <p>$80</p>
            <p className="cross">x</p>
          </div>
          <hr />
        </div>
        <div>
          <div className="cart-items-title cart-items-item">
            <img src={benefitsBig}/>
            <p>item 1</p>
            <p>$20</p>
            <p>3</p>
            <p>$80</p>
            <p className="cross">x</p>
          </div>
          <hr />
        </div>
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{0}</b>
            </div>
          </div>
          <button>Proceed To Checkout</button>
        </div>
      </div>
      <hr />
    </div>
  );
}
