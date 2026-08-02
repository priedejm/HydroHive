const HYDRO_HIVE_API_URL = "https://ludo.pythonanywhere.com/contactEmailHydroHive";

type ContactEmailPayload = {
  name: string;
  email: string;
  number: string;
  subject: string;
  content: string;
};

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const res = await fetch(HYDRO_HIVE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok || !text.toLowerCase().includes("success")) {
    throw new Error(text || `Request failed with status ${res.status}`);
  }
}
