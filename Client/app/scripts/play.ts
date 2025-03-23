import Urls from "./urls";

async function getPlayDeck(id: string) {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = new URL(Urls.playDeck);
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

async function saveGameScores(data: any) {
  try {
    const response = await fetch(Urls.saveGame, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response) {
      return response;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getGameScores(data: any) {
  const url = new URL(Urls.getGameScores);
  url.searchParams.append("id", data);
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
    });
    const rData = await response.json();
    console.log(rData);
    return rData;
  } catch (err) {
    console.error(err);
  }
}

export { getPlayDeck, saveGameScores, getGameScores };
