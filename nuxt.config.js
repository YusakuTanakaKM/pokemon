import { defineNuxtConfig } from "nuxt/config";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ["animate.css"],
  runtimeConfig: {
    region: "eu-west-2",
    bucketName: "kmsd04-pokemon",
    public: {
      backendOrigin: undefined,
    },
  },
});
