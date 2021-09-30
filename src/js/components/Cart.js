import {settings, select, classNames, templates} from './settings.js';
import utils from './utils.js';
import CartProduct from './components/CartProduct.js';

class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

    //console.log('new Cart', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.address = element.querySelector(select.cart.address);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);

    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);
    //console.log(generatedHTML);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    //console.log(generatedDOM);
    thisCart.dom.productList.appendChild(generatedDOM);


    //console.log('adding product', menuProduct);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    //console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }

  update(){
    const thisCart = this;

    const deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    console.log(deliveryFee);

    for(let product of thisCart.products){
      thisCart.totalNumber += product.amount;

      thisCart.subtotalPrice += product.price;
    }

    if(thisCart.totalNumber!==0) {
      thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
      thisCart.dom.deliveryFee.innerHTML = deliveryFee;
      thisCart.deliveryFee = deliveryFee;
    }

    else{
      thisCart.totalPrice = 0;
      thisCart.dom.deliveryFee.innerHTML = 0;
      // thisCart.dom.subtotalPrice.innerHTML = 0;

    }
    
    for(let selector of thisCart.dom.totalPrice){
      selector.innerHTML = thisCart.totalPrice;
    }
    
    // thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    // thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    // thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    
    // thisCart.dom.deliveryFee.innerHTML = deliveryFee;

    console.log(deliveryFee);
    console.log(thisCart.totalNumber);
    console.log(thisCart.subtotalPrice);
    console.log(thisCart.totalPrice);

  }

  remove(thisCartProduct){
    const thisCart = this;
    //delete representation of product from HTML 
    thisCartProduct.dom.wrapper.remove();
    //delete information about product from the table {thisCart.products}
    const indexOfProduct = thisCart.products.indexOf(thisCartProduct);
    console.log('indexOfProduct:', indexOfProduct);
    const thisCartProductLength = thisCart.products.length;
    console.log('thisCartProduct.length:', thisCartProductLength);
    thisCart.products.splice(indexOfProduct, 1);
    //call the 'update' method to refresh totals after removing the product
    thisCart.update();
  }

  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {};
    payload.address = thisCart.dom.address.value;
    console.log(payload.address);
    payload.phone = thisCart.dom.phone.value;
    payload.totalPrice = thisCart.totalPrice;
    console.log(payload.totalPrice);
    payload.subtotalPrice = thisCart.subtotalPrice;
    payload.totalNumber = thisCart.totalNumber;
    payload.deliveryFee = thisCart.deliveryFee;
    payload.products = [];

    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    console.log(payload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };

    fetch(url, options);

  }
}

export default Cart;