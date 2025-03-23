import Urls from "./urls";
async function getNotebooks(id: string) {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = new URL(Urls.getNotebooks);
  url.searchParams.append("id", id);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data); // Log the entire data object to inspect the structure
    return data; // Assuming data is an array of notebooks
  } catch (error) {
    console.error("Error:", error);
    return []; // Return an empty array in case of error
  }
}

async function getNotebooksForPlay(id: string) {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = new URL(Urls.getNotebooksForPlay);
  url.searchParams.append("id", id);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data); // Log the entire data object to inspect the structure
    console.log(data);
    return data; // Assuming data is an array of notebooks
  } catch (error) {
    console.error("Error:", error);
    return []; // Return an empty array in case of error
  }
}

async function addNotebook(payload: Object) {
  const response = await fetch(Urls.addNotebook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response;
}

async function deleteNotebook(payload: Object) {
  const response = await fetch(Urls.deleteNotebook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response;
}

export { getNotebooks, addNotebook, getNotebooksForPlay, deleteNotebook };
