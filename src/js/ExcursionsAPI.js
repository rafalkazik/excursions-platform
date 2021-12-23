class ExcursionsAPI {
  constructor() {
    this.excursionsUrl = "http://localhost:3000/excursions";
    this.ordersUrl = "http://localhost:3000/orders";
  }

  loadData() {
    return fetch(this.excursionsUrl).then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      return Promise.reject(resp);
    });
  }

  addData(data) {
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };

    return fetch(this.excursionsUrl, options).then((resp) => console.log(resp));
  }

  removeData(id) {
    const options = { method: "DELETE" };
    return fetch(`${this.excursionsUrl}/${id}`, options).then((resp) =>
      console.log(resp)
    );
  }

  updateData(id, data) {
    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };

    return fetch(`${this.excursionsUrl}/${id}`, options).then((resp) =>
      console.log(resp)
    );
  }

  addOrder(data) {
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };

    return fetch(this.ordersUrl, options).then((resp) => console.log(resp));
  }
}

export default ExcursionsAPI;
