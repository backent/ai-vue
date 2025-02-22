const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

function _getHeaders(headers) {
  return {
    ...defaultHeaders,
    ...headers,
    "Authorization": localStorage.getItem("_auth_token")
  }
}

function _objectToQueryString(obj, prefix) {
  const str = [];
  for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
          const k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
          str.push((v !== null && typeof v === "object") ?
              objectToQueryString(v, k) :
              encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
  }
  return str.join("&");
}

function _replaceUrlPlaceholders(url, params) {
  return url.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
      return params[key] !== undefined ? params[key] : `:${key}`;
  });
}


function _buildUrl(url, params, body = {}) {
  return `${_replaceUrlPlaceholders(url, { ...body, ...params })}?${_objectToQueryString(params)}`
}


async function _interceptor(response) {
  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/login"
    }
    const error = new Error(`HTTP error! Status: ${response.status}`);
    error.status = response.status;
    error.statusText = response.statusText;

    // If response has JSON body with error details
    try {
        const errorDetails = await response.json();
        error.details = errorDetails;
    } catch (e) {
        // No JSON body or failed to parse JSON
        error.details = await response.text();
    }

    throw error;
  }

return response.json();
}


async function getApi(url, params, body = {}) {
  const newUrl = _buildUrl(url, params, body)
  return fetch(
    newUrl,
    {
      headers: _getHeaders()
    }
  )
    .then(_interceptor)
}

async function postApi(url, body, params = {}) {
  const newUrl = _buildUrl(url, params)

  return fetch(
    newUrl,
    {
      method: 'POST',
      headers: _getHeaders(),
      body: JSON.stringify(body)
    }
  )
    .then(_interceptor)
}

async function postFormApi(url, bodyFormData, params = {}) {
  const newUrl = _buildUrl(url, params)

  return fetch(
    newUrl,
    {
      method: 'POST',
      headers: {
        "Authorization": localStorage.getItem("_auth_token")
      },
      body: bodyFormData
    }
  )
    .then(_interceptor)
}

async function putApi(url, body, params = {}) {
  const newUrl = _buildUrl(url, params, body)

  return fetch(
    newUrl,
    {
      method: 'PUT',
      headers: _getHeaders(),
      body: JSON.stringify(body)
    }
  )
    .then(_interceptor)
}

async function deleteApi(url, body, params = {}) {
  const newUrl = _buildUrl(url, params, body)

  return fetch(
    newUrl,
    {
      method: 'DELETE',
      headers: _getHeaders(),
      body: JSON.stringify(body)
    }
  )
    .then(_interceptor)
}

function postFormApiWithProgress(url, bodyFormData, params = {}, onProgress = (percent) => {}) {
  const newUrl = _buildUrl(url, params);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', newUrl, true);

    // Set up headers
    const headers = {
      "Authorization": localStorage.getItem("_auth_token")
    };

    for (const header in headers) {
      if (headers.hasOwnProperty(header)) {
        xhr.setRequestHeader(header, headers[header]);
      }
    }

    // Track progress
    xhr.upload.onprogress = function(event) {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    };

    // Handle successful response
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        // Handle error response
        const error = new Error(`HTTP error! Status: ${xhr.status}`);
        error.status = xhr.status;
        error.statusText = xhr.statusText;

        try {
          error.details = JSON.parse(xhr.responseText);
        } catch (e) {
          error.details = xhr.responseText;
        }

        reject(error);
      }
    };

    // Handle network error
    xhr.onerror = function() {
      reject(new Error('Network error'));
    };

    // Send the FormData
    xhr.send(bodyFormData);
  });
}

export default {
  getApi,
  postApi,
  putApi,
  postFormApi,
  deleteApi,
  postFormApiWithProgress
}