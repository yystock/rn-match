import { Image, View, StyleSheet } from "react-native";
import { thumbnail } from "../../utils/utils";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/initSupabase";

function Thumbnail({ url, size, download = true }: { url: string; size: number; download?: boolean }) {
  const avatarSize = { height: size, width: size };
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  async function downloadImage(path: string) {
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
  useEffect(() => {
    if (url && download) {
      downloadImage(url);
    } else {
      setAvatarUrl(url);
    }
  }, [url]);

  return avatarUrl ? (
    <Image source={{ uri: avatarUrl }} accessibilityLabel="Avatar" style={[avatarSize, styles.avatar, styles.image]} />
  ) : (
    <View style={[avatarSize, styles.avatar, styles.noImage]} />
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
    overflow: "hidden",
  },
  noImage: {
    backgroundColor: "#333",
    border: "1px solid rgb(200, 200, 200)",
    borderRadius: 100,
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
});

export default Thumbnail;
