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
