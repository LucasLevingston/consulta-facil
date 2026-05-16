// src/lib/fetchPostJSON.ts

export default async function fetchPostJSON(url: string, data: Record<string, any>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao fazer a requisição.");
  }

  return response.json();
}
