class ProductList {
  arrproducts = [];
  arrListCart = [];

  addCart(item) {
    this.arrListCart.push(item);
  }

  /* Xóa item trong giỏ hàng */
  deleteItem(id) {
  
    this.arrListCart = this.arrListCart.filter((product) => product.id !== id);
  }

  updateItem(item) {
     this.arrListCart = this.arrListCart.map((product) => {
      return product.id === item.id ? item : product;
    });
  }
}
