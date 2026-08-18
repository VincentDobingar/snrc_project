export function ok(res, message, data = null, status = 200) {
  return res.status(status).json({ success: true, message, data });
}
