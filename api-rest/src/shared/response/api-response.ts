/**
 * Helper untuk membentuk respon sukses secara konsisten.
 */

export function successApiResponse<T>(data: T, message?: string) {
  return {
    success: true,
    ...(message ? { message } : {}),
    data,
  };
}

/**
 * Helper untuk membentuk respon gagal secara konsisten.
 */

export function failResponse(message: string, errors?: unknown) {
  return {
    success: false,
    message,
    ...(errors ? { errors } : {})
  };
}
