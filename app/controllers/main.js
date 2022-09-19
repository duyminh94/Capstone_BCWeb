function dom(selector) {
  return document.querySelector(selector);
}
const productList = new ProductList();
//==============================================================================================
function SetItem() {
  const stringify = JSON.stringify(productList.arrListCart);
  localStorage.setItem("data", stringify);
}

function GetItem() {
  const stringify = localStorage.getItem("data");
  productList.arrListCart = stringify ? JSON.parse(stringify) : [];
}
GetItem();
//==============================================================================================

/* Lấy Thông Tin Api */

function GetProduct() {
  apiGetProduct()
    .then((response) => {
      console.log(response.data);
      arrproducts = [...response.data]
      displayProduct(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

GetProduct();

//=======================================================================================================
function displayProduct(products) {
  let html = products.reduce((output, product) => {
    return (output += `
          <div class=" my-3 cart-item col-lg-3 col-md-4 col-sm-6">
                      <div class="card text-center">
                          <div class="card-img">
                            <span class="type-label hot">Hot</span>
                             <p class="stocks">Minh Thanh</p>
                              <img src="${product.img}" class="phoneImg" alt="">
              <div class="card-cart d-flex  justify-content-around">
                  <button type="button" class="btn-card-detail btn btn-info" data-toggle="modal"
                      data-target="#myModal" onclick="reviewProduct(${product.id})">Thông Tin Sản Phẩm</button>
                  <button type="button" class="btn-card-cart btn btn-success" onclick="AddtoCarts(event)"
                      data-action="${product.id}">Thêm Vào Giỏ Hàng</button>
              </div>
          </div>
          <div class="card-body">
              <h5 class="card-title my-2 phoneName">${product.name}</h5>
              <p class="card-text my-2"> <sup class="text-warning"><i class="fa-2x fa-solid fa-money-bill"></i></sup><span class="phonePrice">${product.price}VND</span></p>
          </div>
      </div>
  </div>
          `);
  }, "");
  dom("#showSmart").innerHTML = html;
}

/* Phân Loại Sản Phẩm */
function displayTypePhone(typeproduct) {
  productList.arrproducts = arrproducts.filter((item) => {
  // console.log(item)
  return item.type === typeproduct || "All" === typeproduct;
 })
// console.log(typeproduct)
 displayProduct(productList.arrproducts)
}

// hiển thị thông tin product lên mô tả sản phẩm

function reviewProduct(productId) {
  apiGetProductById(productId)
    .then((response) => {
      // console.log(response)
      dom("#phonePrice").innerHTML = response.data.price + "VND";
      dom("#phoneScreen").innerHTML = response.data.screen;
      dom("#phoneBack").innerHTML = response.data.blackCamera;
      dom("#phoneFont").innerHTML = response.data.frontCamera;
      dom("#phoneDesc").innerHTML = response.data.desc;
      
    })
    .catch((error) => {
      console.log(error);
    });
}

function AddtoCarts(event) {
  console.log("Add", event.target);
  alert("Sản phẩm của bạn đã được thêm vào giỏ hàng")
  const DomCart = event.target.closest(".cart-item");
  const IdCartItem = event.target.getAttribute("data-action");
  const ImgCart = DomCart.querySelector(".phoneImg").src;
  const CartName = DomCart.querySelector(".phoneName").innerHTML;
  const CartPrice = DomCart.querySelector(".phonePrice").innerHTML;
  const CartQty = 1;

  const cartItem = new CartItem(
    IdCartItem,
    CartName,
    CartPrice,
    ImgCart,
    CartQty
  );
  console.log("CartItem", cartItem);
  productList.addCart(cartItem);
  displayCartList(productList.arrListCart);
  QtyNumCart();
  SetItem();
}

/* Render hiển thị danh sách */

function displayCartList() {
  SetItem();
  productList.arrListCart = megerStorage(productList.arrListCart);
  // console.log("CartList",productList.arrListCart)
  let paysum = 0;
  let html = productList.arrListCart.reduce((output, product) => {
    const price = parseInt(product.price);
    const qty = parseInt(product.qty);
    const priceTotal = price * qty;
    paysum += priceTotal;
    return (output += `
                <tr>
                    <td class="w-25">
                        <img src="${product.img}" class="img-fluid img-thumbnail phoneImg" alt="${product.img}" />
                    </td>
                    <td class="phoneName">${product.name}</td>
                    <td><span class="phonePrice">${product.price}</span></td>
                    <td class="qty"><input class="phoneQty" type="number" class="form-control" min=1 max=10 value="${qty}" onchange="checkQty(event)" data-action="${product.id}"></td>
                    <td>${priceTotal}VND</td>
                    <td>
                        <a href="#" id="btnCloseCart" class="btn btn-danger btn-sm" onclick="removeItem('${product.id}')">
                            <i class="fa fa-times"></i>
                        </a>
                    </td>
                </tr>
            `);
  }, "");
  paysum = paysum.toLocaleString("de-DE") + "VND";
  console.log("Total Sản Phẩm", paysum.toLocaleString("de-DE"));
  dom("#GetPay").innerHTML = paysum;
  dom("#tbodyInSmart").innerHTML = html;
  checkCartEmpty();
}

dom("#headercart").addEventListener("click", () => {
  displayCartList();
});

/* Xử lý trùng id */

function megerStorage(arr) {
  productList.arrListCart = [];
  arr.forEach((product) => {
    let el = productList.arrListCart.find(
      (NewEl) => NewEl.name == product.name
    );
    if (el) {
      el.qty += product.qty;
    } else {
      productList.arrListCart.push(product);
    }
  });
  return productList.arrListCart;
}

/* Render số lượng sản Phẩm */

function QtyNumCart() {
  SetItem();
  productList.arrListCart = megerStorage(productList.arrListCart);
  let total = 0;
  for (let i = 0; i < productList.arrListCart.length; i++) {
    total += +productList.arrListCart[i].qty;
  }
  if (total > 1) {
    dom("#TotalQty").classList.remove("inactive");
    dom("#TotalQty").innerHTML = total;
  } else {
    dom("#TotalQty").classList.add("inactive");
  }
}

QtyNumCart();

function checkCartEmpty() {
  if (productList.arrListCart == 0) {
    dom("#btnCheckOut").disabled = true;
    dom("#titleListCart").innerHTML =
      "Có vẻ như quý khách chưa chọn mục yêu thích của mình";
  } else {
    dom("#btnCheckOut").disabled = false;
    dom("#titleListCart").innerHTML = "Giỏ Hàng Của Quý Khách";
  }
}

function getFormValue(event) {
  const cartDom = event.target.closest("tr");
  const cartId = event.target.getAttribute("data-action");
  const cartImg = cartDom.querySelector(".phoneImg").getAttribute("alt");
  const cartName = cartDom.querySelector(".phoneName").innerHTML;
  const cartPrice = cartDom.querySelector(".phonePrice").innerHTML;
  const cartQty = cartDom.querySelector(".phoneQty").value;
  return (item = new CartItem(cartId, cartName, cartPrice, cartImg, cartQty));
}

// Xoá item trong cart list
function removeItem(id) {
  productList.deleteItem(id);
  if (productList.arrListCart.length == 0) {
    dom("#closeListCart").value;
    dom("#TotalQty").classList.add("inactive");
    location.reload();
  }
  displayCartList();
  QtyNumCart();
}

function checkQty(event) {
  const cartItem = getFormValue(event);
  productList.updateItem(cartItem);
  displayCartList();
  QtyNumCart();
}

function CheckOut() {
  dom("#closeListCart").value;
  let html = "";
  let paysum = 0;
  productList.arrListCart.forEach((product) => {
    const price = parseInt(product.price);
    const qty = parseInt(product.qty);
    const priceTotal = price * qty;
    paysum += priceTotal;
    html += `
        <tr class="text-info">
            <td>${product.name}</td>
            <td>${product.qty}</td>
            <td>${priceTotal}VND</td>
        </tr>
        `;
  });
  paysum = paysum.toLocaleString("de-DE") + "VND";
  dom("#paysumPurchase").innerHTML = paysum;
  dom("#contentPurchase").innerHTML = html;
}

/* Tiếp tục mua hàng sau khi kết thúc đặt hàng */
function Confirmorder() {
  productList.arrListCart = [];
  localStorage.removeItem("data");
  dom("#ContinueShopping").value;
  dom("#TotalQty").classList.add("inactive");
  location.reload();
}
//===========================================================================
