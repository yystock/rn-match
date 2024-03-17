import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { FileObject } from "@supabase/storage-js";

import { supabase } from "../utils/initSupabase";
import { useAuth } from "./providers/AuthProvider";
import { Icon, Button } from "./ui";

interface Props {
  size: number;
  url: string | null;
  onUpload?: (filePath: string) => void;
  display?: boolean;
}

export default function Avatar({ url, size = 150, onUpload, display = false }: Props) {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<FileObject[]>([]);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

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

  async function uploadAvatar() {
    if (!onUpload) return;
    try {
      setUploading(true);

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled) {
        const img = result.assets[0];
        if (!img) throw new Error("No image selected");

        const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: "base64" });
        const filePath = `${user!.id}/${new Date().getTime()}.${img.type === "image" ? "png" : "mp4"}`;
        const contentType = img.type === "image" ? "image/png" : "video/mp4";
        await supabase.storage.from("avatars").upload(filePath, decode(base64), { contentType });

        onUpload(filePath);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} accessibilityLabel="Avatar" style={[avatarSize, styles.avatar, styles.image]} />
        ) : (
          <View style={[avatarSize, styles.avatar, styles.noImage]} />
        )}
        {display && (
          <Button icon onPress={uploadAvatar} variant="outline" style={styles.fab}>
            <Icon name="camera-outline" size={28} />
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    borderRadius: 100,
    overflow: "hidden",
    maxWidth: "90%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: "#333",
    border: "1px solid rgb(200, 200, 200)",
    borderRadius: 100,
  },
  fab: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    position: "absolute",
    bottom: -10,
    right: 0,
    height: 56,
    borderRadius: 100,
  },
});
