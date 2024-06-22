<script setup lang="ts">
import { BrowserProvider, getAddress } from "ethers";
import { SiweMessage } from "siwe";
import {useRouter} from "vue-router";
import {API_HOST} from "../apis/constant.ts";
import { NButton } from 'naive-ui';

// ------ ------ ------ ------ ------ ------ ------ ------ ------

const router = useRouter();

// @ts-ignore
const provider: BrowserProvider = new BrowserProvider(window.ethereum);

// ------ ------ ------ ------ ------ ------ ------ ------ ------

async function login() {
  const accounts: string[] = await provider.send("eth_requestAccounts", []);
  console.log("accounts: ", accounts);

  const chainId: number = await provider.send("eth_chainId", []);
  console.log("chainId: ", chainId);

  // prepare message
  const wallet = accounts[0];
  const nonce = "FAKENONCE"; //await getNonce(wallet);
  const message = new SiweMessage({
    domain: window.location.host,
    address: getAddress(wallet),
    statement: "Sign in with Ethereum to vcard3",
    uri: window.location.origin,
    version: "1",
    chainId,
    nonce,
  }).prepareMessage();

  // sign message
  const signature = await (await provider.getSigner()).signMessage(message);
  console.log("message: ", message);
  console.log("signature: ", signature);

  // call `login` api
  const resp = await fetch(`${API_HOST}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wallet: "0x1111", // TODO,
      message,
      signature,
    }),
  });
  const loginResp: { wallet: string, transfer_wallet: string } = await resp.json();
  console.log('loginResp: ', loginResp);

  // save token to localStorage
  localStorage.setItem("TOKEN", loginResp.wallet);
  localStorage.setItem("USER_WALLET", loginResp.wallet);
  localStorage.setItem("USER_TRANSFER_WALLET", loginResp.transfer_wallet);

  //
  await router.replace("/");
}
</script>

<template>
  <n-button type="success" @click="login()">Connect Wallet</n-button>
</template>

<style scoped>

</style>
