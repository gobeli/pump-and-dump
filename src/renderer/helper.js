export function handleResponse(data, err, $this) {
  if (err) {
    $this.$message({
      message: err,
      type: 'error',
    });
    throw err;
  }
  return data && data.result || null;
}
