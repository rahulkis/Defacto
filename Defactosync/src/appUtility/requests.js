import fetch from "isomorphic-fetch";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  OPTIONS: "",
};

export function post(url, data) {
  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  }).then((response) => response);
}

export function get(url) {
  return fetch(url, {
    method: "GET",
    headers,
  }).then((response) => response.json());
}

export function PostData(url, userData) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PostDataWithHeader(url, headers, userData) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PutDataWithHeader(url, headers, userData) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PostDataWithoutJson(url, userData) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: userData,
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PostDataWithoutBody(url, userData) {
  url = url + new URLSearchParams(userData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PostDataWithBody(url, userData) {
  //let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: userData,
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });

  //  return fetchJsonp(url,  {
  //     method: 'POST',
  //     body:userData
  // }, function (err, data) {
  //
  //   if (err) {
  //     console.error(err.message);
  //   } else {
  //     console.log(data);
  //   }
  // });
}
export function GetData(url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function DeleteForm(url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function UpdateData(url, userData) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function Delete(url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function GetDataWithHeader(url, headers) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PostDataWithHeaderWithoutJson(url, headers, userData) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: headers,
      body: userData,
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PostDataCorsWithBody(url, userData) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PostDataIntegation(url, userData) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: userData,
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function GetDataIntegration(url, headers) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PutFileWithHeader(url, userData) {
  return new Promise((resolve, reject) => {
    const myHeaders = {
      'Content-Type': userData.type     
    }
    ;
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: userData,
    };
    ;

    fetch(url, requestOptions)
      .then((response) => response)
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function GetFileAWS(url) {
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: "GET",
    };
    fetch(url, requestOptions)
      .then((response) => response.blob())
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function GetImageAWS(url) {
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: "GET",
    };
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function DeleteImageAWS(url) {
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: "DELETE",
    };
    fetch(url, requestOptions)
      .then((response) => response)
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
