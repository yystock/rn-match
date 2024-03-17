import { supabase } from "./initSupabase";

// import profilePlaceholder from "../assets/placeholder.png";
export function getAge(birthday: string | null) {
  if (!birthday) return null;
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export function thumbnail(url: string) {
  if (!url) {
    return "https://gravatar.com/avatar/381c19d42398ff231bb6f393996e1d9c?s=400&d=robohash&r=x";
    // profilePlaceholder;
  }
  return url;
  // uri: "http://" + ADDRESS + url,
}

export function convertMetersToKilometers(meters: number): number {
  const kilometers = meters / 1000;
  return Number(kilometers.toFixed(3)); // Keep three decimal places
}

export async function getDownloadImage(path: string, setAvatarUrl: (url: string) => void) {
  try {
    const { data, error } = await supabase.storage.from("avatars").download(path);

    if (error) {
      throw error;
    }

    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      setAvatarUrl(fr.result as string);
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error downloading image: ", error.message);
    }
  }
}
