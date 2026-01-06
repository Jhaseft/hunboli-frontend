// test.api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createuser(userdata:  {
  name: number;//cambiar a string si quieres que funcione lo hice por el dto nomas
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userdata),
  });
  
  return res.json();
}