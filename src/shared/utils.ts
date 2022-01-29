export async function processFetchResponse(r: Response) {
  if (r.status === 200) {
    return r.json();
  }

  return Promise.reject({
    status: r.status,
    message: await r.text(),
  });
}
