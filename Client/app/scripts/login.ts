async function getUserOrCreate(
  name: string,
  email: string,
  session: null | object
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const payload = {
    name: name,
    email: email,
  };
  try {
    const response = await fetch(apiUrl + "/user/id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (session) {
      const data = await response.json();
      // console.log("User ID:", data.id);
      return data.id;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export default getUserOrCreate;
