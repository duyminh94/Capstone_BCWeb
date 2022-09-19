
function apiGetProduct() {
  return axios({
    url: "https://62f50948535c0c50e768499f.mockapi.io/apiProducts",
    method: "GET",
  });
}

function apiGetProductById (productId) {
    return axios({
        url: `https://62f50948535c0c50e768499f.mockapi.io/apiProducts/${productId}`,
        method: "GET",
      });
}

