import { toast as t } from "react-hot-toast";

export type ServerActionResponse<T = unknown> = {
  error?: string;
  data?: T | undefined;
};

type ToastMessage = {
  success?: string;
  error?: string | ((error: unknown) => string);
  loading?: string;
};

const defaultMessage = {
  success: "Success",
  error: "Upsss... Something went wrong!",
  loading: "Please wait...",
};

const success = (message: string = defaultMessage.success) => {
  return t.success(message);
};

const error = (message: string = defaultMessage.error) => {
  return t.error(message);
};

const loading = (message: string = defaultMessage.loading) => {
  return t.loading(message);
};
const loadingWithTimeout = (
  message: string = defaultMessage.loading,
  timeout: number = 3000,
) => {
  return t.loading(message, { duration: timeout });
};

const promise = async <T>(
  promise: (() => Promise<T>) | Promise<T>,
  msg?: ToastMessage,
) => {
  const p = typeof promise == "function" ? promise() : promise;
  return t.promise(p, {
    success: msg?.success ?? defaultMessage.success,
    loading: msg?.loading ?? defaultMessage.loading,
    error: (error) => {
      if (typeof msg?.error == "function") {
        return msg.error(error);
      }
      return error.message ?? msg?.error ?? defaultMessage.error;
    },
  });
};

const promiseAction = <T>(
  promise:
    | (() => Promise<ServerActionResponse<T>>)
    | Promise<ServerActionResponse<T>>,
  msg?: ToastMessage,
) => {
  return t.promise(
    (async () => {
      const response = await (typeof promise == "function"
        ? promise()
        : promise);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as T;
    })(),
    {
      success: msg?.success ?? defaultMessage.success,
      error: (error) => {
        if (typeof msg?.error == "function") {
          return msg.error(error);
        }
        return error.message ?? msg?.error ?? defaultMessage.error;
      },
      loading: msg?.loading ?? defaultMessage.loading,
    },
  );
};

const dismiss = (id: string) => {
  return t.dismiss(id);
};

const toast = {
  success,
  error,
  loading,
  loadingWithTimeout,
  promise,
  promiseAction,
  dismiss,
};

export default toast;
