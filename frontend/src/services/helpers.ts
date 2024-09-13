export const BACKEND_URL: string = import.meta.env.VITE_REACT_BACKEND_URL || '';

export const parseJSON = async (url: string, options: any) => {
  const response = await fetch(url, options);
  const data = await response.json();

  if (data.message) {
    throw new Error(data.message);
  }

  return data;
};
