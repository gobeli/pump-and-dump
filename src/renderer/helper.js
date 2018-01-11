export function handleResponse(data, err, $this) {
  if (err) {
    $this.$message({
      message: err.message,
      type: 'error',
    });
    throw err;
  }
  return data && data.result || null;
}

export function handleError($this) {
  return err => {
    $this.$message({message: err.message, type: 'error'});
  }
}

export const storePrefix = 'pump_and_dump_';

export function getApiKey() {
  return localStorage.getItem(`${storePrefix}APIKEY`);
}

export function setApiKey(key) {
  if (!key) {
    localStorage.removeItem(`${storePrefix}APIKEY`);
  } else {
    localStorage.setItem(`${storePrefix}APIKEY`, key);
  }
}

export function getApiSecret() {
  return localStorage.getItem(`${storePrefix}APISECRET`);
}

export function setApiSecret(secret) {
  if (!secret) {
    localStorage.removeItem(`${storePrefix}APISECRET`);
  } else {
    localStorage.setItem(`${storePrefix}APISECRET`, secret);
  }
}

export function getExchange() {
  return localStorage.getItem(`${storePrefix}EXCHANGE`);
}

export function setExchange(exchange) {
  if (!exchange) {
    localStorage.removeItem(`${storePrefix}EXCHANGE`);
  } else {
    localStorage.setItem(`${storePrefix}EXCHANGE`, exchange);
  }
}

export function initExchange(store) {
  const exchange = getExchange(), key = getApiKey(), secret = getApiSecret();
  if (exchange && key && secret) {
    store.commit('SET_EXCHANGE', { key, secret, exchange });
  }
}