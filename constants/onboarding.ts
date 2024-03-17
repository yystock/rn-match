import { AnimationObject } from "lottie-react-native";

export interface OnboardingType {
  id: number;
  animation: AnimationObject;
  text: string;
  title: string;
}

const data: OnboardingType[] = [
  {
    id: 1,
    animation: require("../assets/animation/animation9.json"),
    title: "Perfect Pair: AI Powered Matchmaking",
    text: "AI matchmaking assistant analyze your characteristics and preferences, creating meaningful matches tailed just for you.",
  },
  {
    id: 2,
    animation: require("../assets//animation/animation1.json"),
    text: "We aim to bring the world closer as you connect with kindred spirits, regardless of distance, race and gender.",
    title: "No Boundaries: Meet anyone, anywhere",
  },
  {
    id: 3,
    animation: require("../assets//animation/animation6.json"),
    text: "Personalized relationship tips and suggestions to your unique connection. we'll accompany your lifelong love journey.",
    title: "Forever Love: Always be there for you",
  },
];

export default data;
