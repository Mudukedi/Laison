// Get the Nav Element

const carts = document.querySelectorAll('.trolley');

// Array of Shop Items

let products =[
    {
        name : 'OIL',
        tag : ' Car Oil',
        price : 150.00,
        inCart : 0,
        oldQty :0
    },
    {
        name : 'Anti Freeze',
        tag : ' Anti Freeze',
        price : 130.00,
        inCart : 0,
        oldQty :0
    },
    {
        name : 'Brake Fluid',
        tag : ' Brake Fluid',
        price : 150.00,
        inCart : 0,
        oldQty :0
    },
    {
        name : 'Spark Plug',
        tag : ' Spark Plug',
        price : 130.00,
        inCart : 0,
        oldQty :0
    }
];

//Add eventListeners to Buttoms
for (let i =0; i < carts.length; i++){
    carts[i].addEventListener('click', ()=>{
        addCart(products[i]);
        cartVisible();
    });
}



//Add to cart 
function addCart(product){
    let cartItems = sessionStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if (cartItems != null){

        if(cartItems[product.tag] == undefined){
            cartItems = {
                ...cartItems,
                [product.tag] : product
            }
        }
        cartItems[product.tag].inCart +=1;
    }
    else{
        product.inCart = 1;
        cartItems = {
            [product.tag] : product
        }
    }

    sessionStorage.setItem('productsInCart', JSON.stringify(cartItems));
    totalCost(product);
    displayCart();

}

//Total cost 
function totalCost(product){
    let cartCost = sessionStorage.getItem('totalCost');
    
    
    if (cartCost != null){
        cartCost = parseFloat(cartCost);
        sessionStorage.setItem('totalCost', cartCost + product.price);
    }
    else{
        sessionStorage.setItem('totalCost', product.price);
    }
}

// Display cart 
function displayCart(){
    let cartItems = sessionStorage.getItem('productsInCart');
    let cartDisplay = document.getElementById('cartDisplay');
    let subTotal = document.getElementById('bottom');
    cartItems = JSON.parse(cartItems);
    let cartCost = parseFloat(sessionStorage.getItem('totalCost'));
    

    if (cartItems){
        cartDisplay.innerHTML = '';
        Object.values(cartItems).map(item =>{
            cartDisplay.innerHTML += `<li title="${item.tag}">
                <p>${item.name}</p>
                <input type="number" value="${item.inCart}" onchange="updateItem(event)">
                <button onclick="removeItem(event)"><span class="fas fa-times"></span></button>
                <p>${item.price * item.inCart} </p>
            </li>`;
        });
        subTotal.innerHTML = ` <h4>SubTotal: R<span>${cartCost}</span></h4>
        <a href="#checkOut.html" class="btn">Check Out</a>
        `;
    }
}
//Make cart visible
function cartVisible(){
    let cart = document.getElementById('cart');
    cart.style.display = 'block';
}
//Hide cart
function cartHidden(){
    let cart = document.getElementById('cart');
    cart.style.display = 'none';
}
//Remove item from cart
function removeItem(e){
    let itemTitle = e.target.parentElement.parentElement.title;
    let totalItemCost = e.target.parentElement.parentElement.children[3].innerText;
    e.target.parentElement.parentElement.remove();
    let productsInCart =  JSON.parse(sessionStorage.getItem('productsInCart'));
    delete productsInCart[itemTitle];
    sessionStorage.setItem('productsInCart', JSON.stringify(productsInCart));
    
    for (let i=0; i < products.length; i++){
        if (products[i].tag == itemTitle){
            products[i].inCart = 0;
        }
    }

    updateTotalCost(totalItemCost);
    
}     
 // Update cost
function updateTotalCost(totalItemCost){
    let bottom = document.getElementById('bottom');
    let currentTotal = bottom.children[0].children[0].innerText;
    bottom.children[0].children[0].innerText = parseFloat(currentTotal) - parseFloat(totalItemCost);
    let sessionTotalCost = sessionStorage.getItem('totalCost');
    sessionStorage.setItem('totalCost', parseFloat(sessionTotalCost) - parseFloat(totalItemCost));
}
//Update item cost
function updateItem(e){
    let newQty = e.target.value;
    let itemTitle = e.target.parentElement.title;
    
    let productsInCart = JSON.parse(sessionStorage.getItem('productsInCart'));
    productsInCart[itemTitle].oldQty = productsInCart[itemTitle].inCart;
    productsInCart[itemTitle].inCart = newQty;
    let productPrice = productsInCart[itemTitle].price;

    let newQtyAdded = newQty - productsInCart[itemTitle].oldQty;
    let newPriceToAdd = newQtyAdded * productPrice;
    console.log(newPriceToAdd);
    sessionStorage.setItem('productsInCart', JSON.stringify(productsInCart));
    let currentTotal = parseFloat(sessionStorage.getItem('totalCost'));
    currentTotal += newPriceToAdd;
    sessionStorage.setItem('totalCost', currentTotal);

    let bottom = document.getElementById('bottom');
    let currentTotalOnCart = bottom.children[0].children[0].innerText;
    bottom.children[0].children[0].innerText = currentTotal;

    e.target.parentElement.children[3].innerText = productPrice * newQty;
}



displayCart();

