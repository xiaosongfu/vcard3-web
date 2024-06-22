<script setup lang="ts">
import {computed, onBeforeMount, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {API_HOST} from "../apis/constant.ts";
import {OnekeyCard} from "../apis/types.ts";
import {NGrid, NGridItem, NModal, NCard, NButton} from "naive-ui";

// ------ ------ ------ ------ ------ ------ ------ ------ ------

const router = useRouter();

const cards = ref<[OnekeyCard]>();

const showNewCard = ref(false);
const newCardAddress = computed(() => {
  return localStorage.getItem("USER_TRANSFER_WALLET");
});

// ------ ------ ------ ------ ------ ------ ------ ------ ------

onBeforeMount(async () => {
  // check if user has login
  const token = localStorage.getItem("TOKEN");
  console.log("token: ", token)
  if (!token || token === "") {
    await router.push("/login");
  }
});

onMounted(async () => {
  await getCards();
});

async function getCards(){
  const token = localStorage.getItem("TOKEN");

  // get user's cards
  const resp = await fetch(`${API_HOST}/api/card/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    }
  });
  const data: [OnekeyCard] = await resp.json();
  console.log('cards: ', data);
  cards.value = data;
}

async function goToCard(card: OnekeyCard) {
  console.log("goToCard: ", card);
  await router.push({
    path: "/card",
    query: {
      gmail: 'xs',// TODO card.gmail,
      card_id: card.card_id,
      transfer_wallet: card.transfer_wallet,
    }
  });
}

function showNewCardModal() {
  showNewCard.value = true;
}

async function newCard() {
  const token = localStorage.getItem("TOKEN");

  // create new card
  const resp = await fetch(`${API_HOST}/api/card/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    }
  });
  const data: [OnekeyCard] = await resp.json();
  console.log('new-card: ', data);

  // hide modal
  showNewCard.value = false;

  // refresh cards
  await getCards();
}
</script>

<template>
  <div>
    <n-grid :x-gap="12" :y-gap="8" :cols="4">
      <n-grid-item v-for="card in cards" :key="card.card_id" @click="goToCard(card)">
        <div class="light-green">
          <p>{{ card.network }}</p>
          <p>{{ card.bin }}...{{card.last4}}</p>
        </div>
      </n-grid-item>
      <n-grid-item @click="showNewCardModal()" >
        <div class="green">
          <p>创建新卡片</p>
          <h2>+</h2>
        </div>
      </n-grid-item>
    </n-grid>
  </div>


  <n-modal v-model:show="showNewCard" class="new_card">
    <n-card>
      <p>Transfer USDT to: <span style="color: #646cff">{{newCardAddress}}</span> on <span style="font-size: 20px">polygon</span></p>

      <n-button type="success" @click="newCard()">转账完成，确认开卡</n-button>
    </n-card>
  </n-modal>
</template>

<style scoped>
.light-green {
  height: 108px;
  width: 128px;
  border: #535bf2 solid 2px;
  background-color: rgba(0, 128, 0, 0.12);
  text-align: center;
}
.green {
  height: 108px;
  width: 128px;
  border: green solid 2px;
  background-color: rgba(0, 128, 0, 0.24);
}

</style>
