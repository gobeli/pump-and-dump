export function handleResponse(data, err, $this) {
  if (err) {
    $this.$bus.$emit('error', err);
    throw err;
  }
  return data && data.result || null;
}