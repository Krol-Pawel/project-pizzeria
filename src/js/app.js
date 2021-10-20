import {settings, select, classNames} from './settings.js';
import Product from './components/Products.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    //console.log('idFromHash', idFromHash);

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        // get page id from href attribute
        const id = clickedElement.getAttribute('href').replace('#', '');
        // run thisApp.activatePage with that ID

        thisApp.activatePage(id);

        // change url hash
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageID){
    const thisApp = this;

    //add class 'active' to matching pages, remove from non-matching
    for(let page of thisApp.pages){
      // if(page.id == pageID){
      //   page.classList.add(classNames.pages.active);
      // } else {
      //   page.classList.remove(classNames.pages.active);
      // }
      page.classList.toggle(classNames.pages.active, page.id == pageID);
    }
    
    //add class 'active' to matching LINKS, remove from non-matching
    
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageID
      );
    }

  },

  initMenu: function(){
    const thisApp = this;

    //console.log('thisApp.data:', thisApp.data);

    for(let productData in thisApp.data.products){
      //new Product(productData, thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
    //const testProduct = new Product();
    ////console.log('testProduct:', testProduct);
  },

  initHome: function(){
    const thisApp = this;
    
    const homeSection = document.querySelector(select.containerOf.home);
    thisApp.home = new Home(homeSection);
  },

  initBooking: function(){
    const thisApp = this;

    const containerOfWidget = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(containerOfWidget);
  },

  initData: function(){
    const thisApp = this;

    //przez API zmiana z thisApp.data = dataSource na pusty obiekt
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);
    thisApp.initHome();
    thisApp.initPages();
    thisApp.initData();
    thisApp.initBooking();

    
    // thisApp.initMenu();
    
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });

  },
  
};  

app.init();
app.initCart();

export default app;

